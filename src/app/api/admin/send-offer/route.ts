import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@/lib/supabase/server'
// import { requireAdmin } from '@/lib/auth-utils'
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'

interface OfferData {
  requestId: string
  offerLink: string
}

// Initialize Brevo API client
function createBrevoClient() {
  const apiInstance = new TransactionalEmailsApi()
  // Use the original working method with type assertion to bypass TypeScript protection
  ;(apiInstance as any).authentications.apiKey.apiKey = process.env.BREVO_API_KEY || ''
  return apiInstance
}

export async function POST(request: NextRequest) {
  try {
    // Require admin role
    await requireAdmin()
    
    console.log('Send offer API called')
    
    const { requestId, offerLink }: OfferData = await request.json()
    
    if (!requestId || !offerLink) {
      return NextResponse.json(
        { error: 'Missing required fields: requestId and offerLink' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(offerLink)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format for offer link' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get the member car request details
    const { data: memberRequest, error: fetchError } = await supabase
      .from('member_car_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !memberRequest) {
      console.error('Error fetching member request:', fetchError)
      return NextResponse.json(
        { error: 'Member request not found' },
        { status: 404 }
      )
    }

    // Save the offer to database
    const { error: insertError } = await supabase
      .from('offers')
      .insert({
        member_car_request_id: requestId,
        link: offerLink,
        sent_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error saving offer to database:', insertError)
      return NextResponse.json(
        { error: 'Failed to save offer' },
        { status: 500 }
      )
    }

    // Check if Brevo is configured
    const BREVO_API_KEY = process.env.BREVO_API_KEY
    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY is not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    // Create email content
    const carDetails = `${memberRequest.brand} ${memberRequest.model}${memberRequest.year ? ` ${memberRequest.year}` : ''}`
    
    const textContent = `
Bună ziua ${memberRequest.contact_name},

Ai primit un link pentru mașina ${carDetails}.

Link ofertă: ${offerLink}

Te rugăm să accesezi linkul pentru a vedea detaliile ofertei noastre.

Cu respect,
Echipa Automode

---
Automode - Import Mașini din Europa
Data: ${new Date().toLocaleDateString('ro-RO', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
`

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ofertă Mașină - ${carDetails}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .section { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 25px; margin-bottom: 20px; }
            .car-info { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .car-info h2 { color: #1e40af; margin: 0 0 10px 0; font-size: 24px; }
            .car-info p { color: #64748b; margin: 0; }
            .offer-button { 
                display: inline-block; 
                background: linear-gradient(135deg, #10b981, #059669); 
                color: white; 
                padding: 15px 30px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold; 
                font-size: 18px;
                margin: 20px 0;
                box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
            }
            .offer-button:hover { background: linear-gradient(135deg, #059669, #047857); }
            .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px; color: #64748b; }
            .link-fallback { background: #f1f5f9; padding: 15px; border-radius: 6px; margin: 10px 0; word-break: break-all; font-family: monospace; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚗 Ofertă Mașină</h1>
            <p>Ai primit o ofertă personalizată pentru mașina dorită</p>
        </div>

        <div class="section">
            <p>Bună ziua <strong>${memberRequest.contact_name}</strong>,</p>
            
            <p>Ai primit un link pentru mașina <strong>${carDetails}</strong>.</p>

            <div class="car-info">
                <h2>${carDetails}</h2>
                ${memberRequest.fuel_type ? `<p>Combustibil: ${memberRequest.fuel_type}</p>` : ''}
                ${memberRequest.transmission ? `<p>Transmisie: ${memberRequest.transmission}</p>` : ''}
                ${memberRequest.max_budget ? `<p>Buget solicitat: €${memberRequest.max_budget.toLocaleString()}</p>` : ''}
            </div>

            <div style="text-align: center;">
                <a href="${offerLink}" class="offer-button">Vezi Oferta</a>
            </div>

            <p><strong>Linkul către oferta ta:</strong></p>
            <div class="link-fallback">
                <a href="${offerLink}" style="color: #059669;">${offerLink}</a>
            </div>

            <p>Te rugăm să accesezi linkul pentru a vedea detaliile complete ale ofertei noastre.</p>
            
            <p>Dacă ai întrebări sau ai nevoie de clarificări suplimentare, nu ezita să ne contactezi.</p>
            
            <p>Cu respect,<br><strong>Echipa Automode</strong></p>
        </div>

        <div class="footer">
            <p><strong>Automode - Import Mașini din Europa</strong></p>
            <p>Aceasta este o ofertă personalizată pentru cererea ta de import.</p>
            <p>Data: ${new Date().toLocaleDateString('ro-RO', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </div>
    </body>
    </html>
    `

    // Send email to client
    try {
      const apiInstance = createBrevoClient()
      const emailMessage = new SendSmtpEmail()
      
      emailMessage.subject = `Ofertă pentru ${carDetails} - Automode`
      emailMessage.htmlContent = emailHtml
      emailMessage.textContent = textContent
      emailMessage.sender = { 
        name: 'Automode', 
        email: process.env.EMAIL_FROM || 'noreply@codemint.ro' 
      }
      
      emailMessage.to = [{
        email: memberRequest.contact_email,
        name: memberRequest.contact_name
      }]

      console.log('Sending offer email to:', memberRequest.contact_email)
      const result = await apiInstance.sendTransacEmail(emailMessage)
      
      console.log('Offer email sent successfully:', result.body?.messageId)
      
      return NextResponse.json({ 
        success: true, 
        messageId: result.body?.messageId,
        message: 'Offer email sent successfully' 
      })
      
    } catch (emailError) {
      console.error('Failed to send offer email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in send offer API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}