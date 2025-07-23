require('dotenv').config();

// Test data
const testData = {
  name: "Raul Brindusan",
  phone: "0770852489",
  make: "Audi",
  model: "A6", 
  year: 2020,
  budget: 25000,
  features: ["sunroof", "leather", "navigation", "heated-seats"],
  additionalNotes: "Prefer dark colors"
};

// Feature translation map (same as in email.ts)
const featureTranslations = {
  "leather": "Interior din piele",
  "sunroof": "Trapă",
  "navigation": "Sistem de navigație",
  "heated-seats": "Scaune încălzite",
  "cooled-seats": "Scaune ventilate",
  // ... other features
};

function translateFeatures(features) {
  return features.map(feature => featureTranslations[feature] || feature);
}

console.log('Testing feature translation...');
console.log('Original features:', testData.features);
console.log('Translated features:', translateFeatures(testData.features));

// Test the email format
const translatedFeatures = translateFeatures(testData.features);
const featuresText = translatedFeatures.length 
  ? `\n\nCaracteristici dorite:\n${translatedFeatures.map(f => `• ${f}`).join('\n')}`
  : '';

const emailPreview = `
DETALII CLIENT:
• Numele: ${testData.name}
• Telefon: ${testData.phone}

DETALII MAȘINĂ:
• Marca: ${testData.make}
• Model: ${testData.model}
• An: ${testData.year}
• Buget: €${testData.budget.toLocaleString()}${featuresText}

Note adiționale:
${testData.additionalNotes}
`;

console.log('\nEmail preview:');
console.log(emailPreview);