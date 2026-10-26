
import { GoogleGenAI } from '@google/genai';

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const REQUEST_TIMEOUT_MS = 60_000;

function errorText(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

/**
 * Validates and retrieves the server-side Gemini API key.
 * Never returns the key in an error message.
 */
export function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;

  if (
    !key ||
    key.trim() === '' ||
    key === 'your_gemini_api_key_here'
  ) {
    throw new Error(
      'GEMINI_API_KEY is not configured on the server. Add it to .env.local and restart the server.',
    );
  }

  return key.trim();
}

/**
 * Converts API errors into user-safe messages.
 */
export function sanitizeApiError(error: unknown): string {
  const message = errorText(error).replace(
    /key=[^&\s"' }]+/gi,
    'key=REDACTED',
  );

  if (
    /API_KEY_INVALID|API key not valid/i.test(message) ||
    /\b403\b/.test(message)
  ) {
    return 'The Gemini API key is invalid or unauthorized. Verify GEMINI_API_KEY in .env.local.';
  }

  if (
    /\b404\b/.test(message) ||
    /model .*not found|not supported for generateContent/i.test(message)
  ) {
    return `The configured Gemini model (${DEFAULT_MODEL}) may be unavailable. Verify GEMINI_MODEL against the models supported by your API key.`;
  }

  if (
    /\b429\b|RESOURCE_EXHAUSTED|quota/i.test(message)
  ) {
    return 'Gemini API rate limit or quota exceeded. Check your API quota and try again later.';
  }

  if (
    /\b503\b|\b502\b|\b504\b|UNAVAILABLE|overloaded|high demand/i.test(message)
  ) {
    return 'Gemini is temporarily overloaded. Please try again shortly.';
  }

  if (
    /timeout|timed out|ETIMEDOUT|ECONNRESET|fetch failed|network/i.test(message)
  ) {
    return 'Gemini did not respond within the allowed time, or the connection failed. Please try again.';
  }

  if (/not configured/i.test(message)) {
    return message;
  }

  return `AI generation error: ${message.slice(0, 180)}`;
}

/**
 * Generates JSON through the official Gemini SDK.
 *
 * A bounded request prevents a stalled AI call from keeping the
 * user's generation or simulation waiting indefinitely.
 *
 * This deliberately makes one request rather than retrying or
 * issuing a second REST request after a failure.
 */
export async function callGeminiJson<T>(
  prompt: string,
  systemInstruction?: string,
  modelName: string = DEFAULT_MODEL,
): Promise<T> {
  const apiKey = getGeminiApiKey();

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: REQUEST_TIMEOUT_MS,
    },
  });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: systemInstruction || undefined,
        temperature: 0.7,
      },
    });

    const responseText = response.text?.trim() || '';

    if (!responseText) {
      throw new Error('Gemini returned an empty response.');
    }

    try {
      return JSON.parse(responseText) as T;
    } catch {
      throw new Error('Gemini returned invalid JSON.');
    }
  } catch (error: unknown) {
    console.error(
      `[Gemini] Request failed using model "${modelName}":`,
      errorText(error).slice(0, 300),
    );

    throw new Error(sanitizeApiError(error));
  }
}
