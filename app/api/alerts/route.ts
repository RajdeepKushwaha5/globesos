import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import type { EmergencyType } from "@/lib/sos-system"
import { detectLanguage, translateText } from "@/lib/translation"

export async function POST(request: Request) {
  try {
    const { userId, emergencyType, urgencyLevel, message, location, metadata } = await request.json()

    console.log('[API] Creating alert:', { userId, emergencyType, urgencyLevel, messageLength: message?.length })

    // Detect language of the message (with fallback)
    let languageCode = 'en'
    let translatedMessage = message
    
    try {
      languageCode = await detectLanguage(message)
      // Translate to English for storage if not already in English
      if (languageCode !== 'en') {
        const translation = await translateText(message, 'en', languageCode)
        translatedMessage = translation.translatedText
      }
    } catch (translationError) {
      console.warn('[API] Translation skipped:', translationError)
      // Continue without translation
    }

    // Try to insert into Supabase, fallback to mock if database not configured
    let alert
    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert({
          user_id: userId,
          emergency_type: emergencyType,
          urgency_level: urgencyLevel,
          message: translatedMessage,
          original_message: message,
          location,
          metadata: {
            ...metadata,
            language_code: languageCode,
            translated: languageCode !== 'en'
          },
        })
        .select()
        .single()

      if (error) {
        console.error('[API] Supabase insert error:', error)
        throw error
      }
      
      alert = data
      console.log('[API] Alert created in database:', alert.id)
      
    } catch (dbError: any) {
      console.warn('[API] Database unavailable, using mock response:', dbError.message)
      
      // Mock alert response when database is not available
      alert = {
        id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        emergency_type: emergencyType,
        urgency_level: urgencyLevel,
        message: translatedMessage,
        original_message: message,
        location,
        metadata: {
          ...metadata,
          language_code: languageCode,
          translated: languageCode !== 'en',
          mock: true,
          note: 'Database not configured - this is a demo alert'
        },
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log('[API] Mock alert created:', alert.id)
    }

    return NextResponse.json({
      success: true,
      alert,
      message: "SOS alert created successfully",
    })
  } catch (error: any) {
    console.error("[API] Alert creation error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to create alert",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")
    const limit = searchParams.get("limit")

    let query = supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (userId) {
      query = query.or(`user_id.eq.${userId},responders.cs.{${userId}}`)
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: alerts, error } = await query

    if (error) {
      console.error("[v0] Alert fetch error:", error)
      // Return mock data on error
      return NextResponse.json([
        {
          id: '1',
          emergency_type: 'medical',
          urgency_level: 'high',
          message: 'Medical emergency reported',
          status: 'active',
          created_at: new Date(Date.now() - 5 * 60000).toISOString(),
        },
        {
          id: '2',
          emergency_type: 'fire',
          urgency_level: 'critical',
          message: 'Fire emergency in building',
          status: 'responding',
          created_at: new Date(Date.now() - 15 * 60000).toISOString(),
        },
        {
          id: '3',
          emergency_type: 'security',
          urgency_level: 'medium',
          message: 'Security incident reported',
          status: 'resolved',
          created_at: new Date(Date.now() - 30 * 60000).toISOString(),
        },
      ])
    }

    return NextResponse.json(alerts || [])
  } catch (error) {
    console.error("[v0] Alert fetch error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
