import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const radius = searchParams.get("radius") || "5000" // 5km in meters

  if (!lat || !lng) {
    return NextResponse.json({ error: "Location parameters required" }, { status: 400 })
  }

  try {
    // Query responders from database with location
    const { data: responders, error } = await supabase
      .from('responders')
      .select(`
        id,
        organization,
        verification_status,
        specializations,
        available,
        user_id,
        profiles!inner(
          email
        ),
        responder_locations!inner(
          location,
          updated_at
        )
      `)
      .eq('available', true)
      .eq('verification_status', 'verified')
      .order('responder_locations(updated_at)', { ascending: false })

    if (error) {
      console.error('Error fetching responders:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate distances and filter by radius
    const userLat = parseFloat(lat)
    const userLng = parseFloat(lng)
    const radiusKm = parseFloat(radius) / 1000

    const nearbyResponders = (responders || [])
      .map(responder => {
        const location = responder.responder_locations?.[0]?.location
        if (!location?.lat || !location?.lng) return null

        // Haversine formula for distance calculation
        const R = 6371 // Earth's radius in km
        const dLat = (location.lat - userLat) * Math.PI / 180
        const dLng = (location.lng - userLng) * Math.PI / 180
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(userLat * Math.PI / 180) * Math.cos(location.lat * Math.PI / 180) *
          Math.sin(dLng/2) * Math.sin(dLng/2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        const distance = R * c

        if (distance > radiusKm) return null

        return {
          id: responder.id,
          name: responder.organization,
          type: responder.specializations?.[0] || 'responder',
          location: {
            lat: location.lat,
            lng: location.lng
          },
          distance: Math.round(distance * 1000), // Convert to meters
          available: responder.available,
          verified: responder.verification_status === 'verified',
          contact: responder.profiles?.email,
          specializations: responder.specializations
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance)

    return NextResponse.json({
      success: true,
      responders: nearbyResponders,
      total: nearbyResponders.length
    })

  } catch (error) {
    console.error('Error in responders API:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}