import { NextResponse } from "next/server"
import { LingoDotDevEngine } from "lingo.dev/sdk"

// Initialize Lingo.dev SDK
const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGO_API_KEY || process.env.NEXT_PUBLIC_LINGO_API_KEY || "",
})

export async function POST(req: Request) {
  try {
    const { text, targetLang, sourceLang } = await req.json()

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Missing required fields: text, targetLang" },
        { status: 400 }
      )
    }

    const lingoKey = process.env.LINGO_API_KEY || process.env.NEXT_PUBLIC_LINGO_API_KEY

    if (!lingoKey) {
      console.error("LINGO_API_KEY not found in environment")
      return NextResponse.json({
        originalText: text,
        translatedText: text,
        sourceLang: sourceLang || "en",
        targetLang,
        confidence: 0,
        provider: "none",
        error: "Lingo.dev API key not configured",
      })
    }

    console.log("Using Lingo.dev to translate:", { text, targetLang, sourceLang })

    try {
      // Use Lingo.dev SDK for translation
      // localizeText(text: string, targetLocale: string, sourceLocale?: string)
      const translatedText = await lingoDotDev.localizeText(
        text,
        targetLang,
        sourceLang
      )

      console.log("✅ Lingo.dev Translation:", {
        original: text,
        translated: translatedText,
        targetLang
      })

      return NextResponse.json({
        originalText: text,
        translatedText: translatedText,
        sourceLang: sourceLang || "auto",
        targetLang,
        confidence: 0.95,
        provider: "lingo.dev",
      })
    } catch (lingoError: any) {
      console.error("❌ Lingo.dev translation error:", lingoError.message || lingoError)

      // Fallback to original text
      return NextResponse.json({
        originalText: text,
        translatedText: text,
        sourceLang: sourceLang || "en",
        targetLang,
        confidence: 0,
        provider: "fallback",
        error: lingoError.message || "Translation failed",
      })
    }

  } catch (error: any) {
    console.error("❌ Translation error:", error.message || error)

    const body = await req.json().catch(() => ({ text: "", targetLang: "en" }))

    return NextResponse.json({
      originalText: body.text,
      translatedText: body.text,
      sourceLang: body.sourceLang || "en",
      targetLang: body.targetLang,
      confidence: 0,
      provider: "error",
      error: error.message || "Translation failed",
    })
  }
}

