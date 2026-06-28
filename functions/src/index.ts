import * as admin from 'firebase-admin';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { Resend } from 'resend';
import { defineSecret } from 'firebase-functions/params';

// Define the secret
const resendApiKey = defineSecret('RESEND_API_KEY');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

/**
 * Cloud Function triggered when a new SentRequest is created in Firestore
 * This function:
 * 1. Fetches the CarRequest details (customer info, car details)
 * 2. Downloads the PDF from Firebase Storage
 * 3. Sends an email via Resend with the PDF attached
 */
export const sendOfferEmail = onDocumentCreated(
  {
    document: 'sent_requests/{sentRequestId}',
    secrets: [resendApiKey],
  },
  async (event) => {
    // Initialize Resend with API key from secret
    const resend = new Resend(resendApiKey.value());
    const sentRequest = event.data?.data();
    const sentRequestId = event.params.sentRequestId;

    try {
      console.log(`Processing new offer: ${sentRequestId}`);

      if (!sentRequest) {
        console.error('Sent request data is empty');
        return null;
      }

      // Extract data from the sent request
      const {
        request_id,
        price,
        pdf_path,
      } = sentRequest;

      if (!request_id || !pdf_path) {
        console.error('Missing required fields in sent request');
        return null;
      }

      // Fetch the original CarRequest to get customer details
      const carRequestRef = db.collection('car_requests').doc(request_id);
      const carRequestDoc = await carRequestRef.get();

      if (!carRequestDoc.exists) {
        console.error(`CarRequest ${request_id} not found`);
        return null;
      }

      const carRequest = carRequestDoc.data();
      if (!carRequest) {
        console.error('CarRequest data is empty');
        return null;
      }

      const {
        contact_name,
        contact_email,
        brand,
        model,
        year,
        fuel_type,
        transmission,
      } = carRequest;

      // Validate customer email
      if (!contact_email) {
        console.error('Customer email not found in CarRequest');
        return null;
      }

      console.log(`Fetching PDF from Storage: ${pdf_path}`);

      // Download the PDF from Firebase Storage
      const bucket = storage.bucket();
      const file = bucket.file(pdf_path);

      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        console.error(`PDF file not found at path: ${pdf_path}`);
        return null;
      }

      // Download file as buffer
      const [pdfBuffer] = await file.download();

      // Convert buffer to base64 for Resend attachment
      const pdfBase64 = pdfBuffer.toString('base64');

      // Extract filename from path
      const fileName = pdf_path.split('/').pop() || 'offer.pdf';

      console.log(`Sending email to ${contact_email}`);

      // Prepare car label for email
      const carLabel = [brand, model, year].filter(Boolean).join(' ');
      const displayName = contact_name || 'Client';

      // Build offer details for email
      const offerDetails = [
        `Mașină solicitată: ${carLabel}`,
        fuel_type ? `Combustibil: ${fuel_type}` : null,
        transmission ? `Transmisie: ${transmission}` : null,
      ].filter(Boolean).join('<br/>');

      // Send email via Resend with PDF attachment
      const emailResponse = await resend.emails.send({
        from: 'Automode <contact@codemint.ro>',
        to: contact_email,
        subject: `Ofertă Automode — ${carLabel}`,
        html: `
          <!DOCTYPE html>
          <html lang="ro">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Ofertă Automode</title>
          </head>
          <body style="margin:0;padding:0;background:#F5F7FA;font-family:Arial,Helvetica,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:32px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#1D4ED8,#3B82F6);padding:32px 40px;text-align:center;">
                        <img src="https://automode.ro/logowhite.png" alt="Automode" style="height:250px;width:auto;" />
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:36px 40px;">
                        <p style="margin:0 0 16px;font-size:16px;color:#1A1A2E;">Bună ziua, <strong>${displayName}</strong>,</p>
                        <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">
                          Echipa Automode a pregătit o ofertă pentru cererea ta de mașină la comandă.
                          Mai jos găsești detaliile ofertei noastre:
                        </p>

                        <!-- Price Box - Prominent -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                          <tr>
                            <td style="background:linear-gradient(135deg,#10B981,#059669);border-radius:8px;padding:24px;text-align:center;">
                              <p style="margin:0 0 8px;font-size:14px;color:rgba(255,255,255,0.9);font-weight:600;text-transform:uppercase;letter-spacing:1px;">Preț Ofertat</p>
                              <p style="margin:0;font-size:36px;color:#ffffff;font-weight:700;letter-spacing:-1px;">€${price.toLocaleString('ro-RO')}</p>
                            </td>
                          </tr>
                        </table>

                        <!-- Offer Details Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                          <tr>
                            <td style="background:#F0F7FF;border-left:4px solid #3B82F6;border-radius:6px;padding:20px 24px;">
                              <p style="margin:0 0 12px;font-size:12px;color:#3B82F6;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Detalii Mașină</p>
                              <p style="margin:0;font-size:15px;color:#1A1A2E;line-height:1.8;">
                                ${offerDetails}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <!-- PDF Attachment Notice -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                          <tr>
                            <td style="background:#FEF3C7;border-left:4px solid #F59E0B;border-radius:6px;padding:16px 20px;">
                              <p style="margin:0;font-size:14px;color:#92400E;line-height:1.6;">
                                <strong>📎 Oferta completă în PDF</strong><br/>
                                Am atașat documentul complet cu toate detaliile mașinii și condiții de livrare.
                              </p>
                            </td>
                          </tr>
                        </table>

                        <p style="margin:0 0 8px;font-size:15px;color:#444;line-height:1.6;">
                          Dacă ai întrebări sau dorești să discuți detaliile ofertei, poți răspunde direct la acest email
                          sau ne contactezi pe WhatsApp.
                        </p>

                        <!-- CTA Buttons -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
                          <tr>
                            <td align="center">
                              <table cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding:0 8px;">
                                    <table cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td style="background:#25D366;border-radius:8px;padding:14px 24px;">
                                          <a href="https://wa.me/40750462307" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                                            💬 Contactează pe WhatsApp
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td style="padding:0 8px;">
                                    <table cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td style="background:#1D4ED8;border-radius:8px;padding:14px 24px;">
                                          <a href="https://automode.ro" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                                            Vizitează Automode.ro →
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background:#F8FAFC;padding:24px 40px;border-top:1px solid #E5E7EB;">
                        <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
                          Acest email a fost trimis de <strong>Automode</strong> ca urmare a cererii tale de mașină la comandă.<br/>
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
        attachments: [
          {
            filename: fileName,
            content: pdfBase64,
          },
        ],
      });

      console.log('Email sent successfully:', emailResponse);

      // Update the sent_request with email sent status
      await event.data?.ref.update({
        email_sent: true,
        email_sent_at: admin.firestore.FieldValue.serverTimestamp(),
        email_id: emailResponse.data?.id || null,
      });

      return {
        success: true,
        emailId: emailResponse.data?.id,
        recipient: contact_email,
      };

    } catch (error: any) {
      console.error('Error sending offer email:', error);

      // Update the sent_request with error status
      await event.data?.ref.update({
        email_sent: false,
        email_error: error.message || 'Unknown error',
        email_error_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Don't throw - we don't want the function to retry automatically
      // as the error is logged in Firestore for manual review
      return {
        success: false,
        error: error.message,
      };
    }
  });
