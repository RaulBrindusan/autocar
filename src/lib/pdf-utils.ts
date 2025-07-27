import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDFFromHTML(htmlContent: string, filename: string = 'contract.pdf') {
  try {
    // Create a temporary container with fixed dimensions
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'fixed'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = '210mm'
    tempContainer.style.padding = '20mm'
    tempContainer.style.fontFamily = 'Times New Roman, serif'
    tempContainer.style.fontSize = '12px'
    tempContainer.style.lineHeight = '1.5'
    tempContainer.style.color = 'black'
    tempContainer.style.backgroundColor = 'white'
    tempContainer.style.border = 'none'
    tempContainer.style.boxShadow = 'none'
    tempContainer.style.overflow = 'visible'
    tempContainer.style.height = 'auto'
    
    // Clean the HTML content
    const cleanHTML = htmlContent
      .replace(/class="[^"]*border[^"]*"/g, '')
      .replace(/class="[^"]*rounded[^"]*"/g, '')
      .replace(/class="[^"]*bg-gray[^"]*"/g, '')
    
    // Add the content
    tempContainer.innerHTML = cleanHTML
    
    // Add to document
    document.body.appendChild(tempContainer)
    
    // Wait for rendering and get actual height
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Force layout calculation
    const actualHeight = tempContainer.scrollHeight
    tempContainer.style.height = actualHeight + 'px'
    
    // Wait a bit more
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Capture with html2canvas
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false,
      height: actualHeight,
      width: tempContainer.scrollWidth,
      imageTimeout: 0,
      ignoreElements: (element) => {
        // Skip elements that might cause issues with images
        return element.tagName === 'BUTTON' || element.classList.contains('bg-gray-50')
      }
    })
    
    // Remove temporary container
    document.body.removeChild(tempContainer)
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png')
    
    // Calculate dimensions
    const pdfWidth = 210
    const pdfHeight = 297
    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * pdfWidth) / canvas.width
    
    // Add content to PDF - simple approach
    if (imgHeight <= pdfHeight) {
      // Single page
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    } else {
      // Multiple pages
      let y = 0
      let pageNum = 1
      
      while (y < imgHeight) {
        if (pageNum > 1) {
          pdf.addPage()
        }
        
        // Add this page's content
        pdf.addImage(imgData, 'PNG', 0, -y, imgWidth, imgHeight)
        
        y += pdfHeight
        pageNum++
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