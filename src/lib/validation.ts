import { WorldModel, SimulationResult, CharacterEntity, FactionEntity, LocationEntity, WorldRuleEntity, EntityConsequence } from '@/types/world';

export interface ValidationResult<T> {
  valid: boolean;
  errors: string[];
  sanitized?: T;
}

/**
 * Validates generated 5-domain world models against strict schema and relationship rules.
 */
export function validateWorldModel(data: any): ValidationResult<WorldModel> {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Response is not a valid JSON object'] };
  }

  // 1. Overview validation
  if (!data.overview || typeof data.overview !== 'object') {
    errors.push('Missing or invalid "overview" object');
  } else {
    if (!data.overview.name || typeof data.overview.name !== 'string') errors.push('Overview missing "name"');
    if (!data.overview.premise_summary || typeof data.overview.premise_summary !== 'string') errors.push('Overview missing "premise_summary"');
    if (!data.overview.core_conflict || typeof data.overview.core_conflict !== 'string') errors.push('Overview missing "core_conflict"');
    if (!data.overview.defining_theme || typeof data.overview.defining_theme !== 'string') errors.push('Overview missing "defining_theme"');
  }

  // 2. Characters validation (3 to 4 required)
  const charIds = new Set<string>();
  if (!Array.isArray(data.characters)) {
    errors.push('"characters" must be an array');
  } else {
    if (data.characters.length < 3 || data.characters.length > 4) {
      errors.push(`Expected 3-4 characters, got ${data.characters.length}`);
    }
    data.characters.forEach((c: any, index: number) => {
      const id = c?.id ? String(c.id).trim() : `char_${index + 1}`;
      if (charIds.has(id)) errors.push(`Duplicate character ID: ${id}`);
      charIds.add(id);

      if (!c?.name) errors.push(`Character at index ${index} missing "name"`);
      if (!c?.role) errors.push(`Character ${c?.name || index} missing "role"`);
      if (!c?.motivation) errors.push(`Character ${c?.name || index} missing "motivation"`);
      if (!c?.faction_allegiance) errors.push(`Character ${c?.name || index} missing "faction_allegiance"`);
      if (!c?.connection_to_rule) errors.push(`Character ${c?.name || index} missing "connection_to_rule"`);
    });
  }

  // 3. Factions validation (2 to 3 required)
  const factionIds = new Set<string>();
  const factionNames = new Set<string>();
  if (!Array.isArray(data.factions)) {
    errors.push('"factions" must be an array');
  } else {
    if (data.factions.length < 2 || data.factions.length > 3) {
      errors.push(`Expected 2-3 factions, got ${data.factions.length}`);
    }
    data.factions.forEach((f: any, index: number) => {
      const id = f?.id ? String(f.id).trim() : `fac_${index + 1}`;
      if (factionIds.has(id)) errors.push(`Duplicate faction ID: ${id}`);
      factionIds.add(id);
      if (f?.name) factionNames.add(String(f.name).toLowerCase());

      if (!f?.name) errors.push(`Faction at index ${index} missing "name"`);
      if (!f?.agenda) errors.push(`Faction ${f?.name || index} missing "agenda"`);
      if (!f?.power_source) errors.push(`Faction ${f?.name || index} missing "power_source"`);
      if (!f?.rivalry) errors.push(`Faction ${f?.name || index} missing "rivalry"`);
      if (!f?.territory) errors.push(`Faction ${f?.name || index} missing "territory"`);
    });
  }

  // 4. Locations validation (2 to 3 required)
  const locIds = new Set<string>();
  if (!Array.isArray(data.locations)) {
    errors.push('"locations" must be an array');
  } else {
    if (data.locations.length < 2 || data.locations.length > 3) {
      errors.push(`Expected 2-3 locations, got ${data.locations.length}`);
    }
    data.locations.forEach((l: any, index: number) => {
      const id = l?.id ? String(l.id).trim() : `loc_${index + 1}`;
      if (locIds.has(id)) errors.push(`Duplicate location ID: ${id}`);
      locIds.add(id);

      if (!l?.name) errors.push(`Location at index ${index} missing "name"`);
      if (!l?.environment) errors.push(`Location ${l?.name || index} missing "environment"`);
      if (!l?.strategic_value) errors.push(`Location ${l?.name || index} missing "strategic_value"`);
      if (!l?.connection_to_rule) errors.push(`Location ${l?.name || index} missing "connection_to_rule"`);
    });
  }

  // 5. Rules validation (3 to 4 required)
  const ruleIds = new Set<string>();
  if (!Array.isArray(data.rules)) {
    errors.push('"rules" must be an array');
  } else {
    if (data.rules.length < 3 || data.rules.length > 4) {
      errors.push(`Expected 3-4 rules, got ${data.rules.length}`);
    }
    data.rules.forEach((r: any, index: number) => {
      const id = r?.id ? String(r.id).trim() : `rule_${index + 1}`;
      if (ruleIds.has(id)) errors.push(`Duplicate rule ID: ${id}`);
      ruleIds.add(id);

      if (!r?.name) errors.push(`Rule at index ${index} missing "name"`);
      if (!r?.rule_statement) errors.push(`Rule ${r?.name || index} missing "rule_statement"`);
      if (!r?.systemic_importance) errors.push(`Rule ${r?.name || index} missing "systemic_importance"`);
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    sanitized: {
      overview: {
        name: String(data.overview.name).trim(),
        premise_summary: String(data.overview.premise_summary).trim(),
        core_conflict: String(data.overview.core_conflict).trim(),
        defining_theme: String(data.overview.defining_theme).trim(),
      },
      characters: data.characters.map((c: any, i: number) => ({
        id: c.id ? String(c.id).trim() : `char_${i + 1}`,
        name: String(c.name).trim(),
        role: String(c.role).trim(),
        motivation: String(c.motivation).trim(),
        faction_allegiance: String(c.faction_allegiance).trim(),
        connection_to_rule: String(c.connection_to_rule).trim(),
      })),
      factions: data.factions.map((f: any, i: number) => ({
        id: f.id ? String(f.id).trim() : `fac_${i + 1}`,
        name: String(f.name).trim(),
        agenda: String(f.agenda).trim(),
        power_source: String(f.power_source).trim(),
        rivalry: String(f.rivalry).trim(),
        territory: String(f.territory).trim(),
      })),
      locations: data.locations.map((l: any, i: number) => ({
        id: l.id ? String(l.id).trim() : `loc_${i + 1}`,
        name: String(l.name).trim(),
        environment: String(l.environment).trim(),
        strategic_value: String(l.strategic_value).trim(),
        connection_to_rule: String(l.connection_to_rule).trim(),
      })),
      rules: data.rules.map((r: any, i: number) => ({
        id: r.id ? String(r.id).trim() : `rule_${i + 1}`,
        name: String(r.name).trim(),
        rule_statement: String(r.rule_statement).trim(),
        systemic_importance: String(r.systemic_importance).trim(),
      })),
    }
  };
}

/**
 * Validates simulation results against the baseline world, checking foreign keys and causal chains.
 */
export function validateSimulationResult(data: any, baselineWorld: WorldModel): ValidationResult<SimulationResult> {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Simulation response is not a valid JSON object'] };
  }

  // Validate changed_rule_id
  const validRuleIds = new Set(baselineWorld.rules.map(r => r.id));
  if (!data.changed_rule_id || !validRuleIds.has(data.changed_rule_id)) {
    errors.push(`Invalid changed_rule_id: "${data.changed_rule_id}". Must match one of ${Array.from(validRuleIds).join(', ')}`);
  }

  if (!data.counterfactual_rule || typeof data.counterfactual_rule !== 'string' || data.counterfactual_rule.trim().length === 0) {
    errors.push('Missing or empty "counterfactual_rule"');
  }

  if (!data.macro_shift_summary || typeof data.macro_shift_summary !== 'string' || data.macro_shift_summary.trim().length === 0) {
    errors.push('Missing or empty "macro_shift_summary"');
  }

  const validCharIds = new Set(baselineWorld.characters.map(c => c.id));
  const validFactionIds = new Set(baselineWorld.factions.map(f => f.id));
  const validLocIds = new Set(baselineWorld.locations.map(l => l.id));

  // Helper to validate consequence entities and 3-step causal chain
  const validateImpacts = (impacts: any[], validIds: Set<string>, entityType: string, minCount: number) => {
    if (!Array.isArray(impacts)) {
      errors.push(`"${entityType}_impacts" must be an array`);
      return;
    }
    if (impacts.length < minCount) {
      errors.push(`Expected at least ${minCount} ${entityType} impacts, got ${impacts.length}`);
    }
    impacts.forEach((item: any, idx: number) => {
      if (!item.entity_id || !validIds.has(item.entity_id)) {
        errors.push(`${entityType} impact at index ${idx} has invalid entity_id: "${item?.entity_id}"`);
      }
      if (!item.entity_name) errors.push(`${entityType} impact at index ${idx} missing "entity_name"`);
      if (!item.immediate_effect || typeof item.immediate_effect !== 'string' || item.immediate_effect.trim().length < 5) {
        errors.push(`${entityType} impact "${item?.entity_name || idx}" missing or too short "immediate_effect"`);
      }
      if (!item.causal_reasoning || typeof item.causal_reasoning !== 'string' || item.causal_reasoning.trim().length < 10) {
        errors.push(`${entityType} impact "${item?.entity_name || idx}" missing or incomplete "causal_reasoning" chain`);
      }
      if (!item.status_or_power_shift) {
        errors.push(`${entityType} impact "${item?.entity_name || idx}" missing "status_or_power_shift"`);
      }
    });
  };

  validateImpacts(data.character_impacts, validCharIds, 'character', 2);
  validateImpacts(data.faction_impacts, validFactionIds, 'faction', 2);
  validateImpacts(data.location_impacts, validLocIds, 'location', 2);

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    sanitized: {
      changed_rule_id: String(data.changed_rule_id).trim(),
      original_rule_statement: String(data.original_rule_statement || '').trim(),
      counterfactual_rule: String(data.counterfactual_rule).trim(),
      macro_shift_summary: String(data.macro_shift_summary).trim(),
      character_impacts: data.character_impacts.map((c: any) => ({
        entity_id: String(c.entity_id).trim(),
        entity_name: String(c.entity_name).trim(),
        immediate_effect: String(c.immediate_effect).trim(),
        causal_reasoning: String(c.causal_reasoning).trim(),
        status_or_power_shift: String(c.status_or_power_shift).trim(),
      })),
      faction_impacts: data.faction_impacts.map((f: any) => ({
        entity_id: String(f.entity_id).trim(),
        entity_name: String(f.entity_name).trim(),
        immediate_effect: String(f.immediate_effect).trim(),
        causal_reasoning: String(f.causal_reasoning).trim(),
        status_or_power_shift: String(f.status_or_power_shift).trim(),
      })),
      location_impacts: data.location_impacts.map((l: any) => ({
        entity_id: String(l.entity_id).trim(),
        entity_name: String(l.entity_name).trim(),
        immediate_effect: String(l.immediate_effect).trim(),
        causal_reasoning: String(l.causal_reasoning).trim(),
        status_or_power_shift: String(l.status_or_power_shift).trim(),
      })),
    }
  };
}
