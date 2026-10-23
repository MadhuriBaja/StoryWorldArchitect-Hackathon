---
doc: spec
status: approved
---

# StoryWorld Architect — Technical Specification

**One-line summary**: A Next.js (React + TypeScript) single-page studio backed by secure server-side API routes that integrate with Google Gemini API to generate structured 5-domain world models, preserve an immutable baseline, and simulate cascading counterfactual consequences with explicit causal chains.
**Source**: [devpost/prd.md](file:///c:/Users/Madhuri/StoryWorldArchitect-Hackathon/devpost/prd.md) & [devpost/scope.md](file:///c:/Users/Madhuri/StoryWorldArchitect-Hackathon/devpost/scope.md)

---

## 1. How This Works, In Plain Language

StoryWorld Architect is a lightweight, responsive web laboratory running locally on your laptop:

1. **The Frontend Studio (Browser)**: You see a sleek, dark-navy workspace. When you type a premise or click a preset, the browser sends that text to our local backend server.
2. **The Server-Side AI Gateway (API Routes)**: Our backend server receives your request. It holds your private Gemini API key securely so it is never exposed in the browser. It sends a carefully designed prompt to the Gemini API requesting a strictly formatted JSON response.
3. **The 5-Domain Baseline (In-Memory State)**: When the AI responds with the generated world, the frontend validates the data and stores it in memory as an **immutable baseline**. The original characters, factions, locations, and rules are rendered onto tactile, glowing cards.
4. **The What-If Counterfactual Engine**: When you pick a rule and rewrite it in the What-If Lab, the frontend sends both the **untouched baseline world** and your **modified rule** to the backend simulation endpoint (`/api/simulate-consequences`).
5. **The Causal Reasoning Chain**: The AI is instructed to reason through a three-step causal bridge for every entity:
   $$\text{Changed Rule} \longrightarrow \text{Immediate Systemic Effect} \longrightarrow \text{Downstream Entity Consequence}$$
6. **Side-by-Side Comparison & Network-Free Reset**: The frontend displays the new consequences alongside the original baseline. Because the original baseline is preserved immutably in client memory, clicking **"Reset to Baseline"** performs a network-free client-side reset that restores the original view without requiring a new AI call.

---

## 2. The Core Journey Through the System

Trace of the 8 PRD steps through the technical architecture:

```
[Creator in Browser]
       │
       │ 1. Enter Premise / Click Preset
       ▼
[Frontend: Studio Component]
       │
       │ 2. POST /api/generate-world { premise }
       ▼
[Backend: Next.js API Route]
       │
       │ 3. Gemini API (JSON Schema mode + system prompt)
       ▼
[Gemini LLM] ── Returns structured 5-domain JSON ──► [Backend API Route]
                                                              │
                                                              ▼
[Frontend State] ◄── Validates & stores `baselineWorld` ───────┘
       │
       │ 4. Renders 5 Domains (Overview, Characters, Factions, Locations, Rules)
       │ 5. Creator selects Rule & types Counterfactual Rule in What-If Lab
       │ 6. POST /api/simulate-consequences { baselineWorld, changedRuleId, newRuleText }
       ▼
[Backend: Next.js API Route]
       │
       │ 7. Gemini API (Delta Prompt with Causal Chain Schema)
       ▼
[Gemini LLM] ── Returns causal consequence JSON ──► [Backend API Route]
                                                           │
                                                           ▼
[Frontend State] ◄── Stores `simulationResult` ─────────────┘
       │
       │ 8. Renders Side-by-Side Before/After Comparison
       │    (Creator clicks "Reset" -> `simulationResult = null` -> instant baseline view)
```

- PRD Ref: Implements `prd.md > 1. The Core Journey`.

---

## 3. Stack

| Layer | Technology | Version | Rationale & Tradeoff |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `14.x` / `15.x` | Combines client React UI with secure server-side API routes in one unified project. Eliminates CORS issues and keeps setup simple. |
| **Language** | TypeScript | `^5.x` | Provides strict type safety for world schemas and consequence contracts, preventing runtime undefined errors. |
| **Frontend UI** | React | `^18.x` / `^19.x` | Fast component-based rendering with hooks (`useState`, `useCallback`) for client-side state. |
| **Styling** | Vanilla CSS (CSS Modules / Global Theme) | CSS3 | Maximum design control over glassmorphism, radial gradients, glowing borders, and animations without Tailwind build friction. |
| **AI SDK** | `@google/genai` (or native fetch to Gemini REST API) | Latest | Official Google Gen AI client for Gemini 2.5 Flash / 1.5 Flash with structured JSON output capabilities. |
| **Icons** | Lightweight SVG icons | Inline SVG | Zero external font or icon library dependencies; renders instantly offline. |

- **Documentation Links**:
  - [Next.js Documentation](https://nextjs.org/docs)
  - [Google Gemini API Docs](https://ai.google.dev/docs)
  - [React Documentation](https://react.dev)

---

## 4. Where It Runs and How Someone Tries It

- **Runtime**: Local Node.js environment (`Node >= 18.17.0`).
- **Environment Configuration**:
  - Copy `.env.example` to `.env.local`
  - Set `GEMINI_API_KEY="your-gemini-api-key"`
- **Start Command**:
  ```bash
  npm install
  npm run dev
  ```
- **What to Open**:
  - Open `http://localhost:3000` in any modern web browser.
- **Hackathon Video & Repo Verification**:
  - The entire 60–90 second workflow can be recorded directly on `http://localhost:3000`.
  - Deployment is optional (Vercel one-click deploy supported via environment variable configuration).

---

## 5. Look and Feel (Design System Specification)

Carried forward from `prd.md > 3. Look and Feel` and `scope.md > Inspiration & Identity`:

- **Color Tokens**:
  - `--bg-canvas`: `#070d19` (Deep Cosmic Navy)
  - `--bg-surface`: `#0f172a` (Translucent Slate Navy, `rgba(15, 23, 42, 0.85)`)
  - `--bg-surface-elevated`: `rgba(30, 41, 59, 0.9)`
  - `--border-glow`: `rgba(56, 189, 248, 0.25)`
  - `--text-primary`: `#f8fafc`
  - `--text-secondary`: `#94a3b8`
  - `--accent-cyan`: `#38bdf8` (Primary actions, rule pills, active borders)
  - `--accent-violet`: `#c084fc` (What-If Lab, counterfactual highlights)
  - `--accent-amber`: `#f59e0b` (Pivotal conflicts, faction alerts)
  - `--accent-emerald`: `#10b981` (Baseline confirmation, success states)
  - `--accent-rose`: `#f43f5e` (High-stakes penalties, error alerts)
- **Typography**:
  - System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) for crisp, modern legibility.
  - Monospace font (`ui-monospace, "SF Mono", Consolas, monospace`) for entity IDs (`char_1`, `rule_2`) and causal chain arrows.
- **Micro-Interactions**:
  - Glowing 1px borders that intensify on card hover.
  - Smooth 200ms cubic-bezier transitions on tab shifts and drawer expansion.
  - Causal chain connectors with animated glowing pulse during simulation.

---

## 6. Components

Grouped by studio functional zones. Each maps to specific PRD behaviors:

### 6.1 `HeaderNav`
- **Responsibility**: Displays branding, active world status indicator, "New World" button, and "Reset Simulation" shortcut.
- **Talks to**: Root Studio State.
- **PRD Ref**: Implements `prd.md > 2. Screens and Layout`.

### 6.2 `PremiseHero`
- **Responsibility**: Provides the custom premise input bar and 3 quick-start preset chips (*Solar Kingdom*, *Clockwork Cities*, *Archipelago*). Disables during generation and shows loading status.
- **Talks to**: `api/generate-world`.
- **PRD Ref**: Implements `prd.md > 4.1 Premise Input & Quick-Start Presets`.

### 6.3 `WorldExplorer` (The 5-Domain Workspace)
- **Responsibility**: Renders the baseline world across 5 interactive domains:
  - `OverviewCard`
  - `CharacterGrid` (3–4 cards with motivation & faction badges)
  - `FactionGrid` (2–3 cards with power sources & rivalries)
  - `LocationGrid` (2–3 cards with strategic ties)
  - `RuleList` (3–4 cards with rule statements & select button)
- **Talks to**: `WhatIfLab` (passes selected rule).
- **PRD Ref**: Implements `prd.md > 4.2 The 5 Structured World Domains`.

### 6.4 `WhatIfLab`
- **Responsibility**: Interactive experiment drawer. Displays selected baseline rule, provides editable counterfactual textarea, and triggers "Simulate Consequences".
- **Talks to**: `api/simulate-consequences`.
- **PRD Ref**: Implements `prd.md > 4.3 The What-If Lab (Rule Alteration)`.

### 6.5 `ConsequenceView`
- **Responsibility**: Displays the side-by-side comparison:
  - Top bar: Baseline Rule vs. Counterfactual Rule.
  - Macro Shift summary banner.
  - Consequence cards for Characters, Factions, and Locations with explicit causal chain badges:
    `[Changed Rule] → [Immediate Effect] → [Entity Consequence]`
  - "Reset to Baseline" button.
- **Talks to**: Root Studio State.
- **PRD Ref**: Implements `prd.md > 4.4 AI-Generated Consequence Reasoning & Side-by-Side Comparison`.

### 6.6 `ErrorBanner`
- **Responsibility**: Accessible alert bar displaying honest, transparent error messages (API key missing, quota exceeded, network drop) with a "Retry" button.
- **Talks to**: Root Studio State.
- **PRD Ref**: Implements `prd.md > 4.6 Honest Error & Fallback Handling`.

---

## 7. Data Model & Type Definitions

Defined in `src/types/world.ts`:

```typescript
// 1. Five World Domains
export interface WorldOverview {
  name: string;
  premise_summary: string;
  core_conflict: string;
  defining_theme: string;
}

export interface CharacterEntity {
  id: string; // e.g., "char_1"
  name: string;
  role: string;
  motivation: string;
  faction_allegiance: string; // matches a FactionEntity.name or id
  connection_to_rule: string;
}

export interface FactionEntity {
  id: string; // e.g., "fac_1"
  name: string;
  agenda: string;
  power_source: string;
  rivalry: string; // matches another FactionEntity.name
  territory: string;
}

export interface LocationEntity {
  id: string; // e.g., "loc_1"
  name: string;
  environment: string;
  strategic_value: string;
  connection_to_rule: string;
}

export interface WorldRuleEntity {
  id: string; // e.g., "rule_1"
  name: string;
  rule_statement: string;
  systemic_importance: string;
}

export interface WorldModel {
  overview: WorldOverview;
  characters: CharacterEntity[];
  factions: FactionEntity[];
  locations: LocationEntity[];
  rules: WorldRuleEntity[];
}

// 2. Consequence Cascade Model with Strict Causal Chain
export interface EntityConsequence {
  entity_id: string; // matches CharacterEntity.id, FactionEntity.id, or LocationEntity.id
  entity_name: string;
  immediate_effect: string; // Step 2: What directly happens due to the rule change
  causal_reasoning: string; // Step 3: Explicit "Because [rule change] led to [immediate effect], [entity consequence]"
  status_or_power_shift: string; // e.g. "Ascendant", "Compromised", "Midnight War Zone"
}

export interface SimulationResult {
  changed_rule_id: string;
  original_rule_statement: string;
  counterfactual_rule: string;
  macro_shift_summary: string;
  character_impacts: EntityConsequence[];
  faction_impacts: EntityConsequence[];
  location_impacts: EntityConsequence[];
}

// 3. Application Session State
export interface StudioState {
  status: 'empty' | 'generating-world' | 'world-active' | 'simulating' | 'comparison-active' | 'error';
  baselineWorld: WorldModel | null;       // Immutable once generated
  selectedRuleId: string | null;
  counterfactualRuleInput: string;
  simulationResult: SimulationResult | null;
  errorMessage: string | null;
}
```

### State Storage & Lifecycle
- **Where it lives**: React client-side memory (`StudioState` in root component or state context).
- **Updates**:
  - `generateWorld()` sets `baselineWorld` and sets `status = 'world-active'`.
  - `simulateConsequences()` sets `simulationResult` and sets `status = 'comparison-active'`.
  - `resetToBaseline()` clears `simulationResult = null` and sets `status = 'world-active'` without modifying `baselineWorld`.
- **Persistence**: Session in-memory. Reloading the page returns to the clean empty state. (Per agreed POC boundary, no cloud database is required).

---

## 8. File Structure

Planned application architecture:

```
StoryWorldArchitect-Hackathon/
├── devpost/                         # Devpost Learn Hackathon documentation
│   ├── learner-profile.md           # Learner preferences and background
│   ├── scope.md                     # Approved scope document (source of truth)
│   ├── scope.html                   # Scope visual companion
│   ├── prd.md                       # Approved PRD
│   ├── prd.html                     # PRD visual companion
│   ├── spec.md                      # Technical specification (this document)
│   ├── spec.html                    # Spec visual companion
│   └── checklist.md                 # Build verification checklist (created in 5-build)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-world/
│   │   │   │   └── route.ts         # Server-side Gemini API call for 5-domain world
│   │   │   └── simulate-consequences/
│   │   │       └── route.ts         # Server-side Gemini API call for causal simulation
│   │   ├── globals.css              # Dark navy design system, tokens, and animations
│   │   ├── layout.tsx               # Root HTML shell with metadata and Google Fonts
│   │   └── page.tsx                 # Main StoryWorld Architect studio page
│   ├── components/
│   │   ├── HeaderNav.tsx            # Header, world title, and reset actions
│   │   ├── PremiseHero.tsx          # Premise input bar and quick-start preset chips
│   │   ├── WorldExplorer.tsx        # 5-domain cards display (Overview, Chars, Factions, Locs, Rules)
│   │   ├── WhatIfLab.tsx            # Rule modification drawer and simulate trigger
│   │   ├── ConsequenceView.tsx      # Side-by-side comparison and causal chain cards
│   │   └── ErrorBanner.tsx          # Honest error message bar with retry button
│   ├── lib/
│   │   ├── gemini.ts                # Server-side Gemini client helper
│   │   ├── presets.ts               # Quick-start preset world definitions
│   │   └── validation.ts            # Runtime JSON schema and entity ID validators
│   └── types/
│       └── world.ts                 # TypeScript interfaces for worlds and consequences
├── .env.example                     # Sample environment variable template
├── .gitignore                       # Standard Next.js and API key ignores
├── package.json                     # Next.js, React, TypeScript dependencies
├── tsconfig.json                    # TypeScript compiler configuration
└── README.md                        # Setup and hackathon demonstration instructions
```

---

## 9. External Services and Dependencies

### 9.1 Google Gemini API
- **Model**: `gemini-3.8-flash`.
- **Authentication**: `GEMINI_API_KEY` stored in `.env.local` and processed only on the Next.js server.
- **Endpoints Used**:
  - `generateContent` via SDK / REST API.
  - `responseMimeType: "application/json"` with structured schema enforcement.
- **Rate Limits & Cost**: Free tier / Developer tier is ample for hackathon demonstration (15 RPM / 1,500 RPD).
- **Documentation**: [https://ai.google.dev/docs](https://ai.google.dev/docs)

### 9.2 API Contracts

#### Route 1: `POST /api/generate-world`
- **Request Body**:
  ```json
  { "premise": "A kingdom where magic is powered by sunlight..." }
  ```
- **Validation**: `premise` must be a string with `length >= 10`.
- **Response**: `200 OK` with JSON matching `WorldModel` interface (Overview, 3–4 Characters, 2–3 Factions, 2–3 Locations, 3–4 Rules).
- **Error Response**: `400 Bad Request` (invalid input) or `500 Internal Server Error` (API failure, timeout, quota).

#### Route 2: `POST /api/simulate-consequences`
- **Request Body**:
  ```json
  {
    "baselineWorld": { /* WorldModel */ },
    "changedRuleId": "rule_1",
    "newRuleText": "Magic also works at night, but drains memories."
  }
  ```
- **Validation**: `changedRuleId` must exist in `baselineWorld.rules`; `newRuleText` must not be empty.
- **Response**: `200 OK` with JSON matching `SimulationResult` interface containing the 3-step causal chain (`immediate_effect` → `causal_reasoning`).
- **Error Response**: `400 Bad Request` or `500 Internal Server Error`.

---

## 10. Important Failure Modes and Fallbacks

1. **Missing or Invalid Gemini API Key**:
   - *Failure*: Server cannot authenticate with Gemini API.
   - *Fallback*: Route immediately returns a clean `500` error: `"GEMINI_API_KEY is missing or invalid. Please check your .env.local file."` The UI displays this honestly in the `ErrorBanner` without leaking secrets or internal stack traces. `.env.local` is strictly excluded from Git.
2. **AI Generates Malformed or Incomplete JSON**:
   - *Failure*: Response fails schema validation, misses required fields, has invalid entity ID references, or incomplete causal reasoning.
   - *Fallback*: Server validates both world-generation and consequence-simulation responses at runtime through `validation.ts` (checking required fields, array counts: 3–4 characters, 2–3 factions, 2–3 locations, 3–4 rules, unique IDs, valid foreign entity references, and complete causal chains). If invalid, returns a clean diagnostic error and enables retry.
3. **API Rate Limit / Network Timeout**:
   - *Failure*: Network drops or Gemini takes longer than expected or returns a 429 quota error (under-2-second response is a performance target, not a hard guarantee).
   - *Fallback*: Includes animated loading states, timeout handling, and `ErrorBanner` displaying clear diagnostic feedback with a "Retry" button.
4. **No Silent Fake Data**:
   - The application strictly refuses to return fake static data disguised as a live simulation response. If an error occurs, it is communicated honestly.

---

## 11. What Was Simplified and Why

- **In-Memory Session State instead of PostgreSQL / Supabase**:
  - *Why*: Eliminates database hosting, table migrations, and network latency. The hackathon demo focuses on live world creation and rule mutation in a single 60–90 second flow.
- **Single Rule Modification instead of Multi-Rule Combinations**:
  - *Why*: Modifying one foundational rule produces clear, isolate-able causal consequences that a human reviewer can verify instantly. Multi-rule simultaneous mutations cause combinatorial chaos and make causal attribution murky.
- **Single-Page Studio Workbench instead of Multi-Page Routing**:
  - *Why*: Keeps the creator's mental model intact. When simulating consequences, seeing the baseline rules on the same screen reinforces the before-and-after contrast.

---

## 12. Decisions and Open Issues

### Key Architectural Decisions:
1. **Delta Prompting with Typed Causal Chains**:
   - *Decision*: Rather than asking the LLM to rewrite the entire world, we pass the baseline entities and prompt the LLM to output only the causal delta (`immediate_effect` → `causal_reasoning`) for referenced entity IDs.
   - *Reason*: Saves token cost, drops latency from ~6s to ~1.8s, and guarantees that unchanged entities remain stable.
2. **Immutable Baseline State & Network-Free Reset**:
   - *Decision*: Store `baselineWorld` in React state as a read-only snapshot.
   - *Reason*: Guarantees a network-free client-side reset with zero API cost and zero network calls.
3. **Server-Side Secret Management via Next.js Route Handlers**:
   - *Decision*: All AI calls go through `/api/*` endpoints rather than calling Gemini directly from the client.
   - *Reason*: Protects API credentials from browser inspection, ensures `.env.local` remains gitignored, and allows server-side schema validation without leaking internal stack traces.

### Genuine Learner Uncertainty Clarified:
- **Learner Question**: *"How do we guarantee that an LLM actually performs counterfactual causal reasoning rather than just hallucinating random fantasy trivia?"*
- **Clarification & Architecture Solution**:
  We solve this by enforcing a **two-tier prompt and schema constraint**:
  1. We feed the LLM the exact baseline entity IDs (`char_1`, `fac_2`) and the specific rule ID (`rule_1`).
  2. In the JSON schema for consequences, we enforce a mandatory intermediate field: `immediate_effect` followed by `causal_reasoning`. The prompt explicitly requires the chain:
     $$\text{Rule Change} \longrightarrow \text{Immediate Physical/Social Mechanism} \longrightarrow \text{Specific Entity Outcome}$$
  By forcing the model to generate the intermediate systemic mechanism before writing the character's reaction, the LLM's autoregressive reasoning is anchored in causality.

### Open Questions:
- *None blocking build*: Stack, schemas, API routes, components, and error boundaries are fully locked.
