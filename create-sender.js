require('dotenv').config();
const { SendersApi } = require('@getbrevo/brevo');

async function createSender() {
  try {
    console.log('Creating new sender: noreply@codemint.ro');
    
    const sendersApi = new SendersApi();
    sendersApi.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;
    
    const senderData = {
      name: 'AutoCar',  // Display name
      email: 'noreply@codemint.ro'  // Sender email
    };
    
    console.log('Sender data:', senderData);
    
    try {
      const result = await sendersApi.createSender(senderData);
      console.log('SUCCESS! Sender created:');
      console.log('Response:', JSON.stringify(result.body, null, 2));
      console.log('\n🔔 IMPORTANT: Check your email (noreply@codemint.ro) for a verification code!');
      console.log('You need to verify this sender before it can be used.');
    } catch (error) {
      if (error.status === 400 && error.response?.body?.message?.includes('already exists')) {
        console.log('✅ Sender already exists! Let me check its status...');
        
        // Get existing senders to check status
        const senders = await sendersApi.getSenders();
        const noreplyServer = senders.body.senders.find(s => s.email === 'noreply@codemint.ro');
        
        if (noreplyServer) {
          console.log('Sender status:', {
            id: noreplyServer.id,
            name: noreplyServer.name,
            email: noreplyServer.email,
            active: noreplyServer.active
          });
          
          if (!noreplyServer.active) {
            console.log('⚠️  Sender exists but is not verified. Check your email for verification code.');
          } else {
            console.log('✅ Sender is already verified and active!');
          }
        }
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('ERROR creating sender:');
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('Response:', error.response?.body || 'No response body');
  }
}

createSender();