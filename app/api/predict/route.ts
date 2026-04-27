import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;
const TEST_API_KEY = process.env.GROQ_API_KEY;

/**
 * processOCR: Uses Llama 4 Scout with a "Proximity Anchor" prompt.
 */
async function processOCR(arrayBuffer: ArrayBuffer, mimeType: string) {
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TEST_API_KEY}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a menu analysis engine. Extract every unique food and drink item.

DETECTION STRATEGY (Adaptive):
1. IF PRICES EXIST: Use prices or codes (A1, RM10) as anchors to identify valid items.
2. IF NO PRICES EXIST: Identify items based on list structure. Look for:
   - Items aligned in a vertical column.
   - Text preceded by bullet points, icons, or checkboxes.
   - Text positioned directly below or next to a food photo.
3. HIERARCHY RULE: Identify and IGNORE large category headers (e.g., "NASI GORENG", "DRINKS"). Only extract the specific sub-items listed under them.
4. DECORATION RULE: Ignore generic background illustrations that are not part of the structured list.

Formatting:
- Return ONLY valid JSON: {"items": ["Item 1", "Item 2"]}`,
            },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // Low temperature for high accuracy
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }

  return await response.json();
}

/**
 * Robust parsing that handles markdown, conversational text, and JSON arrays.
 */
function parseItemsFromResponse(rawContent: string): string[] {
  if (!rawContent || typeof rawContent !== "string") return [];
  const trimmed = rawContent.trim();

  // 1. Direct JSON parse
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed.items)) return parsed.items;
  } catch (e) {}

  // 2. Regex Shield: Extract JSON block if the model talked before the brackets
  const jsonMatch = trimmed.match(/\{[\s\S]*"items"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed.items)) return parsed.items;
    } catch (e) {}
  }

  // 3. Fallback: Plain text split by comma or newline
  return trimmed
    .split(/[,\n]/)
    .map((s) => s.replace(/^[-•*\d.)\s]+/, "").trim())
    .filter((s) => s.length > 1 && s.length < 100);
}

/**
 * Case-insensitive deduplication.
 */
function deduplicateItems(items: string[]): string[] {
  const seen = new Map<string, string>();
  for (const item of items) {
    const key = item.toLowerCase().trim().replace(/\s+/g, " ");
    if (!seen.has(key)) {
      seen.set(key, item.trim());
    }
  }
  return Array.from(seen.values());
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (files.length === 0)
      return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const buffer = await files[0].arrayBuffer();
    const ocrResult = await processOCR(buffer, files[0].type);

    const rawContent = ocrResult.choices[0]?.message?.content || "";
    const parsedItems = parseItemsFromResponse(rawContent);
    const uniqueItems = deduplicateItems(parsedItems);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      model: "llama-4-scout-17b",
      scanned_items: uniqueItems,
      item_count: uniqueItems.length,
    });
  } catch (error: any) {
    console.error("OCR Route Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}