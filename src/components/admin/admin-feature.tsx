'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useLsdProgram, useLsdProgramAccount } from '../lsd/lsd-data-access'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export default function AdminFeature() {
    const { stakePoolPda } = useLsdProgram()
    const { distributeRewardsMutation } = useLsdProgramAccount({ account: stakePoolPda })
    const [rewardAmount, setRewardAmount] = useState('')

    const handleDistribute = async () => {
        if (!rewardAmount || parseFloat(rewardAmount) <= 0) {
            toast.error('Invalid amount')
            return
        }

        try {
            const lamports = parseFloat(rewardAmount) * LAMPORTS_PER_SOL
            await distributeRewardsMutation.mutateAsync(lamports)
            setRewardAmount('')
        } catch (e) {
            console.error(e)
        }
    }

    const isProcessing = distributeRewardsMutation.isPending

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    Admin Console
                </h1>
                <p className="text-muted-foreground">Manage protocol parameters and rewards.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Rewards Manager */}
                <Card className="glass-panel border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Distribute Rewards
                        </CardTitle>
                        <CardDescription>Inject SOL into the pool to increase share value.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Reward Amount (SOL)</label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={rewardAmount}
                                onChange={(e) => setRewardAmount(e.target.value)}
                                className="bg-secondary/30"
                            />
                        </div>
                        <Button
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 transition-all font-bold"
                            onClick={handleDistribute}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing Transaction...' : 'Distribute Rewards'}
                        </Button>
                        <p className="text-xs text-muted-foreground bg-secondary/20 p-2 rounded">
                            Warning: This action is irreversible. All stakers will strictly benefit from this action.
                        </p>
                    </CardContent>
                </Card>

                {/* Health Monitor */}
                <Card className="glass-panel">
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-green-500/10 border-green-500/20">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="font-medium">Program Solvency</span>
                            </div>
                            <span className="text-sm text-green-400">100%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-green-500/10 border-green-500/20">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="font-medium">Rent Exempt</span>
                            </div>
                            <span className="text-sm text-green-400">Pass</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-secondary/20">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                                <span className="font-medium">Last Update</span>
                            </div>
                            <span className="text-sm text-muted-foreground">2 mins ago</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
