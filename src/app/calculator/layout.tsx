import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculator Import Auto | Calculează Costul Importului | AutoMode',
  description: 'Folosește calculatorul nostru gratuit pentru a afla costul total al importului mașinii tale din Europa. Include preț achiziție, taxe vamale, TVA, transport și comision AutoMode.',
  keywords: 'calculator import auto, cost import masina, taxe import auto romania, calculator taxe vamale, pret import germania, cost transport auto',
  openGraph: {
    title: 'Calculator Import Auto - Află Costul Total | AutoMode',
    description: 'Calculează instant costul total pentru importul mașinii tale din Europa. Include toate taxele și comisioanele.',
    type: 'website',
    url: 'https://automode.ro/calculator',
    siteName: 'AutoMode',
  },
  twitter: {
    card: 'summary',
    title: 'Calculator Import Auto | AutoMode',
    description: 'Calculează costul total al importului mașinii tale din Europa',
  },
  alternates: {
    canonical: 'https://automode.ro/calculator',
  },
}

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
