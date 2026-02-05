'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function LandingPage() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    const stagger = {
        visible: { transition: { staggerChildren: 0.2 } }
    }
    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col justify-center items-center text-center p-8 space-y-8 bg-gradient-to-b from-background to-secondary/10 overflow-hidden relative">
                {/* Background Blobs */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"
                />

                <motion.div
                    initial="hidden" animate="visible" variants={stagger}
                    className="space-y-4 max-w-3xl z-10"
                >
                    <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent pb-2">
                        Liquid Staking. <br />
                        Redefined.
                    </motion.h1>
                    <motion.p variants={fadeIn} className="text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto">
                        Unlock liquidity while earning rewards. The most advanced staking protocol on Solana.
                        Compound automatically. Unstake instantly.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="flex gap-4 z-10"
                >
                    <Link href="/dashboard">
                        <Button size="lg" className="text-lg px-8 py-6 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95">
                            Launch App
                        </Button>
                    </Link>
                    <Link href="https://solana.com" target="_blank">
                        <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full hover:bg-secondary/20">
                            Learn More
                        </Button>
                    </Link>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.8 }}
                    className="pt-12 grid grid-cols-3 gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all"
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-bold">$1.2M+</span>
                        <span className="text-sm uppercase tracking-wider">Total Value Locked</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-bold">7.5%</span>
                        <span className="text-sm uppercase tracking-wider">Average APY</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-bold">2.4k+</span>
                        <span className="text-sm uppercase tracking-wider">Stakers</span>
                    </div>
                </motion.div>
            </section>

            {/* How it Works */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-secondary/5 skew-y-3 transform origin-top-left -z-10 h-full w-full" />
                <div className="container mx-auto px-4 max-w-5xl">
                    <motion.h2
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                        className="text-3xl font-bold text-center mb-16"
                    >
                        How Liquid Staking Works
                    </motion.h2>
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                        className="grid md:grid-cols-3 gap-12 relative"
                    >
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -z-10" />

                        <StepCard
                            step="01"
                            title="Connect Wallet"
                            desc="Link your refined Solana wallet securely to the protocol."
                        />
                        <StepCard
                            step="02"
                            title="Stake SOL"
                            desc="Deposit your SOL. We automatically delegate to top-tier validators."
                        />
                        <StepCard
                            step="03"
                            title="Receive rewards"
                            desc="Get soLSD immediately. Watch its value grow against SOL every epoch."
                        />
                    </motion.div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-24 container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-4xl font-bold">Institutional-Grade Security</h2>
                    <p className="text-muted-foreground text-lg">
                        LSD Protocol is built on the battle-tested Anchor framework.
                        Our smart contracts undergo rigorous internal testing and are designed
                        with non-custodial principles at the core.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</div>
                            <span>Audited Smart Contracts</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</div>
                            <span>Multi-Sig Treasury Management</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</div>
                            <span>Open Source Codebase</span>
                        </li>
                    </ul>
                </div>
                <div className="p-8 rounded-3xl bg-gradient-to-br from-secondary/40 to-background border border-white/10 shadow-2xl skew-x-[-2deg] hover:skew-x-0 transition-all duration-500">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-sm text-muted-foreground">Security Score</span>
                            <span className="text-green-400 font-bold">98/100</span>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full w-[98%] bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            </div>
                            <p className="text-xs text-right text-muted-foreground">Updated: Today</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 text-center">
                <div className="container mx-auto px-4 max-w-3xl space-y-8 p-12 rounded-3xl bg-gradient-to-b from-primary/10 to-transparent border border-primary/20">
                    <h2 className="text-4xl font-bold">Ready to maximize your yield?</h2>
                    <p className="text-xl text-muted-foreground">Join thousands of stakers earning compound interest today.</p>
                    <Link href="/dashboard">
                        <Button size="lg" className="text-lg px-12 py-6 rounded-full font-bold shadow-xl shadow-primary/25 hover:scale-105 transition-transform">
                            Start Staking Now
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}

function StepCard({ step, title, desc }: { step: string, title: string, desc: string }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-col items-center text-center space-y-4 relative z-10 bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-transparent hover:border-primary/10 transition-colors"
        >
            <div className="w-16 h-16 rounded-2xl bg-background border border-primary/30 shadow-[0_0_30px_rgba(124,58,237,0.15)] flex items-center justify-center text-2xl font-bold text-primary">
                {step}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-muted-foreground">{desc}</p>
        </motion.div>
    )
}

function FeatureCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-bold mb-4 text-primary">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{desc}</p>
        </div>
    )
}
