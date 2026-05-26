import { NextRequest, NextResponse } from 'next/server'
import { sendOpenLaneEmail, type OpenLaneEmailData } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const data: OpenLaneEmailData = await request.json()

    if (!data.url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const result = await sendOpenLaneEmail(data)

    return NextResponse.json({ success: true, messageId: result?.data?.id ?? null })
  } catch (error) {
    console.error('Error in OpenLane email API:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
