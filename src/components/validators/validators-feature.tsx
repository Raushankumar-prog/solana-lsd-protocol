'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge' // Assuming standard shadcn badge
import { Button } from '@/components/ui/button'

const validators = [
    { id: 1, name: 'Figment', apy: '7.8%', fee: '0%', score: 98, status: 'Active' },
    { id: 2, name: 'Coinbase Cloud', apy: '7.5%', fee: '2%', score: 95, status: 'Active' },
    { id: 3, name: 'Jito Labs', apy: '8.1%', fee: '5%', score: 99, status: 'Active' },
    { id: 4, name: 'Block Logic', apy: '7.2%', fee: '0%', score: 92, status: 'Warning' },
    { id: 5, name: 'Everstake', apy: '7.4%', fee: '3%', score: 96, status: 'Active' }
]

export default function ValidatorsFeature() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Validator Registry
                </h1>
                <p className="text-muted-foreground">The network of nodes securing your stake.</p>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
                <div className="grid grid-cols-5 bg-secondary/30 p-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="col-span-2">Validator</div>
                    <div className="text-center">APY</div>
                    <div className="text-center">Commission</div>
                    <div className="text-right">Score</div>
                </div>

                <div className="divide-y divide-white/5">
                    {validators.map((v) => (
                        <div key={v.id} className="grid grid-cols-5 p-4 items-center hover:bg-white/5 transition-colors">
                            <div className="col-span-2 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-xs ring-1 ring-white/10">
                                    {v.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{v.name}</div>
                                    <div className="flex gap-2 text-xs">
                                        <span className={v.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}>● {v.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center font-mono text-green-400 font-bold">{v.apy}</div>
                            <div className="text-center font-mono text-muted-foreground">{v.fee}</div>
                            <div className="text-right flex justify-end">
                                <span className={`px-3 py-1 rounded text-xs font-bold ${v.score > 90 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {v.score}/100
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
