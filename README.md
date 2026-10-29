# Greenchain - Carbon Ledger

> Premium Web3 carbon credit tracking and management platform on MST Blockchain

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-10b981?logo=vercel)](https://frontend-five-puce-6m4wxuqryw.vercel.app)

End-to-end carbon credit dApp for **MST Testnet** (chain ID `91562037`, currency `tMSTC`).
Landowners register tree-planting projects, verifiers check the tree data, and verified credits can be claimed,
transferred or retired. Sign in with **Google (email/social login)**, **BridgeKey Wallet**, or any
**WalletConnect / injected wallet** through Reown AppKit + wagmi.

## Features

- Premium Dark UI -- Forest-green glassmorphism design with micro-animations
- BridgeKey Wallet -- Native integration with MST Blockchain's BridgeKey wallet
- Live Dashboard -- Real-time carbon credit portfolio analytics
- Marketplace -- Browse, filter and trade verified carbon credit projects
- Analytics -- Environmental impact charts and blockchain activity
- Wallet View -- Portfolio overview, transaction history, holdings
- Admin and Verifier Panels -- Role-based access with Merkle proof verification
- Demo Mode -- Explore the platform without connecting a wallet

## Project Structure

```
Greenchain-/
|-- contracts/   Solidity + Hardhat: CarbonCreditRegistry (ERC-1155), tests, deploy scripts
|-- backend/     Express API: validates tree datasets, builds Merkle proofs, verifies wallet signatures
|-- frontend/    React + Vite + wagmi + Reown AppKit - Premium Web3 UI
```

## MST Testnet Details

| Setting   | Value                                |
| --------- | ------------------------------------ |
| Chain ID  | 91562037                             |
| RPC       | https://testnetrpc.mstblockchain.com |
| Explorer  | https://testnet.mstscan.com          |
| Faucet    | https://faucet.mstblockchain.com     |
| Currency  | tMSTC                                |


## Live Demo

> **Production URL:** https://frontend-five-puce-6m4wxuqryw.vercel.app

Deployed on Vercel. No setup needed to explore the platform - Demo Mode is available without a wallet.

## Quick Start

Requirements: Node.js 20+.

### 1. Contracts

```bash
cd contracts
npm install
npx hardhat test
cp .env.example .env
npm run check:network
npm run deploy:mst
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npm test
npm start
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app works without a Reown Project ID using BridgeKey Wallet or any injected wallet.
Get a free project ID at https://cloud.reown.com to enable Google/email social login.

## Wallet Integration

### BridgeKey Wallet (Recommended for MST Blockchain)
The app auto-detects the `window.bridgekey` provider. Install BridgeKey from your wallet provider and connect directly.

### Other Options
- MetaMask or any browser injected wallet
- WalletConnect (via Reown AppKit with project ID)
- Google / Email (via Reown AppKit with project ID + Features enabled)
- Demo Mode -- Preview as Landowner or Verifier without a real wallet

## How It Works

1. **Sign in.** Connect BridgeKey, any injected wallet, or explore in Demo Mode.
2. **Submit project.** Paste a CSV of trees. The backend validates it, builds a Merkle tree, and records the root on-chain.
3. **Verify.** A verifier checks the dataset against the on-chain Merkle root with on-chain proof verification.
4. **Claim.** The project owner mints the carbon credits once.
5. **Trade.** Browse and trade verified credits in the Marketplace.
6. **Retire.** Burning credits records offset claims immutably on-chain.

## Security Design

**Smart Contract** -- OpenZeppelin 5.0.2 with AccessControlDefaultAdminRules, Pausable, ReentrancyGuard, MerkleProof.

**Backend** -- Strict zod schemas, 1 MB body limit, rate limits, Helmet, CORS allowlist. Signature verification.

**Frontend** -- All inputs validated, wrong-network detection, every write pinned to chainId, readable decoded revert reasons.

---

Built with care for sustainable blockchain innovation on MST Blockchain.
