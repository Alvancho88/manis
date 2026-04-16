import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// Use Key 1 for testing to isolate from live environment
const TEST_API_KEY = process.env.GROQ_API_KEY;

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
              text: "List every food and drink item visible. Return ONLY a JSON object with a key 'items' containing an array of strings." 
            },
            { 
              type: "image_url", 
              image_url: { url: `data:${mimeType};base64,${base64}` } 
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // Set low for consistent extraction
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }

  return await response.json();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    
    if (files.length === 0) return NextResponse.json({ error: "No image" }, { status: 400 });

    const buffer = await files[0].arrayBuffer();
    const ocrResult = await processOCR(buffer, files[0].type);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      model: "llama-4-scout-17b",
      scanned_items: ocrResult.choices[0].message.content
    });
  } catch (error: any) {
    console.error("OCR Test Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}