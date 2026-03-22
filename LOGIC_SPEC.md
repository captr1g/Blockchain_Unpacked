# LOGIC SPEC - For Cloud Team

> All data, functions, hooks, and calculations for Phase 1 features.
> **Do NOT write any JSX or UI code.** Only export plain JS functions, objects, arrays, and custom React hooks.
> The UI team (Anti-Gravity) will import everything from the files you create.

---

## Project Context

- **Stack**: React 19 + Vite 7 + Tailwind 4 + Framer Motion 12
- **Pattern**: Each existing page keeps logic inline (useState, useEffect). For new features, we're splitting logic into `src/data/` and `src/hooks/` folders.
- **No external APIs.** All data is hardcoded. All state is React hooks + localStorage.

## Files You Create

```
src/
  data/
    tokenStandards.js      -- Feature 1: ERC standards data
    defiConcepts.js         -- Feature 2: DeFi formulas + data
    flashLoan.js            -- Feature 3: Flash loan steps + code
    layer2Data.js           -- Feature 4: L2 comparison data
    glossary.js             -- Feature 5: 100+ glossary terms
    quizzes.js              -- Feature 6: Quiz questions per section
  hooks/
    useAMM.js               -- Feature 2: AMM simulator hook
    useLending.js            -- Feature 2: Lending simulator hook
    useQuiz.js               -- Feature 6: Quiz state + localStorage
    useProgress.js           -- Feature 6: Progress tracking hook
```

---

## FEATURE 1: ERC Token Standards Data

**File**: `src/data/tokenStandards.js`

### What to Export

```js
// 1. ERC_STANDARDS — array of 3 standards
export const ERC_STANDARDS = [
  {
    id: 'erc20',
    name: 'ERC-20',
    title: 'Fungible Token Standard',
    description: 'The standard for creating interchangeable tokens like USDC, DAI, UNI. Every token is identical.',
    useCases: ['Currencies', 'Governance tokens', 'Stablecoins', 'Utility tokens'],
    gasEstimate: '~65,000 gas to deploy, ~50,000 per transfer',
    functions: [
      {
        name: 'totalSupply',
        signature: 'function totalSupply() external view returns (uint256)',
        params: [],
        returns: 'uint256 — total tokens in existence',
        description: 'Returns the total number of tokens that exist. This includes all minted tokens minus any that have been burned.',
        analogy: 'Like checking how many dollars the US Treasury has printed in total.',
        example: `// Returns: 1000000000000000000000000 (1 million tokens with 18 decimals)
uint256 total = token.totalSupply();`
      },
      {
        name: 'balanceOf',
        signature: 'function balanceOf(address account) external view returns (uint256)',
        params: [{ name: 'account', type: 'address', desc: 'The wallet address to query' }],
        returns: 'uint256 — token balance of that address',
        description: 'Returns how many tokens a specific address holds.',
        analogy: 'Like checking your bank account balance.',
        example: `uint256 myBalance = token.balanceOf(msg.sender);`
      },
      {
        name: 'transfer',
        signature: 'function transfer(address to, uint256 amount) external returns (bool)',
        params: [
          { name: 'to', type: 'address', desc: 'Recipient address' },
          { name: 'amount', type: 'uint256', desc: 'Number of tokens to send' }
        ],
        returns: 'bool — true if transfer succeeded',
        description: 'Moves tokens from the caller to the recipient. Emits a Transfer event. Reverts if sender has insufficient balance.',
        analogy: 'Like sending money from your bank account to a friend via bank transfer.',
        example: `token.transfer(recipientAddress, 100 * 10**18);`
      },
      {
        name: 'approve',
        signature: 'function approve(address spender, uint256 amount) external returns (bool)',
        params: [
          { name: 'spender', type: 'address', desc: 'Address allowed to spend tokens' },
          { name: 'amount', type: 'uint256', desc: 'Max amount they can spend' }
        ],
        returns: 'bool — true if approval succeeded',
        description: 'Gives a third party (like a DEX contract) permission to spend up to `amount` tokens from your wallet. CRITICAL for DeFi — this is how Uniswap can swap your tokens.',
        analogy: 'Like giving your accountant a spending limit on your credit card. They can spend up to that limit on your behalf.',
        example: `// Allow Uniswap router to spend 1000 tokens
token.approve(uniswapRouterAddress, 1000 * 10**18);`
      },
      {
        name: 'transferFrom',
        signature: 'function transferFrom(address from, address to, uint256 amount) external returns (bool)',
        params: [
          { name: 'from', type: 'address', desc: 'Address to take tokens from' },
          { name: 'to', type: 'address', desc: 'Address to send tokens to' },
          { name: 'amount', type: 'uint256', desc: 'Number of tokens' }
        ],
        returns: 'bool — true if transfer succeeded',
        description: 'Moves tokens on behalf of another address. Requires prior approve(). This is the second half of the approve+transferFrom pattern used by all DEXs and DeFi protocols.',
        analogy: 'Your accountant (approved spender) actually making a purchase with your credit card.',
        example: `// DEX contract moves tokens from user to pool
token.transferFrom(userAddress, poolAddress, 500 * 10**18);`
      },
      {
        name: 'allowance',
        signature: 'function allowance(address owner, address spender) external view returns (uint256)',
        params: [
          { name: 'owner', type: 'address', desc: 'Token holder' },
          { name: 'spender', type: 'address', desc: 'Approved spender' }
        ],
        returns: 'uint256 — remaining allowance',
        description: 'Checks how many tokens `spender` is still allowed to transfer from `owner`. Decreases after each transferFrom.',
        analogy: 'Checking the remaining credit limit you gave your accountant.',
        example: `uint256 remaining = token.allowance(myAddress, uniswapRouter);`
      }
    ]
  },
  {
    id: 'erc721',
    name: 'ERC-721',
    title: 'Non-Fungible Token (NFT) Standard',
    description: 'Each token is unique with its own ID. Used for digital art, collectibles, domain names, and real estate.',
    useCases: ['Digital art (OpenSea)', 'Game characters', 'Domain names (ENS)', 'Event tickets'],
    gasEstimate: '~150,000 gas to mint, ~80,000 per transfer',
    functions: [
      {
        name: 'balanceOf',
        signature: 'function balanceOf(address owner) external view returns (uint256)',
        params: [{ name: 'owner', type: 'address', desc: 'NFT holder address' }],
        returns: 'uint256 — number of NFTs owned',
        description: 'Returns how many NFTs a specific address owns. Unlike ERC-20, this tells you the COUNT, not the value.',
        analogy: 'Like asking "how many paintings do you own?" — not which ones, just how many.',
        example: `uint256 nftCount = nft.balanceOf(msg.sender); // e.g. 3`
      },
      {
        name: 'ownerOf',
        signature: 'function ownerOf(uint256 tokenId) external view returns (address)',
        params: [{ name: 'tokenId', type: 'uint256', desc: 'The unique NFT ID' }],
        returns: 'address — current owner',
        description: 'Returns who currently owns a specific NFT. Every NFT has exactly one owner at any time.',
        analogy: 'Like checking the deed of a house — who is the registered owner of property #4523?',
        example: `address owner = nft.ownerOf(42); // Who owns NFT #42?`
      },
      {
        name: 'safeTransferFrom',
        signature: 'function safeTransferFrom(address from, address to, uint256 tokenId) external',
        params: [
          { name: 'from', type: 'address', desc: 'Current owner' },
          { name: 'to', type: 'address', desc: 'New owner' },
          { name: 'tokenId', type: 'uint256', desc: 'NFT to transfer' }
        ],
        returns: 'void',
        description: 'Transfers an NFT safely. "Safe" means it checks if the recipient is a contract, and if so, verifies the contract can handle NFTs (implements onERC721Received). Prevents NFTs from being lost forever in contracts.',
        analogy: 'Like sending a package with delivery confirmation — if no one is home to receive it, it comes back to you.',
        example: `nft.safeTransferFrom(msg.sender, buyerAddress, 42);`
      },
      {
        name: 'approve',
        signature: 'function approve(address to, uint256 tokenId) external',
        params: [
          { name: 'to', type: 'address', desc: 'Address to approve' },
          { name: 'tokenId', type: 'uint256', desc: 'Specific NFT to approve' }
        ],
        returns: 'void',
        description: 'Approves ONE address to transfer ONE specific NFT. Unlike ERC-20 approve (which sets a spending amount), this is per-token.',
        analogy: 'Giving a specific painting to an auction house to sell on your behalf.',
        example: `nft.approve(marketplaceAddress, 42); // Marketplace can transfer NFT #42`
      },
      {
        name: 'setApprovalForAll',
        signature: 'function setApprovalForAll(address operator, bool approved) external',
        params: [
          { name: 'operator', type: 'address', desc: 'Address to approve/revoke' },
          { name: 'approved', type: 'bool', desc: 'true = approve, false = revoke' }
        ],
        returns: 'void',
        description: 'Gives or revokes permission for an operator to manage ALL your NFTs. Used by marketplaces like OpenSea.',
        analogy: 'Giving an art dealer the keys to your entire gallery — they can move any painting.',
        example: `nft.setApprovalForAll(openseaAddress, true);`
      },
      {
        name: 'tokenURI',
        signature: 'function tokenURI(uint256 tokenId) external view returns (string)',
        params: [{ name: 'tokenId', type: 'uint256', desc: 'NFT ID to query' }],
        returns: 'string — metadata URL (usually IPFS)',
        description: 'Returns the metadata URL for an NFT. This URL points to a JSON file containing the name, description, image, and attributes. Usually stored on IPFS.',
        analogy: 'Like a certificate of authenticity for a painting — it links to all the details about the artwork.',
        example: `string memory uri = nft.tokenURI(42);
// Returns: "ipfs://Qm.../42.json"`
      }
    ]
  },
  {
    id: 'erc1155',
    name: 'ERC-1155',
    title: 'Multi-Token Standard',
    description: 'A single contract manages BOTH fungible and non-fungible tokens. Supports batch operations to save gas. Created by Enjin for gaming.',
    useCases: ['Game items (swords, potions)', 'Event ticket tiers', 'Mixed fungible + NFT collections', 'Metaverse assets'],
    gasEstimate: '~50,000 gas per batch mint (vs ~150,000 per NFT with ERC-721)',
    functions: [
      {
        name: 'balanceOf',
        signature: 'function balanceOf(address account, uint256 id) external view returns (uint256)',
        params: [
          { name: 'account', type: 'address', desc: 'Holder address' },
          { name: 'id', type: 'uint256', desc: 'Token type ID' }
        ],
        returns: 'uint256 — balance of that token type',
        description: 'Returns how many of a specific token type an address holds. Token ID 1 might be "Gold Sword" — you could own 3 of them.',
        analogy: 'Like checking inventory: "How many health potions (item #5) does Player A have?"',
        example: `uint256 swords = token.balanceOf(player, 1); // 3 gold swords`
      },
      {
        name: 'balanceOfBatch',
        signature: 'function balanceOfBatch(address[] accounts, uint256[] ids) external view returns (uint256[])',
        params: [
          { name: 'accounts', type: 'address[]', desc: 'Array of addresses' },
          { name: 'ids', type: 'uint256[]', desc: 'Array of token IDs' }
        ],
        returns: 'uint256[] — array of balances',
        description: 'Check multiple balances in ONE call. Huge gas savings vs calling balanceOf multiple times.',
        analogy: 'Like asking the warehouse: "How many swords does Alice have, how many shields does Bob have, how many potions does Carol have?" — all in one question.',
        example: `uint256[] memory balances = token.balanceOfBatch(
  [alice, bob, carol],
  [SWORD_ID, SHIELD_ID, POTION_ID]
);`
      },
      {
        name: 'safeTransferFrom',
        signature: 'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external',
        params: [
          { name: 'from', type: 'address', desc: 'Sender' },
          { name: 'to', type: 'address', desc: 'Receiver' },
          { name: 'id', type: 'uint256', desc: 'Token type' },
          { name: 'amount', type: 'uint256', desc: 'How many to transfer' },
          { name: 'data', type: 'bytes', desc: 'Extra data (often empty)' }
        ],
        returns: 'void',
        description: 'Transfer a specific amount of a token type. You can send 10 health potions in one call.',
        analogy: 'Trading items with another player — "Here are 5 of my iron ore."',
        example: `token.safeTransferFrom(msg.sender, buyer, POTION_ID, 10, "");`
      },
      {
        name: 'safeBatchTransferFrom',
        signature: 'function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) external',
        params: [
          { name: 'from', type: 'address', desc: 'Sender' },
          { name: 'to', type: 'address', desc: 'Receiver' },
          { name: 'ids', type: 'uint256[]', desc: 'Token types array' },
          { name: 'amounts', type: 'uint256[]', desc: 'Amounts array' }
        ],
        returns: 'void',
        description: 'Transfer MULTIPLE token types in ONE transaction. This is the killer feature of ERC-1155 — massive gas savings.',
        analogy: 'Like a trade offer in a game: "I\'ll give you 3 swords, 10 potions, and 1 rare shield — all in one trade."',
        example: `token.safeBatchTransferFrom(
  msg.sender, buyer,
  [SWORD_ID, POTION_ID, SHIELD_ID],
  [3, 10, 1],
  ""
);`
      },
      {
        name: 'setApprovalForAll',
        signature: 'function setApprovalForAll(address operator, bool approved) external',
        params: [
          { name: 'operator', type: 'address', desc: 'Marketplace/operator address' },
          { name: 'approved', type: 'bool', desc: 'true = grant, false = revoke' }
        ],
        returns: 'void',
        description: 'Approve an operator to manage ALL your tokens of ALL types. Same as ERC-721 but covers every token type in the contract.',
        analogy: 'Giving a game marketplace access to your entire inventory for trading.',
        example: `token.setApprovalForAll(marketplaceAddress, true);`
      }
    ]
  }
];

// 2. COMPARISON_TABLE — for the comparison section
export const TOKEN_COMPARISON = [
  { property: 'Fungibility', erc20: 'Fully fungible (identical)', erc721: 'Non-fungible (each unique)', erc1155: 'Both fungible & non-fungible' },
  { property: 'Token Types per Contract', erc20: '1', erc721: '1 (each ID is unique)', erc1155: 'Unlimited types' },
  { property: 'Batch Transfers', erc20: 'No', erc721: 'No', erc1155: 'Yes (huge gas savings)' },
  { property: 'Metadata', erc20: 'Name + Symbol only', erc721: 'tokenURI per token', erc1155: 'URI per token type' },
  { property: 'Mint Gas Cost', erc20: '~50K gas', erc721: '~150K gas', erc1155: '~50K gas (batch)' },
  { property: 'Transfer Gas Cost', erc20: '~50K gas', erc721: '~80K gas', erc1155: '~50K gas' },
  { property: 'Best For', erc20: 'Currencies, governance', erc721: 'Art, collectibles, domains', erc1155: 'Games, mixed collections' },
  { property: 'Real Examples', erc20: 'USDC, UNI, AAVE, DAI', erc721: 'CryptoPunks, ENS, BAYC', erc1155: 'Enjin, Gods Unchained' }
];

// 3. DECISION_TREE — for the flowchart
export const DECISION_TREE = {
  start: {
    question: 'Are all your tokens identical (interchangeable)?',
    yes: 'erc20_result',
    no: 'unique_check'
  },
  unique_check: {
    question: 'Is each token completely unique (one of a kind)?',
    yes: 'batch_check',
    no: 'erc1155_result'
  },
  batch_check: {
    question: 'Do you need batch operations or multiple token types in one contract?',
    yes: 'erc1155_result',
    no: 'erc721_result'
  },
  erc20_result: {
    result: 'ERC-20',
    reason: 'Your tokens are fungible — each one is identical. Perfect for currencies, governance tokens, or utility tokens.'
  },
  erc721_result: {
    result: 'ERC-721',
    reason: 'Each token is unique with its own identity. Ideal for digital art, collectibles, or domain names.'
  },
  erc1155_result: {
    result: 'ERC-1155',
    reason: 'You need multiple token types or batch operations. Perfect for games, mixed collections, or any project with both fungible and non-fungible items.'
  }
};
```

---

## FEATURE 2: DeFi Concepts — Data + Hooks

### File: `src/data/defiConcepts.js`

```js
// Static data for DeFi glossary cards

export const DEFI_GLOSSARY = [
  {
    term: 'AMM (Automated Market Maker)',
    definition: 'A protocol that uses math formulas instead of order books to set token prices. Uniswap uses x * y = k.',
    example: 'If Pool has 1000 ETH and 2,000,000 USDC, k = 2,000,000,000. Buying ETH removes ETH and adds USDC, keeping k constant.'
  },
  {
    term: 'Liquidity Pool',
    definition: 'A smart contract holding two tokens that traders swap between. Anyone can deposit tokens to earn trading fees.',
    example: 'The ETH/USDC pool on Uniswap holds both ETH and USDC. Every swap pays 0.3% to liquidity providers.'
  },
  {
    term: 'Impermanent Loss',
    definition: 'The loss LP providers experience when token prices change compared to just holding. Called "impermanent" because it reverses if prices return to original.',
    example: 'You deposit $1000 in ETH/USDC pool. ETH doubles in price. Your LP position is worth $1414, but holding would be worth $1500. IL = $86 (5.7%).'
  },
  {
    term: 'TVL (Total Value Locked)',
    definition: 'The total value of crypto assets deposited in a DeFi protocol. A key metric for measuring protocol adoption.',
    example: 'Aave has $10B TVL means $10 billion worth of tokens are deposited and being used for lending/borrowing.'
  },
  {
    term: 'Slippage',
    definition: 'The difference between the expected price and the actual execution price. Larger trades cause more slippage in AMMs.',
    example: 'You expect to buy ETH at $3000. Due to slippage, you actually pay $3015. That $15 difference is slippage (0.5%).'
  },
  {
    term: 'APR vs APY',
    definition: 'APR = Annual Percentage Rate (simple interest). APY = Annual Percentage Yield (compound interest). APY is always higher.',
    example: '100% APR on $1000 = $2000 after 1 year. 100% APY (compounded daily) on $1000 = $2718 after 1 year.'
  },
  {
    term: 'Collateral Ratio',
    definition: 'The ratio of collateral value to borrowed value. Must stay above the liquidation threshold or your collateral gets sold.',
    example: 'Deposit $1500 ETH, borrow $1000 USDC. Collateral ratio = 150%. If ETH drops and ratio hits 120%, you get liquidated.'
  },
  {
    term: 'Liquidation',
    definition: 'When a borrower\'s collateral ratio drops below the minimum, anyone can repay part of the debt and seize collateral at a discount.',
    example: 'Your collateral drops to 115% ratio (minimum is 120%). A liquidator pays back $500 of your debt and takes $550 of your ETH (10% bonus).'
  }
];

// Impermanent Loss calculation presets
export const IL_PRESETS = [
  { label: '1.5x', multiplier: 1.5 },
  { label: '2x', multiplier: 2 },
  { label: '3x', multiplier: 3 },
  { label: '5x', multiplier: 5 },
  { label: '0.5x', multiplier: 0.5 },
  { label: '0.25x', multiplier: 0.25 }
];
```

### File: `src/hooks/useAMM.js`

```js
import { useState, useCallback } from 'react';

/**
 * AMM Simulator Hook — implements Uniswap v2 constant product formula
 *
 * Returns state + functions for the UI to consume:
 * - poolA, poolB: current token amounts in the pool
 * - k: the constant product (poolA * poolB)
 * - swapAtoB(amountA): swap token A for token B, returns { amountOut, slippage, priceImpact }
 * - swapBtoA(amountB): swap token B for token A, returns { amountOut, slippage, priceImpact }
 * - addLiquidity(amountA, amountB): add tokens to pool
 * - reset(): reset pool to initial state
 * - getPrice(): current price of A in terms of B
 * - getSlippageForAmount(amount, direction): preview slippage without executing
 */
export function useAMM(initialA = 1000, initialB = 2000000) {
  const [poolA, setPoolA] = useState(initialA);       // e.g. 1000 ETH
  const [poolB, setPoolB] = useState(initialB);       // e.g. 2,000,000 USDC
  const [history, setHistory] = useState([]);          // swap history for display

  const k = poolA * poolB;

  const getPrice = useCallback(() => {
    return poolB / poolA;  // price of A in terms of B
  }, [poolA, poolB]);

  const getSlippageForAmount = useCallback((amountIn, direction = 'AtoB') => {
    const spotPrice = direction === 'AtoB' ? poolB / poolA : poolA / poolB;
    let amountOut;
    if (direction === 'AtoB') {
      const newPoolA = poolA + amountIn;
      const newPoolB = k / newPoolA;
      amountOut = poolB - newPoolB;
    } else {
      const newPoolB = poolB + amountIn;
      const newPoolA = k / newPoolB;
      amountOut = poolA - newPoolA;
    }
    const effectivePrice = amountOut / amountIn;
    const slippagePct = ((spotPrice - effectivePrice) / spotPrice) * 100;
    const priceImpactPct = (amountIn / (direction === 'AtoB' ? poolA : poolB)) * 100;
    return {
      amountOut: Math.max(0, amountOut),
      slippagePct: Math.max(0, slippagePct),
      priceImpactPct,
      effectivePrice,
      spotPrice
    };
  }, [poolA, poolB, k]);

  const swapAtoB = useCallback((amountIn) => {
    if (amountIn <= 0 || amountIn >= poolA * 0.9) return null;  // prevent draining pool
    const result = getSlippageForAmount(amountIn, 'AtoB');
    const newPoolA = poolA + amountIn;
    const newPoolB = k / newPoolA;
    setPoolA(newPoolA);
    setPoolB(newPoolB);
    setHistory(prev => [...prev.slice(-9), {
      direction: 'A→B',
      amountIn,
      amountOut: result.amountOut,
      slippage: result.slippagePct,
      timestamp: Date.now()
    }]);
    return result;
  }, [poolA, poolB, k, getSlippageForAmount]);

  const swapBtoA = useCallback((amountIn) => {
    if (amountIn <= 0 || amountIn >= poolB * 0.9) return null;
    const result = getSlippageForAmount(amountIn, 'BtoA');
    const newPoolB = poolB + amountIn;
    const newPoolA = k / newPoolB;
    setPoolA(newPoolA);
    setPoolB(newPoolB);
    setHistory(prev => [...prev.slice(-9), {
      direction: 'B→A',
      amountIn,
      amountOut: result.amountOut,
      slippage: result.slippagePct,
      timestamp: Date.now()
    }]);
    return result;
  }, [poolA, poolB, k, getSlippageForAmount]);

  const reset = useCallback(() => {
    setPoolA(initialA);
    setPoolB(initialB);
    setHistory([]);
  }, [initialA, initialB]);

  return {
    poolA, poolB, k, history,
    getPrice, getSlippageForAmount,
    swapAtoB, swapBtoA, reset
  };
}

/**
 * Impermanent Loss Calculator — pure function, no state
 *
 * @param {number} priceMultiplier - e.g. 2.0 means price doubled
 * @returns {{ ilPercent, lpValue, holdValue, difference }}
 *
 * Formula: IL = 2 * sqrt(priceMultiplier) / (1 + priceMultiplier) - 1
 */
export function calculateImpermanentLoss(priceMultiplier) {
  if (priceMultiplier <= 0) return { ilPercent: 0, lpValue: 0, holdValue: 0, difference: 0 };

  const sqrtP = Math.sqrt(priceMultiplier);
  const ilRatio = (2 * sqrtP) / (1 + priceMultiplier);
  const ilPercent = (1 - ilRatio) * 100;

  // Assuming initial deposit of $1000 ($500 each token)
  const initialValue = 1000;
  const holdValue = initialValue * (1 + priceMultiplier) / 2;  // one half stayed same, other half moved
  const lpValue = holdValue * ilRatio;
  const difference = holdValue - lpValue;

  return {
    ilPercent: Math.round(ilPercent * 100) / 100,
    lpValue: Math.round(lpValue * 100) / 100,
    holdValue: Math.round(holdValue * 100) / 100,
    difference: Math.round(difference * 100) / 100
  };
}
```

### File: `src/hooks/useLending.js`

```js
import { useState, useCallback, useMemo } from 'react';

/**
 * Lending Protocol Simulator Hook
 *
 * Simulates depositing collateral, borrowing, and liquidation.
 *
 * Returns:
 * - collateralAmount, collateralPrice, borrowedAmount
 * - healthFactor: ratio of collateral value to borrowed value (< 1.0 = liquidation)
 * - collateralRatio: percentage (e.g. 150%)
 * - isLiquidatable: boolean
 * - deposit(amount): add collateral
 * - borrow(amount): borrow against collateral
 * - setPrice(newPrice): simulate price change
 * - liquidate(): simulate liquidation event
 * - reset(): reset to defaults
 */
export function useLending() {
  const LIQUIDATION_THRESHOLD = 120;  // 120% — below this, liquidation happens
  const INITIAL_PRICE = 3000;         // ETH price in USD

  const [collateralAmount, setCollateralAmount] = useState(0);   // ETH deposited
  const [collateralPrice, setCollateralPrice] = useState(INITIAL_PRICE);
  const [borrowedAmount, setBorrowedAmount] = useState(0);       // USDC borrowed
  const [isLiquidated, setIsLiquidated] = useState(false);
  const [logs, setLogs] = useState([]);

  const collateralValue = collateralAmount * collateralPrice;

  const collateralRatio = useMemo(() => {
    if (borrowedAmount === 0) return Infinity;
    return (collateralValue / borrowedAmount) * 100;
  }, [collateralValue, borrowedAmount]);

  const healthFactor = useMemo(() => {
    if (borrowedAmount === 0) return Infinity;
    return collateralValue / borrowedAmount;
  }, [collateralValue, borrowedAmount]);

  const isLiquidatable = collateralRatio < LIQUIDATION_THRESHOLD && borrowedAmount > 0;

  const maxBorrow = useMemo(() => {
    // Can borrow up to collateralValue / 1.5 (150% collateral ratio minimum for new borrows)
    return Math.max(0, Math.floor((collateralValue / 1.5) - borrowedAmount));
  }, [collateralValue, borrowedAmount]);

  const addLog = (type, text) => {
    setLogs(prev => [...prev.slice(-14), { type, text, time: Date.now() }]);
  };

  const deposit = useCallback((amount) => {
    if (amount <= 0 || isLiquidated) return;
    setCollateralAmount(prev => prev + amount);
    addLog('info', `Deposited ${amount} ETH as collateral`);
  }, [isLiquidated]);

  const borrow = useCallback((amount) => {
    if (amount <= 0 || isLiquidated) return;
    const newBorrowed = borrowedAmount + amount;
    const newRatio = (collateralValue / newBorrowed) * 100;
    if (newRatio < 150) {
      addLog('warn', `Cannot borrow — would drop ratio below 150%`);
      return false;
    }
    setBorrowedAmount(newBorrowed);
    addLog('info', `Borrowed ${amount} USDC (ratio: ${Math.round(newRatio)}%)`);
    return true;
  }, [borrowedAmount, collateralValue, isLiquidated]);

  const setPrice = useCallback((newPrice) => {
    setCollateralPrice(newPrice);
    const newValue = collateralAmount * newPrice;
    const newRatio = borrowedAmount > 0 ? (newValue / borrowedAmount) * 100 : Infinity;
    if (newRatio < LIQUIDATION_THRESHOLD && borrowedAmount > 0) {
      addLog('danger', `LIQUIDATION TRIGGERED — collateral ratio dropped to ${Math.round(newRatio)}%`);
    } else if (newRatio < 150 && borrowedAmount > 0) {
      addLog('warn', `WARNING — ratio at ${Math.round(newRatio)}%, approaching liquidation zone`);
    }
  }, [collateralAmount, borrowedAmount]);

  const liquidate = useCallback(() => {
    if (!isLiquidatable) return;
    setIsLiquidated(true);
    const seizedValue = borrowedAmount * 1.1; // Liquidator gets 10% bonus
    const seizedETH = seizedValue / collateralPrice;
    addLog('danger', `LIQUIDATED — ${seizedETH.toFixed(4)} ETH seized (${borrowedAmount} USDC debt repaid + 10% penalty)`);
    setCollateralAmount(prev => Math.max(0, prev - seizedETH));
    setBorrowedAmount(0);
  }, [isLiquidatable, borrowedAmount, collateralPrice]);

  const reset = useCallback(() => {
    setCollateralAmount(0);
    setCollateralPrice(INITIAL_PRICE);
    setBorrowedAmount(0);
    setIsLiquidated(false);
    setLogs([]);
  }, []);

  return {
    collateralAmount, collateralPrice, borrowedAmount,
    collateralValue, collateralRatio, healthFactor,
    isLiquidatable, isLiquidated, maxBorrow, logs,
    LIQUIDATION_THRESHOLD, INITIAL_PRICE,
    deposit, borrow, setPrice, liquidate, reset
  };
}
```

---

## FEATURE 3: Flash Loan Attack — Data

### File: `src/data/flashLoan.js`

```js
export const FLASH_LOAN_STEPS = [
  {
    id: 1,
    title: 'Borrow',
    description: 'Attacker borrows 10,000 ETH from a flash loan pool. Zero collateral required — but must repay within the SAME transaction.',
    balances: { attacker: 10000, pool: 0, dexA: 5000, dexB: 5000 },
    highlight: 'attacker'
  },
  {
    id: 2,
    title: 'Dump on DEX A',
    description: 'Attacker sells massive amount of ETH on DEX A, crashing the price on that exchange. Price drops from $3000 to $2000.',
    balances: { attacker: 2000, pool: 0, dexA: 13000, dexB: 5000 },
    highlight: 'dexA'
  },
  {
    id: 3,
    title: 'Buy Cheap on DEX A',
    description: 'Attacker buys ETH back on DEX A at the crashed price ($2000 instead of $3000). Gets more ETH for the same USDC.',
    balances: { attacker: 12000, pool: 0, dexA: 5000, dexB: 5000 },
    highlight: 'dexA'
  },
  {
    id: 4,
    title: 'Sell on DEX B',
    description: 'Attacker sells the extra ETH on DEX B at the normal price ($3000). DEX B hasn\'t been manipulated, so full price is available.',
    balances: { attacker: 10500, pool: 0, dexA: 5000, dexB: 6500 },
    highlight: 'dexB'
  },
  {
    id: 5,
    title: 'Repay Flash Loan',
    description: 'Attacker repays 10,000 ETH + small fee (0.09%) to the flash loan pool. The loan is settled.',
    balances: { attacker: 490, pool: 10010, dexA: 5000, dexB: 6500 },
    highlight: 'pool'
  },
  {
    id: 6,
    title: 'Profit',
    description: 'Transaction complete. Attacker keeps ~490 ETH profit. If ANY step failed, the entire transaction would have reverted — zero risk for the attacker.',
    balances: { attacker: 490, pool: 10010, dexA: 5000, dexB: 6500 },
    highlight: 'attacker'
  }
];

export const FLASH_LOAN_VULNERABLE_CODE = `// VULNERABLE — uses spot price from single DEX
contract VulnerableVault {
    IDex public priceFeed;

    function getPrice() public view returns (uint) {
        // BAD: reads current spot price
        // Can be manipulated with a flash loan
        return priceFeed.getSpotPrice(ETH, USDC);
    }

    function liquidate(address user) external {
        uint price = getPrice(); // Manipulated!
        if (getCollateralRatio(user, price) < 120) {
            // Liquidates based on fake price
            _seizeCollateral(user);
        }
    }
}`;

export const FLASH_LOAN_FIXED_CODE = `// FIXED — uses time-weighted average price (TWAP)
contract SecureVault {
    IOracle public oracle; // Chainlink or TWAP oracle

    function getPrice() public view returns (uint) {
        // GOOD: uses average price over 30 minutes
        // Flash loans can't manipulate historical data
        return oracle.getTWAP(ETH, USDC, 30 minutes);
    }

    function liquidate(address user) external {
        uint price = getPrice(); // Manipulation-resistant
        require(!isFlashLoan(), "No flash loan liquidations");
        if (getCollateralRatio(user, price) < 120) {
            _seizeCollateral(user);
        }
    }
}`;

export const FLASH_LOAN_MITIGATIONS = [
  { title: 'Use TWAP Oracles', description: 'Time-Weighted Average Prices average over 30+ minutes. Flash loans only last one block (~12 seconds), so they can\'t manipulate TWAP.' },
  { title: 'Use Chainlink Price Feeds', description: 'Decentralized oracle networks aggregate data from many sources. No single transaction can move the reported price.' },
  { title: 'Flash Loan Detection', description: 'Check if the caller received tokens in the same block. If so, reject the transaction.' },
  { title: 'Minimum Delay', description: 'Require that deposited funds sit for at least 1 block before they can be used. Flash loans must repay in the same block.' }
];
```

---

## FEATURE 4: Layer 2 — Data

### File: `src/data/layer2Data.js`

```js
export const L2_CHAINS = [
  {
    name: 'Ethereum L1',
    type: 'Base Layer',
    rollupType: null,
    tps: '~15',
    finality: '~12 minutes',
    gasTransfer: '$2 - $5',
    gasSwap: '$5 - $20',
    evmCompatible: true,
    description: 'The main chain. Maximum security, maximum decentralization, but limited throughput.',
    color: '#627EEA'
  },
  {
    name: 'Optimism',
    type: 'Optimistic Rollup',
    rollupType: 'optimistic',
    tps: '~2,000',
    finality: '7 days (challenge period)',
    gasTransfer: '$0.01 - $0.05',
    gasSwap: '$0.05 - $0.20',
    evmCompatible: true,
    description: 'Transactions assumed valid. 7-day window for fraud proofs. EVM-equivalent — deploy existing Solidity code with zero changes.',
    color: '#FF0420'
  },
  {
    name: 'Arbitrum',
    type: 'Optimistic Rollup',
    rollupType: 'optimistic',
    tps: '~4,000',
    finality: '7 days (challenge period)',
    gasTransfer: '$0.01 - $0.05',
    gasSwap: '$0.05 - $0.15',
    evmCompatible: true,
    description: 'Largest L2 by TVL. Interactive fraud proofs. Nitro stack for better compression and lower fees.',
    color: '#28A0F0'
  },
  {
    name: 'Base',
    type: 'Optimistic Rollup',
    rollupType: 'optimistic',
    tps: '~2,000',
    finality: '7 days (challenge period)',
    gasTransfer: '$0.001 - $0.01',
    gasSwap: '$0.01 - $0.05',
    evmCompatible: true,
    description: 'Built by Coinbase on the OP Stack. Lowest fees among optimistic rollups. Fast-growing ecosystem.',
    color: '#0052FF'
  },
  {
    name: 'zkSync Era',
    type: 'ZK Rollup',
    rollupType: 'zk',
    tps: '~2,000',
    finality: '~1 hour',
    gasTransfer: '$0.01 - $0.10',
    gasSwap: '$0.05 - $0.25',
    evmCompatible: true,
    description: 'Uses zero-knowledge proofs for instant validity. No challenge period needed. Native account abstraction.',
    color: '#4E529A'
  },
  {
    name: 'Polygon zkEVM',
    type: 'ZK Rollup',
    rollupType: 'zk',
    tps: '~2,000',
    finality: '~30 minutes',
    gasTransfer: '$0.01 - $0.05',
    gasSwap: '$0.02 - $0.10',
    evmCompatible: true,
    description: 'ZK-powered EVM equivalence. Aims to be a drop-in replacement for Ethereum with ZK validity proofs.',
    color: '#7B3FE4'
  }
];

export const ROLLUP_EXPLAINER = {
  optimistic: {
    title: 'Optimistic Rollups',
    subtitle: 'Assume valid, challenge if wrong',
    steps: [
      { label: 'Collect', description: 'User transactions are collected by the L2 sequencer.' },
      { label: 'Execute', description: 'Sequencer executes transactions and computes new state.' },
      { label: 'Batch', description: 'Transactions are compressed and batched together.' },
      { label: 'Post to L1', description: 'Batch is posted to Ethereum as calldata.' },
      { label: 'Challenge Window', description: '7-day window opens. Anyone can submit a fraud proof if the batch is invalid.' },
      { label: 'Finalized', description: 'If no challenge, the batch is finalized and accepted as truth.' }
    ],
    pros: ['Full EVM compatibility', 'Lower gas than ZK', 'Mature ecosystem'],
    cons: ['7-day withdrawal delay', 'Relies on at least 1 honest verifier', 'Challenge period overhead']
  },
  zk: {
    title: 'ZK Rollups',
    subtitle: 'Prove valid with math',
    steps: [
      { label: 'Collect', description: 'User transactions are collected by the L2 sequencer.' },
      { label: 'Execute', description: 'Sequencer executes transactions and computes new state.' },
      { label: 'Generate Proof', description: 'A cryptographic validity proof (zk-SNARK or zk-STARK) is generated for the batch.' },
      { label: 'Post to L1', description: 'Batch + proof are posted to Ethereum.' },
      { label: 'Verify Proof', description: 'L1 smart contract verifies the proof mathematically. Takes ~200K gas.' },
      { label: 'Finalized', description: 'Immediately finalized — no waiting period needed because the math proves correctness.' }
    ],
    pros: ['Fast finality (no 7-day wait)', 'Math-based security (no trust assumptions)', 'Better long-term scaling'],
    cons: ['Complex proof generation', 'Higher computational cost', 'Some EVM compatibility gaps']
  }
};

export const BRIDGE_STEPS = [
  { label: 'Lock on L1', description: 'Your tokens are locked in a bridge contract on Ethereum L1.' },
  { label: 'Verify', description: 'The L2 bridge verifies the lock transaction on L1.' },
  { label: 'Mint on L2', description: 'Equivalent tokens are minted on the L2 chain.' },
  { label: 'Use on L2', description: 'You can now use your tokens on L2 with lower gas fees.' }
];
```

---

## FEATURE 5: Glossary — Data

### File: `src/data/glossary.js`

```js
/**
 * Blockchain Glossary — 100+ terms
 * Each term: { term, definition, category, example? }
 *
 * Categories: 'Core', 'Ethereum', 'DeFi', 'Security', 'Layer 2', 'Governance', 'Development'
 */
export const GLOSSARY_TERMS = [
  // ─── Core Blockchain ───
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

  // ─── Ethereum ───
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

  // ─── DeFi ───
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

  // ─── Security ───
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

  // ─── Layer 2 ───
  { term: 'Rollup', definition: 'A Layer 2 scaling solution that executes transactions off-chain and posts compressed data to L1 for security.', category: 'Layer 2' },
  { term: 'Optimistic Rollup', definition: 'A rollup that assumes transactions are valid. Anyone can submit a fraud proof within 7 days to challenge invalid batches.', category: 'Layer 2', example: 'Optimism, Arbitrum, Base' },
  { term: 'ZK Rollup', definition: 'A rollup that generates a cryptographic validity proof for every batch. No challenge period needed — math proves correctness.', category: 'Layer 2', example: 'zkSync, Polygon zkEVM, StarkNet' },
  { term: 'Bridge', definition: 'A protocol that transfers assets between two blockchains. Typically: lock on chain A, mint on chain B.', category: 'Layer 2' },
  { term: 'Calldata', definition: 'Read-only data attached to an Ethereum transaction. Rollups post compressed transaction batches as calldata to save gas.', category: 'Layer 2' },
  { term: 'Data Availability', definition: 'The guarantee that transaction data is published and accessible to anyone who needs to verify the chain.', category: 'Layer 2' },
  { term: 'Fraud Proof', definition: 'A mechanism in optimistic rollups where anyone can prove that a batch contains an invalid transaction, causing it to be reverted.', category: 'Layer 2' },
  { term: 'Sequencer', definition: 'The entity that collects L2 transactions, orders them, and posts batches to L1. Currently centralized in most rollups.', category: 'Layer 2' },
  { term: 'Validity Proof', definition: 'A cryptographic proof (zk-SNARK or zk-STARK) that mathematically proves all transactions in a batch are valid.', category: 'Layer 2' },

  // ─── Governance ───
  { term: 'DAO (Decentralized Autonomous Organization)', definition: 'An organization governed by smart contracts and token holder votes instead of a traditional management hierarchy.', category: 'Governance', example: 'Aave DAO, Uniswap Governance, MakerDAO' },
  { term: 'Delegation', definition: 'Assigning your voting power to another address. Your tokens stay in your wallet, but the delegate votes on your behalf.', category: 'Governance' },
  { term: 'Governance Token', definition: 'A token that grants voting rights in a protocol\'s governance. More tokens = more voting power (in simple majority systems).', category: 'Governance', example: 'UNI (Uniswap), AAVE, COMP (Compound)' },
  { term: 'Multisig', definition: 'A wallet that requires multiple signatures (e.g. 3 of 5 key holders) to authorize a transaction. Prevents single points of failure.', category: 'Governance', example: 'Gnosis Safe is the most popular multisig.' },
  { term: 'Proposal', definition: 'A governance action submitted for voting. Can include code changes, treasury spending, or parameter updates.', category: 'Governance' },
  { term: 'Quadratic Voting', definition: 'A voting system where voting power = square root of tokens. Reduces the influence of whales and amplifies smaller holders.', category: 'Governance' },
  { term: 'Quorum', definition: 'The minimum number of votes required for a governance proposal to be valid. Prevents low-turnout decisions.', category: 'Governance' },
  { term: 'Timelock', definition: 'A mandatory delay between a proposal passing and its execution. Gives users time to exit if they disagree.', category: 'Governance', example: 'Most protocols use a 24-48 hour timelock.' },

  // ─── Development ───
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
```

---

## FEATURE 6: Quizzes & Progress — Data + Hooks

### File: `src/data/quizzes.js`

```js
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
```

### File: `src/hooks/useQuiz.js`

```js
import { useState, useCallback } from 'react';

/**
 * Quiz Hook — manages quiz state for a single section
 *
 * @param {Array} questions - array from QUIZZES[sectionId]
 * @returns {Object} quiz state and actions
 *
 * UI team consumes:
 * - currentQuestion: the current question object
 * - currentIndex: which question number (0-based)
 * - totalQuestions: how many questions total
 * - selectedAnswer: which option index the user picked (null if not answered)
 * - isCorrect: boolean or null (null if not answered yet)
 * - isComplete: boolean — all questions answered
 * - score: { correct, total }
 * - selectAnswer(index): user picks an option
 * - nextQuestion(): move to next question
 * - resetQuiz(): start over
 */
export function useQuiz(questions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex] || null;

  const isCorrect = selectedAnswer !== null
    ? selectedAnswer === currentQuestion?.correctIndex
    : null;

  const selectAnswer = useCallback((index) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(index);
    if (index === currentQuestion?.correctIndex) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
  }, [selectedAnswer, currentQuestion]);

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, questions.length]);

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore({ correct: 0, total: 0 });
    setIsComplete(false);
  }, []);

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    selectedAnswer,
    isCorrect,
    isComplete,
    score,
    selectAnswer,
    nextQuestion,
    resetQuiz
  };
}
```

### File: `src/hooks/useProgress.js`

```js
import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'blockchain-unpacked-progress';

const SECTIONS = ['consensus', 'solidity', 'deployment', 'security', 'tokens', 'defi', 'layer2'];

const BADGES = [
  { id: 'consensus_master', section: 'consensus', label: 'Consensus Master', description: 'Passed the Consensus Mechanisms quiz', icon: '⛏' },
  { id: 'solidity_scholar', section: 'solidity', label: 'Solidity Scholar', description: 'Passed the Solidity Fundamentals quiz', icon: '📝' },
  { id: 'deploy_pro', section: 'deployment', label: 'Deployment Pro', description: 'Passed the Deployment Workflow quiz', icon: '🚀' },
  { id: 'security_analyst', section: 'security', label: 'Security Analyst', description: 'Passed the Security Lab quiz', icon: '🛡' },
  { id: 'token_expert', section: 'tokens', label: 'Token Expert', description: 'Passed the Token Standards quiz', icon: '🪙' },
  { id: 'defi_savant', section: 'defi', label: 'DeFi Savant', description: 'Passed the DeFi Concepts quiz', icon: '📊' },
  { id: 'l2_explorer', section: 'layer2', label: 'L2 Explorer', description: 'Passed the Layer 2 quiz', icon: '🔗' },
  { id: 'blockchain_graduate', section: null, label: 'Blockchain Graduate', description: 'Passed ALL section quizzes', icon: '🎓' }
];

/**
 * Progress Tracking Hook — persists to localStorage
 *
 * Returns:
 * - completedSections: Set of section IDs passed
 * - totalSections: number
 * - progressPercent: 0–100
 * - badges: array of { ...badge, unlocked: boolean }
 * - markComplete(sectionId): mark a section as passed
 * - isComplete(sectionId): check if a section is completed
 * - resetProgress(): clear all progress
 */
export function useProgress() {
  const [completedSections, setCompletedSections] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Persist to localStorage whenever completedSections changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSections]));
  }, [completedSections]);

  const totalSections = SECTIONS.length;
  const progressPercent = Math.round((completedSections.size / totalSections) * 100);

  const badges = BADGES.map(badge => ({
    ...badge,
    unlocked: badge.section
      ? completedSections.has(badge.section)
      : completedSections.size === totalSections // "graduate" badge: all complete
  }));

  const markComplete = useCallback((sectionId) => {
    setCompletedSections(prev => {
      const next = new Set(prev);
      next.add(sectionId);
      return next;
    });
  }, []);

  const isComplete = useCallback((sectionId) => {
    return completedSections.has(sectionId);
  }, [completedSections]);

  const resetProgress = useCallback(() => {
    setCompletedSections(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    completedSections,
    totalSections,
    progressPercent,
    badges,
    markComplete,
    isComplete,
    resetProgress
  };
}
```

---

## Integration Contract — How UI Team Connects

The UI team (Anti-Gravity) will import from these files like this:

```js
// In any component:
import { ERC_STANDARDS, TOKEN_COMPARISON, DECISION_TREE } from '../data/tokenStandards';
import { DEFI_GLOSSARY, IL_PRESETS } from '../data/defiConcepts';
import { useAMM, calculateImpermanentLoss } from '../hooks/useAMM';
import { useLending } from '../hooks/useLending';
import { FLASH_LOAN_STEPS, FLASH_LOAN_VULNERABLE_CODE, FLASH_LOAN_FIXED_CODE, FLASH_LOAN_MITIGATIONS } from '../data/flashLoan';
import { L2_CHAINS, ROLLUP_EXPLAINER, BRIDGE_STEPS } from '../data/layer2Data';
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, filterGlossary } from '../data/glossary';
import { QUIZZES } from '../data/quizzes';
import { useQuiz } from '../hooks/useQuiz';
import { useProgress } from '../hooks/useProgress';
```

### Hook return shapes (TypeScript-like for clarity):

```
useAMM() → { poolA: number, poolB: number, k: number, history: [], getPrice(), getSlippageForAmount(), swapAtoB(), swapBtoA(), reset() }
useLending() → { collateralAmount, collateralPrice, borrowedAmount, collateralValue, collateralRatio, healthFactor, isLiquidatable, isLiquidated, maxBorrow, logs, deposit(), borrow(), setPrice(), liquidate(), reset() }
useQuiz(questions) → { currentQuestion, currentIndex, totalQuestions, selectedAnswer, isCorrect, isComplete, score, selectAnswer(), nextQuestion(), resetQuiz() }
useProgress() → { completedSections, totalSections, progressPercent, badges, markComplete(), isComplete(), resetProgress() }
calculateImpermanentLoss(priceMultiplier) → { ilPercent, lpValue, holdValue, difference }
filterGlossary(terms, { category, search }) → filteredTerms[]
```

---

## File Checklist for Cloud Team

| File | Status |
|------|--------|
| `src/data/tokenStandards.js` | TODO |
| `src/data/defiConcepts.js` | TODO |
| `src/data/flashLoan.js` | TODO |
| `src/data/layer2Data.js` | TODO |
| `src/data/glossary.js` | TODO |
| `src/data/quizzes.js` | TODO |
| `src/hooks/useAMM.js` | TODO |
| `src/hooks/useLending.js` | TODO |
| `src/hooks/useQuiz.js` | TODO |
| `src/hooks/useProgress.js` | TODO |

**Total: 10 files. Zero dependencies added. Zero API calls.**
