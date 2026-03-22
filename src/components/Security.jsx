import { useState, useEffect } from 'react';
import Scene3D from './Scene3D';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Skull, RefreshCw, Terminal, AlertTriangle, Lock, Shuffle, BookOpen, Zap, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft, Play } from 'lucide-react';

import { FLASH_LOAN_STEPS, FLASH_LOAN_VULNERABLE_CODE, FLASH_LOAN_FIXED_CODE, FLASH_LOAN_MITIGATIONS } from '../data/flashLoan';

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

const TABS = [
    { id: 'reentrancy', label: 'Reentrancy', icon: <ShieldAlert className="w-4 h-4" />, color: ROSE },
    { id: 'flashloan', label: 'Flash Loans', icon: <Zap className="w-4 h-4" />, color: SKY },
    { id: 'access', label: 'Access Control', icon: <Lock className="w-4 h-4" />, color: EMERALD },
    { id: 'overflow', label: 'Overflow/Underflow', icon: <AlertTriangle className="w-4 h-4" />, color: AMBER },
    { id: 'randomness', label: 'Weak Randomness', icon: <Shuffle className="w-4 h-4" />, color: SKY },
    { id: 'toolkit', label: "Auditor's Toolkit", icon: <BookOpen className="w-4 h-4" />, color: PURPLE },
];

const INITIAL_LOGS = [
    { type: 'info', text: '[00:00:00] SYS: Bank initialized with 10.00 ETH' },
    { type: 'info', text: '[00:00:01] SYS: Ready — awaiting interactions.' },
];

import Quiz from './Quiz';

export default function Security() {
    const [activeTab, setActiveTab] = useState('reentrancy');

    return (
        <div className="min-h-screen" style={{ color: TEXT }}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
                <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: ROSE }}>─── SECURITY AUDIT</p>
                    <h1 className="text-5xl font-black tracking-tighter" style={{ color: TEXT }}>
                        Common<br />
                        <span style={{ background: 'linear-gradient(135deg, ' + ROSE + ', ' + AMBER + ')', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Vulnerabilities
                        </span>
                    </h1>
                    <p className="mt-3 text-sm max-w-sm" style={{ color: MUTED }}>
                        Explore and simulate real-world smart contract exploits in a controlled environment.
                    </p>
                </div>

                {/* 3D hacked vault */}
                <div className="hidden lg:flex items-center justify-center relative w-full h-[400px] lg:h-[500px]">
                    <div className="w-full h-full" style={{ cursor: "grab" }}><Scene3D sceneId="security" /></div>
                </div>
            </div>

            {/* Tab bar */}
            <div className="flex flex-wrap gap-2 mb-8">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-bold transition-all duration-200"
                        style={{
                            backgroundColor: activeTab === tab.id ? tab.color + '22' : SURFACE,
                            color: activeTab === tab.id ? tab.color : MUTED,
                            border: '1px solid ' + (activeTab === tab.id ? tab.color : 'rgba(83,68,52,0.3)'),
                            boxShadow: activeTab === tab.id ? '0 0 14px ' + tab.color + '33' : 'none',
                        }}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'reentrancy' ? (
                        <ReentrancyDemo />
                    ) : activeTab === 'flashloan' ? (
                        <FlashLoanDemo />
                    ) : (
                        <PlaceholderTab tab={TABS.find(t => t.id === activeTab)} />
                    )}
                </motion.div>
            </AnimatePresence>

            <Quiz sectionId="security" />
        </div>
    );
}

function ReentrancyDemo() {
    const [studentBalance, setStudentBalance] = useState(1);
    const [hackerBalance, setHackerBalance] = useState(1);
    const [bankBalance, setBankBalance] = useState(10);
    const [bankLedger, setBankLedger] = useState({ student: 0, hacker: 0 });
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [isAttacking, setIsAttacking] = useState(false);

    const addLog = (type, text) => setLogs(prev => [...prev.slice(-20), { type, text }]);

    const handleDeposit = () => {
        if (studentBalance <= 0) { addLog('warn', '[WARN] Insufficient student balance.'); return; }
        setStudentBalance(p => +(p - 1).toFixed(2));
        setBankBalance(p => +(p + 1).toFixed(2));
        setBankLedger(p => ({ ...p, student: +(p.student + 1).toFixed(2) }));
        addLog('info', '[' + time() + '] STD: ' + studentBalance.toFixed(2) + ' ETH deposited to bank contract to +' + (bankBalance + 1).toFixed(2) + ' ETH');
    };

    const handleAttack = async () => {
        if (isAttacking) return;
        setIsAttacking(true);
        addLog('danger', '[' + time() + '] ATK: Hacker initiated deposit+attack sequence');
        setBankBalance(p => +(p + 1).toFixed(2));
        setHackerBalance(p => +(p - 1).toFixed(2));
        await sleep(600);
        addLog('danger', '[' + time() + '] ATK: REENTRANT CALLER DETECTED — exploiting fallback');
        const stolen = bankBalance + 1;
        for (let i = 0; i < 3; i++) {
            await sleep(400);
            addLog('danger', '[' + time() + '] ATK: Re-entering withdraw()...');
        }
        await sleep(500);
        setHackerBalance(p => +(p + stolen).toFixed(2));
        setBankBalance(0);
        setBankLedger({ student: 0, hacker: 0 });
        addLog('danger', '[' + time() + '] ATK: DRAIN SUCCESSFUL — ' + stolen.toFixed(2) + ' ETH stolen');
        setIsAttacking(false);
    };

    const handleReset = () => {
        setStudentBalance(1); setHackerBalance(1); setBankBalance(10);
        setBankLedger({ student: 0, hacker: 0 });
        setLogs(INITIAL_LOGS); setIsAttacking(false);
    };

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left — Attack panel */}
                <div className="p-6" style={{ backgroundColor: SURFACE, borderLeft: '3px solid ' + ROSE }}>
                    <div className="flex items-center space-x-2 mb-4">
                        <ShieldAlert className="w-5 h-5" style={{ color: ROSE }} />
                        <h2 className="font-bold" style={{ color: TEXT }}>The Reentrancy Attack</h2>
                    </div>

                    {/* Student card */}
                    <div className="p-4 mb-4" style={{ backgroundColor: BG, borderLeft: '2px solid ' + EMERALD }}>
                        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: EMERALD }}>1. User Instance: The Student</p>
                        <p className="text-xs mb-3" style={{ color: MUTED }}>Perform a standard deposit to the bank contract to initialize the state.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-mono" style={{ color: TEXT }}>Wallet: <span style={{ color: EMERALD }}>{studentBalance.toFixed(2)} ETH</span></span>
                            <button
                                onClick={handleDeposit}
                                disabled={studentBalance <= 0}
                                className="clip-button px-4 py-2 text-xs font-bold transition-all disabled:opacity-40"
                                style={{ backgroundColor: EMERALD, color: '#11131d', boxShadow: '0 0 12px ' + EMERALD + '44' }}
                            >
                                Deposit 1 ETH →
                            </button>
                        </div>
                    </div>

                    {/* Hacker card */}
                    <div className="p-4 mb-4" style={{ backgroundColor: BG, borderLeft: '2px solid ' + ROSE }}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: ROSE }}>2. Attacker Instance: The Hacker</p>
                            <Skull className="w-4 h-4" style={{ color: ROSE }} />
                        </div>
                        <p className="text-xs mb-3" style={{ color: MUTED }}>Trigger the malicious fallback function to drain the contract vault.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-mono" style={{ color: TEXT }}>Wallet: <span style={{ color: ROSE }}>{hackerBalance.toFixed(2)} ETH</span></span>
                            <button
                                onClick={handleAttack}
                                disabled={isAttacking || bankBalance === 0}
                                className="clip-button px-4 py-2 text-xs font-bold transition-all disabled:opacity-40 relative overflow-hidden"
                                style={{ backgroundColor: ROSE, color: '#11131d', boxShadow: '0 0 16px ' + ROSE + '55', animation: isAttacking ? 'pulse 1s infinite' : 'none' }}
                            >
                                ⚡ {isAttacking ? 'Attacking...' : 'Attack (Drain)'}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleReset}
                        className="w-full py-2 text-xs font-bold transition-all"
                        style={{ color: MUTED, border: '1px solid rgba(83,68,52,0.4)' }}
                        onMouseEnter={e => e.currentTarget.style.color = TEXT}
                        onMouseLeave={e => e.currentTarget.style.color = MUTED}
                    >
                        ↺ Reset Simulation
                    </button>
                </div>

                {/* Right — Monitor */}
                <div className="p-6" style={{ backgroundColor: SURFACE, borderLeft: '3px solid rgba(83,68,52,0.5)' }}>
                    {/* Bank stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3" style={{ backgroundColor: BG }}>
                            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: MUTED }}>Actual Balance</div>
                            <div className="text-xl font-black font-mono" style={{ color: bankBalance === 0 ? ROSE : AMBER }}>
                                {bankBalance.toFixed(2)} ETH
                            </div>
                        </div>
                        <div className="p-3" style={{ backgroundColor: BG }}>
                            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: MUTED }}>Bank Ledger</div>
                            <div className="text-xs font-mono space-y-1">
                                <div style={{ color: EMERALD }}>student: {bankLedger.student.toFixed(2)} ETH</div>
                                <div style={{ color: ROSE }}>hacker: {bankLedger.hacker.toFixed(2)} ETH</div>
                            </div>
                        </div>
                    </div>

                    {/* Terminal */}
                    <div className="p-4 font-terminal text-xs h-52 overflow-y-auto scrollbar-hide" style={{ backgroundColor: BG }}>
                        <div className="text-xs mb-2" style={{ color: MUTED }}>// TERMINAL / DEBUG LOGS</div>
                        {logs.map((log, i) => (
                            <div key={i} className="py-0.5" style={{
                                color: log.type === 'danger' ? ROSE : log.type === 'warn' ? AMBER : EMERALD,
                                borderLeft: '2px solid ' + (log.type === 'danger' ? ROSE : log.type === 'warn' ? AMBER : EMERALD),
                                paddingLeft: 8, marginBottom: 2,
                            }}>
                                {log.text}
                            </div>
                        ))}
                        <span className="cursor-blink" style={{ color: AMBER }}>█</span>
                    </div>
                </div>
            </div>

            {/* Explanation panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5" style={{ backgroundColor: SURFACE }}>
                    <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="w-4 h-4" style={{ color: AMBER }} />
                        <h3 className="font-bold text-sm" style={{ color: TEXT }}>Why It Works</h3>
                    </div>
                    <pre className="text-xs font-terminal p-3 mb-3 overflow-x-auto" style={{ backgroundColor: BG, color: MUTED }}>
                        {`// Vulnerable Function
function withdraw() public {
    uint amount = balances[msg.sender];
    // ❌ External call BEFORE state update
    (bool sent,) = msg.sender.call{value:amount}("");
    require(sent, "Failed");
    balances[msg.sender] = 0; // too late!
}`}
                    </pre>
                    <p className="text-xs" style={{ color: MUTED }}>
                        The attacker's fallback function re-calls <code className="text-amber-400">withdraw()</code> before the balance is zeroed.
                    </p>
                </div>

                <div className="p-5" style={{ backgroundColor: SURFACE, borderLeft: '3px solid ' + EMERALD }}>
                    <div className="flex items-center space-x-2 mb-3">
                        <ShieldCheck className="w-4 h-4" style={{ color: EMERALD }} />
                        <h3 className="font-bold text-sm" style={{ color: TEXT }}>The Fix: CEI Pattern</h3>
                    </div>
                    <pre className="text-xs font-terminal p-3 mb-3 overflow-x-auto" style={{ backgroundColor: BG, color: EMERALD }}>
                        {`// Secure: Checks-Effects-Interactions
function withdraw() public {
    uint amount = balances[msg.sender];
    // ✅ (1) Check
    require(amount > 0, "No balance");
    // ✅ (2) Effect — update state FIRST
    balances[msg.sender] = 0;
    // ✅ (3) Interaction — then external call
    (bool sent,) = msg.sender.call{value:amount}("");
    require(sent, "Failed");
}`}
                    </pre>
                    <div className="flex gap-4 text-xs">
                        {['CHECK', 'EFFECT', 'INTERACT'].map((s, i) => (
                            <div key={s} className="flex-1 text-center py-2 font-bold" style={{ backgroundColor: EMERALD + '15', color: EMERALD }}>
                                {i + 1}. {s}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlaceholderTab({ tab }) {
    if (!tab) return null;
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center" style={{ backgroundColor: SURFACE }}>
            <div className="text-4xl mb-4" style={{ color: tab.color }}>{tab.icon}</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: TEXT }}>{tab.label}</h2>
            <p className="text-sm" style={{ color: MUTED }}>Interactive simulation coming soon.</p>
        </div>
    );
}

function time() {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
}
function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function FlashLoanDemo() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const stepData = FLASH_LOAN_STEPS[currentStep];

    useEffect(() => {
        let timer;
        if (isPlaying) {
            timer = setTimeout(() => {
                if (currentStep < FLASH_LOAN_STEPS.length - 1) {
                    setCurrentStep(prev => prev + 1);
                } else {
                    setIsPlaying(false);
                }
            }, 3000); // 3 seconds per step
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep]);

    const handleNext = () => {
        if (currentStep < FLASH_LOAN_STEPS.length - 1) setCurrentStep(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const handleReset = () => {
        setCurrentStep(0);
        setIsPlaying(false);
    };

    return (
        <div>
            <div className="flex flex-col xl:flex-row gap-6 mb-6">

                {/* Visualizer Panel */}
                <div className="xl:w-2/3 p-6 md:p-8" style={{ backgroundColor: SURFACE, borderLeft: '3px solid ' + SKY }}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div className="flex items-center space-x-2">
                            <Zap className="w-6 h-6" style={{ color: SKY }} />
                            <h2 className="text-2xl font-bold" style={{ color: TEXT }}>Flash Loan Attack</h2>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                                className="p-2 transition-colors disabled:opacity-30"
                                style={{ backgroundColor: BG, color: MUTED, border: '1px solid rgba(83,68,52,0.3)' }}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="px-4 py-2 font-bold text-sm flex items-center gap-2 transition-all"
                                style={{
                                    backgroundColor: isPlaying ? ROSE + '20' : SKY + '20',
                                    color: isPlaying ? ROSE : SKY,
                                    border: '1px solid ' + (isPlaying ? ROSE : SKY)
                                }}
                            >
                                {isPlaying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" fill="currentColor" />}
                                {isPlaying ? 'Auto-Playing...' : 'Play Demo'}
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentStep === FLASH_LOAN_STEPS.length - 1}
                                className="p-2 transition-colors disabled:opacity-30"
                                style={{ backgroundColor: BG, color: MUTED, border: '1px solid rgba(83,68,52,0.3)' }}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Step Description */}
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-10 text-center"
                    >
                        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest mb-3 rounded-sm" style={{ backgroundColor: SKY + '20', color: SKY }}>
                            Step {currentStep + 1} of {FLASH_LOAN_STEPS.length}
                        </span>
                        <h3 className="text-xl font-bold mb-2" style={{ color: TEXT }}>{stepData.title}</h3>
                        <p className="text-sm max-w-xl mx-auto" style={{ color: MUTED }}>{stepData.description}</p>
                    </motion.div>

                    {/* Architecture Diagram */}
                    <div className="relative max-w-2xl mx-auto h-64 md:h-80 border" style={{ backgroundColor: BG, borderColor: 'rgba(83,68,52,0.3)' }}>

                        {/* Connecting Lines */}
                        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                            {/* Attacker to Pool */}
                            <path d="M 50%,20% L 20%,50%" stroke={stepData.highlight === 'attacker' || stepData.highlight === 'pool' ? SKY : 'rgba(83,68,52,0.2)'} strokeWidth="2" fill="none" strokeDasharray={stepData.highlight === 'attacker' || stepData.highlight === 'pool' ? "4 4" : "none"} className={stepData.highlight === 'attacker' || stepData.highlight === 'pool' ? "animate-pulse" : ""} />
                            {/* Attacker to DEX A */}
                            <path d="M 50%,20% L 50%,80%" stroke={stepData.highlight === 'dexA' ? ROSE : 'rgba(83,68,52,0.2)'} strokeWidth="2" fill="none" strokeDasharray={stepData.highlight === 'dexA' ? "4 4" : "none"} className={stepData.highlight === 'dexA' ? "animate-pulse" : ""} />
                            {/* Attacker to DEX B */}
                            <path d="M 50%,20% L 80%,50%" stroke={stepData.highlight === 'dexB' ? EMERALD : 'rgba(83,68,52,0.2)'} strokeWidth="2" fill="none" strokeDasharray={stepData.highlight === 'dexB' ? "4 4" : "none"} className={stepData.highlight === 'dexB' ? "animate-pulse" : ""} />
                        </svg>

                        {/* Nodes */}
                        <div className="absolute inset-0 z-10">
                            {/* Attacker */}
                            <motion.div
                                className="absolute top-[10%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                                animate={{ scale: stepData.highlight === 'attacker' ? 1.1 : 1 }}
                            >
                                <div className="p-4 rounded-full border-2 mb-2 flex items-center justify-center bg-[#191b25]"
                                    style={{ borderColor: stepData.highlight === 'attacker' ? SKY : 'rgba(83,68,52,0.5)', boxShadow: stepData.highlight === 'attacker' ? '0 0 20px ' + SKY + '40' : 'none' }}>
                                    <Skull className="w-8 h-8" style={{ color: stepData.highlight === 'attacker' ? SKY : MUTED }} />
                                </div>
                                <span className="font-bold text-sm tracking-wider" style={{ color: TEXT }}>Attacker</span>
                                <span className="font-terminal text-xs" style={{ color: EMERALD }}>{stepData.balances.attacker.toLocaleString()} ETH</span>
                            </motion.div>

                            {/* Flash Loan Pool */}
                            <motion.div
                                className="absolute top-[50%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                                animate={{ scale: stepData.highlight === 'pool' ? 1.1 : 1 }}
                            >
                                <div className="p-4 rounded-full border-2 mb-2 flex items-center justify-center bg-[#191b25]"
                                    style={{ borderColor: stepData.highlight === 'pool' ? AMBER : 'rgba(83,68,52,0.5)', boxShadow: stepData.highlight === 'pool' ? '0 0 20px ' + AMBER + '40' : 'none' }}>
                                    <ShieldAlert className="w-6 h-6" style={{ color: stepData.highlight === 'pool' ? AMBER : MUTED }} />
                                </div>
                                <span className="font-bold text-sm tracking-wider" style={{ color: TEXT }}>Aave Pool</span>
                                <span className="font-terminal text-xs" style={{ color: EMERALD }}>{stepData.balances.pool.toLocaleString()} ETH</span>
                            </motion.div>

                            {/* DEX A */}
                            <motion.div
                                className="absolute top-[80%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                                animate={{ scale: stepData.highlight === 'dexA' ? 1.1 : 1 }}
                            >
                                <div className="p-4 rounded-full border-2 mb-2 flex items-center justify-center bg-[#191b25]"
                                    style={{ borderColor: stepData.highlight === 'dexA' ? ROSE : 'rgba(83,68,52,0.5)', boxShadow: stepData.highlight === 'dexA' ? '0 0 20px ' + ROSE + '40' : 'none' }}>
                                    <RefreshCw className="w-6 h-6" style={{ color: stepData.highlight === 'dexA' ? ROSE : MUTED }} />
                                </div>
                                <span className="font-bold text-sm tracking-wider" style={{ color: TEXT }}>DEX A</span>
                                <span className="font-terminal text-xs" style={{ color: EMERALD }}>{stepData.balances.dexA.toLocaleString()} ETH</span>
                            </motion.div>

                            {/* DEX B */}
                            <motion.div
                                className="absolute top-[50%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                                animate={{ scale: stepData.highlight === 'dexB' ? 1.1 : 1 }}
                            >
                                <div className="p-4 rounded-full border-2 mb-2 flex items-center justify-center bg-[#191b25]"
                                    style={{ borderColor: stepData.highlight === 'dexB' ? EMERALD : 'rgba(83,68,52,0.5)', boxShadow: stepData.highlight === 'dexB' ? '0 0 20px ' + EMERALD + '40' : 'none' }}>
                                    <RefreshCw className="w-6 h-6" style={{ color: stepData.highlight === 'dexB' ? EMERALD : MUTED }} />
                                </div>
                                <span className="font-bold text-sm tracking-wider" style={{ color: TEXT }}>DEX B</span>
                                <span className="font-terminal text-xs" style={{ color: EMERALD }}>{stepData.balances.dexB.toLocaleString()} ETH</span>
                            </motion.div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-xs font-bold transition-all flex items-center gap-2"
                            style={{ color: MUTED, border: '1px solid rgba(83,68,52,0.4)' }}
                            onMouseEnter={e => e.currentTarget.style.color = TEXT}
                            onMouseLeave={e => e.currentTarget.style.color = MUTED}
                        >
                            <RefreshCw className="w-3 h-3" /> Reset Demo
                        </button>
                    </div>

                </div>

                {/* Explanations & Code Panel */}
                <div className="xl:w-1/3 flex flex-col gap-6">
                    {/* Concept */}
                    <div className="p-6" style={{ backgroundColor: SURFACE, borderLeft: '3px solid ' + AMBER }}>
                        <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-4" style={{ color: AMBER }}>
                            <AlertTriangle className="w-4 h-4" /> Concept
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                            Unlike traditional finance, blockchain transactions process atomically. A Flash Loan allows anyone to borrow millions of dollars without collateral, as long as it's returned in the <strong style={{ color: TEXT }}>exact same transaction</strong>. If it's not returned, the smart contract execution reverts entirely, as if the loan never happened.
                        </p>
                    </div>

                    {/* Mitigations */}
                    <div className="p-6 flex-1" style={{ backgroundColor: SURFACE, borderLeft: '3px solid ' + EMERALD }}>
                        <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-4" style={{ color: EMERALD }}>
                            <ShieldCheck className="w-4 h-4" /> How to Defend
                        </h3>
                        <div className="space-y-4">
                            {FLASH_LOAN_MITIGATIONS.map((m, i) => (
                                <div key={i} className="flex gap-3">
                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: EMERALD }} />
                                    <div>
                                        <div className="font-bold text-sm" style={{ color: TEXT }}>{m.title}</div>
                                        <div className="text-xs mt-1" style={{ color: MUTED }}>{m.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Code Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6" style={{ backgroundColor: SURFACE, borderTop: '3px solid ' + ROSE }}>
                    <div className="flex items-center space-x-2 mb-4">
                        <Skull className="w-4 h-4" style={{ color: ROSE }} />
                        <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: TEXT }}>Vulnerable Code</h3>
                    </div>
                    <pre className="text-xs font-terminal p-4 overflow-x-auto" style={{ backgroundColor: BG, color: MUTED, height: '300px' }}>
                        {FLASH_LOAN_VULNERABLE_CODE}
                    </pre>
                </div>

                <div className="p-6" style={{ backgroundColor: SURFACE, borderTop: '3px solid ' + EMERALD }}>
                    <div className="flex items-center space-x-2 mb-4">
                        <ShieldCheck className="w-4 h-4" style={{ color: EMERALD }} />
                        <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: TEXT }}>Secured Code</h3>
                    </div>
                    <pre className="text-xs font-terminal p-4 overflow-x-auto" style={{ backgroundColor: BG, color: EMERALD, height: '300px' }}>
                        {FLASH_LOAN_FIXED_CODE}
                    </pre>
                </div>
            </div>

        </div>
    );
}
