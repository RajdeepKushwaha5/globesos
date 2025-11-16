import { NextResponse } from "next/server"
import { classifyEmergency } from "@/lib/translation"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const classification = await classifyEmergency(message)

    return NextResponse.json(classification)
  } catch (error) {
    console.error("Classification API error:", error)
    return NextResponse.json({ error: "Classification failed" }, { status: 500 })
  }
}
