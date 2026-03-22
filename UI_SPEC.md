# UI SPEC - For Anti-Gravity Team

> All component structure, layouts, styling, and animations for Phase 1 features.
> **Import all data and logic from Cloud team's files** (`src/data/` and `src/hooks/`).
> Do NOT hardcode data or write business logic — only UI rendering, styling, and animations.

---

## Project Context

- **Stack**: React 19 + Vite 7 + Tailwind 4 + Framer Motion 12 + Lucide React icons
- **Font**: Space Grotesk (already loaded via Google Fonts)
- **Theme**: Dark mode only. See color constants below.
- **Existing patterns to follow**: Look at `Consensus.jsx`, `Security.jsx`, `Solidity.jsx` for the exact style.
- **No new dependencies.** Use only what's already installed.

### Color Constants (copy into every new component)

```js
const BG = '#11131d';
const SURFACE = '#1d1f2a';
const SURFACE_H = '#282934';
const AMBER = '#f59e0b';
const ROSE = '#fb7185';
const EMERALD = '#4ade80';
const SKY = '#38bdf8';
const PURPLE = '#a78bfa';
const TEXT = '#f1f5f9';
const MUTED = '#64748b';
```

### CSS Classes Available (from `index.css`)

- `clip-button` — angled clip-path on buttons
- `amber-glow`, `rose-glow`, `emerald-glow`, `sky-glow` — box-shadow glow effects
- `glass` — frosted glass background
- `text-amber-gradient` — amber-to-rose gradient text
- `font-terminal` — monospace font (Fira Code / JetBrains Mono)
- `scrollbar-hide` — hide scrollbar
- `chain-pulse` — pulsing animation for chain links
- `cursor-blink` — blinking cursor animation
- `orb-animate`, `orb-animate-slow` — floating ambient orb animations

### Common UI Patterns in Existing Code

1. **Page Header**: Uppercase tracking-widest label + large font-black title + muted description + optional SVG illustration
2. **Tab Bar**: Flex row of buttons with `backgroundColor: selected ? color : SURFACE` and `boxShadow` glow when active
3. **Content Card**: `style={{ backgroundColor: SURFACE, borderLeft: '3px solid COLOR' }}` with `p-6`
4. **Dark Panel**: `style={{ backgroundColor: BG }}` with `p-4` for nested dark areas
5. **Buttons**: `clip-button` class + accent color background + dark text + glow shadow
6. **Animations**: `motion.div` with `initial={{ opacity: 0, y: 10 }}` → `animate={{ opacity: 1, y: 0 }}`
7. **Section Labels**: `<p className="text-xs font-bold tracking-widest uppercase" style={{ color: ACCENT }}>─── LABEL</p>`

---

## Files You Create

```
src/components/
  TokenStandards.jsx   -- Feature 1
  DeFi.jsx             -- Feature 2
  Layer2.jsx           -- Feature 4
  Glossary.jsx         -- Feature 5
  Quiz.jsx             -- Feature 6 (reusable quiz component)
```

Plus modifications to:
```
src/components/Security.jsx   -- Feature 3 (add Flash Loan tab)
src/components/Home.jsx       -- Feature 6 (add progress bar + badges)
src/components/Navbar.jsx     -- Add new nav links + progress indicator
src/App.jsx                   -- Add new routes
```

---

## App.jsx — Route Updates

Add these imports and routes:

```jsx
import TokenStandards from './components/TokenStandards';
import DeFi from './components/DeFi';
import Layer2 from './components/Layer2';
import Glossary from './components/Glossary';

// Inside <Routes>:
<Route path="/tokens" element={<TokenStandards />} />
<Route path="/defi" element={<DeFi />} />
<Route path="/layer2" element={<Layer2 />} />
<Route path="/glossary" element={<Glossary />} />
```

---

## Navbar.jsx — Navigation Updates

Add new links to the nav. Keep the current flat layout but add items:

```
Home | Consensus | Solidity | Tokens (new) | DeFi (new) | Deployment | Security | Layer 2 (new) | Glossary (new) | Share
```

Use these Lucide icons for new items:
- Tokens: `<Coins />`
- DeFi: `<TrendingUp />`
- Layer 2: `<Layers />`
- Glossary: `<BookOpen />`

**Optional**: Add a small progress indicator next to the logo or in the mobile menu. Import `useProgress` from `../hooks/useProgress` and show `progressPercent` as a tiny bar or badge.

---

## FEATURE 1: Token Standards Page

**File**: `src/components/TokenStandards.jsx`

**Imports from Cloud team**:
```js
import { ERC_STANDARDS, TOKEN_COMPARISON, DECISION_TREE } from '../data/tokenStandards';
```

### Page Header

```
─── TOKEN STANDARDS
ERC Token
Standards               [SVG: three overlapping coins/tokens in isometric style]
Understand the interfaces that power every token on Ethereum.
```

- Label color: `AMBER`
- Title gradient: `text-amber-gradient` on "Standards"
- SVG style: Match existing isometric illustrations (see Consensus.jsx and Security.jsx)

### Tab Bar

Three tabs: `ERC-20` | `ERC-721` | `ERC-1155`
- Tab colors: ERC-20 = `AMBER`, ERC-721 = `ROSE`, ERC-1155 = `EMERALD`
- Same style as Security.jsx tabs (flex-wrap, gap-2, border, glow)

### Tab Content — Function Explorer

For the selected standard, render its `functions` array:

```
┌─────────────────────────────────────────────────────┐
│ [SURFACE card with left border in tab color]        │
│                                                     │
│  Token: ERC-20 — Fungible Token Standard            │
│  "The standard for creating interchangeable tokens" │
│                                                     │
│  Use Cases: [pill badges] Currencies | Governance   │
│  Gas: ~65,000 to deploy, ~50,000 per transfer       │
│                                                     │
│  ┌───────────────────────────────────────────┐      │
│  │ Function List (clickable)                  │     │
│  │                                            │     │
│  │  ▸ totalSupply()          view  →  uint256 │     │
│  │  ▸ balanceOf(address)     view  →  uint256 │     │
│  │  ▸ transfer(address, uint256)   →  bool    │     │
│  │  ▸ approve(address, uint256)    →  bool    │     │
│  │  ▸ transferFrom(a, a, uint256)  →  bool    │     │
│  │  ▸ allowance(address, address)  →  uint256 │     │
│  └───────────────────────────────────────────┘      │
│                                                     │
│  [When a function is clicked, expand below it:]     │
│  ┌───────────────────────────────────────────┐      │
│  │ [BG dark panel]                            │     │
│  │ Signature: function balanceOf(address...)   │     │
│  │ Parameters:                                 │     │
│  │   • account (address) — The wallet to query │     │
│  │ Returns: uint256 — token balance            │     │
│  │                                             │     │
│  │ Description: Returns how many tokens...     │     │
│  │                                             │     │
│  │ 💡 Analogy: Like checking your bank balance │     │
│  │                                             │     │
│  │ ┌─ Code Example ─────────────────────────┐  │     │
│  │ │ uint256 myBal = token.balanceOf(msg...) │  │     │
│  │ └────────────────────────────────────────┘  │     │
│  └───────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────┘
```

- Function list: Dark rows (`BG` background), monospace font (`font-terminal`)
- Click a function → `AnimatePresence` expand with explanation panel
- Signature in `SKY` color, parameters in `MUTED`, analogy in `AMBER`
- Code example block: dark `BG` background, `font-terminal`, with copy button

### Comparison Table Section

Below the tab content, render `TOKEN_COMPARISON` as a table.

```
┌──────────────────────────┬──────────┬──────────┬──────────┐
│ Property                 │ ERC-20   │ ERC-721  │ ERC-1155 │
├──────────────────────────┼──────────┼──────────┼──────────┤
│ Fungibility              │ Fully    │ Non-     │ Both     │
│ Batch Transfers          │ No       │ No       │ Yes ✓    │
│ ...                      │          │          │          │
└──────────────────────────┴──────────┴──────────┴──────────┘
```

- Table background: `SURFACE`
- Header row: `SURFACE_H` background
- Active tab's column gets a subtle glow highlight
- Cell text: `TEXT`, header text: `MUTED` uppercase

### Decision Flowchart Section

Render `DECISION_TREE` as an interactive stepper:

```
Step 1: "Are all your tokens identical?"
          [YES]     [NO]
            ↓         ↓
         ERC-20    Step 2: "Is each token unique?"
                     [YES]     [NO]
                       ↓         ↓
                   Step 3      ERC-1155
```

- Render as centered cards connected by animated lines
- YES/NO buttons styled as `clip-button` in `EMERALD` / `ROSE`
- Result card: Large centered card with recommended standard, colored border, reason text
- "Start Over" button to reset the flowchart
- Use `motion.div` for step transitions

---

## FEATURE 2: DeFi Concepts Page

**File**: `src/components/DeFi.jsx`

**Imports from Cloud team**:
```js
import { DEFI_GLOSSARY, IL_PRESETS } from '../data/defiConcepts';
import { useAMM, calculateImpermanentLoss } from '../hooks/useAMM';
import { useLending } from '../hooks/useLending';
```

### Page Header

```
─── DECENTRALIZED FINANCE
DeFi
Concepts                [SVG: liquidity pool / two-token swap diagram]
Simulate AMMs, impermanent loss, and lending — the building blocks of DeFi.
```

- Label color: `EMERALD`
- "Concepts" in gradient

### Tab Bar

Four tabs: `AMM Simulator` | `Impermanent Loss` | `Lending` | `Glossary`
- Colors: AMM = `EMERALD`, IL = `ROSE`, Lending = `AMBER`, Glossary = `SKY`

### Tab 1: AMM Simulator

Use `useAMM()` hook. Layout:

```
┌─────────────────────────────────────┬──────────────────────────┐
│ [SURFACE card, EMERALD left border] │ [SURFACE card]           │
│                                     │                          │
│  Pool State                         │  Swap                    │
│  ┌────────────────────────┐         │                          │
│  │ Token A (ETH)          │         │  Direction: [A→B] [B→A]  │
│  │ ████████████░░░ 1000   │         │                          │
│  │                        │         │  Amount: [====slider===]  │
│  │ Token B (USDC)         │         │  Input: 100 ETH          │
│  │ ████████████████ 2M    │         │                          │
│  └────────────────────────┘         │  Output: 181,818 USDC    │
│                                     │  Slippage: 1.2%          │
│  k = 2,000,000,000                  │  Price Impact: 10%       │
│  Price: 1 ETH = 2000 USDC          │                          │
│                                     │  [  Execute Swap  ]      │
│                                     │  [  Reset Pool    ]      │
└─────────────────────────────────────┴──────────────────────────┘

Formula Display (below):
┌────────────────────────────────────────────────────────────────┐
│  x  *  y  =  k                                                │
│  1000 * 2,000,000 = 2,000,000,000                             │
│  After swap: 1100 * 1,818,182 = 2,000,000,000  ✓             │
└────────────────────────────────────────────────────────────────┘
```

- Pool bars: Use animated CSS bars (`motion.div` width based on percentage). Token A bar in `EMERALD`, Token B bar in `SKY`.
- Slider: `<input type="range">` with `accentColor: EMERALD` (same pattern as mining difficulty slider)
- Slippage: Show in `ROSE` when > 2%, `AMBER` when > 1%, `EMERALD` when < 1%
- Execute button: `clip-button` with `EMERALD` background
- Formula: `font-terminal` in a `BG` dark panel. Highlight the numbers that change after a swap.
- Swap history: Optional small list showing last few swaps from `history` array.

### Tab 2: Impermanent Loss Calculator

Use `calculateImpermanentLoss()` function.

```
┌────────────────────────────────────────────────────────────────┐
│  Price Change Multiplier                                       │
│  [====slider from 0.1x to 5x====]  Current: 2.0x              │
│                                                                │
│  Preset buttons: [1.5x] [2x] [3x] [5x] [0.5x] [0.25x]       │
│                                                                │
│  ┌───────────────────────┐  ┌───────────────────────┐          │
│  │  If You HELD           │  │  If You LP'd           │         │
│  │                        │  │                         │         │
│  │  $1,500.00             │  │  $1,414.21              │         │
│  │  ████████████████████  │  │  ██████████████████░░░  │         │
│  │                        │  │                         │         │
│  │  +50% gain             │  │  +41.4% gain            │         │
│  └───────────────────────┘  └───────────────────────┘          │
│                                                                │
│  Impermanent Loss: 5.72%  ($85.79)                             │
│  ⚠ You lost $85.79 compared to just holding                   │
│                                                                │
│  [BG panel: Math breakdown]                                    │
│  IL = 2√(2.0) / (1 + 2.0) - 1 = -5.72%                       │
└────────────────────────────────────────────────────────────────┘
```

- HELD bar: `EMERALD` colored
- LP bar: `SKY` colored, slightly shorter to show the difference
- Difference highlighted in `ROSE`
- Bars should animate smoothly when slider moves (`motion.div` with `layout` prop)
- Math breakdown: `font-terminal` text in `BG` panel
- Preset buttons: Row of `clip-button` styled buttons. Active preset highlighted.

### Tab 3: Lending Protocol Simulator

Use `useLending()` hook.

```
┌────────────────────────────────────┬───────────────────────────┐
│ Deposit Collateral                 │  Position Health          │
│                                    │                           │
│ Amount: [====slider 0-10 ETH====]  │  Collateral: 5 ETH       │
│ [Deposit 1 ETH] [Deposit 5 ETH]   │  Value: $15,000           │
│                                    │  Borrowed: $8,000 USDC    │
│ Borrow USDC                        │                           │
│ Max: $6,666  Available: $2,666     │  ┌─────────────────────┐  │
│ [Borrow $1000] [Borrow Max]       │  │ Health Factor: 1.87  │  │
│                                    │  │ ███████████████░░░░  │  │
│ Simulate Price Change              │  │ Ratio: 187%          │  │
│ ETH Price: [====slider====]        │  │ Liquidation at 120%  │  │
│ $3000  ←  current  →  $500        │  └─────────────────────┘  │
│                                    │                           │
│ [Liquidate]  [Reset]              │  Status: SAFE / WARNING /  │
│                                    │          LIQUIDATED       │
└────────────────────────────────────┴───────────────────────────┘

Logs panel below (same as reentrancy demo):
┌────────────────────────────────────────────────────────────────┐
│ [BG dark panel, font-terminal, scrollable]                     │
│ > Deposited 5 ETH as collateral                                │
│ > Borrowed 8000 USDC (ratio: 187%)                             │
│ > WARNING — ratio at 140%, approaching liquidation zone        │
│ > LIQUIDATION TRIGGERED — collateral ratio dropped to 115%     │
└────────────────────────────────────────────────────────────────┘
```

- Health bar: Gradient from `EMERALD` (healthy) to `AMBER` (warning) to `ROSE` (danger)
- At healthFactor < 1.5: bar turns `AMBER`, "WARNING" label
- At healthFactor < 1.2: bar turns `ROSE`, "DANGER" label, pulsing animation
- When `isLiquidated`: Full-screen flash animation (brief red overlay), "LIQUIDATED" badge
- Log panel: Same style as Security.jsx reentrancy logs — dark `BG`, `font-terminal`, auto-scroll to bottom
- Log entry colors: info = `MUTED`, warn = `AMBER`, danger = `ROSE`

### Tab 4: DeFi Glossary Cards

Render `DEFI_GLOSSARY` as flip cards.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Liquidity  │  │    AMM       │  │  Impermanent │
│     Pool     │  │              │  │    Loss      │
│              │  │              │  │              │
│  [tap to     │  │  [tap to     │  │  [tap to     │
│   flip]      │  │   flip]      │  │   flip]      │
└──────────────┘  └──────────────┘  └──────────────┘
```

- Front: Term name centered, `SURFACE` background, subtle border
- Back: Definition + Example, `SURFACE_H` background
- Flip animation: Use Framer Motion `rotateY` transform
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

---

## FEATURE 3: Flash Loan Demo (Security.jsx modification)

**Imports from Cloud team**:
```js
import { FLASH_LOAN_STEPS, FLASH_LOAN_VULNERABLE_CODE, FLASH_LOAN_FIXED_CODE, FLASH_LOAN_MITIGATIONS } from '../data/flashLoan';
```

### Add to Security.jsx

1. Add a new tab to the `TABS` array:
```js
{ id: 'flashloan', label: 'Flash Loans', icon: <Zap className="w-4 h-4" />, color: PURPLE }
```

2. In the tab content render section, add:
```jsx
{activeTab === 'flashloan' && <FlashLoanDemo />}
```

3. Create `FlashLoanDemo` function component inside `Security.jsx`.

### Flash Loan Demo Layout

```
┌────────────────────────────────────────────────────────────────┐
│ [SURFACE card, PURPLE left border]                             │
│                                                                │
│  ⚡ Flash Loan Attack — Step by Step                           │
│  "Borrow millions, manipulate prices, profit — all in one tx" │
│                                                                │
│  Step [2] of 6:  "Dump on DEX A"                               │
│                                                                │
│  ┌─ Visualization ─────────────────────────────────────────┐   │
│  │                                                         │   │
│  │   [Attacker]     [Flash Pool]    [DEX A]     [DEX B]    │   │
│  │    2,000 ETH      0 ETH          13,000       5,000     │   │
│  │    ████░░░░       ░░░░░░░░       █████████    ██████    │   │
│  │         ↓                            ↑                  │   │
│  │         └────── selling ETH ─────────┘                  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Description: "Attacker sells massive amount of ETH on DEX A,  │
│  crashing the price from $3000 to $2000."                      │
│                                                                │
│  [← Previous]                              [Next Step →]       │
│                                                                │
│  Step indicators:  ● ● ◉ ○ ○ ○                                │
└────────────────────────────────────────────────────────────────┘

Code comparison (below):
┌────────────────────────────┬───────────────────────────────────┐
│  ❌ Vulnerable              │  ✅ Fixed                         │
│  [BG panel, font-terminal]  │  [BG panel, font-terminal]       │
│  // uses spot price...      │  // uses TWAP oracle...           │
│                             │                                   │
└────────────────────────────┴───────────────────────────────────┘

Mitigations:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Use TWAP     │  │ Chainlink    │  │ Flash Loan   │  │ Min Delay    │
│ Oracles      │  │ Price Feeds  │  │ Detection    │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

- Use local `useState` for `currentStep` (0-5 index)
- Each step from `FLASH_LOAN_STEPS` — show balances as animated bars
- `highlight` field tells which entity to glow/pulse
- Bars: Animate width changes with `motion.div layout`
- Color coding: Attacker = `ROSE`, Pool = `SKY`, DEX A = `AMBER`, DEX B = `EMERALD`
- Step indicators: Filled circles for completed, ring for current, empty for upcoming
- Previous/Next buttons: `clip-button` style
- Code comparison: Two side-by-side `BG` panels with `font-terminal`. Vulnerable in `ROSE` border, Fixed in `EMERALD` border.
- Mitigation cards: `SURFACE` background, icon on top, hover to see description (`AnimatePresence`)

---

## FEATURE 4: Layer 2 Explainer Page

**File**: `src/components/Layer2.jsx`

**Imports from Cloud team**:
```js
import { L2_CHAINS, ROLLUP_EXPLAINER, BRIDGE_STEPS } from '../data/layer2Data';
```

### Page Header

```
─── SCALING SOLUTIONS
Layer 2
Explained               [SVG: stacked layers / blocks diagram]
How rollups scale Ethereum from 15 to 2,000+ transactions per second.
```

- Label color: `SKY`

### Section 1: Chain Comparison Table

Render `L2_CHAINS` as a styled table (same pattern as Deployment's chain ID table).

- Table background: `SURFACE`
- Column headers: `MUTED` uppercase
- Each chain's name colored with its `color` property
- "Type" column: badge-style with `optimistic` in `AMBER`, `zk` in `PURPLE`
- Gas columns: `EMERALD` for cheap L2 values, `ROSE` for expensive L1 values

### Section 2: How Rollups Work

Toggle: `[Optimistic Rollup]  [ZK Rollup]`

Render `ROLLUP_EXPLAINER[selected]` as an animated step diagram:

```
┌─────────────────────────────────────────────────────────────┐
│  Optimistic Rollups — "Assume valid, challenge if wrong"    │
│                                                             │
│  [1. Collect] → [2. Execute] → [3. Batch] → [4. Post] →   │
│  [5. Challenge Window (7 days)] → [6. Finalized ✓]         │
│                                                             │
│  (each step is a card that animates in sequence)            │
│                                                             │
│  Pros: ✓ Full EVM compat  ✓ Lower gas  ✓ Mature            │
│  Cons: ✗ 7-day delay  ✗ Trust assumption  ✗ Overhead       │
└─────────────────────────────────────────────────────────────┘
```

- Steps render as connected cards (like a horizontal chain)
- Connecting arrows animate with `chain-pulse` class
- Steps reveal one-by-one with staggered `motion.div` (`transition: { delay: i * 0.15 }`)
- Toggle animates between optimistic/zk with `AnimatePresence mode="wait"`
- Optimistic accent: `AMBER`, ZK accent: `PURPLE`
- Pros in `EMERALD`, Cons in `ROSE`

### Section 3: Bridge Mechanics

Render `BRIDGE_STEPS` as a 4-step horizontal flow:

```
 [Lock on L1] ──→ [Verify] ──→ [Mint on L2] ──→ [Use on L2]
   🔒 L1            🔍            🪙 L2           ⚡ L2
```

- Each step as a `SURFACE` card with icon and description
- Animated dashed line connecting them
- Cards stagger-animate on scroll (`whileInView`)

---

## FEATURE 5: Glossary Page

**File**: `src/components/Glossary.jsx`

**Imports from Cloud team**:
```js
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, filterGlossary } from '../data/glossary';
```

### Page Header

```
─── REFERENCE
Blockchain
Glossary                [SVG: open book / dictionary icon]
100+ essential blockchain terms explained simply.
```

- Label color: `SKY`

### Layout

```
┌────────────────────────────────────────────────────────────────┐
│  🔍 [Search: type to filter...]                               │
│                                                                │
│  Categories: [All] [Core] [Ethereum] [DeFi] [Security]        │
│              [Layer 2] [Governance] [Development]              │
│                                                                │
│  Showing 87 of 100+ terms                                      │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  A                                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ABI (Application Binary Interface)           [Ethereum]  │  │
│  │                                                          │  │
│  │ (click to expand ↓)                                      │  │
│  │ A JSON description of a contract's functions and events. │  │
│  │ Required for any external code to interact with...       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ AMM (Automated Market Maker)                     [DeFi]  │  │
│  │ (collapsed — click to expand)                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  B                                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Block                                            [Core]  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ...                                                           │
└────────────────────────────────────────────────────────────────┘
```

- **Follow the exact same pattern as Solidity.jsx's dictionary** — it already works well
- Search: `<input>` at top with `useState` for search query. Pass to `filterGlossary(GLOSSARY_TERMS, { category, search })`
- Category filter: Row of buttons. Active category highlighted with accent color + glow. "All" button to clear filter.
- Term list: Grouped alphabetically by first letter. Letter headers in `AMBER`.
- Each term: `SURFACE` background card. Term name in `TEXT`, category as a small colored badge on the right.
- Click to expand: `AnimatePresence` + `motion.div` slides down with definition, example (if present).
- Category badge colors: Core = `AMBER`, Ethereum = `SKY`, DeFi = `EMERALD`, Security = `ROSE`, Layer 2 = `PURPLE`, Governance = `AMBER`, Development = `SKY`

---

## FEATURE 6: Quiz Component + Progress Integration

### File: `src/components/Quiz.jsx` (Reusable Component)

**Imports from Cloud team**:
```js
import { useQuiz } from '../hooks/useQuiz';
import { useProgress } from '../hooks/useProgress';
```

**Props**: `{ questions, sectionId, sectionColor }`

```
┌────────────────────────────────────────────────────────────────┐
│ ─── KNOWLEDGE CHECK                                            │
│                                                                │
│  Question 2 of 4                                               │
│  ● ● ○ ○                                                      │
│                                                                │
│  "What does the 'view' keyword mean on a function?"            │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ A) It can modify state                                   │  │ ← SURFACE bg
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ B) It reads state but cannot modify it               ✓   │  │ ← EMERALD border when correct
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ C) It costs zero gas always                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ D) It is only visible to the owner                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  [After answering — show explanation panel:]                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ✓ Correct! "view" functions can read state variables...  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│                                           [Next Question →]    │
└────────────────────────────────────────────────────────────────┘

[When quiz is complete:]
┌────────────────────────────────────────────────────────────────┐
│  Score: 4/5 (80%)                                              │
│                                                                │
│  ████████████████████░░░░  80%                                 │
│                                                                │
│  🛡 Badge Unlocked: "Security Analyst"                        │
│                                                                │
│  [Retake Quiz]                                                 │
└────────────────────────────────────────────────────────────────┘
```

- Options: `SURFACE` background, hover → `SURFACE_H`
- After selection:
  - Correct answer: `EMERALD` border + checkmark icon
  - Wrong answer: `ROSE` border + X icon on selected, `EMERALD` border on correct
  - Other options: dim to 50% opacity
- Explanation panel: `BG` background, appears with slide-down animation
- Progress dots: Filled = answered, Ring = current, Empty = upcoming
- Pass threshold: >= 60% correct. On pass, call `markComplete(sectionId)` from `useProgress`.
- Badge unlock: If passed, show badge with scale-up animation (`motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}`)

### Usage in Each Page

Add the Quiz component at the bottom of each page. Example for `Consensus.jsx`:

```jsx
import { QUIZZES } from '../data/quizzes';
import Quiz from './Quiz';

// At the bottom of the Consensus component, after existing content:
<Quiz questions={QUIZZES.consensus} sectionId="consensus" sectionColor={AMBER} />
```

Do the same for: `Solidity.jsx`, `Deployment.jsx`, `Security.jsx`, `TokenStandards.jsx`, `DeFi.jsx`, `Layer2.jsx`.

### Home.jsx — Progress Display

Import `useProgress` and add a section below the hero:

```
┌────────────────────────────────────────────────────────────────┐
│  Your Progress                                                 │
│  ████████████████████░░░░░░░░  57% (4/7 sections)              │
│                                                                │
│  Badges:                                                       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  │ ⛏ │ │ 📝 │ │ 🚀 │ │ 🛡 │ │ 🪙 │ │ 📊 │ │ 🔗 │ │ 🎓 │    │
│  │ ✓  │ │ ✓  │ │ ✓  │ │ ✓  │ │ 🔒 │ │ 🔒 │ │ 🔒 │ │ 🔒 │    │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘    │
│                                                                │
│  Continue: [Layer 2 Scaling →]                                 │
└────────────────────────────────────────────────────────────────┘
```

- Progress bar: Gradient from `AMBER` to `EMERALD`
- Unlocked badges: Full color + glow
- Locked badges: Grayscale + `opacity-40` + lock icon overlay
- "Continue" button: Links to the first incomplete section

---

## File Checklist for Anti-Gravity Team

| File | Action | Status |
|------|--------|--------|
| `src/App.jsx` | Add 4 new routes | TODO |
| `src/components/Navbar.jsx` | Add 4 nav links + icons | TODO |
| `src/components/TokenStandards.jsx` | Create new | TODO |
| `src/components/DeFi.jsx` | Create new | TODO |
| `src/components/Layer2.jsx` | Create new | TODO |
| `src/components/Glossary.jsx` | Create new | TODO |
| `src/components/Quiz.jsx` | Create new (reusable) | TODO |
| `src/components/Security.jsx` | Add Flash Loan tab + `FlashLoanDemo` component | TODO |
| `src/components/Home.jsx` | Add progress section + badges | TODO |
| `src/components/Consensus.jsx` | Add `<Quiz>` at bottom | TODO |
| `src/components/Solidity.jsx` | Add `<Quiz>` at bottom | TODO |
| `src/components/Deployment.jsx` | Add `<Quiz>` at bottom | TODO |

**Total: 12 files (4 new, 8 modified). Zero new dependencies.**
