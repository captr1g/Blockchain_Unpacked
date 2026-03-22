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
