require('dotenv').config();
const { DomainsApi } = require('@getbrevo/brevo');

async function checkDomainAuth() {
  try {
    console.log('Checking domain authentication status...');
    
    const domainsApi = new DomainsApi();
    domainsApi.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;
    
    try {
      const domains = await domainsApi.getDomains();
      
      console.log('=== DOMAIN STATUS ===');
      
      if (domains.body.domains && domains.body.domains.length > 0) {
        domains.body.domains.forEach(domain => {
          console.log(`Domain: ${domain.name}`);
          console.log(`  - Verified: ${domain.verified}`);
          console.log(`  - Record Type: ${domain.recordType || 'Not set'}`);
          console.log(`  - Authentication Type: ${domain.authenticationType || 'Not set'}`);
          console.log('');
        });
      } else {
        console.log('❌ NO DOMAINS AUTHENTICATED');
        console.log('This is likely why emails aren\'t being delivered!');
        console.log('\nYou need to:');
        console.log('1. Go to Brevo dashboard → Senders, Domains & Dedicated IPs → Domains');
        console.log('2. Add codemint.ro domain');
        console.log('3. Set up DKIM DNS record');
      }
      
      // Check specifically for codemint.ro
      const codemintDomain = domains.body.domains?.find(d => d.name === 'codemint.ro');
      
      if (codemintDomain) {
        console.log('=== CODEMINT.RO STATUS ===');
        console.log(`Verified: ${codemintDomain.verified}`);
        
        if (!codemintDomain.verified) {
          console.log('❌ DOMAIN NOT VERIFIED - This explains why emails aren\'t delivered!');
        } else {
          console.log('✅ DOMAIN VERIFIED');
        }
      } else {
        console.log('❌ codemint.ro domain not found in authenticated domains');
      }
      
    } catch (error) {
      console.log('Could not fetch domains:', error.message);
      console.log('This might mean no domains are set up for authentication.');
    }
    
  } catch (error) {
    console.error('Error checking domain authentication:', error.message);
  }
}

checkDomainAuth();