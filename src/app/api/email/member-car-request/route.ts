import { NextRequest, NextResponse } from 'next/server'
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'

interface MemberCarRequestData {
  brand: string
  model: string
  year?: number
  fuel_type?: string
  transmission?: string
  max_mileage_km?: number
  max_budget: number
  required_features?: string[]
  additional_notes?: string
  contact_name: string
  contact_email: string
  contact_phone?: string
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
    console.log('Member car request email API called')
    console.log('Environment variables check:')
    console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'SET' : 'NOT SET')
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM)
    console.log('EMAIL_TO:', process.env.EMAIL_TO)
    
    const data: MemberCarRequestData = await request.json()
    console.log('Received data:', JSON.stringify(data, null, 2))
    
    const BREVO_API_KEY = process.env.BREVO_API_KEY
    
    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY is not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    // Validate required fields
    if (!data.brand || !data.model || !data.max_budget || !data.contact_name || !data.contact_email) {
      console.error('Missing required fields:', { 
        brand: data.brand, 
        model: data.model, 
        max_budget: data.max_budget,
        contact_name: data.contact_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone || 'Not provided'
      })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Map fuel types for display
    const getFuelTypeDisplay = (fuelType?: string) => {
      const fuelMap: { [key: string]: string } = {
        'gasoline': 'Benzină',
        'diesel': 'Motorină',
        'hybrid': 'Hibrid',
        'electric': 'Electric',
        'other': 'Altul'
      }
      return fuelType ? fuelMap[fuelType] || fuelType : 'Nu este specificat'
    }

    // Map transmission types for display
    const getTransmissionDisplay = (transmission?: string) => {
      const transMap: { [key: string]: string } = {
        'manual': 'Manuală',
        'automatic': 'Automată',
        'cvt': 'CVT',
        'other': 'Altul'
      }
      return transmission ? transMap[transmission] || transmission : 'Nu este specificat'
    }

    // Format features for display
    const formatFeatures = (features?: string[]) => {
      if (!features || features.length === 0) return 'Niciuna specificată'
      return features.map(feature => `• ${feature}`).join('\n')
    }

    // Create text content for the email
    const featuresText = data.required_features && data.required_features.length > 0
      ? `\n\nCaracteristici dorite:\n${formatFeatures(data.required_features)}`
      : ''

    const notesText = data.additional_notes 
      ? `\n\nObservații suplimentare:\n${data.additional_notes}`
      : ''

    const textContent = `
Cerere membru pentru import mașină:

DETALII VEHICUL:
• Marca: ${data.brand}
• Model: ${data.model}
• An: ${data.year || 'Nu este specificat'}
• Combustibil: ${getFuelTypeDisplay(data.fuel_type)}
• Transmisie: ${getTransmissionDisplay(data.transmission)}
• Kilometraj maxim: ${data.max_mileage_km ? `${data.max_mileage_km.toLocaleString()} km` : 'Nu este specificat'}

INFORMAȚII FINANCIARE:
• Buget maxim: €${data.max_budget.toLocaleString()}${featuresText}${notesText}

INFORMAȚII CONTACT MEMBRU:
• Nume: ${data.contact_name}
• Email: ${data.contact_email}
• Telefon: ${data.contact_phone || 'Nu este specificat'}

---
Trimis de pe automode.ro
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
        <title>Cerere Membru - ${data.brand} ${data.model}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 20px; }
            .section h2 { color: #1e40af; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
            .info-item { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; }
            .info-label { font-weight: bold; color: #374151; font-size: 14px; margin-bottom: 5px; }
            .info-value { color: #111827; font-size: 16px; }
            .full-width { grid-column: 1 / -1; }
            .features { background: white; padding: 15px; border-radius: 6px; white-space: pre-line; }
            .budget { background: #ecfdf5; border-left-color: #10b981; }
            .budget .info-value { color: #047857; font-weight: bold; font-size: 18px; }
            .contact-info { background: #eff6ff; }
            .member-badge { background: #dc2626; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 10px; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px; color: #64748b; }
            @media (max-width: 600px) {
                .info-grid { grid-template-columns: 1fr; }
                body { padding: 10px; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="member-badge">MEMBRU ÎNREGISTRAT</div>
            <h1>Cerere Membru</h1>
            <p>O nouă cerere pentru importul unei mașini din Europa</p>
        </div>

        <div class="section">
            <h2>🚗 Detalii Vehicul</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Marca</div>
                    <div class="info-value">${data.brand}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Model</div>
                    <div class="info-value">${data.model}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Anul</div>
                    <div class="info-value">${data.year || 'Nu este specificat'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Combustibil</div>
                    <div class="info-value">${getFuelTypeDisplay(data.fuel_type)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Transmisie</div>
                    <div class="info-value">${getTransmissionDisplay(data.transmission)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Kilometraj Maxim</div>
                    <div class="info-value">${data.max_mileage_km ? `${data.max_mileage_km.toLocaleString()} km` : 'Nu este specificat'}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>💰 Informații Financiare</h2>
            <div class="info-item budget">
                <div class="info-label">Buget Maxim</div>
                <div class="info-value">€${data.max_budget.toLocaleString()}</div>
            </div>
        </div>

        ${data.required_features && data.required_features.length > 0 ? `
        <div class="section">
            <h2>⚙️ Caracteristici Dorite</h2>
            <div class="features">
${formatFeatures(data.required_features)}
            </div>
        </div>
        ` : ''}

        ${data.additional_notes ? `
        <div class="section">
            <h2>📝 Observații Suplimentare</h2>
            <div class="info-item full-width">
                <div class="info-value">${data.additional_notes}</div>
            </div>
        </div>
        ` : ''}

        <div class="section contact-info">
            <h2>👤 Informații Contact Membru</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Nume</div>
                    <div class="info-value">${data.contact_name}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${data.contact_email}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Telefon</div>
                    <div class="info-value">${data.contact_phone || 'Nu este specificat'}</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p><strong>Automode - Import Mașini din Europa</strong></p>
            <p>Această cerere a fost trimisă de un membru înregistrat prin platforma Automode.</p>
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

    console.log('Attempting to send member car request email via Brevo SDK...')
    console.log('Email will be sent from:', process.env.EMAIL_FROM)
    console.log('Email will be sent to:', process.env.EMAIL_TO)

    try {
      const apiInstance = createBrevoClient()

      console.log('Creating email message...')
      const emailMessage = new SendSmtpEmail()
      emailMessage.subject = `Cerere Membru - ${data.brand} ${data.model} (${data.contact_name})`
      emailMessage.htmlContent = emailHtml
      emailMessage.textContent = textContent
      emailMessage.sender = { 
        name: 'Automode', 
        email: process.env.EMAIL_FROM || 'noreply@codemint.ro' 
      }
      
      // Parse multiple email addresses like the working version
      const emailToString = process.env.EMAIL_TO || 'contact@codemint.ro'
      const emailAddresses = emailToString.split(',').map(email => email.trim())
      emailMessage.to = emailAddresses.map(email => ({ 
        email: email, 
        name: 'Automode Team' 
      }))

      console.log('Email message created, sending...')
      const result = await apiInstance.sendTransacEmail(emailMessage)
      
      console.log('Member car request email sent successfully via Brevo SDK:', result.body?.messageId)
      
      return NextResponse.json({ 
        success: true, 
        messageId: result.body?.messageId,
        message: 'Member car request email sent successfully' 
      })
    } catch (brevoError) {
      console.error('Failed to send member car request email via Brevo SDK:', brevoError)
      console.error('Brevo error details:', {
        message: brevoError instanceof Error ? brevoError.message : 'Unknown error',
        stack: brevoError instanceof Error ? brevoError.stack : 'No stack trace',
        response: (brevoError as any).response?.body || (brevoError as any).response
      })
      throw brevoError
    }

  } catch (error) {
    console.error('Error sending member car request email:', error)
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : 'No stack trace'
    
    console.error('Error details:', { message: errorMessage, stack: errorStack })
    
    return NextResponse.json(
      { 
        error: 'Failed to send email notification',
        details: errorMessage,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}