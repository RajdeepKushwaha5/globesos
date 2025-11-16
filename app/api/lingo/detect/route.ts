import { NextResponse } from "next/server"
import { LingoDotDevEngine } from "lingo.dev/sdk"

// Initialize Lingo.dev SDK
const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGO_API_KEY || process.env.NEXT_PUBLIC_LINGO_API_KEY || "",
})

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: "Missing required field: text" },
        { status: 400 }
      )
    }

    // Check if API key is configured
    if (!process.env.LINGO_API_KEY && !process.env.NEXT_PUBLIC_LINGO_API_KEY) {
      console.error("Lingo.dev API key not configured")
      return NextResponse.json({
        detectedLang: "en",
        language: "en",
        confidence: 0,
        provider: "fallback",
        error: "API key not configured",
      })
    }

    // Detect language using Lingo.dev SDK
    try {
      const detectedLang = await lingoDotDev.recognizeLocale(text)

      return NextResponse.json({
        detectedLang,
        language: detectedLang, // For backward compatibility
        confidence: 1.0,
        provider: "lingo.dev",
      })
    } catch (lingoError: any) {
      console.error("Lingo.dev language detection error:", lingoError)
      
      // Fallback to English
      return NextResponse.json({
        detectedLang: "en",
        language: "en",
        confidence: 0,
        provider: "fallback",
        error: lingoError.message || "Detection failed",
      })
    }
  } catch (error: any) {
    console.error("Language detection API error:", error)
    return NextResponse.json(
      { error: "Language detection failed", details: error.message },
      { status: 500 }
    )
  }
}