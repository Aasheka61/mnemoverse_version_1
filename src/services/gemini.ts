/**
 * Direct client-side Gemini API service for MnemoVerse.
 * WARNING: Calling the Gemini API directly from the client exposes the API key in client-side bundles.
 * Client-side integration was explicitly requested by user prompt.
 */
import { GoogleGenAI, Type } from '@google/genai';

export interface MemoryRoom {
  room_id: string;
  room_name: string;
  object_name: string;
  metaphor: string;
}

export interface GeneratedMemoryPalaceScene {
  scene: {
    scene_name: string;
    rooms: MemoryRoom[];
  };
}

export function getGeminiApiKey(): string {
  // Read via import.meta.env.VITE_GEMINI_API_KEY for Vite client-side deployment
  const envObj = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  const key =
    envObj?.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' && (process.env?.VITE_GEMINI_API_KEY || process.env?.GEMINI_API_KEY)) ||
    '';
  return key;
}

export async function generateMemoryPalaceScene(
  studyText: string,
  archetypeName?: string
): Promise<GeneratedMemoryPalaceScene> {
  const apiKey = getGeminiApiKey();

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'MY_VITE_GEMINI_API_KEY') {
    throw new Error(
      'VITE_GEMINI_API_KEY is not set or still has the placeholder value. Please set VITE_GEMINI_API_KEY in your environment variables.'
    );
  }

  // Client-side initialization using @google/genai SDK
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const prompt = `You are an expert mnemonic architect and cognitive memory palace designer.
Analyze the following student study material:
"""
${studyText}
"""

UNIVERSAL DOMAIN-AGNOSTIC RULES:
1. Regardless of subject matter (biology, chemistry, history, physics, literature, or any other topic), if the input text describes 2 or more distinct facts, ideas, or entities, you MUST create a separate room for each one. Do not collapse multiple distinct concepts into a single room under any circumstances.
2. Even if the text is short or focuses on an overarching theme, identify AT LEAST 2 to 3 distinct sub-concepts, components, or key mechanisms.
3. Group all identified sub-concepts into ONE cohesive shared scene (like an estate, house, facility, sanctuary, or palace) with an overarching name${archetypeName ? ` styled in the theme of "${archetypeName}"` : ''}.
4. Return MULTIPLE entries in the "rooms" array (strictly 2 to 3 rooms). Each entry represents one distinct sub-concept. Never return only 1 room.
5. For each room:
   - "room_id": Unique room identifier (e.g. "r1", "r2", "r3").
   - "room_name": Descriptive name of that room inside the shared house.
   - "object_name": The specific distinct sub-concept or physical anchor object.
   - "metaphor": A vivid, memorable, sensory metaphor that encodes this sub-concept for spatial recall.

--------------------
WORKED EXAMPLE 1 (Subject: World History - The French Revolution Three Estates)
Input text describes 3 groups: clergy (first estate), nobility (second estate), and commoners (third estate).
Output:
{
  "scene": {
    "scene_name": "The Ancien Régime Manor",
    "rooms": [
      {
        "room_id": "r1",
        "room_name": "The Golden Chapel",
        "object_name": "First Estate (Clergy & Church Land)",
        "metaphor": "An opulent cathedral sanctuary with stained glass depicting gold coins pouring into bishop mitres without a single tax coin leaving the treasury."
      },
      {
        "room_id": "r2",
        "room_name": "The Grand Armory of Swords",
        "object_name": "Second Estate (Nobility & Feudal Privileges)",
        "metaphor": "A mirrored banquet hall lined with polished ancestral rapiers and silk velvet sashes, where aristocratic judges feast while locked behind gated velvet ropes."
      },
      {
        "room_id": "r3",
        "room_name": "The Millstone Cellar",
        "object_name": "Third Estate (Peasants & Bourgeoisie)",
        "metaphor": "A crowded, dusty underground bakery where thousands of barefoot artisans heave a massive stone wheel grinding dry wheat, chained beneath the opulent floors above."
      }
    ]
  }
}

--------------------
WORKED EXAMPLE 2 (Subject: Chemistry - Fundamental States of Matter)
Input text describes 3 states: solid (fixed particles), liquid (sliding particles), and gas (free particles).
Output:
{
  "scene": {
    "scene_name": "The Kinetic State Observatory",
    "rooms": [
      {
        "room_id": "r1",
        "room_name": "The Crystalline Ice Foyer",
        "object_name": "Solid State (Fixed Particle Lattice)",
        "metaphor": "A frozen hall of interlocking hexagonal crystal soldiers standing shoulder-to-shoulder, vibrating gently in place like humming tuning forks without breaking formation."
      },
      {
        "room_id": "r2",
        "room_name": "The Fluid Cascade Gallery",
        "object_name": "Liquid State (Flowing Particle Clusters)",
        "metaphor": "A room whose floor is a shallow river of polished amber beads rolling smoothly around one another, pouring easily from a glass pitcher into an ornate bronze basin."
      },
      {
        "room_id": "r3",
        "room_name": "The Vapor Wind Tower",
        "object_name": "Gas State (Free Kinetic Dispersion)",
        "metaphor": "A soaring glass cupola where glowing neon fireflies zip in wildly unpredictable supersonic vectors, ricocheting off the dome walls with boundless explosive energy."
      }
    ]
  }
}
--------------------

Now, analyze the student study material provided above and generate the JSON response strictly adhering to the schema with 2 to 3 rooms.`;

  const sceneResponseSchema = {
    type: Type.OBJECT,
    properties: {
      scene: {
        type: Type.OBJECT,
        properties: {
          scene_name: {
            type: Type.STRING,
            description: 'The overall theme or name of the shared memory palace scene',
          },
          rooms: {
            type: Type.ARRAY,
            minItems: '2',
            maxItems: '3',
            description: 'Array of at least 2 to 3 distinct concept rooms within this shared scene. MUST contain multiple entries (2-3 rooms).',
            items: {
              type: Type.OBJECT,
              properties: {
                room_id: {
                  type: Type.STRING,
                  description: 'Unique room identifier such as r1, r2, r3',
                },
                room_name: {
                  type: Type.STRING,
                  description: 'Descriptive title of the chamber or room inside the shared house',
                },
                object_name: {
                  type: Type.STRING,
                  description: 'The specific distinct sub-concept or physical anchor object',
                },
                metaphor: {
                  type: Type.STRING,
                  description: 'A vivid, imaginative visual metaphor for this sub-concept',
                },
              },
              required: ['room_id', 'room_name', 'object_name', 'metaphor'],
            },
          },
        },
        required: ['scene_name', 'rooms'],
      },
    },
    required: ['scene'],
  };

  async function executeModelCall(promptText: string): Promise<GeneratedMemoryPalaceScene> {
    let responseText: string | undefined;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: sceneResponseSchema,
        },
      });
      responseText = response.text;
    } catch (err: any) {
      // If rate-limited or quota exceeded on 3.8-flash, seamlessly fall back to gemini-3.1-flash-lite
      if (
        err?.status === 429 ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('quota') ||
        err?.message?.includes('exceeded')
      ) {
        console.warn('gemini-3.8-flash rate-limited, executing fallback on gemini-3.1-flash-lite...');
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
            responseSchema: sceneResponseSchema,
          },
        });
        responseText = fallbackResponse.text;
      } else {
        throw err;
      }
    }

    if (!responseText) {
      throw new Error('Received an empty response from the Gemini API.');
    }

    // Log the raw response directly to the browser console for inspection
    console.log('================== [GEMINI RAW JSON RESPONSE START] ==================');
    console.log(responseText);
    console.log('================== [GEMINI RAW JSON RESPONSE END] ====================');

    // Strip possible markdown backticks if returned
    const cleanedText = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    const rawParsed = JSON.parse(cleanedText);
    console.log('[GEMINI RAW PARSED OBJECT]:', rawParsed);
    console.log('[GEMINI RAW ROOMS COUNT FROM MODEL]:', rawParsed?.scene?.rooms?.length);

    if (typeof window !== 'undefined') {
      (window as any).__LAST_GEMINI_RAW_RESPONSE__ = responseText;
      (window as any).__LAST_GEMINI_PARSED__ = rawParsed;
    }

    const parsed: GeneratedMemoryPalaceScene = rawParsed;
    if (!parsed.scene || !Array.isArray(parsed.scene.rooms)) {
      throw new Error('Response JSON does not match the expected scene and rooms shape.');
    }

    // Ensure room properties are properly sanitized and non-empty
    parsed.scene.rooms = parsed.scene.rooms.map((room, idx) => ({
      room_id: String(room.room_id || `r${idx + 1}`),
      room_name: String(room.room_name || `Chamber ${idx + 1}`),
      object_name: String(room.object_name || `Concept ${idx + 1}`),
      metaphor: String(room.metaphor || 'A vivid sensory landmark designed to anchor the memory.'),
    }));

    return parsed;
  }

  // Calculate approximate word count of input text
  const wordCount = studyText.trim().split(/\s+/).filter(Boolean).length;

  try {
    let result = await executeModelCall(prompt);

    // Client-side validation safety net:
    // If "rooms" contains fewer than 2 entries AND input text is roughly 100 words or more,
    // automatically retry the API call ONCE with a more explicit instruction appended.
    if (result.scene.rooms.length < 2 && wordCount >= 100) {
      console.warn(
        `[Client-Side Validation] Model returned only ${result.scene.rooms.length} room(s) for a ${wordCount}-word input. Retrying ONCE with explicit multi-room instruction...`
      );

      const retryPrompt = `${prompt}

CRITICAL RETRY MANDATE:
Your previous attempt returned only 1 room. The input text contains ${wordCount} words describing multiple distinct concepts, entities, or mechanisms.
You MUST break this material down and return at least 2 or 3 distinct rooms in the "rooms" array (e.g. r1, r2, r3). Do not collapse multiple concepts into a single room under any circumstances.`;

      try {
        const retryResult = await executeModelCall(retryPrompt);
        console.log(
          `[Client-Side Validation Retry] Result received with ${retryResult.scene.rooms.length} room(s).`
        );
        // If the retry generated more rooms (or even if it still generated 1), accept it without retrying further
        result = retryResult;
      } catch (retryError) {
        console.warn('[Client-Side Validation Retry] Retry call failed, accepting initial result:', retryError);
      }
    }

    return result;
  } catch (err) {
    console.error('Failed to generate or parse Gemini memory palace:', err);
    throw new Error(
      `Failed to generate memory palace from Gemini: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
