import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Code, Cpu, Droplet, Wallet, Send, CheckCircle, ExternalLink, Hash, Database } from 'lucide-react';
import { keccak256, toHex, stringToBytes, encodeAbiParameters, parseAbiParameters } from 'viem';

export default function Deployment() {
    const [activeTab, setActiveTab] = useState('deploy');

    return (
        <div className="min-h-screen text-brand-dark p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-brand-green">Deployment & Architecture</h1>

                <div className="flex justify-center mb-8 flex-wrap gap-2">
                    <button
                        onClick={() => setActiveTab('deploy')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'deploy' ? 'bg-brand-green text-white shadow-lg' : 'bg-brand-dark/5 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                    >
                        Networks & Deployment
                    </button>
                    <button
                        onClick={() => setActiveTab('anatomy')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'anatomy' ? 'bg-brand-red text-white shadow-lg' : 'bg-brand-dark/5 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                    >
                        Tx Anatomy
                    </button>
                    <button
                        onClick={() => setActiveTab('lifecycle')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'lifecycle' ? 'bg-brand-dark text-brand-beige shadow-lg' : 'bg-brand-dark/5 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                    >
                        Contract Lifecycle
                    </button>
                </div>

                <div className="min-h-[500px]">
                    {activeTab === 'deploy' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <ChainIdTable />
                            <DeploymentFlow />
                        </motion.div>
                    )}
                    {activeTab === 'anatomy' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <TransactionAnatomy />
                        </motion.div>
                    )}
                    {activeTab === 'lifecycle' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <LifecycleDiagram />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ChainIdTable() {
    const chains = [
        { name: 'Ethereum Mainnet', id: 1, type: 'Mainnet', currency: 'ETH' },
        { name: 'Sepolia', id: 11155111, type: 'Testnet', currency: 'SepoliaETH' },
        { name: 'Holesky', id: 17000, type: 'Testnet', currency: 'HoleskyETH' },
        { name: 'Polygon', id: 137, type: 'L2 Mainnet', currency: 'MATIC' },
        { name: 'Avalanche C-Chain', id: 43114, type: 'L1 Mainnet', currency: 'AVAX' },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl border border-brand-dark/10 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-8 h-8 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-dark">Chain IDs & Networks</h2>
            </div>
            <p className="text-brand-dark/70 mb-6">
                Every blockchain network has a unique Chain ID. This prevents replay attacks, ensuring a transaction signed for a testnet cannot be executed on the mainnet.
            </p>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-brand-dark/50 border-b border-brand-dark/10">
                            <th className="p-3">Network</th>
                            <th className="p-3">Chain ID</th>
                            <th className="p-3">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chains.map((chain) => (
                            <tr key={chain.id} className="border-b border-brand-dark/10 hover:bg-brand-beige/50 transition-colors">
                                <td className="p-3 font-semibold text-brand-dark">{chain.name}</td>
                                <td className="p-3 font-mono text-brand-dark/60">{chain.id}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${chain.type === 'Mainnet' ? 'bg-brand-red/10 text-brand-red font-bold' : 'bg-brand-green/10 text-brand-green font-bold'}`}>
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
        { id: 1, title: 'Write Code', icon: <Code />, desc: 'Draft Smart Contract in Remix/VS Code' },
        { id: 2, title: 'Compile', icon: <Cpu />, desc: 'Convert Solidity to Bytecode & ABI' },
        { id: 3, title: 'Get Faucet', icon: <Droplet />, desc: 'Request Testnet ETH from Faucet' },
        { id: 4, title: 'Connect Wallet', icon: <Wallet />, desc: 'Connect MetaMask to Testnet' },
        { id: 5, title: 'Deploy', icon: <Send />, desc: 'Send Creation Transaction' },
        { id: 6, title: 'Confirmed', icon: <CheckCircle />, desc: 'Contract Live on Blockchain' },
    ];

    const handleNext = () => {
        if (step < steps.length) setStep(step + 1);
    };

    const reset = () => setStep(0);

    return (
        <div className="bg-white p-6 rounded-2xl border border-brand-dark/10 shadow-xl relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-6 relative z-10">
                <Send className="w-8 h-8 text-brand-red" />
                <h2 className="text-2xl font-bold text-brand-dark">Deployment Simulator</h2>
            </div>

            <div className="space-y-6 relative z-10">
                {steps.map((s, index) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0.5, x: -20 }}
                        animate={{
                            opacity: step >= s.id ? 1 : 0.3,
                            x: 0,
                            scale: step === s.id ? 1.05 : 1
                        }}
                        className={`flex items-center space-x-4 p-4 rounded-xl border transition-all ${step >= s.id ? 'bg-brand-beige/30 border-brand-green shadow-sm' : 'border-transparent'}`}
                    >
                        <div className={`p-3 rounded-full ${step >= s.id ? 'bg-brand-green text-white' : 'bg-brand-dark/10 text-brand-dark/40'}`}>
                            {s.icon}
                        </div>
                        <div>
                            <h3 className={`font-bold ${step >= s.id ? 'text-brand-dark' : 'text-brand-dark/40'}`}>{s.title}</h3>
                            <p className="text-sm text-brand-dark/60">{s.desc}</p>
                        </div>
                        {step > s.id && <CheckCircle className="ml-auto text-brand-green" />}
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 flex space-x-4 relative z-10">
                <button
                    onClick={handleNext}
                    disabled={step === steps.length}
                    className="flex-1 bg-brand-green hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                    {step === 0 ? 'Start Deployment' : step === steps.length ? 'Deployed!' : 'Next Step'}
                </button>
                {step === steps.length && (
                    <button
                        onClick={reset}
                        className="px-4 py-3 border border-brand-dark/20 rounded-lg text-brand-dark/60 hover:text-brand-red hover:border-brand-red transition-all"
                    >
                        Reset
                    </button>
                )}
            </div>

            {step === steps.length && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-6 bg-brand-green/10 border border-brand-green/30 p-4 rounded-lg flex justify-between items-center"
                >
                    <div>
                        <div className="text-brand-green font-bold">Deployment Successful!</div>
                        <div className="text-xs text-brand-dark/60 font-mono">Tx: 0x712...932</div>
                    </div>
                    <a href="#" className="flex items-center text-brand-red hover:text-red-700 text-sm font-semibold">
                        View on Etherscan <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                </motion.div>
            )}
        </div>
    );
}

function TransactionAnatomy() {
    const [hoverPart, setHoverPart] = useState(null);
    const [activeTool, setActiveTool] = useState('selector'); // 'selector' or 'decoder'

    const parts = [
        { id: 'nonce', label: 'Nonce', value: '0x05', desc: 'Transaction count for the sender. Prevents replay attacks.' },
        { id: 'gasPrice', label: 'Gas Price', value: '0x04e3b29200', desc: 'Price per unit of gas (in wei) you are willing to pay.' },
        { id: 'gasLimit', label: 'Gas Limit', value: '0x5208', desc: 'Max gas units you are willing to consume (approx 21,000 for simple transfer).' },
        { id: 'to', label: 'To', value: '0x123...abc', desc: 'The recipient address or contract address.' },
        { id: 'value', label: 'Value', value: '0x0de0b6b3a7640000', desc: 'Amount of Ether to send (in wei). 0xde0b... = 1 ETH.' },
        { id: 'data', label: 'Data', value: '0xa9059cbb...', desc: 'Input data. For contract calls, this contains the Function Selector and Arguments.' },
        { id: 'v', label: 'v', value: '0x1c', desc: 'Recovery ID for the ECDSA signature.' },
        { id: 'r', label: 'r', value: '0x5f2...', desc: 'First 32 bytes of the ECDSA signature.' },
        { id: 's', label: 's', value: '0x1d3...', desc: 'Second 32 bytes of the ECDSA signature.' },
    ];

    return (
        <div className="bg-white p-8 rounded-2xl border border-brand-red/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
                <Code className="w-8 h-8 text-brand-red" />
                <h2 className="text-2xl font-bold text-brand-dark">Anatomy of a Transaction</h2>
            </div>
            <p className="text-brand-dark/70 mb-8">
                When you click "Confirm" in your wallet, you are signing a raw data object. Here is the breakdown of that hex data.
            </p>

            {/* Raw Transaction Viz */}
            <div className="bg-brand-dark p-6 rounded-xl font-mono text-sm break-all shadow-inner border border-brand-dark/10 mb-8 relative">
                <div className="text-brand-beige/50 text-xs mb-2">// Raw Transaction Data</div>
                <div className="flex flex-wrap gap-1">
                    {parts.map((part) => (
                        <span
                            key={part.id}
                            onMouseEnter={() => setHoverPart(part)}
                            onMouseLeave={() => setHoverPart(null)}
                            className={`cursor-crosshair transition-all px-1 rounded ${hoverPart?.id === part.id ? 'bg-brand-red text-white scale-105 font-bold z-10' : 'text-brand-beige hover:bg-brand-beige/10'}`}
                        >
                            {part.value}
                        </span>
                    ))}
                </div>
            </div>

            <div className="h-32 mb-8">
                <AnimatePresence mode="wait">
                    {hoverPart ? (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-brand-red/5 border border-brand-red/20 p-4 rounded-xl"
                        >
                            <h3 className="font-bold text-brand-red text-lg mb-2">{hoverPart.label}</h3>
                            <p className="text-brand-dark/80">{hoverPart.desc}</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center h-full text-brand-dark/30 italic"
                        >
                            Hover over any part of the hex data above to interpret it.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Interactive Tools Section */}
            <div className="border-t border-brand-dark/10 pt-8">
                <h3 className="text-xl font-bold text-brand-dark mb-6">Decode the "Data" Field</h3>

                <div className="flex space-x-2 mb-6">
                    <button
                        onClick={() => setActiveTool('selector')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${activeTool === 'selector' ? 'bg-brand-dark text-white' : 'bg-brand-dark/5 text-brand-dark/60 hover:bg-brand-dark/10'}`}
                    >
                        <Hash className="w-4 h-4" />
                        <span>Function Selector</span>
                    </button>
                    <button
                        onClick={() => setActiveTool('decoder')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${activeTool === 'decoder' ? 'bg-brand-dark text-white' : 'bg-brand-dark/5 text-brand-dark/60 hover:bg-brand-dark/10'}`}
                    >
                        <Database className="w-4 h-4" />
                        <span>Argument Encoder</span>
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTool === 'selector' ? (
                        <FunctionSelectorPlayground key="selector" />
                    ) : (
                        <ArgumentDecoder key="decoder" />
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function FunctionSelectorPlayground() {
    const [signature, setSignature] = useState('transfer(address,uint256)');
    const [hash, setHash] = useState('');
    const [selector, setSelector] = useState('');

    useEffect(() => {
        try {
            const hashVal = keccak256(toHex(stringToBytes(signature)));
            setHash(hashVal);
            setSelector(hashVal.slice(0, 10)); // 0x + 8 chars
        } catch (e) {
            setHash('Invalid Signature');
            setSelector('????');
        }
    }, [signature]);

    const presets = [
        'transfer(address,uint256)',
        'approve(address,uint256)',
        'transferFrom(address,address,uint256)',
        'mint(address,uint256)'
    ];

    return (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            <div className="bg-brand-beige/30 p-6 rounded-xl border border-brand-dark/5">
                <div className="mb-4">
                    <label className="block text-sm font-bold text-brand-dark/70 mb-2">Function Signature</label>
                    <div className="flex space-x-2 mb-2">
                        <input
                            type="text"
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                            className="flex-1 p-3 rounded-lg border border-brand-dark/10 focus:outline-none focus:border-brand-red font-mono text-brand-dark"
                            placeholder="e.g. myFunc(uint256)"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {presets.map(p => (
                            <button
                                key={p}
                                onClick={() => setSignature(p)}
                                className="text-xs px-2 py-1 bg-brand-dark/5 hover:bg-brand-dark/10 rounded-md text-brand-dark/60 transition-colors font-mono"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-brand-dark/5">
                        <div className="text-xs text-brand-dark/40 mb-1">Keccak-256 Hash</div>
                        <div className="font-mono text-xs break-all text-brand-dark/60">{hash}</div>
                    </div>
                    <div className="bg-brand-red/10 p-4 rounded-lg border border-brand-red/20">
                        <div className="text-xs text-brand-red/60 mb-1 font-bold">Method ID (First 4 Bytes)</div>
                        <div className="font-mono text-2xl font-bold text-brand-red">{selector}</div>
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
            // Simple handling for common types
            const abiType = parseAbiParameters(`${inputType} x`);
            const data = encodeAbiParameters(abiType, [BigInt(inputValue)]); // Assuming uint for simplicity base
            setEncoded(data);
        } catch (e) {
            try {
                // Fallback for address/string/bool
                const abiType = parseAbiParameters(`${inputType} x`);
                const val = inputType === 'bool' ? (inputValue === 'true') : inputType === 'address' ? inputValue : inputValue;
                const data = encodeAbiParameters(abiType, [val]);
                setEncoded(data);
            } catch (err) {
                setEncoded('Error encoding. Check format.');
            }
        }
    }, [inputType, inputValue]);

    return (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            <div className="bg-brand-beige/30 p-6 rounded-xl border border-brand-dark/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-brand-dark/70 mb-2">Type</label>
                        <select
                            value={inputType}
                            onChange={(e) => setInputType(e.target.value)}
                            className="w-full p-3 rounded-lg border border-brand-dark/10 focus:outline-none focus:border-brand-green font-mono bg-white"
                        >
                            <option value="uint256">uint256</option>
                            <option value="address">address</option>
                            <option value="bool">bool</option>
                            <option value="string">string</option>
                            <option value="bytes32">bytes32</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-brand-dark/70 mb-2">Value</label>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full p-3 rounded-lg border border-brand-dark/10 focus:outline-none focus:border-brand-green font-mono"
                        />
                    </div>
                </div>

                <div className="bg-brand-dark p-4 rounded-lg border border-brand-dark/5 shadow-inner">
                    <div className="text-xs text-brand-beige/40 mb-2">ABI Encoded (32 Bytes Padded)</div>
                    <div className="font-mono text-sm break-all text-brand-green">
                        {encoded}
                    </div>
                </div>
                <p className="text-xs text-brand-dark/40 mt-4">
                    *Primitive types are padded to 32 bytes (64 hex characters). Dynamic types (string, bytes) act differently (offset + length + data).
                </p>
            </div>
        </motion.div>
    );
}

function LifecycleDiagram() {
    const stages = [
        { id: 'draft', title: '1. Drafting', desc: 'Writing .sol file' },
        { id: 'compile', title: '2. Compiling', desc: 'Solidity -> Bytecode + ABI' },
        { id: 'deploy', title: '3. Deployment', desc: 'Send Bytecode to Network' },
        { id: 'active', title: '4. Active State', desc: 'Immutable Logic on-chain' },
        { id: 'destruct', title: '5. Deprecated', desc: 'Self-Destruct (Legacy) or Paused' },
    ];

    return (
        <div className="bg-white p-8 rounded-2xl border border-brand-dark/10 shadow-xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">Lifecycle of a Smart Contract</h2>

            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-6 top-6 bottom-6 w-1 bg-brand-dark/10 rounded-full hidden md:block"></div>

                <div className="space-y-6">
                    {stages.map((stage, i) => (
                        <motion.div
                            key={stage.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center relative"
                        >
                            <div className="hidden md:flex w-12 h-12 rounded-full bg-brand-beige border-4 border-white shadow-lg items-center justify-center font-bold text-brand-dark z-10 shrink-0 mx-auto md:ml-0 md:mr-6">
                                {i + 1}
                            </div>

                            <div className="flex-1 bg-brand-dark/5 hover:bg-brand-dark/10 transition-colors p-4 rounded-xl border border-brand-dark/5">
                                <h3 className="font-bold text-brand-dark">{stage.title}</h3>
                                <p className="text-sm text-brand-dark/60">{stage.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-8 p-4 bg-brand-red/5 border-l-4 border-brand-red rounded-r-xl">
                <h4 className="font-bold text-brand-red mb-1">Immutability Warning</h4>
                <p className="text-sm text-brand-dark/70">
                    Once deployed (Step 3), the code <strong>cannot be changed</strong>. If you find a bug in Step 4, you must deploy a new contract and migrate all state, unless you used a Proxy pattern.
                </p>
            </div>
        </div>
    );
}
