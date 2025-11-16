import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get("lat") || "0")
    const lng = parseFloat(searchParams.get("lng") || "0")
    const radius = parseInt(searchParams.get("radius") || "10") // km

    // Use Google Places API or OpenStreetMap Nominatim
    // For now, using Overpass API (OpenStreetMap) to find real nearby places
    
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius * 1000},${lat},${lng});
        node["amenity"="clinic"](around:${radius * 1000},${lat},${lng});
        node["amenity"="doctors"](around:${radius * 1000},${lat},${lng});
        node["emergency"="yes"](around:${radius * 1000},${lat},${lng});
      );
      out body;
    `

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`
      })

      if (!response.ok) {
        throw new Error('Overpass API error')
      }

      const data = await response.json()
      
      // Transform Overpass data to our format
      const responders = data.elements
        .filter((elem: any) => elem.tags?.name)
        .slice(0, 10) // Limit to 10
        .map((elem: any) => {
          const distance = calculateDistance(lat, lng, elem.lat, elem.lon)
          const responseTime = Math.round((distance / 60) * 60) // Assume 60 km/h average
          
          return {
            id: `osm-${elem.id}`,
            name: elem.tags.name,
            type: elem.tags.amenity === 'hospital' ? 'hospital' : 
                  elem.tags.amenity === 'clinic' ? 'clinic' : 'emergency',
            distance: `${distance.toFixed(1)} km`,
            responseTime: `${responseTime} min`,
            available: true,
            languages: ['English'], // Default
            contact: elem.tags.phone || elem.tags['contact:phone'] || 'N/A',
            address: elem.tags['addr:street'] ? 
              `${elem.tags['addr:street']}, ${elem.tags['addr:city'] || ''}` : 
              'Address not available',
            lat: elem.lat,
            lng: elem.lon,
            source: 'OpenStreetMap'
          }
        })

      return NextResponse.json({
        success: true,
        responders,
        count: responders.length,
        location: { lat, lng },
        radius: `${radius} km`
      })

    } catch (apiError) {
      console.warn('[Nearby API] External API failed, using mock data:', apiError)
      
      // Fallback to mock data
      const mockResponders = [
        {
          id: "mock-1",
          name: "City General Hospital",
          type: "hospital",
          distance: "0.8 km",
          responseTime: "5 min",
          available: true,
          languages: ["English", "Spanish", "French"],
          contact: "+1-555-0123",
          address: "123 Main St",
          source: "Mock Data (Enable location for real data)"
        },
        {
          id: "mock-2",
          name: "Emergency Response NGO",
          type: "ngo",
          distance: "1.2 km",
          responseTime: "8 min",
          available: true,
          languages: ["English", "Arabic", "Hindi"],
          contact: "+1-555-0456",
          address: "456 Oak Ave",
          source: "Mock Data"
        },
        {
          id: "mock-3",
          name: "Red Cross Medical Center",
          type: "hospital",
          distance: "2.1 km",
          responseTime: "12 min",
          available: true,
          languages: ["English", "Chinese", "Korean"],
          contact: "+1-555-0789",
          address: "789 Elm St",
          source: "Mock Data"
        },
        {
          id: "mock-4",
          name: "Community First Responders",
          type: "volunteer",
          distance: "0.5 km",
          responseTime: "3 min",
          available: true,
          languages: ["English", "Portuguese"],
          contact: "+1-555-0321",
          address: "321 Pine Rd",
          source: "Mock Data"
        }
      ]

      return NextResponse.json({
        success: true,
        responders: mockResponders,
        count: mockResponders.length,
        location: { lat, lng },
        radius: `${radius} km`,
        note: 'Using mock data. Provide valid coordinates for real nearby places.'
      })
    }

  } catch (error: any) {
    console.error('[Nearby API] Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
