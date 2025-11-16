
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useGlobalTranslation } from "@/components/translation-provider"

const SPECIALIZATIONS = [
  { value: "medical", label: "become.responder.specializations.medical" },
  { value: "fire", label: "become.responder.specializations.fire" },
  { value: "rescue", label: "become.responder.specializations.rescue" },
  { value: "trauma", label: "become.responder.specializations.trauma" },
  { value: "first-aid", label: "become.responder.specializations.firstAid" },
  { value: "support", label: "become.responder.specializations.support" },
]

export function BecomeResponder() {
  const { t } = useGlobalTranslation()
  const [organization, setOrganization] = useState("")
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])
  const [responseRadius, setResponseRadius] = useState(10)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResponder, setIsResponder] = useState(false)
  const { toast } = useToast()

  const toggleSpecialization = (spec: string) => {
    setSelectedSpecs(prev =>
      prev.includes(spec)
        ? prev.filter(s => s !== spec)
        : [...prev, spec]
    )
  }

  const handleSubmit = async () => {
    if (!organization.trim()) {
      toast({
        title: t('become.responder.organizationRequired', 'Organization required'),
        description: t('become.responder.organizationRequiredDesc', 'Please enter your organization name'),
        variant: "destructive"
      })
      return
    }

    if (selectedSpecs.length === 0) {
      toast({
        title: t('become.responder.specializationRequired', 'Specialization required'),
        description: t('become.responder.specializationRequiredDesc', 'Please select at least one specialization'),
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Create responder profile
      const { error: responderError } = await supabase
        .from('responders')
        .upsert({
          user_id: user.id,
          organization,
          verification_status: 'verified', // Auto-verify for now
          specializations: selectedSpecs,
          active: true,
          response_radius: responseRadius
        })

      if (responderError) throw responderError

      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords

          // Get responder ID
          const { data: responderData } = await supabase
            .from('responders')
            .select('id')
            .eq('user_id', user.id)
            .single()

          if (responderData) {
            // Insert/update location
            await supabase
              .from('responder_locations')
              .upsert({
                responder_id: responderData.id,
                latitude,
                longitude,
                status: 'available',
                accuracy: position.coords.accuracy
              })
          }
        })
      }

      setIsResponder(true)
      toast({
        title: "Success!",
        description: "You are now registered as a responder",
      })

      // Start location tracking
      startLocationTracking()

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const startLocationTracking = () => {
    if (!navigator.geolocation) return

    // Update location every 30 seconds
    setInterval(async () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: responderData } = await supabase
          .from('responders')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (responderData) {
          await supabase
            .from('responder_locations')
            .upsert({
              responder_id: responderData.id,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              status: 'available',
              accuracy: position.coords.accuracy,
              last_updated: new Date().toISOString()
            })
        }
      })
    }, 30000) // Every 30 seconds
  }

  if (isResponder) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h3 className="text-2xl font-bold">You're a Responder!</h3>
          <p className="text-muted-foreground">
            Your location is being tracked and you'll receive emergency alerts in your area.
          </p>
          <Badge variant="default" className="text-lg px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Active
          </Badge>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Become a Responder</h3>
          <p className="text-muted-foreground">
            Help people in your area by registering as an emergency responder
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="organization">Organization / Name</Label>
            <Input
              id="organization"
              placeholder={t('become.responder.placeholder.organization', 'e.g., City Hospital, Fire Dept, Volunteer')}
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>

          <div>
            <Label>Specializations</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SPECIALIZATIONS.map(spec => (
                <Badge
                  key={spec.value}
                  variant={selectedSpecs.includes(spec.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSpecialization(spec.value)}
                >
                  {t(spec.label, spec.label.split('.').pop() || spec.label)}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="radius">Response Radius (km)</Label>
            <Input
              id="radius"
              type="number"
              min="1"
              max="50"
              value={responseRadius}
              onChange={(e) => setResponseRadius(parseInt(e.target.value) || 10)}
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Location Tracking</p>
                <p className="text-muted-foreground">
                  Your location will be tracked in real-time to help emergency services find the nearest responders.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Registering..." : "Register as Responder"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
