import { GoogleGenAI } from '@google/genai';

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

/**
 * Validates and retrieves the server-side Gemini API key.
 * Never leaks the key or logs it.
 */
export function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.trim() === '' || key === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please add your Gemini API key to .env.local and restart the server.');
  }
  return key.trim();
}

/**
 * Sanitizes errors to prevent API key leaks or verbose stack traces.
 */
export function sanitizeApiError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;
    // Strip any query params or API keys if present in URLs
    const sanitized = msg.replace(/key=[^&\s]+/gi, 'key=REDACTED');

    if (sanitized.includes('API_KEY_INVALID') || sanitized.includes('403') || sanitized.includes('API key not valid')) {
      return 'The provided Gemini API key is invalid or unauthorized. Please verify your GEMINI_API_KEY in .env.local.';
    }
    if (sanitized.includes('404') || sanitized.includes('not found') || sanitized.includes('is not supported')) {
      return `The configured Gemini model (${DEFAULT_MODEL}) was not found or is unavailable for this API key. Verify that GEMINI_MODEL in .env.local is set to a supported model.`;
    }
    if (sanitized.includes('429') || sanitized.includes('RESOURCE_EXHAUSTED') || sanitized.includes('quota')) {
      return 'Gemini API rate limit or quota exceeded. Please wait 10–15 seconds and try again.';
    }
    if (sanitized.includes('ETIMEDOUT') || sanitized.includes('timeout') || sanitized.includes('network')) {
      return 'Network connection to Gemini API timed out. Please check your internet connection and try again.';
    }
    if (sanitized.includes('not configured')) {
      return sanitized;
    }
    return `AI generation error: ${sanitized.slice(0, 180)}`;
  }
  return 'An unexpected error occurred while communicating with the AI service.';
}

/**
 * Calls Gemini with strict JSON output instructions using Google GenAI SDK
 * with a fallback to direct REST API.
 */
export async function callGeminiJson<T>(
  prompt: string, 
  systemInstruction?: string,
  modelName: string = DEFAULT_MODEL
): Promise<T> {
  const apiKey = getGeminiApiKey();

  try {
    // 1. Primary: Use official @google/genai SDK
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: systemInstruction || undefined,
        temperature: 0.7,
      }
    });

    const responseText = response.text?.trim() || '';
    if (!responseText) {
      throw new Error('Received empty response from Gemini model');
    }

    return JSON.parse(responseText) as T;
  } catch (sdkError: any) {
    // 2. Fallback: Direct REST API call
    try {
      const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const restRes = await fetch(restUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        })
      });

      if (!restRes.ok) {
        const errText = await restRes.text();
        throw new Error(`Gemini API HTTP ${restRes.status}: ${errText}`);
      }

      const restData = await restRes.json();
      const rawText = restData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      if (!rawText) {
        throw new Error('Gemini REST API returned no content');
      }

      return JSON.parse(rawText) as T;
    } catch (restError: any) {
      // Re-throw the primary error sanitized
      throw new Error(sanitizeApiError(sdkError || restError));
    }
  }
}
