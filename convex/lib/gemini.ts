// =============================================================================
// Gemini SDK Wrapper — Convex-compatible
// =============================================================================

import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-2.5-pro-preview-05-06";

interface InlineImage {
  data: string; // base64
  mimeType: string;
}

/**
 * Call Gemini with images (vision). Returns parsed JSON.
 */
export async function callGeminiVision(
  apiKey: string,
  images: InlineImage[],
  prompt: string
): Promise<unknown> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: "application/json" },
  });

  const parts = [
    ...images.map((img) => ({
      inlineData: { data: img.data, mimeType: img.mimeType },
    })),
    { text: prompt },
  ];

  const result = await model.generateContent(parts);
  const text = result.response.text();
  return parseGeminiJSON(text);
}

/**
 * Call Gemini text-only. Returns parsed JSON.
 */
export async function callGeminiText(
  apiKey: string,
  prompt: string
): Promise<unknown> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: "application/json" },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseGeminiJSON(text);
}

/**
 * Parse JSON from Gemini response, stripping markdown code fences if present.
 */
function parseGeminiJSON(text: string): unknown {
  let cleaned = text.trim();

  // Strip markdown code fences
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse Gemini JSON response: ${cleaned.slice(0, 200)}`);
  }
}
