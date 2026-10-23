import { NextRequest, NextResponse } from 'next/server';
import { callGeminiJson, sanitizeApiError } from '@/lib/gemini';
import { validateWorldModel } from '@/lib/validation';

export const dynamic = 'force-dynamic';

const WORLD_GEN_SYSTEM_PROMPT = `You are StoryWorld Architect, a master worldbuilding simulator.
Your job is to generate tightly interconnected, plausible, high-tension fictional worlds across 5 structured domains.

CRITICAL RULES:
1. Every character must reference one of the generated factions in 'faction_allegiance' and one of the world rules in 'connection_to_rule'.
2. Factions must have clear, active rivalries with each other.
3. Locations must embody the world's physical or mystical rules.
4. Rules must be foundational physical, mystical, or legal laws that anchor the entire society.
5. Return ONLY pure, parseable JSON with NO markdown formatting, NO backticks, and NO conversational filler.

OUTPUT JSON SCHEMA:
{
  "overview": {
    "name": "World Name",
    "premise_summary": "2-3 sentences summarizing the world and its fundamental premise.",
    "core_conflict": "The central struggle or tension driving this world.",
    "defining_theme": "e.g. Solar resource scarcity meets daylight tyranny"
  },
  "characters": [
    {
      "id": "char_1",
      "name": "Full Name & Title",
      "role": "Narrative role / profession",
      "motivation": "Core desire or objective",
      "faction_allegiance": "Name of one of the factions below",
      "connection_to_rule": "How this character relies on or is restricted by one of the rules"
    }
  ], // EXACTLY 3 or 4 characters
  "factions": [
    {
      "id": "fac_1",
      "name": "Faction Name",
      "agenda": "Primary strategic or ideological goal",
      "power_source": "How they derive power or authority",
      "rivalry": "Name of competing faction or threat",
      "territory": "Primary territory or stronghold"
    }
  ], // EXACTLY 2 or 3 factions
  "locations": [
    {
      "id": "loc_1",
      "name": "Location Name",
      "environment": "Physical & atmospheric description",
      "strategic_value": "Why factions fight over it",
      "connection_to_rule": "How world laws physically manifest here"
    }
  ], // EXACTLY 2 or 3 locations
  "rules": [
    {
      "id": "rule_1",
      "name": "Short Rule Title",
      "rule_statement": "Clear statement of the physical, magical, or legal law",
      "systemic_importance": "Why the world would break or mutate if this rule changed"
    }
  ] // EXACTLY 3 or 4 rules
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.premise !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request body. Expected a "premise" string.' },
        { status: 400 }
      );
    }

    const premise = body.premise.trim();
    // Acceptance criterion: user's premise text must be at least 10 characters
    if (premise.length < 10) {
      return NextResponse.json(
        { error: 'Premise text must be at least 10 characters long to generate a structured world.' },
        { status: 400 }
      );
    }

    const userPrompt = `Generate a structured, interconnected 5-domain world based on this premise:
"${premise}"

Produce exactly:
- 1 World Overview
- 3 to 4 Characters
- 2 to 3 Factions
- 2 to 3 Locations
- 3 to 4 World Rules

Ensure all characters, factions, and locations are meaningfully interconnected.`;

    // Call Gemini with structured output
    const rawData = await callGeminiJson<any>(userPrompt, WORLD_GEN_SYSTEM_PROMPT);

    // Validate schema at runtime
    const validation = validateWorldModel(rawData);
    if (!validation.valid || !validation.sanitized) {
      console.error('World validation errors:', validation.errors);
      return NextResponse.json(
        {
          error: 'AI generated an incomplete or malformed world model. Please try again.',
          validationErrors: validation.errors
        },
        { status: 502 }
      );
    }

    return NextResponse.json(validation.sanitized, { status: 200 });
  } catch (err: any) {
    const message = sanitizeApiError(err);
    console.error('API Error in /api/generate-world:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
