import { useState } from 'react';
import Scene3D from './Scene3D';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Info, X, BookOpen, Grid, Zap } from 'lucide-react';

const BG = '#11131d';
const SURFACE = '#1d1f2a';
const SURFACE_H = '#282934';
const AMBER = '#f59e0b';
const ROSE = '#fb7185';
const EMERALD = '#4ade80';
const SKY = '#38bdf8';
const TEXT = '#f1f5f9';
const MUTED = '#64748b';

import Quiz from './Quiz';

export default function Solidity() {
    const [activeTab, setActiveTab] = useState('editor');
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [storedData, setStoredData] = useState(100);
    const [inputValue, setInputValue] = useState('');

    const handleSet = () => {
        if (!inputValue) return;
        setStoredData(inputValue);
        setInputValue('');
    };

    const codeSnippets = [
        { id: 'app', line: 1, text: '// SPDX-License-Identifier: MIT', topic: 'license', color: MUTED },
        { id: 'pragma', line: 2, text: 'pragma solidity ^0.8.0;', topic: 'pragma', color: SKY },
        { id: 'blank1', line: 3, text: '', topic: null, color: MUTED },
        { id: 'contract', line: 4, text: 'contract SimpleStorage {', topic: 'contract', color: ROSE },
        { id: 'uint', line: 5, text: '    uint256 public storedData;', topic: 'state_variable', color: AMBER },
        { id: 'mapping', line: 6, text: '    mapping(address => uint) public balances;', topic: 'mapping', color: AMBER },
        { id: 'blank2', line: 7, text: '', topic: null, color: MUTED },
        { id: 'constructor', line: 8, text: '    constructor() {', topic: 'constructor', color: SKY },
        { id: 'cons_body', line: 9, text: '        storedData = 100;', topic: 'constructor', color: TEXT },
        { id: 'cons_end', line: 10, text: '    }', topic: 'constructor', color: MUTED },
        { id: 'blank3', line: 11, text: '', topic: null, color: MUTED },
        { id: 'function_set', line: 12, text: '    function set(uint x) public {', topic: 'function_public', color: EMERALD },
        { id: 'set_body', line: 13, text: '        storedData = x;', topic: 'function_public', color: TEXT },
        { id: 'set_end', line: 14, text: '    }', topic: 'function_public', color: MUTED },
        { id: 'blank4', line: 15, text: '', topic: null, color: MUTED },
        { id: 'function_get', line: 16, text: '    function get() public view returns (uint) {', topic: 'function_view', color: EMERALD },
        { id: 'get_body', line: 17, text: '        return storedData;', topic: 'function_view', color: TEXT },
        { id: 'get_end', line: 18, text: '    }', topic: 'function_view', color: MUTED },
        { id: 'contract_end', line: 19, text: '}', topic: 'contract', color: ROSE },
    ];

    const topics = {
        license: { title: 'License Identifier', content: 'Specifies the license for open-source verification. SPDX identifiers allow tooling to automatically detect the license type.' },
        pragma: { title: 'Pragma Directive', content: 'Tells the compiler which Solidity version to use. ^0.8.0 means "0.8.0 or any newer compatible version" — prevents breaking changes.' },
        contract: { title: 'Contract Definition', content: 'Similar to a Class in OOP. Contains state (data) and functions (logic). Deployed as immutable bytecode on the blockchain at a unique address.' },
        state_variable: { title: 'State Variable', content: 'Variables stored permanently on-chain in contract storage. "public" auto-generates a getter function. Each SSTORE costs ~20,000 gas.' },
        mapping: { title: 'Mapping', content: 'A hash table / dictionary. Maps keys (address) to values (uint). Extremely efficient for O(1) lookups — but cannot be iterated over.' },
        constructor: { title: 'Constructor', content: 'Runs ONLY ONCE when the contract is first deployed. Used to initialize state variables and set the owner. Cannot be called again.' },
        function_public: { title: 'Public Function', content: 'Callable by anyone — internally or externally. State-modifying functions cost gas. The "public" visibility also generates a getter.' },
        function_view: { title: 'View Function', content: 'Read-only — reads from blockchain state but never modifies it. Costs ZERO gas when called externally (off-chain), only gas if called by another contract.' },
    };

    const glossaryTerms = [
        { key: 'uint', label: 'uint', category: 'Type', definition: 'Unsigned integer types. uint256 is standard.', usage: 'uint256 public count = 0;' },
        { key: 'address', label: 'address', category: 'Type', definition: 'Holds a 20-byte Ethereum address.', usage: 'address public owner = msg.sender;' },
        { key: 'bool', label: 'bool', category: 'Type', definition: 'Boolean value (true or false).', usage: 'bool public isActive = true;' },
        { key: 'string', label: 'string', category: 'Type', definition: 'A dynamic array of UTF-8 characters.', usage: 'string public name = "MyToken";' },
        { key: 'struct', label: 'struct', category: 'Data Structure', definition: 'Custom data structure to group variables.', usage: 'struct User { uint id; string name; }' },
        { key: 'enum', label: 'enum', category: 'Data Structure', definition: 'User-defined type with a set of constant values.', usage: 'enum Status { Pending, Active, Closed }' },
        { key: 'mapping', label: 'mapping', category: 'Data Structure', definition: 'Key-value store for efficient O(1) lookups.', usage: 'mapping(address => uint) balances;' },
        { key: 'array', label: 'array[]', category: 'Data Structure', definition: 'Collection of elements of the same type.', usage: 'uint[] public numbers;' },
        { key: 'modifier', label: 'modifier', category: 'Function', definition: 'Reusable code that updates function behavior.', usage: 'modifier onlyOwner() { require(msg.sender == owner); _; }' },
        { key: 'event', label: 'event', category: 'Logging', definition: 'Logs data to blockchain, accessible by front-ends.', usage: 'event Transfer(address indexed from, address indexed to, uint value);' },
        { key: 'constructor', label: 'constructor', category: 'Function', definition: 'Executed only once upon contract creation.', usage: 'constructor() { owner = msg.sender; }' },
        { key: 'fallback', label: 'fallback()', category: 'Function', definition: "Called when function signature doesn't match.", usage: 'fallback() external payable {}' },
        { key: 'payable', label: 'payable', category: 'Keyword', definition: 'Function can receive Ether.', usage: 'function deposit() public payable {}' },
        { key: 'external', label: 'external', category: 'Visibility', definition: 'Only callable from outside contract.', usage: 'function get() external view returns (uint) {}' },
        { key: 'internal', label: 'internal', category: 'Visibility', definition: 'Only callable within contract and derived contracts.', usage: 'function _helper() internal {}' },
        { key: 'public', label: 'public', category: 'Visibility', definition: 'Callable from everywhere.', usage: 'function setData() public {}' },
        { key: 'private', label: 'private', category: 'Visibility', definition: 'Only callable within the contract.', usage: 'function _secret() private {}' },
        { key: 'pure', label: 'pure', category: 'Mutability', definition: 'Reads no state and modifies no state.', usage: 'function add(uint a, uint b) public pure returns (uint) { return a + b; }' },
        { key: 'view', label: 'view', category: 'Mutability', definition: 'Reads state but modifies no state.', usage: 'function getBalance() public view returns (uint) { return balance; }' },
        { key: 'memory', label: 'memory', category: 'Data Loc.', definition: 'Temporary data storage during execution.', usage: 'function process(string memory _name) public {}' },
        { key: 'storage', label: 'storage', category: 'Data Loc.', definition: 'Permanent data storage on blockchain.', usage: 'User storage user = users[id];' },
        { key: 'immutable', label: 'immutable', category: 'Variable', definition: 'Set once at construction time.', usage: 'address public immutable owner;' },
        { key: 'constant', label: 'constant', category: 'Variable', definition: 'Fixed at compile time.', usage: 'uint public constant MAX = 100;' },
        { key: 'require', label: 'require()', category: 'Control', definition: 'Checks condition, reverts if false.', usage: 'require(balance >= amount, "Insufficient funds");' },
        { key: 'revert', label: 'revert()', category: 'Control', definition: 'Aborts execution and reverts state changes.', usage: 'if (error) revert("Something went wrong");' },
        { key: 'emit', label: 'emit', category: 'Logging', definition: 'Trigger an event.', usage: 'emit Transfer(msg.sender, to, amount);' },
        { key: 'msg.sender', label: 'msg.sender', category: 'Global', definition: 'Address of the caller of the current function.', usage: 'owner = msg.sender;' },
        { key: 'msg.value', label: 'msg.value', category: 'Global', definition: 'Amount of Ether (in wei) sent with the call.', usage: 'require(msg.value > 0);' },
        { key: 'block.timestamp', label: 'block.timestamp', category: 'Global', definition: 'Current block timestamp in seconds since epoch.', usage: 'require(block.timestamp > deadline);' },
    ];

    const TABS = [
        { id: 'editor', label: '💻 Code Editor', color: ROSE },
        { id: 'dictionary', label: '📖 Dictionary', color: AMBER },
        { id: 'gas', label: '⚡ Gas Optimizer', color: '#f97316' },
    ];

    return (
        <div className="min-h-screen" style={{ color: TEXT }}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
                <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: ROSE }}>─── LANGUAGE FUNDAMENTALS</p>
                    <h1 className="text-5xl font-black tracking-tighter">
                        Solidity<br />
                        <span style={{ background: `linear-gradient(135deg, ${ROSE}, ${AMBER})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Fundamentals
                        </span>
                    </h1>
                    <p className="mt-3 text-sm max-w-sm" style={{ color: MUTED }}>
                        Explore smart contract code interactively — click any line or keyword to understand its role.
                    </p>
                </div>

                {/* 3D floating contract doc */}
                <div className="hidden lg:flex items-center justify-center relative w-full h-[400px] lg:h-[500px]">
                    <div className="w-full h-full" style={{ cursor: "grab" }}><Scene3D sceneId="solidity" /></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 p-1 inline-flex" style={{ backgroundColor: SURFACE }}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setSelectedTopic(null); }}
                        className="px-5 py-2 text-sm font-bold transition-all duration-200"
                        style={{
                            backgroundColor: activeTab === tab.id ? tab.color : 'transparent',
                            color: activeTab === tab.id ? '#11131d' : MUTED,
                            boxShadow: activeTab === tab.id ? `0 0 16px ${tab.color}44` : 'none',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Two-column content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ minHeight: '600px' }}>
                {/* Left column */}
                <AnimatePresence mode="wait">
                    {activeTab === 'editor' ? (
                        <motion.div key="editor" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="rounded-none overflow-hidden shadow-2xl relative flex flex-col"
                            style={{ backgroundColor: '#0c0e17', border: '1px solid rgba(83,68,52,0.3)' }}>
                            {/* macOS chrome */}
                            <div className="flex items-center space-x-2 px-4 py-3" style={{ backgroundColor: SURFACE, borderBottom: '1px solid rgba(83,68,52,0.3)' }}>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ROSE }} />
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AMBER }} />
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EMERALD }} />
                                <span className="ml-2 text-xs" style={{ color: MUTED }}>SimpleStorage.sol</span>
                            </div>
                            <div className="p-4 overflow-y-auto flex-1 font-terminal text-sm" style={{ maxHeight: '480px' }}>
                                {codeSnippets.map(snippet => (
                                    <motion.div
                                        key={snippet.id}
                                        whileHover={snippet.topic ? { backgroundColor: 'rgba(245,158,11,0.07)', x: 4 } : {}}
                                        onClick={() => snippet.topic && setSelectedTopic(snippet.topic)}
                                        className={`flex items-center px-2 py-0.5 transition-all ${snippet.topic ? 'cursor-pointer' : ''}`}
                                        style={{
                                            backgroundColor: selectedTopic === snippet.topic && snippet.topic ? 'rgba(245,158,11,0.1)' : 'transparent',
                                            borderLeft: selectedTopic === snippet.topic && snippet.topic ? `2px solid ${AMBER}` : '2px solid transparent',
                                        }}
                                    >
                                        <span className="w-6 text-right mr-4 flex-shrink-0 select-none text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>{snippet.line}</span>
                                        <pre style={{ color: snippet.color, margin: 0 }}>{snippet.text}</pre>
                                    </motion.div>
                                ))}
                                <div className="mt-4 text-center text-xs italic" style={{ color: MUTED }}>
                                    Click any highlighted line to learn
                                </div>
                            </div>
                        </motion.div>
                    ) : activeTab === 'dictionary' ? (
                        <motion.div key="dictionary" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="p-5 overflow-y-auto" style={{ backgroundColor: SURFACE, maxHeight: '600px' }}>
                            <h3 className="text-sm font-bold mb-4 flex items-center space-x-2" style={{ color: AMBER }}>
                                <Grid className="w-4 h-4" /><span>Key Solidity Concepts</span>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {glossaryTerms.map(term => (
                                    <button
                                        key={term.key}
                                        onClick={() => setSelectedTopic(term)}
                                        className="p-2 text-left transition-all"
                                        style={{
                                            backgroundColor: selectedTopic === term ? `${AMBER}22` : SURFACE_H,
                                            border: `1px solid ${selectedTopic === term ? AMBER : 'rgba(83,68,52,0.3)'}`,
                                            color: selectedTopic === term ? AMBER : TEXT,
                                        }}
                                        onMouseEnter={e => { if (selectedTopic !== term) { e.currentTarget.style.borderColor = `${AMBER}66`; } }}
                                        onMouseLeave={e => { if (selectedTopic !== term) { e.currentTarget.style.borderColor = 'rgba(83,68,52,0.3)'; } }}
                                    >
                                        <div className="font-terminal font-bold text-xs mb-1 truncate">{term.label}</div>
                                        <div className="text-xs uppercase tracking-wider" style={{ color: MUTED }}>{term.category}</div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <GasOptimizationDemo key="gas" />
                    )}
                </AnimatePresence>

                {/* Right column */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {selectedTopic ? (
                            <motion.div
                                key={typeof selectedTopic === 'object' ? selectedTopic.key : selectedTopic}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="p-6 flex flex-col h-full"
                                style={{ backgroundColor: SURFACE, borderLeft: `3px solid ${activeTab === 'dictionary' ? AMBER : ROSE}` }}
                            >
                                {activeTab === 'dictionary' && typeof selectedTopic === 'object' ? (
                                    <>
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center space-x-3">
                                                <BookOpen className="w-5 h-5" style={{ color: AMBER }} />
                                                <h2 className="text-xl font-black font-terminal" style={{ color: AMBER }}>{selectedTopic.label}</h2>
                                                <span className="text-xs px-2 py-0.5 font-bold" style={{ backgroundColor: `${AMBER}18`, color: AMBER }}>{selectedTopic.category}</span>
                                            </div>
                                            <button onClick={() => setSelectedTopic(null)} style={{ color: MUTED }}>
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm mb-6 leading-relaxed" style={{ color: TEXT }}>{selectedTopic.definition}</p>
                                        <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: MUTED }}>Example Usage</div>
                                        <div className="p-4 font-terminal text-sm" style={{ backgroundColor: BG }}>
                                            <code style={{ color: AMBER }}>{selectedTopic.usage}</code>
                                        </div>
                                    </>
                                ) : topics[selectedTopic] ? (
                                    <>
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center space-x-3">
                                                <Info className="w-5 h-5" style={{ color: ROSE }} />
                                                <h2 className="text-xl font-bold" style={{ color: TEXT }}>{topics[selectedTopic].title}</h2>
                                            </div>
                                            <button onClick={() => setSelectedTopic(null)} style={{ color: MUTED }}>
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm leading-relaxed" style={{ color: TEXT }}>{topics[selectedTopic].content}</p>
                                    </>
                                ) : null}
                            </motion.div>
                        ) : (
                            <motion.div key="no-topic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col h-full">
                                {/* Placeholder */}
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-12"
                                    style={{ backgroundColor: SURFACE }}>
                                    {activeTab === 'editor' ? <Code className="w-16 h-16 mb-4" style={{ color: 'rgba(255,255,255,0.07)' }} /> :
                                        activeTab === 'dictionary' ? <Grid className="w-16 h-16 mb-4" style={{ color: 'rgba(255,255,255,0.07)' }} /> :
                                            <Zap className="w-16 h-16 mb-4" style={{ color: 'rgba(255,255,255,0.07)' }} />}
                                    <p className="text-sm italic" style={{ color: MUTED }}>
                                        {activeTab === 'editor' ? 'Select a line of code to learn more.' :
                                            activeTab === 'dictionary' ? 'Select a term from the dictionary.' :
                                                'Select an optimization technique.'}
                                    </p>
                                </div>

                                {/* Interactive contract panel — only in editor tab */}
                                {activeTab === 'editor' && (
                                    <div className="mt-4 p-5" style={{ backgroundColor: SURFACE, borderTop: `1px solid rgba(83,68,52,0.3)` }}>
                                        <h3 className="text-sm font-bold mb-4" style={{ color: TEXT }}>Interact with Contract</h3>
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="flex-1">
                                                <label className="block text-xs mb-1" style={{ color: MUTED }}>State Variable (storedData)</label>
                                                <div className="p-3 font-terminal text-base font-bold" style={{ backgroundColor: BG, color: AMBER }}>
                                                    {storedData}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs mb-1" style={{ color: MUTED }}>Input (uint x)</label>
                                                <input
                                                    type="number" value={inputValue} onChange={e => setInputValue(e.target.value)}
                                                    className="w-full p-3 font-terminal text-sm focus:outline-none"
                                                    style={{ backgroundColor: SURFACE_H, color: TEXT, border: '1px solid rgba(83,68,52,0.4)', caretColor: AMBER }}
                                                    placeholder="42"
                                                    onFocus={e => e.currentTarget.style.borderColor = AMBER}
                                                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(83,68,52,0.4)'}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSet}
                                            className="w-full clip-button py-3 font-bold text-sm transition-all"
                                            style={{ backgroundColor: AMBER, color: '#11131d', boxShadow: `0 0 16px ${AMBER}44` }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ffc174'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = AMBER}
                                        >
                                            Call set({inputValue || 0})
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Dictionary full list at bottom (if not in editor tab) */}

            <Quiz sectionId="solidity" />
        </div>
    );
}

function GasOptimizationDemo() {
    const [scenario, setScenario] = useState('loop');
    const [optimization, setOptimization] = useState('bad');

    const scenarios = {
        loop: {
            title: 'Storage vs Memory in Loops',
            bad: {
                code: `uint total = 0;\nfor(uint i=0; i<numbers.length; i++) {\n   total += numbers[i]; // SLOAD every iteration!\n}`,
                gas: 50000,
                desc: 'SLOAD (storage read) costs 100-2100 gas. Doing it in a loop is extremely expensive.',
            },
            good: {
                code: `uint total = 0;\nuint[] memory nums = numbers; // Cache to Memory\nfor(uint i=0; i<nums.length; i++) {\n   total += nums[i]; // MLOAD: 3 gas each\n}`,
                gas: 5000,
                desc: 'Cache storage variables in memory before loops. MLOAD costs just 3 gas vs up to 2100 for SLOAD.',
            },
        },
        packing: {
            title: 'Variable Packing',
            bad: {
                code: `struct Player {\n    uint128 health;  // Slot 1\n    uint256 id;      // Slot 2\n    uint128 mana;    // Slot 3\n}`,
                gas: 60000,
                desc: 'EVM works in 256-bit slots. health, id, mana each take their own slot. 3 slots = 3 SSTOREs.',
            },
            good: {
                code: `struct Player {\n    uint128 health;  // \\\n    uint128 mana;    //  Slot 1 (packed!)\n    uint256 id;      // Slot 2\n}`,
                gas: 40000,
                desc: 'health + mana (128+128=256 bits) fit in ONE slot. Saving one SSTORE saves ~20,000 gas!',
            },
        },
    };

    const cur = scenarios[scenario][optimization];

    return (
        <motion.div key="gas-demo" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="p-5 overflow-y-auto flex flex-col"
            style={{ backgroundColor: SURFACE, maxHeight: '600px' }}>
            <h3 className="text-sm font-bold mb-4 flex items-center space-x-2" style={{ color: '#f97316' }}>
                <Zap className="w-4 h-4" /><span>Gas Optimizer Visualizer</span>
            </h3>

            <div className="flex space-x-2 mb-4">
                {[{ id: 'loop', label: 'Loops & Storage' }, { id: 'packing', label: 'Variable Packing' }].map(s => (
                    <button key={s.id} onClick={() => setScenario(s.id)}
                        className="flex-1 py-2 text-sm font-bold transition-all"
                        style={{
                            backgroundColor: scenario === s.id ? SURFACE_H : 'transparent',
                            color: scenario === s.id ? TEXT : MUTED,
                            border: `1px solid ${scenario === s.id ? AMBER : 'rgba(83,68,52,0.3)'}`,
                        }}>
                        {s.label}
                    </button>
                ))}
            </div>

            <div className="flex space-x-2 mb-4">
                <button onClick={() => setOptimization('bad')}
                    className="flex-1 py-2 text-sm font-bold"
                    style={{ backgroundColor: optimization === 'bad' ? 'rgba(251,113,133,0.15)' : 'transparent', color: optimization === 'bad' ? ROSE : MUTED, border: `1px solid ${optimization === 'bad' ? ROSE : 'rgba(83,68,52,0.3)'}` }}>
                    ❌ Inefficient
                </button>
                <button onClick={() => setOptimization('good')}
                    className="flex-1 py-2 text-sm font-bold"
                    style={{ backgroundColor: optimization === 'good' ? 'rgba(74,222,128,0.15)' : 'transparent', color: optimization === 'good' ? EMERALD : MUTED, border: `1px solid ${optimization === 'good' ? EMERALD : 'rgba(83,68,52,0.3)'}` }}>
                    ✅ Optimized
                </button>
            </div>

            {/* Gas bar */}
            <div className="relative h-2 mb-4 rounded-full overflow-hidden" style={{ backgroundColor: SURFACE_H }}>
                <motion.div
                    animate={{ width: optimization === 'bad' ? '90%' : '20%', backgroundColor: optimization === 'bad' ? ROSE : EMERALD }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="h-full" />
            </div>
            <div className="flex justify-between text-xs mb-4" style={{ color: MUTED }}>
                <span>0 gas</span>
                <span className="font-bold" style={{ color: optimization === 'bad' ? ROSE : EMERALD }}>{cur.gas.toLocaleString()} gas</span>
            </div>

            <div className="p-4 font-terminal text-xs mb-3" style={{ backgroundColor: BG }}>
                <pre style={{ color: TEXT }}>{cur.code}</pre>
            </div>
            <div className="p-3 text-xs" style={{
                backgroundColor: optimization === 'bad' ? 'rgba(251,113,133,0.1)' : 'rgba(74,222,128,0.1)',
                borderLeft: `3px solid ${optimization === 'bad' ? ROSE : EMERALD}`,
                color: MUTED,
            }}>
                {cur.desc}
            </div>
        </motion.div>
    );
}
