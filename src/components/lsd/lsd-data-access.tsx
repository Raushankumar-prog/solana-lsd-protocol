'use client'

import { getLsdProgram, getLsdProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'
import * as anchor from '@coral-xyz/anchor'
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'

export function useNativeBalance(user: PublicKey | null) {
  const { connection } = useConnection()
  return useQuery({
    queryKey: ['nativeBalance', user?.toString()],
    queryFn: async () => {
      if (!user) return 0
      return connection.getBalance(user)
    },
    enabled: !!user,
  })
}

export function useLsdProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getLsdProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getLsdProgram(provider, programId), [provider, programId])

  const account = useQuery({
    queryKey: ['lsd', 'all', { cluster }],
    queryFn: () => program.account.stakePool.all(),
  })

  // Derive PDAs
  const [stakePoolPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('stake_pool')],
    programId
  )

  const [mintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('mint')],
    programId
  )

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['lsd', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .rpc(),
    onSuccess: async (signature) => {
      transactionToast(signature)
      await account.refetch()
    },
    onError: () => {
      toast.error('Failed to initialize account')
    },
  })

  return {
    program,
    programId,
    account, // Rename derived for clarity: fetches all pools (should only be 1)
    getProgramAccount,
    initialize,
    stakePoolPda,
    mintPda
  }
}

export function useLsdProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, mintPda } = useLsdProgram()
  const provider = useAnchorProvider()
  const { connection } = useConnection()

  const stakePoolQuery = useQuery({
    queryKey: ['lsd', 'fetch', { cluster, account }],
    queryFn: () => program.account.stakePool.fetch(account),
  })

  // User Token Account (ATA)
  const userTokenAccount = useMemo(() => {
    if (!provider.publicKey) return null
    return getAssociatedTokenAddressSync(
      mintPda,
      provider.publicKey
    )
  }, [provider.publicKey, mintPda])

  const userTokenBalanceQuery = useQuery({
    queryKey: ['lsd', 'tokenBalance', { cluster, user: provider.publicKey, mint: mintPda }],
    queryFn: async () => {
      if (!userTokenAccount) return 0
      try {
        const balance = await connection.getTokenAccountBalance(userTokenAccount)
        return balance.value.uiAmount || 0
      } catch (e) {
        return 0
      }
    },
    enabled: !!userTokenAccount
  })

  const stakeMutation = useMutation({
    mutationKey: ['lsd', 'stake', { cluster, account }],
    mutationFn: async (amount: number) => {
      if (!userTokenAccount) throw new Error("Wallet not connected")
      const bnAmount = new anchor.BN(amount)
      return program.methods.stake(bnAmount).rpc()
    },
    onSuccess: async (tx) => {
      transactionToast(tx)
      await stakePoolQuery.refetch()
      await userTokenBalanceQuery.refetch()
    },
  })

  const unstakeMutation = useMutation({
    mutationKey: ['lsd', 'unstake', { cluster, account }],
    mutationFn: async (amount: number) => {
      if (!userTokenAccount) throw new Error("Wallet not connected")
      const bnAmount = new anchor.BN(amount)
      return program.methods.unstake(bnAmount).rpc()
    },
    onSuccess: async (tx) => {
      transactionToast(tx)
      await stakePoolQuery.refetch()
      await userTokenBalanceQuery.refetch()
    },
  })

  const distributeRewardsMutation = useMutation({
    mutationKey: ['lsd', 'distributeRewards', { cluster, account }],
    mutationFn: async (amount: number) => {
      const bnAmount = new anchor.BN(amount)
      return program.methods.distributeRewards(bnAmount).rpc()
    },
    onSuccess: async (tx) => {
      transactionToast(tx)
      await stakePoolQuery.refetch()
    },
  })

  return {
    stakePoolQuery,
    userTokenBalanceQuery,
    stakeMutation,
    unstakeMutation,
    distributeRewardsMutation,
    mintPda, // useful for UI
  }
}
