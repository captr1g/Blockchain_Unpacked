import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Cpu, Code, Globe, AlertTriangle, Menu, X } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const links = [
        { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
        { to: '/consensus', label: 'Consensus', icon: <Cpu className="w-4 h-4" /> },
        { to: '/solidity', label: 'Solidity', icon: <Code className="w-4 h-4" /> },
        { to: '/deployment', label: 'Deployment', icon: <Globe className="w-4 h-4" /> },
        { to: '/security', label: 'Security', icon: <AlertTriangle className="w-4 h-4" /> },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-beige/80 backdrop-blur-md border-b border-brand-dark/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-xl font-bold text-brand-red tracking-tight flex items-center space-x-2">
                        <span className="bg-brand-red text-white p-1 rounded-md"><Code className="w-5 h-5" /></span>
                        <span>Blockchain Unpacked</span>
                    </Link>

                    <div className="hidden md:flex space-x-1">
                        {links.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${isActive ? 'text-brand-red font-bold' : 'text-brand-dark/70 hover:text-brand-red hover:bg-brand-red/5'}`}
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

                    <div className="md:hidden">
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
