'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useState } from 'react'

// Helper to format numbers
const fmt = (n: number, decimals = 2) => n.toLocaleString(undefined, { maximumFractionDigits: decimals })

export function LsdStakingForm({
    userShares,
    nativeBalance,
    exchangeRate,
    onStake,
    onUnstake,
    isPending
}: {
    userShares: number
    nativeBalance: number
    exchangeRate: number
    onStake: (lamports: number) => Promise<void>
    onUnstake: (lamports: number) => Promise<void>
    isPending: boolean
}) {
    const [solAmount, setSolAmount] = useState('')
    const [action, setAction] = useState<'stake' | 'unstake'>('stake')

    const inputVal = parseFloat(solAmount) || 0
    const estimatedOutput = action === 'stake'
        ? inputVal / exchangeRate
        : inputVal * exchangeRate

    const handleMax = () => {
        if (action === 'stake') {
            const safeBalance = Math.max(0, nativeBalance - 0.02) // Leave 0.02 SOL for gas
            setSolAmount(fmt(safeBalance, 4))
        } else {
            setSolAmount(fmt(userShares, 4))
        }
    }

    const handleAction = async () => {
        const lamports = Math.floor(inputVal * LAMPORTS_PER_SOL)
        if (lamports <= 0) {
            toast.error("Amount must be greater than 0")
            return
        }
        try {
            if (action === 'stake') {
                await onStake(lamports)
            } else {
                await onUnstake(lamports)
            }
            setSolAmount('')
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Card className="md:col-span-2 border-primary/20 bg-background/60 backdrop-blur-xl shadow-2xl shadow-primary/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <Tabs value={action} className="w-full" onValueChange={(val) => setAction(val as 'stake' | 'unstake')} suppressHydrationWarning>
                <CardHeader>
                    <div className="flex items-center justify-between z-10 relative">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                            Staking Interface
                        </CardTitle>
                        <TabsList className="bg-secondary/50">
                            <TabsTrigger value="stake" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Stake</TabsTrigger>
                            <TabsTrigger value="unstake" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground transition-all">Unstake</TabsTrigger>
                        </TabsList>
                    </div>
                    <CardDescription>
                        <AnimatePresence mode='wait'>
                            <motion.span
                                key={action}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="inline-block"
                            >
                                {action === 'stake'
                                    ? 'Deposit SOL to receive liquid soLSD tokens.'
                                    : 'Burn soLSD to retrieve your underlying SOL.'}
                            </motion.span>
                        </AnimatePresence>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 z-10 relative">
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">
                            Amount ({action === 'stake' ? 'SOL' : 'soLSD'})
                        </label>
                        <div className="relative group">
                            <Input
                                type="number"
                                value={solAmount}
                                onChange={(e) => setSolAmount(e.target.value)}
                                placeholder="0.00"
                                className="pr-24 text-3xl h-16 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all font-mono"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <button
                                    onClick={handleMax}
                                    className="text-xs font-bold bg-primary/20 hover:bg-primary/40 text-primary px-2 py-1 rounded transition-colors"
                                >
                                    MAX
                                </button>
                                <span className="text-lg text-muted-foreground font-bold group-hover:text-primary transition-colors">
                                    {action === 'stake' ? 'SOL' : 'soLSD'}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end text-xs text-muted-foreground font-mono">
                            Balance: {action === 'stake' ? fmt(nativeBalance, 4) : fmt(userShares, 4)} {action === 'stake' ? 'SOL' : 'soLSD'}
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-secondary/30 to-background rounded-xl border border-white/5 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">You will receive</span>
                            <span className="font-bold font-mono text-lg">
                                {fmt(estimatedOutput, 4)} {action === 'stake' ? 'soLSD' : 'SOL'}
                            </span>
                        </div>
                        <div className="h-px bg-white/5 w-full my-1" />
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Exchange Rate</span>
                            <span className="font-mono text-xs">1 soLSD ≈ {exchangeRate.toFixed(4)} SOL</span>
                        </div>
                    </div>

                    <Button
                        className={`w-full text-lg h-14 font-bold shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] ${action === 'stake'
                            ? 'bg-gradient-to-r from-primary to-blue-600 hover:shadow-primary/25'
                            : 'bg-gradient-to-r from-destructive to-red-600 hover:shadow-destructive/25'
                            }`}
                        onClick={handleAction}
                        disabled={isPending}
                    >
                        {isPending
                            ? <span className="loading loading-spinner text-white"></span>
                            : (action === 'stake' ? 'Stake SOL' : 'Unstake soLSD')}
                    </Button>
                </CardContent>
            </Tabs>
        </Card>
    )
}
