// 5-Domain Structured World Types

export interface WorldOverview {
  name: string;
  premise_summary: string;
  core_conflict: string;
  defining_theme: string;
}

export interface CharacterEntity {
  id: string; // e.g. "char_1"
  name: string;
  role: string;
  motivation: string;
  faction_allegiance: string;
  connection_to_rule: string;
}

export interface FactionEntity {
  id: string; // e.g. "fac_1"
  name: string;
  agenda: string;
  power_source: string;
  rivalry: string;
  territory: string;
}

export interface LocationEntity {
  id: string; // e.g. "loc_1"
  name: string;
  environment: string;
  strategic_value: string;
  connection_to_rule: string;
}

export interface WorldRuleEntity {
  id: string; // e.g. "rule_1"
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

// 3-Step Causal Chain Consequence Types
export interface EntityConsequence {
  entity_id: string; // references CharacterEntity.id, FactionEntity.id, or LocationEntity.id
  entity_name: string;
  immediate_effect: string; // Step 2: What directly happens due to the rule change
  causal_reasoning: string; // Step 3: Explicit "Because [rule change] led to [immediate effect], [consequence]"
  status_or_power_shift: string; // e.g., "Ascendant", "Disrupted", "Midnight Battleground"
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

// Studio Application State
export type StudioStatus = 
  | 'empty' 
  | 'generating-world' 
  | 'world-active' 
  | 'simulating' 
  | 'comparison-active' 
  | 'error';

export interface PresetWorld {
  id: string;
  title: string;
  tagline: string;
  premise: string;
  previewTags: string[];
}
