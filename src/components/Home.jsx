import { Link } from 'react-router-dom';
import Scene3D from './Scene3D';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, ShieldCheck, Code, Globe, AlertTriangle, ExternalLink, Trophy, Star, Medal, Coins, TrendingUp, BookOpen, Layers } from 'lucide-react';

const SURFACE = '#1d1f2a';
const AMBER = '#f59e0b';
const ROSE = '#fb7185';
const EMERALD = '#4ade80';
const SKY = '#38bdf8';
const MUTED = '#64748b';
const TEXT = '#f1f5f9';
const BG = '#11131d';
const PURPLE = '#a855f7';

export default function Home() {
    const CARDS = [
        { to: '/consensus', num: '01', title: 'Consensus Mechanisms', desc: 'PoW vs PoS — Mining simulators, validator selection, and energy tradeoffs.', icon: <Cpu className="w-6 h-6" />, color: AMBER, tags: ['PoW', 'PoS'] },
        { to: '/solidity', num: '02', title: 'Solidity Architecture', desc: 'Learn smart contract syntax with an interactive code editor and live explanations.', icon: <Code className="w-6 h-6" />, color: ROSE, tags: ['EVM', 'ABI'] },
        { to: '/tokens', num: '03', title: 'Token Standards', desc: 'ERC-20, ERC-721, ERC-1155 — explore interfaces, compare standards, and choose the right one.', icon: <Coins className="w-6 h-6" />, color: AMBER, tags: ['ERC-20', 'ERC-721'] },
        { to: '/defi', num: '04', title: 'DeFi Concepts', desc: 'Simulate AMMs, impermanent loss, and lending protocols — the building blocks of DeFi.', icon: <TrendingUp className="w-6 h-6" />, color: EMERALD, tags: ['AMM', 'Lending'] },
        { to: '/deployment', num: '05', title: 'Deployment & Architecture', desc: 'Step through testnet deployments, Chain IDs, and transaction anatomy hands-on.', icon: <Globe className="w-6 h-6" />, color: SKY, tags: ['Deploy', 'Testnet'] },
        { to: '/security', num: '06', title: 'Defensive Auditing', desc: 'Simulate reentrancy attacks, flash loans, and integer overflow vulnerabilities.', icon: <AlertTriangle className="w-6 h-6" />, color: ROSE, tags: ['Audit', 'CEI Pattern'] },
        { to: '/glossary', num: '07', title: 'Blockchain Glossary', desc: 'The ultimate dictionary — search 50+ terms across Core, DeFi, Security, and L2 categories.', icon: <BookOpen className="w-6 h-6" />, color: SKY, tags: ['Reference', 'Web3'] },
    ];

    const STACK = [
        { category: 'Languages', items: ['Solidity', 'Vyper', 'Huff'], accent: AMBER },
        { category: 'Frameworks', items: ['Hardhat', 'Foundry', 'Remix'], accent: ROSE },
        { category: 'Libraries', items: ['Ethers.js', 'Viem', 'Wagmi'], accent: EMERALD },
        { category: 'Frontend', items: ['React', 'Next.js', 'RainbowKit'], accent: SKY },
    ];

    return (
        <div className="min-h-screen flex flex-col" style={{ color: TEXT }}>

            {/* ── Hero ──────────────────────────────────────── */}
            <section className="relative flex items-center pt-10 pb-16">

                <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* LEFT — Text */}
                    <div>
                        {/* Kicker tag */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center space-x-2 px-3 py-1 mb-6 text-xs font-bold tracking-widest uppercase"
                            style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: AMBER, border: '1px solid rgba(245,158,11,0.25)' }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: AMBER }} />
                            <span>Blockchain Education v2.0</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-6xl lg:text-7xl font-black leading-none tracking-tighter mb-6"
                        >
                            <span className="text-amber-gradient">Blockchain</span>
                            <br />
                            <span style={{ color: TEXT }}>Unpacked</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg mb-8 max-w-md"
                            style={{ color: MUTED }}
                        >
                            Master the architecture of decentralized ledgers — from Byzantine consensus algorithms to high-frequency on-chain systems.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="flex flex-wrap gap-4 mb-10"
                        >
                            <Link
                                to="/consensus"
                                className="clip-button inline-flex items-center space-x-2 px-6 py-3 text-sm font-bold transition-all amber-glow"
                                style={{ backgroundColor: AMBER, color: '#11131d' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ffc174'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = AMBER}
                            >
                                <span>Start Learning</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center space-x-2 px-6 py-3 text-sm font-bold transition-all"
                                style={{ color: MUTED, border: '1px solid rgba(83,68,52,0.5)' }}
                                onMouseEnter={e => { e.currentTarget.style.color = TEXT; e.currentTarget.style.borderColor = AMBER; }}
                                onMouseLeave={e => { e.currentTarget.style.color = MUTED; e.currentTarget.style.borderColor = 'rgba(83,68,52,0.5)'; }}
                            >
                                <span>View on GitHub</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </motion.div>

                        {/* Stats bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center space-x-6 text-sm"
                            style={{ color: MUTED }}
                        >
                            {['7 Modules', 'Interactive Demos', 'Free & Open Source'].map((s, i) => (
                                <span key={i} className="flex items-center space-x-1.5">
                                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: AMBER }} />
                                    <span>{s}</span>
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* RIGHT — 3D isometric blockchain illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="hidden lg:flex items-center justify-center"
                    >
                        <div className="relative w-full h-[400px] lg:h-[600px]">
                            <div className="w-full h-full relative z-10" style={{ cursor: "grab" }}><Scene3D sceneId="home" /></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── User Progress ───────────────────────────────── */}
            {/* ── Feature Cards ─────────────────────────────── */}
            <section className="py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-10"
                >
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: AMBER }}>─── KNOWLEDGE VERTICALS</p>
                    <h2 className="text-3xl font-bold" style={{ color: TEXT }}>Explore the modules</h2>
                    <p className="mt-2 text-sm" style={{ color: MUTED }}>Interactive simulations bridging theory and on-chain practice.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {CARDS.map((card, i) => (
                        <motion.div
                            key={card.to}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <Link
                                to={card.to}
                                className="group block p-6 transition-all duration-300 relative overflow-hidden"
                                style={{
                                    backgroundColor: SURFACE,
                                    borderLeft: `3px solid ${card.color}`,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.boxShadow = `0 0 30px rgba(245,158,11,0.1), inset 0 0 20px rgba(245,158,11,0.03)`;
                                    e.currentTarget.style.backgroundColor = '#282934';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.backgroundColor = SURFACE;
                                }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2" style={{ backgroundColor: `${card.color}18`, color: card.color }}>
                                            {card.icon}
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold tracking-widest" style={{ color: card.color }}>{card.num}</span>
                                            <h3 className="text-base font-bold" style={{ color: TEXT }}>{card.title}</h3>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: MUTED }} />
                                </div>
                                <p className="text-sm mb-4" style={{ color: MUTED }}>{card.desc}</p>
                                <div className="flex gap-2">
                                    {card.tags.map(t => (
                                        <span key={t} className="text-xs px-2 py-0.5 font-mono font-bold"
                                            style={{ backgroundColor: `${card.color}12`, color: card.color }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Tech Stack ────────────────────────────────── */}
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="py-16"
                style={{ borderTop: '1px solid rgba(83,68,52,0.25)' }}
            >
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: AMBER }}>─── MODERN ETHEREUM STACK</p>
                <h2 className="text-3xl font-bold mb-10" style={{ color: TEXT }}>Built on what matters</h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {STACK.map((s, i) => (
                        <motion.div
                            key={s.category}
                            whileHover={{ y: -4 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="p-5 transition-all duration-300"
                            style={{
                                backgroundColor: SURFACE,
                                borderTop: `2px solid ${s.accent}`,
                            }}
                        >
                            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: s.accent }}>{s.category}</p>
                            <ul className="space-y-2">
                                {s.items.map(item => (
                                    <li key={item} className="text-sm font-medium flex items-center space-x-2" style={{ color: TEXT }}>
                                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: s.accent }} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ── CTA Banner ────────────────────────────────── */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="py-16 text-center relative overflow-hidden"
                style={{ backgroundColor: SURFACE }}
            >
                <h2 className="text-3xl font-black tracking-tight mb-3 relative z-10" style={{ color: TEXT }}>
                    Ready to Deconstruct the Chain?
                </h2>
                <p className="text-sm mb-8 relative z-10" style={{ color: MUTED }}>
                    Join developers mastering the Aether Protocol. Open source, modular, free forever.
                </p>
                <Link
                    to="/consensus"
                    className="clip-button inline-flex items-center space-x-2 px-8 py-3 font-bold transition-all amber-glow relative z-10"
                    style={{ backgroundColor: AMBER, color: '#11131d' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ffc174'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = AMBER}
                >
                    <span>Begin Module 01</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.section>
        </div>
    );
}
