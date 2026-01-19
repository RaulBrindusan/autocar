import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mașini la Comandă din Europa | Import Auto Personalizat | AutoMode',
  description: 'Comandă mașina perfectă din Europa cu AutoMode. Completează formularul nostru și primește oferte personalizate pentru BMW, Mercedes, Audi, Volkswagen și alte mărci premium. Garanție 12 luni inclusă.',
  keywords: 'masini la comanda, import auto personalizat, comanda masina din europa, import bmw, import mercedes, import audi, masini personalizate romania, auto la comanda',
  openGraph: {
    title: 'Comandă Mașina Ta Perfectă din Europa | AutoMode',
    description: 'Completează formularul și primește oferte personalizate pentru mașina visurilor tale din Europa. Garanție 12 luni, transport inclus, fără costuri ascunse.',
    type: 'website',
    url: 'https://automode.ro/masini-la-comanda',
    siteName: 'AutoMode',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'AutoMode - Mașini la Comandă din Europa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comandă Mașina Ta Perfectă din Europa | AutoMode',
    description: 'Formularul nostru simplu te ajută să găsești și să imporți mașina perfectă din Europa',
  },
  alternates: {
    canonical: 'https://automode.ro/masini-la-comanda',
  },
}

export default function MasiniLaComandaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
