import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="bg-brand-beige min-h-screen text-brand-dark font-sans selection:bg-brand-red/30 relative overflow-hidden">
            {/* Global Grid Pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #A7BEAE 1px, transparent 0)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Ambient Glow */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[100px] mix-blend-multiply"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-green/20 rounded-full blur-[100px] mix-blend-multiply"></div>
            </div>

            <Navbar />
            <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)] relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
            <footer className="relative z-10 bg-slate-950/50 backdrop-blur-xl border-t border-white/10 py-8 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} Blockchain Unpacked. Built for Education.</p>
            </footer>
        </div>
    );
}
