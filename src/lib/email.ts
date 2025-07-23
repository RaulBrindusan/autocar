import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'

console.log('Loading Brevo configuration...')
console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'SET' : 'NOT SET')
console.log('EMAIL_FROM:', process.env.EMAIL_FROM)

// Initialize Brevo API client
function createBrevoClient() {
  const apiInstance = new TransactionalEmailsApi()
  // Use the original working method with type assertion to bypass TypeScript protection
  ;(apiInstance as any).authentications.apiKey.apiKey = process.env.BREVO_API_KEY || ''
  return apiInstance
}

// Feature translation map from English keys to Romanian labels
const featureTranslations: { [key: string]: string } = {
  "leather": "Interior din piele",
  "sunroof": "Trapă",
  "navigation": "Sistem de navigație",
  "heated-seats": "Scaune încălzite",
  "cooled-seats": "Scaune ventilate",
  "heated-steering": "Volan încălzit",
  "bluetooth": "Bluetooth",
  "backup-camera": "Cameră de mers înapoi",
  "360-camera": "Cameră 360°",
  "cruise-control": "Cruise control",
  "adaptive-cruise": "Cruise control adaptiv",
  "keyless": "Pornire fără cheie",
  "keyless-entry": "Acces fără cheie",
  "premium-audio": "Sistem audio premium",
  "xenon": "Faruri Xenon/LED",
  "matrix-led": "Faruri Matrix LED",
  "parking-sensors": "Senzori de parcare",
  "auto-park": "Parcare automată",
  "climate-control": "Climatizare automată",
  "dual-zone-climate": "Climatizare bi-zonă",
  "tri-zone-climate": "Climatizare tri-zonă",
  "lane-assist": "Asistent de bandă",
  "blind-spot": "Monitor unghi mort",
  "collision-warning": "Avertizare coliziune",
  "emergency-brake": "Frânare de urgență",
  "traffic-sign": "Recunoaștere indicatoare",
  "wireless-charging": "Încărcare wireless",
  "apple-carplay": "Apple CarPlay",
  "android-auto": "Android Auto",
  "heads-up-display": "Head-up Display",
  "panoramic-roof": "Plafonul panoramic",
  "electric-seats": "Scaune electrice",
  "memory-seats": "Scaune cu memorie",
  "massage-seats": "Scaune cu masaj",
  "sport-suspension": "Suspensie sport",
  "air-suspension": "Suspensie pneumatică",
  "awd": "Tracțiune integrală",
  "sport-mode": "Moduri de conducere",
  "start-stop": "Sistem Start-Stop",
  "eco-mode": "Mod Eco",
  "night-vision": "Vedere nocturnă",
  "ambient-lighting": "Iluminare ambientală"
}

// Convert feature keys to Romanian labels
function translateFeatures(features: string[]): string[] {
  return features.map(feature => featureTranslations[feature] || feature)
}

export interface CarRequestEmailData {
  name: string
  phone: string
  make: string
  model: string
  year: number
  budget: number
  features?: string[]
  additionalNotes?: string
}

export interface OpenLaneEmailData {
  url: string
  name: string
  phone: string
  carData?: {
    title: string
    make: string
    model: string
    year: number
    price: string
    mileage: string
    condition: string
    vin: string
    location: string
    seller: string
    description: string
  }
  additionalNotes?: string
}

export async function sendCarRequestEmail(data: CarRequestEmailData) {
  const translatedFeatures = data.features?.length ? translateFeatures(data.features) : []
  const featuresText = translatedFeatures.length 
    ? `\n\nCaracteristici dorite:\n${translatedFeatures.map(f => `• ${f}`).join('\n')}`
    : ''

  const notesText = data.additionalNotes 
    ? `\n\nNote adiționale:\n${data.additionalNotes}`
    : ''

  const emailContent = `
Cerere nouă de mașină prin formularul de selecție:

DETALII CLIENT:
• Numele: ${data.name}
• Telefon: ${data.phone}

DETALII MAȘINĂ:
• Marca: ${data.make}
• Model: ${data.model}
• An: ${data.year}
• Buget: €${data.budget.toLocaleString()}${featuresText}${notesText}

---
Trimis de pe autocar.codemint.ro
`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Cerere nouă de mașină prin formularul de selecție</h2>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">DETALII CLIENT:</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 8px 0;"><strong>Numele:</strong> ${data.name}</li>
          <li style="margin: 8px 0;"><strong>Telefon:</strong> ${data.phone}</li>
        </ul>
        
        <h3 style="color: #374151;">DETALII MAȘINĂ:</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 8px 0;"><strong>Marca:</strong> ${data.make}</li>
          <li style="margin: 8px 0;"><strong>Model:</strong> ${data.model}</li>
          <li style="margin: 8px 0;"><strong>An:</strong> ${data.year}</li>
          <li style="margin: 8px 0;"><strong>Buget:</strong> €${data.budget.toLocaleString()}</li>
        </ul>
        ${translatedFeatures.length ? `
          <h4 style="color: #374151;">Caracteristici dorite:</h4>
          <ul>${translatedFeatures.map(f => `<li>${f}</li>`).join('')}</ul>
        ` : ''}
        ${data.additionalNotes ? `
          <h4 style="color: #374151;">Note adiționale:</h4>
          <p style="background: white; padding: 15px; border-radius: 4px;">${data.additionalNotes}</p>
        ` : ''}
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      <p style="color: #6b7280; font-size: 14px; text-align: center;">
        Trimis de pe autocar.codemint.ro
      </p>
    </div>
  `

  console.log('Attempting to send car request email via Brevo API...')
  console.log('Email will be sent to:', process.env.EMAIL_FROM)

  try {
    const apiInstance = createBrevoClient()

    console.log('Creating email message...')
    const emailMessage = new SendSmtpEmail()
    emailMessage.subject = `Cerere mașină de la ${data.name}: ${data.make} ${data.model} ${data.year}`
    emailMessage.htmlContent = htmlContent
    emailMessage.textContent = emailContent
    emailMessage.sender = { 
      name: 'AutoCar', 
      email: process.env.EMAIL_FROM || 'noreply@codemint.ro' 
    }
    emailMessage.to = [{ 
      email: process.env.EMAIL_TO || 'contact@codemint.ro', 
      name: 'AutoCar Team' 
    }]

    console.log('Email message created, sending...')
    const result = await apiInstance.sendTransacEmail(emailMessage)
    
    console.log('Car request email sent successfully via Brevo API:', result.body?.messageId)
    return result
  } catch (error) {
    console.error('Failed to send car request email via Brevo API:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      response: (error as any).response?.body || (error as any).response
    })
    throw error
  }
}

export async function sendOpenLaneEmail(data: OpenLaneEmailData) {
  const carDataText = data.carData ? `
DETALII MAȘINĂ EXTRASE:
• Titlu: ${data.carData.title}
• Marca: ${data.carData.make}
• Model: ${data.carData.model}  
• An: ${data.carData.year}
• Preț: ${data.carData.price}
• Kilometraj: ${data.carData.mileage}
• Stare: ${data.carData.condition}
• VIN: ${data.carData.vin}
• Locație: ${data.carData.location}
• Vânzător: ${data.carData.seller}
• Descriere: ${data.carData.description}
` : 'Nu s-au putut extrage datele din link.'

  const notesText = data.additionalNotes 
    ? `\n\nNote adiționale:\n${data.additionalNotes}`
    : ''

  const emailContent = `
Cerere nouă prin link OpenLane:

DETALII CLIENT:
• Numele: ${data.name}
• Telefon: ${data.phone}

LINK OPENLANE:
${data.url}
${carDataText}${notesText}

---
Trimis de pe autocar.codemint.ro
`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Cerere nouă prin link OpenLane</h2>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">DETALII CLIENT:</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 8px 0;"><strong>Numele:</strong> ${data.name}</li>
          <li style="margin: 8px 0;"><strong>Telefon:</strong> ${data.phone}</li>
        </ul>
        
        <h3 style="color: #374151;">LINK OPENLANE:</h3>
        <p style="background: white; padding: 15px; border-radius: 4px; word-break: break-all;">
          <a href="${data.url}" style="color: #2563eb;">${data.url}</a>
        </p>
        
        ${data.carData ? `
          <h3 style="color: #374151;">DETALII MAȘINĂ EXTRASE:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 8px 0;"><strong>Titlu:</strong> ${data.carData.title}</li>
            <li style="margin: 8px 0;"><strong>Marca:</strong> ${data.carData.make}</li>
            <li style="margin: 8px 0;"><strong>Model:</strong> ${data.carData.model}</li>
            <li style="margin: 8px 0;"><strong>An:</strong> ${data.carData.year}</li>
            <li style="margin: 8px 0;"><strong>Preț:</strong> ${data.carData.price}</li>
            <li style="margin: 8px 0;"><strong>Kilometraj:</strong> ${data.carData.mileage}</li>
            <li style="margin: 8px 0;"><strong>Stare:</strong> ${data.carData.condition}</li>
            <li style="margin: 8px 0;"><strong>VIN:</strong> ${data.carData.vin}</li>
            <li style="margin: 8px 0;"><strong>Locație:</strong> ${data.carData.location}</li>
            <li style="margin: 8px 0;"><strong>Vânzător:</strong> ${data.carData.seller}</li>
          </ul>
          <h4 style="color: #374151;">Descriere:</h4>
          <p style="background: white; padding: 15px; border-radius: 4px;">${data.carData.description}</p>
        ` : '<p style="color: #ef4444;">Nu s-au putut extrage datele din link.</p>'}
        
        ${data.additionalNotes ? `
          <h4 style="color: #374151;">Note adiționale:</h4>
          <p style="background: white; padding: 15px; border-radius: 4px;">${data.additionalNotes}</p>
        ` : ''}
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      <p style="color: #6b7280; font-size: 14px; text-align: center;">
        Trimis de pe autocar.codemint.ro
      </p>
    </div>
  `

  console.log('Attempting to send OpenLane email via Brevo API...')
  console.log('Email will be sent to:', process.env.EMAIL_FROM)
  
  try {
    const apiInstance = createBrevoClient()
    
    const emailMessage = new SendSmtpEmail()
    emailMessage.subject = `Link OpenLane de la ${data.name}: ${data.carData?.make || 'Mașină'} ${data.carData?.model || ''} ${data.carData?.year || ''}`
    emailMessage.htmlContent = htmlContent
    emailMessage.textContent = emailContent
    emailMessage.sender = { 
      name: 'AutoCar', 
      email: process.env.EMAIL_FROM || 'noreply@codemint.ro' 
    }
    emailMessage.to = [{ 
      email: process.env.EMAIL_TO || 'contact@codemint.ro', 
      name: 'AutoCar Team' 
    }]

    const result = await apiInstance.sendTransacEmail(emailMessage)
    
    console.log('OpenLane email sent successfully via Brevo API:', result.body?.messageId)
    return result
  } catch (error) {
    console.error('Failed to send OpenLane email via Brevo API:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      response: (error as any).response?.body || (error as any).response
    })
    throw error
  }
}