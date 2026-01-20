import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { MixpanelProvider } from "@/components/analytics/MixpanelProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://automode.ro'),
  title: "Automode - Mașini la Comandă",
  description: "Importați mașina visurilor voastre din Europa cu Automode. Servicii profesionale de import și livrare autovehicule din Germania, Italia, Franța și alte țări europene.",
  keywords: "masini la comanda, import auto, import masini europa, import auto germania, import auto italia, import auto franta, masini second hand europa, calculator import auto, servicii import autovehicule romania",
  authors: [{ name: "Automode Team" }],
  robots: "index, follow",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Automode - Specialiști în Importul de Automobile Europene",
    description: "Importați mașina visurilor voastre din Europa cu Automode. Servicii profesionale de import și livrare.",
    type: "website",
    locale: "ro_RO",
    url: "https://automode.ro",
    siteName: "Automode",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Automode - Import Auto Europa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automode - Mașini la Comandă",
    description: "Importați mașina visurilor voastre din Europa cu servicii profesionale complete.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://automode.ro",
  },
  manifest: "/site.webmanifest",
  other: {
    "google-site-verification": "your-google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors`}
      >
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <Suspense fallback={null}>
                <MixpanelProvider />
              </Suspense>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#363636',
              fontSize: '14px',
              fontWeight: '500',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            success: {
              style: {
                border: '1px solid #10b981',
                color: '#065f46',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              style: {
                border: '1px solid #ef4444',
                color: '#991b1b',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <CookieConsent />
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_URL || "https://cloud.umami.is/script.js"}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
