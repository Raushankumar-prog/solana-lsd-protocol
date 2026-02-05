'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Helper to format numbers
const fmt = (n: number, decimals = 2) => n.toLocaleString(undefined, { maximumFractionDigits: decimals })

export function LsdUserPosition({
    userShares,
    userValueSol
}: {
    userShares: number
    userValueSol: number
}) {
    return (
        <Card className="glass-panel h-fit">
            <CardHeader>
                <CardTitle>Your Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="text-sm text-muted-foreground">Staked Balance</div>
                    <div className="text-2xl font-bold font-mono text-primary">{fmt(userShares, 4)} soLSD</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">Value in SOL</div>
                    <div className="text-xl font-bold font-mono">{fmt(userValueSol, 4)} SOL</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">Estimated USD</div>
                    <div className="text-lg font-medium text-muted-foreground">≈ ${fmt(userValueSol * 145)}</div>
                </div>
            </CardContent>
        </Card>
    )
}
