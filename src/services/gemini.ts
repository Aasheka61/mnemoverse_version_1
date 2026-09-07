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
  // Check process.env (injected via vite define) or import.meta.env
  const key =
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    '';
  return key;
}

export async function generateMemoryPalaceScene(
  studyText: string,
  archetypeName?: string
): Promise<GeneratedMemoryPalaceScene> {
  const apiKey = getGeminiApiKey();

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error(
      'GEMINI_API_KEY is not set or still has the placeholder value. Please set GEMINI_API_KEY in your environment or Secrets.'
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

Task:
1. Identify one key concept from the text.
2. Create a vivid, memorable sensory metaphor for it.
3. Place this metaphor inside an architectural chamber${archetypeName ? ` (theme: ${archetypeName})` : ''}.

Return the response strictly as a JSON object matching this exact schema:
{
  "scene": {
    "scene_name": "string",
    "rooms": [
      {
        "room_id": "r1",
        "room_name": "string",
        "object_name": "string",
        "metaphor": "string"
      }
    ]
  }
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scene: {
            type: Type.OBJECT,
            properties: {
              scene_name: {
                type: Type.STRING,
                description: 'The overall theme or name of the memory palace scene',
              },
              rooms: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    room_id: {
                      type: Type.STRING,
                      description: 'Room identifier such as r1',
                    },
                    room_name: {
                      type: Type.STRING,
                      description: 'Descriptive title of the chamber or room',
                    },
                    object_name: {
                      type: Type.STRING,
                      description: 'The key concept or physical anchor object',
                    },
                    metaphor: {
                      type: Type.STRING,
                      description: 'A vivid, imaginative visual metaphor for the key concept',
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
      },
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error('Received an empty response from the Gemini API.');
  }

  try {
    // Strip possible markdown backticks if returned
    const cleanedText = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    const parsed: GeneratedMemoryPalaceScene = JSON.parse(cleanedText);
    if (!parsed.scene || !Array.isArray(parsed.scene.rooms)) {
      throw new Error('Response JSON does not match the expected scene and rooms shape.');
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', responseText, err);
    throw new Error(`Failed to parse structured memory palace from Gemini response: ${err instanceof Error ? err.message : String(err)}`);
  }
}
