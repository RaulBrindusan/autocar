import Link from "next/link"
import { Car, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-blue-700 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">AutoCar</span>
            </div>
            <p className="text-blue-100 mb-4 max-w-md">
              Partenerul tău de încredere pentru importul de vehicule premium din Europa. 
              Ne ocupăm de tot, de la selecție la livrare, transformând mașina ta de vis în realitate.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-white" />
                <span className="text-sm">contact@autocar.ro</span>
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

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Linkuri Rapide</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-100 hover:text-white transition-colors">
                  Acasă
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-blue-100 hover:text-white transition-colors">
                  Despre Noi
                </Link>
              </li>
              <li>
                <Link href="/request-car" className="text-blue-100 hover:text-white transition-colors">
                  Comandă Mașină
                </Link>
              </li>
              <li>
                <Link href="/estimate" className="text-blue-100 hover:text-white transition-colors">
                  Calculator Costuri
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicii</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-blue-100">Găsire Mașini</span>
              </li>
              <li>
                <span className="text-blue-100">Gestionare Import</span>
              </li>
              <li>
                <span className="text-blue-100">Transport & Logistică</span>
              </li>
              <li>
                <span className="text-blue-100">Documentație</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-600 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm">
            © {new Date().getFullYear()} AutoCar. Toate drepturile rezervate.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-blue-200 hover:text-white text-sm transition-colors">
              Politica de Confidențialitate
            </Link>
            <Link href="/terms" className="text-blue-200 hover:text-white text-sm transition-colors">
              Termeni și Condiții
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}