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
