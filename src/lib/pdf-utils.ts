import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDFFromHTML(htmlContent: string, filename: string = 'contract.pdf') {
  try {
    // Create an iframe to completely isolate the content from parent CSS
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.left = '-9999px'
    iframe.style.top = '0'
    iframe.style.width = '794px'  // A4 width in pixels at 96 DPI
    iframe.style.height = '1123px' // A4 height in pixels at 96 DPI
    iframe.style.border = 'none'
    iframe.style.visibility = 'hidden'
    
    // Add iframe to document
    document.body.appendChild(iframe)
    
    // Wait for iframe to be ready
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Get iframe document
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!iframeDoc) {
      throw new Error('Could not access iframe document')
    }
    
    // More careful CSS cleaning and add page breaks
    const cleanHTML = htmlContent
      // Only remove specific problematic CSS properties, not all classes
      .replace(/class="([^"]*)"/g, (match, classes) => {
        // Keep structural classes but remove styling classes that might cause issues
        const cleanClasses = classes
          .split(' ')
          .filter((cls: string) => 
            // Keep structural classes
            cls.includes('grid') || 
            cls.includes('text-center') || 
            cls.includes('text-lg') || 
            cls.includes('text-xl') || 
            cls.includes('font-bold') || 
            cls.includes('uppercase') || 
            cls.includes('mb-') || 
            cls.includes('mt-') || 
            cls.includes('space-y') || 
            cls.includes('ml-4') ||
            cls === 'contract-document'
          )
          .join(' ')
        return cleanClasses ? `class="${cleanClasses}"` : ''
      })
      // Remove only problematic inline styles
      .replace(/style="([^"]*)"/g, (match, styles) => {
        // Remove only filter and mixBlendMode properties
        const cleanStyles = styles
          .replace(/filter:[^;]*;?/g, '')
          .replace(/mix-blend-mode:[^;]*;?/g, '')
          .replace(/;+/g, ';')
          .replace(/^;|;$/g, '')
        return cleanStyles ? `style="${cleanStyles}"` : ''
      })
      // Add page breaks before specific chapters
      .replace(/<h2([^>]*)>CAP\. III:/g, '<div class="page-break"></div><h2$1>CAP. III:')
      .replace(/<h2([^>]*)>CAP\. V:/g, '<div class="page-break"></div><h2$1>CAP. V:')
      .replace(/<h2([^>]*)>CAP\. VIII:/g, '<div class="page-break"></div><h2$1>CAP. VIII:')
      // Force center the contract number - more aggressive approach
      .replace(/(<[^>]*>)\s*(Nr\s+\d+[^<]*)\s*(<\/[^>]*>)/gi, '$1<div style="text-align: center; width: 100%; display: block;">$2</div>$3')
      // Also wrap any standalone contract number text
      .replace(/(Nr\s+\d+\s+din\s+[\d.]+)/gi, '<div style="text-align: center; width: 100%; display: block; margin: 0 auto;">$1</div>')
      // Convert signature images to clean format
      .replace(/<img([^>]*alt="[^"]*[Ss]emnătur[^"]*"[^>]*)>/g, (match) => {
        const srcMatch = match.match(/src="([^"]*)"/)
        const altMatch = match.match(/alt="([^"]*)"/)
        const src = srcMatch ? srcMatch[1] : ''
        const alt = altMatch ? altMatch[1] : 'Signature'
        return `<img src="${src}" alt="${alt}" class="signature" />`
      })
    
    // Create completely isolated document matching the exact format from screenshots
    const isolatedHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          /* Complete CSS reset */
          * {
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
            color: black !important;
            font-family: 'Times New Roman', serif !important;
            box-sizing: border-box !important;
          }
          
          html, body {
            width: 100% !important;
            height: 100% !important;
            background: white !important;
            color: black !important;
            overflow: visible !important;
          }
          
          .contract-document {
            padding: 25px 40px 40px 40px !important; /* Added more bottom padding to prevent cutoff */
            background: white !important;
            color: black !important;
            width: 100% !important;
            min-height: 100% !important;
            font-size: 12px !important;
            line-height: 1.6 !important;
          }
          
          /* Header - perfectly centered as in screenshot */
          .text-center {
            text-align: center !important;
          }
          
          h1 {
            font-size: 16px !important;
            font-weight: bold !important;
            text-align: center !important;
            margin-bottom: 8px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }
          
          .contract-number, 
          p:contains("Nr "), 
          div:contains("Nr ") {
            text-align: center !important;
            margin-bottom: 32px !important;
            font-size: 12px !important;
            width: 100% !important;
            display: block !important;
          }
          
          /* Force any element with contract number to center */
          *:contains("Nr ") {
            text-align: center !important;
          }
          
          /* Force page breaks with better spacing */
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
            height: 20px !important;
            margin: 20px 0 !important;
            clear: both !important;
          }
          
          /* Specific chapter page breaks */
          h2:contains("CAP. III"), 
          h2:contains("CAP. V"),
          h2:contains("CAP. VIII") {
            page-break-before: always !important;
            break-before: page !important;
            margin-top: 20px !important;
          }
          
          /* Prevent text cutoff at page boundaries */
          p, div, section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Chapter headings */
          h2 {
            font-size: 12px !important;
            font-weight: bold !important;
            text-transform: uppercase !important;
            margin: 20px 0 12px 0 !important;
          }
          
          /* Paragraphs */
          p {
            margin-bottom: 8px !important;
            text-align: justify !important;
            font-size: 12px !important;
            line-height: 1.6 !important;
          }
          
          strong {
            font-weight: bold !important;
          }
          
          /* Indented lists */
          .ml-4 {
            margin-left: 20px !important;
          }
          
          /* Sections */
          section {
            margin-bottom: 20px !important;
          }
          
          /* Signature section - exact match to screenshot */
          .signatures-section {
            margin-top: 40px !important;
            border-top: 1px solid black !important;
            padding-top: 30px !important;
          }
          
          .signatures-grid {
            display: table !important;
            width: 100% !important;
            table-layout: fixed !important;
          }
          
          .signature-column {
            display: table-cell !important;
            width: 50% !important;
            text-align: center !important;
            vertical-align: top !important;
            padding: 0 20px !important;
          }
          
          .signature-title {
            font-weight: bold !important;
            margin-bottom: 8px !important;
            font-size: 12px !important;
          }
          
          .signature-company {
            font-weight: bold !important;
            margin-bottom: 20px !important;
            font-size: 12px !important;
          }
          
          .signature-image-container {
            min-height: 80px !important;
            margin-bottom: 8px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          .signature {
            max-width: 180px !important;
            max-height: 60px !important;
            object-fit: contain !important;
            display: inline-block !important;
            /* Blue ink effect matching screenshot */
            filter: sepia(1) hue-rotate(210deg) saturate(2.5) brightness(0.7) !important;
          }
          
          .signature-date {
            font-size: 10px !important;
            color: #666 !important;
            margin-bottom: 20px !important;
          }
          
          .signature-role {
            font-weight: bold !important;
            font-size: 12px !important;
            margin-bottom: 4px !important;
          }
          
          .signature-name {
            font-weight: bold !important;
            font-size: 12px !important;
          }
          
          .signature-placeholder {
            font-size: 12px !important;
            margin-bottom: 8px !important;
          }
          
          /* Confirmation section */
          .confirmation-section {
            margin-top: 30px !important;
            border-top: 1px solid black !important;
            padding-top: 20px !important;
            text-align: center !important;
          }
          
          .confirmation-text {
            margin-bottom: 30px !important;
            font-size: 12px !important;
            line-height: 1.6 !important;
          }
          
          .confirmation-signature {
            margin-top: 20px !important;
          }
          
          /* Grid layout */
          .grid { display: block !important; }
          .grid-cols-2 { 
            display: table !important; 
            width: 100% !important; 
            table-layout: fixed !important; 
          }
          .grid-cols-2 > div {
            display: table-cell !important;
            width: 50% !important;
            text-align: center !important;
            vertical-align: top !important;
            padding: 0 20px !important;
          }
          .gap-8 { /* handled by padding in table cells */ }
          
          /* Flex utilities */
          .flex { display: block !important; }
          .flex-col { display: block !important; }
          .items-center { text-align: center !important; }
          .justify-center { text-align: center !important; }
          .min-h-\\[100px\\] { min-height: 100px !important; }
          
          /* Spacing utilities */
          .mb-8 { margin-bottom: 32px !important; }
          .mb-4 { margin-bottom: 16px !important; }
          .mb-2 { margin-bottom: 8px !important; }
          .mt-8 { margin-top: 32px !important; }
          .mt-12 { margin-top: 48px !important; }
          .pt-8 { padding-top: 32px !important; }
          .pt-4 { padding-top: 16px !important; }
          .p-2 { padding: 8px !important; }
          
          /* Border utilities */
          .border-t { border-top: 1px solid black !important; }
          
          /* Text utilities */
          .text-xs { font-size: 10px !important; }
          .text-gray-600 { color: #666 !important; }
          
          /* Space between children */
          .space-y-2 > * + * { margin-top: 8px !important; }
          .space-y-3 > * + * { margin-top: 12px !important; }
          .space-y-4 > * + * { margin-top: 16px !important; }
          .space-y-6 > * + * { margin-top: 24px !important; }
        </style>
      </head>
      <body>
        <div class="contract-document">
          ${cleanHTML}
        </div>
      </body>
      </html>
    `
    
    // Write to iframe
    iframeDoc.open()
    iframeDoc.write(isolatedHTML)
    iframeDoc.close()
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Get the body element to capture
    const bodyElement = iframeDoc.body
    if (!bodyElement) {
      throw new Error('Could not find body element in iframe')
    }
    
    // Capture the iframe content
    const canvas = await html2canvas(bodyElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 0,
      foreignObjectRendering: false, // Disable to avoid CSS parsing issues
      ignoreElements: () => false
    })
    
    // Remove iframe
    document.body.removeChild(iframe)
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png')
    
    // Fixed multi-page PDF generation - create separate canvas slices with better margins
    const pdfWidth = 210
    const pdfHeight = 297
    const margin = 15 // Increased margin to prevent cutoff
    
    const pageWidth = pdfWidth - (margin * 2)
    const pageContentHeight = pdfHeight - (margin * 2) - 10 // Extra 10mm bottom margin to prevent cutoff
    
    // Calculate how many pixels per mm
    const pixelsPerMM = canvas.width / pageWidth
    const pageHeightInPixels = pageContentHeight * pixelsPerMM
    
    const totalPages = Math.ceil(canvas.height / pageHeightInPixels)
    
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
      if (pageNum > 0) {
        pdf.addPage()
      }
      
      // Calculate the slice of the canvas for this page
      const startY = pageNum * pageHeightInPixels
      const sliceHeight = Math.min(pageHeightInPixels, canvas.height - startY)
      
      // Create a new canvas for this page slice
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = sliceHeight
      
      const pageCtx = pageCanvas.getContext('2d')
      if (pageCtx) {
        // Draw the slice from the original canvas
        pageCtx.drawImage(canvas, 0, startY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight)
        
        // Convert this slice to image data
        const pageImgData = pageCanvas.toDataURL('image/png')
        
        // Add this slice to the PDF page
        const sliceHeightMM = sliceHeight / pixelsPerMM
        pdf.addImage(pageImgData, 'PNG', margin, margin, pageWidth, sliceHeightMM)
      }
    }
    
    // Download
    pdf.save(filename)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Eroare la generarea PDF-ului. Vă rugăm să încercați din nou.')
  }
}

// Alternative method using HTML5 download
export function downloadHTMLAsPDF(htmlContent: string, filename: string = 'contract.html') {
  const fullHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Contract</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            font-size: 12px;
            line-height: 1.5;
            color: black;
            background: white;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
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
          
          .ml-4 {
            margin-left: 16px;
          }
          
          .grid-cols-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          
          .text-center {
            text-align: center;
          }
          
          .border-t {
            border-top: 1px solid #000;
            padding-top: 16px;
            margin-top: 32px;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          // Auto-print when opened
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `

  const blob = new Blob([fullHTML], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}