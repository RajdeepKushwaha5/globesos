import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // For demo, return mock alert
    const alert = {
      id: params.id,
      status: "active",
      responders: [],
      userId: "user-123",
      location: { lat: 40.7128, lng: -74.006 },
      urgencyLevel: "high",
      timestamp: new Date(),
    }

    return NextResponse.json(alert)
  } catch (error) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    console.log("[GlobeSoS] Updating alert:", params.id, updates)

    // In production: Update in database
    // await supabase.from('alerts').update(updates).eq('id', params.id)

    return NextResponse.json({
      success: true,
      message: "Alert updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 })
  }
}
