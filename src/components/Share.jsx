import QRCode from 'react-qr-code';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Github } from 'lucide-react';

const DEPLOYED_URL = 'https://blockchain-unpacked.vercel.app/';
const BG = '#11131d';
const SURFACE = '#1d1f2a';
const AMBER = '#f59e0b';
const TEXT = '#f1f5f9';
const MUTED = '#64748b';

export default function Share() {
    const [copied, setCopied] = useState(false);

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(DEPLOYED_URL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            const el = document.createElement('textarea');
            el.value = DEPLOYED_URL;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-16" style={{ color: TEXT }}>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="p-8 relative overflow-hidden" style={{ backgroundColor: SURFACE, borderTop: `3px solid ${AMBER}` }}>
                    {/* Amber glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 blur-[50px] pointer-events-none"
                        style={{ backgroundColor: 'rgba(245,158,11,0.12)' }} />

                    {/* Icon */}
                    <div className="flex justify-center mb-5">
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-14 h-14 clip-button flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)' }}
                        >
                            <Share2 className="w-7 h-7" style={{ color: AMBER }} />
                        </motion.div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-black text-center tracking-tight mb-1">
                        <span className="text-amber-gradient">Share the</span>
                    </h1>
                    <h1 className="text-3xl font-black text-center tracking-tight mb-3" style={{ color: TEXT }}>Knowledge</h1>
                    <p className="text-sm text-center mb-8" style={{ color: MUTED }}>
                        Scan to open Blockchain Unpacked on any device.
                    </p>

                    {/* QR Code */}
                    <div className="flex justify-center mb-8">
                        <div className="p-4 relative" style={{ backgroundColor: BG, border: `2px solid rgba(245,158,11,0.35)`, boxShadow: '0 0 30px rgba(245,158,11,0.12)' }}>
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: AMBER }} />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: AMBER }} />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: AMBER }} />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: AMBER }} />
                            <QRCode
                                value={DEPLOYED_URL}
                                size={160}
                                bgColor="transparent"
                                fgColor="#f59e0b"
                                level="H"
                            />
                        </div>
                    </div>

                    {/* URL bar + Copy button */}
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="flex-1 py-2.5 px-3 font-terminal text-xs overflow-hidden truncate" style={{ backgroundColor: BG, color: MUTED, border: '1px solid rgba(83,68,52,0.4)' }}>
                            {DEPLOYED_URL}
                        </div>
                        <motion.button
                            id="copy-url-btn"
                            onClick={copyUrl}
                            whileTap={{ scale: 0.95 }}
                            className="clip-button flex items-center space-x-1.5 px-4 py-2.5 text-xs font-bold transition-all flex-shrink-0"
                            style={{
                                backgroundColor: copied ? 'rgba(74,222,128,0.15)' : AMBER,
                                color: copied ? '#4ade80' : '#11131d',
                                boxShadow: copied ? '0 0 12px rgba(74,222,128,0.3)' : '0 0 12px rgba(245,158,11,0.35)',
                            }}
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </motion.button>
                    </div>

                    {/* Social links */}
                    <div className="flex items-center justify-center space-x-4 pt-4" style={{ borderTop: '1px solid rgba(83,68,52,0.3)' }}>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center space-x-2 text-xs font-medium transition-all"
                            style={{ color: MUTED }}
                            onMouseEnter={e => e.currentTarget.style.color = TEXT}
                            onMouseLeave={e => e.currentTarget.style.color = MUTED}
                        >
                            <Github className="w-4 h-4" />
                            <span>View on GitHub</span>
                        </a>
                    </div>
                </div>

                {/* Below card footnote */}
                <p className="text-center text-xs mt-4" style={{ color: MUTED }}>
                    Free & open source educational platform
                </p>
            </motion.div>
        </div>
    );
}
