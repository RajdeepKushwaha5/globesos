import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, CheckCircle, AlertTriangle, Clock, MapPin, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Responder {
  id: string
  name: string
  organization: string
  verified: boolean
  trust_score: number
  specializations: string[]
  response_time: number
  distance: number
  status: 'available' | 'busy' | 'offline'
  last_active: string
  certifications: string[]
}

interface VerificationBadgeProps {
  responder: Responder
}

export function VerificationBadge({ responder }: VerificationBadgeProps) {
  const getVerificationLevel = () => {
    if (responder.trust_score >= 95) return { level: 'elite', color: 'bg-purple-500', icon: Shield }
    if (responder.trust_score >= 85) return { level: 'verified', color: 'bg-blue-500', icon: CheckCircle }
    if (responder.trust_score >= 70) return { level: 'trusted', color: 'bg-green-500', icon: CheckCircle }
    return { level: 'basic', color: 'bg-gray-500', icon: AlertTriangle }
  }

  const verification = getVerificationLevel()
  const Icon = verification.icon

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className={`${verification.color} text-white border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {verification.level.charAt(0).toUpperCase() + verification.level.slice(1)}
      </Badge>
      <span className="text-xs text-muted-foreground">
        {responder.trust_score}% trust score
      </span>
    </div>
  )
}

interface ResponderCardProps {
  responder: Responder
  onContact?: (responder: Responder) => void
}

export function ResponderCard({ responder, onContact }: ResponderCardProps) {
  const getStatusColor = () => {
    switch (responder.status) {
      case 'available': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    switch (responder.status) {
      case 'available': return 'Available'
      case 'busy': return 'Responding'
      case 'offline': return 'Offline'
      default: return 'Unknown'
    }
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage src={`/avatars/${responder.id}.jpg`} />
            <AvatarFallback>
              {responder.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor()}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm truncate">{responder.name}</h3>
            <span className="text-xs text-muted-foreground">
              {responder.distance.toFixed(1)}km away
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-2">{responder.organization}</p>

          <VerificationBadge responder={responder} />

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {responder.response_time}min avg
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {getStatusText()}
            </div>
          </div>

          {responder.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {responder.certifications.slice(0, 3).map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                  {cert}
                </Badge>
              ))}
              {responder.certifications.length > 3 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{responder.certifications.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onContact?.(responder)}
              disabled={responder.status === 'offline'}
            >
              <Phone className="w-3 h-3 mr-1" />
              Contact
            </Button>
            <Button size="sm" variant="ghost">
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface ResponderVerificationProps {
  userId?: string
}

export function ResponderVerification({ userId }: ResponderVerificationProps) {
  const [responders, setResponders] = useState<Responder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResponder, setSelectedResponder] = useState<Responder | null>(null)

  useEffect(() => {
    if (userId) {
      fetchNearbyResponders()
    }
  }, [userId])

  const fetchNearbyResponders = async () => {
    try {
      // In a real implementation, this would use geolocation to find nearby responders
      // For now, we'll fetch all responders with their verification status
      const { data, error } = await supabase
        .from('responders')
        .select('*')
        .eq('status', 'available')
        .order('trust_score', { ascending: false })
        .limit(10)

      if (error) throw error

      // Transform the data to match our Responder interface
      const transformedResponders: Responder[] = (data || []).map(r => ({
        id: r.id,
        name: r.name,
        organization: r.organization || 'Independent',
        verified: r.verified || false,
        trust_score: r.trust_score || 75,
        specializations: r.specializations || [],
        response_time: r.response_time || 15,
        distance: Math.random() * 10, // Mock distance
        status: r.status as any,
        last_active: r.last_active || new Date().toISOString(),
        certifications: r.certifications || []
      }))

      setResponders(transformedResponders)
    } catch (error) {
      console.error('Error fetching responders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContactResponder = (responder: Responder) => {
    setSelectedResponder(responder)
    // In a real implementation, this would initiate contact (call, chat, etc.)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Verified Responders</h3>
        <Badge variant="secondary">
          {responders.length} available
        </Badge>
      </div>

      {responders.length === 0 ? (
        <Card className="p-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h4 className="font-medium mb-2">No Responders Available</h4>
          <p className="text-sm text-muted-foreground">
            There are currently no verified responders in your area.
          </p>
        </Card>
      ) : (
        responders.map((responder) => (
          <ResponderCard
            key={responder.id}
            responder={responder}
            onContact={handleContactResponder}
          />
        ))
      )}

      {/* Contact Modal/Dialog would go here */}
      {selectedResponder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="font-semibold mb-4">Contact {selectedResponder.name}</h3>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => {/* Implement call logic */}}>
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {/* Implement chat logic */}}>
                Start Chat
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setSelectedResponder(null)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}