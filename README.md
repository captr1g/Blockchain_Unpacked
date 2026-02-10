# Blockchain Unpacked: From Consensus to Contract

An interactive educational React application designed to visualize and explain core blockchain concepts, from consensus mechanisms to smart contract security. Built for live demonstrations and self-paced learning.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/deploy-vercel-black.svg)](https://blockchain-unpacked.vercel.app/)

## 🚀 Key Features

### 1. **Consensus Mechanisms** (`/consensus`)
- **Mining Simulator (PoW)**: Visualize the difficulty of finding a hash with a specific prefix. Adjust difficulty and watch the nonce change in real-time.
- **Staking Simulator (PoS)**: Simulate validator selection based on stake weight.

### 2. **Solidity Fundamentals** (`/solidity`)
- **Interactive Code Viewer**: Click on lines of a Solidity contract to see detailed explanations of syntax and concepts (State Variables, Mappings, Modifiers).
- **Gas Optimization**: Compare "Bad" vs "Good" code patterns with a visual fuel gauge.

### 3. **Deployment Workflow** (`/deployment`)
- **Transaction Anatomy**: Interactive breakdown of raw transaction data.
  - **Function Selector Playground**: Hash function signatures to see their 4-byte selectors.
  - **Argument Decoder**: See how data is ABI-encoded.
- **Lifecycle Visualization**: Flowchart of a smart contract from drafting to destruction.

### 4. **Security Lab** (`/security`)
- **Reentrancy Attack Demo**: 
  - Visual "Bank" metaphor showing the separation between the **Internal Ledger** and **Actual Contracts Balance**.
  - Logs enabling you to trace the recursive `fallback()` calls.
- **Integer Overflow**: Visualize 8-bit integer wrap-around.
- **Weak Randomness**: Simulate how miners can predict "random" numbers based on timestamps.
- **Access Control**: Compare secure vs insecure withdrawal patterns.

### 5. **Utilities**
- **Wallet Connection**: Connect your MetaMask/Web3 wallet to see your address.
- **Share**: Generate a QR code for the application URL to share with others.

## 🛠 Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (Custom Theme: `#B85042` Red, `#E7E8D1` Beige)
- **Animations**: Framer Motion
- **Blockchain**: Viem (hashing, encoding)
- **Icons**: Lucide React
- **QR Codes**: react-qr-code

## 🏁 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/captr1g/Blockchain_Unpacked.git
   cd Blockchain_Unpacked
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` to view the app.

## 📚 How to Use Demos

- **Mining (PoW)**: Go to the Consensus tab. Drag the "Difficulty" slider to 3 or 4. Click "Start Mining" closely watch the hash generation.
- **Reentrancy**: Go to the Security tab. Deposit funds as a student, then switch to the "Hacker" role to drain the bank. accurate logs show the exploit in action.
- **Gas Gauge**: Go to Solidity tab. Toggle between `uint256` and `uint8` in a loop to see the gas impact.

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

---
*© 2026 Blockchain Unpacked. Built for Education.*
