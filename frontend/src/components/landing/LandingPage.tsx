import React, { useState } from 'react'
import {
  ArrowRight,
  ShieldCheck,
  Trees,
  Cpu,
  Layers,
  Sparkles,
  TrendingUp,
  Globe2,
  ExternalLink,
  CheckCircle,
  FileCode2,
  Lock,
  Compass,
  Coins,
  ChevronRight,
  Leaf,
} from 'lucide-react'
import { PLATFORM_STATS, SAMPLE_MARKETPLACE_PROJECTS, MarketplaceItem } from '../../lib/mockData'
import { formatNumber, formatCurrency, formatTons } from '../../lib/format'
import { MST_CHAIN_ID, MST_EXPLORER, MST_FAUCET, explorerAddress } from '../../config/chain'
import { REGISTRY_ADDRESS, isRegistryConfigured } from '../../lib/registry'

interface LandingPageProps {
  onExploreDashboard: () => void
  onExploreMarketplace: () => void
  onSelectProject: (project: MarketplaceItem) => void
  onConnectWallet: () => void
}

export function LandingPage({
  onExploreDashboard,
  onExploreMarketplace,
  onSelectProject,
  onConnectWallet,
}: LandingPageProps) {
  // Environmental Calculator state
  const [treeInput, setTreeInput] = useState(250)
  const calculatedCo2Kg = treeInput * 25 // ~25kg CO2 per tree per year
  const calculatedAcres = (treeInput / 400).toFixed(2)
  const calculatedCars = (calculatedCo2Kg / 4600).toFixed(2) // avg passenger vehicle emits 4,600 kg CO2/year

  return (
    <div className="landing-page">
      {/* Background Ambient Glow & Mesh */}
      <div className="landing-ambient-bg">
        <div className="ambient-blob green-1" />
        <div className="ambient-blob green-2" />
        <div className="ambient-grid-overlay" />
      </div>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="landing-hero-container">
          <div className="hero-pill-badge">
            <span className="hero-pill-dot" />
            <span>MST Testnet Blockchain • ERC-1155 Carbon Registry</span>
          </div>

          <h1 className="landing-hero-title">
            Track Carbon. Verify Impact. <br />
            <span className="text-gradient-emerald">Build a Greener Future.</span>
          </h1>

          <p className="landing-hero-subtitle">
            A transparent blockchain-powered platform for tracking, trading, and retiring carbon credits.
            Cryptographically anchored with Merkle tree datasets and immutable on-chain verification.
          </p>

          <div className="landing-hero-ctas">
            <button className="btn-hero-primary" onClick={onExploreDashboard}>
              <span>Explore Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="btn-hero-secondary" onClick={onExploreMarketplace}>
              <Trees className="w-5 h-5 text-emerald-400" />
              <span>Explore Marketplace</span>
            </button>
          </div>

          {/* Platform Trust Highlights */}
          <div className="hero-trust-badges">
            <div className="trust-badge-item">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Double-spend Proof via Merkle Trees</span>
            </div>
            <div className="trust-badge-item">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>OpenZeppelin audited ERC-1155</span>
            </div>
            <div className="trust-badge-item">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span>Permanent Retirement on MSTScan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Platform Statistics */}
      <section className="landing-stats-section">
        <div className="landing-stats-grid">
          <div className="landing-stat-card">
            <div className="stat-card-glow" />
            <span className="stat-number">{formatNumber(PLATFORM_STATS.totalCarbonCredits)}</span>
            <span className="stat-unit">kg CO₂e</span>
            <span className="stat-label">Total Carbon Credits Tracked</span>
            <span className="stat-trend positive">↑ 24.8% this month</span>
          </div>

          <div className="landing-stat-card">
            <div className="stat-card-glow" />
            <span className="stat-number">{formatNumber(PLATFORM_STATS.creditsRetired)}</span>
            <span className="stat-unit">kg CO₂e</span>
            <span className="stat-label">Permanently Retired</span>
            <span className="stat-trend positive">100% On-chain Burned</span>
          </div>

          <div className="landing-stat-card">
            <div className="stat-card-glow" />
            <span className="stat-number">{PLATFORM_STATS.verifiedLandHectares}</span>
            <span className="stat-unit">Hectares</span>
            <span className="stat-label">GPS-Audited Reforestation</span>
            <span className="stat-trend positive">18 Verified Projects</span>
          </div>

          <div className="landing-stat-card">
            <div className="stat-card-glow" />
            <span className="stat-number">{formatNumber(PLATFORM_STATS.blockchainTxCount)}</span>
            <span className="stat-unit">Transactions</span>
            <span className="stat-label">Cryptographic Proofs Recorded</span>
            <span className="stat-trend neutral">MST Testnet</span>
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="landing-how-section">
        <div className="section-header-centered">
          <span className="section-eyebrow">DECENTRALIZED ARCHITECTURE</span>
          <h2 className="section-heading">How Carbon Ledger Works</h2>
          <p className="section-subtext">
            Eliminating greenwashing with an end-to-end cryptographic chain of custody from individual saplings to on-chain credit burn.
          </p>
        </div>

        <div className="how-steps-grid">
          <div className="how-step-card">
            <div className="step-number-tag">01</div>
            <div className="step-icon-box">
              <Trees className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="step-title">1. Project & GPS Registration</h3>
            <p className="step-desc">
              Landowners upload GPS-tagged tree datasets (species, coordinates, planting dates). The backend prepares a cryptographic Merkle tree commitment.
            </p>
            <div className="step-subdetail">
              <code>lat,lon,species,plantedOn</code>
            </div>
          </div>

          <div className="how-step-card">
            <div className="step-number-tag">02</div>
            <div className="step-icon-box">
              <FileCode2 className="w-6 h-6 text-lime-400" />
            </div>
            <h3 className="step-title">2. Merkle Proof Generation</h3>
            <p className="step-desc">
              Submissions require a wallet signature over the Merkle root and evidence hash. Datasets are anchored on-chain with zero-knowledge verification ready.
            </p>
            <div className="step-subdetail">
              <span>Keccak256 Root & Evidence Commitments</span>
            </div>
          </div>

          <div className="how-step-card">
            <div className="step-number-tag">03</div>
            <div className="step-icon-box">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="step-title">3. Verifier Node Audit</h3>
            <p className="step-desc">
              Independent authorized verifiers run multi-point cryptographic checks and randomly audit 5 trees directly on-chain using <code>verifyTreeRecord</code>.
            </p>
            <div className="step-subdetail">
              <span>Conflict-of-interest protected</span>
            </div>
          </div>

          <div className="how-step-card">
            <div className="step-number-tag">04</div>
            <div className="step-icon-box">
              <Sparkles className="w-6 h-6 text-lime-400" />
            </div>
            <h3 className="step-title">4. Mint, Trade & Retire</h3>
            <p className="step-desc">
              Verified projects mint ERC-1155 tokens (1 token = 1 kg CO₂e). Businesses and individuals can hold, trade, or permanently burn them for transparent offset certificates.
            </p>
            <div className="step-subdetail">
              <span>Immutable Burn Event Logged</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Transparency Section */}
      <section className="landing-blockchain-section">
        <div className="blockchain-inner-card">
          <div className="blockchain-info">
            <span className="section-eyebrow">ON-CHAIN VERIFIABILITY</span>
            <h2 className="blockchain-title">Built for Zero-Trust Environmental Integrity</h2>
            <p className="blockchain-desc">
              Traditional carbon markets suffer from duplicate claims, opaque spreadsheets, and phantom forests.
              Carbon Ledger enforces all project validity rules directly inside the smart contract:
            </p>

            <ul className="blockchain-features-list">
              <li>
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Validity Enforcement in Transfers:</strong> Credits from expired, revoked, or rejected projects are automatically frozen on-chain.
                </span>
              </li>
              <li>
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Decentralized Anti-Tamper Storage:</strong> Tree records are linked to the on-chain Merkle root, making retroactive modification mathematically impossible.
                </span>
              </li>
              <li>
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Audited Smart Contract:</strong> Powered by OpenZeppelin 5.0 with strict two-step administrative roles and reentrancy guards.
                </span>
              </li>
            </ul>

            <div className="blockchain-meta-links">
              {isRegistryConfigured ? (
                <a
                  href={explorerAddress(REGISTRY_ADDRESS)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-glow"
                >
                  <span>View Contract on MSTScan</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              ) : (
                <a
                  href={MST_EXPLORER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-glow"
                >
                  <span>MSTScan Blockchain Explorer</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
              <a
                href={MST_FAUCET}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-subtle"
              >
                <span>Request Free Testnet tMSTC</span>
                <Coins className="w-4 h-4 ml-1 text-emerald-400" />
              </a>
            </div>
          </div>

          <div className="blockchain-visual-preview">
            <div className="code-box-header">
              <span className="code-dot red" />
              <span className="code-dot yellow" />
              <span className="code-dot green" />
              <span className="code-box-title">CarbonCreditRegistry.sol [Verified]</span>
            </div>
            <pre className="code-box-body">
              <code>{`// Cryptographic verification & retirement
function retireCredits(
  uint256 id,
  uint256 amount,
  string calldata reason
) external nonReentrant {
  Project storage p = _projects[id];
  if (!isCreditValid(id)) revert InvalidCredit(id);
  
  _burn(msg.sender, id, amount);
  _retired[id][msg.sender] += amount;
  
  emit CreditsRetired(id, msg.sender, amount, reason);
}`}</code>
            </pre>
            <div className="contract-status-pill">
              <span className="pulse-dot green" />
              <span>MST Testnet: Chain 91562037 • Paris EVM Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Carbon Credit Marketplace Preview */}
      <section className="landing-marketplace-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">CURATED CREDITS</span>
            <h2 className="section-heading mb-0">High-Integrity Carbon Marketplace</h2>
            <p className="section-subtext">Browse GPS-verified projects with transparent tree counts and methodologies.</p>
          </div>
          <button className="btn-view-all" onClick={onExploreMarketplace}>
            <span>View All Marketplace Credits</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="marketplace-preview-grid">
          {SAMPLE_MARKETPLACE_PROJECTS.slice(0, 3).map((item) => (
            <div key={item.id} className="preview-credit-card">
              <div className="preview-card-image" style={{ backgroundImage: `url(${item.image})` }}>
                <div className="preview-card-badges">
                  <span className="badge-category">{item.category}</span>
                  <span className="badge-status-verified">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="preview-card-content">
                <h3 className="preview-card-title">{item.name}</h3>
                <p className="preview-card-location">{item.location}</p>

                <div className="preview-card-stats">
                  <div>
                    <span className="stat-tiny-label">Available</span>
                    <span className="stat-tiny-val">{formatNumber(item.availableCredits)} kg CO₂e</span>
                  </div>
                  <div className="text-right">
                    <span className="stat-tiny-label">Price per credit</span>
                    <span className="stat-tiny-val text-emerald-400">{formatCurrency(item.pricePerCredit)}</span>
                  </div>
                </div>

                <button
                  className="btn-card-action"
                  onClick={() => onSelectProject(item)}
                >
                  <span>View Project Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Environmental Impact & Interactive Calculator Section */}
      <section className="landing-impact-section">
        <div className="impact-calculator-container">
          <div className="impact-calc-info">
            <span className="section-eyebrow">ENVIRONMENTAL IMPACT CALCULATOR</span>
            <h2 className="section-heading">Calculate Your Real-World CO₂ Sequestration</h2>
            <p className="section-subtext">
              Test how planting native trees translates to cryptographic carbon credits, restored forest canopy, and vehicle emissions neutralized.
            </p>

            <div className="calc-slider-box">
              <div className="calc-slider-header">
                <label htmlFor="tree-slider" className="calc-slider-label">Simulate Tree Count:</label>
                <span className="calc-slider-value">{treeInput.toLocaleString()} Trees</span>
              </div>
              <input
                id="tree-slider"
                type="range"
                min="10"
                max="5000"
                step="10"
                value={treeInput}
                onChange={(e) => setTreeInput(Number(e.target.value))}
                className="carbon-range-slider"
              />
              <div className="calc-slider-ticks">
                <span>10 Trees</span>
                <span>1,000</span>
                <span>2,500</span>
                <span>5,000 Trees</span>
              </div>
            </div>
          </div>

          <div className="impact-calc-results">
            <div className="calc-result-card featured">
              <span className="calc-result-label">Annual CO₂ Absorption</span>
              <div className="calc-result-number text-gradient-emerald">
                {formatNumber(calculatedCo2Kg)} <span className="text-xl text-slate-300">kg CO₂e</span>
              </div>
              <span className="calc-result-sub">Equal to {formatTons(calculatedCo2Kg)}</span>
            </div>

            <div className="calc-result-row">
              <div className="calc-result-card">
                <span className="calc-result-label">Vehicles Offset</span>
                <span className="calc-result-number">{calculatedCars}</span>
                <span className="calc-result-sub">Passenger cars per year</span>
              </div>

              <div className="calc-result-card">
                <span className="calc-result-label">Canopy Restored</span>
                <span className="calc-result-number">{calculatedAcres}</span>
                <span className="calc-result-sub">Acres of biodiverse forest</span>
              </div>
            </div>

            <button className="btn-calc-cta" onClick={onExploreMarketplace}>
              <span>Offset This Impact Now</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer CTA & Links */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="footer-top-row">
            <div className="footer-brand-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="brand-logo-hex">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-xl font-bold font-outfit text-white">
                  Carbon<span className="text-emerald-400">Ledger</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm mb-4">
                The premier Web3 carbon registry and marketplace on MST Testnet. Verified tree data, cryptographic Merkle proofs, and permanent retirement.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <span className="pulse-dot green" />
                <span>MST Testnet Chain ID: {MST_CHAIN_ID}</span>
              </div>
            </div>

            <div className="footer-links-grid">
              <div className="footer-nav-col">
                <span className="footer-col-title">PLATFORM</span>
                <button onClick={onExploreDashboard} className="footer-link">Live Dashboard</button>
                <button onClick={onExploreMarketplace} className="footer-link">Carbon Marketplace</button>
                <button onClick={onExploreDashboard} className="footer-link">Project Registry</button>
                <button onClick={onConnectWallet} className="footer-link">Connect Wallet</button>
              </div>

              <div className="footer-nav-col">
                <span className="footer-col-title">DEVELOPERS</span>
                <a href={MST_EXPLORER} target="_blank" rel="noopener noreferrer" className="footer-link">
                  MSTScan Explorer <ExternalLink className="w-3 h-3 inline ml-1 opacity-60" />
                </a>
                <a href={MST_FAUCET} target="_blank" rel="noopener noreferrer" className="footer-link">
                  tMSTC Faucet <ExternalLink className="w-3 h-3 inline ml-1 opacity-60" />
                </a>
                {isRegistryConfigured && (
                  <a href={explorerAddress(REGISTRY_ADDRESS)} target="_blank" rel="noopener noreferrer" className="footer-link">
                    Smart Contract <ExternalLink className="w-3 h-3 inline ml-1 opacity-60" />
                  </a>
                )}
                <span className="footer-link text-slate-500 cursor-default">OpenZeppelin 5.0.2</span>
              </div>

              <div className="footer-nav-col">
                <span className="footer-col-title">METHODOLOGIES</span>
                <span className="footer-link text-slate-400 cursor-default">AR-ACM0003 Afforestation</span>
                <span className="footer-link text-slate-400 cursor-default">VM0033 Blue Carbon</span>
                <span className="footer-link text-slate-400 cursor-default">VM0042 Soil Carbon</span>
                <span className="footer-link text-slate-400 cursor-default">Cryptographic Merkle Proofs</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>© 2026 Carbon Ledger. Open-source decentralized climate infrastructure.</span>
            <span>Built on MST Blockchain Testnet</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
