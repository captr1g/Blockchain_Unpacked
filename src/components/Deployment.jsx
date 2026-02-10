import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Code, Cpu, Droplet, Wallet, Send, CheckCircle, ExternalLink } from 'lucide-react';

export default function Deployment() {
    return (
        <div className="min-h-screen text-brand-dark p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-brand-green">Deployment & Testnets</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ChainIdTable />
                    <DeploymentFlow />
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
