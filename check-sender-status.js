require('dotenv').config();
const { SendersApi } = require('@getbrevo/brevo');

async function checkSenderStatus() {
  try {
    console.log('Checking sender verification status...');
    
    const sendersApi = new SendersApi();
    sendersApi.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;
    
    const senders = await sendersApi.getSenders();
    
    console.log('All senders:');
    senders.body.senders.forEach(sender => {
      console.log(`- ID: ${sender.id}, Email: ${sender.email}, Name: ${sender.name}, Active: ${sender.active}`);
    });
    
    const noreplyServer = senders.body.senders.find(s => s.email === 'noreply@codemint.ro');
    const contactServer = senders.body.senders.find(s => s.email === 'contact@codemint.ro');
    
    console.log('\n=== SENDER STATUS ===');
    
    if (noreplyServer) {
      console.log('noreply@codemint.ro:');
      console.log(`  - Active: ${noreplyServer.active}`);
      console.log(`  - ID: ${noreplyServer.id}`);
      
      if (!noreplyServer.active) {
        console.log('  ❌ NOT VERIFIED - This is likely why emails aren\'t being delivered!');
      } else {
        console.log('  ✅ VERIFIED and active');
      }
    }
    
    if (contactServer) {
      console.log('contact@codemint.ro:');
      console.log(`  - Active: ${contactServer.active}`);
      console.log(`  - ID: ${contactServer.id}`);
      
      if (contactServer.active) {
        console.log('  ✅ VERIFIED and active - We should use this as sender!');
      }
    }
    
  } catch (error) {
    console.error('Error checking senders:', error.message);
  }
}

checkSenderStatus();