require('dotenv').config();
const { TransactionalEmailsApi, SendSmtpEmail } = require('@getbrevo/brevo');

async function testDirectSend() {
  try {
    console.log('Testing direct email delivery...');
    
    const apiInstance = new TransactionalEmailsApi();
    apiInstance.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;
    
    // Test 1: Using noreply as sender
    console.log('\n=== TEST 1: noreply@codemint.ro → contact@codemint.ro ===');
    
    const email1 = new SendSmtpEmail();
    email1.subject = 'TEST 1: Direct delivery test with noreply sender';
    email1.textContent = 'This is a test email from noreply@codemint.ro to contact@codemint.ro';
    email1.htmlContent = `
      <h2>TEST 1: Direct Delivery Test</h2>
      <p><strong>From:</strong> noreply@codemint.ro</p>
      <p><strong>To:</strong> contact@codemint.ro</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p>If you receive this email, the noreply sender is working correctly!</p>
    `;
    
    email1.sender = { name: 'Automode System', email: 'noreply@codemint.ro' };
    email1.to = [{ email: 'contact@codemint.ro', name: 'Contact Team' }];
    
    try {
      const result1 = await apiInstance.sendTransacEmail(email1);
      console.log('✅ SUCCESS - Message ID:', result1.body.messageId);
    } catch (error) {
      console.log('❌ FAILED:', error.message);
    }
    
    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Using contact as sender (different recipient to avoid confusion)
    console.log('\n=== TEST 2: contact@codemint.ro → contact@codemint.ro ===');
    
    const email2 = new SendSmtpEmail();
    email2.subject = 'TEST 2: Direct delivery test with contact sender';
    email2.textContent = 'This is a test email from contact@codemint.ro to contact@codemint.ro';
    email2.htmlContent = `
      <h2>TEST 2: Self-send Test</h2>
      <p><strong>From:</strong> contact@codemint.ro</p>
      <p><strong>To:</strong> contact@codemint.ro</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p>This tests if self-sending works (same sender/receiver).</p>
    `;
    
    email2.sender = { name: 'Contact Team', email: 'contact@codemint.ro' };
    email2.to = [{ email: 'contact@codemint.ro', name: 'Contact Team' }];
    
    try {
      const result2 = await apiInstance.sendTransacEmail(email2);
      console.log('✅ SUCCESS - Message ID:', result2.body.messageId);
    } catch (error) {
      console.log('❌ FAILED:', error.message);
    }
    
    console.log('\n=== CHECK YOUR EMAIL ===');
    console.log('1. Check contact@codemint.ro inbox');
    console.log('2. Check spam/junk folder');
    console.log('3. Wait 2-5 minutes for delivery');
    console.log('4. If still no emails, there might be a domain/DNS issue');
    
  } catch (error) {
    console.error('Error in direct send test:', error.message);
  }
}

testDirectSend();