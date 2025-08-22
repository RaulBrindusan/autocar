export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Termeni și Condiții</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Informații Generale</h2>
              <p className="text-gray-700 mb-4">
                Acești Termeni și Condiții ("Termeni") reglementează utilizarea site-ului web automode.ro 
                ("Site-ul") și serviciile oferite de Automode SRL ("noi", "Compania").
              </p>
              <p className="text-gray-700 mb-4">
                Prin accesarea și utilizarea Site-ului nostru, acceptați în totalitate acești Termeni. 
                Dacă nu sunteți de acord cu aceștia, vă rugăm să nu utilizați Site-ul.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Serviciile Noastre</h2>
              <p className="text-gray-700 mb-4">
                Automode SRL oferă servicii de intermediere pentru importul de vehicule din Europa, incluzând:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Găsirea și selecția vehiculelor conform cerințelor clientului</li>
                <li>Gestionarea procesului de import și documentație</li>
                <li>Transport și logistică</li>
                <li>Consultanță privind costurile și taxele aplicabile</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Obligațiile Utilizatorului</h2>
              <p className="text-gray-700 mb-4">Prin utilizarea serviciilor noastre, vă angajați să:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Furnizați informații corecte și complete</li>
                <li>Respectați toate legile și reglementările aplicabile</li>
                <li>Nu utilizați Site-ul în scopuri ilegale sau neautorizate</li>
                <li>Respectați drepturile de proprietate intelectuală</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Prețuri și Plăți</h2>
              <p className="text-gray-700 mb-4">
                Prețurile pentru serviciile noastre sunt comunicate individual pentru fiecare cerere. 
                Toate prețurile sunt exprimate în RON și includ TVA, unde este cazul.
              </p>
              <p className="text-gray-700 mb-4">
                Plățile se efectuează conform condițiilor agreate în contractul de prestări servicii.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Limitarea Răspunderii</h2>
              <p className="text-gray-700 mb-4">
                Automode SRL își asumă responsabilitatea pentru serviciile prestate în conformitate cu 
                legislația română în vigoare. Nu suntem responsabili pentru:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Modificările legislative care afectează procesul de import</li>
                <li>Defecțiunile ascunse ale vehiculelor</li>
                <li>Întârzierile cauzate de factori externi (autorități, transport, etc.)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Proprietatea Intelectuală</h2>
              <p className="text-gray-700 mb-4">
                Conținutul Site-ului, inclusiv texte, imagini, logo-uri și design, este protejat de 
                drepturile de proprietate intelectuală și aparține Automode SRL sau licențiatorilor săi.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Protecția Datelor</h2>
              <p className="text-gray-700 mb-4">
                Prelucrarea datelor cu caracter personal se realizează în conformitate cu 
                Regulamentul General privind Protecția Datelor (GDPR) și Politica noastră de Confidențialitate.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Modificarea Termenilor</h2>
              <p className="text-gray-700 mb-4">
                Ne rezervăm dreptul de a modifica acești Termeni în orice moment. 
                Modificările vor fi publicate pe această pagină și vor intra în vigoare imediat.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Legea Aplicabilă</h2>
              <p className="text-gray-700 mb-4">
                Acești Termeni sunt guvernați de legea română. Orice litigiu va fi soluționat 
                de instanțele competente din România.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact</h2>
              <p className="text-gray-700 mb-4">
                Pentru întrebări privind acești Termeni, ne puteți contacta la:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Denumire: Automode SRL</li>
                <li>Administrator: Bu Terezia</li>
                <li>Email: contact@automode.ro</li>
                <li>Telefon: 0750462307</li>
                <li>Adresă: Viorele 9, Satu Mare</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}