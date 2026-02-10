import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, Unlock, Zap, AlertTriangle, Code, ArrowRight, CheckCircle } from 'lucide-react';

export default function Security() {
    const [activeTab, setActiveTab] = useState('reentrancy');

    return (
        <div className="min-h-screen text-brand-dark p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-brand-red">Common Vulnerabilities</h1>

                <div className="flex justify-center mb-8">
                    <div className="bg-brand-dark/5 p-1 rounded-full inline-flex space-x-1">
                        <button
                            onClick={() => setActiveTab('reentrancy')}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'reentrancy' ? 'bg-brand-red text-white shadow-lg' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                        >
                            Reentrancy Attack
                        </button>
                        <button
                            onClick={() => setActiveTab('access')}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'access' ? 'bg-brand-green text-white shadow-lg' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                        >
                            Access Control
                        </button>
                    </div>
                </div>

                {activeTab === 'reentrancy' ? <ReentrancyDemo /> : <AccessControlDemo />}
            </div>
        </div>
    );
}

function ReentrancyDemo() {
    const [contractBalance, setContractBalance] = useState(10);
    const [hackerBalance, setHackerBalance] = useState(0);
    const [isAttacking, setIsAttacking] = useState(false);
    const [logs, setLogs] = useState([]);

    const attack = () => {
        if (contractBalance <= 0) return;
        setIsAttacking(true);
        setLogs([]);

        let currentContractBalance = contractBalance;
        let currentHackerBalance = hackerBalance;

        const interval = setInterval(() => {
            if (currentContractBalance > 0) {
                currentContractBalance -= 1;
                currentHackerBalance += 1;
                setContractBalance(currentContractBalance);
                setHackerBalance(currentHackerBalance);
                setLogs(prev => [...prev, `[ATTACK] Withdrawing 1 ETH... Contract Balance: ${currentContractBalance}`]);
            } else {
                clearInterval(interval);
                setIsAttacking(false);
                setLogs(prev => [...prev, `[SUCCESS] Contract Drained!`]);
            }
        }, 500);
    };

    const reset = () => {
        setContractBalance(10);
        setHackerBalance(0);
        setLogs([]);
        setIsAttacking(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-brand-red/20 shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                    <ShieldAlert className="w-8 h-8 text-brand-red" />
                    <h2 className="text-2xl font-bold text-brand-dark">The Reentrancy Attack</h2>
                </div>
                <p className="text-brand-dark/70 mb-6">
                    An attacker contract calls a function on the victim contract. Before the victim updates its state (e.g., reducing the attacker's balance), the attacker calls back into the victim contract, creating a loop that drains funds.
                </p>

                <div className="bg-brand-dark p-4 rounded-lg font-mono text-sm mb-6 border border-brand-dark/5 shadow-inner">
                    <div className="text-brand-red font-bold">// VULNERABLE CODE</div>
                    <div className="text-brand-beige">function withdraw() public &#123;</div>
                    <div className="text-brand-beige pl-4">uint bal = balances[msg.sender];</div>
                    <div className="text-brand-beige pl-4">require(bal &gt; 0);</div>
                    <div className="text-brand-red pl-4 bg-brand-red/10 px-1 rounded animate-pulse">(bool sent, ) = msg.sender.call&#123;value: bal&#125;("");</div>
                    <div className="text-brand-beige pl-4">require(sent, "Failed to send Ether");</div>
                    <div className="text-brand-beige pl-4">balances[msg.sender] = 0; <span className="text-brand-green font-bold">// State updated AFTER call</span></div>
                    <div className="text-brand-beige">&#125;</div>
                </div>

                <button
                    onClick={attack}
                    disabled={isAttacking || contractBalance === 0}
                    className="w-full bg-brand-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg mb-4 flex items-center justify-center space-x-2 shadow-md transition-all"
                >
                    <Zap className={isAttacking ? 'fill-white animate-pulse' : ''} />
                    <span>{isAttacking ? 'Draining Funds...' : 'Launch Attack'}</span>
                </button>

                <button onClick={reset} className="w-full border border-brand-dark/20 hover:border-brand-red text-brand-dark/60 hover:text-brand-red py-2 rounded-lg transition-all">Reset Simulator</button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-dark/10 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-brand-dark">Live Simulation</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-brand-beige/30 p-4 rounded-xl text-center border border-brand-dark/5">
                        <div className="text-brand-dark/60 text-sm">Victim Contract</div>
                        <div className="text-3xl font-bold text-brand-dark">{contractBalance} ETH</div>
                    </div>
                    <div className="bg-brand-beige/30 p-4 rounded-xl text-center border border-brand-dark/5">
                        <div className="text-brand-dark/60 text-sm">Attacker Wallet</div>
                        <div className="text-3xl font-bold text-brand-red">{hackerBalance} ETH</div>
                    </div>
                </div>

                <div className="bg-brand-dark h-64 rounded-xl p-4 font-mono text-xs overflow-y-auto border border-brand-dark/5 text-brand-beige scrollbar-hide">
                    {logs.length === 0 ? <span className="text-brand-beige/40">Waiting for attack...</span> : logs.map((log, i) => (
                        <div key={i} className="mb-1 text-brand-green border-l-2 border-brand-green pl-2">
                            {log}
                        </div>
                    ))}
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
