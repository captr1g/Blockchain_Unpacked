/**
 * Quiz questions per section.
 * Each question: { id, question, options: ['a','b','c','d'], correctIndex, explanation }
 */
export const QUIZZES = {
  consensus: [
    {
      id: 'c1',
      question: 'In Proof of Stake, validators are selected based on:',
      options: ['Hash power (CPU/GPU)', 'Amount of tokens staked', 'First come, first served', 'Random lottery with equal chances'],
      correctIndex: 1,
      explanation: 'PoS selects validators proportionally to their stake. More tokens staked = higher chance of being chosen to validate a block.'
    },
    {
      id: 'c2',
      question: 'What does a miner change repeatedly to find a valid block hash in PoW?',
      options: ['The transaction list', 'The block timestamp', 'The nonce', 'The difficulty target'],
      correctIndex: 2,
      explanation: 'Miners increment the nonce and re-hash the block header until they find a hash below the difficulty target.'
    },
    {
      id: 'c3',
      question: 'Which is MORE energy efficient?',
      options: ['Proof of Work', 'Proof of Stake', 'Both are equal', 'Depends on the blockchain'],
      correctIndex: 1,
      explanation: 'PoS uses ~99.95% less energy than PoW because it doesn\'t require computational puzzle solving.'
    },
    {
      id: 'c4',
      question: 'What is a 51% attack?',
      options: [
        'When 51% of nodes go offline',
        'When one entity controls >50% of mining power (PoW) or stake (PoS)',
        'When 51% of transactions fail',
        'When gas fees exceed 51 gwei'
      ],
      correctIndex: 1,
      explanation: 'A 51% attack allows the attacker to reorganize the blockchain, double-spend, and censor transactions.'
    }
  ],

  solidity: [
    {
      id: 's1',
      question: 'What does the "view" keyword mean on a function?',
      options: ['It can modify state', 'It reads state but cannot modify it', 'It costs zero gas always', 'It is only visible to the owner'],
      correctIndex: 1,
      explanation: '"view" functions can read state variables but cannot write to them. Free when called externally, costs gas when called by another contract.'
    },
    {
      id: 's2',
      question: 'Which data location is cheapest for function parameters in external functions?',
      options: ['storage', 'memory', 'calldata', 'stack'],
      correctIndex: 2,
      explanation: '"calldata" is read-only and doesn\'t copy data to memory, making it the cheapest option for external function parameters.'
    },
    {
      id: 's3',
      question: 'A mapping in Solidity can be iterated (looped) over:',
      options: ['True, using a for loop', 'True, but only with assembly', 'False, mappings cannot be iterated', 'True, using .keys()'],
      correctIndex: 2,
      explanation: 'Mappings don\'t store keys, so you cannot iterate over them. To iterate, maintain a separate array of keys.'
    },
    {
      id: 's4',
      question: 'What happens when you call a constructor?',
      options: ['It runs every time the contract is called', 'It runs only once when the contract is deployed', 'It creates a new instance each time', 'It is optional and does nothing'],
      correctIndex: 1,
      explanation: 'The constructor executes exactly once during contract deployment. It\'s used to initialize state variables.'
    },
    {
      id: 's5',
      question: 'Using `uint8` instead of `uint256` in a loop saves gas:',
      options: ['Always true', 'Only in storage', 'False — EVM operates on 256-bit words, so smaller types cost MORE in computation', 'Only in memory'],
      correctIndex: 2,
      explanation: 'The EVM natively uses 256-bit words. Using uint8 requires extra operations to mask/cast, costing MORE gas in computation.'
    }
  ],

  deployment: [
    {
      id: 'd1',
      question: 'A function selector is the first ___ bytes of the keccak256 hash of the function signature:',
      options: ['2 bytes', '4 bytes', '8 bytes', '32 bytes'],
      correctIndex: 1,
      explanation: 'Function selectors are 4 bytes (8 hex characters). Example: transfer(address,uint256) → 0xa9059cbb'
    },
    {
      id: 'd2',
      question: 'Why do different chains have different Chain IDs?',
      options: ['For branding purposes', 'To prevent replay attacks across chains', 'To set different gas prices', 'For DNS routing'],
      correctIndex: 1,
      explanation: 'Chain IDs are included in transaction signatures. This prevents a signed Ethereum transaction from being replayed on Polygon (different Chain ID).'
    },
    {
      id: 'd3',
      question: 'What happens to a smart contract after deployment?',
      options: ['It can be edited by the owner', 'Its code is immutable — it cannot be changed', 'It expires after 1 year', 'It needs to be renewed monthly'],
      correctIndex: 1,
      explanation: 'Smart contract bytecode is immutable after deployment. To "upgrade", you need the proxy pattern (a separate topic).'
    }
  ],

  security: [
    {
      id: 'sec1',
      question: 'The Check-Effects-Interactions pattern prevents:',
      options: ['Integer overflow', 'Reentrancy attacks', 'Front-running', 'Gas optimization issues'],
      correctIndex: 1,
      explanation: 'By updating state BEFORE making external calls, you prevent the attacker from re-entering and using stale state.'
    },
    {
      id: 'sec2',
      question: 'In Solidity >= 0.8.0, integer overflow:',
      options: ['Still wraps around silently', 'Causes a revert automatically', 'Is only caught if you use SafeMath', 'Depends on the compiler settings'],
      correctIndex: 1,
      explanation: 'Starting in Solidity 0.8.0, overflow/underflow causes an automatic revert. Before 0.8.0, you needed OpenZeppelin SafeMath.'
    },
    {
      id: 'sec3',
      question: 'Why is using block.timestamp for randomness insecure?',
      options: ['Timestamps are always zero', 'Validators/miners can manipulate the timestamp within a small range', 'It produces the same number every time', 'It only works on testnets'],
      correctIndex: 1,
      explanation: 'Block proposers can adjust the timestamp by several seconds, enough to influence "random" outcomes based on it.'
    },
    {
      id: 'sec4',
      question: 'A flash loan attack is possible because:',
      options: [
        'Flash loans have no time limit',
        'Flash loans are uncollateralized and atomic — if profit isn\'t made, the tx reverts with no loss',
        'Flash loans bypass gas fees',
        'Flash loans can modify other contracts\' storage'
      ],
      correctIndex: 1,
      explanation: 'Flash loans let anyone borrow unlimited funds for one transaction. This enables price manipulation attacks with zero risk.'
    },
    {
      id: 'sec5',
      question: 'Which is the MOST common smart contract vulnerability by dollar amount lost?',
      options: ['Integer overflow', 'Access control (missing permissions)', 'Reentrancy', 'Gas limit issues'],
      correctIndex: 1,
      explanation: 'Access control vulnerabilities (missing onlyOwner, wrong permissions) caused the most losses in 2023-2024, totaling over $900M.'
    }
  ],

  tokens: [
    {
      id: 't1',
      question: 'The approve + transferFrom pattern in ERC-20 is used for:',
      options: ['Burning tokens', 'Allowing a contract (like a DEX) to spend tokens on your behalf', 'Minting new tokens', 'Checking total supply'],
      correctIndex: 1,
      explanation: 'You approve() a DEX contract to spend your tokens. The DEX then calls transferFrom() to move tokens during a swap.'
    },
    {
      id: 't2',
      question: 'ERC-1155 is better than ERC-721 for games because:',
      options: ['It supports only unique items', 'It allows batch transfers of multiple item types in one transaction', 'It is newer', 'It uses less storage per token'],
      correctIndex: 1,
      explanation: 'ERC-1155\'s batch operations let you transfer 10 swords + 5 shields + 100 gold in ONE transaction instead of 115 separate ones.'
    },
    {
      id: 't3',
      question: 'What does tokenURI() return in ERC-721?',
      options: ['The token price', 'A URL pointing to the NFT\'s metadata (image, name, attributes)', 'The owner address', 'The contract address'],
      correctIndex: 1,
      explanation: 'tokenURI returns a URL (usually IPFS) to a JSON file containing the NFT\'s name, description, image, and attributes.'
    }
  ],

  defi: [
    {
      id: 'df1',
      question: 'In the constant product formula x * y = k, what happens when you buy a large amount of token X?',
      options: ['Price stays the same', 'Price of X increases (you get less X per Y)', 'Price of X decreases', 'k changes'],
      correctIndex: 1,
      explanation: 'Buying X removes it from the pool. To keep k constant, Y increases. The ratio changes = price increases. Large buys cause more slippage.'
    },
    {
      id: 'df2',
      question: 'Impermanent loss occurs when:',
      options: ['You withdraw too early', 'Token prices diverge from the ratio at which you deposited', 'Gas fees are too high', 'The pool runs out of liquidity'],
      correctIndex: 1,
      explanation: 'When prices move in either direction from your deposit ratio, your LP position is worth less than if you had just held the tokens.'
    },
    {
      id: 'df3',
      question: 'What triggers a liquidation in a lending protocol?',
      options: ['Borrowing too much at once', 'Collateral value drops below the minimum ratio', 'Not repaying within 30 days', 'The protocol runs out of funds'],
      correctIndex: 1,
      explanation: 'If your collateral ratio drops below the liquidation threshold (e.g., 120%), anyone can repay part of your debt and seize your collateral at a discount.'
    }
  ],

  layer2: [
    {
      id: 'l1',
      question: 'The main advantage of ZK rollups over optimistic rollups is:',
      options: ['Lower gas fees', 'No 7-day challenge period — finality is much faster', 'Full EVM compatibility', 'More TVL'],
      correctIndex: 1,
      explanation: 'ZK rollups prove validity with math (validity proofs), so there\'s no need for a 7-day fraud proof window. Finality is near-instant.'
    },
    {
      id: 'l2',
      question: 'How do rollups inherit Ethereum\'s security?',
      options: ['By running on the same hardware', 'By posting transaction data to L1 — anyone can verify', 'By using the same token', 'They don\'t — they have their own security'],
      correctIndex: 1,
      explanation: 'Rollups post compressed data to Ethereum L1. This means anyone can reconstruct the L2 state from L1 data, inheriting Ethereum\'s security guarantees.'
    },
    {
      id: 'l3',
      question: 'What is a sequencer in a Layer 2?',
      options: ['A type of smart contract', 'The entity that orders L2 transactions and posts batches to L1', 'A consensus mechanism', 'A type of validator node'],
      correctIndex: 1,
      explanation: 'The sequencer collects L2 transactions, determines their order, executes them, and submits compressed batches to Ethereum L1.'
    }
  ]
};
