import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint is being migrated to Firebase' },
    { status: 503 }
  )
}
