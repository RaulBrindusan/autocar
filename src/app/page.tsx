'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { CostEstimator } from "@/components/home/CostEstimator"
import { Car, Star, ArrowRight, CheckCircle, Globe, Phone, Mail, Shield, Clock, Award, Users, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"

// Car Carousel Component
const CarCarousel = ({ images, alt, badge }: { images: string[], alt: string, badge: string }) => {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3500) // Change image every 3.5 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="h-56 relative overflow-hidden">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt={alt}
          fill
          className={`object-cover group-hover:scale-105 transition-all duration-500 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900 dark:text-white transition-colors">
        {badge}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--hero-bg)', color: 'var(--hero-text)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-12">
            {/* Content */}
            <div className="text-left lg:pr-12">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 text-sm font-medium rounded-full transition-colors" style={{ backgroundColor: 'var(--info-tip-bg)', color: 'var(--info-tip-text)' }}>
                  Importatori specializați din Europa
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight transition-colors" style={{ color: 'var(--hero-text)' }}>
                Povestea Ta Auto
                <span className="block text-blue-600 mt-2">Începe de Aici</span>
              </h1>
              <p className="text-lg sm:text-xl mb-8 leading-relaxed max-w-xl transition-colors" style={{ color: 'var(--hero-subtext)' }}>
                Accesează cele mai bune mașini din piața europeană. De la BMW și Mercedes 
                la Audi și Porsche - îți aducem vehiculul perfect la cel mai bun preț.
              </p>
              <div className="flex flex-row gap-4 mb-8 items-center justify-center sm:justify-start">
                <Button asChild size="lg" className="text-base px-6 py-4 h-14 font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap">
                  <Link href="/request-car">Vreau Masina</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base px-6 py-4 h-14 font-semibold border-gray-300 text-black bg-white hover:bg-gray-50 hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap">
                  <Link href="/calculator">Calculator Cost</Link>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span>Fără costuri ascunse</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span>Garanție completă</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span>Livrare rapidă</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative lg:h-[600px] h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-3xl transition-colors"></div>
              <Image
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Premium European Car"
                fill
                className="object-cover rounded-3xl shadow-2xl"
                priority
              />
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-xs transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Expert</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Servicii Personalizate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="py-24 transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 transition-colors" style={{ color: 'var(--section-text)' }}>
              Cum Funcționează?
            </h2>
            <p className="text-lg max-w-2xl mx-auto transition-colors" style={{ color: 'var(--section-subtext)' }}>
              Procesul nostru simplu în 4 pași pentru a-ți importa mașina de vis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="rounded-2xl p-8 shadow-sm border text-center relative transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>Consultație</h3>
                <p className="transition-colors" style={{ color: 'var(--card-subtext)' }}>Discutăm despre preferințele tale și bugetul disponibil</p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 -translate-y-1/2 transition-colors" style={{ backgroundColor: 'var(--connector-line)' }}></div>
            </div>

            <div className="relative">
              <div className="rounded-2xl p-8 shadow-sm border text-center relative transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>Căutare</h3>
                <p className="transition-colors" style={{ color: 'var(--card-subtext)' }}>Căutăm mașina perfectă în rețeaua noastră europeană</p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 -translate-y-1/2 transition-colors" style={{ backgroundColor: 'var(--connector-line)' }}></div>
            </div>

            <div className="relative">
              <div className="rounded-2xl p-8 shadow-sm border text-center relative transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>Import</h3>
                <p className="transition-colors" style={{ color: 'var(--card-subtext)' }}>Gestionăm toate formalitățile de import și transport</p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 -translate-y-1/2 transition-colors" style={{ backgroundColor: 'var(--connector-line)' }}></div>
            </div>

            <div className="relative">
              <div className="rounded-2xl p-8 shadow-sm border text-center relative transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>Livrare</h3>
                <p className="transition-colors" style={{ color: 'var(--card-subtext)' }}>Îți livrăm mașina direct la adresa ta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
        {/* Background decoration */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-5">
          <svg viewBox="0 0 400 400" className="w-full h-full text-gray-200">
            <path d="M0 300 L50 250 L100 300 L150 200 L200 250 L250 150 L300 200 L350 100 L400 150 L400 400 L0 400 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left side - Content */}
            <div className="text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight transition-colors" style={{ color: 'var(--section-text)' }}>
                De Ce să Alegi AutoMode?
              </h2>
              <p className="text-lg mb-12 leading-relaxed max-w-xl transition-colors" style={{ color: 'var(--section-subtext)' }}>
                Partenerii tăi de încredere pentru import auto din Europa. Îți oferim servicii complete și transparente pentru a-ți aduce mașina perfectă.
              </p>
              
              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl border transition-colors" style={{ borderColor: 'var(--card-border)' }}>
                <Image
                  src="/image11.jpg"
                  alt="Echipa AutoMode - Specialiști în consultanță auto"
                  width={500}
                  height={300}
                  className="w-full h-[300px] object-cover"
                />
              </div>
            </div>

            {/* Right side - Benefits Grid */}
            <div className="space-y-4">
              {/* 12 Month Warranty */}
              <div className="rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>Garanție 12 Luni</h3>
                    <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                      Cea mai extinsă garanție din România pentru mașini importate cu protecție completă.
                    </p>
                  </div>
                </div>
              </div>

              {/* Car Report */}
              <div className="rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>Raport Complet Auto</h3>
                    <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                      Analiză tehnică detaliată și verificări profesionale pentru fiecare vehicul.
                    </p>
                  </div>
                </div>
              </div>

              {/* Car Delivery */}
              <div className="rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>Livrare la Domiciliu</h3>
                    <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                      Transport sigur și asigurat direct la adresa ta, fără să te deplasezi.
                    </p>
                  </div>
                </div>
              </div>

              {/* RAR Registration */}
              <div className="rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>Înmatriculare RAR</h3>
                    <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                      Ne ocupăm de toate formalitățile RAR și îți livrăm mașina gata de condus.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-24 transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 transition-colors" style={{ color: 'var(--section-text)' }}>
              Mașini Populare
            </h2>
            <p className="text-lg max-w-2xl mx-auto transition-colors" style={{ color: 'var(--section-subtext)' }}>
              Descoperă cele mai căutate modele pe care le-am importat recent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* BMW Seria 5 */}
            <div className="group rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <CarCarousel 
                images={[
                  '/car1/car1.jpeg',
                  '/car1/car2.jpeg',
                  '/car1/2.jpeg',
                  '/car1/4.jpeg',
                  '/car1/5.jpeg',
                  '/car1/6.jpeg',
                  '/car1/7.jpeg',
                  '/car1/8.jpeg'
                ]}
                alt="BMW Seria 5 518d M Sport"
                badge="Premium"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>BMW Seria 5 518d M Sport</h3>
                <p className="mb-4 transition-colors" style={{ color: 'var(--card-subtext)' }}>Diesel - Automatic - 136 hp - 72.212 km</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">€28,000</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-md">Detalii</Button>
                </div>
              </div>
            </div>

            {/* Mercedes-Benz S Long */}
            <div className="group rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <CarCarousel 
                images={[
                  '/car2/1.jpeg',
                  '/car2/2.jpeg',
                  '/car2/3.jpeg',
                  '/car2/4.jpeg',
                  '/car2/5.jpeg',
                  '/car2/6.jpeg',
                  '/car2/7.jpeg',
                  '/car2/8.jpeg'
                ]}
                alt="Mercedes-Benz S Long 580e AMG Line"
                badge="Luxury"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>Mercedes-Benz S 580e AMG Line</h3>
                <p className="mb-4 transition-colors" style={{ color: 'var(--card-subtext)' }}>Hibrid - Automatic - 367 hp - 8.172 km</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">€110,000</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-md">Detalii</Button>
                </div>
              </div>
            </div>

            {/* Audi RS3 */}
            <div className="group rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <CarCarousel 
                images={[
                  '/car3/1.jpeg',
                  '/car3/2.jpeg',
                  '/car3/3.jpeg',
                  '/car3/4.jpeg',
                  '/car3/5.jpeg',
                  '/car3/6.jpeg',
                  '/car3/7.jpeg',
                  '/car3/8.jpeg'
                ]}
                alt="Audi RS3 2.5 Quattro"
                badge="Performance"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>Audi RS3 2.5 Quattro</h3>
                <p className="mb-4 transition-colors" style={{ color: 'var(--card-subtext)' }}>Benzina - Automatic - 400 hp - 25.189 km</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">€54,000</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-md">Detalii</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Estimator Section */}
      <section id="cost-estimator" className="py-24 relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--cost-estimator-bg)' }}>
        {/* Background decoration */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-5">
          <svg viewBox="0 0 400 400" className="w-full h-full text-gray-200">
            <path d="M0 300 L50 250 L100 300 L150 200 L200 250 L250 150 L300 200 L350 100 L400 150 L400 400 L0 400 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 transition-colors" style={{ color: 'var(--section-text)' }}>
              Calculează Costurile Exact
            </h2>
            <p className="text-lg mb-8 transition-colors" style={{ color: 'var(--section-subtext)' }}>
              Folosește calculatorul nostru avansat pentru a obține o estimare precisă a costurilor pentru importul mașinii tale. Include toate taxele, transportul și comisioanele.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mb-3" />
                <span className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>Calculator cu 2 variante: Fără TVA și Cu TVA</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mb-3" />
                <span className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>Calcul automat al avansului necesar (20%)</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mb-3" />
                <span className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>Rezultate în timp real, fără surprize</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Link href="/calculator">
                  Calculator Cost <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Warranty Section */}
      <section className="py-24 text-white relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--warranty-bg)' }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Garanție Completă de 12 Luni
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Investești în mașina ta cu încredere totală. Fiecare vehicul importat vine cu garanția noastră extinsă pentru liniștea ta deplină.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Warranty Feature 1 */}
            <div className="backdrop-blur-sm p-8 rounded-2xl border text-center hover:shadow-md transition-all duration-300 hover:scale-105" style={{ backgroundColor: 'var(--warranty-card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 transition-colors" style={{ color: 'var(--warranty-card-text)' }}>Protecție Completă</h3>
              <p className="leading-relaxed transition-colors" style={{ color: 'var(--warranty-card-subtext)' }}>
                Acoperim toate problemele mecanice și electrice care pot apărea în primul an de la import, fără excepții.
              </p>
            </div>

            {/* Warranty Feature 2 */}
            <div className="backdrop-blur-sm p-8 rounded-2xl border text-center hover:shadow-md transition-all duration-300 hover:scale-105" style={{ backgroundColor: 'var(--warranty-card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 transition-colors" style={{ color: 'var(--warranty-card-text)' }}>Service de Calitate</h3>
              <p className="leading-relaxed transition-colors" style={{ color: 'var(--warranty-card-subtext)' }}>
                Colaborăm cu service-uri autorizate pentru a-ți asigura reparații profesionale și mentenanță de încredere.
              </p>
            </div>

            {/* Warranty Feature 3 */}
            <div className="backdrop-blur-sm p-8 rounded-2xl border text-center hover:shadow-md transition-all duration-300 hover:scale-105" style={{ backgroundColor: 'var(--warranty-card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 transition-colors" style={{ color: 'var(--warranty-card-text)' }}>Suport Dedicat</h3>
              <p className="leading-relaxed transition-colors" style={{ color: 'var(--warranty-card-subtext)' }}>
                Echipa noastră îți oferă consultanță și asistență pe toată perioada garanției pentru liniștea ta.
              </p>
            </div>
          </div>

          {/* Warranty Details */}
          <div className="backdrop-blur-sm p-8 lg:p-12 rounded-3xl border mb-12 transition-colors" style={{ backgroundColor: 'var(--warranty-card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6 transition-colors" style={{ color: 'var(--warranty-card-text)' }}>Ce Include Garanția Noastră?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="transition-colors" style={{ color: 'var(--warranty-card-subtext)' }}>Componente mecanice principale</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="transition-colors" style={{ color: 'var(--warranty-card-subtext)' }}>Sisteme electrice și electronice</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="transition-colors" style={{ color: 'var(--warranty-card-subtext)' }}>Elemente de siguranță și confort</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="transition-colors" style={{ color: 'var(--warranty-card-subtext)' }}>Support tehnic și consultanță</span>
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <div className="p-8 rounded-2xl text-white" style={{ backgroundColor: '#6080F3' }}>
                  <div className="text-4xl font-bold mb-2">12</div>
                  <div className="text-xl font-semibold mb-4">Luni Garanție</div>
                  <div className="text-blue-100 mb-6">
                    Cea mai extinsă garanție din industrie pentru mașini importate
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ai Întrebări Despre Garanție?
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Echipa noastră de specialiști îți explică în detaliu toate beneficiile garanției extended și cum te protejează investiția ta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 py-4 px-8 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl w-60 shadow-lg hover:bg-white hover:text-blue-600">
                <Link href="/request-car" className="text-blue-600 hover:text-blue-600 whitespace-nowrap">
                  <Shield className="mr-2 h-5 w-5" />
                  Vreau Masina
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 py-4 px-8 font-semibold transition-all duration-300 hover:scale-105 w-60 whitespace-nowrap">
                <a href="https://wa.me/40770852489?text=Salut!%20Sunt%20interesat%20de%20o%20masina%20importata%20cu%20garantie%20de%2012%20luni.%20Imi%20puteti%20oferi%20mai%20multe%20detalii?" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Intreaba-ne
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 transition-colors" style={{ color: 'var(--section-text)' }}>
              Întrebări Frecvente
            </h2>
            <p className="text-lg max-w-2xl mx-auto transition-colors" style={{ color: 'var(--section-subtext)' }}>
              Răspunsuri la cele mai comune întrebări despre importul de mașini
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>
                Cât durează procesul de import?
              </h3>
              <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                În medie, procesul durează între 4-8 săptămâni, de la confirmarea comenzii până la livrarea mașinii la adresa ta.
              </p>
            </div>

            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>
                Ce documente sunt necesare?
              </h3>
              <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                Avem nevoie de cartea de identitate, un contract de vânzare-cumpărare și documentele vehiculului. Ne ocupăm noi de restul formalităților.
              </p>
            </div>

            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>
                Există garanție pentru mașinile importate?
              </h3>
              <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                Da, toate mașinile vin cu garanția producătorului valabilă în România, plus garanția noastră pentru serviciile de import.
              </p>
            </div>

            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>
                Care sunt costurile suplimentare?
              </h3>
              <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                Toate costurile sunt transparente: taxe de import, transport, înmatriculare și serviciile noastre. Nu există costuri ascunse.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-24 transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 transition-colors" style={{ color: 'var(--section-text)' }}>
              Ce Spun Clienții Noștri
            </h2>
            <p className="text-lg max-w-2xl mx-auto transition-colors" style={{ color: 'var(--section-subtext)' }}>
              Experiențele reale ale clienților noștri mulțumiți
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="mb-6 leading-relaxed transition-colors" style={{ color: 'var(--card-text)' }}>
                &ldquo;Serviciu excelent! Mi-au găsit exact BMW-ul pe care îl căutam și au gestionat totul profesional.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">AP</span>
                </div>
                <div>
                  <div className="font-semibold transition-colors" style={{ color: 'var(--card-text)' }}>Adrian Popescu</div>
                  <div className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>BMW X3, 2022</div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="mb-6 leading-relaxed transition-colors" style={{ color: 'var(--card-text)' }}>
                &ldquo;Transparent, rapid și eficient. Economisesc mult față de piața locală și mașina e în stare perfectă.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">MI</span>
                </div>
                <div>
                  <div className="font-semibold transition-colors" style={{ color: 'var(--card-text)' }}>Maria Ionescu</div>
                  <div className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>Audi A6, 2021</div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="mb-6 leading-relaxed transition-colors" style={{ color: 'var(--card-text)' }}>
                &ldquo;Echipa Automode m-a ajutat să îmi import Mercedes-ul de vis. Procesul a fost simplu și fără probleme.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">CG</span>
                </div>
                <div>
                  <div className="font-semibold transition-colors" style={{ color: 'var(--card-text)' }}>Cătălin Gheorghe</div>
                  <div className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>Mercedes E-Class, 2023</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/40770852489?text=Salut!%20Am%20vazut%20site-ul%20AutoMode%20si%20sunt%20interesat%20de%20serviciile%20voastre."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Contactează-ne pe WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Scrie-ne pe WhatsApp
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      </a>
    </div>
  )
}
