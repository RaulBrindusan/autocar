export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Regulamentul General pentru Protecția Datelor (GDPR)</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Conformitatea GDPR</h2>
            <p className="text-gray-700 leading-relaxed">
              Serviciile noastre sunt conforme cu Regulamentul General pentru Protecția Datelor (GDPR) 
              al Uniunii Europene, aplicabil din 25 mai 2018.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Baza Legală pentru Prelucrare</h2>
            <p className="text-gray-700 leading-relaxed">
              Prelucrăm datele dumneavoastră personale pe baza următoarelor fundamente legale:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
              <li>Consimțământul dumneavoastră explicit</li>
              <li>Executarea unui contract</li>
              <li>Respectarea unei obligații legale</li>
              <li>Interesele legitime ale operatorului</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Drepturile Persoanelor Vizate</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Dreptul de informare</h3>
                <p className="text-gray-700">Aveți dreptul să fiți informat cu privire la prelucrarea datelor dumneavoastră.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Dreptul de acces</h3>
                <p className="text-gray-700">Aveți dreptul să obțineți confirmarea că datele sunt prelucrate și să accesați aceste date.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Dreptul la rectificare</h3>
                <p className="text-gray-700">Aveți dreptul să solicitați rectificarea datelor inexacte.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Dreptul la ștergere</h3>
                <p className="text-gray-700">Aveți dreptul să solicitați ștergerea datelor în anumite condiții.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Dreptul la portabilitate</h3>
                <p className="text-gray-700">Aveți dreptul să primiți datele într-un format structurat.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Exercitarea Drepturilor</h2>
            <p className="text-gray-700 leading-relaxed">
              Pentru a vă exercita drepturile GDPR, vă rugăm să ne contactați la: contact@automode.ro
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Vom răspunde solicitărilor dumneavoastră în termen de 30 de zile de la primirea acestora.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reclamații</h2>
            <p className="text-gray-700 leading-relaxed">
              Dacă considerați că drepturile dumneavoastră GDPR au fost încălcate, aveți dreptul 
              să depuneți o plângere la Autoritatea Națională de Supraveghere a Prelucrării 
              Datelor cu Caracter Personal (ANSPDCP).
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}