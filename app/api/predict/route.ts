// app/api/predict/route.ts
// Drop-in serverless replacement for the Python Flask index.py
// Uses: Groq (Llama-4-Scout) for OCR  +  Gemini (gemini-2.0-flash-lite) for analysis
// Deploy on Vercel – no separate Python server required.

import { NextRequest, NextResponse } from "next/server";

// ─── helpers ────────────────────────────────────────────────────────────────

function cleanToNumber(value: unknown): number {
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[^\d.]/g, "");
  const n = cleaned.includes(".") ? parseFloat(cleaned) : parseInt(cleaned, 10);
  return isNaN(n) ? 0 : n;
}

// ─── OCR via Groq (Llama-4-Scout vision) ────────────────────────────────────

async function processSingleImage(
  arrayBuffer: ArrayBuffer,
  mimeType: string
): Promise<string> {
  try {
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "List food/drink names exactly as written on this menu.",
              },
              {
                type: "image_url",
                image_url: { url: dataUrl },
              },
            ],
          },
        ],
        max_tokens: 512,
      }),
    });

    if (!res.ok) return "";
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "";
  } catch {
    return "";
  }
}

// ─── Analysis via Gemini ─────────────────────────────────────────────────────

async function analyzeWithGemini(
  combinedOcr: string,
  userText: string
): Promise<string> {
  const prompt = `
CONTEXT:
Menu OCR: ${combinedOcr}
USER MANUAL INPUT: ${userText}

TASK:
1. Extract items from BOTH Menu OCR AND USER MANUAL INPUT.
2. Categorize: 'Appetizer', 'Main Dish', 'Dessert', 'Drinks'.
3. For items like 'Air Putih' or 'Mineral Water', prioritize them in 'Drinks'.
4. Estimate: Sugar(g), Calories(kcal), GI Value(0-100), and Risk (Low, Medium, High).
5. Provide a tip for EVERY item.

RANKING LOGIC:
- Priority 1: Risk (Low > Med > High)
- Priority 2: Sugar (Lowest first)
- Priority 3: GI Value (Lowest first)
- Priority 4 (TIE-BREAKER): Calories (Lowest first).

Output ONLY valid JSON, no markdown, no extra text:
{
  "Appetizer": [],
  "Main Dish": [],
  "Dessert": [],
  "Drinks": []
}
Each item: {"f": "name", "sugar": number, "c": number, "gi_val": number, "risk": "Low"|"Medium"|"High", "tip": "string"}
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
}

// ─── Route handler ────────────────────────────────────────────────────────────

export const maxDuration = 60; // Vercel max for hobby; upgrade plan for longer

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userText = (formData.get("userText") as string) ?? "";
    const files = formData.getAll("file") as File[];

    // OCR: process up to 5 images in parallel
    const imageSlice = files.slice(0, 5);
    const ocrResults = await Promise.all(
      imageSlice.map(async (file) => {
        const buf = await file.arrayBuffer();
        return processSingleImage(buf, file.type || "image/jpeg");
      })
    );
    const combinedOcr = ocrResults.join("\n");

    // Analysis
    const rawJson = await analyzeWithGemini(combinedOcr, userText);

    // Parse + clean
    let rawData: Record<string, unknown[]>;
    try {
      rawData = JSON.parse(rawJson);
    } catch {
      // strip accidental markdown fences
      const cleaned = rawJson.replace(/```json|```/g, "").trim();
      rawData = JSON.parse(cleaned);
    }

    const riskMap: Record<string, number> = { Low: 1, Medium: 2, High: 3 };
    const finalResults: Record<string, { ranking: unknown[] }> = {};

    for (const cat of ["Appetizer", "Main Dish", "Dessert", "Drinks"]) {
      const items = (rawData[cat] ?? []) as Record<string, unknown>[];

      for (const item of items) {
        item.sugar = cleanToNumber(item.sugar ?? 0);
        item.gi_val = cleanToNumber(item.gi_val ?? 55);
        item.c = cleanToNumber(item.c ?? 0);
        item.risk_score = riskMap[String(item.risk ?? "Medium")] ?? 2;
      }

      const sorted = [...items].sort((a, b) => {
        if (a.risk_score !== b.risk_score)
          return (a.risk_score as number) - (b.risk_score as number);
        if (a.sugar !== b.sugar) return (a.sugar as number) - (b.sugar as number);
        if (a.gi_val !== b.gi_val)
          return (a.gi_val as number) - (b.gi_val as number);
        return (a.c as number) - (b.c as number);
      });

      sorted.forEach((item) => delete item.risk_score);
      finalResults[cat] = { ranking: sorted };
    }

    return NextResponse.json(finalResults);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}