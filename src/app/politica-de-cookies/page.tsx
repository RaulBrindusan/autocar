import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politica de Cookie-uri | AutoMode',
  description: 'Informații despre utilizarea cookie-urilor pe site-ul AutoMode pentru import automobile din Europa. Află cum folosim cookie-urile și cum le poți gestiona.',
  robots: 'noindex, follow',
  alternates: {
    canonical: 'https://automode.ro/politica-de-cookies',
  },
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Politica de Cookie-uri</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Ce sunt Cookie-urile?</h2>
              <p className="text-gray-700 mb-4">
                Cookie-urile sunt fișiere mici de text care sunt plasate pe dispozitivul dumneavoastră 
                (computer, smartphone, tabletă) când vizitați un site web. Acestea permit site-ului 
                să vă recunoască și să își amintească anumite informații despre vizita dumneavoastră.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Cum Utilizăm Cookie-urile</h2>
              <p className="text-gray-700 mb-4">
                Automode SRL utilizează cookie-uri pentru a îmbunătăți experiența dumneavoastră pe site-ul nostru. 
                Acestea ne ajută să:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Păstrăm setările și preferințele dumneavoastră</li>
                <li>Analizăm traficul și comportamentul pe site</li>
                <li>Personalizăm conținutul și ofertele</li>
                <li>Îmbunătățim securitatea și funcționalitatea</li>
                <li>Oferim funcționalități de social media</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Tipurile de Cookie-uri Utilizate</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookie-uri Esențiale</h3>
              <p className="text-gray-700 mb-4">
                Aceste cookie-uri sunt necesare pentru funcționarea de bază a site-ului și nu pot fi dezactivate. 
                Ele includ:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Cookie-uri de sesiune pentru autentificare</li>
                <li>Cookie-uri pentru securitate și prevenirea fraudelor</li>
                <li>Cookie-uri pentru funcționalitatea formularelor</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookie-uri de Performanță</h3>
              <p className="text-gray-700 mb-4">
                Aceste cookie-uri colectează informații despre modul în care utilizați site-ul nostru, 
                cum ar fi:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Paginile cel mai frecvent vizitate</li>
                <li>Timpul petrecut pe site</li>
                <li>Mesajele de eroare întâlnite</li>
                <li>Rata de bounce și conversii</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookie-uri de Funcționalitate</h3>
              <p className="text-gray-700 mb-4">
                Aceste cookie-uri permit site-ului să își amintească alegerile dumneavoastră:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Limba preferată</li>
                <li>Regiunea sau țara</li>
                <li>Setările de afișare</li>
                <li>Preferințele de utilizare</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookie-uri de Marketing</h3>
              <p className="text-gray-700 mb-4">
                Aceste cookie-uri sunt utilizate pentru a vă oferi publicitate relevantă:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Urmărirea intereselor și comportamentului</li>
                <li>Personalizarea reclamelor</li>
                <li>Măsurarea eficacității campaniilor</li>
                <li>Partajarea informațiilor cu partenerii publicitari</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Cookie-uri de la Terți</h2>
              <p className="text-gray-700 mb-4">
                Site-ul nostru poate include și cookie-uri de la servicii terțe, cum ar fi:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Google Analytics</h3>
              <p className="text-gray-700 mb-4">
                Utilizăm Google Analytics pentru a analiza traficul pe site. Aceste cookie-uri colectează 
                informații anonime despre vizitele dumneavoastră.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Social Media</h3>
              <p className="text-gray-700 mb-4">
                Cookie-urile de la platformele sociale (Facebook, Instagram, etc.) sunt utilizate 
                pentru funcționalitățile de partajare și integrare.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Durata Cookie-urilor</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookie-uri de Sesiune</h3>
              <p className="text-gray-700 mb-4">
                Aceste cookie-uri sunt temporare și se șterg automat când închideți browser-ul.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookie-uri Persistente</h3>
              <p className="text-gray-700 mb-4">
                Aceste cookie-uri rămân pe dispozitivul dumneavoastră pentru o perioadă determinată 
                sau până când le ștergeți manual. Duratele variază între:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Cookie-uri esențiale: 1 an</li>
                <li>Cookie-uri de performanță: 2 ani</li>
                <li>Cookie-uri de marketing: 13 luni</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Gestionarea Cookie-urilor</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Prin Panoul de Consimțământ</h3>
              <p className="text-gray-700 mb-4">
                Când vizitați pentru prima dată site-ul nostru, veți vedea un banner de cookie-uri 
                care vă permite să alegeți ce tipuri de cookie-uri acceptați.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Prin Setările Browser-ului</h3>
              <p className="text-gray-700 mb-4">
                Majoritatea browser-elor vă permit să:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Vizualizați cookie-urile stocate</li>
                <li>Blocați toate cookie-urile</li>
                <li>Blocați cookie-urile de la terți</li>
                <li>Ștergeți cookie-urile la închiderea browser-ului</li>
                <li>Ștergeți anumite cookie-uri</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Instrucțiuni pentru Browser-e</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li><strong>Chrome:</strong> Setări → Confidențialitate și securitate → Cookie-uri</li>
                <li><strong>Firefox:</strong> Setări → Confidențialitate și securitate</li>
                <li><strong>Safari:</strong> Preferințe → Confidențialitate</li>
                <li><strong>Edge:</strong> Setări → Cookie-uri și permisiuni de site</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Impactul Dezactivării Cookie-urilor</h2>
              <p className="text-gray-700 mb-4">
                Dezactivarea anumitor cookie-uri poate afecta funcționarea site-ului:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Cookie-uri esențiale:</strong> Site-ul poate să nu funcționeze corect</li>
                <li><strong>Cookie-uri de performanță:</strong> Nu vom putea îmbunătăți site-ul pe baza utilizării</li>
                <li><strong>Cookie-uri de funcționalitate:</strong> Setările nu vor fi salvate</li>
                <li><strong>Cookie-uri de marketing:</strong> Reclamele pot fi mai puțin relevante</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Actualizări ale Politicii</h2>
              <p className="text-gray-700 mb-4">
                Ne rezervăm dreptul de a actualiza această Politică de Cookie-uri pentru a reflecta 
                schimbările în tehnologie sau legislație. Orice modificări vor fi publicate pe această pagină.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact</h2>
              <p className="text-gray-700 mb-4">
                Pentru întrebări despre utilizarea cookie-urilor, ne puteți contacta la:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Email: privacy@automode.ro</li>
                <li>Telefon: 0750462307</li>
                <li>Adresă: Viorele 9, Satu Mare</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Legături Utile</h2>
              <p className="text-gray-700 mb-4">Pentru mai multe informații despre cookie-uri:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">All About Cookies</a></li>
                <li><a href="https://ico.org.uk/for-organisations/guide-to-pecr/cookies-and-similar-technologies/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ICO Cookie Guidance</a></li>
                <li><a href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ANSPDCP România</a></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}