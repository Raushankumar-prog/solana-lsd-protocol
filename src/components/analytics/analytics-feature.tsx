'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Mock Data
const tvlData = [
    { name: 'Jan', value: 40, label: '$4k' },
    { name: 'Feb', value: 30, label: '$3k' },
    { name: 'Mar', value: 20, label: '$2k' },
    { name: 'Apr', value: 27, label: '$2.7k' },
    { name: 'May', value: 18, label: '$1.8k' },
    { name: 'Jun', value: 23, label: '$2.3k' },
    { name: 'Jul', value: 35, label: '$3.5k' },
    { name: 'Aug', value: 42, label: '$4.2k' },
    { name: 'Sep', value: 51, label: '$5.1k' },
    { name: 'Oct', value: 68, label: '$6.8k' },
]

const apyData = [
    { name: 'Ep 1', value: 68, label: '6.8%' },
    { name: 'Ep 2', value: 72, label: '7.2%' },
    { name: 'Ep 3', value: 71, label: '7.1%' },
    { name: 'Ep 4', value: 75, label: '7.5%' },
    { name: 'Ep 5', value: 78, label: '7.8%' },
    { name: 'Ep 6', value: 74, label: '7.4%' },
    { name: 'Ep 7', value: 81, label: '8.1%' },
    { name: 'Ep 8', value: 79, label: '7.9%' },
]

export default function AnalyticsFeature() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Protocol Analytics
                </h1>
                <p className="text-muted-foreground">Real-time performance metrics.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="glass-panel text-center py-6 border-primary/20">
                    <div className="text-sm text-muted-foreground uppercase tracking-widest">Total Value Locked</div>
                    <div className="text-4xl font-bold mt-2">$1,234,567</div>
                    <div className="text-green-400 text-sm mt-1">+12.5% this month</div>
                </Card>
                <Card className="glass-panel text-center py-6 border-blue-500/20">
                    <div className="text-sm text-muted-foreground uppercase tracking-widest">Avg. APY (30d)</div>
                    <div className="text-4xl font-bold mt-2 text-primary">7.52%</div>
                    <div className="text-green-400 text-sm mt-1">Top 5% on Solana</div>
                </Card>
                <Card className="glass-panel text-center py-6 border-purple-500/20">
                    <div className="text-sm text-muted-foreground uppercase tracking-widest">Active Stakers</div>
                    <div className="text-4xl font-bold mt-2">2,451</div>
                    <div className="text-green-400 text-sm mt-1">+124 this week</div>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* CSS Area/Bar Chart Alternative */}
                <Card className="glass-panel">
                    <CardHeader>
                        <CardTitle>TVL Growth (Year to Date)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end justify-between gap-2 p-6">
                        {tvlData.map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full group relative">
                                <div
                                    className="w-full bg-gradient-to-t from-blue-600/20 to-blue-500/60 rounded-t-sm hover:from-blue-600/40 hover:to-blue-500/80 transition-all cursor-pointer relative"
                                    style={{ height: `${item.value * 3}px` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {item.label}
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">{item.name}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="glass-panel">
                    <CardHeader>
                        <CardTitle>APY History (Last Epochs)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end justify-between gap-2 p-6">
                        {apyData.map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full group relative">
                                <div
                                    className="w-full bg-gradient-to-t from-green-600/20 to-green-500/60 rounded-t-md hover:from-green-600/40 hover:to-green-500/80 transition-all cursor-pointer relative"
                                    style={{ height: `${item.value * 3}px` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {item.label}
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">{item.name}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
