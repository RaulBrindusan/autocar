import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const { clientEmail, clientName, brand, model, adminReply } = await request.json()

    if (!clientEmail || !adminReply) {
      return NextResponse.json({ error: 'Câmpuri lipsă' }, { status: 400 })
    }

    const carLabel = [brand, model].filter(Boolean).join(' ') || 'mașina solicitată'
    const displayName = clientName || 'Client'

    await resend.emails.send({
      from: 'AutoMode <noreply@codemint.ro>',
      to: clientEmail,
      subject: `Ofertă nouă de la AutoMode — ${carLabel}`,
      html: `
        <!DOCTYPE html>
        <html lang="ro">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Ofertă nouă AutoMode</title>
        </head>
        <body style="margin:0;padding:0;background:#F5F7FA;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:32px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#1D4ED8,#3B82F6);padding:32px 40px;">
                      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">AutoMode</h1>
                      <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Dealership de mașini premium</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:36px 40px;">
                      <p style="margin:0 0 16px;font-size:16px;color:#1A1A2E;">Bună ziua, <strong>${displayName}</strong>,</p>
                      <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">
                        Echipa AutoMode a pregătit un răspuns la cererea ta pentru <strong>${carLabel}</strong>.
                        Mai jos găsești mesajul consultantului nostru:
                      </p>

                      <!-- Reply box -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background:#F0F7FF;border-left:4px solid #3B82F6;border-radius:6px;padding:20px 24px;">
                            <p style="margin:0 0 8px;font-size:12px;color:#3B82F6;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Mesaj de la consultant</p>
                            <p style="margin:0;font-size:15px;color:#1A1A2E;line-height:1.7;white-space:pre-line;">${adminReply}</p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:28px 0 8px;font-size:15px;color:#444;line-height:1.6;">
                        Dacă ai întrebări sau dorești să discuți direct cu noi, poți răspunde la acest email
                        sau ne contactezi prin aplicație.
                      </p>

                      <!-- CTA -->
                      <table cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
                        <tr>
                          <td style="background:#1D4ED8;border-radius:8px;padding:14px 28px;">
                            <a href="https://automode.ro" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                              Vizitează AutoMode.ro →
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#F8FAFC;padding:24px 40px;border-top:1px solid #E5E7EB;">
                      <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
                        Acest email a fost trimis de <strong>AutoMode</strong> ca urmare a cererii tale de mașină la comandă.<br/>
                        Dacă nu ai făcut nicio cerere, te rugăm să ignori acest mesaj.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Offer notification email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
