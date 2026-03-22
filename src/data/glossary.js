/**
 * Blockchain Glossary — 100+ terms
 * Each term: { term, definition, category, example? }
 *
 * Categories: 'Core', 'Ethereum', 'DeFi', 'Security', 'Layer 2', 'Governance', 'Development'
 */
export const GLOSSARY_TERMS = [
  // --- Core Blockchain ---
  { term: 'Block', definition: 'A batch of transactions bundled together and added to the blockchain. Each block references the previous block via its hash.', category: 'Core', example: 'Ethereum produces a new block roughly every 12 seconds.' },
  { term: 'Blockchain', definition: 'A distributed, immutable ledger where blocks of transactions are linked cryptographically. Each block contains a hash of the previous block.', category: 'Core' },
  { term: 'Consensus Mechanism', definition: 'The method by which network participants agree on the current state of the blockchain. Common types: Proof of Work, Proof of Stake.', category: 'Core' },
  { term: 'Cryptographic Hash', definition: 'A one-way function that converts input of any size into a fixed-size output. Same input always gives same output. Impossible to reverse.', category: 'Core', example: 'keccak256("hello") = 0x1c8aff...' },
  { term: 'Decentralization', definition: 'No single entity controls the network. Power is distributed across many independent nodes worldwide.', category: 'Core' },
  { term: 'Genesis Block', definition: 'The very first block in a blockchain (block #0). It is hardcoded and has no parent block.', category: 'Core' },
  { term: 'Merkle Tree', definition: 'A data structure that efficiently summarizes all transactions in a block. Allows proving a transaction is included without downloading the entire block.', category: 'Core' },
  { term: 'Node', definition: 'A computer running blockchain software. Full nodes store the entire blockchain history and validate all transactions.', category: 'Core' },
  { term: 'Nonce', definition: 'A number used once. In PoW, miners change the nonce to find a valid hash. In transactions, it prevents replay attacks.', category: 'Core' },
  { term: 'Peer-to-Peer (P2P)', definition: 'A network architecture where each participant communicates directly with others, without a central server.', category: 'Core' },
  { term: 'Private Key', definition: 'A secret 256-bit number that controls a wallet. Used to sign transactions. NEVER share it.', category: 'Core', example: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' },
  { term: 'Public Key', definition: 'Derived from the private key using elliptic curve cryptography. Your address is derived from your public key.', category: 'Core' },
  { term: 'Transaction', definition: 'A signed message sent from one account to another. Can transfer ETH, call a function, or deploy a contract.', category: 'Core' },
  { term: 'Wallet', definition: 'Software that manages your private keys and lets you send/receive crypto. Examples: MetaMask, Rabby, Ledger.', category: 'Core' },

  // --- Ethereum ---
  { term: 'ABI (Application Binary Interface)', definition: 'A JSON description of a contract\'s functions and events. Required for any external code to interact with the contract.', category: 'Ethereum' },
  { term: 'Bytecode', definition: 'The compiled form of Solidity code that runs on the EVM. A sequence of opcodes (PUSH, ADD, SSTORE, etc.).', category: 'Ethereum' },
  { term: 'EIP (Ethereum Improvement Proposal)', definition: 'A formal proposal for changes to the Ethereum protocol. EIPs go through a review process before implementation.', category: 'Ethereum', example: 'EIP-1559 changed how gas fees work.' },
  { term: 'EOA (Externally Owned Account)', definition: 'A regular user wallet controlled by a private key. As opposed to a contract account which is controlled by code.', category: 'Ethereum' },
  { term: 'ERC (Ethereum Request for Comments)', definition: 'A subset of EIPs that define application-level standards — token interfaces, metadata formats, etc.', category: 'Ethereum', example: 'ERC-20 (fungible tokens), ERC-721 (NFTs)' },
  { term: 'EVM (Ethereum Virtual Machine)', definition: 'The runtime environment for smart contracts. A stack-based virtual machine that executes bytecode. Every node runs the same EVM.', category: 'Ethereum' },
  { term: 'Gas', definition: 'A unit measuring computational effort. Every operation costs gas. Users pay gas fees (in ETH) to incentivize validators.', category: 'Ethereum', example: 'A simple ETH transfer costs 21,000 gas.' },
  { term: 'Gas Limit', definition: 'The maximum gas a transaction is allowed to consume. Set by the sender. If the transaction runs out of gas, it reverts.', category: 'Ethereum' },
  { term: 'Gas Price (Gwei)', definition: 'How much ETH you pay per unit of gas. 1 Gwei = 0.000000001 ETH. Higher gas price = faster inclusion.', category: 'Ethereum' },
  { term: 'Mainnet', definition: 'The live Ethereum network where real ETH has real value. As opposed to testnets used for development.', category: 'Ethereum' },
  { term: 'Opcode', definition: 'A single instruction the EVM can execute. Examples: ADD, MUL, SSTORE, SLOAD, CALL. Each has a fixed gas cost.', category: 'Ethereum' },
  { term: 'Smart Contract', definition: 'A program deployed on the blockchain that executes automatically when conditions are met. Immutable once deployed.', category: 'Ethereum' },
  { term: 'Solidity', definition: 'The most popular programming language for Ethereum smart contracts. Statically typed, supports inheritance, and compiles to EVM bytecode.', category: 'Ethereum' },
  { term: 'Testnet', definition: 'A test version of Ethereum (Sepolia, Holesky) where ETH has no real value. Used for development and testing.', category: 'Ethereum' },
  { term: 'Wei', definition: 'The smallest unit of ETH. 1 ETH = 10^18 Wei. All internal EVM calculations use Wei.', category: 'Ethereum', example: '1 ETH = 1,000,000,000,000,000,000 Wei' },

  // --- DeFi ---
  { term: 'AMM (Automated Market Maker)', definition: 'A protocol that uses a math formula (often x*y=k) instead of order books to set prices and enable trades.', category: 'DeFi', example: 'Uniswap, SushiSwap, Curve' },
  { term: 'APR (Annual Percentage Rate)', definition: 'The simple interest rate earned over one year. Does not account for compounding.', category: 'DeFi' },
  { term: 'APY (Annual Percentage Yield)', definition: 'The effective interest rate including compounding. Always higher than APR for the same rate.', category: 'DeFi', example: '100% APR = ~171.5% APY when compounded daily.' },
  { term: 'Collateral', definition: 'Assets deposited as security for a loan. If the loan becomes undercollateralized, the collateral is seized (liquidated).', category: 'DeFi' },
  { term: 'DEX (Decentralized Exchange)', definition: 'A non-custodial exchange where trades happen directly between wallets via smart contracts. No central order book.', category: 'DeFi', example: 'Uniswap, dYdX, Curve' },
  { term: 'Flash Loan', definition: 'An uncollateralized loan that must be borrowed and repaid in the SAME transaction. If not repaid, the entire transaction reverts.', category: 'DeFi' },
  { term: 'Impermanent Loss', definition: 'The loss LP providers experience compared to simply holding when token prices diverge. Reverts if prices return to original.', category: 'DeFi' },
  { term: 'Liquidity Pool', definition: 'A smart contract holding paired tokens (e.g. ETH/USDC) that traders can swap between. LPs earn fees from every trade.', category: 'DeFi' },
  { term: 'Liquidation', definition: 'When a borrower\'s collateral value drops below the required ratio, a liquidator repays the debt and seizes collateral at a discount.', category: 'DeFi' },
  { term: 'LP (Liquidity Provider)', definition: 'Someone who deposits tokens into a liquidity pool. They earn a share of trading fees proportional to their deposit.', category: 'DeFi' },
  { term: 'Oracle', definition: 'A service that provides off-chain data (prices, weather, etc.) to smart contracts. Contracts cannot access external data natively.', category: 'DeFi', example: 'Chainlink, Pyth, Redstone' },
  { term: 'Slippage', definition: 'The difference between expected and actual execution price. Increases with trade size relative to pool liquidity.', category: 'DeFi' },
  { term: 'Stablecoin', definition: 'A token pegged to a stable asset (usually $1 USD). Types: fiat-backed (USDC), crypto-collateralized (DAI), algorithmic.', category: 'DeFi' },
  { term: 'TVL (Total Value Locked)', definition: 'The total value of assets deposited in a DeFi protocol. Key metric for protocol adoption and trust.', category: 'DeFi' },
  { term: 'Yield Farming', definition: 'Strategically moving assets between protocols to maximize returns. Often involves providing liquidity and earning reward tokens.', category: 'DeFi' },

  // --- Security ---
  { term: 'Access Control', definition: 'Restricting who can call specific functions. Common pattern: onlyOwner modifier. Missing access control is the #1 vulnerability.', category: 'Security' },
  { term: 'Audit', definition: 'A professional security review of smart contract code. Auditors look for vulnerabilities, logic errors, and gas optimizations.', category: 'Security' },
  { term: 'Bug Bounty', definition: 'A reward program where protocols pay ethical hackers for finding and reporting vulnerabilities before they are exploited.', category: 'Security', example: 'Immunefi hosts bug bounties with rewards up to $10M.' },
  { term: 'Check-Effects-Interactions', definition: 'A Solidity pattern to prevent reentrancy: 1) Check conditions, 2) Update state, 3) Make external calls. Always in this order.', category: 'Security' },
  { term: 'Delegate Call', definition: 'A low-level call that executes another contract\'s code in the context of the calling contract. Dangerous — the called code can modify the caller\'s storage.', category: 'Security' },
  { term: 'Front-Running', definition: 'Seeing a pending transaction in the mempool and submitting your own transaction first (with higher gas) to profit from the price movement.', category: 'Security' },
  { term: 'Honeypot', definition: 'A contract that appears profitable to interact with but contains hidden logic that traps your funds.', category: 'Security' },
  { term: 'Integer Overflow/Underflow', definition: 'When a number exceeds its maximum value (overflows back to 0) or goes below 0 (underflows to max). Fixed in Solidity 0.8.0+.', category: 'Security' },
  { term: 'MEV (Maximal Extractable Value)', definition: 'Profit validators can extract by reordering, inserting, or censoring transactions in a block.', category: 'Security' },
  { term: 'Reentrancy', definition: 'An attack where a malicious contract calls back into the victim contract before the first call finishes, draining funds.', category: 'Security', example: 'The DAO hack (2016) — $60M stolen via reentrancy.' },
  { term: 'Rug Pull', definition: 'When project creators suddenly withdraw all liquidity or funds, leaving token holders with worthless tokens.', category: 'Security' },
  { term: 'Sandwich Attack', definition: 'An MEV attack: attacker front-runs your trade (buys), your trade executes at a worse price, attacker back-runs (sells for profit).', category: 'Security' },
  { term: 'Sybil Attack', definition: 'Creating many fake identities to gain disproportionate influence in a network. Airdrops are especially vulnerable.', category: 'Security' },
  { term: 'tx.origin', definition: 'The original sender of the transaction. Using tx.origin for authentication is a vulnerability — use msg.sender instead.', category: 'Security' },

  // --- Layer 2 ---
  { term: 'Rollup', definition: 'A Layer 2 scaling solution that executes transactions off-chain and posts compressed data to L1 for security.', category: 'Layer 2' },
  { term: 'Optimistic Rollup', definition: 'A rollup that assumes transactions are valid. Anyone can submit a fraud proof within 7 days to challenge invalid batches.', category: 'Layer 2', example: 'Optimism, Arbitrum, Base' },
  { term: 'ZK Rollup', definition: 'A rollup that generates a cryptographic validity proof for every batch. No challenge period needed — math proves correctness.', category: 'Layer 2', example: 'zkSync, Polygon zkEVM, StarkNet' },
  { term: 'Bridge', definition: 'A protocol that transfers assets between two blockchains. Typically: lock on chain A, mint on chain B.', category: 'Layer 2' },
  { term: 'Calldata', definition: 'Read-only data attached to an Ethereum transaction. Rollups post compressed transaction batches as calldata to save gas.', category: 'Layer 2' },
  { term: 'Data Availability', definition: 'The guarantee that transaction data is published and accessible to anyone who needs to verify the chain.', category: 'Layer 2' },
  { term: 'Fraud Proof', definition: 'A mechanism in optimistic rollups where anyone can prove that a batch contains an invalid transaction, causing it to be reverted.', category: 'Layer 2' },
  { term: 'Sequencer', definition: 'The entity that collects L2 transactions, orders them, and posts batches to L1. Currently centralized in most rollups.', category: 'Layer 2' },
  { term: 'Validity Proof', definition: 'A cryptographic proof (zk-SNARK or zk-STARK) that mathematically proves all transactions in a batch are valid.', category: 'Layer 2' },

  // --- Governance ---
  { term: 'DAO (Decentralized Autonomous Organization)', definition: 'An organization governed by smart contracts and token holder votes instead of a traditional management hierarchy.', category: 'Governance', example: 'Aave DAO, Uniswap Governance, MakerDAO' },
  { term: 'Delegation', definition: 'Assigning your voting power to another address. Your tokens stay in your wallet, but the delegate votes on your behalf.', category: 'Governance' },
  { term: 'Governance Token', definition: 'A token that grants voting rights in a protocol\'s governance. More tokens = more voting power (in simple majority systems).', category: 'Governance', example: 'UNI (Uniswap), AAVE, COMP (Compound)' },
  { term: 'Multisig', definition: 'A wallet that requires multiple signatures (e.g. 3 of 5 key holders) to authorize a transaction. Prevents single points of failure.', category: 'Governance', example: 'Gnosis Safe is the most popular multisig.' },
  { term: 'Proposal', definition: 'A governance action submitted for voting. Can include code changes, treasury spending, or parameter updates.', category: 'Governance' },
  { term: 'Quadratic Voting', definition: 'A voting system where voting power = square root of tokens. Reduces the influence of whales and amplifies smaller holders.', category: 'Governance' },
  { term: 'Quorum', definition: 'The minimum number of votes required for a governance proposal to be valid. Prevents low-turnout decisions.', category: 'Governance' },
  { term: 'Timelock', definition: 'A mandatory delay between a proposal passing and its execution. Gives users time to exit if they disagree.', category: 'Governance', example: 'Most protocols use a 24-48 hour timelock.' },

  // --- Development ---
  { term: 'ABI Encoding', definition: 'The process of converting function calls and parameters into the bytecode format the EVM understands. Each parameter is padded to 32 bytes.', category: 'Development' },
  { term: 'Constructor', definition: 'A special function that runs only once when a contract is deployed. Used to set initial state and owner.', category: 'Development' },
  { term: 'Event', definition: 'A Solidity logging mechanism. Events are stored in transaction logs and are the cheapest way to store data (not accessible from contracts).', category: 'Development' },
  { term: 'Foundry', definition: 'A fast, Solidity-native development framework. Write tests in Solidity instead of JavaScript. Includes forge, cast, anvil.', category: 'Development' },
  { term: 'Function Selector', definition: 'The first 4 bytes of the keccak256 hash of a function signature. Used by the EVM to route calls to the correct function.', category: 'Development', example: 'transfer(address,uint256) → 0xa9059cbb' },
  { term: 'Hardhat', definition: 'A popular JavaScript-based Ethereum development framework. Includes testing, deployment scripts, and a local blockchain.', category: 'Development' },
  { term: 'Interface', definition: 'A contract definition with only function signatures and no implementation. Used to interact with deployed contracts.', category: 'Development' },
  { term: 'Modifier', definition: 'A reusable function decorator in Solidity. Commonly used for access control (onlyOwner) or reentrancy guards.', category: 'Development' },
  { term: 'Proxy Pattern', definition: 'A design pattern for upgrading contracts. The proxy stores data and delegates calls to an implementation contract that can be swapped.', category: 'Development' },
  { term: 'Remix', definition: 'A browser-based Solidity IDE. Great for beginners — no installation needed. Includes compiler, deployer, and debugger.', category: 'Development' },
  { term: 'Storage Slot', definition: 'A 32-byte location in contract storage. Variables are assigned to slots sequentially. Smaller types can be packed into one slot.', category: 'Development' },
  { term: 'Vyper', definition: 'An alternative smart contract language focused on simplicity and security. Pythonic syntax. No inheritance, no function overloading.', category: 'Development' }
];

// Helper: get all unique categories
export const GLOSSARY_CATEGORIES = [...new Set(GLOSSARY_TERMS.map(t => t.category))];

// Helper: filter terms by category and search query
export function filterGlossary(terms, { category = null, search = '' } = {}) {
  return terms.filter(t => {
    const matchCategory = !category || t.category === category;
    const matchSearch = !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });
}
