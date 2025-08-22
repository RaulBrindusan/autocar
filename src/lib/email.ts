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

// Fuel type and transmission translation maps
const fuelTypeTranslations: { [key: string]: string } = {
  "benzina": "Benzină",
  "motorina": "Motorină", 
  "hybrid": "Hibrid",
  "electric": "Electric",
  "gpl": "GPL",
  "cng": "CNG",
  "mild-hybrid": "Mild Hybrid",
  "plug-in-hybrid": "Plug-in Hybrid"
}

const transmissionTranslations: { [key: string]: string } = {
  "manuala": "Manuală",
  "automata": "Automată",
  "semiautomata": "Semiautomată",
  "cvt": "CVT", 
  "dsg": "DSG",
  "tiptronic": "Tiptronic"
}

export interface CarRequestEmailData {
  name: string
  phone: string
  email: string
  make: string
  model: string
  year: number
  fuelType?: string
  transmission?: string
  maxMileage?: number
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
  console.log('sendCarRequestEmail called with data:', JSON.stringify(data, null, 2))
  const translatedFeatures = data.features?.length ? translateFeatures(data.features) : []
  const featuresText = translatedFeatures.length 
    ? `\n\nCaracteristici dorite:\n${translatedFeatures.map(f => `• ${f}`).join('\n')}`
    : ''

  const notesText = data.additionalNotes 
    ? `\n\nNote adiționale:\n${data.additionalNotes}`
    : ''

  // Build optional fields text
  const optionalFields = []
  if (data.fuelType) {
    optionalFields.push(`• Tip combustibil: ${fuelTypeTranslations[data.fuelType] || data.fuelType}`)
  }
  if (data.transmission) {
    optionalFields.push(`• Transmisie: ${transmissionTranslations[data.transmission] || data.transmission}`)
  }
  if (data.maxMileage) {
    optionalFields.push(`• Kilometraj maxim: ${data.maxMileage.toLocaleString()} km`)
  }
  const optionalFieldsText = optionalFields.length ? `\n${optionalFields.join('\n')}` : ''

  const emailContent = `
Cerere nouă de mașină prin formularul de selecție:

DETALII CLIENT:
• Numele: ${data.name}
• Telefon: ${data.phone}
• Email: ${data.email}

DETALII MAȘINĂ:
• Marca: ${data.make}
• Model: ${data.model}
• An: ${data.year}${optionalFieldsText}
• Buget: €${data.budget.toLocaleString()}${featuresText}${notesText}

---
Trimis de pe automode.ro
`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Cerere nouă de mașină prin formularul de selecție</h2>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">DETALII CLIENT:</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 8px 0;"><strong>Numele:</strong> ${data.name}</li>
          <li style="margin: 8px 0;"><strong>Telefon:</strong> ${data.phone}</li>
          <li style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</li>
        </ul>
        
        <h3 style="color: #374151;">DETALII MAȘINĂ:</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 8px 0;"><strong>Marca:</strong> ${data.make}</li>
          <li style="margin: 8px 0;"><strong>Model:</strong> ${data.model}</li>
          <li style="margin: 8px 0;"><strong>An:</strong> ${data.year}</li>
          ${data.fuelType ? `<li style="margin: 8px 0;"><strong>Tip combustibil:</strong> ${fuelTypeTranslations[data.fuelType] || data.fuelType}</li>` : ''}
          ${data.transmission ? `<li style="margin: 8px 0;"><strong>Transmisie:</strong> ${transmissionTranslations[data.transmission] || data.transmission}</li>` : ''}
          ${data.maxMileage ? `<li style="margin: 8px 0;"><strong>Kilometraj maxim:</strong> ${data.maxMileage.toLocaleString()} km</li>` : ''}
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
        Trimis de pe automode.ro
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
      name: 'Automode SRL', 
      email: process.env.EMAIL_FROM || 'contact@automode.ro' 
    }
    // Parse multiple email addresses
    const emailToString = process.env.EMAIL_TO || 'contact@automode.ro'
    const emailAddresses = emailToString.split(',').map(email => email.trim())
    emailMessage.to = emailAddresses.map(email => ({ 
      email: email, 
      name: 'Automode Team' 
    }))

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
Trimis de pe automode.ro
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
        Trimis de pe automode.ro
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
      name: 'Automode SRL', 
      email: process.env.EMAIL_FROM || 'contact@automode.ro' 
    }
    // Parse multiple email addresses
    const emailToString = process.env.EMAIL_TO || 'contact@automode.ro'
    const emailAddresses = emailToString.split(',').map(email => email.trim())
    emailMessage.to = emailAddresses.map(email => ({ 
      email: email, 
      name: 'Automode Team' 
    }))

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

export async function sendCustomerConfirmationEmail(data: CarRequestEmailData) {
  console.log('sendCustomerConfirmationEmail called for:', data.email)
  
  const emailContent = `
Bună ziua ${data.name},

Mulțumim că ați contactat Automode! Am primit cererea dumneavoastră pentru:

${data.make} ${data.model} ${data.year}
Buget: €${data.budget.toLocaleString()}

Echipa noastră va analiza cererea și vă va contacta în cel mai scurt timp posibil.

Pentru o experiență mai bună, vă invităm să vă creați un cont pe platforma noastră unde puteți urmări statusul cererii și beneficia de servicii suplimentare.

Creați-vă contul aici: https://automode.ro/signup

Cu stimă,
Echipa Automode

---
Automode - Importul de mașini din Europa
Website: https://automode.ro
Email: ${process.env.EMAIL_FROM}
`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Automode</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Importul de mașini din Europa</p>
        </div>
        
        <h2 style="color: #374151; margin-bottom: 20px;">Bună ziua ${data.name},</h2>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          Mulțumim că ați contactat <strong>Automode</strong>! Am primit cererea dumneavoastră și suntem încântați să vă ajutăm.
        </p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Detaliile cererii dumneavoastră:</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin: 8px 0; color: #374151;"><strong>Mașina:</strong> ${data.make} ${data.model} ${data.year}</li>
            <li style="margin: 8px 0; color: #374151;"><strong>Buget:</strong> €${data.budget.toLocaleString()}</li>
            ${data.fuelType ? `<li style="margin: 8px 0; color: #374151;"><strong>Combustibil:</strong> ${data.fuelType}</li>` : ''}
            ${data.transmission ? `<li style="margin: 8px 0; color: #374151;"><strong>Transmisie:</strong> ${data.transmission}</li>` : ''}
          </ul>
        </div>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 25px;">
          Echipa noastră va analiza cererea și vă va contacta în cel mai scurt timp posibil pentru a discuta opțiunile disponibile.
        </p>
        
        <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
          <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">💡 Creați-vă un cont Automode</h3>
          <p style="color: #374151; margin-bottom: 15px; line-height: 1.6;">
            Pentru o experiență completă, vă invităm să vă creați un cont pe platforma noastră unde puteți:
          </p>
          <ul style="color: #374151; margin: 0 0 20px 20px;">
            <li>Urmări statusul cererii dumneavoastră</li>
            <li>Gestiona multiple cereri</li>
            <li>Accesa calculatorul de costuri</li>
            <li>Primi notificări personalizate</li>
          </ul>
          <div style="text-align: center;">
            <a href="https://automode.ro/signup" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
              Creează Cont Gratuit
            </a>
          </div>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            Cu stimă,<br>
            <strong style="color: #374151;">Echipa Automode</strong>
          </p>
          <div style="margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p style="margin: 5px 0;">🌐 Website: <a href="https://automode.ro" style="color: #2563eb;">automode.ro</a></p>
            <p style="margin: 5px 0;">📧 Email: ${process.env.EMAIL_FROM}</p>
          </div>
        </div>
      </div>
    </div>
  `

  console.log('Attempting to send customer confirmation email via Brevo API...')
  console.log('Email will be sent to customer:', data.email)
  
  try {
    const apiInstance = createBrevoClient()
    
    const emailMessage = new SendSmtpEmail()
    emailMessage.subject = `Automode - Confirmarea cererii pentru ${data.make} ${data.model}`
    emailMessage.htmlContent = htmlContent
    emailMessage.textContent = emailContent
    emailMessage.sender = { 
      name: 'Automode SRL', 
      email: process.env.EMAIL_FROM || 'contact@automode.ro' 
    }
    emailMessage.to = [{ 
      email: data.email, 
      name: data.name 
    }]

    const result = await apiInstance.sendTransacEmail(emailMessage)
    
    console.log('Customer confirmation email sent successfully via Brevo API:', result.body?.messageId)
    return result
  } catch (error) {
    console.error('Failed to send customer confirmation email via Brevo API:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      response: (error as any).response?.body || (error as any).response
    })
    throw error
  }
}