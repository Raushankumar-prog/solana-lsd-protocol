'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useLsdProgram } from './lsd-data-access'
import { LsdCreate, LsdList } from './lsd-ui'
import { AppHero } from '../app-hero'
import { ellipsify } from '@/lib/utils'

export default function LsdFeature() {
  const { publicKey } = useWallet()
  const { programId } = useLsdProgram()

  return publicKey ? (
    <div>
      <AppHero
        title="Liquid Staking Derivative"
        subtitle={
          'Stake SOL to receive liquid tokens (Shares). Unstake to burn shares and retrieve SOL.'
        }
      >
        <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <LsdCreate />
      </AppHero>
      <LsdList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
