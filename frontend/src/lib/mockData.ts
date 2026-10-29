import type { Address } from 'viem'
import { STATUS, type ProjectWithId } from './registry'

export interface MarketplaceItem {
  id: string
  onChainId?: bigint
  name: string
  category: 'Reforestation' | 'Blue Carbon' | 'Agroforestry' | 'Renewable Energy' | 'Soil Carbon'
  location: string
  coordinates: string
  availableCredits: number
  totalIssued: number
  pricePerCredit: number // in tMSTC
  usdPrice: number
  status: 'Verified' | 'Pending' | 'Auditing'
  verifier: string
  verifierAddress: Address
  vintage: string
  methodology: string
  co2ReductionPerYear: number // in tonnes
  treeCount: number
  evidenceHash: string
  treeDataRoot: string
  description: string
  impactHighlights: string[]
  image: string
}

export interface BlockchainTransaction {
  hash: string
  type: 'Submission' | 'Verification' | 'Issuance' | 'Transfer' | 'Retirement'
  sender: Address
  receiver?: Address
  amount: number
  currency: 'kg CO₂e' | 'tMSTC'
  timestamp: number
  status: 'Confirmed' | 'Pending' | 'Failed'
  blockNumber: number
  projectName?: string
  projectId?: number
  fee: string
}

export const SAMPLE_MARKETPLACE_PROJECTS: MarketplaceItem[] = [
  {
    id: 'mkt-1',
    name: 'Western Ghats Native Teak & Bamboo Restoration',
    category: 'Reforestation',
    location: 'Pune District, Maharashtra, IN',
    coordinates: '18.5204° N, 73.8567° E',
    availableCredits: 42500,
    totalIssued: 50000,
    pricePerCredit: 0.045,
    usdPrice: 12.50,
    status: 'Verified',
    verifier: 'Verra Carbon Standard & MST Forestry Alliance',
    verifierAddress: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
    vintage: '2025–2026',
    methodology: 'VM0007 / AR-ACM0003 Afforestation & Agro-ecosystem Restoration',
    co2ReductionPerYear: 850,
    treeCount: 5000,
    evidenceHash: '0x7e8b61c94488b39a3118cf9451d698f1a7848f76632f146a48d887a0b321a56e',
    treeDataRoot: '0x4f128e02d84793b86e88e803f272a912bb035c91bfeaa7b38d38104e144a72d1',
    description: 'High-density native flora restoration focused on teak, bamboo, and endemic Western Ghats species. Restores wildlife corridors, bolsters soil water retention, and creates sustained livelihoods for local tribal agro-collectives.',
    impactHighlights: ['5,000 GPS-tagged trees', '22 Hectares reforested', 'Native biodiversity sanctuary', 'Zero chemical fertilizers'],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'mkt-2',
    name: 'Sundarbans Coastal Mangrove Protection Initiative',
    category: 'Blue Carbon',
    location: 'Sundarbans Delta, West Bengal, IN',
    coordinates: '21.9497° N, 89.1833° E',
    availableCredits: 78000,
    totalIssued: 100000,
    pricePerCredit: 0.068,
    usdPrice: 18.20,
    status: 'Verified',
    verifier: 'Global Blue Carbon Registry',
    verifierAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    vintage: '2025',
    methodology: 'VM0033 Tidal Wetland and Seagrass Restoration',
    co2ReductionPerYear: 1600,
    treeCount: 12400,
    evidenceHash: '0x39a12c44ff89bb7349071c50e26b158f9188dfa433a019488a789efc11a24d55',
    treeDataRoot: '0x889a72df91278f9931b20349b81ef12683015a51a14c6e917d3a01e523f669a2',
    description: 'Mangrove ecosystems sequester up to 4x more carbon than terrestrial forests. This initiative plants Rhizophora and Avicennia species, reinforcing shoreline resilience against cyclone surges and rejuvenating Bengal tiger coastal habitats.',
    impactHighlights: ['12,400 Mangrove saplings', 'Cyclone barrier for 4 villages', 'Cryptographic GPS validation', 'Certified Blue Carbon methodology'],
    image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'mkt-3',
    name: 'Nilgiri Shola-Grassland Regenerative Agroforestry',
    category: 'Agroforestry',
    location: 'Ooty, Tamil Nadu, IN',
    coordinates: '11.4102° N, 76.6950° E',
    availableCredits: 31200,
    totalIssued: 35000,
    pricePerCredit: 0.052,
    usdPrice: 14.00,
    status: 'Verified',
    verifier: 'EcoCert Bio-Ledger Verifier Node #4',
    verifierAddress: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    vintage: '2026',
    methodology: 'AR-AMS0007 Small-scale agroforestry and tree biomass enhancement',
    co2ReductionPerYear: 620,
    treeCount: 3800,
    evidenceHash: '0x11b51e44ff89bb7349071c50e26b158f9188dfa433a019488a789efc11a24d88',
    treeDataRoot: '0x334a72df91278f9931b20349b81ef12683015a51a14c6e917d3a01e523f669cc',
    description: 'Combines multi-tier shade canopy coffee with native shola tree species. Improves organic soil carbon content, eliminates synthetic runoff into downhill water tables, and empowers smallholder family plantations with verified carbon revenues.',
    impactHighlights: ['Multi-tier native canopy', 'Organic soil carbon tested', 'Fair-trade farmer direct benefit', '3,800 trees registered on-chain'],
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'mkt-4',
    name: 'Aravalli Range Green Wall Afforestation',
    category: 'Reforestation',
    location: 'Jaipur Rural, Rajasthan, IN',
    coordinates: '26.9124° N, 75.7873° E',
    availableCredits: 54000,
    totalIssued: 60000,
    pricePerCredit: 0.038,
    usdPrice: 10.50,
    status: 'Verified',
    verifier: 'Verra Carbon Standard & MST Forestry Alliance',
    verifierAddress: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
    vintage: '2025–2026',
    methodology: 'VM0007 Arid Zone Afforestation and Combating Desertification',
    co2ReductionPerYear: 1100,
    treeCount: 8200,
    evidenceHash: '0x22c51e44ff89bb7349071c50e26b158f9188dfa433a019488a789efc11a24d77',
    treeDataRoot: '0x992a72df91278f9931b20349b81ef12683015a51a14c6e917d3a01e523f669dd',
    description: 'Combats desertification along the eastern border of Thar Desert. Planting indigenous drought-resistant species including Khejri, Acacia, and Neem with drip-irrigation sensor arrays.',
    impactHighlights: ['Drought-hardy indigenous species', 'Desertification buffer zone', 'IoT soil moisture telemetry', '8,200 On-chain trees verified'],
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'mkt-5',
    name: 'Cauvery River Basin Soil Carbon Enhancement',
    category: 'Soil Carbon',
    location: 'Mysuru, Karnataka, IN',
    coordinates: '12.2958° N, 76.6394° E',
    availableCredits: 18500,
    totalIssued: 20000,
    pricePerCredit: 0.042,
    usdPrice: 11.80,
    status: 'Verified',
    verifier: 'Global Soil Alliance Verifier Node',
    verifierAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
    vintage: '2026',
    methodology: 'VM0042 Methodology for Improved Agricultural Land Management',
    co2ReductionPerYear: 410,
    treeCount: 2200,
    evidenceHash: '0x44d51e44ff89bb7349071c50e26b158f9188dfa433a019488a789efc11a24d99',
    treeDataRoot: '0x775a72df91278f9931b20349b81ef12683015a51a14c6e917d3a01e523f669ee',
    description: 'Promotes biochar infusion, cover cropping, and riparian buffer reforestation along the Cauvery catchment basin to trap carbon directly in the topsoil and stop chemical erosion.',
    impactHighlights: ['Biochar soil sequestration', 'River catchment buffer', 'Soil microbial diversity test', 'Zero till regenerative protocol'],
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'mkt-6',
    name: 'Eastern Himalaya Rhododendron Community Reserve',
    category: 'Reforestation',
    location: 'West Sikkim, IN',
    coordinates: '27.3167° N, 88.2500° E',
    availableCredits: 22000,
    totalIssued: 25000,
    pricePerCredit: 0.060,
    usdPrice: 16.50,
    status: 'Pending',
    verifier: 'Himalayan Ecological Audit Council',
    verifierAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    vintage: '2026',
    methodology: 'High-Altitude Forest Carbon & Cloud Reservoir Protocol',
    co2ReductionPerYear: 490,
    treeCount: 3100,
    evidenceHash: '0x66f51e44ff89bb7349071c50e26b158f9188dfa433a019488a789efc11a24d11',
    treeDataRoot: '0x116a72df91278f9931b20349b81ef12683015a51a14c6e917d3a01e523f669ff',
    description: 'Community-led preservation of alpine and sub-alpine cloud forest sanctuaries. Protects critical water towers feeding millions downstream and secures red panda natural nesting territory.',
    impactHighlights: ['Red panda habitat protection', 'High altitude watershed', 'Community stewardship', '3,100 trees in validation queue'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  },
]

export const SAMPLE_TRANSACTIONS: BlockchainTransaction[] = [
  {
    hash: '0x8f2a99d4e5124b8109ca512809bc45de827104b2a925f381ad7929456bb012ef',
    type: 'Retirement',
    sender: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    amount: 1500,
    currency: 'kg CO₂e',
    timestamp: Date.now() - 1000 * 60 * 18, // 18 mins ago
    status: 'Confirmed',
    blockNumber: 4892102,
    projectName: 'Sundarbans Coastal Mangrove Protection Initiative',
    projectId: 2,
    fee: '0.00042 tMSTC',
  },
  {
    hash: '0x3b1c88d4e5124b8109ca512809bc45de827104b2a925f381ad7929456bb098aa',
    type: 'Issuance',
    sender: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
    receiver: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    amount: 50000,
    currency: 'kg CO₂e',
    timestamp: Date.now() - 1000 * 60 * 65, // 1 hour ago
    status: 'Confirmed',
    blockNumber: 4891980,
    projectName: 'Western Ghats Native Teak & Bamboo Restoration',
    projectId: 1,
    fee: '0.00085 tMSTC',
  },
  {
    hash: '0x12a999d4e5124b8109ca512809bc45de827104b2a925f381ad7929456bb077bc',
    type: 'Verification',
    sender: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    amount: 12400,
    currency: 'kg CO₂e',
    timestamp: Date.now() - 1000 * 60 * 140, // 2.3 hours ago
    status: 'Confirmed',
    blockNumber: 4891824,
    projectName: 'Sundarbans Coastal Mangrove Protection Initiative',
    projectId: 2,
    fee: '0.00110 tMSTC',
  },
  {
    hash: '0x992c88d4e5124b8109ca512809bc45de827104b2a925f381ad7929456bb033df',
    type: 'Transfer',
    sender: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    receiver: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    amount: 3200,
    currency: 'kg CO₂e',
    timestamp: Date.now() - 1000 * 60 * 320, // 5.3 hours ago
    status: 'Confirmed',
    blockNumber: 4891510,
    projectName: 'Nilgiri Shola-Grassland Regenerative Agroforestry',
    projectId: 3,
    fee: '0.00038 tMSTC',
  },
  {
    hash: '0x774e88d4e5124b8109ca512809bc45de827104b2a925f381ad7929456bb055dd',
    type: 'Submission',
    sender: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    amount: 3800,
    currency: 'kg CO₂e',
    timestamp: Date.now() - 1000 * 60 * 580, // ~9.6 hours ago
    status: 'Confirmed',
    blockNumber: 4891104,
    projectName: 'Nilgiri Shola-Grassland Regenerative Agroforestry',
    projectId: 3,
    fee: '0.00072 tMSTC',
  },
  {
    hash: '0x551a88d4e5124b8109ca512809bc45de827104b2a925f381ad7929456bb088aa',
    type: 'Retirement',
    sender: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    amount: 4500,
    currency: 'kg CO₂e',
    timestamp: Date.now() - 1000 * 60 * 840, // 14 hours ago
    status: 'Confirmed',
    blockNumber: 4890620,
    projectName: 'Aravalli Range Green Wall Afforestation',
    projectId: 4,
    fee: '0.00045 tMSTC',
  },
  {
    hash: '0x221a88d4e5124b8109ca512809bc45de827104b2a925f381ad7929456bb011cc',
    type: 'Issuance',
    sender: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
    receiver: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    amount: 60000,
    currency: 'kg CO₂e',
    timestamp: Date.now() - 1000 * 60 * 1440, // 24 hours ago
    status: 'Confirmed',
    blockNumber: 4889890,
    projectName: 'Aravalli Range Green Wall Afforestation',
    projectId: 4,
    fee: '0.00088 tMSTC',
  },
]

export const PLATFORM_STATS = {
  totalCarbonCredits: 247100, // in kg CO₂e
  creditsIssued: 275000,
  creditsRetired: 27900,
  totalCo2OffsetTons: 27.9,
  blockchainTxCount: 1482,
  activeProjectsCount: 18,
  verifiedLandHectares: 142.5,
  carsOffsetEquivalent: 610,
  cryptographicProofsGenerated: 34700,
  avgVerifierTimeHours: 4.2,
}

export const MONTHLY_ACTIVITY_DATA = [
  { month: 'May', minted: 18000, retired: 3200, volume: 21200 },
  { month: 'Jun', minted: 24500, retired: 4800, volume: 29300 },
  { month: 'Jul', minted: 32000, retired: 6100, volume: 38100 },
  { month: 'Aug', minted: 45000, retired: 7900, volume: 52900 },
  { month: 'Sep', minted: 62000, retired: 11400, volume: 73400 },
  { month: 'Oct', minted: 93500, retired: 18200, volume: 111700 },
]

export const CATEGORY_DISTRIBUTION = [
  { name: 'Native Reforestation', share: 44, color: '#10b981', credits: 108724 },
  { name: 'Coastal Blue Carbon', share: 31, color: '#06b6d4', credits: 76601 },
  { name: 'Regenerative Agroforestry', share: 15, color: '#84cc16', credits: 37065 },
  { name: 'Soil Carbon Capture', share: 10, color: '#eab308', credits: 24710 },
]
