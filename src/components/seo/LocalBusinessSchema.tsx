/**
 * LocalBusiness Structured Data Component
 *
 * Provides JSON-LD schema markup for AutoMode as an automotive business.
 * This helps search engines understand the business and display rich results.
 *
 * @see https://schema.org/AutomotiveBusiness
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 *
 * Note: dangerouslySetInnerHTML is safe here as all content is static and hardcoded
 */
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": "https://automode.ro/#organization",
    "name": "AutoMode",
    "description": "Specialiști în importul de automobile europene în România. Oferim servicii complete de import auto cu garanție de 12 luni.",
    "url": "https://automode.ro",
    "telephone": "+40770852489",
    "email": "contact@automode.ro",
    "logo": {
      "@type": "ImageObject",
      "url": "https://automode.ro/logo.png",
      "width": 336,
      "height": 134
    },
    "image": "https://automode.ro/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RO",
      "addressLocality": "România"
    },
    "priceRange": "€€€",
    "currenciesAccepted": "EUR, RON",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "openingHours": "Mo-Fr 09:00-18:00",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "3",
      "bestRating": "5",
      "worstRating": "1"
    },
    "areaServed": {
      "@type": "Country",
      "name": "România"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicii Import Auto",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Import Auto din Germania",
            "description": "Import profesional de autovehicule din Germania cu garanție"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Import Auto din Italia",
            "description": "Import profesional de autovehicule din Italia cu garanție"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Garanție 12 Luni",
            "description": "Toate mașinile importate vin cu garanție extinsă de 12 luni"
          }
        }
      ]
    },
    "sameAs": []
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
