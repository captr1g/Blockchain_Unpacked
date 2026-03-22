import { useState, useMemo } from 'react';
import Scene3D from './Scene3D';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, ChevronDown, ChevronRight } from 'lucide-react';

import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, filterGlossary } from '../data/glossary';

// --- Color Constants ---
const BG = '#11131d';
const SURFACE = '#1d1f2a';
const SURFACE_H = '#282934';
const AMBER = '#f59e0b';
const ROSE = '#fb7185';
const EMERALD = '#4ade80';
const SKY = '#38bdf8';
const PURPLE = '#a78bfa';
const TEXT = '#f1f5f9';
const MUTED = '#64748b';

// Helper to assign a specific color to each category
const getCategoryColor = (category) => {
    switch (category) {
        case 'Core': return AMBER;
        case 'Ethereum': return SKY;
        case 'DeFi': return EMERALD;
        case 'Security': return ROSE;
        case 'Layer 2': return PURPLE;
        case 'Governance': return AMBER;
        case 'Development': return SKY;
        default: return MUTED;
    }
};

export default function Glossary() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null); // null means 'All'
    const [expandedTerm, setExpandedTerm] = useState(null);

    // Filter terms based on search and category
    const filteredTerms = useMemo(() => {
        return filterGlossary(GLOSSARY_TERMS, { category: activeCategory, search: searchQuery });
    }, [searchQuery, activeCategory]);

    // Group terms alphabetically
    const groupedTerms = useMemo(() => {
        const sorted = [...filteredTerms].sort((a, b) => a.term.localeCompare(b.term));
        const groups = {};
        sorted.forEach(t => {
            const letter = t.term.charAt(0).toUpperCase();
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(t);
        });
        return groups;
    }, [filteredTerms]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setExpandedTerm(null); // Reset expansion on search
    };

    const handleCategoryClick = (cat) => {
        setActiveCategory(cat === activeCategory ? null : cat);
        setExpandedTerm(null);
    };

    return (
        <div className="min-h-screen pb-20" style={{ color: TEXT }}>

            {/* ─── HEADER ────────────────────────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
                <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: SKY }}>
                        ─── REFERENCE
                    </p>
                    <h1 className="text-5xl font-black tracking-tighter" style={{ color: TEXT }}>
                        Blockchain<br />
                        <span style={{
                            background: `linear-gradient(to right, ${SKY}, ${TEXT})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Glossary
                        </span>
                    </h1>
                    <p className="mt-3 text-sm max-w-sm" style={{ color: MUTED }}>
                        The ultimate dictionary for Web3, cryptography, and decentralized systems.
                    </p>
                </div>

                {/* Isometric SVG Illustration */}
                <div className="hidden lg:flex items-center justify-center relative w-full h-[400px] lg:h-[500px]">
                    <div className="w-full h-full" style={{ cursor: "grab" }}><Scene3D sceneId="glossary" /></div>
                </div>
            </div>

            {/* ─── SEARCH & FILTERS ──────────────────────────────────────────────── */}
            <div className="mb-10 space-y-6">

                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 transition-colors group-focus-within:text-sky-400" style={{ color: MUTED }} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for terms, definitions, etc..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-12 pr-4 py-4 rounded-sm outline-none transition-all placeholder-gray-500"
                        style={{
                            backgroundColor: '#191b25',
                            color: TEXT,
                            borderBottom: `2px solid rgba(83,68,52,0.5)`,
                        }}
                        onFocus={(e) => {
                            e.target.style.borderBottomColor = SKY;
                            e.target.style.boxShadow = `0 10px 20px -10px rgba(56,189,248,0.2)`;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderBottomColor = 'rgba(83,68,52,0.5)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                {/* Categories */}
                <div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleCategoryClick(null)}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                            style={{
                                backgroundColor: activeCategory === null ? SKY : SURFACE,
                                color: activeCategory === null ? BG : MUTED,
                                border: `1px solid ${activeCategory === null ? SKY : 'rgba(83,68,52,0.5)'}`
                            }}
                        >
                            All
                        </button>
                        {GLOSSARY_CATEGORIES.map(cat => {
                            const cColor = getCategoryColor(cat);
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryClick(cat)}
                                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                                    style={{
                                        backgroundColor: isActive ? `${cColor}20` : SURFACE,
                                        color: isActive ? cColor : MUTED,
                                        border: `1px solid ${isActive ? cColor : 'rgba(83,68,52,0.5)'}`
                                    }}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="text-sm border-b pb-4" style={{ color: MUTED, borderColor: 'rgba(83,68,52,0.3)' }}>
                    Showing {filteredTerms.length} of {GLOSSARY_TERMS.length} terms
                </div>
            </div>

            {/* ─── GLOSSARY LIST ─────────────────────────────────────────────────── */}
            {filteredTerms.length === 0 ? (
                <div className="p-10 text-center border" style={{ backgroundColor: SURFACE, borderColor: 'rgba(83,68,52,0.3)' }}>
                    <Search className="w-10 h-10 mx-auto mb-4 opacity-30" style={{ color: MUTED }} />
                    <p className="text-lg font-bold mb-2" style={{ color: TEXT }}>No terms found</p>
                    <p className="text-sm" style={{ color: MUTED }}>Try adjusting your search query or category filter.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.keys(groupedTerms).sort().map(letter => (
                        <div key={letter}>
                            <h2 className="text-3xl font-black mb-4 pl-4 border-l-4" style={{ color: AMBER, borderColor: AMBER }}>
                                {letter}
                            </h2>
                            <div className="flex flex-col gap-1">
                                {groupedTerms[letter].map(termObj => {
                                    const isExpanded = expandedTerm === termObj.term;
                                    const catColor = getCategoryColor(termObj.category);

                                    return (
                                        <div key={termObj.term} className="transition-all" style={{ borderLeft: isExpanded ? `3px solid ${SKY}` : '3px solid transparent' }}>
                                            {/* Row Header */}
                                            <button
                                                onClick={() => setExpandedTerm(isExpanded ? null : termObj.term)}
                                                className="w-full text-left p-4 flex items-center justify-between group"
                                                style={{ backgroundColor: isExpanded ? `${SKY}10` : SURFACE }}
                                            >
                                                <div className="flex items-center gap-4">
                                                    {isExpanded ? <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: SKY }} /> : <ChevronRight className="w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: MUTED }} />}
                                                    <span className="font-bold text-lg" style={{ color: isExpanded ? SKY : TEXT }}>
                                                        {termObj.term}
                                                    </span>
                                                </div>
                                                <div className="hidden md:flex items-center gap-4">
                                                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm"
                                                        style={{ backgroundColor: `${catColor}15`, color: catColor }}>
                                                        {termObj.category}
                                                    </span>
                                                    <span className="text-xs transition-opacity opacity-0 group-hover:opacity-100" style={{ color: MUTED }}>
                                                        {isExpanded ? 'Collapse' : 'Click to expand'}
                                                    </span>
                                                </div>
                                            </button>

                                            {/* Expanded Definition */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-6 md:pl-14 text-sm leading-relaxed" style={{ backgroundColor: '#191b25' }}>
                                                            <div className="md:hidden mb-4">
                                                                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm inline-block"
                                                                    style={{ backgroundColor: `${catColor}15`, color: catColor }}>
                                                                    {termObj.category}
                                                                </span>
                                                            </div>
                                                            <p className="mb-4 text-base" style={{ color: TEXT }}>
                                                                {termObj.definition}
                                                            </p>
                                                            {termObj.example && (
                                                                <div className="p-4 border-l-2" style={{ backgroundColor: BG, borderColor: 'rgba(83,68,52,0.5)' }}>
                                                                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: MUTED }}>Example</p>
                                                                    <p className="font-terminal" style={{ color: MUTED }}>
                                                                        "{termObj.example}"
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
