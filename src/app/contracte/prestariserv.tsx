import React from 'react'

interface ContractData {
  // Contract identification
  nr?: string
  data?: string
  
  // Personal information
  nume_prenume?: string
  localitatea?: string
  strada?: string
  nr_strada?: string
  bl?: string
  scara?: string
  etaj?: string
  apartament?: string
  judet?: string
  
  // ID document information
  ci_seria?: string
  ci_nr?: string
  cnp?: string
  spclep?: string
  ci_data?: string
  
  // Contract details
  suma_licitatie?: string
  email?: string
  
  // Signature fields
  prestator_signature?: string
  prestator_signed_at?: string
  prestator_signed_by?: string
  client_signature?: string
  client_signed_at?: string
  client_signed_by?: string
}

interface ContractProps {
  data?: ContractData
}

export default function PrestariServContract({ data }: ContractProps) {
  return (
    <div className="contract-document bg-white text-black p-8 font-serif">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold uppercase mb-4">
          CONTRACT DE PRESTĂRI SERVICII
        </h1>
        <p className="mb-4">
          Nr {data?.nr || '………'} din {data?.data || '......../……../…………'}
        </p>
      </div>

      <div className="space-y-6">
        {/* CAP. I: PĂRȚILE CONTRACTANTE */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-4">CAP. I: PĂRȚILE CONTRACTANTE</h2>
          
          <div className="mb-4">
            <p className="mb-2"><strong>Între</strong></p>
            <p className="mb-4">
              <strong>Automode S.R.L.</strong> cu sediul în Strada Viorele 9, Comuna Păulești, Satu Mare, având Cod Unic de Înregistrare RO48019440, 
              cont IBAN Euro: RO80 BTRL EURC RT0C L425 3701 și cont IBAN Lei: RO36 BTRL RONC RT0C L425 3701 
              deschise la Banca Transilvania S.A., reprezentată legal de
            </p>
            <p className="mb-4">
              <strong>BU TEREZIA</strong> în calitate de Administrator, denumit în continuare <strong>PRESTATOR</strong>
            </p>
          </div>

          <div className="mb-4">
            <p className="mb-2"><strong>Și</strong></p>
            <p className="mb-2">
              Dl / Dna <span className="font-semibold">{data?.nume_prenume || '(numele și prenumele)'}</span> cu domiciliul
            </p>
            <p className="mb-2">
              în Localitatea <span className="font-semibold">{data?.localitatea || '……………………………………………………………'}</span>, 
              Str. <span className="font-semibold">{data?.strada || '……………………………………………………………'}</span>, 
              Nr. <span className="font-semibold">{data?.nr_strada || ''}</span>,
            </p>
            <p className="mb-2">
              Bl. <span className="font-semibold">{data?.bl || '…………'}</span>, 
              Sc. <span className="font-semibold">{data?.scara || '…………'}</span>, 
              Et. <span className="font-semibold">{data?.etaj || '…………'}</span>, 
              Ap. <span className="font-semibold">{data?.apartament || '…………'}</span>, 
              Județul/Sectorul <span className="font-semibold">{data?.judet || ''}</span>, 
              identificat(ă)
            </p>
            <p className="mb-4">
              prin CI, seria <span className="font-semibold">{data?.ci_seria || '…………'}</span>, 
              numărul <span className="font-semibold">{data?.ci_nr || '…………'}</span>, 
              CNP <span className="font-semibold">{data?.cnp || '……………………………………………'}</span>, 
              eliberat de <span className="font-semibold">{data?.spclep || '…………………………………...'}</span> 
               la data <span className="font-semibold">{data?.ci_data || ''}</span>, 
              denumit în continuare <strong>CLIENT</strong>.
            </p>
          </div>
        </section>

        {/* CAP. II: DEFINIȚII */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-4">CAP. II: DEFINIȚII</h2>
          
          <div className="mb-4">
            <p className="mb-2"><strong>Art. 2.1</strong> În prezentul contract, următorii termeni vor fi interpretați astfel:</p>
            <div className="ml-4 space-y-2">
              <p>a) contract = prezentul contract și toate anexele sale;</p>
              <p>b) prestator și/sau client = părțile contractante, așa cum sunt acestea numite în prezentul contract;</p>
              <p>c) servicii = activitățile a căror prestare face obiectul contractului;</p>
              <p>d) prețul contractului = prețul plătibil prestatorului de către client, în baza contractului, pentru îndeplinirea integrală și corespunzătoare a tuturor obligațiilor asumate prin contract;</p>
              <p>e) produs = autoturismul pentru care prestatorul licitează și pentru care clientul efectuează plata prețului către prestator, în una sau două tranșe conform întelegerii dintre părți;</p>
              <p>f) forța majoră = un eveniment mai presus de controlul părţilor, care nu se datorează greşelii sau vinei acestora, care nu putea fi prevăzut la momentul încheierii contractului şi care face imposibilă executarea şi, respectiv, îndeplinirea contractului; sunt considerate asemenea evenimente: războaie, revoluţii, incendii, inundaţii sau orice alte catastrofe naturale, restricţii apărute ca urmare a unei carantine, embargou, enumerarea nefiind exhaustivă, ci enunţiativă. Nu este considerat forţă majoră un eveniment asemenea celor de mai sus, care, fără a crea o imposibilitate de executare, face extrem de costisitoare executarea obligaţiilor uneia din părţi;</p>
              <p>g) zi = zi calendaristică; saptamână = 7 zile; an = 365 de zile.</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2"><strong>Art. 2.2</strong> Interpretare:</p>
            <div className="ml-4 space-y-2">
              <p>a) În prezentul contract, cu excepția unei prevederi contrare, cuvintele la forma singular vor include forma de plural și invers, acolo unde acest lucru este permis de context;</p>
              <p>b) Termenul "zi" ori "zile" sau orice referire la zile, reprezintă zile calendaristice dacă nu se specifică în mod diferit.</p>
            </div>
          </div>
        </section>

        {/* CAP. III: OBIECTUL SI PREȚUL CONTRACTULUI */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-4">CAP. III: OBIECTUL SI PREȚUL CONTRACTULUI</h2>
          
          <div className="space-y-4">
            <p>
              <strong>Art. 3.1.</strong> Obiectul prezentului contract îl constituie prestarea de către PRESTATOR în favoarea CLIENTULUI a serviciilor de licitație online pe platforma www.openlane.eu, deținută de către OPENLANE EUROPE NV pentru autoturismul identificat cu numărul de șasiu, marca, modelul și data producției menționate in Anexa Nr. 1;
            </p>
            <p>
              <strong>Art. 3.2.</strong> Pentru îndeplinirea prezentului contract, CLIENTUL se obligă să plătească PRESTATORULUI prețul produsului conform graficului de plăți detaliat în Anexa Nr. 1;
            </p>
            <p>
              <strong>Art. 3.3.</strong> Prețul total al produsului este exprimat în moneda Euro și este compus din prețul cu care se va câștiga licitația, costurile specifice țării de unde se vinde produsul (cost necesar pentru radierea autoturismului în țara respectivă), onorariul licitației, costul transportului oferit de către OPENLANE EUROPE NV către adresa PRESTATORULUI, comisionul PRESTATORULUI care reprezintă valoarea fixă de 400 Euro și valoarea taxei pe valoare adăugată (TVA) aplicată la suma costurilor menționate anterior;
            </p>
          </div>
        </section>

        {/* CAP. IV: DREPTURILE ȘI OBLIGAȚIILE PĂRȚILOR */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-4">CAP. IV: DREPTURILE ȘI OBLIGAȚIILE PĂRȚILOR</h2>
          
          <div className="space-y-4">
            <div>
              <p><strong>Art. 4.1.</strong> Clientul se obligă să:</p>
              <div className="ml-4 space-y-3">
                <p>a) precizeze în cele ce urmează suma maximă pe care prestatorul o poate licita pe platforma online de licitații, această sumă fiind de <span className="font-bold text-lg">{data?.suma_licitatie || '………………….'}</span> (cifre) de Euro (și litere: ……………................................... de Euro). Această sumă NU INCLUDE costurile specifice țării de unde se vinde produsul, onorariul licitației, costul de transport al produsului la adresa prestatorului, comisionul prestatorului și taxa pe valoarea adăugată (TVA) aplicată la suma costurilor menționate anterior;</p>
                <p>b) achite înainte de participarea prestatorului la licitație, un avans procentual de 25% din suma maximă de licitație mentionată la punctul a), în cazul în care produsul dorit se va putea achiziționa de către prestator doar prin intermediul unei licitații în care prețul final de vânzare nu este specificat;</p>
                <p>c) achite în maxim 24 de ore după câștigarea licitației și atribuirea autoturismului către PRESTATOR, diferența din valoarea totală a prețului cu care a fost câștigată licitația plus costurile specifice țării de unde se vinde produsul (cost necesar pentru radierea autoturismului în țara respectivă), onorariul licitației, costul transportului oferit de către OPENLANE EUROPE NV către adresa PRESTATORULUI, comisionul PRESTATORULUI care reprezintă valoarea fixă de 400 Euro și valoarea taxei pe valoare adăugată (TVA) aplicată la suma costurilor menționate anterior, toate acestea fiind menționate în Anexa Nr. 1. Această diferență de bani se consideră achitată doar când banii vor fi prezenți în contul bancar al PRESTATORULUI;</p>
                <p>d) achite avans de 100% din prețul total detaliat în Articolul 3.3 doar în cazul în care autoturismul menționat în Anexa Nr. 1 are un preț final de vânzare specificat de către vânzător și nu este necesară o licitație pentru achiziția acestuia;</p>
                <p>e) achite în Lei după sosirea autoturismului la adresa prestatorului, contravalorea serviciilor pe care prestatorul urmează să le efectueze conform Articolului 4.2, punctul d), și anume: eliberarea numerelor roșii provizorii, polița RCA, efectuarea RAR, obținerea de la RAR a unui Certificat de Conformitate (dacă este cazul). Toate aceste costuri exprimate în Lei sunt menționate în Anexa Nr. 2;</p>
                <p>f) să se ocupe (doar dacă va fi cazul) de reparațiile de ordin tehnic și / sau optic care ar putea cauza respingerea autovehiculului la RAR și să suporte integral costurile, iar în același timp să pună la dispoziție autovehiculul prestatorului, în timp util, pentru efectuarea RAR.</p>
              </div>
            </div>

            <div>
              <p><strong>Art. 4.2.</strong> Prestatorul se obligă să:</p>
              <div className="ml-4 space-y-3">
                <p>a) ofere clientului factura fiscală pentru plata avansului în una sau două tranșe, în format electronic;</p>
                <p>b) ofere clientului factura fiscală finală pe valoarea prețului total al autoturismului, inclusiv TVA, în format fizic la predarea autoturismului, a cheilor autoturismului și a celorlalte acte necesare în vederea înscrierii autoturismului pe numele clientului;</p>
                <p>c) restituie clientului avansul de 20% în maxim 24 de ore, în cazul în care licitația pentru autoturismul menționat în Anexa Nr. 1 nu a fost câștigată sau licitația a fost câștigată, dar autoturismul nu a fost atribuit de către vânzător din anumite motive. Restituirea avansului de 20% către client se face în procentaj de 100% de către prestator fără a opri vreun comision în acest caz;</p>
                <p>d) informeze clientul în scris pe E-mail în momentul în care licitația a fost câștigată, iar autoturismul a fost atribuit de către vânzător pentru a acorda timpul necesar de 24 de ore clientului să achite restul de plată menționat și descris în Articolul 4.1, punctul c);</p>
                <p>e) se ocupe CONTRACOST după sosirea autoturismului la adresa sa, de eliberarea numerelor roșii provizorii, achiziționarea unei polițe RCA pe o perioadă menționată de către client, efectuarea RAR (doar opțional, după ce se înțelege cu clientul), solicitarea la RAR a unui Certificat de Conformitate (COC) dacă autoturismul nu a beneficiat de acest document la achiziționare. Costurile pentru cele menționate anterior la acest punct sunt menționate în Anexa Nr. 2 (vor fi menționate de către prestator după achitarea lor deoarece valoarea exactă a acestora nu este cunoscută înainte de efectuarea plății) și sunt exprimate în Lei;</p>
                <p>f) se asigure de predarea cheilor autoturismului și a tuturor actelor necesare înscrierii autoturismului pe numele clientului după efectuarea activităților enumerate la punctul e) și după ce a primit de la client contravaloarea totală a acestor servicii.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CAP. V: MODALITĂȚI DE PLATĂ */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-4">CAP. V: MODALITĂȚI DE PLATĂ</h2>
          
          <div className="space-y-4">
            <p><strong>Art. 5.1</strong> Clientul va achita în Euro prin virament bancar în contul prestatorului avansul de 25% menționat și descris în Articolul 4.1, punctul b) sau avansul de 100% menționat și descris în Articolul 4.1, punctul d) din acest contract (Cont IBAN Euro: RO80 BTRL EURC RT0C L425 3701);</p>
            <p><strong>Art. 5.2</strong> Clientul va achita în Euro prin virament bancar în contul prestatorului, restul prețului total menționat și descris în Articolul 4.1, punctul c) din acest contract (Cont IBAN Euro: RO80 BTRL EURC RT0C L425 3701);</p>
            <p><strong>Art. 5.3</strong> Clientul va achita în Lei prin virament bancar în contul prestatorului, contravaloarea serviciilor menționate și descrise în Articolul 4.1, punctul e), respectiv în Articolul 4.2, punctul e) (Cont IBAN Lei: RO36 BTRL RONC RT0C L425 3701).</p>
          </div>
        </section>

        {/* CAP. VI: RĂSPUNDEREA PĂRȚILOR */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-4">CAP. VI: RĂSPUNDEREA PĂRȚILOR</h2>
          
          <div className="space-y-4">
            <p><strong>Art. 6.1</strong> În cazul neefectuării la timp a restului de plată de către client în contul prestatorului după perioada de 24 de ore de la câștigarea licitației și atribuirea autoturismului de către vânzător, menționată și descrisă în Articolul 4.1, punctul c), clientul își asumă răspunderea pierderii avansului de 20% achitat. Prestatorul va păstra, în acest caz, avansul de 20% în contul său pentru a achita penalități către OPENLANE EUROPE NV pentru deblocarea contului de pe platforma de licitații în urma nerespectării contractuale de efectuare a restului de plată după câștigarea licitației și a atribuirii autoturismului de către vânzător în maxim 24 de ore, care duc automat la blocarea contului prestatorului. Această diferență de bani se consideră achitată doar când banii vor fi prezenți în contul bancar al PRESTATORULUI;</p>
            <p><strong>Art. 6.2</strong> Prestatorul NU va răspunde de valoarea kilometrajului autoturismului achiziționat prin intermediul platformei de licitații ce aparține de OPENLANE EUROPE NV și care a fost menționat pe factura de achiziție;</p>
            <p><strong>Art. 6.3</strong> Prestatorul NU va răspunde de eventualele defecțiuni de ordin tehnic, optic sau alte vicii ascunse cu care autoturismul a fost livrat după achiziția prin intermediul platformei de licitații ce aparține de OPENLANE EUROPE NV și care nu au fost menționate în anunțul de vânzare sau în raportul de daune, de către vânzător;</p>
            <p><strong>Art. 6.4</strong> Prestatorul NU oferă niciun fel de garanție pentru autoturismul specificat în acest contract și în anexele aferente;</p>
            <p><strong>Art. 6.5</strong> În cazul în care va fi necesar, prestatorul va depune toată documentația necesară în vederea obținerii despăgubirii de la OPENLANE EUROPE NV în condițiile în care acest lucru se va impune, în limita condițiilor de garanție acceptate de către aceasta și va vira sumele obținute către client;</p>
            <p><strong>Art. 6.6</strong> Prestatorul NU va răspunde de nicio defecțiune de ordin tehnic sau optic ale autoturismului care vor interveni în perioada dintre momentul sosirii autoturismului la adresa prestatorului și până la predarea finală a acestuia către client, dar și după. Excepție făcând cazul în care defecțiunea / defecțiunile sunt produse direct de către prestator, iar acesta va fi obligat să suporte cheltuielile integrale pentru reparații;</p>
            <p><strong>Art. 6.7</strong> După câștigarea licitației de către prestator, clientul nu mai poate refuza autovehiculul câștigat la licitație, indiferent de motivul /motivele invocate de către acesta și își asumă răspunderea pierderii sumei plătite către prestator până în acel moment, în detrimentul autovehiculului câștigat la licitație.</p>
          </div>
        </section>

        {/* CAP. VII: SOLUȚIONAREA LITIGIILOR */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-4">CAP. VII: SOLUȚIONAREA LITIGIILOR</h2>
          
          <div className="space-y-4">
            <p><strong>Art. 7.1</strong> Eventualele litigii care se pot naște din prezentul contract sau în legătură cu prezentul contract, inclusiv cele referitoare la validitate, interpretarea, executarea sau desființarea lui, vor fi soluționate pe cale amiabilă;</p>
            <p><strong>Art. 7.2</strong> În cazul în care părțile nu vor ajunge la o înțelegere amiabilă, litigiile vor fi înaintate spre soluționare instanțelor judecătorești competente.</p>
          </div>
        </section>

        {/* CAP. VIII: FORȚA MAJORĂ */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-4">CAP. VIII: FORȚA MAJORĂ</h2>
          
          <div className="space-y-4">
            <p><strong>Art. 8.1</strong> Forța majoră exonerează de răspundere părțile contractului în cazul neexecutării totale sau parțiale a obligațiilor prevăzute în prezentul contract;</p>
            <p><strong>Art. 8.2</strong> Prin forță majoră se înțelege un eveniment independent de voința părților, imprevizibil și insurmontabil, apărut după încheierea contractului și care împiedică părțile să execute total sau parțial obligațiile prevăzute în prezentul contract.</p>
          </div>
        </section>

        {/* CAP. IX: CLAUZE FINALE */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-4">CAP. IX: CLAUZE FINALE</h2>
          
          <div className="space-y-4">
            <div>
              <p><strong>Art. 9.1</strong> Orice corespondență între părți, legată de executarea contractului, trebuie transmisă doar pe adresa de E-mail după cum urmează:</p>
              <div className="ml-4 space-y-2">
                <p>a) adresa de E-mail a prestatorului: <strong>contact@automode.ro</strong></p>
                <p>b) adresa de E-mail a clientului: <strong>{data?.email || '……………………………………………………………………………………'}</strong></p>
              </div>
            </div>
            <p><strong>Art. 9.2</strong> Orice documente, facturi de servicii sau înștiințări trimise la datele de corespondență menționate în Articolul 9.1, sunt considerate recepționate și acceptate dacă partea căreia îi sunt adresate nu le refuză în scris utilizând oricare din căile menționate, în maxim 12 ore;</p>
            <p><strong>Art. 9.3</strong> Orice modificare și /sau completare a prezentului contract va fi în prealabil stabilită de comun accord între părți și se va face numai printr-un act adițional încheiat între părți;</p>
            <p><strong>Art. 9.4</strong> Prezentul contract, împreună cu anexele sale și actele adiționale care fac parte integrantă din cuprinsul său, reprezintă voința părților și înlătură orice înțelegere verbală dintre acestea, anterioară sau ulterioară încheierii lui;</p>
            <div>
              <p><strong>Art. 9.5</strong> Prezentul contract s-a încheiat în 2 exemplare azi, la data de {data?.data || '…….. / …….. /'}, în mediul online prin corespondență la datele de contact menționate în Articolul 9.1, astfel:</p>
              <div className="ml-4 space-y-2">
                <p>a) prestatorul a semnat cu pix cu pastă de culoare albastră și a ștampilat contractul, mai jos, pe spațiul alocat prestatorului;</p>
                <p>b) după semnarea și ștampilarea prezentului contract, prestatorul a scanat contractul și l-a transmis clientului pe adresa de E-mail în vederea semnării;</p>
                <p>c) după recepția contractului scanat trimis de către prestator, clientul a listat prezentul contract și l-a semnat cu pix cu pastă de culoare albastră, după care a scanat contractul și l-a transmis înapoi către prestator pe adresa de E-mail.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <p className="mb-8"><strong>PRESTATOR,</strong></p>
              <p className="mb-2"><strong>AUTOMODE S.R.L.</strong></p>
              
              {/* Prestator Signature */}
              <div className="mb-8 min-h-[100px] flex flex-col items-center justify-center">
                {data?.prestator_signature ? (
                  <div className="p-2">
                    <img 
                      src={data.prestator_signature} 
                      alt="Semnătura Prestator" 
                      className="max-w-[200px] max-h-[80px] object-contain"
                      style={{
                        filter: 'hue-rotate(210deg) saturate(2) brightness(0.8)',
                        mixBlendMode: 'multiply'
                      }}
                    />
                    {data.prestator_signed_at && (
                      <p className="text-xs text-gray-600 mt-2">
                        Semnat pe: {new Date(data.prestator_signed_at).toLocaleDateString('ro-RO')}
                      </p>
                    )}
                  </div>
                ) : (
                  <p>(semnătura + ștampila)</p>
                )}
              </div>
              
              <p><strong>ADMINISTRATOR,</strong></p>
              <p><strong>BU TEREZIA</strong></p>
            </div>
            <div className="text-center">
              <p className="mb-8"><strong>CLIENT,</strong></p>
              
              {/* Client Signature */}
              <div className="mb-8 min-h-[100px] flex flex-col items-center justify-center">
                {data?.client_signature ? (
                  <div className="p-2">
                    <img 
                      src={data.client_signature} 
                      alt="Semnătura Client" 
                      className="max-w-[200px] max-h-[80px] object-contain"
                      style={{
                        filter: 'hue-rotate(210deg) saturate(2) brightness(0.8)',
                        mixBlendMode: 'multiply'
                      }}
                    />
                    {data.client_signed_at && (
                      <p className="text-xs text-gray-600 mt-2">
                        Semnat pe: {new Date(data.client_signed_at).toLocaleDateString('ro-RO')}
                      </p>
                    )}
                  </div>
                ) : (
                  <p>………………………………………………………………</p>
                )}
              </div>
              
              <p>(semnătura)</p>
            </div>
          </div>
        </section>

        {/* Confirmation */}
        <section className="mt-8 pt-4 border-t text-center">
          <p className="mb-4">
            Confirm că am primit în mediul online pe adresa de E-mail, un contract semnat și ștampilat 
            de către prestator cu valoare de "Contract în original".
          </p>
          <div className="mt-8">
            <p><strong>CLIENT,</strong></p>
            
            {/* Client Confirmation Signature */}
            <div className="mt-4 flex justify-center">
              {data?.client_signature ? (
                <div className="p-2">
                  <img 
                    src={data.client_signature} 
                    alt="Semnătura Client Confirmare" 
                    className="max-w-[150px] max-h-[60px] object-contain"
                    style={{
                      filter: 'hue-rotate(210deg) saturate(2) brightness(0.8)',
                      mixBlendMode: 'multiply'
                    }}
                  />
                </div>
              ) : (
                <p>………………………………………………………………… (semnătura)</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}