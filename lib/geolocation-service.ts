/**
 * Real-time Geolocation Service for GlobeSoS
 * Fetches nearby hospitals, NGOs, emergency centers using OpenStreetMap Nominatim and Overpass API
 */

export interface NearbyPlace {
  id: string
  name: string
  category: 'hospital' | 'clinic' | 'pharmacy' | 'police' | 'fire_station' | 'ngo' | 'emergency'
  lat: number
  lon: number
  distance?: number // in meters
  address?: string
  phone?: string
  website?: string
  openingHours?: string
  emergency?: boolean
  tags?: Record<string, string>
}

export interface GeolocationResult {
  success: boolean
  places: NearbyPlace[]
  userLocation: { lat: number; lon: number } | null
  error?: string
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

/**
 * Get user's current location
 */
export async function getUserLocation(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported')
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (error) => {
        console.error('Geolocation error:', error)
        resolve(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    )
  })
}

/**
 * Fetch nearby emergency places using Overpass API (OpenStreetMap data)
 * More reliable and comprehensive than Nominatim for POI searches
 */
export async function fetchNearbyPlaces(
  lat: number,
  lon: number,
  radiusMeters: number = 5000
): Promise<NearbyPlace[]> {
  try {
    // Overpass QL query for emergency-related amenities
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
        way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
        node["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
        way["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
        node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
        way["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
        node["amenity"="police"](around:${radiusMeters},${lat},${lon});
        way["amenity"="police"](around:${radiusMeters},${lat},${lon});
        node["amenity"="fire_station"](around:${radiusMeters},${lat},${lon});
        way["amenity"="fire_station"](around:${radiusMeters},${lat},${lon});
        node["emergency"](around:${radiusMeters},${lat},${lon});
        way["emergency"](around:${radiusMeters},${lat},${lon});
      );
      out center;
    `

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    })

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`)
    }

    const data = await response.json()
    const places: NearbyPlace[] = []

    // Process results
    data.elements.forEach((element: any) => {
      const tags = element.tags || {}
      
      // Determine coordinates (for ways, use center)
      const elementLat = element.center?.lat || element.lat
      const elementLon = element.center?.lon || element.lon
      
      if (!elementLat || !elementLon) return

      // Calculate distance
      const distance = calculateDistance(lat, lon, elementLat, elementLon)

      // Determine category
      let category: NearbyPlace['category'] = 'emergency'
      if (tags.amenity === 'hospital') category = 'hospital'
      else if (tags.amenity === 'clinic') category = 'clinic'
      else if (tags.amenity === 'pharmacy') category = 'pharmacy'
      else if (tags.amenity === 'police') category = 'police'
      else if (tags.amenity === 'fire_station') category = 'fire_station'
      else if (tags.office === 'ngo' || tags.office === 'charity') category = 'ngo'

      // Extract name (prefer name, fallback to operator or brand)
      const name = tags.name || tags.operator || tags.brand || `${category.replace('_', ' ')} (${element.id})`

      // Build address
      const addressParts = [
        tags['addr:housenumber'],
        tags['addr:street'],
        tags['addr:city'],
        tags['addr:postcode'],
      ].filter(Boolean)
      const address = addressParts.length > 0 ? addressParts.join(', ') : undefined

      places.push({
        id: `${element.type}-${element.id}`,
        name,
        category,
        lat: elementLat,
        lon: elementLon,
        distance,
        address,
        phone: tags.phone || tags['contact:phone'],
        website: tags.website || tags['contact:website'],
        openingHours: tags.opening_hours,
        emergency: tags.emergency === 'yes' || category === 'hospital',
        tags,
      })
    })

    // Sort by distance
    places.sort((a, b) => (a.distance || 0) - (b.distance || 0))

    return places
  } catch (error) {
    console.error('Error fetching nearby places:', error)
    throw error
  }
}

/**
 * Fetch nearby NGOs and aid organizations using Overpass API
 */
export async function fetchNearbyNGOs(
  lat: number,
  lon: number,
  radiusMeters: number = 10000
): Promise<NearbyPlace[]> {
  try {
    const query = `
      [out:json][timeout:25];
      (
        node["office"="ngo"](around:${radiusMeters},${lat},${lon});
        way["office"="ngo"](around:${radiusMeters},${lat},${lon});
        node["office"="charity"](around:${radiusMeters},${lat},${lon});
        way["office"="charity"](around:${radiusMeters},${lat},${lon});
        node["office"="association"](around:${radiusMeters},${lat},${lon});
        way["office"="association"](around:${radiusMeters},${lat},${lon});
      );
      out center;
    `

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    })

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`)
    }

    const data = await response.json()
    const ngos: NearbyPlace[] = []

    data.elements.forEach((element: any) => {
      const tags = element.tags || {}
      const elementLat = element.center?.lat || element.lat
      const elementLon = element.center?.lon || element.lon
      
      if (!elementLat || !elementLon) return

      const distance = calculateDistance(lat, lon, elementLat, elementLon)
      const name = tags.name || tags.operator || `NGO (${element.id})`

      const addressParts = [
        tags['addr:housenumber'],
        tags['addr:street'],
        tags['addr:city'],
      ].filter(Boolean)
      const address = addressParts.length > 0 ? addressParts.join(', ') : undefined

      ngos.push({
        id: `${element.type}-${element.id}`,
        name,
        category: 'ngo',
        lat: elementLat,
        lon: elementLon,
        distance,
        address,
        phone: tags.phone || tags['contact:phone'],
        website: tags.website || tags['contact:website'],
        tags,
      })
    })

    ngos.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    return ngos
  } catch (error) {
    console.error('Error fetching nearby NGOs:', error)
    throw error
  }
}

/**
 * Main function to get all nearby emergency resources
 */
export async function getNearbyEmergencyResources(
  radiusMeters: number = 5000
): Promise<GeolocationResult> {
  try {
    // Get user location
    const userLocation = await getUserLocation()
    
    if (!userLocation) {
      return {
        success: false,
        places: [],
        userLocation: null,
        error: 'Location permission denied or unavailable',
      }
    }

    // Fetch nearby places and NGOs in parallel
    const [places, ngos] = await Promise.all([
      fetchNearbyPlaces(userLocation.lat, userLocation.lon, radiusMeters),
      fetchNearbyNGOs(userLocation.lat, userLocation.lon, radiusMeters * 2), // Wider radius for NGOs
    ])

    // Combine and deduplicate
    const allPlaces = [...places, ...ngos]
    const uniquePlaces = Array.from(
      new Map(allPlaces.map(place => [place.id, place])).values()
    )

    return {
      success: true,
      places: uniquePlaces,
      userLocation,
    }
  } catch (error) {
    console.error('Error getting nearby emergency resources:', error)
    return {
      success: false,
      places: [],
      userLocation: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get category icon for display
 */
export function getCategoryIcon(category: NearbyPlace['category']): string {
  const icons: Record<NearbyPlace['category'], string> = {
    hospital: '🏥',
    clinic: '⚕️',
    pharmacy: '💊',
    police: '👮',
    fire_station: '🚒',
    ngo: '🤝',
    emergency: '🚨',
  }
  return icons[category] || '📍'
}

/**
 * Get category color for UI
 */
export function getCategoryColor(category: NearbyPlace['category']): string {
  const colors: Record<NearbyPlace['category'], string> = {
    hospital: 'text-red-600 dark:text-red-400',
    clinic: 'text-blue-600 dark:text-blue-400',
    pharmacy: 'text-green-600 dark:text-green-400',
    police: 'text-indigo-600 dark:text-indigo-400',
    fire_station: 'text-orange-600 dark:text-orange-400',
    ngo: 'text-purple-600 dark:text-purple-400',
    emergency: 'text-red-600 dark:text-red-400',
  }
  return colors[category] || 'text-gray-600 dark:text-gray-400'
}
