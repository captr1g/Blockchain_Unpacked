import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';

const footerLinks = {
    modules: [
        { label: 'Consensus', to: '/consensus' },
        { label: 'Solidity', to: '/solidity' },
        { label: 'Token Standards', to: '/tokens' },
        { label: 'DeFi', to: '/defi' },
    ],
    advanced: [
        { label: 'Deployment', to: '/deployment' },
        { label: 'Security', to: '/security' },
        { label: 'Layer 2', to: '/layer2' },
        { label: 'Glossary', to: '/glossary' },
    ],
    resources: [
        { label: 'Share', to: '/share' },
        { label: 'GitHub', href: 'https://github.com/captr1g' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yash-raj-saxena/' },
        { label: 'Ethereum Docs', href: 'https://ethereum.org' },
    ],
};

function FooterLink({ label, to, href }) {
    const cls = "block text-[15px] leading-relaxed transition-colors duration-200 hover:text-amber";
    if (to) return <Link to={to} className={cls} style={{ color: '#94a3b8' }}>{label}</Link>;
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={{ color: '#94a3b8' }}>{label}</a>;
}

export default function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="min-h-screen text-text-primary selection:bg-amber/20 relative overflow-hidden" style={{ backgroundColor: '#11131d' }}>

            {/* Subtle dot-grid background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #534434 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <Navbar />

            <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)] relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── Footer ── */}
            <footer className="relative z-10" style={{ backgroundColor: '#11131d' }}>

                {/* Bordered grid container — outer border wraps rows 1+2 only */}
                <div className="mx-4 sm:mx-8 lg:mx-12" style={{ border: '1px solid #1e2030' }}>

                    {/* Row 1 — Links: 2-col mobile, 4-col desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-4">
                        {/* Col 1 — Modules */}
                        <div className="px-6 sm:px-8 py-8 sm:py-10 space-y-4" style={{ borderRight: '1px solid #1e2030', borderBottom: '1px solid #1e2030' }}>
                            {footerLinks.modules.map(l => <FooterLink key={l.label} {...l} />)}
                        </div>
                        {/* Col 2 — Advanced */}
                        <div className="px-6 sm:px-8 py-8 sm:py-10 space-y-4" style={{ borderBottom: '1px solid #1e2030' }}>
                            {footerLinks.advanced.map(l => <FooterLink key={l.label} {...l} />)}
                        </div>
                        {/* Col 3 — Resources */}
                        <div className="px-6 sm:px-8 py-8 sm:py-10 space-y-4" style={{ borderRight: '1px solid #1e2030', borderBottom: '1px solid #1e2030' }}>
                            {footerLinks.resources.map(l => <FooterLink key={l.label} {...l} />)}
                        </div>
                        {/* Col 4 — Info */}
                        <div className="px-6 sm:px-8 py-8 sm:py-10 space-y-2" style={{ borderBottom: '1px solid #1e2030' }}>
                            <p className="text-[15px]" style={{ color: '#94a3b8' }}>Learn Blockchain</p>
                            <p className="text-[15px]" style={{ color: '#94a3b8' }}>Development,</p>
                            <p className="text-[15px]" style={{ color: '#94a3b8' }}>Zero to Hero</p>
                        </div>
                    </div>

                    {/* Row 2 — Copyright + geometric art */}
                    <div className="grid grid-cols-2 lg:grid-cols-[280px_1fr]">
                        {/* Left cell — copyright top-left, arrow art */}
                        <div className="relative px-6 sm:px-8 pt-8 min-h-[240px] sm:min-h-[280px] overflow-hidden" style={{ borderRight: '1px solid #1e2030' }}>
                            <p className="text-sm relative z-10" style={{ color: '#64748b' }}>
                                © Blockchain Unpacked {new Date().getFullYear()}
                            </p>
                            {/* Mobile: downward V-chevron | Desktop: rightward arrow */}
                            {/* Mobile chevrons — hidden on lg */}
                            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none lg:hidden" viewBox="0 0 200 280" fill="none" preserveAspectRatio="none">
                                <path d="M50 50 L100 250 L150 50" stroke="#f59e0b" strokeWidth="0.8" />
                                <path d="M70 50 L100 220 L130 50" stroke="#f59e0b" strokeWidth="0.8" />
                            </svg>
                            {/* Desktop arrow — hidden below lg */}
                            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none hidden lg:block" viewBox="0 0 280 280" fill="none" preserveAspectRatio="none">
                                <path d="M30 240 L240 140 L30 40" stroke="#f59e0b" strokeWidth="0.8" />
                                <path d="M30 210 L200 140 L30 70" stroke="#f59e0b" strokeWidth="0.8" />
                                <path d="M30 140 L240 140" stroke="#f59e0b" strokeWidth="0.8" />
                            </svg>
                        </div>

                        {/* Right cell — on desktop: giant text bottom-right clipped; on mobile: matching chevrons */}
                        <div className="relative min-h-[240px] sm:min-h-[280px] overflow-hidden">
                            {/* Mobile chevrons — hidden on lg */}
                            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none lg:hidden" viewBox="0 0 200 280" fill="none" preserveAspectRatio="none">
                                <path d="M50 280 L100 30 L150 280" stroke="#f59e0b" strokeWidth="0.8" />
                                <path d="M70 280 L100 60 L130 280" stroke="#f59e0b" strokeWidth="0.8" />
                            </svg>
                            {/* Desktop: giant brand text, bottom-right aligned, cropped at bottom */}
                            <span
                                className="absolute bottom-[-0.15em] right-4 font-bold select-none pointer-events-none hidden lg:block"
                                style={{
                                    fontSize: 'clamp(120px, 14vw, 220px)',
                                    color: '#f1f5f9',
                                    letterSpacing: '-0.04em',
                                    lineHeight: 0.85,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Block<span style={{ color: '#f59e0b' }}>chain</span>
                            </span>
                            {/* ® mark bottom-right */}
                            <span className="absolute bottom-4 right-4 text-2xl hidden lg:block" style={{ color: '#64748b' }}>®</span>
                        </div>
                    </div>
                </div>

                {/* Giant brand text — mobile only, outside bordered grid */}
                <div className="relative overflow-hidden px-4 py-6 lg:hidden">
                    <span
                        className="font-bold select-none pointer-events-none block"
                        style={{
                            fontSize: 'clamp(64px, 18vw, 160px)',
                            color: '#f1f5f9',
                            letterSpacing: '-0.04em',
                            lineHeight: 0.85,
                        }}
                    >
                        Block<span style={{ color: '#f59e0b' }}>chain</span>
                    </span>
                    <span className="absolute bottom-3 right-4 text-xl" style={{ color: '#64748b' }}>®</span>
                </div>
            </footer>
        </div>
    );
}
