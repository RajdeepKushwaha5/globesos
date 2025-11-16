"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Hospital, Building2, Users, Phone, MapPin, Clock, Loader2 } from "lucide-react"

interface Responder {
  id: string
  name: string
  type: string
  distance: string
  responseTime: string
  available: boolean
  languages: string[]
  contact: string
  address?: string
  source?: string
}

const getIcon = (type: string) => {
  switch (type) {
    case "hospital":
      return Hospital
    case "ngo":
      return Building2
    case "volunteer":
      return Users
    default:
      return MapPin
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "hospital":
      return "bg-red-500/10 text-red-700 dark:text-red-400"
    case "ngo":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    case "volunteer":
      return "bg-green-500/10 text-green-700 dark:text-green-400"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

export function NearbyResponders() {
  const [responders, setResponders] = useState<Responder[]>([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)

  useEffect(() => {
    // Get user location
    const getLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // Cache for 5 minutes
          })
        })
        
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setUserLocation(loc)
        fetchNearbyResponders(loc.lat, loc.lng)
      } catch (error) {
        console.warn('Location not available:', error)
        // Fetch with default location (will get mock data)
        fetchNearbyResponders(0, 0)
      }
    }

    const fetchNearbyResponders = async (lat: number, lng: number) => {
      try {
        const response = await fetch(`/api/nearby?lat=${lat}&lng=${lng}&radius=10`)
        const data = await response.json()
        if (data.success) {
          setResponders(data.responders || [])
        }
      } catch (error) {
        console.error('Failed to fetch responders:', error)
      } finally {
        setLoading(false)
      }
    }

    getLocation()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="p-4 border-2">
          <h3 className="font-semibold mb-2 text-foreground">Nearby Responders</h3>
          <p className="text-sm text-muted-foreground">Verified emergency services in your area</p>
        </Card>
        <Card className="p-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Loading nearby responders...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 border-2">
        <h3 className="font-semibold mb-2 text-foreground">Nearby Responders</h3>
        <p className="text-sm text-muted-foreground">Verified emergency services in your area</p>
      </Card>

      <div className="space-y-3">
        {responders.map((responder) => {
          const Icon = getIcon(responder.type)
          return (
            <Card key={responder.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(responder.type)}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-card-foreground">{responder.name}</h4>
                    {responder.available && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                        Online
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{responder.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>~{responder.responseTime} response</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{responder.contact}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {responder.languages.slice(0, 2).map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                    {responder.languages.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{responder.languages.length - 2}
                      </Badge>
                    )}
                  </div>

                  <Button size="sm" className="w-full">
                    Contact Responder
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
