import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Info, X, BookOpen, Grid, Zap } from 'lucide-react';

export default function Solidity() {
    const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'dictionary'
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [storedData, setStoredData] = useState(100);
    const [inputValue, setInputValue] = useState('');

    const handleSet = () => {
        if (!inputValue) return;
        setStoredData(inputValue);
        setInputValue('');
    };

    const codeSnippets = [
        { id: 'app', line: 1, text: '// SPDX-License-Identifier: MIT', topic: 'license' },
        { id: 'pragma', line: 2, text: 'pragma solidity ^0.8.0;', topic: 'pragma' },
        { id: 'contract', line: 4, text: 'contract SimpleStorage {', topic: 'contract' },
        { id: 'uint', line: 5, text: '    uint256 public storedData;', topic: 'state_variable' },
        { id: 'mapping', line: 6, text: '    mapping(address => uint) public balances;', topic: 'mapping' },
        { id: 'constructor', line: 8, text: '    constructor() {', topic: 'constructor' },
        { id: 'cons_body', line: 9, text: '        storedData = 100;', topic: 'constructor' },
        { id: 'cons_end', line: 10, text: '    }', topic: 'constructor' },
        { id: 'function_set', line: 12, text: '    function set(uint x) public {', topic: 'function_public' },
        { id: 'set_body', line: 13, text: '        storedData = x;', topic: 'function_public' },
        { id: 'set_end', line: 14, text: '    }', topic: 'function_public' },
        { id: 'function_get', line: 16, text: '    function get() public view returns (uint) {', topic: 'function_view' },
        { id: 'get_body', line: 17, text: '        return storedData;', topic: 'function_view' },
        { id: 'get_end', line: 18, text: '    }', topic: 'function_view' },
        { id: 'contract_end', line: 19, text: '}', topic: 'contract' },
    ];

    const topics = {
        license: {
            title: 'License Identifier',
            content: 'Specifies the license under which the source code is released. Essential for open-source verification.'
        },
        pragma: {
            title: 'Pragma Directive',
            content: 'Tells the compiler which version of Solidity to use. ^0.8.0 means "0.8.0 or any newer version that does not break functionality".'
        },
        contract: {
            title: 'Contract Definition',
            content: 'Similar to a Class in object-oriented programming. It contains the data (state) and functions (logic) of the smart contract.'
        },
        state_variable: {
            title: 'State Variable',
            content: 'Variables stored permanently on the blockchain. "public" automatically generates a getter function.'
        },
        mapping: {
            title: 'Mapping',
            content: 'A hash table or dictionary. Maps keys (address) to values (uint). Extremely efficient for lookups but impossible to iterate over.'
        },
        constructor: {
            title: 'Constructor',
            content: 'A special function that runs ONLY ONCE when the contract is first deployed. Used to initialize state.'
        },
        function_public: {
            title: 'Public Function',
            content: 'Functions that can be called by anyone (internal or external). Modifying state costs gas.'
        },
        function_view: {
            title: 'View Function',
            content: 'Read-only function. It reads data from the blockchain but does not modify it, so it costs NO GAS when called externally.'
        }
    };

    // New Glossary Data
    const glossaryTerms = [
        { key: 'uint', label: 'uint', category: 'Type', definition: 'Unsigned integer types. uint256 is standard.', usage: 'uint256 public count = 0;' },
        { key: 'address', label: 'address', category: 'Type', definition: 'Holds a 20-byte Ethereum address.', usage: 'address public owner = msg.sender;' },
        { key: 'bool', label: 'bool', category: 'Type', definition: 'Boolean value (true or false).', usage: 'bool public isActive = true;' },
        { key: 'string', label: 'string', category: 'Type', definition: 'A dynamic array of UTF-8 characters.', usage: 'string public name = "MyToken";' },
        { key: 'bytes', label: 'bytes', category: 'Type', definition: 'Dynamic array of bytes.', usage: 'bytes public data = "0x1234";' },
        { key: 'struct', label: 'struct', category: 'Data Structure', definition: 'Custom data structure to group variables.', usage: 'struct User { uint id; string name; }' },
        { key: 'enum', label: 'enum', category: 'Data Structure', definition: 'User-defined type with a set of constant values.', usage: 'enum Status { Pending, Active, Closed }' },
        { key: 'mapping', label: 'mapping', category: 'Data Structure', definition: 'Key-value store for efficient lookups.', usage: 'mapping(address => uint) balances;' },
        { key: 'array', label: 'array[]', category: 'Data Structure', definition: 'Collection of elements of the same type.', usage: 'uint[] public numbers;' },
        { key: 'modifier', label: 'modifier', category: 'Function', definition: 'Reusable code updates function behavior.', usage: 'modifier onlyOwner() { require(msg.sender == owner); _; }' },
        { key: 'event', label: 'event', category: 'Logging', definition: 'Logs data to the blockchain, accessible by apps.', usage: 'event Transfer(address indexed from, address indexed to, uint value);' },
        { key: 'constructor', label: 'constructor', category: 'Function', definition: 'Executed only once upon contract creation.', usage: 'constructor() { owner = msg.sender; }' },
        { key: 'fallback', label: 'fallback()', category: 'Function', definition: 'Called when function signature doesn\'t match.', usage: 'fallback() external payable {}' },
        { key: 'receive', label: 'receive()', category: 'Function', definition: 'Called when contract receives Ether with empty data.', usage: 'receive() external payable {}' },
        { key: 'payable', label: 'payable', category: 'Keyword', definition: 'Function can receive Ether.', usage: 'function deposit() public payable {}' },
        { key: 'external', label: 'external', category: 'Visibility', definition: 'Only callable from outside contract.', usage: 'function get() external view returns (uint) {}' },
        { key: 'internal', label: 'internal', category: 'Visibility', definition: 'Only callable within contract and derived contracts.', usage: 'function _helper() internal {}' },
        { key: 'public', label: 'public', category: 'Visibility', definition: 'Callable from everywhere.', usage: 'function setData() public {}' },
        { key: 'private', label: 'private', category: 'Visibility', definition: 'Only callable within the contract.', usage: 'function _secret() private {}' },
        { key: 'pure', label: 'pure', category: 'Mutability', definition: 'Reads no state and modifies no state.', usage: 'function add(uint a, uint b) public pure returns (uint) { return a + b; }' },
        { key: 'view', label: 'view', category: 'Mutability', definition: 'Reads state but modifies no state.', usage: 'function getBalance() public view returns (uint) { return balance; }' },
        { key: 'memory', label: 'memory', category: 'Data Loc.', definition: 'Temporary data storage during execution.', usage: 'function process(string memory _name) public {}' },
        { key: 'storage', label: 'storage', category: 'Data Loc.', definition: 'Permanent data storage on blockchain.', usage: 'User storage user = users[id];' },
        { key: 'calldata', label: 'calldata', category: 'Data Loc.', definition: 'Read-only temporary data for external functions.', usage: 'function loop(uint[] calldata nums) external {}' },
        { key: 'immutable', label: 'immutable', category: 'Variable', definition: 'Set once at construction time.', usage: 'address public immutable owner;' },
        { key: 'constant', label: 'constant', category: 'Variable', definition: 'Fixed at compile time.', usage: 'uint public constant MAX = 100;' },
        { key: 'virtual', label: 'virtual', category: 'Inheritance', definition: 'Function can be overridden in child contract.', usage: 'function foo() public virtual {}' },
        { key: 'override', label: 'override', category: 'Inheritance', definition: 'Function overrides parent function.', usage: 'function foo() public override {}' },
        { key: 'abstract', label: 'abstract', category: 'Inheritance', definition: 'Contract with unimplemented functions.', usage: 'abstract contract Base {}' },
        { key: 'interface', label: 'interface', category: 'Inheritance', definition: 'Defines functions without implementation.', usage: 'interface IERC20 { function transfer(address to, uint amount) external; }' },
        { key: 'library', label: 'library', category: 'Keyword', definition: 'Deployable code for code reuse.', usage: 'library Math { function add(uint a, uint b) internal pure returns (uint) {} }' },
        { key: 'msg.sender', label: 'msg.sender', category: 'Global', definition: 'Address of the caller of the current function.', usage: 'owner = msg.sender;' },
        { key: 'msg.value', label: 'msg.value', category: 'Global', definition: 'Amount of Ether (in wei) sent with the call.', usage: 'require(msg.value > 0);' },
        { key: 'block.timestamp', label: 'block.timestamp', category: 'Global', definition: 'Current block timestamp.', usage: 'require(block.timestamp > deadline);' },
        { key: 'require', label: 'require()', category: 'Control', definition: 'Checks condition, reverts if false. usage for validation.', usage: 'require(balance >= amount, "Insufficient funds");' },
        { key: 'assert', label: 'assert()', category: 'Control', definition: 'Checks for internal errors/invariants. Panics if false.', usage: 'assert(totalSupply == 1000);' },
        { key: 'revert', label: 'revert()', category: 'Control', definition: 'Aborts execution and reverts state changes.', usage: 'if (error) revert("Something went wrong");' },
        { key: 'error', label: 'error', category: 'Definition', definition: 'Custom error for gas efficiency.', usage: 'error InsufficientFunds(); if (bal < amt) revert InsufficientFunds();' },
        { key: 'unchecked', label: 'unchecked', category: 'Control', definition: 'Disables overflow/underflow checks.', usage: 'unchecked { i++; }' },
        { key: 'this', label: 'this', category: 'Global', definition: 'The current contract.', usage: 'address(this).balance;' },
        // Contract Creation & Interaction
        { key: 'new', label: 'new', category: 'Contract', definition: 'Creates a new contract instance.', usage: 'Token t = new Token();' },
        { key: 'delete', label: 'delete', category: 'Contract', definition: 'Resets a variable to its default value.', usage: 'delete balances[msg.sender];' },
        { key: 'emit', label: 'emit', category: 'Logging', definition: 'Trigger an event.', usage: 'emit Transfer(msg.sender, to, amount);' },
        { key: 'import', label: 'import', category: ' Syntax', definition: 'Import another source file.', usage: 'import "./Token.sol";' },
        { key: 'using', label: 'using for', category: 'Syntax', definition: 'Attach library functions to a type.', usage: 'using SafeMath for uint;' },
        // Control Flow
        { key: 'if', label: 'if / else', category: 'Control', definition: 'Conditional execution.', usage: 'if (x > 0) { ... } else { ... }' },
        { key: 'for', label: 'for', category: 'Control', definition: 'Loop with initialization, condition, and increment.', usage: 'for (uint i = 0; i < 10; i++) { ... }' },
        { key: 'while', label: 'while', category: 'Control', definition: 'Loop while condition is true.', usage: 'while (i < 10) { i++; }' },
        { key: 'do', label: 'do while', category: 'Control', definition: 'Loop that runs at least once.', usage: 'do { i++; } while (i < 10);' },
        { key: 'break', label: 'break', category: 'Control', definition: 'Exit the current loop.', usage: 'if (done) break;' },
        { key: 'continue', label: 'continue', category: 'Control', definition: 'Skip to next iteration of loop.', usage: 'if (skip) continue;' },
        { key: 'return', label: 'return', category: 'Control', definition: 'Exit function and return values.', usage: 'return true;' },
        { key: 'returns', label: 'returns', category: 'Syntax', definition: 'Declares function return types.', usage: 'function get() public view returns (uint) {}' },
        // Error Handling
        { key: 'try', label: 'try / catch', category: 'Control', definition: 'Catch errors in external function calls.', usage: 'try ext.call() { ... } catch { ... }' },
        // Advanced
        { key: 'super', label: 'super', category: 'Inheritance', definition: 'Access parent contract functions.', usage: 'super.transfer(to, amount);' },
        { key: 'indexed', label: 'indexed', category: 'Logging', definition: 'Adds event parameter to bloom filter for search.', usage: 'event Log(address indexed sender);' },
        { key: 'block.number', label: 'block.number', category: 'Global', definition: 'Current block number.', usage: 'if (block.number > endBlock) ...' },
        { key: 'gasleft', label: 'gasleft()', category: 'Global', definition: 'Remaining gas for execution.', usage: 'if (gasleft() < 1000) revert();' },
        { key: 'abi.encode', label: 'abi.encode', category: 'Global', definition: 'ABI-encodes parameters.', usage: 'bytes memory data = abi.encode(a, b);' },
    ];

    return (
        <div className="min-h-screen text-brand-dark p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-center text-brand-red">Solidity Fundamentals</h1>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-brand-dark/5 p-1 rounded-full inline-flex space-x-1">
                        <button
                            onClick={() => { setActiveTab('editor'); setSelectedTopic(null); }}
                            className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center space-x-2 ${activeTab === 'editor' ? 'bg-brand-red text-white shadow-lg' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                        >
                            <Code className="w-4 h-4" />
                            <span>Code Editor</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('dictionary'); setSelectedTopic(null); }}
                            className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center space-x-2 ${activeTab === 'dictionary' ? 'bg-brand-green text-white shadow-lg' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Solidity Dictionary</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('gas'); setSelectedTopic(null); }}
                            className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center space-x-2 ${activeTab === 'gas' ? 'bg-orange-500 text-white shadow-lg' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/10'}`}
                        >
                            <Zap className="w-4 h-4" />
                            <span>Gas Optimizer</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">

                    {/* Left Column: Code Editor OR Dictionary Grid OR Gas Demo */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'editor' ? (
                            <motion.div
                                key="editor"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-brand-dark rounded-xl overflow-hidden shadow-2xl border border-brand-dark/10 font-mono text-sm relative"
                            >
                                <div className="bg-black/30 px-4 py-2 flex items-center space-x-2 border-b border-white/10">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="ml-2 text-gray-400 text-xs">SimpleStorage.sol</span>
                                </div>

                                <div className="p-4 overflow-y-auto h-full pb-20">
                                    {codeSnippets.map((snippet) => (
                                        <motion.div
                                            key={snippet.id}
                                            whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                            onClick={() => setSelectedTopic(snippet.topic)}
                                            className={`cursor-pointer px-2 py-1 rounded transition-colors flex ${selectedTopic === snippet.topic ? 'bg-brand-green/20 ring-1 ring-brand-green' : ''}`}
                                        >
                                            <span className="text-gray-600 mr-4 w-6 text-right select-none">{snippet.line}</span>
                                            <pre className={`${snippet.text.includes('contract') || snippet.text.includes('function') ? 'text-purple-400' :
                                                snippet.text.includes('uint') || snippet.text.includes('address') ? 'text-yellow-400' :
                                                    snippet.text.includes('//') ? 'text-gray-500' : 'text-gray-300'
                                                }`}>
                                                {snippet.text}
                                            </pre>
                                        </motion.div>
                                    ))}
                                    <div className="mt-4 text-gray-500 text-xs text-center">
                                        Click on any line to understand what it does.
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeTab === 'dictionary' ? (
                            <motion.div
                                key="dictionary"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white/60 rounded-xl p-6 border border-brand-dark/10 overflow-y-auto backdrop-blur-sm"
                            >
                                <h3 className="text-xl font-bold mb-4 flex items-center text-brand-green"><Grid className="mr-2" /> Key Concepts</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {glossaryTerms.map((term) => (
                                        <button
                                            key={term.key}
                                            onClick={() => setSelectedTopic(term)}
                                            className={`p-2 rounded-lg border text-left transition-all ${selectedTopic === term ? 'bg-brand-green text-white border-brand-green shadow-lg scale-105' : 'bg-white border-brand-dark/10 text-brand-dark/80 hover:bg-brand-beige hover:border-brand-green/50'}`}
                                        >
                                            <div className="font-mono font-bold text-xs mb-1 truncate" title={term.label}>{term.label}</div>
                                            <div className="text-[10px] uppercase tracking-wider opacity-60 truncate">{term.category}</div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <GasOptimizationDemo />
                        )}
                    </AnimatePresence>

                    {/* Right Column: Explanation Panel */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {selectedTopic ? (
                                <motion.div
                                    key={selectedTopic.key || selectedTopic} // handle object or string key
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`bg-white p-8 rounded-2xl border ${activeTab === 'dictionary' ? 'border-brand-green/30' : 'border-brand-red/30'} h-full flex flex-col shadow-xl`}
                                >
                                    {activeTab === 'dictionary' ? (
                                        // Dictionary Detail View
                                        <>
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center space-x-3">
                                                    <BookOpen className="w-8 h-8 text-brand-green" />
                                                    <h2 className="text-3xl font-mono font-bold text-brand-dark break-words">{selectedTopic.label}</h2>
                                                </div>
                                                <button onClick={() => setSelectedTopic(null)} className="text-brand-dark/40 hover:text-brand-red"><X /></button>
                                            </div>

                                            <div className="flex-grow">
                                                <h3 className="text-sm font-bold text-brand-dark/50 uppercase tracking-wide mb-2">Definition</h3>
                                                <p className="text-lg text-brand-dark/80 leading-relaxed mb-6">
                                                    {selectedTopic.definition}
                                                </p>

                                                <h3 className="text-sm font-bold text-brand-dark/50 uppercase tracking-wide mb-2">Example Usage</h3>
                                                <div className="bg-brand-dark p-4 rounded-lg font-mono text-sm border border-brand-dark/10 shadow-inner overflow-x-auto">
                                                    <code className="text-brand-beige whitespace-pre-wrap">{selectedTopic.usage}</code>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        // Editor Detail View
                                        <>
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center space-x-3">
                                                    <Info className="w-8 h-8 text-brand-red" />
                                                    <h2 className="text-2xl font-bold text-brand-dark">{topics[selectedTopic].title}</h2>
                                                </div>
                                                <button onClick={() => setSelectedTopic(null)} className="text-brand-dark/40 hover:text-brand-red"><X /></button>
                                            </div>
                                            <p className="text-lg text-brand-dark/80 leading-relaxed">
                                                {topics[selectedTopic].content}
                                            </p>
                                        </>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="no-topic-selected"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col h-full"
                                >
                                    <div className="flex-1 flex flex-col items-center justify-center text-brand-dark/40">
                                        {activeTab === 'dictionary' ? (
                                            <>
                                                <Grid className="w-24 h-24 mb-4 opacity-20" />
                                                <p className="text-xl">Select a term from the dictionary.</p>
                                            </>
                                        ) : activeTab === 'editor' ? (
                                            <>
                                                <Code className="w-24 h-24 mb-4 opacity-20" />
                                                <p className="text-xl">Select a line of code to learn more.</p>
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-24 h-24 mb-4 opacity-20" />
                                                <p className="text-xl text-center">Select an optimization technique<br />to calculate gas savings.</p>
                                            </>
                                        )}
                                    </div>

                                    {/* Interactive State Demo - Only show in Editor tab */}
                                    {activeTab === 'editor' && (
                                        <div className="mt-8 bg-white p-6 rounded-xl border border-brand-dark/10 shadow-lg">
                                            <h3 className="text-lg font-bold mb-4 text-brand-dark">Interact with Contract</h3>
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="flex-1">
                                                    <label className="block text-xs text-brand-dark/60 mb-1">State Variable (storedData)</label>
                                                    <div className="bg-brand-dark p-3 rounded font-mono text-brand-beige border border-brand-dark/10">
                                                        {storedData}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs text-brand-dark/60 mb-1">Input (uint x)</label>
                                                    <input
                                                        type="number"
                                                        value={inputValue}
                                                        onChange={(e) => setInputValue(e.target.value)}
                                                        className="w-full bg-brand-beige border border-brand-dark/20 rounded p-3 text-brand-dark focus:outline-none focus:border-brand-red transition-colors"
                                                        placeholder="Enter number"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleSet}
                                                className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md"
                                            >
                                                <span>Call set({inputValue || 0})</span>
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GasOptimizationDemo() {
    const [scenario, setScenario] = useState('loop'); // 'loop' or 'packing'
    const [optimization, setOptimization] = useState('bad'); // 'bad' or 'good'

    const scenarios = {
        loop: {
            title: 'Storage vs Memory in Loops',
            bad: {
                code: `uint total = 0;
for(uint i=0; i<numbers.length; i++) {
   total += numbers[i]; // Reads from Storage every time!
}`,
                gas: 50000,
                desc: 'Reading from storage (SLOAD) is expensive (100-2100 gas). Doing it in a loop is a disaster.'
            },
            good: {
                code: `uint total = 0;
uint[] memory nums = numbers; // Cache to Memory
for(uint i=0; i<nums.length; i++) {
   total += nums[i]; // Reads from Memory (Cheap!)
}`,
                gas: 5000,
                desc: 'Reading from memory (MLOAD) is very cheap (3 gas). Cache storage variables before looping!'
            }
        },
        packing: {
            title: 'Variable Packing',
            bad: {
                code: `struct Player {
    uint128 health;
    uint256 id;
    uint128 mana;
}`,
                gas: 60000,
                desc: 'Solidity works in 256-bit slots. Here, `health` takes 1 slot, `id` takes 1 slot, `mana` takes 1 slot. Total: 3 slots.'
            },
            good: {
                code: `struct Player {
    uint128 health;
    uint128 mana;
    uint256 id; // Repositioned
}`,
                gas: 40000,
                desc: 'Now `health` and `mana` (128+128=256) fit into ONE slot. `id` takes another. Total: 2 slots. 1 slot saved!'
            }
        }
    };

    const currentData = scenarios[scenario][optimization];

    return (
        <motion.div
            key="gas-demo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/60 rounded-xl p-6 border border-brand-dark/10 overflow-y-auto backdrop-blur-sm h-full flex flex-col"
        >
            <h3 className="text-xl font-bold mb-6 flex items-center text-orange-600"><Zap className="mr-2" /> Gas Optimizer Visualizer</h3>

            <div className="flex space-x-2 mb-6">
                <button onClick={() => setScenario('loop')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${scenario === 'loop' ? 'bg-brand-dark text-white shadow-md' : 'bg-white border border-brand-dark/10 text-brand-dark/60'}`}> Loops & Storage</button>
                <button onClick={() => setScenario('packing')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${scenario === 'packing' ? 'bg-brand-dark text-white shadow-md' : 'bg-white border border-brand-dark/10 text-brand-dark/60'}`}> Variable Packing</button>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
                <button onClick={() => setOptimization('bad')} className={`px-4 py-2 rounded-full font-bold text-sm border transition-all ${optimization === 'bad' ? 'bg-red-100 text-red-600 border-red-300 ring-2 ring-red-200' : 'bg-transparent text-gray-400 border-gray-200'}`}> Inefficient Code </button>
                <button onClick={() => setOptimization('good')} className={`px-4 py-2 rounded-full font-bold text-sm border transition-all ${optimization === 'good' ? 'bg-green-100 text-green-600 border-green-300 ring-2 ring-green-200' : 'bg-transparent text-gray-400 border-gray-200'}`}> Optimized Code </button>
            </div>

            <div className="relative mb-8 bg-gray-100 rounded-full h-8 overflow-hidden border border-gray-200">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: optimization === 'bad' ? '90%' : '20%', backgroundColor: optimization === 'bad' ? '#EF4444' : '#10B981' }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="h-full relative"
                >
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs font-bold">{currentData.gas} Gas</span>
                </motion.div>
            </div>

            <div className="bg-brand-dark p-4 rounded-xl border border-brand-dark/10 font-mono text-sm shadow-inner mb-4">
                <pre className="text-brand-beige whitespace-pre-wrap">{currentData.code}</pre>
            </div>

            <div className={`p-4 rounded-xl border text-sm font-medium ${optimization === 'bad' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                <div className="flex items-start">
                    <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    {currentData.desc}
                </div>
            </div>

        </motion.div>
    );
}
