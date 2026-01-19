/**
 * Product Structured Data Component
 *
 * Provides JSON-LD schema markup for car products/listings.
 * This enables product rich results in Google Search with prices, availability, etc.
 *
 * @see https://schema.org/Product
 * @see https://schema.org/Car
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 *
 * SECURITY NOTE: dangerouslySetInnerHTML is safe here - all content is static/controlled, not from user input
 */

interface CarProduct {
  name: string
  description: string
  image: string
  price: number
  currency: string
  brand: string
  model: string
  fuelType?: string
  mileage?: string
  year?: number
  sku?: string
}

interface ProductSchemaProps {
  car: CarProduct
}

export function ProductSchema({ car }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": car.name,
    "description": car.description,
    "image": car.image,
    "brand": {
      "@type": "Brand",
      "name": car.brand
    },
    "model": car.model,
    "sku": car.sku || `AUTO-${car.brand}-${car.model}`.replace(/\s/g, '-'),
    "offers": {
      "@type": "Offer",
      "url": "https://automode.ro",
      "priceCurrency": car.currency,
      "price": car.price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "AutoMode",
        "@id": "https://automode.ro/#organization"
      }
    },
    "additionalProperty": [
      ...(car.fuelType ? [{
        "@type": "PropertyValue",
        "name": "Tip Combustibil",
        "value": car.fuelType
      }] : []),
      ...(car.mileage ? [{
        "@type": "PropertyValue",
        "name": "Kilometraj",
        "value": car.mileage
      }] : []),
      ...(car.year ? [{
        "@type": "PropertyValue",
        "name": "An Fabricație",
        "value": car.year.toString()
      }] : [])
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
