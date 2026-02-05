'use client'

import { useLsdProgram, useLsdProgramAccount, useNativeBalance } from './lsd-data-access'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { motion } from 'framer-motion'
import { LsdStats } from './lsd-stats'
import { LsdStakingForm } from './lsd-staking-form'
import { LsdUserPosition } from './lsd-user-position'

export function LsdList() {
    const { account, getProgramAccount } = useLsdProgram()

    if (getProgramAccount.isLoading) {
        return <span className="loading loading-spinner loading-lg"></span>
    }
    if (!getProgramAccount.data?.value) {
        return (
            <div className="alert alert-info flex justify-center">
                <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
            </div>
        )
    }
    return (
        <div className={'space-y-6'}>
            {account.isLoading ? (
                <span className="loading loading-spinner loading-lg"></span>
            ) : account.data?.length ? (
                <div className="grid md:grid-cols-1 gap-4 max-w-4xl mx-auto">
                    {account.data?.map((account) => (
                        <LsdCard key={account.publicKey.toString()} account={account.publicKey} />
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <h2 className={'text-2xl'}>No Stake Pool</h2>
                    Initialize one above to get started.
                </div>
            )}
        </div>
    )
}

function LsdCard({ account }: { account: PublicKey }) {
    const { stakePoolQuery, userTokenBalanceQuery, stakeMutation, unstakeMutation } = useLsdProgramAccount({
        account,
    })
    const wallet = useWallet()
    const nativeBalanceQuery = useNativeBalance(wallet.publicKey)

    // Data from Chain
    const poolSolStr = stakePoolQuery.data?.totalSol.toString() ?? '0'
    const poolSharesStr = stakePoolQuery.data?.totalShares.toString() ?? '0'
    const userShares = userTokenBalanceQuery.data ?? 0
    const nativeBalance = (nativeBalanceQuery.data ?? 0) / LAMPORTS_PER_SOL

    // Calculations
    const poolSol = Number(poolSolStr) / LAMPORTS_PER_SOL
    const poolShares = Number(poolSharesStr) / LAMPORTS_PER_SOL

    // 1 soLSD = X SOL
    const exchangeRate = poolShares === 0 ? 1 : poolSol / poolShares

    // User Value in SOL
    const userValueSol = userShares * exchangeRate

    const isPending = stakeMutation.isPending || unstakeMutation.isPending

    return stakePoolQuery.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
    ) : (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
        >
            <LsdStats poolSol={poolSol} exchangeRate={exchangeRate} />

            <div className="grid md:grid-cols-3 gap-6">
                <LsdStakingForm
                    userShares={userShares}
                    nativeBalance={nativeBalance}
                    exchangeRate={exchangeRate}
                    onStake={async (amount) => {
                        await stakeMutation.mutateAsync(amount)
                    }}
                    onUnstake={async (amount) => {
                        await unstakeMutation.mutateAsync(amount)
                    }}
                    isPending={isPending}
                />
                <LsdUserPosition
                    userShares={userShares}
                    userValueSol={userValueSol}
                />
            </div>
        </motion.div>
    )
}
