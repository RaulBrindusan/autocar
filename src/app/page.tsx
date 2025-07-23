import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { CostEstimator } from "@/components/home/CostEstimator"
import { Car, Star, ArrowRight, CheckCircle, Globe, Phone, Mail } from "lucide-react"

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
                Mașini Premium
                <span className="block text-blue-600 mt-2">din Europa</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                Accesează cele mai bune mașini din piața europeană. De la BMW și Mercedes 
                la Audi și Porsche - îți aducem vehiculul perfect la cel mai bun preț.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button asChild size="lg" className="text-base px-8 py-4 h-14 font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Link href="/request-car">Vreau o Mașină</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base px-8 py-4 h-14 font-semibold border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Link href="#cost-estimator">Calculează Costul</Link>
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
            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-56 relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="BMW Seria 3"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                  Premium
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">BMW Seria 3</h3>
                <p className="text-gray-600 mb-4">Sedan premium cu performanțe excepționale</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">€35,000</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-md">Detalii</Button>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-56 relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Audi A4"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                  Popular
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Audi A4</h3>
                <p className="text-gray-600 mb-4">Elegantă și tehnologic avansată</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">€40,000</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-md">Detalii</Button>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-56 relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Mercedes C-Class"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                  Luxury
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mercedes C-Class</h3>
                <p className="text-gray-600 mb-4">Luxul german la cel mai înalt nivel</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">€45,000</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Știi Costurile Dinainte
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Obține o estimare instantanee pentru importul mașinii tale europene. 
                Calculatorul nostru include toate costurile majore, fără surprize.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Taxe și comisioane de import</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Costuri de transport și logistică</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Taxe și comisioane regulamentare</span>
                </div>
              </div>

              <Button asChild className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Link href="/request-car">
                  Comandă Mașină <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div>
              <CostEstimator />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
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
                &ldquo;Echipa AutoCar m-a ajutat să îmi import Mercedes-ul de vis. Procesul a fost simplu și fără probleme.&rdquo;
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

      {/* Contact Section */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Contactează-ne Astăzi
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                Suntem aici să te ajutăm să îți găsești mașina perfectă din Europa
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-200" />
                  <span>+40 123 456 789</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-200" />
                  <span>contact@autocar.ro</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-blue-200" />
                  <span>Luni - Vineri: 9:00 - 18:00</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <h3 className="text-xl font-semibold mb-6">Contact Rapid</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Numele tău"
                  className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input 
                  type="email" 
                  placeholder="Email"
                  className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <textarea 
                  placeholder="Mesajul tău"
                  rows={4}
                  className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                ></textarea>
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Trimite Mesajul
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Gata să Îți Imporți Mașina de Vis?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Alătură-te sutelor de clienți mulțumiți care ne-au încredințat importul mașinilor lor europene
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 py-4 px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Link href="/request-car">Începe Cererea Ta</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 py-4 px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Link href="/request-car?tab=openlane">Trimite Link OpenLane</Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span>4.9/5 Rating Clienți</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span>500+ Mașini Importate</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
