'use client'

import { useLsdProgram } from './lsd-data-access'
import { Button } from '@/components/ui/button'
import { Keypair } from '@solana/web3.js'

export function LsdCreate() {
    const { initialize, account } = useLsdProgram()

    // Only show create if no pool exists
    if (account.data && account.data.length > 0) return null;

    return (
        <Button onClick={() => initialize.mutateAsync(Keypair.generate())} disabled={initialize.isPending}>
            Initialize Liquid Staking Pool
        </Button>
    )
}
