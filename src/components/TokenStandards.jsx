import { useState } from 'react';
import Scene3D from './Scene3D';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Copy, Check, ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';

import { ERC_STANDARDS, TOKEN_COMPARISON, DECISION_TREE } from '../data/tokenStandards';

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

export default function TokenStandards() {
    const [activeTabId, setActiveTabId] = useState('erc20');
    const [expandedFunc, setExpandedFunc] = useState(null);
    const [copiedContent, setCopiedContent] = useState('');

    // Flowchart state
    const [currentNode, setCurrentNode] = useState('start');

    const activeStandard = ERC_STANDARDS.find(s => s.id === activeTabId) || ERC_STANDARDS[0];

    // Helpers
    const getStandardColor = (id) => {
        if (id === 'erc20') return AMBER;
        if (id === 'erc721') return ROSE;
        if (id === 'erc1155') return EMERALD;
        return SKY;
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedContent(text);
        setTimeout(() => setCopiedContent(''), 2000);
    };

    // Flowchart helpers
    const handleFlowchartChoice = (choiceNode) => {
        if (choiceNode) setCurrentNode(choiceNode);
    };

    const resetFlowchart = () => setCurrentNode('start');

    const currentFlowNode = DECISION_TREE[currentNode];

    return (
        <div className="min-h-screen pb-20" style={{ color: TEXT }}>

            {/* ─── HEADER ────────────────────────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
                <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: AMBER }}>
                        ─── TOKEN STANDARDS
                    </p>
                    <h1 className="text-5xl font-black tracking-tighter" style={{ color: TEXT }}>
                        ERC Token<br />
                        <span className="text-amber-gradient">Standards</span>
                    </h1>
                    <p className="mt-3 text-sm max-w-sm" style={{ color: MUTED }}>
                        Understand the interfaces that power every token on Ethereum. From fungible currencies to unique digital assets.
                    </p>
                </div>

                {/* 3D abstract tokens illustration */}
                <div className="hidden lg:flex items-center justify-center relative w-full h-[400px] lg:h-[500px] xl:h-[600px]">
                    <div className="w-full h-full" style={{ cursor: "grab" }}><Scene3D sceneId="tokens" /></div>
                </div>
            </div>

            {/* ─── TAB BAR ───────────────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-2 mb-6">
                {ERC_STANDARDS.map((std) => {
                    const isSelected = activeTabId === std.id;
                    const color = getStandardColor(std.id);
                    return (
                        <button
                            key={std.id}
                            onClick={() => { setActiveTabId(std.id); setExpandedFunc(null); }}
                            className="clip-button px-6 py-2.5 text-sm font-bold transition-all duration-300"
                            style={{
                                backgroundColor: isSelected ? color : 'transparent',
                                color: isSelected ? BG : color,
                                border: isSelected ? `1px solid ${color}` : `1px solid rgba(83,68,52,0.5)`,
                                boxShadow: isSelected ? `0 0 15px ${color}40` : 'none'
                            }}
                        >
                            {std.name}
                        </button>
                    );
                })}
            </div>

            {/* ─── TAB CONTENT (EXPLORER) ────────────────────────────────────────── */}
            <motion.div
                key={activeTabId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-12 p-6 md:p-8"
                style={{
                    backgroundColor: SURFACE,
                    borderLeft: `3px solid ${getStandardColor(activeStandard.id)}`
                }}
            >
                <div>
                    <h2 className="text-2xl font-bold mb-2">{activeStandard.title}</h2>
                    <p className="text-sm mb-6" style={{ color: MUTED }}>{activeStandard.description}</p>

                    <div className="flex flex-wrap gap-6 mb-8 text-sm">
                        <div>
                            <span className="block mb-2 font-bold uppercase tracking-wider text-xs" style={{ color: MUTED }}>Use Cases</span>
                            <div className="flex flex-wrap gap-2">
                                {activeStandard.useCases.map(uc => (
                                    <span key={uc} className="px-2 py-1 flex items-center gap-1.5"
                                        style={{ backgroundColor: `${getStandardColor(activeStandard.id)}15`, color: getStandardColor(activeStandard.id) }}>
                                        {/* <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStandardColor(activeStandard.id) }} /> */}
                                        {uc}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="block mb-2 font-bold uppercase tracking-wider text-xs" style={{ color: MUTED }}>Avg Gas Details</span>
                            <p style={{ color: TEXT }}>{activeStandard.gasEstimate}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: MUTED }}>Function Interface</p>

                    <div className="flex flex-col gap-2">
                        {activeStandard.functions.map((fn, idx) => {
                            const isExpanded = expandedFunc === fn.name;
                            const tColor = getStandardColor(activeStandard.id);

                            return (
                                <div key={fn.name}>
                                    {/* Row Header */}
                                    <button
                                        onClick={() => setExpandedFunc(isExpanded ? null : fn.name)}
                                        className="w-full flex items-center justify-between p-3 transition-colors text-left"
                                        style={{
                                            backgroundColor: isExpanded ? `${tColor}15` : BG,
                                            borderLeft: isExpanded ? `3px solid ${tColor}` : `3px solid transparent`,
                                            border: isExpanded ? `1px solid ${tColor}30` : `1px solid rgba(83,68,52,0.2)`
                                        }}
                                    >
                                        <div className="font-terminal text-sm flex items-center space-x-3">
                                            {isExpanded ? <ChevronDown className="w-4 h-4" style={{ color: tColor }} /> : <ChevronRight className="w-4 h-4" style={{ color: MUTED }} />}
                                            <span style={{ color: isExpanded ? tColor : TEXT }}>{fn.name}</span>
                                        </div>
                                        <div className="hidden sm:block font-terminal text-xs" style={{ color: MUTED }}>
                                            → {fn.returns.split('—')[0].trim()}
                                        </div>
                                    </button>

                                    {/* Expanded Detail Panel */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 sm:p-6 text-sm" style={{ backgroundColor: BG, borderBottom: `1px solid rgba(83,68,52,0.2)` }}>
                                                    {/* Signature */}
                                                    <div className="mb-4">
                                                        <span className="font-terminal font-medium block p-2 whitespace-pre-wrap rounded-sm" style={{ color: SKY, backgroundColor: 'rgba(56,189,248,0.08)' }}>
                                                            {fn.signature}
                                                        </span>
                                                    </div>
                                                    {/* State Variables Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-10 mb-6">
                                                        <div>
                                                            <strong className="block text-xs uppercase tracking-widest mb-2" style={{ color: MUTED }}>Description</strong>
                                                            <p className="leading-relaxed" style={{ color: TEXT }}>{fn.description}</p>

                                                            <div className="mt-4 p-3 flex gap-3 items-start" style={{ backgroundColor: `${AMBER}10`, borderLeft: `2px solid ${AMBER}` }}>
                                                                <span role="img" aria-label="lightbulb">💡</span>
                                                                <p style={{ color: AMBER }}>{fn.analogy}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <strong className="block text-xs uppercase tracking-widest mb-2" style={{ color: MUTED }}>Parameters</strong>
                                                            {fn.params.length === 0 ? (
                                                                <p style={{ color: MUTED }}><em>None</em></p>
                                                            ) : (
                                                                <ul className="space-y-2">
                                                                    {fn.params.map((p, i) => (
                                                                        <li key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                                                            <span className="font-terminal" style={{ color: SKY }}>{p.name}</span>
                                                                            <span className="font-terminal text-xs px-1" style={{ backgroundColor: SURFACE_H, color: MUTED }}>{p.type}</span>
                                                                            <span style={{ color: MUTED }}>— {p.desc}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}

                                                            <strong className="block text-xs uppercase tracking-widest mt-4 mb-2" style={{ color: MUTED }}>Returns</strong>
                                                            <p style={{ color: TEXT }} className="font-terminal text-sm">{fn.returns}</p>
                                                        </div>
                                                    </div>

                                                    {/* Code Example */}
                                                    <div className="relative mt-2">
                                                        <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: SURFACE_H, borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                                                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: MUTED }}>Solidity Example</span>
                                                            <button
                                                                onClick={() => handleCopy(fn.example)}
                                                                className="hover:scale-110 transition-transform"
                                                                style={{ color: copiedContent === fn.example ? EMERALD : MUTED }}
                                                                title="Copy code"
                                                            >
                                                                {copiedContent === fn.example ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                        <pre className="p-4 overflow-x-auto font-terminal text-sm" style={{ backgroundColor: '#000000', color: TEXT, borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px' }}>
                                                            <code>{fn.example}</code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            {/* ─── COMPARISON TABLE ──────────────────────────────────────────────── */}
            <div className="mb-16">
                <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: SKY }}>─── AT A GLANCE</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest" style={{ color: MUTED, backgroundColor: SURFACE_H, borderBottom: `1px solid rgba(83,68,52,0.5)` }}>Property</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest" style={{ color: AMBER, backgroundColor: SURFACE_H, borderBottom: `1px solid rgba(83,68,52,0.5)` }}>ERC-20</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest" style={{ color: ROSE, backgroundColor: SURFACE_H, borderBottom: `1px solid rgba(83,68,52,0.5)` }}>ERC-721</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-widest" style={{ color: EMERALD, backgroundColor: SURFACE_H, borderBottom: `1px solid rgba(83,68,52,0.5)` }}>ERC-1155</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TOKEN_COMPARISON.map((row, i) => (
                                <tr key={row.property} style={{ backgroundColor: i % 2 === 0 ? SURFACE : BG, borderBottom: `1px solid rgba(83,68,52,0.15)` }}>
                                    <td className="p-4 text-sm font-medium" style={{ color: TEXT }}>{row.property}</td>
                                    <td className="p-4 text-sm" style={{ color: MUTED }}>{row.erc20}</td>
                                    <td className="p-4 text-sm" style={{ color: MUTED }}>{row.erc721}</td>
                                    <td className="p-4 text-sm font-medium" style={{ color: EMERALD }}>
                                        {row.erc1155.includes('Yes') ? <span className="flex items-center gap-1">{row.erc1155} <Check className="w-3 h-3" /></span> : row.erc1155}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── DECISION FLOWCHART ────────────────────────────────────────────── */}
            <div className="pt-8 mb-10 border-t" style={{ borderColor: 'rgba(83,68,52,0.2)' }}>
                <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: PURPLE }}>─── DECISION ASSISTANT</p>
                <h2 className="text-3xl font-bold mb-8" style={{ color: TEXT }}>Which standard should I use?</h2>

                <div className="p-8 sm:p-12 relative flex flex-col items-center text-center max-w-2xl mx-auto" style={{ backgroundColor: SURFACE, border: `1px solid rgba(83,68,52,0.5)` }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentNode}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            {!currentFlowNode.result ? (
                                <div>
                                    <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center rounded-full" style={{ backgroundColor: `${SKY}15`, color: SKY }}>
                                        <Coins className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-10 max-w-sm mx-auto leading-tight" style={{ color: TEXT }}>
                                        {currentFlowNode.question}
                                    </h3>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                        <button
                                            onClick={() => handleFlowchartChoice(currentFlowNode.yes)}
                                            className="clip-button px-8 py-3 font-bold transition-all emerald-glow"
                                            style={{ backgroundColor: EMERALD, color: BG }}
                                        >
                                            YES
                                        </button>
                                        <button
                                            onClick={() => handleFlowchartChoice(currentFlowNode.no)}
                                            className="clip-button px-8 py-3 font-bold transition-all rose-glow"
                                            style={{ backgroundColor: ROSE, color: BG }}
                                        >
                                            NO
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: MUTED }}>Recommended Standard</h3>
                                    <div className="text-5xl font-black mb-6 clip-button inline-block px-8 py-4"
                                        style={{
                                            color: getStandardColor(currentFlowNode.result.toLowerCase().replace('-', '')),
                                            backgroundColor: `${getStandardColor(currentFlowNode.result.toLowerCase().replace('-', ''))}15`,
                                            border: `2px solid ${getStandardColor(currentFlowNode.result.toLowerCase().replace('-', ''))}`
                                        }}>
                                        {currentFlowNode.result}
                                    </div>
                                    <p className="text-lg mx-auto mb-10 max-w-sm" style={{ color: MUTED }}>
                                        {currentFlowNode.reason}
                                    </p>
                                    <button
                                        onClick={resetFlowchart}
                                        className="flex items-center justify-center mx-auto space-x-2 text-sm font-bold uppercase tracking-wider transition-colors hover:scale-105"
                                        style={{ color: SKY }}
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        <span>Start Over</span>
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <Quiz sectionId="tokens" />
        </div>
    );
}
