const { chromium } = require('playwright');

async function testPlaywright() {
  try {
    console.log('Testing Playwright browser launch...');
    const browser = await chromium.launch({ headless: true });
    console.log('✅ Browser launched successfully');
    
    const page = await browser.newPage();
    await page.goto('https://example.com');
    console.log('✅ Page navigation successful');
    
    await browser.close();
    console.log('✅ Playwright test completed successfully');
  } catch (error) {
    console.error('❌ Playwright test failed:', error.message);
    console.error('Full error:', error);
  }
}

testPlaywright();