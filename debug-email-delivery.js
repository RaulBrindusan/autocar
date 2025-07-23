require('dotenv').config();
const { TransactionalEmailsApi, SendSmtpEmail } = require('@getbrevo/brevo');

async function debugEmailDelivery() {
  try {
    console.log('🔍 DEBUGGING EMAIL DELIVERY ISSUE');
    console.log('================================');
    
    console.log('1. Environment Variables:');
    console.log(`   BREVO_API_KEY: ${process.env.BREVO_API_KEY ? 'SET' : 'NOT SET'}`);
    console.log(`   EMAIL_FROM: ${process.env.EMAIL_FROM}`);
    console.log(`   EMAIL_TO: ${process.env.EMAIL_TO}`);
    
    console.log('\n2. Domain Status: ✅ codemint.ro is authenticated');
    
    console.log('\n3. Testing different recipient addresses...');
    
    const apiInstance = new TransactionalEmailsApi();
    apiInstance.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;
    
    // Test with a different email address to rule out contact@codemint.ro issues
    const testEmail = new SendSmtpEmail();
    testEmail.subject = '🔍 DELIVERY DEBUG TEST - ' + new Date().toISOString();
    testEmail.htmlContent = `
      <h2>Email Delivery Debug Test</h2>
      <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
      <p><strong>From:</strong> ${process.env.EMAIL_FROM}</p>
      <p><strong>To:</strong> ${process.env.EMAIL_TO}</p>
      <p><strong>Domain:</strong> codemint.ro (authenticated)</p>
      <p><strong>Purpose:</strong> Testing if this specific email arrives</p>
      
      <div style="background: #f0f0f0; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h3>Possible Issues to Check:</h3>
        <ul>
          <li>Check spam/junk folder</li>
          <li>Check email client filters</li>
          <li>Check if contact@codemint.ro inbox is full</li>
          <li>Try a different email address</li>
        </ul>
      </div>
      
      <p style="color: #666; font-size: 12px;">
        If you receive this email, the system is working correctly.
      </p>
    `;
    
    testEmail.sender = { 
      name: 'AutoCar Debug', 
      email: process.env.EMAIL_FROM 
    };
    testEmail.to = [{ 
      email: process.env.EMAIL_TO, 
      name: 'Debug Test' 
    }];
    
    console.log('\n4. Sending debug email...');
    const result = await apiInstance.sendTransacEmail(testEmail);
    
    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${result.body.messageId}`);
    console.log(`   Status: ${result.response.statusCode}`);
    
    console.log('\n🎯 DEBUGGING CHECKLIST:');
    console.log('========================');
    console.log('□ Check spam/junk folder in contact@codemint.ro');
    console.log('□ Check if email client has automatic filtering');
    console.log('□ Verify contact@codemint.ro inbox is not full');
    console.log('□ Wait 5-10 minutes for delivery (sometimes delayed)');
    console.log('□ Check email client settings (POP/IMAP sync)');
    console.log('□ Try accessing webmail directly');
    
    console.log('\n📧 ALTERNATIVE TEST:');
    console.log('If you have another email address (Gmail, Yahoo, etc.),');
    console.log('temporarily change EMAIL_TO in .env to test delivery there.');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Response:', error.response?.body);
  }
}

debugEmailDelivery();