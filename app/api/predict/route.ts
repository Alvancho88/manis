import { NextRequest, NextResponse } from "next/server"

// Clean string values to numbers
function cleanToNumber(value: unknown): number {
  if (typeof value === "number") return value
  const cleaned = String(value).replace(/[^\d.]/g, "")
  try {
    return cleaned.includes(".") ? parseFloat(cleaned) : parseInt(cleaned, 10)
  } catch {
    return 0
  }
}

// Process a single image with Llama Vision via Groq
async function processImageOCR(imageBase64: string): Promise<string> {
  const groqApiKey = process.env.GROQ_API_KEY
  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY is not set")
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "List food/drink names exactly as written on this menu." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      console.error("[v0] Groq OCR error:", await response.text())
      return ""
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ""
  } catch (error) {
    console.error("[v0] OCR processing error:", error)
    return ""
  }
}

// Analyze food items with Gemini
async function analyzeWithGemini(
  combinedOCR: string,
  userText: string
): Promise<Record<string, { ranking: FoodItem[] }>> {
  const geminiApiKey = process.env.GEMINI_API_KEY
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not set")
  }

  const prompt = `
CONTEXT:
Menu OCR: ${combinedOCR}
USER MANUAL INPUT: ${userText}

TASK:
1. Extract items from BOTH Menu OCR AND USER MANUAL INPUT. 
2. Categorize: 'Appetizer', 'Main Dish', 'Dessert', 'Drinks'.
3. For items like 'Air Putih' or 'Mineral Water', prioritize them in 'Drinks'.
4. Estimate: Sugar(g), Calories(kcal), GI Value(0-100), and Risk (Low, Medium, High).
5. Provide a tip for EVERY item in English.

RANKING LOGIC:
- Priority 1: Risk (Low > Medium > High)
- Priority 2: Sugar (Lowest first)
- Priority 3: GI Value (Lowest first)
- Priority 4 (TIE-BREAKER): Calories (Lowest first). 
  Example: If Lettuce and Gizzard have same Risk/Sugar/GI, Lettuce MUST rank higher because of lower calories.

Output ONLY valid JSON with this exact structure:
{
    "Appetizer": [],
    "Main Dish": [],
    "Dessert": [],
    "Drinks": []
}

Each item in the arrays should have this structure:
{"f": "food name", "sugar": number, "c": number, "gi_val": number, "risk": "Low" or "Medium" or "High", "tip": "health tip string"}
`

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`
    console.log("[v0] Calling Gemini model: gemini-2.0-flash")
    const response = await fetch(geminiUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Gemini API error status:", response.status, errorText)
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] Gemini raw response:", JSON.stringify(data).slice(0, 500))
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textContent) {
      console.error("[v0] No text content in Gemini response, full response:", JSON.stringify(data))
      return { Appetizer: { ranking: [] }, "Main Dish": { ranking: [] }, Dessert: { ranking: [] }, Drinks: { ranking: [] } }
    }

    // Parse the JSON response
    const rawData = JSON.parse(textContent)
    return processAndRankResults(rawData)
  } catch (error) {
    console.error("[v0] Gemini analysis error:", error)
    throw error
  }
}

interface RawFoodItem {
  f: string
  sugar: number | string
  c: number | string
  gi_val: number | string
  risk: string
  tip: string
}

interface FoodItem {
  name: string
  risk: string
  sugar: string
  calories: string
  gi: string
  tip: { en: string; ms: string; zh: string }
}

// Process and rank results from Gemini
function processAndRankResults(
  rawData: Record<string, RawFoodItem[]>
): Record<string, { ranking: FoodItem[] }> {
  const riskMap: Record<string, number> = { Low: 1, Medium: 2, High: 3 }
  const finalResults: Record<string, { ranking: FoodItem[] }> = {}

  for (const category of ["Appetizer", "Main Dish", "Dessert", "Drinks"]) {
    const items = rawData[category] || []

    // Clean and add risk score for sorting
    const processedItems = items.map((item) => ({
      ...item,
      sugar: cleanToNumber(item.sugar),
      gi_val: cleanToNumber(item.gi_val),
      c: cleanToNumber(item.c),
      risk_score: riskMap[item.risk] || 2,
    }))

    // Sort by: risk_score, sugar, gi_val, calories
    const sortedItems = processedItems.sort((a, b) => {
      if (a.risk_score !== b.risk_score) return a.risk_score - b.risk_score
      if (a.sugar !== b.sugar) return a.sugar - b.sugar
      if (a.gi_val !== b.gi_val) return a.gi_val - b.gi_val
      return a.c - b.c
    })

    // Transform to the format expected by the frontend
    const ranking: FoodItem[] = sortedItems.map((item) => ({
      name: item.f,
      risk: item.risk.toLowerCase(),
      sugar: `${item.sugar}g`,
      calories: `${item.c}`,
      gi: `${item.gi_val}`,
      tip: {
        en: item.tip,
        ms: item.tip, // For now, use the same tip - can be translated later
        zh: item.tip,
      },
    }))

    finalResults[category] = { ranking }
  }

  return finalResults
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userText = (formData.get("userText") as string) || ""
    const files = formData.getAll("file") as File[]

    console.log("[v0] Received files:", files.length, "userText:", userText)

    // Limit to max 5 files
    const filesToProcess = files.slice(0, 5)

    // Process all images in parallel for OCR
    const ocrPromises = filesToProcess.map(async (file, i) => {
      console.log(`[v0] Processing file ${i}: ${file.name}, size: ${file.size}`)
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString("base64")
      return processImageOCR(base64)
    })

    const ocrResults = await Promise.all(ocrPromises)
    const combinedOCR = ocrResults.filter(Boolean).join("\n")

    console.log("[v0] Combined OCR:", combinedOCR || "(empty)")

    // If no OCR results and no user text, return empty results
    if (!combinedOCR && !userText.trim()) {
      console.log("[v0] No input - returning empty results")
      return NextResponse.json({
        Appetizer: { ranking: [] },
        "Main Dish": { ranking: [] },
        Dessert: { ranking: [] },
        Drinks: { ranking: [] },
      })
    }

    // Analyze with Gemini
    const results = await analyzeWithGemini(combinedOCR, userText)

    console.log("[v0] Returning results for categories:", Object.keys(results))

    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Predict API error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    )
  }
}
