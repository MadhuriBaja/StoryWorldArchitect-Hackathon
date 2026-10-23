---
doc: prd
status: approved
---

# StoryWorld Architect — Product Requirements Document

**One-line summary**: An interactive AI-powered worldbuilding laboratory and simulation engine where creators input a fictional premise, explore an interconnected world across 5 structured domains, modify a foundational rule, and discover causally-explained downstream consequences through a side-by-side comparison.
**Source**: [devpost/scope.md](file:///c:/Users/Madhuri/StoryWorldArchitect-Hackathon/devpost/scope.md)

---

## 1. The Core Journey

The end-to-end user path is designed to be demonstrated completely in 60 to 90 seconds with zero friction:

1. **Arrival & Premise Entry**: The creator arrives at the StoryWorld Architect studio. They see an inspiring premise hero with a prompt input and 3 instant quick-start preset chips (e.g., *"Solar Magic Kingdom"*, *"Subterranean Clockwork Cities"*, *"Archipelago of Drifting Continents"*).
2. **World Generation**: The creator types a premise or clicks a preset, then clicks **"Architect World"**. An engaging loading state signals that the world entities and systemic rules are being synthesized.
3. **World Inspection (The 5 Domains)**: The studio reveals the generated baseline world structured across 5 organized cards/tabs:
   - **World Overview** (core theme, premise summary, central conflict)
   - **Characters** (3–4 key figures with motivations and faction ties)
   - **Factions** (2–3 rival organizations with goals and power bases)
   - **Locations** (2–3 key regions tied to world mechanics)
   - **World Rules** (3–4 fundamental physical, magical, or societal laws)
4. **Entering the What-If Lab**: The creator opens the What-If Lab workbench panel. They select one specific rule (e.g., *"Magic is fueled exclusively by direct sunlight"*).
5. **Rule Modification**: The creator edits the selected rule into a counterfactual rule (e.g., *"Magic also works in darkness, but consuming it steadily erases the caster's personal memories"*).
6. **Simulate Consequences**: The creator clicks **"Simulate Consequences"**. An animated simulation pulse indicates causal propagation across the world graph.
7. **Compare & Discover**: A side-by-side before-and-after view appears:
   - Original Rule vs. Counterfactual Rule
   - Overall Causal Narrative Summary
   - Consequence Cards across Characters, Factions, and Locations, each explicitly explaining **why** the altered rule triggered that specific ripple effect.
8. **Reset or Iterate**: The creator can either click **"Reset to Baseline"** to immediately restore the untouched original world, or modify another rule to test a different hypothesis.

---

## 2. Screens and Layout

StoryWorld Architect is structured as a **single-surface, high-efficiency studio workbench** to ensure zero navigation lag and keep context visible:

- **Top Navigation & Status Bar**:
  - Application title, active world badge, and connection/status indicator.
  - Action controls: "New World", "Export Summary", "Reset Simulation".
- **Hero / Premise Control Bar**:
  - Expands when no world is loaded or when "New World" is clicked.
  - Compact premise input bar with "Architect World" action button.
  - Quick-start preset buttons for 1-click live demos.
- **Main World Explorer Workspace (5-Domain Gallery)**:
  - Responsive multi-card grid or tabbed explorer presenting the 5 domains.
  - High-contrast visual hierarchy: World Overview banner, followed by interconnected entity cards.
  - Entity cards display tags linking them to related factions and rules.
- **The What-If Lab (Interactive Drawer / Docked Panel)**:
  - Rule selector dropdown or interactive rule card selector.
  - Side-by-side or stacked rule transformation box:
    - Left/Top: Original Rule (read-only baseline).
    - Right/Bottom: Counterfactual Rule (editable text area with clear placeholder guidance).
  - Primary action: **"Simulate Consequences"** button with glowing accent.
- **Consequence Cascade View**:
  - Side-by-side before/after comparison display.
  - Causal chain callout banner explaining the macroeconomic/narrative shift.
  - Highlighted impact badges on affected character, faction, and location cards.

---

## 3. Look and Feel

Guided by the approved scope and learner profile:
- **Foundational Canvas**: Deep, immersive dark navy (`#070d19` to `#0f172a`) creating an atmospheric creative laboratory atmosphere.
- **Accent Color System**:
  - **Electric Cyan** (`#38bdf8`): Primary action triggers, world rule tags, and input highlights.
  - **Arcane Violet / Purple** (`#c084fc`): What-If Lab highlights, magical/thematic consequence ripples.
  - **Solar Amber** (`#f59e0b`): Warning notes, pivotal conflict points, and faction rivalry tags.
  - **Verdant Emerald** (`#10b981`): Success indicators, baseline integrity badges, and confirmed state.
  - **Crimson Rose** (`#f43f5e`): High-stakes consequences, memory drain penalties, and error alerts.
- **Cards & Surfaces**: Semi-transparent dark cards (`rgba(15, 23, 42, 0.85)`) with subtle glowing borders (`1px solid rgba(56, 189, 248, 0.25)`), smooth backdrop blurs, and hover micro-elevations.
- **Typography**: Clean, highly readable modern sans-serif (Inter / system UI) for descriptions, paired with crisp monospaced labels for rule IDs and causal links.

---

## 4. Features, Behaviors & Structured Data Specifications

Source: `scope.md > The Core Loop`, `scope.md > Measurable Acceptance Criteria`, and `scope.md > The POC Boundary`.

### 4.1 Premise Input & Quick-Start Presets
- **Description**: Allows a creator to type an open-ended narrative premise or select a pre-configured scenario.
- **Presets Included**:
  1. *Solar Kingdom of Solaria*: A realm where magic is channeled exclusively from sunlight, creating strict daylight-dependent caste hierarchies.
  2. *The Subterranean Clockwork Cities*: A subterranean civilization powered by geothermal steam springs where surface contact is strictly forbidden.
  3. *The Archipelago of Drifting Continents*: Sky islands tethered by magnetic gravity stones, contested by sky-pirate fleets and guild navigators.
- **Acceptance Criteria**:
  - [ ] Clicking any preset automatically fills the premise text input and triggers generation or readies the prompt.
  - [ ] Input validates that prompt length is at least 10 characters before triggering generation.
  - [ ] A clear loading animation and status message are shown while generation is in progress.

### 4.2 The 5 Structured World Domains
The generated world must strictly adhere to the following schema across 5 domains:

#### Domain 1: World Overview
- `name`: String (Name of the world or realm).
- `premise_summary`: String (2–3 sentences summarizing the fundamental nature of this setting).
- `core_conflict`: String (The primary tension driving this world).
- `defining_theme`: String (e.g., *"Resource scarcity meets solar devotion"*).

#### Domain 2: Characters (3–4 Entities)
Each character must contain:
- `id`: String (e.g., `char_1`).
- `name`: String (Character name and title).
- `role`: String (e.g., *"High Sun-Priestess"*, *"Shadow Smuggler"*).
- `motivation`: String (Core desire or personal objective).
- `faction_allegiance`: String (References one of the world's factions).
- `connection_to_rule`: String (How this character relies on or is restricted by one of the world rules).

#### Domain 3: Factions (2–3 Entities)
Each faction must contain:
- `id`: String (e.g., `fac_1`).
- `name`: String (Faction name).
- `agenda`: String (Primary geopolitical or ideological goal).
- `power_source`: String (How they derive authority, wealth, or power).
- `rivalry`: String (References a competing faction or external threat).
- `territory`: String (Primary location or stronghold).

#### Domain 4: Locations (2–3 Entities)
Each location must contain:
- `id`: String (e.g., `loc_1`).
- `name`: String (Location name).
- `environment`: String (Physical and atmospheric description).
- `strategic_value`: String (Why factions fight over it).
- `connection_to_rule`: String (How world laws physically manifest in this place).

#### Domain 5: World Rules (3–4 Entities)
Each rule must contain:
- `id`: String (e.g., `rule_1`).
- `name`: String (Short title, e.g., *"Solar Magic Dependency"*).
- `rule_statement`: String (Clear physical, mystical, or legal law, e.g., *"Magic can only be channeled while standing in direct sunlight"*).
- `systemic_importance`: String (Why the world would break or radically change if this rule changed).

**Domain Acceptance Criteria**:
- [ ] Generates exactly 3–4 characters, 2–3 factions, 2–3 locations, and 3–4 rules.
- [ ] Interconnected references exist between domains (characters cite factions; locations cite rules).
- [ ] Cards display structured badges for easy visual scanning.

### 4.3 The What-If Lab (Rule Alteration)
- **Description**: The core interactive experimentation workbench where one rule is isolated and modified.
- **Behavior**:
  - The creator selects any one of the 3–4 world rules.
  - The UI displays the selected rule's baseline statement.
  - An editable textarea allows the creator to rewrite or tweak that rule.
  - The **"Simulate Consequences"** button triggers the counterfactual inference.
- **Acceptance Criteria**:
  - [ ] The original baseline rule statement remains visible for direct comparison.
  - [ ] Modified rule text cannot be empty or identical to the original rule.
  - [ ] Baseline world data remains immutably preserved in memory during simulation.

### 4.4 AI-Generated Consequence Reasoning & Side-by-Side Comparison
- **Description**: The simulation engine analyzes the counterfactual rule and generates a structured cascade of consequences.
- **Consequence Data Specification**:
  - `counterfactual_rule`: String (The new rule as modified by the creator).
  - `macro_shift_summary`: String (A concise 2-sentence explanation of how the world's power balance shifted).
  - `character_impacts`: Array of 2–3 items:
    - `character_id`: String (References the affected character).
    - `character_name`: String.
    - `change_summary`: String (How their role or status altered).
    - `causal_reasoning`: String (Explicit explanation: *"Because magic now works at night, they are no longer defenseless after dusk..."*).
  - `faction_impacts`: Array of 2 items:
    - `faction_id`: String.
    - `faction_name`: String.
    - `power_shift`: String (e.g., *"Ascendant"*, *"Weakened"*, *"Destabilized"*).
    - `causal_reasoning`: String (Explicit explanation connecting rule change to faction trajectory).
  - `location_impacts`: Array of 2 items:
    - `location_id`: String.
    - `location_name`: String.
    - `status_change`: String (e.g., *"Turned into a midnight warzone"*).
    - `causal_reasoning`: String (Explicit explanation connecting rule change to environmental or geopolitical shift).
- **Acceptance Criteria**:
  - [ ] Displays a side-by-side or clearly demarcated comparison of Baseline vs. Simulated World.
  - [ ] Every character, faction, and location consequence includes explicit, transparent causal reasoning.
  - [ ] Consequence impacts clearly flag the entities that were updated.

### 4.5 Reset & Hypothesis Iteration
- **Description**: Allows instant reversion to baseline or testing another rule change.
- **Behavior**:
  - Clicking **"Reset to Baseline"** reverts the view to the pristine initial world state instantly.
  - Clicking **"Modify Another Rule"** preserves the baseline world and lets the creator choose a different rule.
  - Clicking **"New World"** clears the current world and returns to the premise entry hero.
- **Acceptance Criteria**:
  - [ ] Reset operates client-side instantly with zero network delay.
  - [ ] Original baseline world data is completely unaffected by prior simulations.

### 4.6 Honest Error & Fallback Handling
- **Description**: Transparent communication when an AI inference or network error occurs.
- **Behavior**:
  - If an API key is missing, invalid, or an API call fails (rate limit, network loss, model timeout), the app surfaces an honest error banner detailing the issue.
  - An explicit **"Retry"** button is provided.
  - The app never silently substitutes fake simulated consequences while claiming they are live AI outputs.
- **Acceptance Criteria**:
  - [ ] Errors display user-friendly diagnostic guidance (e.g., *"API connection timed out. Please check your network or try again."*).
  - [ ] UI stays responsive and does not crash or leave the user stuck on an infinite spinner.

---

## 5. States and Boundaries

- **State 1: Initial Empty State**:
  - User arrives. No world loaded.
  - Clean premise input hero with 3 quick-start preset chips.
  - Explorer workspace displays an inviting empty state previewing the 5 domains.
- **State 2: World Generating State**:
  - Premise locked; submit button displays loading spinner and progress label.
  - Subtle pulse animation on workspace cards.
- **State 3: World Active (Baseline State)**:
  - 5 domain cards fully populated.
  - What-If Lab ready for rule selection.
  - Consequence panel hidden or in ready standby.
- **State 4: Simulating Consequences State**:
  - Rule input locked; "Simulate Consequences" button shows active computing state.
- **State 5: Consequence Active (Comparison State)**:
  - Dual-state view active (Original Rule vs. New Rule).
  - Causal consequence cards displayed with prominent impact badges.
  - "Reset to Baseline" and "Test Another Rule" buttons visible.
- **State 6: Error State**:
  - Accessible banner indicating network/API failure with retry button.

---

## 6. Product Decisions

1. **Single Studio Workbench vs. Multi-Page Navigation**:
   - *Decision*: A unified single-page layout with smooth card transitions.
   - *Reason*: Eliminates page reload latency and keeps world context continuously visible during rule alterations.
2. **Fixed 5-Domain Structure vs. Freeform Prose**:
   - *Decision*: Strictly enforce 5 structured domains (Overview, Characters, Factions, Locations, Rules).
   - *Reason*: Freeform lore creates unstructured walls of text that make downstream consequence comparison subjective and hard to scan. Structured cards make ripple effects instantly recognizable.
3. **Explicit Causal Link Requirement**:
   - *Decision*: Every consequence object must contain an explicit `causal_reasoning` string explaining *why* the consequence happened.
   - *Reason*: Distinguishes StoryWorld Architect from random story generators and makes the simulation thesis transparent to judges.
4. **Client-Side Baseline Caching**:
   - *Decision*: Store the baseline world in memory and only send the delta (baseline entities + modified rule) to the simulation prompt.
   - *Reason*: Ensures instantaneous reset with zero extra API cost, and keeps the LLM focused on evaluating the delta rather than re-inventing the world.

---

## 7. What We're Building (The POC Finish Line)
- Single premise input with 3 quick-start presets.
- Structured world generator delivering 5 interconnected domains.
- What-If Lab workbench with single-rule editor.
- Causal consequence simulation engine with explicit reasoning strings.
- Side-by-side before-and-after comparison view with visual impact tags.
- Instant client-side reset and iteration.
- Transparent error feedback and retry mechanisms.

---

## 8. Deferred From the POC
- **Multi-step historical timelines**: Simulating consequences across generations.
- **AI-suggested rule twist chips**: Automated "what-if" idea generators.
- **Exporting dossiers**: Generating formatted Markdown or PDF world books.
- **Interactive 2D relationship map**: Visual node-link entity graphs.

---

## 9. Non-Goals
- No user accounts or login screens (distracts from the 1-minute demo).
- No cloud database persistence (in-memory session state is sufficient and faster to test).
- No multiplayer world editing.
- No 3D renderings or heavy graphics.
- No unbounded novel-length text generation.

---

## 10. Open Questions
- *None blocking spec approval*: The 5 domains, consequence schema, interaction states, and error handling are fully defined and sized for a 2–4 hour build.
