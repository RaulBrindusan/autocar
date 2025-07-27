require('dotenv').config();
const { TransactionalEmailsApi, SendSmtpEmail } = require('@getbrevo/brevo');

async function testNewConfig() {
  try {
    console.log('Testing new email configuration...');
    console.log('Sender (EMAIL_FROM):', process.env.EMAIL_FROM);
    console.log('Receiver (EMAIL_TO):', process.env.EMAIL_TO);
    
    const apiInstance = new TransactionalEmailsApi();
    apiInstance.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;
    
    const emailMessage = new SendSmtpEmail();
    emailMessage.subject = 'Test: New Sender/Receiver Configuration';
    emailMessage.textContent = 'Testing new email configuration with separate sender and receiver.';
    emailMessage.htmlContent = `
      <h2>Test: New Email Configuration</h2>
      <p>This email tests the new configuration:</p>
      <ul>
        <li><strong>Sender:</strong> ${process.env.EMAIL_FROM}</li>
        <li><strong>Receiver:</strong> ${process.env.EMAIL_TO}</li>
      </ul>
      <p>If you receive this at contact@codemint.ro, the configuration is working!</p>
    `;
    
    emailMessage.sender = { 
      name: 'Automode Test', 
      email: process.env.EMAIL_FROM 
    };
    emailMessage.to = [{ 
      email: process.env.EMAIL_TO, 
      name: 'Automode Team' 
    }];
    
    console.log('Sending test email...');
    const result = await apiInstance.sendTransacEmail(emailMessage);
    
    console.log('SUCCESS! Email sent with new configuration');
    console.log('Message ID:', result.body.messageId);
    
  } catch (error) {
    console.error('ERROR with new configuration:');
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('Response:', error.response?.body);
  }
}

testNewConfig();