import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const make = searchParams.get('make')

    if (!make) {
      return NextResponse.json({
        success: false,
        error: 'Make parameter is required'
      }, { status: 400 })
    }

    // European brands that we have comprehensive data for - use our data directly
    const europeanBrands = [
      'Škoda', 'Skoda', 'SEAT', 'Opel', 'Dacia', 'Peugeot', 'Renault', 
      'Citroën', 'Citroen', 'Alfa Romeo', 'Fiat', 'BMW', 'Mercedes-Benz', 
      'Audi', 'Volkswagen', 'Porsche', 'Volvo', 'Jaguar', 'Land Rover', 'MINI'
    ]

    // If it's a European brand, use our comprehensive data directly
    if (europeanBrands.includes(make)) {
      const fallbackModels = getFallbackModels(make)
      return NextResponse.json({
        success: true,
        models: fallbackModels
      })
    }

    // For other brands, try NHTSA API first
    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`,
        {
          headers: {
            'User-Agent': 'Automode-Import-Service/1.0'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        
        if (data.Results && Array.isArray(data.Results) && data.Results.length > 0) {
          return NextResponse.json({
            success: true,
            models: data.Results.map((model: { Model_ID: number; Model_Name: string }) => ({
              Model_ID: model.Model_ID,
              Model_Name: model.Model_Name
            }))
          })
        }
      }
    } catch (apiError) {
      console.error('NHTSA API error:', apiError)
    }

    // Fallback to static model data based on make
    const fallbackModels = getFallbackModels(make)

    return NextResponse.json({
      success: true,
      models: fallbackModels
    })

  } catch (error) {
    console.error('Error fetching car models:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch models'
    }, { status: 500 })
  }
}

function getFallbackModels(make: string) {
  const modelMap: { [key: string]: string[] } = {
    "BMW": [
      "1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series",
      "X1", "X2", "X3", "X4", "X5", "X6", "X7", "XM", "Z4", "Z3", "i3", "i4", "iX", "iX3", "iX1", "iX2",
      "M1", "M2", "M3", "M4", "M5", "M6", "M8", "X3 M", "X4 M", "X5 M", "X6 M"
    ],
    "Mercedes-Benz": [
      "A-Class", "B-Class", "C-Class", "CLA", "CLS", "E-Class", "S-Class", "Maybach S-Class",
      "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "SL", "SLC", "AMG GT", "EQS", "EQC", "EQA", "EQB",
      "AMG A35", "AMG A45", "AMG C43", "AMG C63", "AMG E53", "AMG E63", "AMG S63", "AMG G63"
    ],
    "Audi": [
      "A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4", "Q5", "Q7", "Q8",
      "TT", "TTS", "TT RS", "R8", "e-tron GT", "e-tron", "Q4 e-tron",
      "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q3", "RS Q8", "S3", "S4", "S5", "S6", "S7", "S8"
    ],
    "Volkswagen": [
      "Golf", "Golf GTI", "Golf R", "Polo", "Polo GTI", "Passat", "Jetta", "Arteon", "CC",
      "Tiguan", "Touareg", "Atlas", "T-Cross", "T-Roc", "Touran", "Sharan",
      "ID.3", "ID.4", "ID.5", "ID.7", "ID.Buzz", "e-Golf", "e-up!"
    ],
    "Porsche": [
      "911", "911 Carrera", "911 Turbo", "911 GT3", "911 GT2", "911 Targa",
      "718 Boxster", "718 Cayman", "718 Spyder", "718 GT4",
      "Panamera", "Panamera Turbo", "Panamera GTS", "Cayenne", "Cayenne Turbo", "Cayenne GTS",
      "Macan", "Macan S", "Macan GTS", "Macan Turbo", "Taycan", "Taycan Turbo"
    ],
    "Tesla": [
      "Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Roadster"
    ],
    "Toyota": [
      "Corolla", "Camry", "Avalon", "Prius", "RAV4", "Highlander", "4Runner", "Tacoma", "Tundra",
      "Sienna", "Sequoia", "Land Cruiser", "GR86", "GR Supra", "Mirai", "Venza", "C-HR"
    ],
    "Honda": [
      "Civic", "Accord", "Insight", "CR-V", "HR-V", "Pilot", "Passport", "Ridgeline",
      "Odyssey", "Fit", "Civic Type R", "NSX", "Clarity"
    ],
    "Ford": [
      "Fiesta", "Focus", "Mustang", "Fusion", "Taurus", "EcoSport", "Escape", "Edge", "Explorer",
      "Expedition", "F-150", "F-250", "F-350", "Ranger", "Bronco", "Bronco Sport", "Mach-E"
    ],
    "Chevrolet": [
      "Spark", "Sonic", "Cruze", "Malibu", "Impala", "Camaro", "Corvette", "Trax", "Equinox",
      "Traverse", "Tahoe", "Suburban", "Colorado", "Silverado", "Bolt EV", "Blazer"
    ],
    "Nissan": [
      "Versa", "Sentra", "Altima", "Maxima", "370Z", "GT-R", "Kicks", "Rogue", "Murano",
      "Pathfinder", "Armada", "Frontier", "Titan", "LEAF", "Ariya"
    ],
    "Hyundai": [
      "Accent", "Elantra", "Sonata", "Azera", "Veloster", "Venue", "Kona", "Tucson", "Santa Fe",
      "Palisade", "Santa Cruz", "Ioniq", "Ioniq 5", "Ioniq 6", "Genesis G70", "Genesis G80", "Genesis G90"
    ],
    "Kia": [
      "Rio", "Forte", "Optima", "Stinger", "Soul", "Seltos", "Sportage", "Sorento", "Telluride",
      "EV6", "Niro", "Carnival", "K5"
    ],
    "Volvo": [
      "XC40", "XC60", "XC90", "S60", "S90", "V60", "V90", "C40", "EX30", "EX90",
      "XC40 Recharge", "XC60 Recharge", "XC90 Recharge"
    ],
    "Jaguar": [
      "XE", "XF", "XJ", "F-PACE", "E-PACE", "I-PACE", "F-TYPE", "XK", "XKR"
    ],
    "Land Rover": [
      "Range Rover", "Range Rover Sport", "Range Rover Evoque", "Range Rover Velar",
      "Discovery", "Discovery Sport", "Defender", "Freelander"
    ],
    "MINI": [
      "Cooper", "Cooper S", "Cooper SE", "Countryman", "Clubman", "Convertible", "John Cooper Works"
    ],
    "Škoda": [
      "Citigo", "Citigo-e iV", "Fabia", "Fabia Monte Carlo", "Scala", "Scala Monte Carlo",
      "Octavia", "Octavia Combi", "Octavia Scout", "Octavia RS", "Octavia iV",
      "Superb", "Superb Combi", "Superb Scout", "Superb iV", "Superb Sportline",
      "Kamiq", "Kamiq Monte Carlo", "Karoq", "Karoq Scout", "Karoq Sportline",
      "Kodiaq", "Kodiaq Scout", "Kodiaq Sportline", "Kodiaq RS", "Enyaq iV",
      "Enyaq Coupe iV", "Enyaq RS iV", "Slavia", "Kushaq", "Rapid", "Roomster"
    ],
    "Skoda": [
      "Citigo", "Citigo-e iV", "Fabia", "Fabia Monte Carlo", "Scala", "Scala Monte Carlo",
      "Octavia", "Octavia Combi", "Octavia Scout", "Octavia RS", "Octavia iV",
      "Superb", "Superb Combi", "Superb Scout", "Superb iV", "Superb Sportline",
      "Kamiq", "Kamiq Monte Carlo", "Karoq", "Karoq Scout", "Karoq Sportline",
      "Kodiaq", "Kodiaq Scout", "Kodiaq Sportline", "Kodiaq RS", "Enyaq iV",
      "Enyaq Coupe iV", "Enyaq RS iV", "Slavia", "Kushaq", "Rapid", "Roomster"
    ],
    "SEAT": [
      "Mii", "Mii Electric", "Ibiza", "Ibiza FR", "Ibiza Cupra", "Ibiza ST",
      "Leon", "Leon ST", "Leon FR", "Leon Cupra", "Leon Cupra R", "Leon e-Hybrid",
      "Toledo", "Arona", "Arona FR", "Ateca", "Ateca FR", "Ateca Cupra",
      "Tarraco", "Tarraco FR", "Alhambra", "Altea", "Altea XL", "Altea Freetrack",
      "Exeo", "Exeo ST", "Cordoba", "Born", "Formentor", "Formentor VZ"
    ],
    "Lexus": [
      "IS", "ES", "GS", "LS", "LC", "RC", "UX", "NX", "RX", "GX", "LX", "LFA"
    ],
    "Acura": [
      "ILX", "TLX", "RLX", "NSX", "RDX", "MDX", "CDX"
    ],
    "Infiniti": [
      "Q50", "Q60", "Q70", "QX30", "QX50", "QX60", "QX70", "QX80"
    ],
    "Cadillac": [
      "ATS", "CTS", "CT4", "CT5", "CT6", "Escalade", "XT4", "XT5", "XT6", "Lyriq"
    ],
    "Lincoln": [
      "Continental", "MKZ", "Navigator", "Aviator", "Corsair", "Nautilus"
    ],
    "Genesis": [
      "G70", "G80", "G90", "GV60", "GV70", "GV80"
    ],
    "Mazda": [
      "Mazda2", "Mazda3", "Mazda6", "MX-5 Miata", "CX-3", "CX-30", "CX-5", "CX-9", "CX-50"
    ],
    "Subaru": [
      "Impreza", "Legacy", "Outback", "Forester", "Ascent", "WRX", "WRX STI", "BRZ", "Crosstrek"
    ],
    "Mitsubishi": [
      "Mirage", "Lancer", "Outlander", "Outlander Sport", "Eclipse Cross", "Pajero"
    ],
    "Opel": [
      "Corsa", "Corsa-e", "Astra", "Astra Sports Tourer", "Insignia", "Insignia Sports Tourer",
      "Grandland", "Grandland X", "Crossland", "Crossland X", "Mokka", "Mokka-e",
      "Combo", "Combo-e Life", "Zafira", "Zafira Life", "Vivaro", "Vivaro-e",
      "Movano", "Movano-e", "Adam", "Karl", "Antara", "Meriva", "Tigra", "Calibra"
    ],
    "Dacia": [
      "Sandero", "Sandero Stepway", "Logan", "Logan MCV", "Duster", "Spring", "Jogger",
      "Lodgy", "Dokker", "Pick-Up", "Solenza", "Nova", "SuperNova", "1310", "1300"
    ],
    "Peugeot": [
      "108", "208", "208 GTi", "e-208", "2008", "e-2008", "308", "308 SW", "308 GTi",
      "3008", "3008 Hybrid", "508", "508 SW", "508 PSE", "5008", "e-Expert", "Expert",
      "Traveller", "e-Traveller", "Boxer", "e-Boxer", "Partner", "Rifter", "Bipper",
      "RCZ", "407", "607", "807", "1007", "4007", "4008", "206", "307", "406", "306"
    ],
    "Renault": [
      "Twingo", "Twingo Electric", "Clio", "Clio RS", "Captur", "Captur E-Tech",
      "Megane", "Megane RS", "Megane E-Tech", "Scenic", "Scenic E-Tech", "Kadjar",
      "Koleos", "Arkana", "Austral", "Talisman", "Espace", "Grand Scenic",
      "Kangoo", "Kangoo E-Tech", "Trafic", "Master", "Master E-Tech", "ZOE",
      "Fluence", "Laguna", "Vel Satis", "Avantime", "Wind", "Sport Spider", "Alpine A110"
    ],
    "Citroën": [
      "C1", "C3", "C3 Aircross", "ë-C3", "C4", "ë-C4", "ë-C4 X", "C5 X", "C5 Aircross",
      "Berlingo", "ë-Berlingo", "SpaceTourer", "ë-SpaceTourer", "Jumpy", "ë-Jumpy",
      "Jumper", "ë-Jumper", "Ami", "C3 Pluriel", "C4 Picasso", "C4 SpaceTourer",
      "Grand C4 Picasso", "C5", "C6", "C8", "DS3", "DS4", "DS5", "Xsara", "Saxo", "AX"
    ],
    "Citroen": [
      "C1", "C3", "C3 Aircross", "ë-C3", "C4", "ë-C4", "ë-C4 X", "C5 X", "C5 Aircross",
      "Berlingo", "ë-Berlingo", "SpaceTourer", "ë-SpaceTourer", "Jumpy", "ë-Jumpy",
      "Jumper", "ë-Jumper", "Ami", "C3 Pluriel", "C4 Picasso", "C4 SpaceTourer",
      "Grand C4 Picasso", "C5", "C6", "C8", "DS3", "DS4", "DS5", "Xsara", "Saxo", "AX"
    ],
    "Alfa Romeo": [
      "Giulia", "Giulia Quadrifoglio", "Stelvio", "Stelvio Quadrifoglio", "Giulietta",
      "Tonale", "Tonale Quadrifoglio", "MiTo", "4C", "4C Spider", "Brera", "Spider",
      "GT", "GTV", "166", "159", "156", "147", "145", "33", "75", "164", "155",
      "Arna", "Montreal", "Junior Zagato", "8C Competizione", "8C Spider"
    ],
    "Fiat": [
      "500", "500e", "500X", "500L", "500C", "Panda", "Panda Cross", "Tipo",
      "Tipo Cross", "Tipo Station Wagon", "Punto", "Punto Evo", "Grande Punto",
      "Qubo", "Doblo", "Doblo Cargo", "Fiorino", "Ducato", "e-Ducato", "Talento",
      "Fullback", "Sedici", "Croma", "Stilo", "Marea", "Brava", "Bravo", "Tempra",
      "Uno", "Palio", "Seicento", "Cinquecento", "Linea", "Albea", "Multipla", "Ulysse"
    ]
  }

  const models = modelMap[make] || ["Model 1", "Model 2", "Model 3"]
  
  return models.map((model, index) => ({
    Model_ID: index + 1,
    Model_Name: model
  }))
}