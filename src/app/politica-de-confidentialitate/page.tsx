export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Politica de Confidențialitate</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Informații Generale</h2>
              <p className="text-gray-700 mb-4">
                Automode ("noi", "Compania") respectă confidențialitatea datelor dumneavoastră personale 
                și ne angajăm să le protejăm în conformitate cu Regulamentul General privind Protecția 
                Datelor (GDPR) și legislația română aplicabilă.
              </p>
              <p className="text-gray-700 mb-4">
                Această Politică de Confidențialitate explică cum colectăm, utilizăm, stocăm și 
                protejăm informațiile dumneavoastră personale.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Operatorul de Date</h2>
              <p className="text-gray-700 mb-4">Operatorul de date cu caracter personal este:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Denumire:</strong> Automode SRL</li>
                <li><strong>Administrator:</strong> Bu Terezia</li>
                <li><strong>Email:</strong> contact@automode.ro</li>
                <li><strong>Telefon:</strong> 0750462307</li>
                <li><strong>Adresă:</strong> Viorele 9, Satu Mare</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Datele Colectate</h2>
              <p className="text-gray-700 mb-4">Colectăm următoarele categorii de date personale:</p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Date de identificare:</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Nume și prenume</li>
                <li>Adresa de email</li>
                <li>Numărul de telefon</li>
                <li>Adresa de domiciliu/sediu</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Date tehnice:</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Adresa IP</li>
                <li>Tipul de browser și versiunea</li>
                <li>Sistemul de operare</li>
                <li>Cookie-uri și tehnologii similare</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Date despre preferințe:</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Preferințe vehicule (marcă, model, an fabricație)</li>
                <li>Buget disponibil</li>
                <li>Istoric cereri și estimări</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Scopurile Prelucrării</h2>
              <p className="text-gray-700 mb-4">
                Prelucrăm datele dumneavoastră personale pentru următoarele scopuri:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Prestarea serviciilor:</strong> pentru a vă oferi serviciile de import vehicule</li>
                <li><strong>Comunicare:</strong> pentru a vă contacta în legătură cu cererea dumneavoastră</li>
                <li><strong>Marketing:</strong> cu acordul dumneavoastră, pentru oferte personalizate</li>
                <li><strong>Îmbunătățirea serviciilor:</strong> pentru analiza și optimizarea site-ului</li>
                <li><strong>Obligații legale:</strong> pentru respectarea cerințelor legale</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Temeiurile Legale</h2>
              <p className="text-gray-700 mb-4">Prelucrarea se bazează pe următoarele temeiuri legale:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Consimțământul:</strong> pentru comunicări marketing și cookie-uri</li>
                <li><strong>Executarea contractului:</strong> pentru prestarea serviciilor solicitate</li>
                <li><strong>Interesul legitim:</strong> pentru îmbunătățirea serviciilor și securitate</li>
                <li><strong>Obligația legală:</strong> pentru respectarea cerințelor fiscale și legale</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Partajarea Datelor</h2>
              <p className="text-gray-700 mb-4">
                Nu vindem datele dumneavoastră personale terților. Putem partaja datele doar cu:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Furnizorii de servicii (transport, consultanță)</li>
                <li>Autorități publice (la cerere legală)</li>
                <li>Parteneri de încredere (cu acordul dumneavoastră explicit)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Transferuri Internaționale</h2>
              <p className="text-gray-700 mb-4">
                Datele dumneavoastră pot fi transferate în țări din afara Uniunii Europene doar 
                cu garanții adecvate de protecție, conform GDPR.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Perioada de Păstrare</h2>
              <p className="text-gray-700 mb-4">Păstrăm datele pentru următoarele perioade:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Date contractuale:</strong> 5 ani după încetarea contractului</li>
                <li><strong>Date marketing:</strong> până la retragerea consimțământului</li>
                <li><strong>Date tehnice:</strong> maximum 2 ani</li>
                <li><strong>Obligații legale:</strong> conform cerințelor legale</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Drepturile Dumneavoastră</h2>
              <p className="text-gray-700 mb-4">
                În conformitate cu GDPR, aveți următoarele drepturi:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Dreptul de acces:</strong> să obțineți informații despre datele prelucrate</li>
                <li><strong>Dreptul de rectificare:</strong> să corectați datele inexacte</li>
                <li><strong>Dreptul la ștergere:</strong> să solicitați ștergerea datelor</li>
                <li><strong>Dreptul la restricționare:</strong> să limitați prelucrarea</li>
                <li><strong>Dreptul la portabilitate:</strong> să primiți datele într-un format structurat</li>
                <li><strong>Dreptul la opoziție:</strong> să vă opuneți prelucrării</li>
                <li><strong>Dreptul de a retrage consimțământul:</strong> în orice moment</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Securitatea Datelor</h2>
              <p className="text-gray-700 mb-4">
                Implementăm măsuri tehnice și organizatorice adecvate pentru protecția datelor, 
                inclusiv criptare, controale de acces și monitorizare regulată.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Cookie-uri</h2>
              <p className="text-gray-700 mb-4">
                Site-ul nostru utilizează cookie-uri pentru funcționarea optimă și îmbunătățirea 
                experienței utilizatorului. Pentru detalii, consultați Politica noastră de Cookie-uri.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Modificări ale Politicii</h2>
              <p className="text-gray-700 mb-4">
                Ne rezervăm dreptul de a actualiza această Politică. Orice modificare va fi 
                comunicată prin publicarea pe site și, dacă este cazul, prin email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Contact și Plângeri</h2>
              <p className="text-gray-700 mb-4">
                Pentru exercitarea drepturilor sau întrebări privind protecția datelor, contactați-ne la:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Email: privacy@automode.ro</li>
                <li>Telefon: 0750462307</li>
              </ul>
              <p className="text-gray-700 mb-4">
                De asemenea, aveți dreptul să depuneți o plângere la Autoritatea Națională de 
                Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP).
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}