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
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
        {badge}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-12">
            {/* Content */}
            <div className="text-left lg:pr-12">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                  Importatori specializați din Europa
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
                Povestea Ta Auto
                <span className="block text-blue-600 mt-2">Începe de Aici</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                Accesează cele mai bune mașini din piața europeană. De la BMW și Mercedes 
                la Audi și Porsche - îți aducem vehiculul perfect la cel mai bun preț.
              </p>
              <div className="flex flex-row gap-4 mb-8 items-center justify-center sm:justify-start">
                <Button asChild size="lg" className="text-base px-6 py-4 h-14 font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap">
                  <Link href="/request-car">Vreau Masina</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base px-6 py-4 h-14 font-semibold border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap">
                  <Link href="/calculator">Calculator Cost</Link>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                  <span>Fără costuri ascunse</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                  <span>Garanție completă</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                  <span>Livrare rapidă</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative lg:h-[600px] h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl"></div>
              <Image
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Premium European Car"
                fill
                className="object-cover rounded-3xl shadow-2xl"
                priority
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 max-w-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Expert</div>
                    <div className="text-sm text-gray-500">Servicii Personalizate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Cum Funcționează?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Procesul nostru simplu în 4 pași pentru a-ți importa mașina de vis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center relative">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Consultație</h3>
                <p className="text-gray-600">Discutăm despre preferințele tale și bugetul disponibil</p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200 -translate-y-1/2"></div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center relative">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Căutare</h3>
                <p className="text-gray-600">Căutăm mașina perfectă în rețeaua noastră europeană</p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200 -translate-y-1/2"></div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center relative">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Import</h3>
                <p className="text-gray-600">Gestionăm toate formalitățile de import și transport</p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200 -translate-y-1/2"></div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center relative">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Livrare</h3>
                <p className="text-gray-600">Îți livrăm mașina direct la adresa ta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-5">
          <svg viewBox="0 0 400 400" className="w-full h-full text-gray-200">
            <path d="M0 300 L50 250 L100 300 L150 200 L200 250 L250 150 L300 200 L350 100 L400 150 L400 400 L0 400 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
                De Ce să Alegi AutoMode?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-12 leading-relaxed text-justify max-w-xl">
                Partenerii tăi de încredere pentru import auto din Europa. Îți oferim servicii complete și transparente pentru a-ți aduce mașina perfectă.
              </p>
              
              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
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
            <div className="space-y-6">
              {/* 12 Month Warranty */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Garanție 12 Luni</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Cea mai extinsă garanție din România pentru mașini importate cu protecție completă.
                    </p>
                  </div>
                </div>
              </div>

              {/* Car Report */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Raport Complet Auto</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Analiză tehnică detaliată și verificări profesionale pentru fiecare vehicul.
                    </p>
                  </div>
                </div>
              </div>

              {/* Car Delivery */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Livrare la Domiciliu</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Transport sigur și asigurat direct la adresa ta, fără să te deplasezi.
                    </p>
                  </div>
                </div>
              </div>

              {/* RAR Registration */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Înmatriculare RAR</h3>
                    <p className="text-gray-600 leading-relaxed">
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
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Mașini Populare
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descoperă cele mai căutate modele pe care le-am importat recent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* BMW Seria 5 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">BMW Seria 5 518d M Sport</h3>
                <p className="text-gray-600 mb-4">Diesel - Automatic - 136 hp - 72.212 km</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">€28,000</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-md">Detalii</Button>
                </div>
              </div>
            </div>

            {/* Mercedes-Benz S Long */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mercedes-Benz S 580e AMG Line</h3>
                <p className="text-gray-600 mb-4">Hibrid - Automatic - 367 hp - 8.172 km</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">€110,000</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-md">Detalii</Button>
                </div>
              </div>
            </div>

            {/* Audi RS3 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Audi RS3 2.5 Quattro</h3>
                <p className="text-gray-600 mb-4">Benzina - Automatic - 400 hp - 25.189 km</p>
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
      <section id="cost-estimator" className="py-24 bg-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Calculează Costurile Exact
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Folosește calculatorul nostru avansat pentru a obține o estimare precisă a costurilor pentru importul mașinii tale. Include toate taxele, transportul și comisioanele.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mb-3" />
                <span className="text-gray-700 font-medium">Calculator cu 2 variante: Fără TVA și Cu TVA</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mb-3" />
                <span className="text-gray-700 font-medium">Calcul automat al avansului necesar (20%)</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mb-3" />
                <span className="text-gray-700 font-medium">Rezultate în timp real, fără surprize</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Link href="/calculator">
                  Calculator Cost <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Warranty Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-700/90"></div>
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
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Protecție Completă</h3>
              <p className="text-blue-100 leading-relaxed">
                Acoperim toate problemele mecanice și electrice care pot apărea în primul an de la import, fără excepții.
              </p>
            </div>

            {/* Warranty Feature 2 */}
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Service de Calitate</h3>
              <p className="text-blue-100 leading-relaxed">
                Colaborăm cu service-uri autorizate pentru a-ți asigura reparații profesionale și mentenanță de încredere.
              </p>
            </div>

            {/* Warranty Feature 3 */}
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Suport Dedicat</h3>
              <p className="text-blue-100 leading-relaxed">
                Echipa noastră îți oferă consultanță și asistență pe toată perioada garanției pentru liniștea ta.
              </p>
            </div>
          </div>

          {/* Warranty Details */}
          <div className="bg-white/10 backdrop-blur-sm p-8 lg:p-12 rounded-3xl border border-white/20 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Ce Include Garanția Noastră?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-300 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100">Componente mecanice principale</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-300 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100">Sisteme electrice și electronice</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-300 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100">Elemente de siguranță și confort</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-300 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100">Support tehnic și consultanță</span>
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <div className="bg-white/20 p-8 rounded-2xl">
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
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-white hover:text-blue-800 py-4 px-8 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl w-52">
                <Link href="/request-car">
                  <Shield className="mr-2 h-5 w-5" />
                  Vreau Masina
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 py-4 px-8 font-semibold transition-all duration-300 hover:scale-105 w-52 whitespace-nowrap">
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
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Întrebări Frecvente
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Răspunsuri la cele mai comune întrebări despre importul de mașini
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cât durează procesul de import?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                În medie, procesul durează între 4-8 săptămâni, de la confirmarea comenzii până la livrarea mașinii la adresa ta.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Ce documente sunt necesare?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Avem nevoie de cartea de identitate, un contract de vânzare-cumpărare și documentele vehiculului. Ne ocupăm noi de restul formalităților.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Există garanție pentru mașinile importate?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Da, toate mașinile vin cu garanția producătorului valabilă în România, plus garanția noastră pentru serviciile de import.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Care sunt costurile suplimentare?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Toate costurile sunt transparente: taxe de import, transport, înmatriculare și serviciile noastre. Nu există costuri ascunse.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ce Spun Clienții Noștri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experiențele reale ale clienților noștri mulțumiți
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;Serviciu excelent! Mi-au găsit exact BMW-ul pe care îl căutam și au gestionat totul profesional.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">AP</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Adrian Popescu</div>
                  <div className="text-sm text-gray-500">BMW X3, 2022</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;Transparent, rapid și eficient. Economisesc mult față de piața locală și mașina e în stare perfectă.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">MI</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Maria Ionescu</div>
                  <div className="text-sm text-gray-500">Audi A6, 2021</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;Echipa Automode m-a ajutat să îmi import Mercedes-ul de vis. Procesul a fost simplu și fără probleme.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">CG</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Cătălin Gheorghe</div>
                  <div className="text-sm text-gray-500">Mercedes E-Class, 2023</div>
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
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Scrie-ne pe WhatsApp
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      </a>
    </div>
  )
}
