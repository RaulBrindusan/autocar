import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const {
      contact_name,
      contact_email,
      contact_phone,
      brand,
      model,
      year,
      max_budget,
      preferred_color,
      fuel_type,
      transmission,
      mileage_max,
      additional_requirements,
    } = data

    await resend.emails.send({
      from: 'AutoMode <contact@codemint.ro>',
      to: 'contact@codemint.ro',
      subject: `Comandă nouă — ${brand} ${model} (${contact_name})`,
      html: `
        <h2>Comandă nouă de mașină</h2>

        <h3>Date contact</h3>
        <p><strong>Nume:</strong> ${contact_name}</p>
        <p><strong>Email:</strong> ${contact_email}</p>
        <p><strong>Telefon:</strong> ${contact_phone}</p>

        <h3>Mașina dorită</h3>
        <p><strong>Marcă:</strong> ${brand}</p>
        <p><strong>Model:</strong> ${model}</p>
        <p><strong>An:</strong> ${year}</p>
        <p><strong>Buget maxim:</strong> €${max_budget?.toLocaleString()}</p>
        ${preferred_color ? `<p><strong>Culoare:</strong> ${preferred_color}</p>` : ''}
        ${fuel_type ? `<p><strong>Combustibil:</strong> ${fuel_type}</p>` : ''}
        ${transmission ? `<p><strong>Transmisie:</strong> ${transmission}</p>` : ''}
        ${mileage_max ? `<p><strong>Km maxim:</strong> ${mileage_max?.toLocaleString()} km</p>` : ''}
        ${additional_requirements ? `<p><strong>Cerințe suplimentare:</strong> ${additional_requirements}</p>` : ''}

        <p><strong>Data:</strong> ${new Date().toLocaleString('ro-RO')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend car-order error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
