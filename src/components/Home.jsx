import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, ShieldCheck, Code, Globe, AlertTriangle } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen text-brand-dark flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red/20 rounded-full mix-blend-multiply filter blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [180, 0, 180],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-green/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
                />
            </div>

            <div className="z-10 max-w-4xl text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl font-black mb-6 text-brand-dark tracking-tighter"
                >
                    Blockchain Unpacked
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl text-brand-dark/70 mb-12 max-w-2xl mx-auto font-medium"
                >
                    From decentralized consensus to smart contract security.
                    Explore the technology that powers the future of trust.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
                    <NavCard
                        to="/consensus"
                        title="Consensus"
                        desc="PoW vs. PoS & Mining"
                        icon={<Cpu className="w-8 h-8 text-brand-red" />}
                        delay={0.4}
                    />
                    <NavCard
                        to="/solidity"
                        title="Solidity"
                        desc="Language Fundamentals"
                        icon={<Code className="w-8 h-8 text-brand-dark" />}
                        delay={0.5}
                    />
                    <NavCard
                        to="/deployment"
                        title="Deployment"
                        desc="Testnets & Transactions"
                        icon={<Globe className="w-8 h-8 text-brand-green" />}
                        delay={0.6}
                    />
                    <NavCard
                        to="/security"
                        title="Security"
                        desc="Common Vulnerabilities"
                        icon={<AlertTriangle className="w-8 h-8 text-brand-red" />}
                        delay={0.7}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12"
                >
                    <Link to="/consensus" className="bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full inline-flex items-center transition-all transform hover:scale-105 shadow-lg shadow-brand-red/20">
                        Start Learning <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

function NavCard({ to, title, desc, icon, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
        >
            <Link to={to} className="block bg-white/60 p-6 rounded-2xl hover:bg-white transition-colors border border-brand-dark/5 shadow-sm hover:shadow-md group backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-brand-beige/50 rounded-xl group-hover:bg-brand-beige transition-colors">
                        {icon}
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-red transition-colors">{title}</h3>
                        <p className="text-sm text-brand-dark/60">{desc}</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
