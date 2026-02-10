import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Lock, Unlock, Zap, AlertTriangle, Code, ArrowRight, CheckCircle, TrendingUp, Dices, ExternalLink } from 'lucide-react';

export default function Security() {
    const [activeTab, setActiveTab] = useState('reentrancy');

    return (
        <div className="min-h-screen text-brand-dark p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-brand-red">Common Vulnerabilities</h1>

                <div className="flex justify-center mb-8 flex-wrap gap-2">
                    <button
                        onClick={() => setActiveTab('reentrancy')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'reentrancy' ? 'bg-brand-red text-white shadow-lg' : 'bg-brand-dark/5 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                    >
                        Reentrancy
                    </button>
                    <button
                        onClick={() => setActiveTab('access')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'access' ? 'bg-brand-green text-white shadow-lg' : 'bg-brand-dark/5 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                    >
                        Access Control
                    </button>
                    <button
                        onClick={() => setActiveTab('overflow')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'overflow' ? 'bg-brand-red text-white shadow-lg' : 'bg-brand-dark/5 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                    >
                        Overflow/Underflow
                    </button>
                    <button
                        onClick={() => setActiveTab('randomness')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'randomness' ? 'bg-brand-dark text-brand-beige shadow-lg' : 'bg-brand-dark/5 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                    >
                        Weak Randomness
                    </button>
                    <button
                        onClick={() => setActiveTab('tools')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'tools' ? 'bg-brand-green text-white shadow-lg' : 'bg-brand-dark/5 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                    >
                        <ShieldAlert className="inline w-4 h-4 mr-2" />
                        Auditor's Toolkit
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'reentrancy' && <ReentrancyDemo />}
                        {activeTab === 'access' && <AccessControlDemo />}
                        {activeTab === 'overflow' && <OverflowUnderflowDemo />}
                        {activeTab === 'randomness' && <WeakRandomnessDemo />}
                        {activeTab === 'tools' && <SecurityTools />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function ReentrancyDemo() {
    const [contractBalance, setContractBalance] = useState(10);
    const [bankLedger, setBankLedger] = useState({ student: 1, hacker: 0 }); // What the bank THINKS it has
    const [hackerWallet, setHackerWallet] = useState(0);
    const [studentWallet, setStudentWallet] = useState(1);
    const [studentDeposited, setStudentDeposited] = useState(false);
    const [isAttacking, setIsAttacking] = useState(false);
    const [logs, setLogs] = useState([]);

    const deposit = () => {
        if (studentWallet > 0) {
            setStudentWallet(0);
            setContractBalance(prev => prev + 1);
            setBankLedger(prev => ({ ...prev, student: 1 }));
            setStudentDeposited(true);
            setLogs(prev => [...prev, `[USER] Deposited 1 ETH. Bank Balance: ${contractBalance + 1}`]);
        }
    };

    const attack = () => {
        if (contractBalance <= 0) return;
        setIsAttacking(true);

        // Initial setup for the attack
        setBankLedger(prev => ({ ...prev, hacker: 1 })); // Hacker simulates a deposit (or flash loan)
        setContractBalance(prev => prev + 1); // Add hacker's deposit to real balance
        setHackerWallet(prev => prev - 1); // Hacker deposits 1 ETH

        setLogs(prev => [...prev, `[ATTACKER] Deposited 1 ETH. calling withdraw()...`]);

        let currentRealBalance = contractBalance + 1; // +1 for the hacker's deposit
        let currentHackerWallet = 0; // Hacker starts with 0 after deposit

        // The Reentrancy Loop
        let calls = 0;
        const maxCalls = 10; // Prevent infinite loop in demo

        const interval = setInterval(() => {
            if (currentRealBalance > 0 && calls < maxCalls) {
                calls++;

                // 1. Bank checks ledger (It thinks hacker still has 1 ETH because it hasn't updated yet!)
                // 2. Bank sends ETH
                currentRealBalance -= 1;
                currentHackerWallet += 1;

                // Visual updates
                setContractBalance(currentRealBalance);
                setHackerWallet(currentHackerWallet);

                setLogs(prev => [
                    ...prev,
                    `[BANK] Sending 1 ETH... (Ledger says Hacker has 1 ETH)`,
                    `[HACKER] fallback() triggered! Re-calling withdraw() before Ledger updates...`
                ]);
            } else {
                clearInterval(interval);
                setIsAttacking(false);
                setBankLedger(prev => ({ ...prev, hacker: 0 })); // Finally, the bank would update the ledger (too late!)
                setLogs(prev => [...prev, `[SUCCESS] Attack complete. Bank drained. Ledger finally updates to 0.`]);
            }
        }, 800); // Slower for readability
    };

    const reset = () => {
        setContractBalance(10);
        setBankLedger({ student: 1, hacker: 0 });
        setHackerWallet(1); // Hacker starts with 1 ETH to deposit
        setStudentWallet(1);
        setStudentDeposited(false);
        setLogs([]);
        setIsAttacking(false);
    };

    // Initialize hacker wallet on load
    useEffect(() => {
        setHackerWallet(1);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-brand-red/20 shadow-xl">
                    <div className="flex items-center space-x-3 mb-4">
                        <ShieldAlert className="w-8 h-8 text-brand-red" />
                        <h2 className="text-2xl font-bold text-brand-dark">The Reentrancy Attack</h2>
                    </div>
                    <p className="text-brand-dark/70 mb-6">
                        The "Check-Effects-Interactions" pattern violation. The Bank checks the balance, sends the money (interaction), and <em>only then</em> updates the balance (effect). The Hacker exploits this gap.
                    </p>

                    {/* User Role */}
                    <div className="mb-6 p-4 bg-brand-green/5 border border-brand-green/20 rounded-xl">
                        <h3 className="font-bold text-brand-green mb-2">1. The Student</h3>
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-mono">Wallet: {studentWallet} ETH</div>
                            <button
                                onClick={deposit}
                                disabled={studentDeposited}
                                className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {studentDeposited ? 'Deposited' : 'Deposit 1 ETH'}
                            </button>
                        </div>
                    </div>

                    {/* Attacker Role */}
                    <div className={`p-4 bg-brand-red/5 border border-brand-red/20 rounded-xl transition-opacity ${!studentDeposited ? 'opacity-50' : 'opacity-100'}`}>
                        <h3 className="font-bold text-brand-red mb-2">2. The Hacker</h3>
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-mono">Wallet: {hackerWallet} ETH</div>
                        </div>
                        <button
                            onClick={attack}
                            disabled={!studentDeposited || isAttacking || contractBalance === 0 || hackerWallet === 0}
                            className="w-full bg-brand-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-md transition-all"
                        >
                            <Zap className={isAttacking ? 'fill-white animate-pulse' : ''} />
                            <span>{isAttacking ? 'Execute Reentrancy Attack' : 'Attack (Deposit & Drain)'}</span>
                        </button>
                    </div>

                    <div className="mt-6">
                        <button onClick={reset} className="w-full border border-brand-dark/20 hover:border-brand-red text-brand-dark/60 hover:text-brand-red py-2 rounded-lg transition-all text-sm">Reset Simulation</button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-dark/10 shadow-xl flex flex-col">
                <h3 className="text-xl font-bold mb-4 text-brand-dark">Bank State Monitor</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* The Reality */}
                    <div className="bg-brand-beige/50 p-4 rounded-xl text-center border-2 border-brand-link">
                        <div className="text-brand-dark/60 text-xs font-bold uppercase tracking-wider mb-1">Actual Balance</div>
                        <div className="text-4xl font-black text-brand-link">{contractBalance} <span className="text-lg font-normal">ETH</span></div>
                        <div className="text-xs text-brand-dark/40 mt-1">What's in the vault</div>
                    </div>

                    {/* The Illusion (Ledger) */}
                    <div className="bg-brand-dark/5 p-4 rounded-xl border border-brand-dark/10">
                        <div className="text-brand-dark/60 text-xs font-bold uppercase tracking-wider mb-2 border-b border-brand-dark/10 pb-1">Bank Internal Ledger</div>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span>Student:</span>
                            <span className="font-mono font-bold">{bankLedger.student} ETH</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Hacker:</span>
                            <span className="font-mono font-bold text-brand-red">{bankLedger.hacker} ETH</span>
                        </div>
                        <div className="text-[10px] text-brand-red mt-2 leading-tight">
                            *The Bank thinks the Hacker still has funds during the attack!
                        </div>
                    </div>
                </div>

                <div className="bg-brand-dark flex-grow rounded-xl p-4 font-mono text-xs overflow-y-auto border border-brand-dark/5 text-brand-beige scrollbar-hide min-h-[300px]">
                    {logs.length === 0 ? <span className="text-brand-beige/40">Waiting for interaction...</span> : logs.map((log, i) => (
                        <div key={i} className={`mb-2 pl-2 py-1 border-l-2 ${log.includes('HACKER') ? 'border-brand-red text-brand-red bg-brand-red/10' : 'border-brand-green text-brand-green bg-white/5'}`}>
                            {log}
                        </div>
                    ))}
                    <div ref={(el) => el && el.scrollIntoView({ behavior: "smooth" })} />
                </div>
            </div>
        </div>
    );
}

function AccessControlDemo() {
    const [owner, setOwner] = useState('0x123...ABC');
    const [currentUser, setCurrentUser] = useState('0x123...ABC'); // Default to owner
    const [vaultBalance, setVaultBalance] = useState(100);
    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState('neutral'); // neutral, success, error

    const withdraw = (isSecure) => {
        setStatus('');
        setStatusType('neutral');

        // Simulate network delay
        setTimeout(() => {
            if (isSecure) {
                if (currentUser === owner) {
                    setVaultBalance(prev => prev - 10);
                    setStatus('Success: Withdrawal approved (Owner verified).');
                    setStatusType('success');
                } else {
                    setStatus('Error: Reverted! Caller is not owner.');
                    setStatusType('error');
                }
            } else {
                // Vulnerable: No check!
                setVaultBalance(prev => prev - 10);
                setStatus('Warning: Withdrawal successful (Vulnerable Contract - No Owner Check!).');
                setStatusType('warning');
            }
        }, 500);
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-brand-green/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-8 h-8 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-dark">Broken Access Control</h2>
            </div>
            <p className="text-brand-dark/70 mb-6">
                Critical functions must be protected. A common mistake is leaving sensitive functions `public` without an `onlyOwner` modifier.
            </p>

            {/* Sidebar / Role Switcher */}
            <div className="bg-brand-beige/30 p-4 rounded-xl mb-6 flex items-center justify-between border border-brand-dark/5">
                <div>
                    <div className="text-xs text-brand-dark/50">Owner Address</div>
                    <div className="font-mono text-brand-green font-bold">0x123...ABC</div>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={() => setCurrentUser('0x123...ABC')}
                        className={`px-3 py-1 rounded text-sm transition-all ${currentUser === '0x123...ABC' ? 'bg-brand-green text-white shadow-md' : 'bg-brand-dark/10 text-brand-dark/60 hover:bg-brand-dark/20'}`}
                    >
                        Role: Owner
                    </button>
                    <button
                        onClick={() => setCurrentUser('0x999...BAD')}
                        className={`px-3 py-1 rounded text-sm transition-all ${currentUser === '0x999...BAD' ? 'bg-brand-red text-white shadow-md' : 'bg-brand-dark/10 text-brand-dark/60 hover:bg-brand-dark/20'}`}
                    >
                        Role: Attacker
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Vulnerable Contract */}
                <div className="bg-brand-red/5 p-6 rounded-xl border border-brand-red/20 flex flex-col">
                    <h3 className="text-brand-red font-bold mb-4 flex items-center"><AlertTriangle className="mr-2" /> Vulnerable Contract</h3>
                    <div className="bg-brand-dark p-4 rounded-lg font-mono text-xs mb-4 flex-grow text-brand-beige">
                        <div className="text-brand-beige">function withdraw() <span className="text-brand-red font-bold">public</span> &#123;</div>
                        <div className="text-brand-beige/50 pl-4">// No owner check!</div>
                        <div className="text-brand-beige pl-4">msg.sender.transfer(10 ether);</div>
                        <div className="text-brand-beige">&#125;</div>
                    </div>
                    <button
                        onClick={() => withdraw(false)}
                        className="w-full bg-brand-red/10 hover:bg-brand-red/20 text-brand-red border border-brand-red/30 py-2 rounded-lg transition-colors font-semibold"
                    >
                        Attempt Withdrawal
                    </button>
                </div>

                {/* Secure Contract */}
                <div className="bg-brand-green/5 p-6 rounded-xl border border-brand-green/20 flex flex-col">
                    <h3 className="text-brand-green font-bold mb-4 flex items-center"><CheckCircle className="mr-2" /> Secure Contract</h3>
                    <div className="bg-brand-dark p-4 rounded-lg font-mono text-xs mb-4 flex-grow text-brand-beige">
                        <div className="text-brand-beige">function withdraw() <span className="text-brand-green font-bold">public onlyOwner</span> &#123;</div>
                        <div className="text-brand-beige/50 pl-4">// Checks if msg.sender == owner</div>
                        <div className="text-brand-beige pl-4">msg.sender.transfer(10 ether);</div>
                        <div className="text-brand-beige">&#125;</div>
                    </div>
                    <button
                        onClick={() => withdraw(true)}
                        className="w-full bg-brand-green/10 hover:bg-brand-green/20 text-brand-green border border-brand-green/30 py-2 rounded-lg transition-colors font-semibold"
                    >
                        Attempt Withdrawal
                    </button>
                </div>
            </div>

            {/* Status Console */}
            <div className="mt-6 bg-brand-dark p-4 rounded-xl border border-brand-dark/10 font-mono text-sm min-h-[80px] shadow-inner text-brand-beige">
                <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
                    <span className="text-brand-beige/50">Console Output</span>
                    <span className="text-brand-green">Vault Balance: {vaultBalance} ETH</span>
                </div>
                {status && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${statusType === 'success' ? 'text-brand-green' : statusType === 'error' ? 'text-brand-red' : 'text-yellow-400'}`}
                    >
                        &gt; {status}
                    </motion.div>
                )}
                {!status && <span className="text-brand-beige/30 animate-pulse">_</span>}
            </div>
        </div>
    )
}

function OverflowUnderflowDemo() {
    const [value, setValue] = useState(250);
    const [message, setMessage] = useState('');

    const handleAdd = () => {
        let newValue = value + 1;
        if (newValue > 255) {
            newValue = 0; // Simulate overflow for uint8
            setMessage('Overflow! 255 + 1 = 0 in uint8');
        } else {
            setMessage('');
        }
        setValue(newValue);
    };

    const handleSub = () => {
        let newValue = value - 1;
        if (newValue < 0) {
            newValue = 255; // Simulate underflow for uint8
            setMessage('Underflow! 0 - 1 = 255 in uint8');
        } else {
            setMessage('');
        }
        setValue(newValue);
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-brand-red/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-8 h-8 text-brand-red" />
                <h2 className="text-2xl font-bold text-brand-dark">Integer Overflow & Underflow</h2>
            </div>
            <p className="text-brand-dark/70 mb-6">
                In older versions of Solidity (pre-0.8.0), integers would "wrap around" if they exceeded their maximum value.
                Imagine a clock: after 12, it goes back to 1. Here, a `uint8` goes from 0 to 255.
            </p>

            <div className="flex items-center justify-center space-x-8 mb-8">
                <button onClick={handleSub} className="p-4 bg-brand-dark/5 rounded-full hover:bg-brand-red hover:text-white transition-all text-2xl font-bold w-16 h-16 flex items-center justify-center">-</button>
                <div className="text-center">
                    <div className="text-6xl font-black text-brand-dark font-mono">{value}</div>
                    <div className="text-sm text-brand-dark/40 font-mono mt-2">uint8 value</div>
                </div>
                <button onClick={handleAdd} className="p-4 bg-brand-dark/5 rounded-full hover:bg-brand-green hover:text-white transition-all text-2xl font-bold w-16 h-16 flex items-center justify-center">+</button>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-brand-red/10 border border-brand-red/30 rounded-xl text-center text-brand-red font-bold mb-6"
                >
                    <AlertTriangle className="inline-block mr-2 w-5 h-5 mb-1" />
                    {message}
                </motion.div>
            )}

            <div className="bg-brand-dark p-4 rounded-lg font-mono text-sm border border-brand-dark/5 shadow-inner text-brand-beige">
                <div className="text-brand-beige/50">// Solidity &lt; 0.8.0</div>
                <div>uint8 public count = 255;</div>
                <div>function increment() public &#123;</div>
                <div className="pl-4 text-brand-red font-bold">count++; // Becomes 0 if unchecked!</div>
                <div>&#125;</div>
            </div>
        </div>
    );
}

function WeakRandomnessDemo() {
    const [result, setResult] = useState(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [prediction, setPrediction] = useState(null);

    const flipCoin = () => {
        setIsFlipping(true);
        setResult(null);
        setPrediction(null);

        // Simulate block timestamp based outcome
        // In reality, miners control this to an extent
        setTimeout(() => {
            const timestamp = Date.now();
            const outcome = timestamp % 2 === 0 ? 'Heads' : 'Tails';

            // "Miner" predicts it
            setPrediction(outcome);

            setTimeout(() => {
                setResult(outcome);
                setIsFlipping(false);
            }, 1000);
        }, 500);
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-brand-dark/10 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
                <Dices className="w-8 h-8 text-brand-dark" />
                <h2 className="text-2xl font-bold text-brand-dark">Weak Randomness</h2>
            </div>
            <p className="text-brand-dark/70 mb-6">
                Using `block.timestamp` for randomness is insecure because miners can manipulate it slightly to influence the outcome, or validators can simply predict it before committing.
            </p>

            <div className="flex flex-col items-center justify-center my-8">
                <div className={`w-32 h-32 rounded-full border-4 border-brand-dark flex items-center justify-center text-3xl font-bold bg-brand-beige mb-6 transition-all transform ${isFlipping ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}>
                    {result || '?'}
                </div>

                <button
                    onClick={flipCoin}
                    disabled={isFlipping}
                    className="bg-brand-dark hover:bg-brand-dark/80 text-brand-beige font-bold py-3 px-8 rounded-full shadow-lg transition-all"
                >
                    {isFlipping ? 'Flipping...' : 'Flip Coin (using block.timestamp)'}
                </button>
            </div>

            {prediction && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-brand-dark/5 border border-brand-dark/20 rounded-xl text-brand-dark"
                >
                    <p className="font-bold flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Miner's View:
                    </p>
                    <p>
                        "I know `block.timestamp` will be even, so I know the result will be <strong>{prediction}</strong> before I even mine the block!"
                    </p>
                </motion.div>
            )}

            <div className="mt-6 bg-brand-dark p-4 rounded-lg font-mono text-sm border border-brand-dark/5 shadow-inner text-brand-beige">
                <div className="text-brand-red font-bold">// VULNERABLE CODE</div>
                <div>function random() public view returns (uint) &#123;</div>
                <div className="pl-4 text-brand-green font-bold">return uint(keccak256(abi.encodePacked(block.timestamp))) % 2;</div>
                <div>&#125;</div>
            </div>
        </div>
    );
}

function SecurityTools() {
    const tools = [
        { name: 'Slither', type: 'Static Analysis', desc: 'A Python-based static analysis framework that finds vulnerabilities, optimizes gas, and reviews code best practices.', link: 'https://github.com/crytic/slither', color: 'bg-green-100 text-green-700 border-green-200' },
        { name: 'Tenderly', type: 'Debugging & Monitoring', desc: 'A platform to debug transactions, simulate usage, and monitor smart contracts in real-time.', link: 'https://tenderly.co/', color: 'bg-purple-100 text-purple-700 border-purple-200' },
        { name: 'OpenZeppelin', type: 'Secure Library', desc: 'The industry standard for secure, tested smart contract libraries (ERC20, Ownable, etc.).', link: 'https://www.openzeppelin.com/', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        { name: 'MythX', type: 'Security Analysis', desc: 'A comprehensive security analysis service for Ethereum smart contracts.', link: 'https://mythx.io/', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    ];

    return (
        <div className="bg-white p-8 rounded-2xl border border-brand-dark/10 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
                <ShieldAlert className="w-8 h-8 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-dark">The Auditor's Toolkit</h2>
            </div>
            <p className="text-brand-dark/70 mb-8">
                Don't rely just on your eyes. Use these industry-standard tools to verify your code before deployment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map((tool) => (
                    <a
                        key={tool.name}
                        href={tool.link}
                        target="_blank"
                        rel="noreferrer"
                        className="block group"
                    >
                        <div className="h-full p-6 rounded-xl border border-brand-dark/10 hover:border-brand-green hover:shadow-lg transition-all bg-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-50 text-brand-dark/20 group-hover:text-brand-green transition-colors">
                                <ExternalLink className="w-6 h-6" />
                            </div>
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${tool.color}`}>
                                {tool.type}
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-green transition-colors">{tool.name}</h3>
                            <p className="text-sm text-brand-dark/60">{tool.desc}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}

