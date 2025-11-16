"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  AlertTriangle, 
  Heart, 
  Flame, 
  Shield, 
  HelpCircle, 
  Send, 
  Loader2,
  MapPin,
  Phone,
  Radio,
  Clock,
  CheckCircle2,
  X,
  Mic,
  Upload,
  Info
} from "lucide-react"
import { VoiceInputV2 } from "@/components/voice-input-v2"
import { FileUploadV2 } from "@/components/file-upload-v2"
import { useGlobalTranslation } from "@/components/translation-provider"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface EmergencyType {
  id: string
  label: string
  description: string
  icon: any
  color: string
  gradient: string
}

export function SOSInterfaceV2() {
  const { t } = useGlobalTranslation()
  const { toast } = useToast()
  
  const [isActivating, setIsActivating] = useState(false)
  const [sosActive, setSosActive] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("medical")
  const [message, setMessage] = useState("")
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [panicTimer, setPanicTimer] = useState<number | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [alertId, setAlertId] = useState<string | null>(null)

  const emergencyTypes: EmergencyType[] = [
    {
      id: "medical",
      label: t("emergency.medicalEmergency"),
      description: t("emergency.medicalEmergencyDesc"),
      icon: Heart,
      color: "text-red-600",
      gradient: "from-red-500 to-pink-600"
    },
    {
      id: "fire",
      label: t("emergency.fireEmergency"),
      description: t("emergency.fireEmergencyDesc"),
      icon: Flame,
      color: "text-orange-600",
      gradient: "from-orange-500 to-red-600"
    },
    {
      id: "security",
      label: t("emergency.securityEmergency"),
      description: t("emergency.securityEmergencyDesc"),
      icon: Shield,
      color: "text-blue-600",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      id: "other",
      label: t("emergency.otherEmergency"),
      description: t("emergency.otherEmergencyDesc"),
      icon: HelpCircle,
      color: "text-gray-600",
      gradient: "from-gray-500 to-slate-600"
    }
  ]

  // Get user location on mount
  useEffect(() => {
    getLocation()
  }, [])

  // Panic timer countdown
  useEffect(() => {
    if (panicTimer !== null && panicTimer > 0) {
      const interval = setInterval(() => {
        setPanicTimer(prev => (prev !== null && prev > 0 ? prev - 1 : null))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [panicTimer])

  const getLocation = async () => {
    setLocationLoading(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })
      
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    } catch (error) {
      console.warn("Could not get location:", error)
      toast({
        title: t("locationError", "Location Error"),
        description: t("locationErrorDesc", "Using approximate location"),
        variant: "default"
      })
      // Use default location
      setLocation({ lat: 0, lng: 0 })
    } finally {
      setLocationLoading(false)
    }
  }

  const handleSOSClick = () => {
    if (sosActive) {
      cancelSOS()
      return
    }
    setShowDetails(true)
  }

  const handleQuickSOS = async () => {
    await sendSOS(true)
  }

  const sendSOS = async (quick: boolean = false) => {
    setIsActivating(true)

    try {
      // Validate location
      if (!location) {
        await getLocation()
        if (!location) {
          throw new Error("Location is required for SOS alerts")
        }
      }

      // Get current user (optional, works without auth)
      let userId = `guest-${Date.now()}`
      let userName = "Guest User"
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          userId = user.id
          userName = user.email || user.user_metadata?.name || "User"
        }
      } catch (authError) {
        console.warn('No authenticated user, using guest mode:', authError)
      }

      // Prepare alert data
      const alertData = {
        userId,
        userName,
        emergencyType: selectedType,
        urgencyLevel: "high",
        message: message || t("emergencyAlert", "Emergency alert"),
        location: {
          lat: location.lat,
          lng: location.lng,
          accuracy: 100
        },
        attachments: uploadedFiles.map(f => ({
          name: f.name,
          url: f.url,
          type: f.type,
          size: f.size
        })),
        metadata: {
          batteryLevel: await getBatteryLevel(),
          deviceInfo: navigator.userAgent,
          timestamp: new Date().toISOString(),
          quickSOS: quick
        }
      }

      // Send to API with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
        }
        console.error('API error response:', errorData)
        throw new Error(errorData.error || `Failed to send SOS alert (${response.status})`)
      }

      const result = await response.json()
      setAlertId(result.alert?.id || null)

      // Activate SOS mode
      setSosActive(true)
      setShowDetails(false)
      setPanicTimer(120) // 2 minutes

      // Request notification permission
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          await Notification.requestPermission()
        }
        
        if (Notification.permission === 'granted') {
          new Notification(t("alertActive", "Alert Active"), {
            body: t("respondersNotified", "Responders have been notified"),
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            tag: 'sos-alert',
            requireInteraction: true
          })
        }
      }

      toast({
        title: t("sosAlertSent", "SOS Alert Sent!"),
        description: t("respondersNotified", "Nearby responders have been notified"),
      })

    } catch (error: any) {
      console.error("Failed to send SOS:", error)
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      })
      
      let errorMessage = t("failedToSendSOS", "Failed to send SOS alert")
      if (error.name === 'AbortError') {
        errorMessage = t("requestTimeout", "Request timed out. Please check your connection and try again.")
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: t("error", "Error"),
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsActivating(false)
    }
  }

  const cancelSOS = () => {
    setSosActive(false)
    setPanicTimer(null)
    setShowDetails(false)
    setMessage("")
    setUploadedFiles([])
    setAlertId(null)

    toast({
      title: t("alertCancelled", "Alert Cancelled"),
      description: t("alertCancelledDesc", "Your SOS alert has been cancelled"),
    })
  }

  const handleVoiceTranscript = (transcript: string) => {
    setMessage(prev => prev ? `${prev} ${transcript}` : transcript)
  }

  const handleFileUpload = (files: any[]) => {
    setUploadedFiles(files)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getBatteryLevel = async (): Promise<number | undefined> => {
    if ('getBattery' in navigator) {
      try {
        const battery: any = await (navigator as any).getBattery()
        return Math.round(battery.level * 100)
      } catch {
        return undefined
      }
    }
    return undefined
  }

  const selectedEmergency = emergencyTypes.find(t => t.id === selectedType)

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Main SOS Card */}
      <Card className="overflow-hidden border-2 shadow-2xl">
        <div className="bg-gradient-to-br from-background via-muted/30 to-background p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-600 mb-4 shadow-lg">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground mb-2">
              {t("emergencyInterface", "Emergency SOS")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("helpInOneTap", "Get help in one tap - responders will be notified immediately")}
            </p>
          </div>

          {/* SOS Button - Initial State */}
          {!showDetails && !sosActive && (
            <div className="space-y-6">
              <Button
                size="lg"
                onClick={handleSOSClick}
                disabled={isActivating || locationLoading}
                className="w-full h-40 text-4xl font-bold bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-3xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
              >
                {isActivating ? (
                  <Loader2 className="w-16 h-16 animate-spin" />
                ) : locationLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-12 h-12 animate-spin" />
                    <span className="text-xl">Getting location...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <AlertTriangle className="w-20 h-20" />
                    <span>{t("sendSOS", "SEND SOS")}</span>
                  </div>
                )}
              </Button>

              {/* Feature Badges */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: MapPin, label: t("locationShared", "Location Shared"), color: "blue" },
                  { icon: Phone, label: t("instantContact", "Instant Contact"), color: "green" },
                  { icon: Radio, label: t("multilingualTranslation", "Multilingual"), color: "purple" },
                  { icon: Clock, label: t("autoEscalate", "Auto Escalate"), color: "orange" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-muted-foreground/10 hover:bg-muted/70 transition-colors">
                    <div className={`p-2 rounded-lg bg-${feature.color}-500/10`}>
                      <feature.icon className={`w-5 h-5 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Location Status */}
              {location && (
                <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>Location detected:</strong> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Active SOS State */}
          {sosActive && (
            <div className="space-y-6">
              <Alert className="border-red-500 bg-red-50 dark:bg-red-950/30 border-2">
                <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
                <AlertTitle className="text-red-900 dark:text-red-100 text-xl font-bold">
                  {t("alertActive", "🚨 SOS Alert Active")}
                </AlertTitle>
                <AlertDescription className="text-red-800 dark:text-red-200 text-base mt-2">
                  {t("respondersNotified", "Emergency responders have been notified and are on their way")}
                </AlertDescription>
              </Alert>

              {/* Timer and Status */}
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-300 dark:border-orange-700">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                        <span className="text-lg font-semibold">Broadcasting SOS Signal</span>
                      </div>
                      <Badge variant="destructive" className="text-base px-4 py-1">
                        ACTIVE
                      </Badge>
                    </div>

                    {panicTimer !== null && panicTimer > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Auto-escalation in:</span>
                          <span className="text-2xl font-mono font-bold text-orange-600">
                            {formatTime(panicTimer)}
                          </span>
                        </div>
                        <Progress value={((120 - panicTimer) / 120) * 100} className="h-2" />
                      </div>
                    )}

                    {alertId && (
                      <div className="text-xs text-muted-foreground">
                        Alert ID: <code className="bg-muted px-2 py-1 rounded">{alertId}</code>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cancel Button */}
              <Button
                variant="outline"
                size="lg"
                onClick={cancelSOS}
                className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold"
              >
                <X className="w-5 h-5 mr-2" />
                {t("cancelAlert", "Cancel Alert")}
              </Button>
            </div>
          )}

          {/* Emergency Details Form */}
          {showDetails && !sosActive && (
            <div className="space-y-6">
              {/* Emergency Type Selector */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  {t("emergencyType", "Select Emergency Type")}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {emergencyTypes.map((type) => {
                    const Icon = type.icon
                    const isSelected = selectedType === type.id
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-5 rounded-xl border-2 transition-all duration-200 text-left group ${
                          isSelected
                            ? 'border-primary bg-gradient-to-br ' + type.gradient + ' text-white shadow-lg scale-[1.02]'
                            : 'border-muted hover:border-primary/50 bg-background hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-muted'}`}>
                            <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : type.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-bold text-base mb-1 ${isSelected ? 'text-white' : 'text-foreground'}`}>
                              {type.label}
                            </div>
                            <div className={`text-sm ${isSelected ? 'text-white/90' : 'text-muted-foreground'}`}>
                              {type.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-3">
                <Label htmlFor="emergency-message" className="text-base font-semibold">
                  {t("additionalDetails", "Additional Details")} <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Textarea
                  id="emergency-message"
                  placeholder={t("describeEmergency", "Describe your emergency situation in detail...")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="resize-none text-base"
                />
                <p className="text-xs text-muted-foreground">
                  {message.length} characters
                </p>
              </div>

              {/* Voice Input */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  {t("voiceEmergencyDetails", "Or use voice to describe emergency")}
                </Label>
                <VoiceInputV2
                  onFinalTranscript={handleVoiceTranscript}
                  language="en-US"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  {t("attachFiles", "Attach Photos/Videos")} <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <FileUploadV2
                  onUploadComplete={handleFileUpload}
                  maxFiles={5}
                  maxSizeMB={10}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  size="lg"
                  onClick={() => sendSOS(false)}
                  disabled={isActivating}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {isActivating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t("broadcasting", "Broadcasting Emergency...")}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t("sendSOS", "Send SOS Alert")}
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleQuickSOS}
                  disabled={isActivating}
                  className="w-full h-12 text-base font-semibold"
                >
                  {t("skipDetails", "Send Quick SOS (No Details)")}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="w-full"
                >
                  {t("cancel", "Cancel")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Info Card */}
      {!sosActive && !showDetails && (
        <Card className="border-2">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              {t("howItWorks", "How It Works")}
            </h3>
            <div className="space-y-3">
              {emergencyTypes.map((type, idx) => {
                const Icon = type.icon
                return (
                  <div key={type.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="p-2 rounded-lg bg-background">
                      <Icon className={`w-5 h-5 ${type.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
