'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'ro' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  ro: {
    // Hero Section
    'hero.badge': 'Importatori specializați din Europa',
    'hero.title': 'Povestea Ta Auto',
    'hero.title.highlight': 'Începe de Aici',
    'hero.subtitle': 'Accesează cele mai bune mașini din piața europeană. De la BMW și Mercedes la Audi și Porsche - îți aducem vehiculul perfect la cel mai bun preț.',
    'hero.cta.primary': 'Vreau Masina',
    'hero.cta.secondary': 'Calculator Cost',
    'hero.features.no_hidden_costs': 'Fără costuri ascunse',
    'hero.features.full_warranty': 'Garanție completă',
    'hero.features.fast_delivery': 'Livrare rapidă',
    'hero.expert': 'Expert',
    'hero.expert.subtitle': 'Servicii Personalizate',

    // How It Works Section
    'how_it_works.title': 'Cum Funcționează?',
    'how_it_works.subtitle': 'Procesul nostru simplu în 4 pași pentru a-ți importa mașina de vis',
    'how_it_works.step1.title': 'Consultație',
    'how_it_works.step1.description': 'Discutăm despre preferințele tale și bugetul disponibil',
    'how_it_works.step2.title': 'Căutare',
    'how_it_works.step2.description': 'Căutăm mașina perfectă în rețeaua noastră europeană',
    'how_it_works.step3.title': 'Import',
    'how_it_works.step3.description': 'Gestionăm toate formalitățile de import și transport',
    'how_it_works.step4.title': 'Livrare',
    'how_it_works.step4.description': 'Îți livrăm mașina direct la adresa ta',

    // Why Choose Us Section
    'why_choose.title': 'De Ce să Alegi AutoMode?',
    'why_choose.subtitle': 'Partenerii tăi de încredere pentru import auto din Europa. Îți oferim servicii complete și transparente pentru a-ți aduce mașina perfectă.',
    'why_choose.warranty.title': 'Garanție 12 Luni',
    'why_choose.warranty.description': 'Cea mai extinsă garanție din România pentru mașini importate cu protecție completă.',
    'why_choose.report.title': 'Raport Complet Auto',
    'why_choose.report.description': 'Analiză tehnică detaliată și verificări profesionale pentru fiecare vehicul.',
    'why_choose.delivery.title': 'Livrare la Domiciliu',
    'why_choose.delivery.description': 'Transport sigur și asigurat direct la adresa ta, fără să te deplasezi.',
    'why_choose.registration.title': 'Înmatriculare RAR',
    'why_choose.registration.description': 'Ne ocupăm de toate formalitățile RAR și îți livrăm mașina gata de condus.',

    // Featured Cars Section
    'featured_cars.title': 'Mașini Populare',
    'featured_cars.subtitle': 'Descoperă cele mai căutate modele pe care le-am importat recent',
    'featured_cars.badge.premium': 'Premium',
    'featured_cars.badge.luxury': 'Luxury',
    'featured_cars.badge.performance': 'Performance',
    'featured_cars.details_button': 'Detalii',

    // Cost Estimator Section
    'cost_estimator.title': 'Calculează Costurile Exact',
    'cost_estimator.subtitle': 'Folosește calculatorul nostru avansat pentru a obține o estimare precisă a costurilor pentru importul mașinii tale. Include toate taxele, transportul și comisioanele.',
    'cost_estimator.feature1': 'Calculator cu 2 variante: Fără TVA și Cu TVA',
    'cost_estimator.feature2': 'Calcul automat al avansului necesar (20%)',
    'cost_estimator.feature3': 'Rezultate în timp real, fără surprize',
    'cost_estimator.cta': 'Calculator Cost',

    // Warranty Section
    'warranty.title': 'Garanție Completă de 12 Luni',
    'warranty.subtitle': 'Investești în mașina ta cu încredere totală. Fiecare vehicul importat vine cu garanția noastră extinsă pentru liniștea ta deplină.',
    'warranty.complete_protection.title': 'Protecție Completă',
    'warranty.complete_protection.description': 'Acoperim toate problemele mecanice și electrice care pot apărea în primul an de la import, fără excepții.',
    'warranty.quality_service.title': 'Service de Calitate',
    'warranty.quality_service.description': 'Colaborăm cu service-uri autorizate pentru a-ți asigura reparații profesionale și mentenanță de încredere.',
    'warranty.dedicated_support.title': 'Suport Dedicat',
    'warranty.dedicated_support.description': 'Echipa noastră îți oferă consultanță și asistență pe toată perioada garanției pentru liniștea ta.',
    'warranty.what_includes.title': 'Ce Include Garanția Noastră?',
    'warranty.what_includes.mechanical': 'Componente mecanice principale',
    'warranty.what_includes.electrical': 'Sisteme electrice și electronice',
    'warranty.what_includes.safety': 'Elemente de siguranță și confort',
    'warranty.what_includes.support': 'Support tehnic și consultanță',
    'warranty.months': 'Luni Garanție',
    'warranty.months_description': 'Cea mai extinsă garanție din industrie pentru mașini importate',
    'warranty.questions.title': 'Ai Întrebări Despre Garanție?',
    'warranty.questions.subtitle': 'Echipa noastră de specialiști îți explică în detaliu toate beneficiile garanției extended și cum te protejează investiția ta.',
    'warranty.cta.primary': 'Vreau Masina',
    'warranty.cta.secondary': 'Intreaba-ne',

    // FAQ Section
    'faq.title': 'Întrebări Frecvente',
    'faq.subtitle': 'Răspunsuri la cele mai comune întrebări despre importul de mașini',
    'faq.q1.question': 'Cât durează procesul de import?',
    'faq.q1.answer': 'În medie, procesul durează între 4-8 săptămâni, de la confirmarea comenzii până la livrarea mașinii la adresa ta.',
    'faq.q2.question': 'Ce documente sunt necesare?',
    'faq.q2.answer': 'Avem nevoie de cartea de identitate, un contract de vânzare-cumpărare și documentele vehiculului. Ne ocupăm noi de restul formalităților.',
    'faq.q3.question': 'Există garanție pentru mașinile importate?',
    'faq.q3.answer': 'Da, toate mașinile vin cu garanția producătorului valabilă în România, plus garanția noastră pentru serviciile de import.',
    'faq.q4.question': 'Care sunt costurile suplimentare?',
    'faq.q4.answer': 'Toate costurile sunt transparente: taxe de import, transport, înmatriculare și serviciile noastre. Nu există costuri ascunse.',

    // Testimonials Section
    'testimonials.title': 'Ce Spun Clienții Noștri',
    'testimonials.subtitle': 'Experiențele reale ale clienților noștri mulțumiți',
    'testimonials.review1': 'Serviciu excelent! Mi-au găsit exact BMW-ul pe care îl căutam și au gestionat totul profesional.',
    'testimonials.review2': 'Transparent, rapid și eficient. Economisesc mult față de piața locală și mașina e în stare perfectă.',
    'testimonials.review3': 'Echipa Automode m-a ajutat să îmi import Mercedes-ul de vis. Procesul a fost simplu și fără probleme.',

    // WhatsApp
    'whatsapp.tooltip': 'Scrie-ne pe WhatsApp',

    // Header Navigation
    'header.nav.calculator': 'Calculator Cost',
    'header.nav.order_car': 'Comandă Mașină',
    'header.nav.send_openlane': 'Trimite OpenLane',

    // Header User Menu
    'header.user.my_account': 'Contul meu',
    'header.user.sign_out': 'Deconectează-te',
    'header.user.sign_in': 'Conectează-te',
    'header.user.create_account': 'Creează Cont',
    'header.user.administrator': 'Administrator',

    // Footer
    'footer.company_description': 'Partenerul tău de încredere pentru importul de vehicule premium din Europa. Ne ocupăm de tot, de la selecție la livrare, transformând mașina ta de vis în realitate.',
    'footer.services': 'Servicii',
    'footer.order_car': 'Comandă Mașină',
    'footer.cost_calculator': 'Calculator Costuri',
    'footer.legal': 'Legal',
    'footer.terms_conditions': 'Termeni și Condiții',
    'footer.privacy_policy': 'Politica de Confidențialitate',
    'footer.cookies_policy': 'Politica de Cookie-uri',
    'footer.copyright': 'Made by Codemint'
  },
  en: {
    // Hero Section
    'hero.badge': 'Specialized European Importers',
    'hero.title': 'Your Auto Story',
    'hero.title.highlight': 'Starts Here',
    'hero.subtitle': 'Access the best cars from the European market. From BMW and Mercedes to Audi and Porsche - we bring you the perfect vehicle at the best price.',
    'hero.cta.primary': 'I Want Car',
    'hero.cta.secondary': 'Cost Calculator',
    'hero.features.no_hidden_costs': 'No hidden costs',
    'hero.features.full_warranty': 'Full warranty',
    'hero.features.fast_delivery': 'Fast delivery',
    'hero.expert': 'Expert',
    'hero.expert.subtitle': 'Personalized Services',

    // How It Works Section
    'how_it_works.title': 'How It Works?',
    'how_it_works.subtitle': 'Our simple 4-step process to import your dream car',
    'how_it_works.step1.title': 'Consultation',
    'how_it_works.step1.description': 'We discuss your preferences and available budget',
    'how_it_works.step2.title': 'Search',
    'how_it_works.step2.description': 'We find the perfect car in our European network',
    'how_it_works.step3.title': 'Import',
    'how_it_works.step3.description': 'We handle all import formalities and transport',
    'how_it_works.step4.title': 'Delivery',
    'how_it_works.step4.description': 'We deliver the car directly to your address',

    // Why Choose Us Section
    'why_choose.title': 'Why Choose AutoMode?',
    'why_choose.subtitle': 'Your trusted partners for European car imports. We offer complete and transparent services to bring you the perfect car.',
    'why_choose.warranty.title': '12 Months Warranty',
    'why_choose.warranty.description': 'The most extensive warranty in Romania for imported cars with complete protection.',
    'why_choose.report.title': 'Complete Car Report',
    'why_choose.report.description': 'Detailed technical analysis and professional checks for every vehicle.',
    'why_choose.delivery.title': 'Home Delivery',
    'why_choose.delivery.description': 'Safe and insured transport directly to your address, without you having to travel.',
    'why_choose.registration.title': 'RAR Registration',
    'why_choose.registration.description': 'We handle all RAR formalities and deliver your car ready to drive.',

    // Featured Cars Section
    'featured_cars.title': 'Popular Cars',
    'featured_cars.subtitle': 'Discover the most sought-after models we have recently imported',
    'featured_cars.badge.premium': 'Premium',
    'featured_cars.badge.luxury': 'Luxury',
    'featured_cars.badge.performance': 'Performance',
    'featured_cars.details_button': 'Details',

    // Cost Estimator Section
    'cost_estimator.title': 'Calculate Costs Exactly',
    'cost_estimator.subtitle': 'Use our advanced calculator to get an accurate estimate of the costs for importing your car. Includes all taxes, transport and fees.',
    'cost_estimator.feature1': 'Calculator with 2 variants: Without VAT and With VAT',
    'cost_estimator.feature2': 'Automatic calculation of required advance (20%)',
    'cost_estimator.feature3': 'Real-time results, no surprises',
    'cost_estimator.cta': 'Cost Calculator',

    // Warranty Section
    'warranty.title': 'Complete 12 Months Warranty',
    'warranty.subtitle': 'Invest in your car with total confidence. Every imported vehicle comes with our extended warranty for your complete peace of mind.',
    'warranty.complete_protection.title': 'Complete Protection',
    'warranty.complete_protection.description': 'We cover all mechanical and electrical problems that may arise in the first year from import, without exceptions.',
    'warranty.quality_service.title': 'Quality Service',
    'warranty.quality_service.description': 'We collaborate with authorized services to ensure professional repairs and reliable maintenance.',
    'warranty.dedicated_support.title': 'Dedicated Support',
    'warranty.dedicated_support.description': 'Our team provides consultation and assistance throughout the warranty period for your peace of mind.',
    'warranty.what_includes.title': 'What Does Our Warranty Include?',
    'warranty.what_includes.mechanical': 'Main mechanical components',
    'warranty.what_includes.electrical': 'Electrical and electronic systems',
    'warranty.what_includes.safety': 'Safety and comfort elements',
    'warranty.what_includes.support': 'Technical support and consultation',
    'warranty.months': 'Months Warranty',
    'warranty.months_description': 'The most extensive warranty in the industry for imported cars',
    'warranty.questions.title': 'Questions About Warranty?',
    'warranty.questions.subtitle': 'Our team of specialists explains in detail all the benefits of the extended warranty and how it protects your investment.',
    'warranty.cta.primary': 'I Want Car',
    'warranty.cta.secondary': 'Ask Us',

    // FAQ Section
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Answers to the most common questions about car imports',
    'faq.q1.question': 'How long does the import process take?',
    'faq.q1.answer': 'On average, the process takes between 4-8 weeks, from order confirmation to car delivery at your address.',
    'faq.q2.question': 'What documents are needed?',
    'faq.q2.answer': 'We need your ID card, a sales contract and vehicle documents. We take care of the rest of the formalities.',
    'faq.q3.question': 'Is there warranty for imported cars?',
    'faq.q3.answer': 'Yes, all cars come with manufacturer warranty valid in Romania, plus our warranty for import services.',
    'faq.q4.question': 'What are the additional costs?',
    'faq.q4.answer': 'All costs are transparent: import taxes, transport, registration and our services. There are no hidden costs.',

    // Testimonials Section
    'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': 'Real experiences of our satisfied clients',
    'testimonials.review1': 'Excellent service! They found exactly the BMW I was looking for and handled everything professionally.',
    'testimonials.review2': 'Transparent, fast and efficient. I save a lot compared to the local market and the car is in perfect condition.',
    'testimonials.review3': 'The Automode team helped me import my dream Mercedes. The process was simple and hassle-free.',

    // WhatsApp
    'whatsapp.tooltip': 'Write to us on WhatsApp',

    // Header Navigation
    'header.nav.calculator': 'Cost Calculator',
    'header.nav.order_car': 'Order Car',
    'header.nav.send_openlane': 'Send OpenLane',

    // Header User Menu
    'header.user.my_account': 'My Account',
    'header.user.sign_out': 'Sign Out',
    'header.user.sign_in': 'Sign In',
    'header.user.create_account': 'Create Account',
    'header.user.administrator': 'Administrator',

    // Footer
    'footer.company_description': 'Your trusted partner for importing premium vehicles from Europe. We handle everything, from selection to delivery, turning your dream car into reality.',
    'footer.services': 'Services',
    'footer.order_car': 'Order Car',
    'footer.cost_calculator': 'Cost Calculator',
    'footer.legal': 'Legal',
    'footer.terms_conditions': 'Terms and Conditions',
    'footer.privacy_policy': 'Privacy Policy',
    'footer.cookies_policy': 'Cookies Policy',
    'footer.copyright': 'Made by Codemint'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ro')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'ro' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}