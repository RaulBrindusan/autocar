'use client'

import Link from "next/link"
import Image from "next/image"
import { Car, Mail, Phone, MapPin, Heart, Facebook, Instagram, Youtube } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="bg-blue-700 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="flex items-start justify-between">
            {/* Company Info */}
            <div className="flex-1 max-w-md">
              <p className="text-blue-100 mb-4 pt-4">
                {t('footer.company_description')}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-white" />
                  <span className="text-sm">contact@automode.ro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-white" />
                  <span className="text-sm">0750462307</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-white" />
                  <span className="text-sm">Viorele 9, Satu Mare</span>
                </div>
              </div>
              {/* App download badges */}
              <div className="flex gap-3 mt-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md rounded-xl px-3 py-2 transition-all duration-300 hover:scale-105"
                  aria-label="Download on App Store"
                >
                  <svg className="w-5 h-5 fill-current text-gray-900 flex-shrink-0" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <div className="text-left">
                    <div className="text-[9px] text-gray-500 leading-none">Download on the</div>
                    <div className="text-[13px] font-semibold text-gray-900 leading-tight mt-0.5">App Store</div>
                  </div>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=ro.codemint.automode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md rounded-xl px-3 py-2 transition-all duration-300 hover:scale-105"
                  aria-label="Get it on Google Play"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M3.18 23.76c.3.17.65.19.97.07l13.1-7.57-2.89-2.89-11.18 10.39z"/>
                    <path fill="#4285F4" d="M1.38 3.27 1.29 3.36 11.97 14.04v-.39L1.47 3.27z"/>
                    <path fill="#FBBC04" d="M20.85 9.65l-2.77-1.6-3.16 3.16 3.16 3.16 2.8-1.62c.8-.46.8-1.63-.03-2.1z"/>
                    <path fill="#34A853" d="M1.29 3.36C.49 3.84 0 4.72 0 5.83v12.34c0 1.11.49 1.99 1.29 2.47l10.68-10.6z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] text-gray-500 leading-none">Get it on</div>
                    <div className="text-[13px] font-semibold text-gray-900 leading-tight mt-0.5">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/masini-la-comanda" className="text-blue-100 hover:text-white transition-colors">
                    Mașini la Comandă
                  </Link>
                </li>
                <li>
                  <Link href="/stoc" className="text-blue-100 hover:text-white transition-colors">
                    Stoc
                  </Link>
                </li>
                <li>
                  <Link href="/calculator" className="text-blue-100 hover:text-white transition-colors">
                    {t('footer.cost_calculator')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/termeni-si-conditii" className="text-blue-100 hover:text-white transition-colors">
                    {t('footer.terms_conditions')}
                  </Link>
                </li>
                <li>
                  <Link href="/politica-de-confidentialitate" className="text-blue-100 hover:text-white transition-colors">
                    {t('footer.privacy_policy')}
                  </Link>
                </li>
                <li>
                  <Link href="/politica-de-cookies" className="text-blue-100 hover:text-white transition-colors">
                    {t('footer.cookies_policy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* ANPC Icons - Centered Row */}
          <div className="mt-8 flex justify-center items-center">
            <div className="flex items-center gap-6">
              <Link
                href="https://anpc.ro/ce-este-sal/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/anpc-sal.png"
                  alt="ANPC SAL"
                  width={140}
                  height={70}
                  className="h-[70px] w-auto"
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
                  width={140}
                  height={70}
                  className="h-[70px] w-auto"
                />
              </Link>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="mt-6 flex justify-center items-center">
            <div className="flex items-center gap-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61579385231064"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-white" />
              </Link>
              <Link
                href="https://www.instagram.com/automodero/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white" />
              </Link>
              <Link
                href="https://www.youtube.com/@AutomodeRo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="w-full flex justify-center items-center mb-4">
                <div className="flex items-center gap-4">
                  <Link
                    href="https://anpc.ro/ce-este-sal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/anpc-sal.png"
                      alt="ANPC SAL"
                      width={140}
                      height={70}
                      className="h-[70px] w-auto"
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
                      width={140}
                      height={70}
                      className="h-[70px] w-auto"
                    />
                  </Link>
                </div>
              </div>
              <p className="text-blue-100 mb-4 max-w-md mx-auto text-center">
                {t('footer.company_description')}
              </p>
              <div className="space-y-2 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4 text-white" />
                  <span className="text-sm">contact@automode.ro</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4 text-white" />
                  <span className="text-sm">0750462307</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4 text-white" />
                  <span className="text-sm">Viorele 9, Satu Mare</span>
                </div>
              </div>
              {/* App download badges */}
              <div className="flex justify-center gap-3 mt-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md rounded-xl px-3 py-2 transition-all duration-300 hover:scale-105"
                  aria-label="Download on App Store"
                >
                  <svg className="w-5 h-5 fill-current text-gray-900 flex-shrink-0" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <div className="text-left">
                    <div className="text-[9px] text-gray-500 leading-none">Download on the</div>
                    <div className="text-[13px] font-semibold text-gray-900 leading-tight mt-0.5">App Store</div>
                  </div>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=ro.codemint.automode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md rounded-xl px-3 py-2 transition-all duration-300 hover:scale-105"
                  aria-label="Get it on Google Play"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M3.18 23.76c.3.17.65.19.97.07l13.1-7.57-2.89-2.89-11.18 10.39z"/>
                    <path fill="#4285F4" d="M1.38 3.27 1.29 3.36 11.97 14.04v-.39L1.47 3.27z"/>
                    <path fill="#FBBC04" d="M20.85 9.65l-2.77-1.6-3.16 3.16 3.16 3.16 2.8-1.62c.8-.46.8-1.63-.03-2.1z"/>
                    <path fill="#34A853" d="M1.29 3.36C.49 3.84 0 4.72 0 5.83v12.34c0 1.11.49 1.99 1.29 2.47l10.68-10.6z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] text-gray-500 leading-none">Get it on</div>
                    <div className="text-[13px] font-semibold text-gray-900 leading-tight mt-0.5">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/masini-la-comanda" className="text-blue-100 hover:text-white transition-colors">
                    Mașini la Comandă
                  </Link>
                </li>
                <li>
                  <Link href="/stoc" className="text-blue-100 hover:text-white transition-colors">
                    Stoc
                  </Link>
                </li>
                <li>
                  <Link href="/calculator" className="text-blue-100 hover:text-white transition-colors">
                    {t('footer.cost_calculator')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/termeni-si-conditii" className="text-blue-100 hover:text-white transition-colors">
                    {t('footer.terms_conditions')}
                  </Link>
                </li>
                <li>
                  <Link href="/politica-de-confidentialitate" className="text-blue-100 hover:text-white transition-colors">
                    {t('footer.privacy_policy')}
                  </Link>
                </li>
                <li>
                  <Link href="/politica-de-cookies" className="text-blue-100 hover:text-white transition-colors">
                    {t('footer.cookies_policy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Icons - Mobile/Tablet */}
          <div className="mt-6 flex justify-center items-center">
            <div className="flex items-center gap-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61579385231064"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-white" />
              </Link>
              <Link
                href="https://www.instagram.com/automodero/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white" />
              </Link>
              <Link
                href="https://www.youtube.com/@AutomodeRo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-blue-600">
          <div className="flex justify-center items-center">
            <p className="text-blue-200 text-sm flex items-center space-x-1">
              <span>© 2025 Made by Codemint with</span>
              <Heart className="h-4 w-4 text-red-400 fill-current" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}