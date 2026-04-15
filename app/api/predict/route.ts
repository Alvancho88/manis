// app/api/predict/route.ts
// Uses: Groq (Llama-4-Scout) for OCR + Gemini (gemini-2.5-flash-lite-preview) for analysis
// Fallback: Groq (Llama-3.3-70B) if Gemini fails
 
import { NextRequest, NextResponse } from "next/server";
 
export const maxDuration = 60;
 
// ─── helpers ─────────────────────────────────────────────────────────────────
 
function cleanToNumber(value: unknown): number {
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[^\d.]/g, "");
  const n = cleaned.includes(".") ? parseFloat(cleaned) : parseInt(cleaned, 10);
  return isNaN(n) ? 0 : n;
}
 
function safeParseJson(raw: string): Record<string, unknown[]> {
  const stripped = raw.replace(/```json\s*|```/g, "").trim();
  const start = stripped.indexOf("{");
  if (start === -1) throw new Error("No JSON object found in response");
 
  let depth = 0;
  let inString = false;
  let escape = false;
 
  for (let i = start; i < stripped.length; i++) {
    const ch = stripped[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) return JSON.parse(stripped.slice(start, i + 1));
    }
  }
  return JSON.parse(stripped);
}
 
// ─── OCR via Groq (Llama-4-Scout) ─────────────────────────────────────────────
 
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
                text: `List EVERY single food and drink item name visible on this menu. Output one item per line.`,
              },
              {
                type: "image_url",
                image_url: { url: dataUrl },
              },
            ],
          },
        ],
        max_tokens: 1024,
        temperature: 0.1,
      }),
    });
 
    if (!res.ok) return "";
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "";
  } catch {
    return "";
  }
}
 
// ─── Shared prompt builder ─────────────────────────────────────────────────────
 
function buildAnalysisPrompt(combinedOcr: string, userText: string): string {
  return `
CONTEXT:
Menu OCR (ALL items extracted from images): ${combinedOcr}
USER MANUAL INPUT: ${userText}
 
CRITICAL RULE:
- ONLY include food items that are EXPLICITLY named in the Menu OCR or USER MANUAL INPUT above. Do NOT invent, hallucinate, assume, or add any food item that is not literally present in the provided text. If you are unsure whether an item was in the input, omit it. 
 
TASK:
1. Process EVERY SINGLE item from BOTH Menu OCR AND USER MANUAL INPUT. Do NOT skip, merge, or omit any item. Do NOT add items not present in the input.
2. Categorize each item into exactly one of: 'Appetizer', 'Main Dish', 'Dessert', 'Drinks'.
   CATEGORIZATION RULES (follow strictly):
   - 'Drinks': water, plain water, air putih, mineral water, tea, coffee, kopi, teh, juice, cham, barley, cincau, soy bean, milo, coke, 100 plus, limau, lemon tea, any hot or cold beverage you drink through a cup or glass.
   - 'Dessert': sweet cold or iced items served as dessert — ice kacang, ais kacang, ABC, cendol, pudding, kuih, cake, sweet soups, any iced sweet food. IMPORTANT: ice kacang and cendol are DESSERT not Drinks.
   - 'Main Dish': rice dishes, noodles, chicken dishes, fish dishes, meat, hor fun, mee, any substantial meal item.
   - 'Appetizer': small starters and sides — satay, popiah, spring roll, bean sprout, lettuce, tofu side dishes, gizzard, liver, small soups served as starters.
3. Estimate for each item: Sugar(g), Calories(kcal), GI Value(0-100), Risk (Low/Medium/High).
   Risk = impact on blood glucose for elderly diabetics. For Risk, Low is if the sugar ≤ 5g OR GI range ≤ 55, Medium is if the sugar 6g – 15g OR GI range 56 – 69, High if the sugar is ≥ 16g or GI range ≥ 70.
4. Write a short practical health tip for EVERY item (one sentence, no newlines).
5. CRITICAL: For the FIRST (rank #1) item in EACH of the 4 categories (Appetizer, Main Dish, Dessert, Drinks), you MUST include a "best_reason" field. This field explains why this item is the healthiest choice in its category for blood sugar management (one sentence, max 15 words). The best_reason field is REQUIRED for all 4 category leaders - do NOT skip any category.
 
RANKING LOGIC (apply per category):
- Priority 1: Sugar (lowest first)
- Priority 2: GI Value (lowest first)
- Priority 3: Risk (Low first, then Medium, then High)
- Priority 4 TIE-BREAKER: Calories (lowest first)
 
IMPORTANT OUTPUT RULES:
- Output ONLY the top 3 best items per category (already ranked). If a category has fewer than 3 items, output all of them. If a category has 0 items, output an empty array.
- Output ONLY valid JSON. No markdown, no code fences, no extra text, nothing after the closing brace.
- Do NOT put newline or tab characters inside string values. Tips must be a single plain sentence.
- Use this exact structure:
{"Appetizer":[],"Main Dish":[],"Dessert":[],"Drinks":[]}
- MANDATORY: The FIRST item in each non-empty category array MUST have best_reason field: {"f":"name","sugar":number,"c":number,"gi_val":number,"risk":"Low"|"Medium"|"High","tip":"string","best_reason":"string"}
- Items ranked 2nd or 3rd do NOT have best_reason: {"f":"name","sugar":number,"c":number,"gi_val":number,"risk":"Low"|"Medium"|"High","tip":"string"}
`;
}
 
// ─── Analysis via Gemini (gemini-2.5-flash-lite-preview) ──────────────────────
 
async function analyzeWithGemini(
  combinedOcr: string,
  userText: string
): Promise<string> {
  const prompt = buildAnalysisPrompt(combinedOcr, userText);
 
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
        systemInstruction: {
          parts: [{ text: "You are a health assistant. Always output valid JSON only, with no markdown, no code fences, and no extra text." }],
        },
      }),
    }
  );
 
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error ${res.status}: ${err}`);
  }
 
  const data = await res.json();
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error("Gemini returned empty content");
  return content;
}
 
// ─── Analysis via Groq (Llama-3.3-70B) — fallback ────────────────────────────
 
async function analyzeWithGroq(
  combinedOcr: string,
  userText: string
): Promise<string> {
  const prompt = buildAnalysisPrompt(combinedOcr, userText);
 
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a health assistant. Always output valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    }),
  });
 
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq Analysis error ${res.status}: ${err}`);
  }
 
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "{}";
}
 
// ─── Analysis with Gemini-first, Groq fallback ────────────────────────────────
 
async function analyzeWithFallback(
  combinedOcr: string,
  userText: string
): Promise<string> {
  try {
    const result = await analyzeWithGemini(combinedOcr, userText);
    console.log("[predict] ✅ Gemini analysis succeeded");
    return result;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[predict] ⚠️  Gemini failed — falling back to Groq. Reason: ${reason}`);
    const result = await analyzeWithGroq(combinedOcr, userText);
    console.log("[predict] ✅ Groq fallback analysis succeeded");
    return result;
  }
}
 
// ─── Route handler ────────────────────────────────────────────────────────────
 
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userText = (formData.get("userText") as string) ?? "";
    const files = formData.getAll("file") as File[];
 
    const ocrResults = await Promise.all(
      files.slice(0, 5).map(async (file) => {
        const buf = await file.arrayBuffer();
        return processSingleImage(buf, file.type || "image/jpeg");
      })
    );
    const combinedOcr = ocrResults.filter(Boolean).join("\n");
 
    // Analysis: Gemini first, silently fall back to Groq Llama-3.3-70B on any error
    const rawJson = await analyzeWithFallback(combinedOcr, userText);
 
    let rawData: Record<string, unknown[]>;
    try {
      rawData = safeParseJson(rawJson);
    } catch {
      rawData = JSON.parse(rawJson);
    }
 
    const riskMap: Record<string, number> = { Low: 1, Medium: 2, High: 3 };
    const finalResults: Record<string, { ranking: unknown[] }> = {};
 
    for (const cat of ["Appetizer", "Main Dish", "Dessert", "Drinks"]) {
      const items = (rawData[cat] ?? []) as Record<string, any>[];
 
      for (const item of items) {
        item.sugar = cleanToNumber(item.sugar ?? 0);
        item.gi_val = cleanToNumber(item.gi_val ?? 55);
        item.c = cleanToNumber(item.c ?? 0);
        item.risk_score = riskMap[String(item.risk ?? "Medium")] ?? 2;
      }
 
      const sorted = [...items].sort((a, b) => {
        if (a.risk_score !== b.risk_score) return a.risk_score - b.risk_score;
        if (a.sugar !== b.sugar) return a.sugar - b.sugar;
        if (a.gi_val !== b.gi_val) return a.gi_val - b.gi_val;
        return a.c - b.c;
      });
 
      sorted.forEach((item: any) => delete item.risk_score);
      finalResults[cat] = { ranking: sorted.slice(0, 3) };
    }
 
    return NextResponse.json(finalResults);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
 