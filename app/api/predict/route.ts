// app/api/predict/route.ts
// Uses: Groq (Llama-4-Scout) for OCR  +  Gemini (gemini-3.1-flash-lite-preview) for analysis

import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// ─── helpers ─────────────────────────────────────────────────────────────────

function cleanToNumber(value: unknown): number {
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[^\d.]/g, "");
  const n = cleaned.includes(".") ? parseFloat(cleaned) : parseInt(cleaned, 10);
  return isNaN(n) ? 0 : n;
}

// Robust JSON parse: handles markdown fences, stray whitespace/newlines in strings
function safeParseJson(raw: string): Record<string, unknown[]> {
  // 1. Strip markdown fences
  let cleaned = raw.replace(/```json\s*|```/g, "").trim();
  // 2. Replace literal newlines inside JSON string values with a space
  cleaned = cleaned.replace(/"([^"]*)"/g, (_match, inner: string) =>
    `"${inner.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim()}"`
  );
  return JSON.parse(cleaned);
}

// ─── OCR via Groq (Llama-4-Scout vision) ─────────────────────────────────────

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
                text: `You are a menu reader. List EVERY single food and drink item name visible on this menu, exactly as written. Include ALL items from ALL sections. Output one item per line. Do NOT skip any item, do NOT add prices or descriptions.`,
              },
              {
                type: "image_url",
                image_url: { url: dataUrl },
              },
            ],
          },
        ],
        max_tokens: 1024,
      }),
    });

    if (!res.ok) return "";
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "";
  } catch {
    return "";
  }
}

// ─── Analysis via Gemini ──────────────────────────────────────────────────────

async function analyzeWithGemini(
  combinedOcr: string,
  userText: string
): Promise<string> {
  const prompt = `
CONTEXT:
Menu OCR (ALL items extracted from images): ${combinedOcr}
USER MANUAL INPUT: ${userText}

TASK:
1. Process EVERY SINGLE item from BOTH Menu OCR AND USER MANUAL INPUT. Do NOT skip, merge, or omit any item.
2. Categorize each item into exactly one of: 'Appetizer', 'Main Dish', 'Dessert', 'Drinks'.
   CATEGORIZATION RULES (follow strictly):
   - 'Drinks': water, plain water, air putih, mineral water, tea, coffee, kopi, teh, juice, cham, barley, cincau, soy bean, milo, coke, 100 plus, limau, lemon tea, any hot or cold beverage you drink through a cup or glass.
   - 'Dessert': sweet cold or iced items served as dessert — ice kacang, ais kacang, ABC, cendol, pudding, kuih, cake, sweet soups, any iced sweet food. IMPORTANT: ice kacang and cendol are DESSERT not Drinks.
   - 'Main Dish': rice dishes, noodles, chicken dishes, fish dishes, meat, hor fun, mee, any substantial meal item.
   - 'Appetizer': small starters and sides — satay, popiah, spring roll, bean sprout, lettuce, tofu side dishes, gizzard, liver, small soups served as starters.
3. Estimate for each item: Sugar(g), Calories(kcal), GI Value(0-100), Risk (Low/Medium/High).
   Risk = impact on blood glucose for elderly diabetics.
4. Write a short practical health tip for EVERY item (one sentence, no newlines).

RANKING LOGIC (apply per category):
- Priority 1: Sugar (lowest first)
- Priority 2: GI Value (lowest first)
- Priority 3: Risk (Low first, then Medium, then High)
- Priority 4 TIE-BREAKER: Calories (lowest first)

IMPORTANT OUTPUT RULES:
- Output ONLY valid JSON. No markdown, no code fences, no extra text.
- Do NOT put newline characters inside string values.
- Use this exact structure:
{"Appetizer":[],"Main Dish":[],"Dessert":[],"Drinks":[]}
- Each item: {"f":"name","sugar":number,"c":number,"gi_val":number,"risk":"Low"|"Medium"|"High","tip":"string"}
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userText = (formData.get("userText") as string) ?? "";
    const files = formData.getAll("file") as File[];

    // OCR: process up to 5 images in parallel
    const ocrResults = await Promise.all(
      files.slice(0, 5).map(async (file) => {
        const buf = await file.arrayBuffer();
        return processSingleImage(buf, file.type || "image/jpeg");
      })
    );
    const combinedOcr = ocrResults.filter(Boolean).join("\n");

    // Analysis
    const rawJson = await analyzeWithGemini(combinedOcr, userText);

    // Parse safely (handles whitespace/newlines inside strings)
    let rawData: Record<string, unknown[]>;
    try {
      rawData = safeParseJson(rawJson);
    } catch {
      rawData = JSON.parse(rawJson);
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
        if (a.sugar !== b.sugar)
          return (a.sugar as number) - (b.sugar as number);
        if (a.gi_val !== b.gi_val)
          return (a.gi_val as number) - (b.gi_val as number);
        return (a.c as number) - (b.c as number);
      });

      sorted.forEach((item) => delete item.risk_score);

      // Top 3 per category only
      finalResults[cat] = { ranking: sorted.slice(0, 3) };
    }

    return NextResponse.json(finalResults);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}