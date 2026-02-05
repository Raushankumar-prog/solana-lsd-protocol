'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

// Helper to format numbers
const fmt = (n: number, decimals = 2) => n.toLocaleString(undefined, { maximumFractionDigits: decimals })

export function LsdStats({
    poolSol,
    exchangeRate
}: {
    poolSol: number
    exchangeRate: number
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
                { title: "Total Value Locked", value: `${fmt(poolSol)} SOL`, sub: `≈ $${fmt(poolSol * 145)} USD`, border: "border-primary/20", text: "text-foreground" },
                { title: "APY (Simulated)", value: "7.5%", sub: "Rewards compound automatically", border: "border-green-500/20", text: "text-green-400" },
                { title: "Exchange Rate", value: "1 soLSD", sub: `= ${exchangeRate.toFixed(4)} SOL`, border: "border-blue-500/20", text: "text-blue-400" }
            ].map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card className={`glass-panel ${stat.border} hover:shadow-lg transition-all duration-300`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${stat.text}`}>
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground">{stat.sub}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
