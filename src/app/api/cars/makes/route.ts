import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Use comprehensive makes list directly for better coverage
    const comprehensiveMakes = [
      // European Premium
      { Make_ID: 1, Make_Name: "BMW" },
      { Make_ID: 2, Make_Name: "Mercedes-Benz" },
      { Make_ID: 3, Make_Name: "Audi" },
      { Make_ID: 4, Make_Name: "Volkswagen" },
      { Make_ID: 5, Make_Name: "Porsche" },
      { Make_ID: 6, Make_Name: "Volvo" },
      { Make_ID: 7, Make_Name: "Jaguar" },
      { Make_ID: 8, Make_Name: "Land Rover" },
      { Make_ID: 9, Make_Name: "MINI" },
      { Make_ID: 10, Make_Name: "Škoda" },
      { Make_ID: 11, Make_Name: "SEAT" },
      { Make_ID: 12, Make_Name: "Opel" },
      { Make_ID: 13, Make_Name: "Peugeot" },
      { Make_ID: 14, Make_Name: "Renault" },
      { Make_ID: 15, Make_Name: "Citroën" },
      { Make_ID: 16, Make_Name: "Fiat" },
      { Make_ID: 17, Make_Name: "Alfa Romeo" },
      { Make_ID: 18, Make_Name: "Ferrari" },
      { Make_ID: 19, Make_Name: "Lamborghini" },
      { Make_ID: 20, Make_Name: "Maserati" },
      { Make_ID: 21, Make_Name: "Bentley" },
      { Make_ID: 22, Make_Name: "Rolls-Royce" },
      { Make_ID: 23, Make_Name: "Aston Martin" },
      { Make_ID: 24, Make_Name: "McLaren" },
      { Make_ID: 25, Make_Name: "Bugatti" },
      { Make_ID: 26, Make_Name: "Lotus" },
      
      // American
      { Make_ID: 27, Make_Name: "Ford" },
      { Make_ID: 28, Make_Name: "Chevrolet" },
      { Make_ID: 29, Make_Name: "Cadillac" },
      { Make_ID: 30, Make_Name: "Lincoln" },
      { Make_ID: 31, Make_Name: "Tesla" },
      { Make_ID: 32, Make_Name: "Jeep" },
      { Make_ID: 33, Make_Name: "Dodge" },
      { Make_ID: 34, Make_Name: "Chrysler" },
      { Make_ID: 35, Make_Name: "Ram" },
      { Make_ID: 36, Make_Name: "GMC" },
      { Make_ID: 37, Make_Name: "Buick" },
      
      // Japanese
      { Make_ID: 38, Make_Name: "Toyota" },
      { Make_ID: 39, Make_Name: "Honda" },
      { Make_ID: 40, Make_Name: "Nissan" },
      { Make_ID: 41, Make_Name: "Mazda" },
      { Make_ID: 42, Make_Name: "Subaru" },
      { Make_ID: 43, Make_Name: "Mitsubishi" },
      { Make_ID: 44, Make_Name: "Lexus" },
      { Make_ID: 45, Make_Name: "Acura" },
      { Make_ID: 46, Make_Name: "Infiniti" },
      { Make_ID: 47, Make_Name: "Suzuki" },
      { Make_ID: 48, Make_Name: "Isuzu" },
      
      // Korean
      { Make_ID: 49, Make_Name: "Hyundai" },
      { Make_ID: 50, Make_Name: "Kia" },
      { Make_ID: 51, Make_Name: "Genesis" },
      
      // Other European
      { Make_ID: 52, Make_Name: "Saab" },
      { Make_ID: 53, Make_Name: "Smart" },
      { Make_ID: 54, Make_Name: "Lancia" },
      { Make_ID: 55, Make_Name: "Dacia" },
      { Make_ID: 56, Make_Name: "Tata" },
      
      // Luxury/Exotic
      { Make_ID: 57, Make_Name: "Koenigsegg" },
      { Make_ID: 58, Make_Name: "Pagani" },
      { Make_ID: 59, Make_Name: "Maybach" },
      { Make_ID: 60, Make_Name: "Mercedes-AMG" },
      { Make_ID: 61, Make_Name: "BMW M" },
      { Make_ID: 62, Make_Name: "Audi Sport" }
    ]

    return NextResponse.json({
      success: true,
      makes: comprehensiveMakes
    })

  } catch (error) {
    console.error('Error fetching car makes:', error)
    
    // Return comprehensive fallback data (same as above)
    const fallbackMakes = [
      // European Premium
      { Make_ID: 1, Make_Name: "BMW" },
      { Make_ID: 2, Make_Name: "Mercedes-Benz" },
      { Make_ID: 3, Make_Name: "Audi" },
      { Make_ID: 4, Make_Name: "Volkswagen" },
      { Make_ID: 5, Make_Name: "Porsche" },
      { Make_ID: 6, Make_Name: "Volvo" },
      { Make_ID: 7, Make_Name: "Jaguar" },
      { Make_ID: 8, Make_Name: "Land Rover" },
      { Make_ID: 9, Make_Name: "MINI" },
      { Make_ID: 10, Make_Name: "Škoda" },
      { Make_ID: 11, Make_Name: "SEAT" },
      { Make_ID: 12, Make_Name: "Opel" },
      { Make_ID: 13, Make_Name: "Peugeot" },
      { Make_ID: 14, Make_Name: "Renault" },
      { Make_ID: 15, Make_Name: "Citroën" },
      { Make_ID: 16, Make_Name: "Fiat" },
      { Make_ID: 17, Make_Name: "Alfa Romeo" },
      { Make_ID: 18, Make_Name: "Ferrari" },
      { Make_ID: 19, Make_Name: "Lamborghini" },
      { Make_ID: 20, Make_Name: "Maserati" },
      { Make_ID: 21, Make_Name: "Bentley" },
      { Make_ID: 22, Make_Name: "Rolls-Royce" },
      { Make_ID: 23, Make_Name: "Aston Martin" },
      { Make_ID: 24, Make_Name: "McLaren" },
      { Make_ID: 25, Make_Name: "Bugatti" },
      { Make_ID: 26, Make_Name: "Lotus" },
      
      // American
      { Make_ID: 27, Make_Name: "Ford" },
      { Make_ID: 28, Make_Name: "Chevrolet" },
      { Make_ID: 29, Make_Name: "Cadillac" },
      { Make_ID: 30, Make_Name: "Lincoln" },
      { Make_ID: 31, Make_Name: "Tesla" },
      { Make_ID: 32, Make_Name: "Jeep" },
      { Make_ID: 33, Make_Name: "Dodge" },
      { Make_ID: 34, Make_Name: "Chrysler" },
      { Make_ID: 35, Make_Name: "Ram" },
      { Make_ID: 36, Make_Name: "GMC" },
      { Make_ID: 37, Make_Name: "Buick" },
      
      // Japanese
      { Make_ID: 38, Make_Name: "Toyota" },
      { Make_ID: 39, Make_Name: "Honda" },
      { Make_ID: 40, Make_Name: "Nissan" },
      { Make_ID: 41, Make_Name: "Mazda" },
      { Make_ID: 42, Make_Name: "Subaru" },
      { Make_ID: 43, Make_Name: "Mitsubishi" },
      { Make_ID: 44, Make_Name: "Lexus" },
      { Make_ID: 45, Make_Name: "Acura" },
      { Make_ID: 46, Make_Name: "Infiniti" },
      { Make_ID: 47, Make_Name: "Suzuki" },
      { Make_ID: 48, Make_Name: "Isuzu" },
      
      // Korean
      { Make_ID: 49, Make_Name: "Hyundai" },
      { Make_ID: 50, Make_Name: "Kia" },
      { Make_ID: 51, Make_Name: "Genesis" },
      
      // Other European
      { Make_ID: 52, Make_Name: "Saab" },
      { Make_ID: 53, Make_Name: "Smart" },
      { Make_ID: 54, Make_Name: "Lancia" },
      { Make_ID: 55, Make_Name: "Dacia" },
      { Make_ID: 56, Make_Name: "Tata" },
      
      // Luxury/Exotic
      { Make_ID: 57, Make_Name: "Koenigsegg" },
      { Make_ID: 58, Make_Name: "Pagani" },
      { Make_ID: 59, Make_Name: "Maybach" },
      { Make_ID: 60, Make_Name: "Mercedes-AMG" },
      { Make_ID: 61, Make_Name: "BMW M" },
      { Make_ID: 62, Make_Name: "Audi Sport" }
    ]

    return NextResponse.json({
      success: true,
      makes: fallbackMakes
    })
  }
}