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
