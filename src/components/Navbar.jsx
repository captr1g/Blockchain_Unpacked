import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Cpu, Code, Globe, AlertTriangle, Menu, X, Wallet, Share2, Coins, TrendingUp, Layers, BookOpen } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [account, setAccount] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    const links = [
        { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
        { to: '/consensus', label: 'Consensus', icon: <Cpu className="w-4 h-4" /> },
        { to: '/solidity', label: 'Solidity', icon: <Code className="w-4 h-4" /> },
        { to: '/tokens', label: 'Tokens', icon: <Coins className="w-4 h-4" /> },
        { to: '/defi', label: 'DeFi', icon: <TrendingUp className="w-4 h-4" /> },
        { to: '/deployment', label: 'Deployment', icon: <Globe className="w-4 h-4" /> },
        { to: '/security', label: 'Security', icon: <AlertTriangle className="w-4 h-4" /> },
        { to: '/layer2', label: 'Layer 2', icon: <Layers className="w-4 h-4" /> },
        { to: '/glossary', label: 'Glossary', icon: <BookOpen className="w-4 h-4" /> },
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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => { if (accounts.length > 0) setAccount(accounts[0]); })
                .catch(console.error);
            window.ethereum.on('accountsChanged', (accounts) => {
                setAccount(accounts.length > 0 ? accounts[0] : null);
            });
        }
    }, []);

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                backgroundColor: scrolled ? 'rgba(17, 19, 29, 0.92)' : 'rgba(17, 19, 29, 0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: scrolled ? '1px solid rgba(245, 158, 11, 0.12)' : '1px solid rgba(83, 68, 52, 0.2)',
            }}
        >
            <div className="w-[96%] max-w-none mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 flex items-center justify-center clip-button"
                            style={{ backgroundColor: '#f59e0b' }}>
                            <Code className="w-4 h-4" style={{ color: '#11131d' }} />
                        </div>
                        <span className="text-lg font-bold tracking-tight" style={{ color: '#ffc174' }}>
                            Blockchain<span style={{ color: '#f1f5f9' }}> Unpacked</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center space-x-1">
                        {links.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="relative px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 group whitespace-nowrap"
                                    style={{
                                        color: isActive ? '#f59e0b' : '#94a3b8',
                                    }}
                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#ffc174'; }}
                                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#94a3b8'; }}
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                    {/* Active amber underline */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                                            style={{ backgroundColor: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.6)' }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop wallet button */}
                    <div className="hidden md:flex">
                        <button
                            id="connect-wallet-btn"
                            onClick={connectWallet}
                            className="clip-button flex items-center space-x-2 px-4 py-2 text-sm font-bold transition-all duration-200"
                            style={{
                                backgroundColor: account ? 'rgba(74,222,128,0.15)' : '#f59e0b',
                                color: account ? '#4ade80' : '#11131d',
                                boxShadow: account ? '0 0 12px rgba(74,222,128,0.2)' : '0 0 16px rgba(245,158,11,0.35)',
                            }}
                            onMouseEnter={e => { if (!account) e.currentTarget.style.backgroundColor = '#ffc174'; }}
                            onMouseLeave={e => { if (!account) e.currentTarget.style.backgroundColor = '#f59e0b'; }}
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

                    {/* Mobile menu toggle */}
                    <div className="md:hidden flex items-center space-x-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 transition-colors"
                            style={{ color: '#94a3b8' }}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden"
                        style={{ backgroundColor: 'rgba(17,19,29,0.97)', borderTop: '1px solid rgba(83,68,52,0.3)' }}
                    >
                        <div className="px-4 pt-3 pb-4 space-y-1">
                            {links.map((link) => {
                                const isActive = location.pathname === link.to;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center space-x-3 px-3 py-2.5 rounded text-sm font-medium transition-all"
                                        style={{
                                            color: isActive ? '#f59e0b' : '#94a3b8',
                                            backgroundColor: isActive ? 'rgba(245,158,11,0.08)' : 'transparent',
                                            borderLeft: isActive ? '2px solid #f59e0b' : '2px solid transparent',
                                        }}
                                    >
                                        {link.icon}
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                            <div className="pt-3 mt-2" style={{ borderTop: '1px solid rgba(83,68,52,0.3)' }}>
                                <button
                                    onClick={() => { connectWallet(); setIsMobileMenuOpen(false); }}
                                    className="clip-button w-full flex items-center justify-center space-x-2 py-3 text-sm font-bold"
                                    style={{ backgroundColor: '#f59e0b', color: '#11131d' }}
                                >
                                    <Wallet className="w-4 h-4" />
                                    <span>{account
                                        ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                                        : 'Connect Wallet'
                                    }</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
