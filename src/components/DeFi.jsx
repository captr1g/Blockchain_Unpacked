import { useState, useEffect } from 'react';
import Scene3D from './Scene3D';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Droplets, ArrowRightLeft, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';

import { DEFI_GLOSSARY, IL_PRESETS } from '../data/defiConcepts';
import { useAMM, calculateImpermanentLoss } from '../hooks/useAMM';
import { useLending } from '../hooks/useLending';

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

export default function DeFi() {
    const [activeTab, setActiveTab] = useState('AMM'); // AMM, IL, Lending, Glossary

    // Hooks for tabs
    const amm = useAMM(1000, 2000000);
    const lending = useLending();

    // IL Calculator State
    const [ilMultiplier, setIlMultiplier] = useState(2.0);
    const ilResult = calculateImpermanentLoss(ilMultiplier);

    return (
        <div className="min-h-screen pb-20" style={{ color: TEXT }}>

            {/* ─── HEADER ────────────────────────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
                <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: EMERALD }}>
                        ─── DECENTRALIZED FINANCE
                    </p>
                    <h1 className="text-5xl font-black tracking-tighter" style={{ color: TEXT }}>
                        DeFi<br />
                        <span style={{ color: EMERALD }}>
                            Concepts
                        </span>
                    </h1>
                    <p className="mt-3 text-sm max-w-sm" style={{ color: MUTED }}>
                        Simulate AMMs, impermanent loss, and lending — the building blocks of DeFi.
                    </p>
                </div>

                {/* Isometric SVG Illustration */}
                <div className="hidden lg:flex items-center justify-center relative w-full h-[400px] lg:h-[500px]">
                    <div className="w-full h-full" style={{ cursor: "grab" }}><Scene3D sceneId="defi" /></div>
                </div>
            </div>

            {/* ─── TAB BAR ───────────────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-opacity-20 pb-4" style={{ borderColor: MUTED }}>
                {[
                    { id: 'AMM', label: 'AMM Simulator', color: EMERALD },
                    { id: 'IL', label: 'Impermanent Loss', color: ROSE },
                    { id: 'Lending', label: 'Lending', color: AMBER },
                    { id: 'Glossary', label: 'Glossary', color: SKY }
                ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="clip-button px-5 py-2 text-sm font-bold transition-all duration-300"
                            style={{
                                backgroundColor: isActive ? tab.color : 'transparent',
                                color: isActive ? BG : tab.color,
                                border: isActive ? `1px solid ${tab.color}` : `1px solid rgba(83,68,52,0.5)`,
                                boxShadow: isActive ? `0 0 15px ${tab.color}40` : 'none'
                            }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ─── TAB CONTENT ───────────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'AMM' && <AMMSimulator amm={amm} />}
                    {activeTab === 'IL' && <ILCalculator multiplier={ilMultiplier} setMultiplier={setIlMultiplier} result={ilResult} />}
                    {activeTab === 'Lending' && <LendingSimulator lending={lending} />}
                    {activeTab === 'Glossary' && <GlossaryGrid />}
                </motion.div>
            </AnimatePresence>

            <Quiz sectionId="defi" />
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────────────
// SUBCOMPONENTS
// ────────────────────────────────────────────────────────────────────────────────

function AMMSimulator({ amm }) {
    const [swapDirection, setSwapDirection] = useState('AtoB');
    const [swapAmount, setSwapAmount] = useState(100);

    const price = amm.getPrice();

    // Preview swap
    const preview = amm.getSlippageForAmount(swapAmount, swapDirection);

    // Execute
    const handleSwap = () => {
        if (swapDirection === 'AtoB') {
            amm.swapAtoB(swapAmount);
        } else {
            amm.swapBtoA(swapAmount);
        }
    };

    const maxSlider = swapDirection === 'AtoB' ? Math.floor(amm.poolA * 0.4) : Math.floor(amm.poolB * 0.4);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* POOL STATE */}
            <div className="p-6 md:p-8" style={{ backgroundColor: SURFACE, borderLeft: `3px solid ${EMERALD}` }}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: TEXT }}>
                    <Droplets className="w-5 h-5" style={{ color: EMERALD }} />
                    Pool State (ETH / USDC)
                </h3>

                <div className="space-y-6 mb-8">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span style={{ color: MUTED }}>Token A (ETH)</span>
                            <span className="font-terminal font-bold" style={{ color: EMERALD }}>{Math.floor(amm.poolA).toLocaleString()} ETH</span>
                        </div>
                        <div className="w-full h-3 bg-opacity-20 rounded-full overflow-hidden" style={{ backgroundColor: SURFACE_H }}>
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: EMERALD, width: `${(amm.poolA / (amm.poolA + (amm.poolB / price))) * 100}%` }}
                                layout transition={{ type: 'spring', bounce: 0 }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span style={{ color: MUTED }}>Token B (USDC)</span>
                            <span className="font-terminal font-bold" style={{ color: SKY }}>{Math.floor(amm.poolB).toLocaleString()} USDC</span>
                        </div>
                        <div className="w-full h-3 bg-opacity-20 rounded-full overflow-hidden" style={{ backgroundColor: SURFACE_H }}>
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: SKY, width: `${(amm.poolB / (amm.poolB + (amm.poolA * price))) * 100}%` }}
                                layout transition={{ type: 'spring', bounce: 0 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 flex flex-col gap-2 rounded-sm" style={{ backgroundColor: BG, border: `1px solid rgba(83,68,52,0.2)` }}>
                    <div className="flex justify-between items-center text-sm">
                        <span style={{ color: MUTED }}>Constant Product (k)</span>
                        <span className="font-terminal text-xs" style={{ color: TEXT }}>{Math.floor(amm.k).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span style={{ color: MUTED }}>Current Price</span>
                        <span className="font-terminal text-sm font-bold" style={{ color: AMBER }}>1 ETH = {price.toFixed(2)} USDC</span>
                    </div>
                </div>
            </div>

            {/* SWAP CONTROLS */}
            <div className="p-6 md:p-8 flex flex-col justify-between" style={{ backgroundColor: SURFACE, border: `1px solid rgba(83,68,52,0.3)` }}>
                <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: TEXT }}>
                        <ArrowRightLeft className="w-5 h-5" style={{ color: SKY }} />
                        Swap
                    </h3>

                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => { setSwapDirection('AtoB'); setSwapAmount(100); }}
                            className="flex-1 py-2 text-sm font-bold transition-colors"
                            style={{
                                backgroundColor: swapDirection === 'AtoB' ? `${EMERALD}15` : BG,
                                color: swapDirection === 'AtoB' ? EMERALD : MUTED,
                                border: swapDirection === 'AtoB' ? `1px solid ${EMERALD}` : `1px solid rgba(83,68,52,0.5)`
                            }}
                        >
                            ETH → USDC
                        </button>
                        <button
                            onClick={() => { setSwapDirection('BtoA'); setSwapAmount(100000); }}
                            className="flex-1 py-2 text-sm font-bold transition-colors"
                            style={{
                                backgroundColor: swapDirection === 'BtoA' ? `${SKY}15` : BG,
                                color: swapDirection === 'BtoA' ? SKY : MUTED,
                                border: swapDirection === 'BtoA' ? `1px solid ${SKY}` : `1px solid rgba(83,68,52,0.5)`
                            }}
                        >
                            USDC → ETH
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-4">
                            <span style={{ color: MUTED }}>Amount to Swap</span>
                            <span className="font-terminal font-bold" style={{ color: TEXT }}>
                                {swapAmount.toLocaleString()} {swapDirection === 'AtoB' ? 'ETH' : 'USDC'}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max={maxSlider}
                            step={swapDirection === 'AtoB' ? 10 : 1000}
                            value={swapAmount}
                            onChange={(e) => setSwapAmount(Number(e.target.value))}
                            className="w-full"
                            style={{ accentColor: swapDirection === 'AtoB' ? EMERALD : SKY }}
                        />
                    </div>

                    <div className="space-y-3 p-4 rounded-sm text-sm" style={{ backgroundColor: BG }}>
                        <div className="flex justify-between items-center">
                            <span style={{ color: MUTED }}>Expected Output</span>
                            <span className="font-terminal font-bold" style={{ color: TEXT }}>
                                {preview.amountOut.toFixed(2)} {swapDirection === 'AtoB' ? 'USDC' : 'ETH'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span style={{ color: MUTED }}>Price Impact</span>
                            <span className="font-terminal font-bold" style={{ color: preview.priceImpactPct > 5 ? ROSE : preview.priceImpactPct > 2 ? AMBER : EMERALD }}>
                                {preview.priceImpactPct.toFixed(2)}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span style={{ color: MUTED }}>Slippage</span>
                            <span className="font-terminal font-bold" style={{ color: preview.slippagePct > 5 ? ROSE : preview.slippagePct > 1 ? AMBER : EMERALD }}>
                                {preview.slippagePct.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        onClick={handleSwap}
                        className="clip-button flex-1 py-3 text-sm font-bold transition-all"
                        style={{ backgroundColor: EMERALD, color: BG, boxShadow: `0 0 15px ${EMERALD}40` }}
                    >
                        Execute Swap
                    </button>
                    <button
                        onClick={amm.reset}
                        className="p-3 transition-colors rounded-sm hover:scale-105"
                        style={{ backgroundColor: BG, border: `1px solid rgba(83,68,52,0.5)`, color: MUTED }}
                        title="Reset Pool"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* FORMULA AND HISTORY */}
            <div className="lg:col-span-2 mt-2">
                <div className="p-4 font-terminal text-sm md:text-base flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ backgroundColor: '#191b25' }}>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span style={{ color: EMERALD }}>x</span>
                            <span style={{ color: MUTED }}>*</span>
                            <span style={{ color: SKY }}>y</span>
                            <span style={{ color: MUTED }}>=</span>
                            <span style={{ color: TEXT }}>k</span>
                        </div>
                        <div className="text-xs" style={{ color: MUTED }}>
                            <span style={{ color: EMERALD }}>{Math.floor(amm.poolA).toLocaleString()}</span> *{' '}
                            <span style={{ color: SKY }}>{Math.floor(amm.poolB).toLocaleString()}</span> ={' '}
                            <span style={{ color: TEXT }}>{Math.floor(amm.k).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 max-w-sm overflow-x-auto scrollbar-hide">
                        {amm.history.slice(-3).map((h, i) => (
                            <div key={i} className="text-xs p-2 whitespace-nowrap" style={{ backgroundColor: BG, border: `1px solid rgba(83,68,52,0.2)` }}>
                                <span style={{ color: h.direction === 'A→B' ? EMERALD : SKY }}>{h.direction}</span>{' '}
                                <span style={{ color: MUTED }}>{Math.floor(h.amountOut)} out</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ILCalculator({ multiplier, setMultiplier, result }) {
    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto" style={{ backgroundColor: SURFACE, borderLeft: `3px solid ${ROSE}` }}>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: TEXT }}>
                Impermanent Loss Math
            </h3>
            <p className="text-sm mb-10" style={{ color: MUTED }}>
                What happens to your liquidity pool deposit when the underlying token prices change significantly.
            </p>

            {/* PRESETS */}
            <div className="mb-10">
                <div className="flex justify-between text-sm mb-4">
                    <span style={{ color: MUTED }}>Price Change Multiplier</span>
                    <span className="font-terminal font-bold" style={{ color: multiplier !== 1 ? ROSE : TEXT }}>{multiplier.toFixed(2)}x</span>
                </div>

                <input
                    type="range"
                    min="0.1" max="5.0" step="0.1"
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    className="w-full mb-6"
                    style={{ accentColor: ROSE }}
                />

                <div className="flex flex-wrap gap-2">
                    {IL_PRESETS.map(preset => (
                        <button
                            key={preset.label}
                            onClick={() => setMultiplier(preset.multiplier)}
                            className="px-3 py-1.5 text-xs font-bold transition-colors"
                            style={{
                                backgroundColor: multiplier === preset.multiplier ? `${ROSE}15` : BG,
                                color: multiplier === preset.multiplier ? ROSE : MUTED,
                                border: multiplier === preset.multiplier ? `1px solid ${ROSE}` : `1px solid rgba(83,68,52,0.3)`
                            }}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* BARS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* HELD */}
                <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: MUTED }}>If You HELD</h4>
                    <p className="text-3xl font-terminal font-bold" style={{ color: TEXT }}>${result.holdValue.toLocaleString()}</p>
                    <div className="h-6 w-full rounded-sm overflow-hidden" style={{ backgroundColor: BG }}>
                        <motion.div
                            className="h-full"
                            style={{ backgroundColor: EMERALD, width: `100%` }}
                        />
                    </div>
                </div>

                {/* LP'd */}
                <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: MUTED }}>If You LP'd</h4>
                    <p className="text-3xl font-terminal font-bold" style={{ color: TEXT }}>${result.lpValue.toLocaleString()}</p>
                    <div className="h-6 w-full rounded-sm overflow-hidden" style={{ backgroundColor: BG }}>
                        <motion.div
                            className="h-full"
                            style={{ backgroundColor: SKY }}
                            initial={{ width: '100%' }}
                            animate={{ width: `${(result.lpValue / result.holdValue) * 100}%` }}
                            transition={{ type: 'spring', bounce: 0 }}
                        />
                    </div>
                </div>
            </div>

            {/* RESULT */}
            <div className="p-6 relative overflow-hidden" style={{ backgroundColor: `${ROSE}10`, border: `1px solid ${ROSE}40` }}>
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: ROSE }}>Impermanent Loss</p>
                        <p className="text-4xl font-terminal font-bold" style={{ color: ROSE }}>{result.ilPercent}%</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-terminal" style={{ color: TEXT }}>Difference: <span style={{ color: ROSE }}>-${result.difference.toLocaleString()}</span></p>
                        <p className="text-xs mt-1 max-w-xs" style={{ color: MUTED }}>
                            You missed out on ${result.difference.toFixed(2)} compared to just holding the underlying tokens in your wallet.
                        </p>
                    </div>
                </div>
                {result.ilPercent > 10 && (
                    <AlertTriangle className="absolute -bottom-10 -right-10 w-48 h-48 opacity-[0.05]" style={{ color: ROSE }} />
                )}
            </div>

            <div className="mt-4 p-4 font-terminal text-xs" style={{ backgroundColor: BG, color: MUTED }}>
                IL = 2 * √(price_ratio) / (1 + price_ratio) - 1
            </div>
        </div>
    );
}

function LendingSimulator({ lending }) {
    const isWarn = lending.healthFactor > 1 && lending.healthFactor < 1.5;
    const healthColor = lending.isLiquidatable ? ROSE : isWarn ? AMBER : EMERALD;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ACTIONS */}
            <div className="p-6 md:p-8 space-y-8" style={{ backgroundColor: SURFACE, borderLeft: `3px solid ${AMBER}` }}>
                {/* Deposit Collateral */}
                <div className={lending.isLiquidated ? 'opacity-50 pointer-events-none' : ''}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: MUTED }}>Deposit Collateral (ETH)</h3>
                    <div className="flex gap-4">
                        <button onClick={() => lending.deposit(1)} className="clip-button flex-1 py-2 text-sm font-bold" style={{ backgroundColor: `${AMBER}15`, color: AMBER, border: `1px solid ${AMBER}` }}>+ 1 ETH</button>
                        <button onClick={() => lending.deposit(5)} className="clip-button flex-1 py-2 text-sm font-bold" style={{ backgroundColor: `${AMBER}15`, color: AMBER, border: `1px solid ${AMBER}` }}>+ 5 ETH</button>
                    </div>
                </div>

                {/* Borrow USDC */}
                <div className={lending.isLiquidated ? 'opacity-50 pointer-events-none' : ''}>
                    <h3 className="text-sm font-bold uppercase tracking-wider flex justify-between mb-4" style={{ color: MUTED }}>
                        <span>Borrow USDC</span>
                        <span>Max Avail: <span style={{ color: SKY }}>${lending.maxBorrow.toLocaleString()}</span></span>
                    </h3>
                    <div className="flex gap-4">
                        <button
                            onClick={() => lending.borrow(1000)}
                            disabled={lending.maxBorrow < 1000}
                            className="clip-button flex-1 py-2 text-sm font-bold transition-opacity"
                            style={{ backgroundColor: `${SKY}15`, color: SKY, border: `1px solid ${SKY}`, opacity: lending.maxBorrow < 1000 ? 0.3 : 1 }}
                        >
                            Borrow $1K
                        </button>
                        <button
                            onClick={() => lending.borrow(lending.maxBorrow)}
                            disabled={lending.maxBorrow <= 0}
                            className="clip-button flex-1 py-2 text-sm font-bold transition-opacity"
                            style={{ backgroundColor: `${SKY}15`, color: SKY, border: `1px solid ${SKY}`, opacity: lending.maxBorrow <= 0 ? 0.3 : 1 }}
                        >
                            Borrow Max
                        </button>
                    </div>
                </div>

                {/* Simulate Price Change */}
                <div className={lending.isLiquidated ? 'opacity-50 pointer-events-none' : ''}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex justify-between" style={{ color: MUTED }}>
                        <span>Simulate ETH Price</span>
                        <span className="font-terminal font-bold" style={{ color: TEXT }}>${lending.collateralPrice}</span>
                    </h3>
                    <input
                        type="range" min="500" max="6000" step="50"
                        value={lending.collateralPrice}
                        onChange={(e) => lending.setPrice(Number(e.target.value))}
                        className="w-full"
                        style={{ accentColor: TEXT }}
                    />
                    <div className="flex justify-between text-xs mt-2" style={{ color: MUTED }}>
                        <span>Crash</span>
                        <span>Moon</span>
                    </div>
                </div>

                <div className="flex gap-4 pt-4 border-t" style={{ borderColor: 'rgba(83,68,52,0.2)' }}>
                    <button
                        onClick={lending.liquidate}
                        disabled={!lending.isLiquidatable}
                        className="clip-button flex-1 py-3 text-sm font-bold transition-all flex justify-center items-center gap-2"
                        style={{ backgroundColor: lending.isLiquidatable ? ROSE : BG, color: lending.isLiquidatable ? BG : MUTED, border: `1px solid ${lending.isLiquidatable ? ROSE : 'rgba(83,68,52,0.5)'}` }}
                    >
                        <ShieldAlert className="w-4 h-4" />
                        Trigger Liquidation
                    </button>
                    <button
                        onClick={lending.reset}
                        className="p-3 transition-colors hover:scale-105 rounded-sm"
                        style={{ backgroundColor: BG, color: MUTED, border: `1px solid rgba(83,68,52,0.5)` }}
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* STATE & LOGS */}
            <div className="flex flex-col gap-6">

                {/* Health Card */}
                <motion.div
                    animate={lending.isLiquidatable ? { scale: [1, 1.02, 1], borderColor: [SURFACE_H, ROSE, SURFACE_H] } : {}}
                    transition={{ repeat: lending.isLiquidatable ? Infinity : 0, duration: 1.5 }}
                    className="p-6 border relative overflow-hidden"
                    style={{ backgroundColor: SURFACE, borderColor: 'rgba(83,68,52,0.5)' }}
                >
                    {lending.isLiquidated && (
                        <div className="absolute inset-0 bg-red-900 bg-opacity-20 z-0 text-center flex items-center justify-center">
                            <span className="text-6xl font-black opacity-30 rotate-[-15deg] uppercase" style={{ color: ROSE }}>Liquidated</span>
                        </div>
                    )}

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-lg font-bold" style={{ color: TEXT }}>Position Health</h3>
                            <div className="px-3 py-1 font-bold text-xs rounded-sm uppercase tracking-widest"
                                style={{ backgroundColor: `${healthColor}20`, color: healthColor }}>
                                {lending.isLiquidated ? 'LIQUIDATED' : lending.isLiquidatable ? 'DANGER' : isWarn ? 'WARNING' : 'SAFE'}
                            </div>
                        </div>

                        <div className="space-y-4 mb-6 text-sm">
                            <div className="flex justify-between">
                                <span style={{ color: MUTED }}>Collateral</span>
                                <span className="font-terminal font-bold" style={{ color: TEXT }}>{lending.collateralAmount.toFixed(4)} ETH (${lending.collateralValue.toLocaleString()})</span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: MUTED }}>Borrowed</span>
                                <span className="font-terminal font-bold" style={{ color: TEXT }}>{lending.borrowedAmount.toFixed(2)} USDC</span>
                            </div>
                        </div>

                        <div className="p-4" style={{ backgroundColor: BG }}>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs uppercase tracking-widest font-bold" style={{ color: MUTED }}>Health Factor</span>
                                <span className="font-terminal text-2xl font-bold" style={{ color: healthColor }}>
                                    {lending.healthFactor === Infinity ? '∞' : lending.healthFactor.toFixed(2)}
                                </span>
                            </div>
                            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: SURFACE_H }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    initial={{ width: '100%' }}
                                    animate={{ width: lending.healthFactor === Infinity ? '100%' : `${Math.min(100, Math.max(0, (lending.healthFactor / 3) * 100))}%` }}
                                    style={{ backgroundColor: healthColor }}
                                    transition={{ type: 'spring', bounce: 0 }}
                                />
                            </div>
                            <div className="flex justify-between text-xs mt-2" style={{ color: MUTED }}>
                                <span>Ratio: {lending.collateralRatio === Infinity ? '∞' : `${Math.round(lending.collateralRatio)}%`}</span>
                                <span>Liq threshold: {lending.LIQUIDATION_THRESHOLD}%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Logs Terminal */}
                <div className="flex-1 p-4 font-terminal text-xs overflow-y-auto max-h-64" style={{ backgroundColor: '#0c0e17', borderTop: `1px solid rgba(83,68,52,0.3)` }}>
                    <div className="mb-2" style={{ color: MUTED }}>// Lending Protocol Simulation Logs</div>
                    <div className="space-y-1.5 flex flex-col justify-end min-h-full">
                        {lending.logs.map((log, i) => (
                            <div key={i} className="flex gap-2">
                                <span style={{ color: MUTED }}>&gt;</span>
                                <span style={{ color: log.type === 'danger' ? ROSE : log.type === 'warn' ? AMBER : TEXT }}>
                                    {log.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function GlossaryGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEFI_GLOSSARY.map((item, idx) => (
                <div key={idx} className="group perspective-1000 aspect-[1.2]">
                    <motion.div
                        className="relative w-full h-full duration-500 preserve-3d group-hover:my-rotate-y-180"
                        style={{ border: `1px solid rgba(83,68,52,0.3)` }}
                    >
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden flex flex-col justify-center items-center p-6 text-center" style={{ backgroundColor: SURFACE }}>
                            <div className="w-10 h-10 rounded-full mb-4 flex items-center justify-center opacity-20" style={{ backgroundColor: SKY }}>
                                <TrendingUp className="w-5 h-5" style={{ color: SKY }} />
                            </div>
                            <h3 className="text-xl font-bold mb-4" style={{ color: TEXT }}>{item.term}</h3>
                            <p className="text-xs uppercase tracking-widest" style={{ color: MUTED }}>Hover to flip</p>
                        </div>

                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden my-rotate-y-180 flex flex-col justify-center p-6" style={{ backgroundColor: SURFACE_H }}>
                            <h4 className="text-sm font-bold mb-2 uppercase tracking-wider" style={{ color: SKY }}>Definition</h4>
                            <p className="text-sm mb-4 leading-relaxed" style={{ color: TEXT }}>{item.definition}</p>
                            <h4 className="text-sm font-bold mb-2 uppercase tracking-wider" style={{ color: AMBER }}>Example</h4>
                            <p className="text-sm italic" style={{ color: MUTED }}>"{item.example}"</p>
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    );
}
