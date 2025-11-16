/**
 * Advanced i18n Provider with Creative Lingo.dev Features
 * 
 * Features:
 * - Automatic language detection (geo-based, browser, IP)
 * - RTL layout support
 * - Emergency translation priorities
 * - Offline support
 * - Translation analytics
 * - Smart language suggestions
 */

"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { locales, defaultLocale, isRTL, getLocaleByCode } from './config'
import { lingoService } from './lingo-service'

interface I18nContextType {
  locale: string
  setLocale: (locale: string) => void
  changeLocale: (locale: string) => void // Alias for setLocale
  t: (key: string, fallback?: string) => string
  translateText: (text: string, targetLang?: string) => Promise<string>
  detectLanguage: (text: string) => Promise<string>
  isRTL: boolean
  availableLocales: typeof locales
  isLoading: boolean
  autoDetectLanguage: () => Promise<string | null>
  preloadEmergencyTranslations: () => Promise<void>
  getSuggestedLanguage: () => Promise<string>
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
  defaultLocale?: string
}

const STORAGE_KEY = 'globesos-locale'
const GEO_CACHE_KEY = 'globesos-geo-locale'
const GEO_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Fallback English translations - always available
const ENGLISH_TRANSLATIONS: Record<string, string> = {
  "navigation.home": "Home",
  "navigation.about": "About",
  "navigation.map": "Emergency Map",
  "navigation.responders": "NGOs & Hospitals",
  "navigation.contact": "Contact",
  "navigation.docs": "Documentation",
  "navigation.safety": "Safety Guidelines",
  "navigation.support": "Contact Support",
  "navigation.join": "Join Network",
  "navigation.portal": "Responder Portal",
  "navigation.dashboard": "Dashboard",
  "navigation.login": "Login",
  "navigation.register": "Register",
  "navigation.logout": "Logout",
  "home.hero.title": "Global Emergency Response Platform",
  "home.hero.subtitle": "AI-driven multilingual emergency translation and coordination",
  "home.hero.cta.emergency": "Send Emergency Alert",
  "home.hero.cta.join": "Join as Responder",
  "home.emergencyResponseWithoutBorders": "Emergency Response Without Borders",
  "home.aiPoweredPlatformDescription": "AI-powered multilingual emergency response platform connecting people in crisis with verified responders worldwide"
}

export function I18nProvider({ children, defaultLocale: initialLocale = defaultLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<string>(initialLocale)
  const [isLoading, setIsLoading] = useState(false)
  const [translations, setTranslations] = useState<Record<string, string>>(ENGLISH_TRANSLATIONS)

  /**
   * Initialize locale from storage or detection
   */
  useEffect(() => {
    const initializeLocale = async () => {
      // 1. Check user's saved preference
      const savedLocale = localStorage.getItem(STORAGE_KEY)
      if (savedLocale && locales.find(l => l.code === savedLocale)) {
        setLocaleState(savedLocale)
        await loadTranslations(savedLocale)
        return
      }

      // 2. Try automatic detection
      const detected = await autoDetectLanguage()
      if (detected) {
        setLocaleState(detected)
        await loadTranslations(detected)
        return
      }

      // 3. Fallback to default - load immediately
      setLocaleState(initialLocale)
      await loadTranslations(initialLocale)
    }

    initializeLocale()
  }, [])

  /**
   * Update document direction for RTL
   */
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr'
      document.documentElement.lang = locale
      
      // Add RTL class for styling
      if (isRTL(locale)) {
        document.documentElement.classList.add('rtl')
      } else {
        document.documentElement.classList.remove('rtl')
      }
    }
  }, [locale])

  /**
   * Load translations for a locale
   */
  const loadTranslations = async (localeCode: string) => {
    setIsLoading(true)
    try {
      // For English, use immediate fallback to ensure it always works
      if (localeCode === 'en') {
        setTranslations(ENGLISH_TRANSLATIONS)
        setIsLoading(false)
        return
      }
      
      // Try to fetch from server for other languages
      const response = await fetch(`/i18n/locales/${localeCode}.json`)
      
      if (response.ok) {
        const data = await response.json()
        setTranslations(data)
      } else {
        // Load fallback translations
        await loadFallbackTranslations(localeCode)
      }
    } catch (error) {
      // Load fallback translations
      await loadFallbackTranslations(localeCode)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Load fallback translations (hardcoded English)
   */
  const loadFallbackTranslations = async (localeCode: string) => {
    setTranslations(ENGLISH_TRANSLATIONS)
  }

  /**
   * Change locale
   */
  const setLocale = useCallback(async (newLocale: string) => {
    if (newLocale === locale) return
    
    const localeConfig = getLocaleByCode(newLocale)
    if (!localeConfig) {
      console.warn(`Invalid locale: ${newLocale}`)
      return
    }

    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
    await loadTranslations(newLocale)

    // Track language change
    trackLanguageChange(newLocale)
    
    // Force reload to ensure entire website updates immediately
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }, [locale])

  /**
   * Translate a key (supports nested keys like "navigation.home")
   */
  const t = useCallback((key: string, fallback?: string): string => {
    // Support nested keys
    const getValue = (obj: any, path: string): string | undefined => {
      const keys = path.split('.')
      let current = obj
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k]
        } else {
          return undefined
        }
      }
      return typeof current === 'string' ? current : undefined
    }

    // First check loaded translations
    const value = getValue(translations, key)
    if (value) {
      return value
    }
    
    // Then check cache (for flat keys)
    if (!key.includes('.')) {
      const cached = lingoService['getCached'](key, locale)
      if (cached) return cached
    }

    // Finally check English fallback translations
    const englishValue = ENGLISH_TRANSLATIONS[key]
    if (englishValue) {
      return englishValue
    }

    // Return fallback or key
    return fallback || key
  }, [translations, locale])

  /**
   * Translate arbitrary text
   */
  const translateText = useCallback(async (text: string, targetLang?: string): Promise<string> => {
    const target = targetLang || locale
    return await lingoService.translateText(text, target, 'en')
  }, [locale])

  /**
   * Detect language of text
   */
  const detectLanguage = useCallback(async (text: string): Promise<string> => {
    return await lingoService.detectLanguage(text)
  }, [])

  /**
   * Auto-detect user's language
   */
  const autoDetectLanguage = useCallback(async (): Promise<string | null> => {
    // 1. Check geo-cached locale
    const geoCache = localStorage.getItem(GEO_CACHE_KEY)
    if (geoCache) {
      try {
        const { locale: cachedLocale, timestamp } = JSON.parse(geoCache)
        if (Date.now() - timestamp < GEO_CACHE_DURATION) {
          return cachedLocale
        }
      } catch (e) {
        // Invalid cache
      }
    }

    // 2. Try browser geolocation
    const geoLocale = await detectFromGeolocation()
    if (geoLocale) {
      // Cache the result
      localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({
        locale: geoLocale,
        timestamp: Date.now(),
      }))
      return geoLocale
    }

    // 3. Try browser language
    const browserLocale = detectFromBrowser()
    if (browserLocale) return browserLocale

    // 4. Try IP geolocation (if API available)
    const ipLocale = await detectFromIP()
    if (ipLocale) return ipLocale

    return null
  }, [])

  /**
   * Get suggested language based on context
   */
  const getSuggestedLanguage = useCallback(async (): Promise<string> => {
    const detected = await autoDetectLanguage()
    return detected || defaultLocale
  }, [])

  /**
   * Preload emergency translations
   */
  const preloadEmergencyTranslations = useCallback(async () => {
    await lingoService.preloadEmergencyTranslations(locale)
  }, [locale])

  const value: I18nContextType = {
    locale,
    setLocale,
    changeLocale: setLocale, // Alias for backwards compatibility
    t,
    translateText,
    detectLanguage,
    isRTL: isRTL(locale),
    availableLocales: locales,
    isLoading,
    autoDetectLanguage,
    preloadEmergencyTranslations,
    getSuggestedLanguage,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/**
 * Hook to use i18n context
 */
export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

/**
 * Detect locale from browser geolocation
 */
async function detectFromGeolocation(): Promise<string | null> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return null
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get country
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
          )
          
          if (response.ok) {
            const data = await response.json()
            const countryCode = data.countryCode?.toLowerCase()
            
            // Map country to locale
            const localeMap: Record<string, string> = {
              'us': 'en', 'gb': 'en', 'ca': 'en', 'au': 'en',
              'es': 'es', 'mx': 'es', 'ar': 'es', 'co': 'es',
              'fr': 'fr', 'be': 'fr', 'ch': 'fr',
              'de': 'de', 'at': 'de',
              'it': 'it',
              'pt': 'pt', 'br': 'pt',
              'ru': 'ru',
              'cn': 'zh', 'tw': 'zh-TW', 'hk': 'zh-TW',
              'jp': 'ja',
              'kr': 'ko',
              'sa': 'ar', 'ae': 'ar', 'eg': 'ar',
              'in': 'hi',
              'nl': 'nl',
              'pl': 'pl',
              'tr': 'tr',
              'se': 'sv',
              'il': 'he',
              'ir': 'fa',
              'pk': 'ur',
              'bd': 'bn',
              'vn': 'vi',
              'th': 'th',
              'id': 'id',
            }
            
            const detectedLocale = localeMap[countryCode]
            if (detectedLocale && locales.find(l => l.code === detectedLocale)) {
              resolve(detectedLocale)
              return
            }
          }
        } catch (error) {
          console.error('Geolocation API error:', error)
        }
        resolve(null)
      },
      () => resolve(null),
      { timeout: 5000 }
    )
  })
}

/**
 * Detect locale from browser settings
 */
function detectFromBrowser(): string | null {
  if (typeof navigator === 'undefined') return null

  const browserLang = navigator.language || (navigator as any).userLanguage
  if (!browserLang) return null

  // Try exact match first
  const exactMatch = locales.find(l => l.code === browserLang.toLowerCase())
  if (exactMatch) return exactMatch.code

  // Try language prefix (e.g., 'en-US' -> 'en')
  const prefix = browserLang.split('-')[0].toLowerCase()
  const prefixMatch = locales.find(l => l.code === prefix)
  if (prefixMatch) return prefixMatch.code

  return null
}

/**
 * Detect locale from IP address
 */
async function detectFromIP(): Promise<string | null> {
  try {
    const response = await fetch('https://ipapi.co/json/')
    if (response.ok) {
      const data = await response.json()
      const countryCode = data.country_code?.toLowerCase()
      
      // Reuse the country-to-locale mapping
      // (simplified version - you can import from detectFromGeolocation)
      const localeMap: Record<string, string> = {
        'us': 'en', 'gb': 'en',
        'es': 'es', 'mx': 'es',
        'fr': 'fr',
        'de': 'de',
        'cn': 'zh',
        'jp': 'ja',
        'kr': 'ko',
        // Add more as needed
      }
      
      const detectedLocale = localeMap[countryCode]
      if (detectedLocale && locales.find(l => l.code === detectedLocale)) {
        return detectedLocale
      }
    }
  } catch (error) {
    console.error('IP geolocation error:', error)
  }
  
  return null
}

/**
 * Track language change for analytics
 */
function trackLanguageChange(newLocale: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'language_change', {
      event_category: 'i18n',
      event_label: newLocale,
    })
  }
}
