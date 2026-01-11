// src/geminiClient.js
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "VITE_GEMINI_API_KEY not set — add it to .env.local for local testing"
  );
}

const ai = new GoogleGenAI({ apiKey });

/**
 * generateContent(prompt, model)
 * - Returns raw string text from model.
 */
export async function generateContent(prompt, model = "gemini-2.5-flash") {
  const contents = [
    {
      role: "user",
      parts: [{ text: String(prompt) }],
    },
  ];

  try {
    const resp = await ai.models.generateContent({
      model,
      contents,
    });

    // Try common response shapes
    const text =
      resp?.output?.[0]?.content?.[0]?.text ||
      resp?.output?.[0]?.content?.find((c) => c.type === "output_text")?.text ||
      resp?.text ||
      JSON.stringify(resp);

    return String(text);
  } catch (err) {
    // rethrow so caller can handle toast/log
    throw err;
  }
}

export async function generateJSON(prompt, model = "gemini-2.5-flash") {
  const raw = await generateContent(prompt, model);

  // 1) Quick clean common markdown/code fences
  let cleaned = String(raw || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // 2) If still not valid JSON, try to extract the first {...} block as fallback
  if (!/^\s*[\[{]/.test(cleaned)) {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1).trim();
    }
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const err = new Error("AI_RESPONSE_JSON_PARSE_ERROR");
    err.details = { message: e.message, raw };
    throw err;
  }
}

