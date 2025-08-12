export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politica de Confidențialitate</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introducere</h2>
            <p className="text-gray-700 leading-relaxed">
              Această Politică de Confidențialitate descrie modul în care colectăm, folosim și protejăm 
              informațiile dumneavoastră personale în cadrul serviciilor noastre de import auto.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Datele Colectate</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Colectăm următoarele tipuri de date personale:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Date de identificare (nume, prenume, CNP)</li>
              <li>Date de contact (email, telefon, adresă)</li>
              <li>Documente de identitate (CI/Pașaport)</li>
              <li>Informații despre vehiculul dorit</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Scopul Prelucrării</h2>
            <p className="text-gray-700 leading-relaxed">
              Prelucrăm datele dumneavoastră personale pentru:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
              <li>Verificarea identității în procesul de import</li>
              <li>Întocmirea documentelor necesare</li>
              <li>Comunicarea cu autoritățile competente</li>
              <li>Prestarea serviciilor contractate</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Securitatea Datelor</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor 
              dumneavoastră personale împotriva accesului neautorizat, distrugerii sau divulgării.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Drepturile Dumneavoastră</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              În conformitate cu GDPR, aveți următoarele drepturi:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Dreptul de acces la date</li>
              <li>Dreptul de rectificare</li>
              <li>Dreptul la ștergerea datelor</li>
              <li>Dreptul de opoziție</li>
              <li>Dreptul la portabilitate</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Pentru întrebări legate de această Politică de Confidențialitate, ne puteți contacta 
              la adresa: noreply@codemint.ro
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}