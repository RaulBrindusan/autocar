import { NextRequest, NextResponse } from 'next/server'
import { sendCarRequestEmail, sendCustomerConfirmationEmail, type CarRequestEmailData } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const data: CarRequestEmailData = await request.json()

    if (!data.make || !data.model || !data.year || !data.budget || !data.name || !data.phone || !data.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let teamResult, customerResult

    try {
      teamResult = await sendCarRequestEmail(data)
    } catch (err) {
      console.error('Failed to send team notification email:', err)
      throw err
    }

    try {
      customerResult = await sendCustomerConfirmationEmail(data)
    } catch (err) {
      console.error('Failed to send customer confirmation email:', err)
      // Non-fatal — continue
    }

    return NextResponse.json({
      success: true,
      teamMessageId: teamResult?.data?.id ?? null,
      customerMessageId: customerResult?.data?.id ?? null,
    })
  } catch (error) {
    console.error('Error in car request email API:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
