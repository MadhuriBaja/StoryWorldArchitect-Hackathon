---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Next.js Foundation & AI Integration Proof**
  Becomes usable: A running Next.js application with the approved dark-navy foundation where submitting a premise (or selecting a preset) calls our secure server-side Gemini API route (`/api/generate-world`), validates the response at runtime, and renders a structured 5-domain world (Overview, Characters, Factions, Locations, Rules).
  Why now: Risk first and bootstrapping together. Sets up Next.js, TypeScript, `.gitignore`, server-side secret handling with `.env.local`, and proves that Gemini returns valid structured 5-domain JSON matching our runtime validator before building downstream features.
  PRD ref: `prd.md > 4.1 Premise Input & Quick-Start Presets`, `prd.md > 4.2 The 5 Structured World Domains`
  Spec ref: `spec.md > 3. Stack`, `spec.md > 7. Data Model & Type Definitions`, `spec.md > 8. File Structure`, `spec.md > 9. External Services and Dependencies`
  Build: Scaffold Next.js + React + TypeScript in the project root, configure `.gitignore` (ignoring `.env.local` and `devpost/learner-profile.md`), create `.env.example`, implement `src/types/world.ts`, `src/lib/gemini.ts`, `src/lib/validation.ts`, `src/lib/presets.ts`, `src/app/api/generate-world/route.ts`, and the initial studio UI with `PremiseHero` and `WorldExplorer`.
  Verify (mechanical): Run TypeScript compiler check (`npx tsc --noEmit`), test the `/api/generate-world` route against a valid premise prompt (minimum 10 characters), and verify that 5 structured domains render with valid entity links.
  Learner check: Start the dev server (`npm run dev`), open `http://localhost:3000`, click the preset "Solar Kingdom of Solaria" (or type a custom premise of at least 10 characters), click "Architect World", and confirm that the 5 domains populate with glowing cards.
  Commit: `feat: scaffold Next.js studio and implement structured 5-domain world generation`

- [ ] **2. What-If Counterfactual Lab & Causal Simulation Engine**
  Becomes usable: The creator can select any world rule in the What-If Lab, edit it into a counterfactual hypothesis, click "Simulate Consequences", and receive genuine AI-generated ripple effects across characters, factions, and locations following the 3-step causal bridge (`changed_rule` → `immediate_effect` → `causal_reasoning`).
  Why now: The unique kernel comes early, not last. Proves the counterfactual simulation thesis and verifies delta prompting with runtime schema validation against the live Gemini model.
  PRD ref: `prd.md > 4.3 The What-If Lab (Rule Alteration)`, `prd.md > 4.4 AI-Generated Consequence Reasoning & Side-by-Side Comparison`
  Spec ref: `spec.md > 6.4 WhatIfLab`, `spec.md > 7. Data Model & Type Definitions`, `spec.md > 9.2 API Contracts (Route 2)`
  Build: Implement `src/components/WhatIfLab.tsx` drawer/workbench, server-side route `src/app/api/simulate-consequences/route.ts` with delta prompt and strict causal chain validation, and wire simulation state into `src/app/page.tsx`.
  Verify (mechanical): Send a test simulation request with modified rule against baseline entities, verifying that `immediate_effect` and `causal_reasoning` fields exist and referenced entity IDs match baseline entities.
  Learner check: In the running app, select a rule, edit it in the What-If Lab (e.g. magic works at night but drains memory), click "Simulate Consequences", and confirm that causal explanation cards appear detailing why characters and factions reacted.
  Commit: `feat: implement What-If Lab and counterfactual causal simulation engine`

- [ ] **3. Side-by-Side Comparison, Network-Free Reset, and Honest Error Handling**
  Becomes usable: A complete side-by-side comparison view (Baseline Rule vs. Counterfactual Rule with macro shift summary and highlighted entity tags), network-free client-side "Reset to Baseline" button restoring the immutable snapshot, and an `ErrorBanner` providing transparent feedback and retry mechanisms without leaking secrets.
  Why now: Closes the full loop from premise to simulation to comparison to reset, fulfilling all acceptance criteria for a bulletproof 60–90 second demonstration.
  PRD ref: `prd.md > 4.4 AI-Generated Consequence Reasoning & Side-by-Side Comparison`, `prd.md > 4.5 Reset & Hypothesis Iteration`, `prd.md > 4.6 Honest Error & Fallback Handling`
  Spec ref: `spec.md > 6.5 ConsequenceView`, `spec.md > 6.6 ErrorBanner`, `spec.md > 10. Important Failure Modes and Fallbacks`
  Build: Implement `src/components/ConsequenceView.tsx` with side-by-side comparison, `src/components/ErrorBanner.tsx` with friendly diagnostics and retry, client-side immutable baseline preservation and instant reset logic in `src/app/page.tsx`, and polished CSS transitions matching the dark-navy and cyan/violet design system.
  Verify (mechanical): Simulate a rule change, click "Reset to Baseline" and verify that baseline data is restored without network requests (network-free operation); test error handling with an invalid input or simulated network failure to confirm error banner and retry behavior.
  Learner check: Run through the complete 60–90s demo flow: Generate a world from a preset → inspect the 5 domains → edit a rule in What-If Lab → simulate consequences → review side-by-side comparison → click "Reset to Baseline" to verify instant restoration.
  Commit: `feat: add side-by-side comparison, network-free reset, and honest error handling`

## Hands-on Checkpoints

- [x] Early usable behavior explored — Slice 1 complete: 5-domain world generation tested with live Gemini API
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions

