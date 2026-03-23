import { useState, useEffect } from 'react';
import Scene3D from './Scene3D';
import { motion } from 'framer-motion';
import { Pickaxe, Coins, Server, Shield, Zap, RefreshCw, CheckCircle } from 'lucide-react';

const BG = '#11131d';
const SURFACE = '#1d1f2a';
const SURFACE_H = '#282934';
const AMBER = '#f59e0b';
const ROSE = '#fb7185';
const EMERALD = '#4ade80';
const TEXT = '#f1f5f9';
const MUTED = '#64748b';

import Quiz from './Quiz';

export default function Consensus() {
    const [activeTab, setActiveTab] = useState('pow');

    return (
        <div className="min-h-screen" style={{ color: TEXT }}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
                <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: AMBER }}>─── PROTOCOL NODES</p>
                    <h1 className="text-5xl font-black tracking-tighter" style={{ color: TEXT }}>
                        Consensus<br />
                        <span className="text-amber-gradient">Mechanisms</span>
                    </h1>
                    <p className="mt-3 text-sm max-w-sm" style={{ color: MUTED }}>
                        The engine of agreement — how thousands of anonymous nodes reach a single truth without a central authority.
                    </p>
                </div>

                {/* 3D mining rig illustration */}
                <div className="hidden lg:flex items-center justify-center relative w-full h-[400px] lg:h-[500px] xl:h-[600px]">
                    <div className="w-full h-full" style={{ cursor: "grab" }}><Scene3D sceneId="consensus" /></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-8 p-1 inline-flex" style={{ backgroundColor: SURFACE }}>
                {[
                    { id: 'pow', label: '⛏ Proof of Work', color: AMBER },
                    { id: 'pos', label: '🪙 Proof of Stake', color: EMERALD },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="px-5 py-2 text-sm font-bold transition-all duration-200"
                        style={{
                            backgroundColor: activeTab === tab.id ? tab.color : 'transparent',
                            color: activeTab === tab.id ? '#11131d' : MUTED,
                            boxShadow: activeTab === tab.id ? `0 0 16px ${tab.color}44` : 'none',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-10">
                <div className="lg:col-span-2">
                    {activeTab === 'pow' ? <MiningSimulator /> : <StakingSimulator />}
                </div>
                <div className="lg:col-span-1">
                    <ComparisonTable activeTab={activeTab} />
                </div>
            </div>

            <Quiz sectionId="consensus" />
        </div>
    );
}

function MiningSimulator() {
    const [difficulty, setDifficulty] = useState(1);
    const [nonce, setNonce] = useState(0);
    const [hash, setHash] = useState('');
    const [mining, setMining] = useState(false);
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        let interval;
        if (mining) {
            interval = setInterval(() => {
                const newNonce = Math.floor(Math.random() * 100000);
                setNonce(newNonce);
                const mockHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                const targetPrefix = '0'.repeat(difficulty);
                if (mockHash.startsWith(targetPrefix)) {
                    setHash(mockHash);
                    setMining(false);
                    setBlocks(prev => [...prev, { id: prev.length + 1, hash: mockHash, nonce: newNonce }]);
                } else {
                    setHash(mockHash);
                }
            }, 100 - (difficulty * 20));
        }
        return () => clearInterval(interval);
    }, [mining, difficulty]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6"
            style={{ backgroundColor: SURFACE, borderLeft: `3px solid ${AMBER}` }}
        >
            <div className="flex items-center space-x-3 mb-4">
                <Pickaxe className="w-6 h-6" style={{ color: AMBER }} />
                <h2 className="text-xl font-bold" style={{ color: TEXT }}>Mining Simulator</h2>
            </div>
            <p className="text-sm mb-6" style={{ color: MUTED }}>
                Miners compete to solve a computational puzzle — finding a hash that starts with specific zeros requires energy and luck.
            </p>

            {/* Config panel */}
            <div className="p-4 mb-6" style={{ backgroundColor: BG }}>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: MUTED }}>Network Difficulty</span>
                    <div className="flex items-center space-x-3">
                        <input
                            type="range" min="1" max="4" value={difficulty}
                            onChange={e => setDifficulty(parseInt(e.target.value))}
                            className="w-24"
                            style={{ accentColor: AMBER }}
                        />
                        <span className="text-xs font-bold" style={{ color: AMBER }}>{difficulty}x</span>
                    </div>
                </div>
                <div className="p-3 font-terminal text-xs" style={{ backgroundColor: '#0c0e17' }}>
                    <div style={{ color: MUTED }}>Target Hash Prefix</div>
                    <div className="font-bold mb-2" style={{ color: AMBER }}>{'0'.repeat(difficulty)}{'f'.repeat(8 - difficulty)}...</div>
                    <div style={{ color: MUTED }}>Nonce: <span style={{ color: TEXT }}>{nonce}</span></div>
                    <div className="break-all" style={{ color: mining ? ROSE : EMERALD }}>
                        Hash: {hash || 'Waiting to mine...'}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 mb-6">
                <button
                    onClick={() => setMining(!mining)}
                    className="flex-1 clip-button py-3 flex items-center justify-center space-x-2 font-bold text-sm transition-all"
                    style={{
                        backgroundColor: mining ? ROSE : AMBER,
                        color: '#11131d',
                        boxShadow: mining ? `0 0 20px ${ROSE}44` : `0 0 20px ${AMBER}44`,
                    }}
                >
                    {mining ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Stop Mining</span></> : <><Pickaxe className="w-4 h-4" /><span>Start Mining</span></>}
                </button>
                {blocks.length > 0 && (
                    <button
                        onClick={() => setBlocks([])}
                        className="px-4 py-3 text-sm font-medium transition-all"
                        style={{ color: MUTED, border: '1px solid rgba(83,68,52,0.4)' }}
                        onMouseEnter={e => e.currentTarget.style.color = TEXT}
                        onMouseLeave={e => e.currentTarget.style.color = MUTED}
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Block chain display */}
            <div>
                <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: MUTED }}>Blockchain</h3>
                <div className="flex space-x-2 overflow-x-auto pb-3 scrollbar-hide">
                    {blocks.length === 0 && (
                        <span className="text-xs italic" style={{ color: MUTED }}>No blocks mined yet.</span>
                    )}
                    {blocks.map((block, i) => (
                        <motion.div
                            key={block.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex-shrink-0 flex flex-col items-center justify-center p-3 text-xs text-center relative"
                            style={{ width: 90, backgroundColor: BG, border: `1px solid ${AMBER}44` }}
                        >
                            {i > 0 && (
                                <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-amber-500 chain-pulse">→</div>
                            )}
                            <span className="font-bold mb-1" style={{ color: AMBER }}>#{block.id}</span>
                            <span style={{ color: MUTED }}>{block.hash.substring(0, 8)}...</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function StakingSimulator() {
    const [validators] = useState([
        { id: 1, stake: 32, blocks: 0, color: AMBER },
        { id: 2, stake: 16, blocks: 0, color: ROSE },
        { id: 3, stake: 100, blocks: 0, color: EMERALD },
    ]);
    const [validatorsState, setValidatorsState] = useState(validators);
    const [activeValidator, setActiveValidator] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        let interval;
        if (isValidating) {
            interval = setInterval(() => {
                const totalStake = validatorsState.reduce((acc, v) => acc + v.stake, 0);
                let random = Math.random() * totalStake;
                let selected = null;
                for (const v of validatorsState) {
                    random -= v.stake;
                    if (random <= 0) { selected = v; break; }
                }
                setActiveValidator(selected);
                setTimeout(() => {
                    if (selected) {
                        setValidatorsState(prev => prev.map(v => v.id === selected.id ? { ...v, blocks: v.blocks + 1 } : v));
                        setBlocks(prev => [...prev, { id: prev.length + 1, validator: selected.id, color: selected.color }]);
                        setActiveValidator(null);
                    }
                }, 1000);
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isValidating, validatorsState]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6"
            style={{ backgroundColor: SURFACE, borderLeft: `3px solid ${EMERALD}` }}
        >
            <div className="flex items-center space-x-3 mb-4">
                <Coins className="w-6 h-6" style={{ color: EMERALD }} />
                <h2 className="text-xl font-bold" style={{ color: TEXT }}>Staking Simulator</h2>
            </div>
            <p className="text-sm mb-6" style={{ color: MUTED }}>
                Validators lock tokens as collateral. Higher stake = higher probability of proposing the next block.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
                {validatorsState.map(v => (
                    <motion.div
                        key={v.id}
                        animate={{
                            borderColor: activeValidator?.id === v.id ? v.color : 'rgba(83,68,52,0.3)',
                            backgroundColor: activeValidator?.id === v.id ? `${v.color}18` : SURFACE_H,
                        }}
                        className="p-4 flex flex-col items-center text-center"
                        style={{ border: '1px solid rgba(83,68,52,0.3)' }}
                    >
                        <div className="w-10 h-10 flex items-center justify-center mb-2 rounded-full" style={{ backgroundColor: `${v.color}18` }}>
                            <Server className="w-5 h-5" style={{ color: activeValidator?.id === v.id ? v.color : MUTED }} />
                        </div>
                        <div className="font-bold text-base" style={{ color: v.color }}>{v.stake} ETH</div>
                        <div className="text-xs mb-2" style={{ color: MUTED }}>Validator #{v.id}</div>
                        <div className="text-xs px-2 py-0.5 font-bold" style={{ backgroundColor: `${v.color}18`, color: v.color }}>
                            {v.blocks} blocks
                        </div>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={() => setIsValidating(!isValidating)}
                className="w-full clip-button py-3 font-bold text-sm mb-6 transition-all"
                style={{
                    backgroundColor: isValidating ? ROSE : EMERALD,
                    color: '#11131d',
                    boxShadow: isValidating ? `0 0 20px ${ROSE}44` : `0 0 20px ${EMERALD}44`,
                }}
            >
                {isValidating ? 'Stop Validating' : '▶ Start Network'}
            </button>

            <div>
                <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: MUTED }}>Blockchain</h3>
                <div className="flex space-x-2 overflow-x-auto pb-3 scrollbar-hide">
                    {blocks.length === 0 && <span className="text-xs italic" style={{ color: MUTED }}>No blocks validated yet.</span>}
                    {blocks.map((block, i) => (
                        <motion.div
                            key={block.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0 flex flex-col items-center justify-center p-3 relative"
                            style={{ width: 90, backgroundColor: BG, border: `1px solid ${block.color}44` }}
                        >
                            {i > 0 && <div className="absolute -left-2 top-1/2 -translate-y-1/2" style={{ color: MUTED }}>→</div>}
                            <span className="font-bold text-xs mb-1" style={{ color: block.color }}>#{block.id}</span>
                            <CheckCircle className="w-4 h-4" style={{ color: block.color }} />
                            <span className="text-xs" style={{ color: MUTED }}>V#{block.validator}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function ComparisonTable({ activeTab }) {
    const data = [
        { feature: 'Energy Efficiency', pow: { label: 'Extreme High', val: '🔴' }, pos: { label: 'Ultra Low', val: '🟢' }, icon: <Zap className="w-4 h-4" /> },
        { feature: 'Security Model', pow: { label: 'Computation', val: '⚡' }, pos: { label: 'Incentives', val: '🏦' }, icon: <Shield className="w-4 h-4" /> },
        { feature: 'Centralization Risk', pow: { label: 'Mining Pools', val: '⛏' }, pos: { label: 'Wealth Conc.', val: '💰' }, icon: <Server className="w-4 h-4" /> },
    ];

    return (
        <div className="p-6 h-full" style={{ backgroundColor: SURFACE, borderLeft: `3px solid #534434` }}>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: MUTED }}>PoW vs PoS Matrix</h3>
            <div className="space-y-4">
                {data.map((item, i) => (
                    <div key={i} className="p-4" style={{ backgroundColor: BG }}>
                        <div className="flex items-center space-x-2 mb-3" style={{ color: AMBER }}>
                            {item.icon}
                            <span className="text-xs font-bold tracking-wider uppercase">{item.feature}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className={`p-2 text-center ${activeTab === 'pow' ? 'ring-1' : ''}`}
                                style={{ backgroundColor: SURFACE_H, color: activeTab === 'pow' ? AMBER : MUTED, ringColor: AMBER }}>
                                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: MUTED }}>PoW</div>
                                <div className="font-bold">{item.pow.label}</div>
                            </div>
                            <div className={`p-2 text-center ${activeTab === 'pos' ? 'ring-1' : ''}`}
                                style={{ backgroundColor: SURFACE_H, color: activeTab === 'pos' ? EMERALD : MUTED }}>
                                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: MUTED }}>PoS</div>
                                <div className="font-bold">{item.pos.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 text-xs" style={{ backgroundColor: BG, borderLeft: `2px solid ${AMBER}` }}>
                <p style={{ color: MUTED }}>
                    "{activeTab === 'pow' ? 'Proof of Work secures the Bitcoin network via thermodynamic cost.' : 'Proof of Stake relies on economic weight — skin in the game.'}"
                </p>
            </div>
        </div>
    );
}
