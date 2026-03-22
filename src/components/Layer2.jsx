import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Activity, Zap, ArrowRight, ShieldCheck, Clock, Coins, AlertTriangle, ArrowRightLeft } from 'lucide-react';

import { L2_CHAINS, ROLLUP_EXPLAINER, BRIDGE_STEPS } from '../data/layer2Data';

// --- Color Constants ---
const BG = '#11131d';
const SURFACE = '#1d1f2a';
const SURFACE_H = '#282934';
const AMBER = '#f59e0b';
const ROSE = '#fb7185';
const EMERALD = '#4ade80';
const SKY = '#38bdf8';
const PURPLE = '#a78bfa';
const TEXT = '#f1f5f9';
const MUTED = '#64748b';

import Quiz from './Quiz';

export default function Layer2() {
    const [activeRollupType, setActiveRollupType] = useState('optimistic'); // 'optimistic' | 'zk'

    // Counter animation logic
    const [tpsL1, setTpsL1] = useState(0);
    const [tpsL2, setTpsL2] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // L1 TPS fluctuates around 12-15
            setTpsL1(Math.floor(Math.random() * 5) + 12);
            // L2 TPS fluctuates around 2000-4000
            setTpsL2(Math.floor(Math.random() * 2000) + 2000);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const explainerData = ROLLUP_EXPLAINER[activeRollupType];
    const accentColor = activeRollupType === 'optimistic' ? AMBER : PURPLE;

    return (
        <div className="min-h-screen pb-20" style={{ color: TEXT }}>
            
            {/* ─── HEADER ────────────────────────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
                <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: SKY }}>
                        ─── SCALING SOLUTIONS
                    </p>
                    <h1 className="text-5xl font-black tracking-tighter" style={{ color: TEXT }}>
                        Layer 2<br />
                        <span style={{ 
                            background: `linear-gradient(to right, ${SKY}, ${EMERALD})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Explained
                        </span>
                    </h1>
                    <p className="mt-3 text-sm max-w-sm" style={{ color: MUTED }}>
                        Discover how Rollups bundle transactions to provide massive scalability while borrowing security from Ethereum.
                    </p>
                </div>

                {/* Animated TPS Counters */}
                <div className="flex gap-4">
                    <div className="p-6 text-center border min-w-[140px]" style={{ backgroundColor: SURFACE, borderColor: 'rgba(83,68,52,0.3)' }}>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1" style={{ color: MUTED }}>
                            <Activity className="w-3 h-3" /> L1 TPS
                        </p>
                        <p className="text-4xl font-terminal font-black" style={{ color: ROSE }}>
                            ~{tpsL1}
                        </p>
                        <p className="text-xs mt-1" style={{ color: MUTED }}>Slow & Expensive</p>
                    </div>
                    <div className="p-6 text-center border min-w-[140px] relative overflow-hidden" 
                         style={{ backgroundColor: `${EMERALD}10`, borderColor: EMERALD, boxShadow: `0 0 20px ${EMERALD}20` }}>
                        <div className="absolute top-0 right-0 p-1 opacity-50"><Zap className="w-4 h-4" style={{ color: EMERALD }} /></div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1" style={{ color: EMERALD }}>
                            <Zap className="w-3 h-3" /> L2 TPS
                        </p>
                        <motion.p 
                            key={tpsL2}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-terminal font-black" 
                            style={{ color: EMERALD }}
                        >
                            {tpsL2.toLocaleString()}
                        </motion.p>
                        <p className="text-xs mt-1" style={{ color: EMERALD }}>Fast & Cheap</p>
                    </div>
                </div>
            </div>

            {/* ─── CHAIN COMPARISON TABLE ────────────────────────────────────────── */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: TEXT }}>
                    <Layers className="w-6 h-6" style={{ color: SKY }} />
                    Leading Networks
                </h2>
                <div className="overflow-x-auto border-t" style={{ borderColor: 'rgba(83,68,52,0.3)' }}>
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr style={{ backgroundColor: SURFACE_H }}>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest border-b" style={{ color: MUTED, borderColor: 'rgba(83,68,52,0.3)' }}>Network</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest border-b" style={{ color: MUTED, borderColor: 'rgba(83,68,52,0.3)' }}>Architecture</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest border-b" style={{ color: MUTED, borderColor: 'rgba(83,68,52,0.3)' }}>Gas (Transfer)</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest border-b" style={{ color: MUTED, borderColor: 'rgba(83,68,52,0.3)' }}>Finality</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest border-b" style={{ color: MUTED, borderColor: 'rgba(83,68,52,0.3)' }}>EVM Check</th>
                            </tr>
                        </thead>
                        <tbody>
                            {L2_CHAINS.map((chain, i) => {
                                const isL1 = chain.rollupType === null;
                                return (
                                    <tr key={chain.name} 
                                        className="transition-colors group hover:bg-opacity-80"
                                        style={{ 
                                            backgroundColor: i % 2 === 0 ? SURFACE : BG, 
                                            borderBottom: `1px solid rgba(83,68,52,0.15)`,
                                        }}>
                                        <td className="p-4 text-sm font-bold flex items-center gap-2" style={{ color: TEXT }}>
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }} />
                                            {chain.name}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 text-xs font-bold rounded-sm uppercase tracking-wider" 
                                                  style={{ 
                                                      backgroundColor: isL1 ? 'rgba(100,116,139,0.1)' : chain.rollupType === 'optimistic' ? 'rgba(245,158,11,0.1)' : 'rgba(167,139,250,0.1)',
                                                      color: isL1 ? MUTED : chain.rollupType === 'optimistic' ? AMBER : PURPLE 
                                                  }}>
                                                {chain.type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-terminal text-sm" style={{ color: isL1 ? ROSE : EMERALD }}>
                                            {chain.gasTransfer}
                                        </td>
                                        <td className="p-4 text-sm" style={{ color: MUTED }}>
                                            {chain.finality}
                                        </td>
                                        <td className="p-4 text-sm font-medium">
                                            {chain.evmCompatible ? <ShieldCheck className="w-5 h-5" style={{ color: EMERALD }} /> : <span style={{ color: MUTED }}>Partial</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── ROLLUP MECHANICS SIMULATOR ────────────────────────────────────── */}
            <div className="mb-16 border" style={{ borderColor: 'rgba(83,68,52,0.3)', backgroundColor: BG }}>
                <div className="flex flex-col md:flex-row border-b" style={{ borderColor: 'rgba(83,68,52,0.3)' }}>
                    <button 
                        onClick={() => setActiveRollupType('optimistic')}
                        className="flex-1 p-6 text-left transition-colors relative"
                        style={{ backgroundColor: activeRollupType === 'optimistic' ? SURFACE_H : BG }}
                    >
                        <h3 className="text-xl font-bold mb-1" style={{ color: activeRollupType === 'optimistic' ? AMBER : MUTED }}>Optimistic Rollups</h3>
                        <p className="text-sm" style={{ color: MUTED }}>Assume valid, challenge if wrong</p>
                        {activeRollupType === 'optimistic' && (
                            <motion.div layoutId="rollup-indicator" className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: AMBER }} />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveRollupType('zk')}
                        className="flex-1 p-6 text-left transition-colors relative border-t md:border-t-0 md:border-l"
                        style={{ borderColor: 'rgba(83,68,52,0.3)', backgroundColor: activeRollupType === 'zk' ? SURFACE_H : BG }}
                    >
                        <h3 className="text-xl font-bold mb-1" style={{ color: activeRollupType === 'zk' ? PURPLE : MUTED }}>ZK Rollups</h3>
                        <p className="text-sm" style={{ color: MUTED }}>Prove mathematically valid</p>
                        {activeRollupType === 'zk' && (
                            <motion.div layoutId="rollup-indicator" className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: PURPLE }} />
                        )}
                    </button>
                </div>

                <div className="p-6 md:p-10" style={{ backgroundColor: SURFACE }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                        
                        {/* Desktop Connecting Line */}
                        <div className="hidden lg:block absolute top-[50%] left-0 right-0 h-0.5" style={{ backgroundColor: 'rgba(83,68,52,0.2)', zIndex: 0 }} />

                        <AnimatePresence mode="popLayout">
                            {explainerData.steps.map((step, idx) => {
                                const isFinal = idx === explainerData.steps.length - 1;
                                return (
                                    <motion.div 
                                        key={`${activeRollupType}-${idx}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                                        className="relative z-10 p-6 flex flex-col items-center text-center"
                                        style={{ 
                                            backgroundColor: isFinal ? `${EMERALD}15` : BG,
                                            border: `1px solid ${isFinal ? EMERALD : 'rgba(83,68,52,0.3)'}`
                                        }}
                                    >
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-4"
                                             style={{ backgroundColor: isFinal ? EMERALD : accentColor, color: isFinal ? BG : BG }}>
                                            {isFinal ? <ShieldCheck className="w-4 h-4" /> : idx + 1}
                                        </div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: TEXT }}>
                                            {step.label}
                                        </h4>
                                        <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                                            {step.description}
                                        </p>
                                        
                                        {/* Mobile Connecting Arrow */}
                                        {!isFinal && (
                                            <div className="lg:hidden mt-6 mb-[-2rem]">
                                                <ArrowRight className="w-5 h-5 rotate-90" style={{ color: 'rgba(83,68,52,0.5)' }} />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Pros and Cons */}
                    <motion.div 
                        key={`proscons-${activeRollupType}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <div className="p-6 border-l-2" style={{ backgroundColor: BG, borderColor: EMERALD }}>
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: EMERALD }}>
                                <ShieldCheck className="w-4 h-4" /> Advantages
                            </h4>
                            <ul className="space-y-2">
                                {explainerData.pros.map(pro => (
                                    <li key={pro} className="text-sm flex items-start gap-2" style={{ color: TEXT }}>
                                        <span style={{ color: EMERALD }}>+</span> {pro}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 border-l-2" style={{ backgroundColor: BG, borderColor: ROSE }}>
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: ROSE }}>
                                <AlertTriangle className="w-4 h-4" /> Trade-offs
                            </h4>
                            <ul className="space-y-2">
                                {explainerData.cons.map(con => (
                                    <li key={con} className="text-sm flex items-start gap-2" style={{ color: TEXT }}>
                                        <span style={{ color: ROSE }}>-</span> {con}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ─── BRIDGE MECHANICS ──────────────────────────────────────────────── */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: TEXT }}>
                    <ArrowRightLeft className="w-6 h-6" style={{ color: SKY }} />
                    Bridging Assets
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {BRIDGE_STEPS.map((step, i) => (
                        <div key={i} className="p-6 border flex flex-col items-center text-center relative" style={{ backgroundColor: SURFACE, borderColor: 'rgba(83,68,52,0.3)' }}>
                            <div className="w-10 h-10 mb-4 rounded-full border-2 flex items-center justify-center font-bold" style={{ borderColor: SKY, color: SKY }}>
                                {i + 1}
                            </div>
                            <h4 className="font-bold text-sm mb-2" style={{ color: TEXT }}>{step.label}</h4>
                            <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{step.description}</p>
                            
                            {i < BRIDGE_STEPS.length - 1 && (
                                <ArrowRight className="w-4 h-4 absolute -right-2 top-1/2 transform -translate-y-1/2 hidden lg:block" style={{ color: SKY }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Quiz sectionId="layer2" />
        </div>
    );
}
