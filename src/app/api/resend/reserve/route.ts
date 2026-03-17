import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'AutoMode <contact@codemint.ro>',
      to: 'contact@codemint.ro',
      subject: `Rezervare loc nou — ${email}`,
      html: `
        <h2>Rezervare loc nou</h2>
        <p>Un utilizator și-a rezervat un loc prin formularul de pe homepage.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString('ro-RO')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend reserve error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
