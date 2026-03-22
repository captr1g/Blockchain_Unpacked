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
