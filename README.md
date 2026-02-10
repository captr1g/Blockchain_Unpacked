# Blockchain Unpacked: From Consensus to Contract

An interactive educational React application designed to visualize and explain core blockchain concepts, from consensus mechanisms to smart contract security. Built for live demonstrations and self-paced learning.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Features

### 1. **Consensus Mechanisms** (`/consensus`)
- **Mining Simulator (PoW)**: Visualize the difficulty of finding a hash with a specific prefix. Adjust difficulty and watch the nonce change in real-time.
- **Staking Simulator (PoS)**: Simulate validator selection based on stake weight.

### 2. **Solidity Fundamentals** (`/solidity`)
- **Interactive Code Viewer**: Click on lines of a Solidity contract to see detailed explanations of syntax and concepts (State Variables, Mappings, Modifiers).

### 3. **Deployment Workflow** (`/deployment`)
- **Step-by-Step Simulation**: Visual guide through the process of writing, compiling, and deploying a contract to a testnet.
- **Chain ID Reference**: Educational table of common network IDs.

### 4. **Security Lab** (`/security`)
- **Reentrancy Attack Demo**: Interactive "hack" simulation showing how a recursive call can drain a contract's funds.
- **Access Control Comparisons**: Side-by-side comparison of vulnerable vs. secure code patterns.

## 🛠 Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Router**: React Router DOM

## 🏁 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/blockchain-unpacked.git
   cd blockchain-unpacked
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

- **Mining (PoW)**: Go to the Consensus tab. Drag the "Difficulty" slider to 3 or 4. Click "Start Mining" and observe how it takes longer to find a valid hash.
- **Reentrancy**: Go to the Security tab. Click "Launch Attack". Watch the logs as the attacker contract repeatedly calls `withdraw` before the balance is updated.

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
