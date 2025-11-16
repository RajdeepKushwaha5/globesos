import { generateText } from "ai"

export interface TranslationResult {
  originalText: string
  translatedText: string
  sourceLang: string
  targetLang: string
  confidence: number
  emergencyType?: string
}

export interface LanguageOption {
  code: string
  name: string
  nativeName: string
  flag: string
}

// GlobeSOS supported languages (9 languages)
export const supportedLanguages: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
]

/**
 * Translate text using Lingo.dev API
 * This is the unified translation function for the entire app
 */
export async function translateText(text: string, targetLang: string, sourceLang = "auto"): Promise<TranslationResult> {
  // Use Lingo.dev API route (works on both client and server)
  try {
    const baseUrl = typeof window === 'undefined' 
      ? (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      : ''
    
    const response = await fetch(`${baseUrl}/api/lingo/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang: sourceLang === "auto" ? undefined : sourceLang,
      })
    })
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error("Translation error:", error)
    return {
      originalText: text,
      translatedText: text,
      sourceLang: sourceLang === "auto" ? "en" : sourceLang,
      targetLang,
      confidence: 0,
    }
  }
}

/**
 * Detect emergency type using simple keyword matching
 */
export async function classifyEmergency(message: string): Promise<{
  type: string
  severity: "low" | "medium" | "high" | "critical"
  keywords: string[]
}> {
  try {
    const lowerMessage = message.toLowerCase()

    // Simple keyword-based classification
    const emergencyKeywords = {
      fire: ["fire", "burning", "smoke", "flames", "arson"],
      medical: ["injury", "hurt", "pain", "bleeding", "unconscious", "heart", "attack"],
      disaster: ["earthquake", "flood", "storm", "hurricane", "tornado", "tsunami"],
      security: ["attack", "threat", "violence", "weapon", "danger", "intruder"],
      general: []
    }

    let highestSeverity: "low" | "medium" | "high" | "critical" = "low"
    let detectedType = "general"
    const foundKeywords: string[] = []

    for (const [type, keywords] of Object.entries(emergencyKeywords)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          foundKeywords.push(keyword)
          detectedType = type

          // Determine severity based on keywords
          if (["attack", "threat", "weapon", "unconscious", "bleeding"].some(k => lowerMessage.includes(k))) {
            highestSeverity = "critical"
          } else if (["fire", "flood", "earthquake", "heart"].some(k => lowerMessage.includes(k))) {
            highestSeverity = "high"
          } else {
            highestSeverity = "medium"
          }
        }
      }
    }

    return {
      type: detectedType,
      severity: highestSeverity,
      keywords: foundKeywords
    }
  } catch (error) {
    console.error("Classification error:", error)
    return {
      type: "general",
      severity: "medium",
      keywords: [],
    }
  }
}

/**
 * Detect language of text using Lingo.dev SDK
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    const response = await fetch('/api/lingo/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    
    if (!response.ok) {
      throw new Error(`Language detection API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.detectedLang || "en"
  } catch (error) {
    console.error("Language detection error:", error)
    return "en" // Default to English
  }
}

/**
 * Batch translate multiple messages
 */
export async function batchTranslate(
  messages: Array<{ text: string; targetLang: string }>,
  sourceLang = "auto",
): Promise<TranslationResult[]> {
  const translations = await Promise.all(messages.map((msg) => translateText(msg.text, msg.targetLang, sourceLang)))
  return translations
}

// Simple language detection based on common patterns
function detectLanguageSimple(text: string): string {
  // Very basic detection - in production use proper language detection
  if (/[àáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/.test(text.toLowerCase())) return "fr"
  if (/[áéíóúüñ¿¡]/.test(text.toLowerCase())) return "es"
  if (/[àèéìíîòóùú]/.test(text.toLowerCase())) return "it"
  if (/[äöüß]/.test(text.toLowerCase())) return "de"
  if (/[çğışöü]/.test(text.toLowerCase())) return "tr"
  if (/[а-яё]/.test(text.toLowerCase())) return "ru"
  if (/[αβγδεζηθικλμνξοπρστυφχψω]/.test(text.toLowerCase())) return "el"
  if (/[абвгдеёжзийклмнопрстуфхцчшщъыьэюя]/.test(text.toLowerCase())) return "ru"
  return "en" // Default to English
}

// Simple translation fallback
async function simpleTranslate(text: string, targetLang: string): Promise<string> {
  // For demo purposes, return a mock translation
  // In production, integrate with Google Gemini or other translation service

  const mockTranslations: Record<string, Record<string, string>> = {
    "Hello": {
      "es": "Hola",
      "fr": "Bonjour",
      "de": "Hallo",
      "it": "Ciao",
      "pt": "Olá",
      "ru": "Привет",
      "zh": "你好",
      "ja": "こんにちは",
      "ko": "안녕하세요"
    },
    "Help": {
      "es": "Ayuda",
      "fr": "Aide",
      "de": "Hilfe",
      "it": "Aiuto",
      "pt": "Ajuda",
      "ru": "Помощь",
      "zh": "帮助",
      "ja": "助けて",
      "ko": "도와주세요"
    },
    "Emergency": {
      "es": "Emergencia",
      "fr": "Urgence",
      "de": "Notfall",
      "it": "Emergenza",
      "pt": "Emergência",
      "ru": "Чрезвычайная ситуация",
      "zh": "紧急情况",
      "ja": "緊急事態",
      "ko": "비상사태"
    },
    "Fire": {
      "es": "Fuego",
      "fr": "Feu",
      "de": "Feuer",
      "it": "Fuoco",
      "pt": "Fogo",
      "ru": "Пожар",
      "zh": "火",
      "ja": "火事",
      "ko": "화재"
    },
    "Police": {
      "es": "Policía",
      "fr": "Police",
      "de": "Polizei",
      "it": "Polizia",
      "pt": "Polícia",
      "ru": "Полиция",
      "zh": "警察",
      "ja": "警察",
      "ko": "경찰"
    }
  }

  // Check for exact matches first
  const lowerText = text.toLowerCase()
  for (const [english, translations] of Object.entries(mockTranslations)) {
    if (lowerText.includes(english.toLowerCase())) {
      const translation = translations[targetLang]
      if (translation) {
        return text.replace(new RegExp(english, 'i'), translation)
      }
    }
  }

  // If no exact match, try Google Gemini as fallback (when API is working)
  try {
    // Temporarily disabled due to API issues
    // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
    // const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    // const prompt = `Translate "${text}" to ${targetLang}. Return only the translation.`
    // const result = await model.generateContent(prompt)
    // return result.response.text().trim()
  } catch (error) {
    console.error("Google Gemini fallback failed:", error)
  }

  // Final fallback: return original text with a note
  return `${text} [Translation to ${targetLang} - Service temporarily unavailable]`
}