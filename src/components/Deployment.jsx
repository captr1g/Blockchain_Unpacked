import { useState, useEffect } from 'react';
import Scene3D from './Scene3D';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Code, Cpu, Droplet, Wallet, Send, CheckCircle, ExternalLink, Hash, Database } from 'lucide-react';
import { keccak256, toHex, stringToBytes, encodeAbiParameters, parseAbiParameters } from 'viem';

const BG = '#11131d';
const SURFACE = '#1d1f2a';
const SURFACE_H = '#282934';
const AMBER = '#f59e0b';
const ROSE = '#fb7185';
const EMERALD = '#4ade80';
const SKY = '#38bdf8';
const TEXT = '#f1f5f9';
const MUTED = '#64748b';

const TABS = [
    { id: 'deploy', label: '🌐 Networks & Deployment', color: EMERALD },
    { id: 'anatomy', label: '📋 Tx Anatomy', color: SKY },
    { id: 'lifecycle', label: '♻️ Contract Lifecycle', color: AMBER },
];

import Quiz from './Quiz';

export default function Deployment() {
    const [activeTab, setActiveTab] = useState('deploy');

    return (
        <div className="min-h-screen" style={{ color: TEXT }}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
                <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: SKY }}>─── DEPLOYMENT ARCHITECTURE</p>
                    <h1 className="text-5xl font-black tracking-tighter">
                        Deployment &<br />
                        <span style={{ background: `linear-gradient(135deg, ${SKY}, ${EMERALD})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Architecture
                        </span>
                    </h1>
                    <p className="mt-3 text-sm max-w-sm" style={{ color: MUTED }}>
                        From chain IDs to calldata — every detail of how contracts reach the blockchain, verified and live.
                    </p>
                </div>

                {/* 3D globe/node diagram */}
                <div className="hidden lg:flex items-center justify-center relative w-full h-[400px] lg:h-[500px]">
                    <div className="w-full h-full" style={{ cursor: "grab" }}><Scene3D sceneId="deployment" /></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="px-5 py-2 text-sm font-bold transition-all duration-200"
                        style={{
                            backgroundColor: activeTab === tab.id ? `${tab.color}22` : SURFACE,
                            color: activeTab === tab.id ? tab.color : MUTED,
                            border: `1px solid ${activeTab === tab.id ? tab.color : 'rgba(83,68,52,0.3)'}`,
                            boxShadow: activeTab === tab.id ? `0 0 14px ${tab.color}33` : 'none',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                        {activeTab === 'deploy' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ChainIdTable />
                                <DeploymentFlow />
                            </div>
                        )}
                        {activeTab === 'anatomy' && <TransactionAnatomy />}
                        {activeTab === 'lifecycle' && <LifecycleDiagram />}
                    </motion.div>
                </AnimatePresence>
            </div>

            <Quiz sectionId="deployment" />
        </div>
    );
}

function ChainIdTable() {
    const chains = [
        { name: 'Ethereum Mainnet', id: 1, type: 'MAINNET', color: AMBER },
        { name: 'Sepolia', id: 11155111, type: 'TESTNET', color: SKY },
        { name: 'Holesky', id: 17000, type: 'TESTNET', color: SKY },
        { name: 'Polygon', id: 137, type: 'L2 MAINNET', color: EMERALD },
        { name: 'Avalanche C-Chain', id: 43114, type: 'L1 MAINNET', color: EMERALD },
    ];

    return (
        <div className="p-6" style={{ backgroundColor: SURFACE, borderLeft: `3px solid ${EMERALD}` }}>
            <div className="flex items-center space-x-3 mb-3">
                <Globe className="w-5 h-5" style={{ color: EMERALD }} />
                <h2 className="text-lg font-bold" style={{ color: TEXT }}>Chain IDs & Networks</h2>
            </div>
            <p className="text-sm mb-6" style={{ color: MUTED }}>
                Every blockchain network has a unique Chain ID — preventing replay attacks across networks.
            </p>

            <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {['Network', 'Chain ID', 'Type'].map(h => (
                                <th key={h} className="text-xs font-bold uppercase tracking-widest pb-3 pr-4" style={{ color: MUTED, borderBottom: '1px solid rgba(83,68,52,0.3)' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {chains.map(chain => (
                            <tr
                                key={chain.id}
                                className="group transition-all"
                                style={{ borderBottom: '1px solid rgba(83,68,52,0.18)' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = SURFACE_H}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <td className="py-3 pr-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-0.5 h-4 group-hover:opacity-100 opacity-0 transition-opacity" style={{ backgroundColor: chain.color }} />
                                        <span className="text-sm font-medium" style={{ color: TEXT }}>{chain.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 pr-4">
                                    <span className="font-terminal text-xs" style={{ color: MUTED }}>{chain.id}</span>
                                </td>
                                <td className="py-3">
                                    <span className="text-xs font-bold px-2 py-1" style={{ backgroundColor: `${chain.color}18`, color: chain.color }}>
                                        {chain.type}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function DeploymentFlow() {
    const [step, setStep] = useState(0);
    const steps = [
        { id: 1, title: 'Write Code', icon: <Code className="w-4 h-4" />, desc: 'Draft Smart Contract in Remix/VS Code' },
        { id: 2, title: 'Compile', icon: <Cpu className="w-4 h-4" />, desc: 'Convert Solidity to Bytecode & ABI' },
        { id: 3, title: 'Get Faucet', icon: <Droplet className="w-4 h-4" />, desc: 'Request Testnet ETH from Faucet' },
        { id: 4, title: 'Connect Wallet', icon: <Wallet className="w-4 h-4" />, desc: 'Connect MetaMask to Testnet' },
        { id: 5, title: 'Deploy', icon: <Send className="w-4 h-4" />, desc: 'Send Creation Transaction' },
        { id: 6, title: 'Confirmed', icon: <CheckCircle className="w-4 h-4" />, desc: 'Contract Live on Blockchain!' },
    ];

    return (
        <div className="p-6" style={{ backgroundColor: SURFACE, borderLeft: `3px solid ${AMBER}` }}>
            <div className="flex items-center space-x-3 mb-3">
                <Send className="w-5 h-5" style={{ color: AMBER }} />
                <h2 className="text-lg font-bold" style={{ color: TEXT }}>Deployment Simulator</h2>
            </div>

            {/* Progress bar */}
            <div className="mb-6 relative h-1 rounded-full overflow-hidden" style={{ backgroundColor: SURFACE_H }}>
                <motion.div
                    animate={{ width: `${(step / steps.length) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 120 }}
                    className="absolute h-full"
                    style={{ backgroundColor: AMBER, boxShadow: `0 0 8px ${AMBER}44` }}
                />
            </div>

            {/* Vertical step list */}
            <div className="relative space-y-2 mb-6">
                <div className="absolute left-5 top-5 bottom-5 w-px" style={{ backgroundColor: 'rgba(83,68,52,0.3)' }} />
                {steps.map((s) => {
                    const done = step > s.id;
                    const active = step === s.id;
                    const inactive = step < s.id;
                    return (
                        <motion.div
                            key={s.id}
                            animate={{ opacity: inactive ? 0.35 : 1 }}
                            className="flex items-center space-x-4 py-2 relative"
                        >
                            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full relative z-10 transition-all"
                                style={{
                                    backgroundColor: done ? `${EMERALD}22` : active ? `${AMBER}22` : SURFACE_H,
                                    border: `2px solid ${done ? EMERALD : active ? AMBER : 'rgba(83,68,52,0.3)'}`,
                                    color: done ? EMERALD : active ? AMBER : MUTED,
                                    boxShadow: active ? `0 0 14px ${AMBER}44` : 'none',
                                }}>
                                {done ? <CheckCircle className="w-4 h-4" /> : s.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold" style={{ color: done ? EMERALD : active ? AMBER : MUTED }}>{s.title}</h3>
                                <p className="text-xs" style={{ color: MUTED }}>{s.desc}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
                <button
                    onClick={() => { if (step < steps.length) setStep(step + 1); else setStep(0); }}
                    className="flex-1 clip-button py-3 font-bold text-sm transition-all"
                    style={{
                        backgroundColor: step === steps.length ? ROSE : AMBER,
                        color: '#11131d',
                        boxShadow: `0 0 16px ${step === steps.length ? ROSE : AMBER}44`,
                    }}
                >
                    {step === 0 ? '▶ Start Deployment' : step === steps.length ? '↺ Reset' : 'Next Step →'}
                </button>
            </div>

            {/* Success banner */}
            {step === steps.length && (
                <motion.div
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="mt-4 flex justify-between items-center p-4"
                    style={{ backgroundColor: `${EMERALD}15`, border: `1px solid ${EMERALD}44` }}
                >
                    <div>
                        <div className="font-bold text-sm" style={{ color: EMERALD }}>✓ Deployment Successful!</div>
                        <div className="text-xs font-terminal" style={{ color: MUTED }}>Tx: 0x712...932</div>
                    </div>
                    <a href="#" className="flex items-center text-xs font-bold transition-all" style={{ color: SKY }}
                        onMouseEnter={e => e.currentTarget.style.color = TEXT}
                        onMouseLeave={e => e.currentTarget.style.color = SKY}>
                        Etherscan <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                </motion.div>
            )}
        </div>
    );
}

function TransactionAnatomy() {
    const [hoverPart, setHoverPart] = useState(null);
    const [activeTool, setActiveTool] = useState('selector');

    const parts = [
        { id: 'nonce', label: 'Nonce', value: '0x05', desc: 'Transaction count for the sender. Prevents replay attacks.' },
        { id: 'gasPrice', label: 'Gas Price', value: '0x04e3b29200', desc: 'Price per unit of gas (in wei) you are willing to pay.' },
        { id: 'gasLimit', label: 'Gas Limit', value: '0x5208', desc: 'Max gas units willing to consume (21,000 for simple transfers).' },
        { id: 'to', label: 'To', value: '0x123...abc', desc: 'The recipient address or target contract address.' },
        { id: 'value', label: 'Value', value: '0x0de0b6b3a7640000', desc: 'Amount of Ether to send (in wei). 0xde0b... = 1 ETH.' },
        { id: 'data', label: 'Data', value: '0xa9059cbb...', desc: 'Input data. For contract calls: Function Selector + Arguments.' },
        { id: 'v', label: 'v', value: '0x1c', desc: 'Recovery ID for the ECDSA signature.' },
        { id: 'r', label: 'r', value: '0x5f2...', desc: 'First 32 bytes of the ECDSA signature.' },
        { id: 's', label: 's', value: '0x1d3...', desc: 'Second 32 bytes of the ECDSA signature.' },
    ];

    return (
        <div className="p-8" style={{ backgroundColor: SURFACE, borderLeft: `3px solid ${SKY}` }}>
            <div className="flex items-center space-x-3 mb-3">
                <Code className="w-5 h-5" style={{ color: SKY }} />
                <h2 className="text-xl font-bold" style={{ color: TEXT }}>Anatomy of a Transaction</h2>
            </div>
            <p className="text-sm mb-6" style={{ color: MUTED }}>
                When you click "Confirm" in MetaMask, you sign a raw data object. Hover over fields to decode them.
            </p>

            {/* Raw transaction hex display */}
            <div className="p-5 font-terminal text-sm break-all mb-4" style={{ backgroundColor: BG }}>
                <div className="mb-2 text-xs" style={{ color: MUTED }}>// Raw Transaction Data</div>
                <div className="flex flex-wrap gap-1">
                    {parts.map(part => (
                        <span
                            key={part.id}
                            onMouseEnter={() => setHoverPart(part)}
                            onMouseLeave={() => setHoverPart(null)}
                            className="cursor-crosshair transition-all px-1.5 py-0.5 rounded-sm"
                            style={{
                                color: hoverPart?.id === part.id ? '#11131d' : TEXT,
                                backgroundColor: hoverPart?.id === part.id ? SKY : 'transparent',
                                fontWeight: hoverPart?.id === part.id ? 'bold' : 'normal',
                                boxShadow: hoverPart?.id === part.id ? `0 0 10px ${SKY}44` : 'none',
                            }}
                        >
                            {part.value}
                        </span>
                    ))}
                </div>
            </div>

            {/* Info panel */}
            <div style={{ minHeight: '6rem' }} className="mb-6">
                <AnimatePresence mode="wait">
                    {hoverPart ? (
                        <motion.div key="info" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="p-4" style={{ backgroundColor: `${SKY}12`, borderLeft: `3px solid ${SKY}` }}>
                            <h3 className="font-bold mb-1" style={{ color: SKY }}>{hoverPart.label}</h3>
                            <p className="text-sm" style={{ color: MUTED }}>{hoverPart.desc}</p>
                        </motion.div>
                    ) : (
                        <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center justify-center h-full italic text-sm"
                            style={{ color: MUTED }}>
                            ↑ Hover over any hex field to interpret it
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Decode tools */}
            <div style={{ borderTop: '1px solid rgba(83,68,52,0.3)' }} className="pt-6">
                <h3 className="text-sm font-bold mb-4" style={{ color: TEXT }}>Decode the "Data" Field</h3>
                <div className="flex space-x-2 mb-4">
                    {[{ id: 'selector', label: 'Function Selector', icon: <Hash className="w-4 h-4" /> },
                    { id: 'decoder', label: 'Argument Encoder', icon: <Database className="w-4 h-4" /> }].map(t => (
                        <button key={t.id} onClick={() => setActiveTool(t.id)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-bold transition-all"
                            style={{
                                backgroundColor: activeTool === t.id ? SURFACE_H : 'transparent',
                                color: activeTool === t.id ? TEXT : MUTED,
                                border: `1px solid ${activeTool === t.id ? AMBER : 'rgba(83,68,52,0.3)'}`,
                            }}>
                            {t.icon}<span>{t.label}</span>
                        </button>
                    ))}
                </div>
                <AnimatePresence mode="wait">
                    {activeTool === 'selector' ? <FunctionSelectorPlayground key="sel" /> : <ArgumentDecoder key="dec" />}
                </AnimatePresence>
            </div>
        </div>
    );
}

function FunctionSelectorPlayground() {
    const [signature, setSignature] = useState('transfer(address,uint256)');
    const [hash, setHash] = useState('');
    const [selector, setSelector] = useState('');

    useEffect(() => {
        try {
            const hashVal = keccak256(toHex(stringToBytes(signature)));
            setHash(hashVal);
            setSelector(hashVal.slice(0, 10));
        } catch {
            setHash('Invalid Signature'); setSelector('????');
        }
    }, [signature]);

    const presets = ['transfer(address,uint256)', 'approve(address,uint256)', 'transferFrom(address,address,uint256)', 'mint(address,uint256)'];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="p-5" style={{ backgroundColor: BG }}>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: MUTED }}>Function Signature</label>
                <input
                    type="text" value={signature} onChange={e => setSignature(e.target.value)}
                    className="w-full p-3 mb-3 font-terminal text-sm focus:outline-none transition-all"
                    style={{ backgroundColor: SURFACE, color: TEXT, border: `1px solid rgba(83,68,52,0.4)`, caretColor: AMBER }}
                    onFocus={e => e.currentTarget.style.borderColor = AMBER}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(83,68,52,0.4)'}
                />
                <div className="flex flex-wrap gap-2 mb-4">
                    {presets.map(p => (
                        <button key={p} onClick={() => setSignature(p)}
                            className="text-xs px-2 py-1 font-terminal transition-all"
                            style={{ backgroundColor: SURFACE_H, color: MUTED, border: '1px solid rgba(83,68,52,0.3)' }}
                            onMouseEnter={e => e.currentTarget.style.color = AMBER}
                            onMouseLeave={e => e.currentTarget.style.color = MUTED}>
                            {p}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3" style={{ backgroundColor: SURFACE }}>
                        <div className="text-xs mb-1" style={{ color: MUTED }}>Keccak-256 Hash</div>
                        <div className="font-terminal text-xs break-all" style={{ color: MUTED }}>{hash}</div>
                    </div>
                    <div className="p-3" style={{ backgroundColor: `${AMBER}15` }}>
                        <div className="text-xs font-bold mb-1" style={{ color: AMBER }}>Method ID (First 4 Bytes)</div>
                        <div className="font-terminal text-2xl font-black" style={{ color: AMBER }}>{selector}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function ArgumentDecoder() {
    const [inputType, setInputType] = useState('uint256');
    const [inputValue, setInputValue] = useState('1000000000000000000');
    const [encoded, setEncoded] = useState('');

    useEffect(() => {
        try {
            const abiType = parseAbiParameters(`${inputType} x`);
            const data = encodeAbiParameters(abiType, [BigInt(inputValue)]);
            setEncoded(data);
        } catch {
            try {
                const abiType = parseAbiParameters(`${inputType} x`);
                const val = inputType === 'bool' ? (inputValue === 'true') : inputValue;
                const data = encodeAbiParameters(abiType, [val]);
                setEncoded(data);
            } catch {
                setEncoded('Error encoding. Check format.');
            }
        }
    }, [inputType, inputValue]);

    const inputStyle = { backgroundColor: SURFACE, color: TEXT, border: '1px solid rgba(83,68,52,0.4)', caretColor: AMBER };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="p-5" style={{ backgroundColor: BG }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: MUTED }}>Type</label>
                        <select value={inputType} onChange={e => setInputType(e.target.value)}
                            className="w-full p-3 font-terminal text-sm focus:outline-none" style={inputStyle}>
                            {['uint256', 'address', 'bool', 'string', 'bytes32'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: MUTED }}>Value</label>
                        <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)}
                            className="w-full p-3 font-terminal text-sm focus:outline-none" style={inputStyle}
                            onFocus={e => e.currentTarget.style.borderColor = AMBER}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(83,68,52,0.4)'}
                        />
                    </div>
                </div>
                <div className="p-4" style={{ backgroundColor: SURFACE }}>
                    <div className="text-xs mb-2" style={{ color: MUTED }}>ABI Encoded (32 Bytes Padded)</div>
                    <div className="font-terminal text-sm break-all" style={{ color: EMERALD }}>{encoded}</div>
                </div>
                <p className="text-xs mt-3" style={{ color: MUTED }}>
                    *Primitive types are padded to 32 bytes. Dynamic types use offset + length + data.
                </p>
            </div>
        </motion.div>
    );
}

function LifecycleDiagram() {
    const stages = [
        { num: 1, title: 'Drafting', desc: 'Writing .sol file in IDE', color: MUTED },
        { num: 2, title: 'Compiling', desc: 'Solidity → Bytecode + ABI', color: SKY },
        { num: 3, title: 'Deployment', desc: 'Send Bytecode to Network', color: AMBER },
        { num: 4, title: 'Active State', desc: 'Immutable Logic on-chain', color: EMERALD },
        { num: 5, title: 'Deprecated', desc: 'Paused or Proxy-upgraded', color: ROSE },
    ];

    return (
        <div className="p-8" style={{ backgroundColor: SURFACE, borderLeft: `3px solid ${AMBER}` }}>
            <h2 className="text-xl font-bold mb-8" style={{ color: TEXT }}>Lifecycle of a Smart Contract</h2>

            <div className="relative">
                <div className="absolute left-5 top-6 bottom-6 w-px" style={{ backgroundColor: 'rgba(83,68,52,0.4)' }} />
                <div className="space-y-4">
                    {stages.map((stage, i) => (
                        <motion.div
                            key={stage.num}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center space-x-5 group"
                        >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 relative z-10 transition-all"
                                style={{ backgroundColor: `${stage.color}22`, border: `2px solid ${stage.color}`, color: stage.color }}>
                                {stage.num}
                            </div>
                            <div className="flex-1 p-4 transition-all"
                                style={{ backgroundColor: SURFACE_H }}
                                onMouseEnter={e => { e.currentTarget.style.borderLeft = `3px solid ${stage.color}`; e.currentTarget.style.paddingLeft = '13px'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderLeft = 'none'; e.currentTarget.style.paddingLeft = '16px'; }}>
                                <h3 className="font-bold text-sm" style={{ color: TEXT }}>{stage.title}</h3>
                                <p className="text-xs" style={{ color: MUTED }}>{stage.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-6 p-4" style={{ backgroundColor: `${ROSE}12`, borderLeft: `3px solid ${ROSE}` }}>
                <h4 className="font-bold text-sm mb-1" style={{ color: ROSE }}>⚠ Immutability Warning</h4>
                <p className="text-xs" style={{ color: MUTED }}>
                    Once deployed (Step 3), the code <strong style={{ color: TEXT }}>cannot be changed</strong>. Bugs require a full new deployment or a Proxy pattern upgrade.
                </p>
            </div>
        </div>
    );
}
