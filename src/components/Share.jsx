import { useState } from 'react';
import QRCode from "react-qr-code";
import { Copy, Check, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Share() {
    const url = "https://blockchain-unpacked.vercel.app/";
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen text-brand-dark p-8 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 rounded-3xl border border-brand-dark/10 shadow-2xl text-center max-w-md w-full"
            >
                <div className="flex justify-center mb-6">
                    <div className="bg-brand-red/10 p-4 rounded-full">
                        <Share2 className="w-12 h-12 text-brand-red" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-brand-dark mb-2">Share the Knowledge</h1>
                <p className="text-brand-dark/60 mb-8">Scan to open Blockchain Unpacked on your device.</p>

                <div className="bg-white p-4 rounded-xl border-2 border-brand-dark/5 inline-block mb-8 shadow-inner">
                    <QRCode value={url} size={200} fgColor="#2D2D2D" bgColor="#FFFFFF" />
                </div>

                <div className="flex items-center space-x-2 bg-brand-beige/50 p-2 rounded-xl border border-brand-dark/5">
                    <span className="flex-grow text-sm font-mono text-brand-dark/80 px-2 truncate">{url}</span>
                    <button
                        onClick={copyToClipboard}
                        className={`p-2 rounded-lg transition-all ${copied ? 'bg-brand-green text-white' : 'bg-brand-dark text-white hover:bg-brand-dark/80'}`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
