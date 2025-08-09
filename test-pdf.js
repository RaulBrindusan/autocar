const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console messages
  page.on('console', msg => {
    console.log(`CONSOLE ${msg.type()}: ${msg.text()}`);
  });

  // Listen for page errors
  page.on('pageerror', error => {
    console.log(`PAGE ERROR: ${error.message}`);
  });

  try {
    console.log('Step 1: Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    // Take screenshot of login page
    await page.screenshot({ path: 'login-page.png' });
    console.log('Screenshot taken: login-page.png');

    console.log('Step 2: Logging in as admin...');
    await page.fill('input[type="email"]', 'brindusanraull@gmail.com');
    await page.fill('input[type="password"]', 'barcelon3');
    await page.click('button[type="submit"]');
    
    // Wait for redirect after login
    await page.waitForLoadState('networkidle');
    console.log('Current URL after login:', page.url());

    console.log('Step 3: Navigating to admin/contracte page...');
    await page.goto('http://localhost:3000/admin/contracte');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of contracts page
    await page.screenshot({ path: 'contracts-page.png' });
    console.log('Screenshot taken: contracts-page.png');

    console.log('Step 4: Looking for Contract #3 for Raul Brindusan...');
    // Wait a bit for the page to fully load
    await page.waitForTimeout(2000);
    
    // Look for contracts table or list
    const contractElements = await page.$$('text=Raul');
    console.log(`Found ${contractElements.length} elements containing "Raul"`);
    
    // Look for "Vizualizează" buttons
    const viewButtons = await page.$$('text=Vizualizează');
    console.log(`Found ${viewButtons.length} "Vizualizează" buttons`);
    
    if (viewButtons.length > 0) {
      console.log('Step 5: Clicking on first "Vizualizează" button...');
      await viewButtons[0].click();
      await page.waitForLoadState('networkidle');
      
      console.log('Current URL after clicking view:', page.url());
      
      // Take screenshot of contract view
      await page.screenshot({ path: 'contract-view.png' });
      console.log('Screenshot taken: contract-view.png');
      
      console.log('Step 6: Looking for PDF download button...');
      // Wait a bit for contract to load
      await page.waitForTimeout(3000);
      
      // Look for PDF download button
      const pdfButtons = await page.$$('text=Descarcă PDF');
      console.log(`Found ${pdfButtons.length} "Descarcă PDF" buttons`);
      
      if (pdfButtons.length > 0) {
        console.log('Step 7: Testing PDF download...');
        
        // Set up download handling
        const downloadPromise = page.waitForEvent('download');
        await pdfButtons[0].click();
        
        try {
          const download = await downloadPromise;
          console.log('PDF download initiated successfully!');
          console.log('Download filename:', await download.suggestedFilename());
          
          // Save the download
          await download.saveAs(`./downloaded-contract.pdf`);
          console.log('PDF saved as: downloaded-contract.pdf');
          
        } catch (downloadError) {
          console.log('PDF download failed:', downloadError.message);
        }
      } else {
        console.log('No PDF download button found');
      }
    } else {
      console.log('No "Vizualizează" buttons found');
    }

  } catch (error) {
    console.error('Test failed:', error);
  }

  // Keep browser open for manual inspection
  console.log('Test completed. Browser will remain open for 30 seconds for manual inspection...');
  await page.waitForTimeout(30000);
  
  await browser.close();
})();