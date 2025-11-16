"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, MessageSquare, Phone, MoreVertical } from "lucide-react"
import { useGlobalTranslation } from "@/components/translation-provider"

const alerts = [
  {
    id: "ALT-2401",
    type: "Medical Emergency",
    location: "Downtown Plaza, 1.2km",
    time: "2 min ago",
    priority: "critical",
    status: "active",
    responder: "Team Alpha",
    language: "EN",
  },
  {
    id: "ALT-2402",
    type: "Fire Incident",
    location: "West Avenue, 3.5km",
    time: "8 min ago",
    priority: "high",
    status: "responding",
    responder: "Team Bravo",
    language: "ES",
  },
  {
    id: "ALT-2403",
    type: "Traffic Accident",
    location: "Highway 101, 5.1km",
    time: "15 min ago",
    priority: "medium",
    status: "responding",
    responder: "Team Charlie",
    language: "FR",
  },
  {
    id: "ALT-2404",
    type: "Lost Child",
    location: "City Park, 0.8km",
    time: "22 min ago",
    priority: "high",
    status: "active",
    responder: "Unassigned",
    language: "ZH",
  },
  {
    id: "ALT-2405",
    type: "Health Crisis",
    location: "Shopping Mall, 2.3km",
    time: "35 min ago",
    priority: "medium",
    status: "resolved",
    responder: "Team Delta",
    language: "AR",
  },
]

export function AlertsTable() {
  const { t } = useGlobalTranslation()
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "responding":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "resolved":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  return (
    <Card className="border-2">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recent Alerts</h2>
            <p className="text-sm text-muted-foreground mt-1">Real-time emergency alerts requiring attention</p>
          </div>
          <Button>{t('dashboard.stats.viewAll', 'View All')}</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr className="border-b">
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Alert ID</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Type</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Location</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Priority</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Responder</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-b hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="font-mono text-sm text-foreground">{alert.id}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-foreground">{alert.type}</div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {alert.language}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {alert.location}
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={getPriorityColor(alert.priority) as any} className="capitalize">
                    {alert.priority}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge className={`capitalize ${getStatusColor(alert.status)}`}>{alert.status}</Badge>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{alert.responder}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
