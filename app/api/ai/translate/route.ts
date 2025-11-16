import { NextResponse } from "next/server"

/**
 * Translation API - REDIRECT TO LINGO.DEV
 * This redirects to /api/lingo/translate to use ONLY Lingo.dev
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Redirect to Lingo.dev translation endpoint
    const response = await fetch(new URL('/api/lingo/translate', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Translation proxy error:", error.message || error)
    
    return NextResponse.json({
      originalText: "",
      translatedText: "",
      sourceLang: "en",
      targetLang: "en",
      confidence: 0,
      provider: "error",
      error: error.message || "Translation failed",
    })
  }
}
