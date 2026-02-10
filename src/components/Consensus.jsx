import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pickaxe, Coins, Server, Shield, Zap, RefreshCw, CheckCircle } from 'lucide-react';

export default function Consensus() {
    const [activeTab, setActiveTab] = useState('pow');

    return (
        <div className="min-h-screen text-brand-dark p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-brand-red">Consensus Mechanisms</h1>

                <div className="flex justify-center mb-8">
                    <div className="bg-brand-dark/5 p-1 rounded-full inline-flex space-x-1">
                        <button
                            onClick={() => setActiveTab('pow')}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'pow' ? 'bg-brand-red text-white shadow-lg' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                        >
                            Proof of Work (PoW)
                        </button>
                        <button
                            onClick={() => setActiveTab('pos')}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'pos' ? 'bg-brand-green text-white shadow-lg' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                        >
                            Proof of Stake (PoS)
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {activeTab === 'pow' ? <MiningSimulator /> : <StakingSimulator />}
                    </div>
                    <div className="lg:col-span-1">
                        <ComparisonTable activeTab={activeTab} />
                    </div>
                </div>
            </div>
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
                // Simplified hash simulation
                const mockHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                const targetPrefix = '0'.repeat(difficulty);

                if (mockHash.startsWith(targetPrefix)) {
                    setHash(mockHash);
                    setMining(false);
                    setBlocks(prev => [...prev, { id: prev.length + 1, hash: mockHash, nonce: newNonce }]);
                } else {
                    setHash(mockHash);
                }
            }, 100 - (difficulty * 20)); // Slower as difficulty increases (simulated)
        }
        return () => clearInterval(interval);
    }, [mining, difficulty]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl border border-brand-red/20 shadow-xl"
        >
            <div className="flex items-center space-x-3 mb-4">
                <Pickaxe className="w-8 h-8 text-brand-red" />
                <h2 className="text-2xl font-bold text-brand-dark">Mining Simulator</h2>
            </div>
            <p className="text-brand-dark/70 mb-6">
                Miners compete to solve a computational puzzle. Finding a hash that starts with specific number of zeros requires energy and luck.
            </p>

            <div className="bg-brand-beige/50 p-6 rounded-xl mb-6 border border-brand-dark/5">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-mono text-brand-dark/60">Target: {'0'.repeat(difficulty)}...</span>
                    <div className="flex items-center space-x-2 text-brand-dark">
                        <span className="text-sm font-semibold">Difficulty:</span>
                        <input
                            type="range"
                            min="1"
                            max="4"
                            value={difficulty}
                            onChange={(e) => setDifficulty(parseInt(e.target.value))}
                            className="w-24 accent-brand-red"
                        />
                    </div>
                </div>

                <div className="font-mono bg-brand-dark p-4 rounded-lg mb-4 text-brand-beige overflow-hidden">
                    <div>Nonce: {nonce}</div>
                    <div className="break-all">Hash: {hash || 'Waiting to mine...'}</div>
                </div>

                <button
                    onClick={() => setMining(!mining)}
                    className={`w-full py-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all ${mining ? 'bg-brand-red hover:bg-red-700 text-white shadow-lg' : 'bg-brand-dark text-white hover:bg-black shadow-lg'}`}
                >
                    {mining ? <><RefreshCw className="animate-spin" /> <span>Stop Mining</span></> : <><Pickaxe /> <span>Start Mining</span></>}
                </button>
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold text-brand-dark">Blockchain</h3>
                <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
                    {blocks.length === 0 && <span className="text-brand-dark/40 italic">No blocks mined yet.</span>}
                    {blocks.map((block) => (
                        <motion.div
                            key={block.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0 w-24 h-24 bg-brand-red/10 border border-brand-red/30 rounded-lg flex flex-col items-center justify-center p-2 text-xs shadow-sm"
                        >
                            <span className="font-bold text-brand-red">Block #{block.id}</span>
                            <span className="text-brand-dark/60 truncate w-full text-center">{block.hash.substring(0, 8)}...</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function StakingSimulator() {
    const [validators, setValidators] = useState([
        { id: 1, stake: 32, blocks: 0 },
        { id: 2, stake: 16, blocks: 0 },
        { id: 3, stake: 100, blocks: 0 },
    ]);
    const [activeValidator, setActiveValidator] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        let interval;
        if (isValidating) {
            interval = setInterval(() => {
                // Weighted random selection based on stake
                const totalStake = validators.reduce((acc, v) => acc + v.stake, 0);
                let random = Math.random() * totalStake;
                let selected = null;
                for (const v of validators) {
                    random -= v.stake;
                    if (random <= 0) {
                        selected = v;
                        break;
                    }
                }

                setActiveValidator(selected);

                setTimeout(() => { // Simulate validation time
                    if (selected) {
                        setValidators(prev => prev.map(v => v.id === selected.id ? { ...v, blocks: v.blocks + 1 } : v));
                        setBlocks(prev => [...prev, { id: prev.length + 1, validator: selected.id }]);
                        setActiveValidator(null);
                    }
                }, 1000);

            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isValidating, validators]);


    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl border border-brand-green/20 shadow-xl"
        >
            <div className="flex items-center space-x-3 mb-4">
                <Coins className="w-8 h-8 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-dark">Staking Simulator</h2>
            </div>
            <p className="text-brand-dark/70 mb-6">
                Validators lock up native tokens as collateral. The more you stake, the higher usage probability to be chosen to propose the next block.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {validators.map((v) => (
                    <motion.div
                        key={v.id}
                        animate={{
                            borderColor: activeValidator?.id === v.id ? '#A7BEAE' : 'transparent',
                            scale: activeValidator?.id === v.id ? 1.05 : 1,
                            backgroundColor: activeValidator?.id === v.id ? '#fcfdfa' : '#ffffff'
                        }}
                        className="bg-white p-4 rounded-xl border-2 shadow-sm flex flex-col items-center transition-colors"
                    >
                        <div className="w-12 h-12 rounded-full bg-brand-green/20 flex items-center justify-center mb-2">
                            <Server className={`w-6 h-6 ${activeValidator?.id === v.id ? 'text-brand-green animate-pulse' : 'text-brand-dark/40'}`} />
                        </div>
                        <div className="font-bold text-lg text-brand-dark">{v.stake} ETH</div>
                        <div className="text-xs text-brand-dark/50">Validator #{v.id}</div>
                        <div className="mt-2 text-xs bg-brand-green/20 text-brand-dark/80 px-2 py-1 rounded-full">Blocks: {v.blocks}</div>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={() => setIsValidating(!isValidating)}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center space-x-2 mb-6 transition-all ${isValidating ? 'bg-brand-red hover:bg-red-700 text-white shadow-lg' : 'bg-brand-green hover:bg-green-700 text-white shadow-lg'}`}
            >
                {isValidating ? <span>Stop Validating</span> : <span>Start Network</span>}
            </button>

            <div className="space-y-2">
                <h3 className="font-semibold text-brand-dark">Blockchain</h3>
                <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
                    {blocks.length === 0 && <span className="text-brand-dark/40 italic">No blocks validated yet.</span>}
                    {blocks.map((block) => (
                        <motion.div
                            key={block.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0 w-24 h-24 bg-brand-green/10 border border-brand-green/30 rounded-lg flex flex-col items-center justify-center p-2 text-xs shadow-sm"
                        >
                            <span className="font-bold text-brand-green">Block #{block.id}</span>
                            <span className="text-brand-dark/60">Val #{block.validator}</span>
                            <CheckCircle className="w-4 h-4 text-brand-green mt-1" />
                        </motion.div>
                    ))}
                </div>
            </div>

        </motion.div>
    );
}

function ComparisonTable({ activeTab }) {
    const data = [
        { feature: 'Energy Efficiency', pow: 'Low (High Consumption)', pos: 'High (Eco-friendly)', icon: <Zap /> },
        { feature: 'Security Model', pow: 'Computational Cost', pos: 'Economic Stake', icon: <Shield /> },
        { feature: 'Centralization Risk', pow: 'Mining Pools', pos: 'Wealth Concentration', icon: <Server /> },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 h-full border border-brand-dark/5 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-brand-dark">Comparison</h3>
            <div className="space-y-6">
                {data.map((item, index) => (
                    <div key={index} className="bg-brand-beige/30 p-4 rounded-xl border border-brand-dark/5">
                        <div className="flex items-center space-x-2 mb-2 text-brand-dark">
                            {item.icon}
                            <span className="font-semibold">{item.feature}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className={`${activeTab === 'pow' ? 'text-brand-red font-bold' : 'text-brand-dark/40'}`}>
                                <span className="block text-xs uppercase tracking-wider text-brand-dark/60 font-normal">PoW</span>
                                {item.pow}
                            </div>
                            <div className={`${activeTab === 'pos' ? 'text-brand-green font-bold' : 'text-brand-dark/40'}`}>
                                <span className="block text-xs uppercase tracking-wider text-brand-dark/60 font-normal">PoS</span>
                                {item.pos}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
