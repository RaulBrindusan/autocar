require('dotenv').config();
const { TransactionalEmailsApi, SendSmtpEmail } = require('@getbrevo/brevo');

async function testBrevoAPI() {
  try {
    console.log('Testing Brevo API directly...');
    
    // Initialize API client
    const apiInstance = new TransactionalEmailsApi();
    apiInstance.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;
    
    console.log('API Key:', process.env.BREVO_API_KEY ? 'SET' : 'NOT SET');
    console.log('Email FROM:', process.env.EMAIL_FROM);
    
    // Create test email
    const emailMessage = new SendSmtpEmail();
    emailMessage.subject = 'Direct Brevo API Test';
    emailMessage.textContent = 'This is a direct test of the Brevo API';
    emailMessage.htmlContent = '<h1>Direct Brevo API Test</h1><p>This is a direct test of the Brevo API</p>';
    emailMessage.sender = { 
      name: 'AutoCar Test', 
      email: process.env.EMAIL_FROM || 'contact@codemint.ro' 
    };
    emailMessage.to = [{ 
      email: process.env.EMAIL_FROM || 'contact@codemint.ro', 
      name: 'AutoCar Test' 
    }];
    
    console.log('Sending email...');
    const result = await apiInstance.sendTransacEmail(emailMessage);
    
    console.log('SUCCESS! Full API Response:');
    console.log('- Status:', result.response?.status || 'Unknown');
    console.log('- Message ID:', result.messageId);
    console.log('- Response Body:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('ERROR! Failed to send email:');
    console.error('- Message:', error.message);
    console.error('- Status:', error.status);
    console.error('- Response:', error.response?.body || error.response?.text || 'No response body');
    console.error('- Full Error:', JSON.stringify(error, null, 2));
  }
}

testBrevoAPI();