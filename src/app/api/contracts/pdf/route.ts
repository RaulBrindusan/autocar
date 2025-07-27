import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, filename = 'contract.pdf' } = await request.json()
    
    if (!htmlContent) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      )
    }

    // Create a complete HTML document for PDF generation
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Contract</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12px;
              line-height: 1.5;
              color: black;
              background: white;
              padding: 40px;
            }
            
            h1 {
              font-size: 18px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 20px;
              text-transform: uppercase;
            }
            
            h2 {
              font-size: 14px;
              font-weight: bold;
              text-transform: uppercase;
              margin: 20px 0 10px 0;
            }
            
            p {
              margin-bottom: 10px;
              text-align: justify;
            }
            
            strong {
              font-weight: bold;
            }
            
            .text-center {
              text-align: center;
            }
            
            .space-y-4 > * + * {
              margin-top: 16px;
            }
            
            .space-y-6 > * + * {
              margin-top: 24px;
            }
            
            .ml-4 {
              margin-left: 16px;
            }
            
            .mb-2 {
              margin-bottom: 8px;
            }
            
            .mb-4 {
              margin-bottom: 16px;
            }
            
            .mb-8 {
              margin-bottom: 32px;
            }
            
            .mt-8 {
              margin-top: 32px;
            }
            
            .mt-12 {
              margin-top: 48px;
            }
            
            .pt-4 {
              padding-top: 16px;
            }
            
            .pt-8 {
              padding-top: 32px;
            }
            
            .border-t {
              border-top: 1px solid #000;
            }
            
            .grid-cols-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 32px;
            }
            
            @page {
              margin: 2cm;
              size: A4;
            }
            
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `

    // Return the HTML that can be used with browser's print to PDF
    return new NextResponse(fullHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}