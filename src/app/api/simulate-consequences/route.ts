import { NextRequest, NextResponse } from 'next/server';
import { callGeminiJson, sanitizeApiError } from '@/lib/gemini';
import { validateSimulationResult } from '@/lib/validation';
import type { WorldModel } from '@/types/world';

export const dynamic = 'force-dynamic';

const SIMULATION_SYSTEM_PROMPT = `
You are StoryWorld Architect's counterfactual reasoning engine.

Change exactly one rule in the supplied fictional world and reason about
the consequences. Do not regenerate the world or rewrite unrelated entities.

Requirements:
1. Treat the supplied baseline world as the source of truth.
2. Change only the selected rule. All other rules remain in effect.
3. Explain the causal chain: changed rule -> immediate effect -> downstream consequence.
4. Ground every impact in an existing baseline entity.
5. Use exact entity IDs and names from the supplied world.
6. Include at least two distinct character impacts, two faction impacts,
   and two location impacts.
7. Every impact needs an immediate effect, causal reasoning, and a
   status or power shift.
8. Explain why each consequence follows from the changed rule.
9. Return only valid JSON without Markdown or conversational text.

Return this structure:
{
  "changed_rule_id": "existing rule ID",
  "original_rule_statement": "original rule statement",
  "counterfactual_rule": "proposed replacement rule",
  "macro_shift_summary": "overall systemic change",
  "character_impacts": [
    {
      "entity_id": "existing character ID",
      "entity_name": "exact character name",
      "immediate_effect": "direct effect",
      "causal_reasoning": "explicit causal chain",
      "status_or_power_shift": "resulting shift"
    }
  ],
  "faction_impacts": [
    {
      "entity_id": "existing faction ID",
      "entity_name": "exact faction name",
      "immediate_effect": "direct effect",
      "causal_reasoning": "explicit causal chain",
      "status_or_power_shift": "resulting shift"
    }
  ],
  "location_impacts": [
    {
      "entity_id": "existing location ID",
      "entity_name": "exact location name",
      "immediate_effect": "direct effect",
      "causal_reasoning": "explicit causal chain",
      "status_or_power_shift": "resulting shift"
    }
  ]
}
`;

const MAX_WORLD_JSON_LENGTH = 60_000;
const MAX_RULE_LENGTH = 1_000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Invalid request. Provide a baseline world, selected rule ID, and proposed rule.' },
        { status: 400 }
      );
    }

    const world = body.baselineWorld as WorldModel;
    const selectedRuleId =
      typeof body.selectedRuleId === 'string'
        ? body.selectedRuleId.trim()
        : '';
    const proposedRule =
      typeof body.proposedRule === 'string'
        ? body.proposedRule.trim()
        : '';

    if (!world || typeof world !== 'object') {
      return NextResponse.json(
        { error: 'A baseline world is required.' },
        { status: 400 }
      );
    }

    if (JSON.stringify(world).length > MAX_WORLD_JSON_LENGTH) {
      return NextResponse.json(
        { error: 'The baseline world is too large to simulate.' },
        { status: 413 }
      );
    }

    if (
      !world.overview ||
      !Array.isArray(world.rules) ||
      !Array.isArray(world.characters) ||
      !Array.isArray(world.factions) ||
      !Array.isArray(world.locations)
    ) {
      return NextResponse.json(
        { error: 'The baseline world is missing required domains. Generate a valid world first.' },
        { status: 400 }
      );
    }

    const selectedRule = world.rules.find(
      (rule) => rule.id === selectedRuleId
    );

    if (!selectedRule) {
      return NextResponse.json(
        { error: 'The selected rule does not belong to the baseline world.' },
        { status: 400 }
      );
    }

    if (proposedRule.length < 10) {
      return NextResponse.json(
        { error: 'The replacement rule must contain at least 10 characters.' },
        { status: 400 }
      );
    }

    if (proposedRule.length > MAX_RULE_LENGTH) {
      return NextResponse.json(
        { error: `The replacement rule must be ${MAX_RULE_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }

    if (
      world.characters.length < 2 ||
      world.factions.length < 2 ||
      world.locations.length < 2
    ) {
      return NextResponse.json(
        { error: 'The baseline world needs at least two characters, factions, and locations.' },
        { status: 400 }
      );
    }

    const userPrompt = `
Simulate changing one rule in this fictional world.

BASELINE WORLD:
${JSON.stringify(world, null, 2)}

SELECTED RULE:
ID: ${selectedRule.id}
Name: ${selectedRule.name}
Original statement: ${selectedRule.rule_statement}
Systemic importance: ${selectedRule.systemic_importance}

PROPOSED REPLACEMENT:
${proposedRule}

Return a structured counterfactual result.
- Use changed_rule_id "${selectedRule.id}" exactly.
- Set original_rule_statement to the original statement supplied above.
- Set counterfactual_rule to the proposed replacement supplied above.
- Reference only entity IDs from the baseline world.
- Include at least two impacts for each entity category.
- Explain immediate effects and downstream consequences for every impact.
- Consider the constraints imposed by the other, unchanged world rules.
- Describe a coherent systemic shift without regenerating the world.
`;

    const rawResult = await callGeminiJson<unknown>(
      userPrompt,
      SIMULATION_SYSTEM_PROMPT
    );

    const validation = validateSimulationResult(rawResult, world);

    if (!validation.valid || !validation.sanitized) {
      console.error(
        'Simulation validation errors:',
        validation.errors
      );

      return NextResponse.json(
        {
          error: 'The AI returned an incomplete or inconsistent simulation. Please revise the hypothesis or try again.',
          validationErrors: validation.errors,
        },
        { status: 502 }
      );
    }

    const result = validation.sanitized;

    // Use the trusted request values instead of model-generated copies.
    result.original_rule_statement = selectedRule.rule_statement;
    result.counterfactual_rule = proposedRule;

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const message = sanitizeApiError(err);

    console.error(
      'API Error in /api/simulate-consequences:',
      message
    );

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
