require('dotenv').config();
const { AccountApi, SendersApi } = require('@getbrevo/brevo');

async function checkBrevoAccount() {
  try {
    console.log('Checking Brevo account status...');
    
    // Check account info
    const accountApi = new AccountApi();
    accountApi.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;
    
    console.log('Getting account information...');
    try {
      const accountInfo = await accountApi.getAccount();
      console.log('Account info:', JSON.stringify(accountInfo.body, null, 2));
    } catch (error) {
      console.log('Could not get account info:', error.message);
    }
    
    // Check senders
    const sendersApi = new SendersApi();
    sendersApi.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;
    
    console.log('Getting senders list...');
    try {
      const senders = await sendersApi.getSenders();
      console.log('Senders:', JSON.stringify(senders.body, null, 2));
    } catch (error) {
      console.log('Could not get senders:', error.message);
    }
    
  } catch (error) {
    console.error('Error checking account:', error.message);
  }
}

checkBrevoAccount();