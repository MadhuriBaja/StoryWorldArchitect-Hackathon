
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const IMAGE_MODEL = '@cf/black-forest-labs/flux-1-schnell';

interface WorldLocation {
  name?: unknown;
  environment?: unknown;
}

interface WorldOverview {
  name?: unknown;
  premise_summary?: unknown;
  core_conflict?: unknown;
  defining_theme?: unknown;
}

interface CloudflareImageResponse {
  success?: boolean;
  result?: {
    image?: string;
  };
  errors?: Array<{
    code?: number;
    message?: string;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (
      !body ||
      typeof body.world !== 'object' ||
      body.world === null ||
      Array.isArray(body.world)
    ) {
      return NextResponse.json(
        { error: 'A generated world is required.' },
        { status: 400 },
      );
    }

    const world = body.world as {
      overview?: WorldOverview;
      locations?: WorldLocation[];
    };

    const overview = world.overview;

    if (
      !overview ||
      typeof overview.name !== 'string' ||
      typeof overview.premise_summary !== 'string'
    ) {
      return NextResponse.json(
        { error: 'The world overview is incomplete.' },
        { status: 400 },
      );
    }

    const worldName = overview.name.trim().slice(0, 160);
    const premise = overview.premise_summary.trim().slice(0, 1500);

    const conflict =
      typeof overview.core_conflict === 'string'
        ? overview.core_conflict.trim().slice(0, 500)
        : '';

    const theme =
      typeof overview.defining_theme === 'string'
        ? overview.defining_theme.trim().slice(0, 300)
        : '';

    if (!worldName || !premise) {
      return NextResponse.json(
        { error: 'The world needs a name and premise.' },
        { status: 400 },
      );
    }

    const locations = Array.isArray(world.locations)
      ? world.locations
          .slice(0, 4)
          .map((location: WorldLocation) => {
            const name =
              typeof location?.name === 'string'
                ? location.name.slice(0, 80)
                : '';

            const environment =
              typeof location?.environment === 'string'
                ? location.environment.slice(0, 150)
                : '';

            return name ? `${name}: ${environment}` : '';
          })
          .filter(Boolean)
          .join('\n')
      : '';

    const prompt = `
Create breathtaking cinematic environment concept art for an original
fictional universe called "${worldName}".

WORLD PREMISE:
${premise}

CENTRAL CONFLICT:
${conflict || 'Create a compelling visual sense of mystery and tension.'}

DEFINING THEME:
${theme || 'Express the distinctive identity of this fictional universe.'}

IMPORTANT LOCATIONS:
${locations || 'Invent a distinctive location consistent with the premise.'}

ART DIRECTION:
- Wide cinematic landscape composition for a worldbuilding studio.
- Premium fantasy and science-fiction environment concept art.
- Extraordinary scale, atmospheric depth and environmental storytelling.
- Distinctive architecture, believable materials and dramatic lighting.
- Intricate details and a memorable focal point.
- Rich colors with deep navy, luminous cyan, violet and restrained amber
  accents where appropriate to the world.
- Polished professional art-book quality.
- Make the image visually specific to this world's premise and conflict.
- Prioritize environments and world design over close-up portraits.
- No user interface, borders, watermarks, logos or written text.
- Return the generated image, not a text description.
`.trim();

    // FLUX.1 schnell accepts prompts up to 2048 characters.
    const boundedPrompt = prompt.slice(0, 2048);

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
    const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim();

    if (!accountId || !apiToken) {
      console.error('Cloudflare image generation credentials are missing.');

      return NextResponse.json(
        {
          error:
            'Image generation is not configured. Check the Cloudflare credentials in your local environment.',
        },
        { status: 500 },
      );
    }

    const endpoint =
      `https://api.cloudflare.com/client/v4/accounts/` +
      `${encodeURIComponent(accountId)}/ai/run/${IMAGE_MODEL}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: boundedPrompt,
        steps: 4,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(120_000),
    });

    const result = (await response
      .json()
      .catch(() => null)) as CloudflareImageResponse | null;

    if (!response.ok || !result?.success) {
      const apiMessage = result?.errors
        ?.map((item) => item.message)
        .filter(Boolean)
        .join('; ');

      console.error(
        'Cloudflare image generation request failed:',
        response.status,
        apiMessage || 'No additional error details.',
      );

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            error:
              'Cloudflare rejected the request. Check that your API token is valid and has Workers AI permission.',
          },
          { status: 502 },
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              'Cloudflare image generation is rate-limited or temporarily at capacity. Please try again later.',
          },
          { status: 502 },
        );
      }

      return NextResponse.json(
        {
          error:
            'Cloudflare could not generate the artwork. Check your Workers AI account and try again.',
        },
        { status: 502 },
      );
    }

    const imageData = result.result?.image;

    if (
      typeof imageData !== 'string' ||
      imageData.length === 0 ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(imageData)
    ) {
      console.error('Cloudflare returned no valid base64 image data.');

      return NextResponse.json(
        { error: 'The image model returned no valid image. Please try again.' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      worldName,
      imageDataUrl: `data:image/jpeg;base64,${imageData}`,
      mimeType: 'image/jpeg',
    });
  } catch (error: unknown) {
    const timedOut =
      error instanceof Error && error.name === 'TimeoutError';

    console.error(
      'World artwork generation failed:',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      {
        error: timedOut
          ? 'Image generation took too long. Please try again.'
          : 'An unexpected error occurred while generating world artwork.',
      },
      { status: 502 },
    );
  }
}
