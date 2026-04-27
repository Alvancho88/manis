import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// API Keys
const PRIMARY_KEY = process.env.GROQ_API_KEY;
const BACKUP_KEY = process.env.GROQ_API_KEY_2;

/**
 * Executes the OCR request with a specific API key.
 */
async function executeGroqRequest(apiKey: string, base64: string, mimeType: string) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
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
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Groq API Error");
  }

  return await response.json();
}

/**
 * processOCR: Implements Failover logic between Primary and Backup keys.
 */
async function processOCR(arrayBuffer: ArrayBuffer, mimeType: string) {
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  try {
    // Attempt 1: Primary Key
    console.log("Attempting OCR with Primary Key...");
    return await executeGroqRequest(PRIMARY_KEY!, base64, mimeType);
  } catch (primaryError: any) {
    console.warn("Primary Key failed, attempting Backup Key...", primaryError.message);
    
    if (!BACKUP_KEY) {
      throw new Error("Primary failed and no Backup Key configured.");
    }

    // Attempt 2: Backup Key
    return await executeGroqRequest(BACKUP_KEY, base64, mimeType);
  }
}

/**
 * Robust parsing for JSON items.
 */
function parseItemsFromResponse(rawContent: string): string[] {
  if (!rawContent || typeof rawContent !== "string") return [];
  const trimmed = rawContent.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed.items)) return parsed.items;
  } catch (e) {}

  const jsonMatch = trimmed.match(/\{[\s\S]*"items"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed.items)) return parsed.items;
    } catch (e) {}
  }

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
      { error: "OCR Failed", details: error.message },
      { status: 500 }
    );
  }
}