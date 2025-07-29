import Link from "next/link"
import Image from "next/image"
import { Car, Mail, Phone, MapPin, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-blue-700 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:items-start lg:justify-between">
          {/* Company Info with Logo */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center mb-4">
              <Image
                src="/AUTO.svg"
                alt="Automode"
                width={400}
                height={160}
                className="block h-40 w-auto"
              />
            </div>
            <p className="text-blue-100 mb-4">
              Partenerul tău de încredere pentru importul de vehicule premium din Europa. 
              Ne ocupăm de tot, de la selecție la livrare, transformând mașina ta de vis în realitate.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-white" />
                <span className="text-sm">contact@automode.ro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-white" />
                <span className="text-sm">+40 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-white" />
                <span className="text-sm">Str. Importului 123, București, România</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicii</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/request-car" className="text-blue-100 hover:text-white transition-colors">
                  Comandă Mașină
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-blue-100 hover:text-white transition-colors">
                  Calculator Costuri
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/termeni-si-conditii" className="text-blue-100 hover:text-white transition-colors">
                  Termeni și Condiții
                </Link>
              </li>
              <li>
                <Link href="/politica-de-confidentialitate" className="text-blue-100 hover:text-white transition-colors">
                  Politica de Confidențialitate
                </Link>
              </li>
              <li>
                <Link href="/politica-de-cookies" className="text-blue-100 hover:text-white transition-colors">
                  Politica de Cookie-uri
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center justify-center mb-4">
                <Image
                  src="/AUTO.svg"
                  alt="Automode"
                  width={400}
                  height={160}
                  className="block h-40 w-auto"
                />
              </div>
              <p className="text-blue-100 mb-4 max-w-md mx-auto text-center">
                Partenerul tău de încredere pentru importul de vehicule premium din Europa. 
                Ne ocupăm de tot, de la selecție la livrare, transformând mașina ta de vis în realitate.
              </p>
              <div className="space-y-2 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4 text-white" />
                  <span className="text-sm">contact@automode.ro</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4 text-white" />
                  <span className="text-sm">+40 123 456 789</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4 text-white" />
                  <span className="text-sm">Str. Importului 123, București, România</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">Servicii</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/request-car" className="text-blue-100 hover:text-white transition-colors">
                    Comandă Mașină
                  </Link>
                </li>
                <li>
                  <Link href="/calculator" className="text-blue-100 hover:text-white transition-colors">
                    Calculator Costuri
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/termeni-si-conditii" className="text-blue-100 hover:text-white transition-colors">
                    Termeni și Condiții
                  </Link>
                </li>
                <li>
                  <Link href="/politica-de-confidentialitate" className="text-blue-100 hover:text-white transition-colors">
                    Politica de Confidențialitate
                  </Link>
                </li>
                <li>
                  <Link href="/politica-de-cookies" className="text-blue-100 hover:text-white transition-colors">
                    Politica de Cookie-uri
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6">
          {/* ANPC Logos */}
          <div className="flex justify-center items-center space-x-8 mb-6">
            <Link 
              href="https://anpc.ro/ce-este-sal/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/anpc-sal.png"
                alt="ANPC SAL"
                width={200}
                height={100}
                className="h-20 w-auto"
              />
            </Link>
            <Link 
              href="https://ec.europa.eu/consumers/odr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/anpc-sol.png"
                alt="ANPC SOL"
                width={200}
                height={100}
                className="h-20 w-auto"
              />
            </Link>
          </div>
          
          <div className="flex justify-center items-center">
            <p className="text-blue-200 text-sm flex items-center space-x-1">
              <span>© {new Date().getFullYear()} Made by Codemint</span>
              <Heart className="h-4 w-4 text-red-400 fill-current" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}