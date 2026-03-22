# Blockchain Unpacked: From Consensus to Contract

An interactive educational platform that visualizes core blockchain concepts through immersive 3D scenes, hands-on simulations, and guided learning modules. Built with React, Three.js, and Framer Motion for live demonstrations and self-paced study.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/deploy-vercel-black.svg)](https://blockchain-unpacked.vercel.app/)

## Key Features

### 1. Consensus Mechanisms (`/consensus`)
- **Mining Simulator (PoW)** — Visualize hash discovery with adjustable difficulty. Watch the nonce iterate in real-time.
- **Staking Simulator (PoS)** — Simulate validator selection based on stake weight.
- 3D Scene: Validator Ring Protocol

### 2. Solidity Fundamentals (`/solidity`)
- **Interactive Code Viewer** — Click on Solidity contract lines for detailed explanations (State Variables, Mappings, Modifiers).
- **Gas Optimization** — Compare inefficient vs optimized code patterns with a visual fuel gauge.

### 3. Token Standards (`/tokens`)
- Deep dive into ERC-20, ERC-721, and ERC-1155 token standards.
- Interactive comparisons and use-case breakdowns.
- 3D Scene: Token Forge

### 4. DeFi Concepts (`/defi`)
- Explore decentralized finance primitives: AMMs, liquidity pools, yield farming, and flash loans.
- 3D Scene: Liquidity Flow Network

### 5. Deployment Workflow (`/deployment`)
- **Transaction Anatomy** — Interactive breakdown of raw transaction data.
- **Function Selector Playground** — Hash function signatures to see their 4-byte selectors.
- **Argument Decoder** — See how data is ABI-encoded.
- **Lifecycle Visualization** — Flowchart from contract drafting to destruction.
- 3D Scene: Launchpad Upload

### 6. Security Lab (`/security`)
- **Reentrancy Attack Demo** — Visual "Bank" metaphor with recursive `fallback()` call tracing.
- **Integer Overflow** — Visualize 8-bit integer wrap-around.
- **Weak Randomness** — Simulate miner-predictable "random" numbers.
- **Access Control** — Compare secure vs insecure withdrawal patterns.
- 3D Scene: Cyber Vault Scanner

### 7. Layer 2 Scaling (`/layer2`)
- Explore rollups (Optimistic & ZK), sidechains, and state channels.
- Comparative analysis of L2 solutions with TPS benchmarks.

### 8. Glossary (`/glossary`)
- Searchable blockchain terminology reference.

### 9. Share (`/share`)
- Generate a QR code for the application URL.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 (Vite) |
| 3D Rendering | Three.js / React Three Fiber / Drei |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Font | Space Grotesk |
| Icons | Lucide React |
| Blockchain Utils | Viem |
| Routing | React Router v7 |
| QR Codes | react-qr-code |

## Design System

- **Theme**: Dark mode with Aether Protocol palette
- **Background**: `#11131d`
- **Accent Colors**: Amber `#f59e0b`, Rose `#fb7185`, Emerald `#4ade80`, Sky `#38bdf8`, Purple `#a78bfa`
- **Typography**: Space Grotesk (all text)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

```bash
git clone https://github.com/captr1g/Blockchain_Unpacked.git
cd Blockchain_Unpacked
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

Pages are lazy-loaded for optimized bundle splitting.

## License

This project is open source and available under the [MIT License](LICENSE).

---

*© 2026 Blockchain Unpacked — Built for Education.*
