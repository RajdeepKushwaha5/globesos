"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, MapPin, User, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Alert {
  id: string
  emergency_type: string
  urgency_level: string
  message: string
  location: any
  created_at: string
  status: string
  user_id: string
}

export function ActiveAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial alerts
    fetchAlerts()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('alerts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
          filter: `status=in.(active,responding)`,
        },
        (payload) => {
          console.log('Alert change received:', payload)
          if (payload.eventType === 'INSERT') {
            setAlerts(prev => [payload.new as Alert, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setAlerts(prev => prev.map(alert =>
              alert.id === payload.new.id ? payload.new as Alert : alert
            ))
          } else if (payload.eventType === 'DELETE') {
            setAlerts(prev => prev.filter(alert => alert.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .in('status', ['active', 'responding'])
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setAlerts(data || [])
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffMs = now.getTime() - alertTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  const getPriorityColor = (urgencyLevel: string) => {
    switch (urgencyLevel) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="p-4 border-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">Active Alerts</h3>
            <Badge variant="secondary" className="animate-pulse">
              Loading...
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Real-time emergency alerts in your area</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 border-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">Active Alerts</h3>
          <Badge variant="destructive" className="animate-pulse">
            {alerts.filter((a) => a.status === "active").length} Active
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Real-time emergency alerts in your area</p>
      </Card>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No active alerts in your area</p>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="p-4 border-l-4" style={{ borderLeftColor: getPriorityColor(alert.urgency_level) }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`w-5 h-5 ${alert.urgency_level === "critical" ? "text-red-500" : "text-orange-500"}`}
                  />
                  <h4 className="font-semibold text-sm text-card-foreground">{alert.emergency_type}</h4>
                </div>
                <Badge variant={alert.status === "active" ? "destructive" : "secondary"} className="text-xs">
                  {alert.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span>{alert.location?.address || 'Location unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(alert.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span>User ID: {alert.user_id.slice(0, 8)}...</span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-card-foreground">{alert.message}</p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                  View Details
                </Button>
                {alert.status === "active" && (
                  <Button size="sm" className="flex-1 text-xs">
                    <Phone className="w-3 h-3 mr-1" />
                    Respond
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <Card className="p-4 bg-muted/30">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">Showing alerts within 10km radius</p>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            Expand Search Area
          </Button>
        </div>
      </Card>
    </div>
  )
}
