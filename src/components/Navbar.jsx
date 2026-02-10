import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Cpu, Code, Globe, AlertTriangle, Menu, X, Wallet, Share2 } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [account, setAccount] = useState(null);

    const links = [
        { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
        { to: '/consensus', label: 'Consensus', icon: <Cpu className="w-4 h-4" /> },
        { to: '/solidity', label: 'Solidity', icon: <Code className="w-4 h-4" /> },
        { to: '/deployment', label: 'Deployment', icon: <Globe className="w-4 h-4" /> },
        { to: '/security', label: 'Security', icon: <AlertTriangle className="w-4 h-4" /> },
        { to: '/share', label: 'Share', icon: <Share2 className="w-4 h-4" /> },
    ];

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
            } catch (error) {
                console.error("User rejected connection", error);
            }
        } else {
            alert("Please install MetaMask to use this feature!");
        }
    };

    // Check if already connected
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                    }
                })
                .catch(console.error);

            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                setAccount(accounts.length > 0 ? accounts[0] : null);
            });
        }
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-beige/80 backdrop-blur-md border-b border-brand-dark/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-xl font-bold text-brand-red tracking-tight flex items-center space-x-2">
                        <span className="bg-brand-red text-white p-1 rounded-md"><Code className="w-5 h-5" /></span>
                        <span>Blockchain Unpacked</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex space-x-1">
                            {links.map((link) => {
                                const isActive = location.pathname === link.to;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${isActive ? 'text-brand-red font-bold' : 'text-brand-dark/70 hover:text-brand-red hover:bg-brand-red/5'}`}
                                    >
                                        {link.icon}
                                        <span>{link.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute inset-0 bg-brand-red/10 rounded-lg -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Wallet Button */}
                        <button
                            onClick={connectWallet}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${account
                                ? 'bg-brand-green/10 text-brand-green border border-brand-green/20'
                                : 'bg-brand-dark text-white hover:bg-brand-dark/90'
                                }`}
                        >
                            <Wallet className="w-4 h-4" />
                            <span>
                                {account
                                    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                                    : 'Connect Wallet'
                                }
                            </span>
                        </button>
                    </div>

                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-brand-dark hover:text-brand-red p-2"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-brand-beige border-b border-brand-dark/5 overflow-hidden shadow-xl"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {links.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${location.pathname === link.to ? 'bg-brand-red/10 text-brand-red font-bold' : 'text-brand-dark/70 hover:text-brand-red hover:bg-brand-red/5'}`}
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-brand-dark/5 mt-2">
                                <button
                                    onClick={() => {
                                        connectWallet();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-bold transition-all ${account
                                        ? 'bg-brand-green/10 text-brand-green border border-brand-green/20'
                                        : 'bg-brand-dark text-white'
                                        }`}
                                >
                                    <Wallet className="w-4 h-4" />
                                    <span>
                                        {account
                                            ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                                            : 'Connect Wallet'
                                        }
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
