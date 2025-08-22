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
    'hero.badge': 'Parc Auto la Comandă din Europa',
    'hero.title': 'Mașina Ta Ideală',
    'hero.title.highlight': 'La Comandă',
    'hero.subtitle': 'Configurezi exact ce vrei și noi îți aducem mașina din licitațiile internaționale la cel mai bun preț.',
    'hero.cta.primary': 'Vreau Masina',
    'hero.cta.secondary': 'Calculator Cost',
    'hero.cta.tertiary': 'Vezi Licitațiile Live',
    'hero.features.no_hidden_costs': 'Fără costuri ascunse',
    'hero.features.full_warranty': 'Garanție completă',
    'hero.features.fast_delivery': 'Livrare rapidă',
    'hero.expert': 'Expert',
    'hero.expert.subtitle': 'Servicii Personalizate',

    // International Auctions Section
    'international_auctions.title': 'Acces Direct la Licitațiile Internaționale',
    'international_auctions.subtitle': 'Importăm din cele mai mari piețe auto din lume pentru a-ți oferi prețurile cele mai bune și selecția cea mai mare',
    'international_auctions.countries.title': 'Piețe de Import',
    'international_auctions.platforms.title': 'Platforme Partenere',
    'international_auctions.benefits.title': 'Avantajele Noastre',
    'international_auctions.benefits.better_prices': 'Prețuri cu 20-30% mai mici',
    'international_auctions.benefits.huge_selection': 'Selecție de peste 100,000 vehicule',
    'international_auctions.benefits.direct_access': 'Acces direct la licitații live',
    'international_auctions.benefits.quality_control': 'Verificări și inspecții complete',
    'international_auctions.countries.usa': 'SUA',
    'international_auctions.countries.eu': 'Uniunea Europeană',
    'international_auctions.cta': 'Vezi Licitațiile Live',

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
    'faq.subtitle': 'Răspunsuri la cele mai comune întrebări despre parcul nostru auto la comandă',
    'faq.q1.question': 'Cum funcționează parcul auto la comandă?',
    'faq.q1.answer': 'Configurezi exact mașina dorită (marca, model, culoare, dotări) prin platforma noastră. Noi o căutăm și achiziționăm din licitațiile internaționale (OpenLane, IAAI), apoi ți-o aducem în România cu toate formalitățile făcute.',
    'faq.q2.question': 'Ce platforme de licitații utilizați?',
    'faq.q2.answer': 'Colaborăm cu OpenLane.eu pentru piața europeană și IAAI.com pentru piața americană. Acestea ne oferă acces la peste 100,000 de vehicule din licitații live.',
    'faq.q3.question': 'Cât costă să îmi import o mașină la comandă?',
    'faq.q3.answer': 'Folosește calculatorul nostru pentru o estimare exactă. Includem toate costurile: prețul mașinii, transport, taxe vamale, înmatriculare RAR, plus garanția noastră de 12 luni. Fără surprize!',
    'faq.q4.question': 'Ce garanție oferiti și ce include?',
    'faq.q4.answer': 'Oferim garanție de 12 luni, cea mai extinsă din România pentru mașini importate. Acoperă componente mecanice, sisteme electrice, elemente de siguranță, plus suport tehnic și consultanță.',
    'faq.q5.question': 'Pot urmări progresul importului mașinii mele?',
    'faq.q5.answer': 'Da! Prin dashboard-ul tău poți urmări în timp real progresul: cerere trimisă → căutare activă → mașină găsită → licitație → transport → livrare. Primești notificări la fiecare etapă.',
    'faq.q6.question': 'Vă ocupați și de înmatricularea la RAR?',
    'faq.q6.answer': 'Absolut! Serviciul nostru all-inclusive include toate formalitățile RAR. Îți livrăm mașina cu numerele puse și gata de condus, plus ITP-ul făcut.',

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
    'header.nav.send_openlane': 'Trimite Link',

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
    'footer.copyright': 'Automode SRL',

    // Dashboard Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.car_requests': 'Cereri Mașini',
    'sidebar.calculator': 'Calculator Costuri',
    'sidebar.contracts': 'Contracte',
    'sidebar.logout': 'Ieșire',

    // Dashboard Page
    'dashboard.welcome': 'Bună ziua',
    'dashboard.subtitle': 'Bine ai venit în dashboard-ul tău Automode',
    'dashboard.stats.active_requests': 'Cereri Active',
    'dashboard.stats.offers_received': 'Oferte Primite',
    'dashboard.stats.contracts': 'Contracte',
    'dashboard.account_info': 'Informații Cont',
    'dashboard.account_info.name': 'Nume',
    'dashboard.account_info.email': 'Email',
    'dashboard.account_info.phone': 'Telefon',
    'dashboard.account_info.member_since': 'Membru din',
    'dashboard.account_info.not_set': 'Nu este setat',
    'dashboard.recent_activity': 'Activitate Recentă',
    'dashboard.recent_activity.contract': 'Contract',
    'dashboard.recent_activity.client': 'Client',
    'dashboard.recent_activity.contract_date': 'Data contract',
    'dashboard.recent_activity.created': 'Creat',
    'dashboard.recent_activity.status.signed': 'Semnat',
    'dashboard.recent_activity.status.draft': 'Ciornă',
    'dashboard.recent_activity.no_activity': 'Nu există activitate recentă',
    'dashboard.recent_activity.contracts_appear_here': 'Contractele tale vor apărea aici',

    // Calculator Page
    'calculator.title': 'Calculator Costuri Import',
    'calculator.subtitle': 'Calculează costurile exacte pentru importul mașinii tale din Europa',

    // Contracts Page
    'contracts.title': 'Contractele Mele',
    'contracts.subtitle': 'Vizualizează și gestionează contractele tale',

    // Car Requests Page
    'car_requests.new_order': 'Comandă Mașină Nouă',
    'car_requests.form_description': 'Completează formularul pentru a crea o cerere nouă',
    'car_requests.year': 'An',
    'car_requests.max_budget': 'Buget maxim',
    'car_requests.fuel_type': 'Combustibil',
    'car_requests.additional_requirements': 'Cerințe suplimentare',
    'car_requests.created_on': 'Creată pe',
    'car_requests.not_specified': 'Nu specificat',

    // Calculator Component
    'calc.title': 'Calculator Costuri Import',
    'calc.tab.without_vat': 'Fără TVA',
    'calc.tab.with_vat': 'Cu TVA',
    'calc.price_label': 'Preț mașină (€)',
    'calc.price_placeholder': 'Introduceti pretul masinii',
    'calc.openlane_taxes': 'Taxe OpenLane',
    'calc.transport_label': 'Transport (€)',
    'calc.transport_placeholder': 'Introduceti costul transportului',
    'calc.warranty': 'Garanție',
    'calc.commission': 'Comision',
    'calc.vat': 'TVA (21%)',
    'calc.total': 'Total',
    'calc.advance': 'Avans necesar (20%)',

    // Contracts Page Details
    'contracts.loading': 'Se încarcă contractele...',
    'contracts.no_contracts': 'Nu aveți contracte disponibile',
    'contracts.status.draft': 'Ciornă',
    'contracts.status.signed': 'Semnat',
    'contracts.status.sent_to_client': 'Trimis la client',
    'contracts.status.signed_by_client': 'Semnat de client',
    'contracts.status.archived': 'Arhivat',
    'contracts.status.cancelled': 'Anulat',
    'contracts.view_contract': 'Vezi Contract',
    'contracts.sign_contract': 'Semnează Contract',
    'contracts.contract_number': 'Contract',
    'contracts.created': 'Creat',
    'contracts.amount': 'Sumă',

    // Car Selection Form
    'car_form.title': 'Selectează Mașina Dorită',
    'car_form.subtitle': 'Completează detaliile despre mașina pe care o cauți',
    'car_form.make_label': 'Marca *',
    'car_form.make_placeholder': 'Selectează marca...',
    'car_form.model_label': 'Modelul *',
    'car_form.model_placeholder': 'Selectează modelul...',
    'car_form.year_label': 'Anul *',
    'car_form.year_placeholder': 'Selectează anul...',
    'car_form.fuel_type_label': 'Tipul de Combustibil (opțional)',
    'car_form.fuel_type_placeholder': 'Selectează tipul de combustibil...',
    'car_form.transmission_label': 'Tipul de Transmisie (opțional)',
    'car_form.transmission_placeholder': 'Selectează tipul de transmisie...',
    'car_form.max_mileage_label': 'Kilometrajul Maxim (opțional)',
    'car_form.max_mileage_placeholder': 'ex: 150000',
    'car_form.max_mileage_hint': 'în kilometri',
    'car_form.budget_label': 'Buget (EUR) *',
    'car_form.budget_placeholder': 'ex: 25000',
    'car_form.features_label': 'Caracteristici Dorite (opțional)',
    'car_form.features_placeholder': 'Selectează caracteristicile...',
    'car_form.additional_notes_label': 'Note Adiționale (opțional)',
    'car_form.additional_notes_placeholder': 'Detalii suplimentare despre mașina dorită, preferințe speciale...',
    'car_form.submit_button': 'Trimite Cererea',
    'car_form.submitting_button': 'Se trimite...',

    // Car Features
    'car_features.leather': 'Interior din piele',
    'car_features.sunroof': 'Trapă',
    'car_features.navigation': 'Sistem de navigație',
    'car_features.heated_seats': 'Scaune încălzite',
    'car_features.cooled_seats': 'Scaune ventilate',
    'car_features.heated_steering': 'Volan încălzit',
    'car_features.bluetooth': 'Bluetooth',
    'car_features.backup_camera': 'Cameră de mers înapoi',
    'car_features.360_camera': 'Cameră 360°',
    'car_features.cruise_control': 'Cruise control',
    'car_features.adaptive_cruise': 'Cruise control adaptiv',
    'car_features.keyless': 'Pornire fără cheie',
    'car_features.keyless_entry': 'Acces fără cheie',
    'car_features.premium_audio': 'Sistem audio premium',
    'car_features.xenon': 'Faruri Xenon/LED',
    'car_features.matrix_led': 'Faruri Matrix LED',
    'car_features.parking_sensors': 'Senzori de parcare',
    'car_features.auto_park': 'Parcare automată',
    'car_features.climate_control': 'Climatizare automată',
    'car_features.dual_zone_climate': 'Climatizare bi-zonă',
    'car_features.tri_zone_climate': 'Climatizare tri-zonă',
    'car_features.lane_assist': 'Asistent de bandă',
    'car_features.blind_spot': 'Monitor unghi mort',
    'car_features.collision_warning': 'Avertizare coliziune',
    'car_features.emergency_brake': 'Frânare de urgență',
    'car_features.traffic_sign': 'Recunoaștere indicatoare',
    'car_features.wireless_charging': 'Încărcare wireless',
    'car_features.apple_carplay': 'Apple CarPlay',
    'car_features.android_auto': 'Android Auto',
    'car_features.heads_up_display': 'Head-up Display',
    'car_features.panoramic_roof': 'Plafonul panoramic',
    'car_features.electric_seats': 'Scaune electrice',
    'car_features.memory_seats': 'Scaune cu memorie',
    'car_features.massage_seats': 'Scaune cu masaj',
    'car_features.sport_suspension': 'Suspensie sport',
    'car_features.air_suspension': 'Suspensie pneumatică',
    'car_features.awd': 'Tracțiune integrală',
    'car_features.sport_mode': 'Moduri de conducere',
    'car_features.start_stop': 'Sistem Start-Stop',
    'car_features.eco_mode': 'Mod Eco',
    'car_features.night_vision': 'Vedere nocturnă',
    'car_features.ambient_lighting': 'Iluminare ambientală',

    // Fuel Types
    'fuel_types.benzina': 'Benzină',
    'fuel_types.motorina': 'Motorină',
    'fuel_types.hybrid': 'Hibrid',
    'fuel_types.electric': 'Electric',
    'fuel_types.gpl': 'GPL',
    'fuel_types.cng': 'CNG',
    'fuel_types.mild_hybrid': 'Mild Hybrid',
    'fuel_types.plug_in_hybrid': 'Plug-in Hybrid',
    'fuel_types.hydrogen': 'Hidrogen',
    'fuel_types.ethanol': 'Etanol',
    'fuel_types.lpg': 'LPG',
    'fuel_types.flex_fuel': 'Flex Fuel',
    'fuel_types.bi_fuel': 'Bi-Fuel',
    'fuel_types.range_extender': 'Range Extender',

    // Transmission Types
    'transmission.manuala': 'Manuală',
    'transmission.automata': 'Automată',
    'transmission.semiautomata': 'Semiautomată',
    'transmission.cvt': 'CVT',
    'transmission.dsg': 'DSG',
    'transmission.tiptronic': 'Tiptronic',
    'transmission.multitronic': 'Multitronic',
    'transmission.s_tronic': 'S-Tronic',
    'transmission.pdk': 'PDK',
    'transmission.zf_8hp': 'ZF 8HP',
    'transmission.torque_converter': 'Torque Converter',
    'transmission.dual_clutch': 'Dual Clutch',
    'transmission.single_speed': 'Single Speed (Electric)',
    'transmission.e_cvt': 'e-CVT',
    'transmission.amt': 'AMT',
    'transmission.imt': 'iMT',

    // Validation Messages
    'validation.select_make': 'Selectează marca',
    'validation.select_model': 'Selectează modelul',
    'validation.year_after_1985': 'Anul trebuie să fie după 1985',
    'validation.year_not_future': 'Anul nu poate fi în viitor',
    'validation.budget_min': 'Bugetul minim este €1,000',
    'validation.budget_max': 'Bugetul maxim este €500,000',

    // Toast Messages
    'toast.login_required': 'Trebuie să fii conectat pentru a trimite o cerere.',
    'toast.profile_error': 'Nu am putut accesa informațiile de profil.',
    'toast.database_error': 'Eroare bază de date',
    'toast.email_failed': 'Cererea a fost salvată, dar notificarea email a eșuat.',
    'toast.request_success': 'Cererea ta a fost trimisă cu succes! O vei găsi în lista de cereri.',
    'toast.general_error': 'A apărut o eroare. Te rugăm să încerci din nou.',

    // Consignatie Section
    'consignatie.title': 'Consignație Auto',
    'consignatie.subtitle': 'Îți vândem mașina în siguranță și la cel mai bun preț',
    'consignatie.description': 'Pune-ți mașina în consignația noastră și lasă-ne să o vândem pentru tine. Ne ocupăm de tot procesul de vânzare, de la promovare până la finalizarea tranzacției.',
    'consignatie.benefit1.title': 'Evaluare Profesională',
    'consignatie.benefit1.description': 'Evaluăm corect mașina ta și stabilim cel mai bun preț de vânzare pe piață',
    'consignatie.benefit2.title': 'Marketing Complet',
    'consignatie.benefit2.description': 'Promovăm mașina ta pe toate platformele relevante și în rețeaua noastră de cumpărători',
    'consignatie.benefit3.title': 'Documentație Completă',
    'consignatie.benefit3.description': 'Ne ocupăm de toate actele și formalitățile necesare pentru vânzare',
    'consignatie.benefit4.title': 'Plata Garantată',
    'consignatie.benefit4.description': 'Primești banii imediat după vânzare, fără riscuri sau întârzieri',
    'consignatie.cta': 'Pune Mașina în Consignație',
    'consignatie.contact': 'Contactează-ne pentru Evaluare',

    // Progress Tracking
    'progress.title': 'Progresul Importului Auto',
    'progress.stages_completed': '{{completed}} din {{total}} etape finalizate',
    'progress.percent_complete': '{{percent}}% complet',
    'progress.current_stage': 'Etapa curentă: {{stage}}',
    'progress.notification_text': 'Vei fi notificat când această etapă se finalizează și trecem la următoarea.',
    'progress.stages.requested': 'Cerere trimisă',
    'progress.stages.requested_desc': 'Cererea ta de import auto a fost trimisă',
    'progress.stages.searching': 'Căutare activă',
    'progress.stages.searching_desc': 'Căutăm activ vehiculul dorit de tine',
    'progress.stages.found': 'Mașină găsită',
    'progress.stages.found_desc': 'Potrivire perfectă găsită! Detaliile vehiculului vor fi împărtășite',
    'progress.stages.auction_time': 'Timp de licitație',
    'progress.stages.auction_time_desc': 'Mașina este la licitație - rezultatul va fi comunicat în curând',
    'progress.stages.auction_won': 'Licitație câștigată',
    'progress.stages.auction_won_desc': 'Felicitări! Am câștigat licitația pentru mașina ta',
    'progress.stages.auction_lost': 'Achizitie Esuata (pret depasit)',
    'progress.stages.auction_lost_desc': 'Din păcate prețul a depășit bugetul stabilit',
    'progress.stages.purchase_failed': 'Achizitie Esuata (pret depasit)',
    'progress.stages.purchase_failed_desc': 'Din păcate prețul a depășit bugetul stabilit',
    'progress.stages.purchased': 'Cumpărată',
    'progress.stages.purchased_desc': 'Vehicul cumpărat! Plată confirmată și procesată',
    'progress.stages.in_transit': 'În transport',
    'progress.stages.in_transit_desc': 'Vehiculul este transportat în România',
    'progress.stages.delivered': 'Livrată',
    'progress.stages.delivered_desc': 'Vehicul gata pentru ridicare sau livrare la domiciliu',
    'progress.status.in_progress': 'În progres',
    'progress.status.completed': 'Finalizat',
    'progress.status.delayed': 'Întârziere',
    'progress.date.completed': 'Finalizat: {{date}}',
    'progress.date.estimated': 'Estimat: {{date}}',
    'progress.date.today': 'Astăzi',
    'progress.date.tomorrow': 'Mâine',
    'progress.date.in_days': 'în {{days}} zile',
    'progress.date.yesterday': 'Ieri',
    'progress.date.days_ago': 'acum {{days}} zile',
    'progress.last_updated': 'Ultima actualizare',

    // Notifications
    'notifications.title': 'Notificări',
    'notifications.mark_all_read': 'Marchează toate ca citite',
    'notifications.no_notifications': 'Nu ai notificări noi',
    'notifications.no_notifications_desc': 'Îți vom arăta aici actualizări despre cererile tale.',

    // Onboarding
    'onboarding.welcome': 'Bun venit',
    'onboarding.skip': 'Omite ghidarea',
    'onboarding.next': 'Următorul',
    'onboarding.previous': 'Înapoi',
    'onboarding.finish': 'Să începem!',
    'onboarding.step_of': 'Pasul {{current}} din {{total}}'
  },
  en: {
    // Hero Section
    'hero.badge': 'Made-to-Order Auto Park from Europe',
    'hero.title': 'Your Ideal Car',
    'hero.title.highlight': 'Made to Order',
    'hero.subtitle': 'Configure exactly what you want and we bring you the car from international auctions at the best price.',
    'hero.cta.primary': 'I Want Car',
    'hero.cta.secondary': 'Cost Calculator',
    'hero.cta.tertiary': 'View Live Auctions',
    'hero.features.no_hidden_costs': 'No hidden costs',
    'hero.features.full_warranty': 'Full warranty',
    'hero.features.fast_delivery': 'Fast delivery',
    'hero.expert': 'Expert',
    'hero.expert.subtitle': 'Personalized Services',

    // International Auctions Section
    'international_auctions.title': 'Direct Access to International Auctions',
    'international_auctions.subtitle': 'We import from the world\'s largest auto markets to offer you the best prices and largest selection',
    'international_auctions.countries.title': 'Import Markets',
    'international_auctions.platforms.title': 'Partner Platforms',
    'international_auctions.benefits.title': 'Our Advantages',
    'international_auctions.benefits.better_prices': 'Prices 20-30% lower',
    'international_auctions.benefits.huge_selection': 'Selection of over 100,000 vehicles',
    'international_auctions.benefits.direct_access': 'Direct access to live auctions',
    'international_auctions.countries.usa': 'USA',
    'international_auctions.countries.eu': 'European Union',
    'international_auctions.cta': 'View Live Auctions',

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
    'faq.subtitle': 'Answers to the most common questions about our made-to-order auto park',
    'faq.q1.question': 'How does the made-to-order auto park work?',
    'faq.q1.answer': 'You configure exactly the car you want (brand, model, color, features) through our platform. We search and purchase it from international auctions (OpenLane, IAAI), then bring it to Romania with all formalities handled.',
    'faq.q2.question': 'What auction platforms do you use?',
    'faq.q2.answer': 'We work with OpenLane.eu for the European market and IAAI.com for the American market. These give us access to over 100,000 vehicles from live auctions.',
    'faq.q3.question': 'How much does it cost to import a made-to-order car?',
    'faq.q3.answer': 'Use our calculator for an exact estimate. We include all costs: car price, transport, customs taxes, RAR registration, plus our 12-month warranty. No surprises!',
    'faq.q4.question': 'What warranty do you offer and what does it include?',
    'faq.q4.answer': 'We offer a 12-month warranty, the most extensive in Romania for imported cars. It covers mechanical components, electrical systems, safety elements, plus technical support and consultation.',
    'faq.q5.question': 'Can I track the progress of my car import?',
    'faq.q5.answer': 'Yes! Through your dashboard you can track progress in real time: request sent → active search → car found → auction → transport → delivery. You receive notifications at each stage.',
    'faq.q6.question': 'Do you handle RAR registration too?',
    'faq.q6.answer': 'Absolutely! Our all-inclusive service includes all RAR formalities. We deliver your car with plates mounted and ready to drive, plus ITP completed.',

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
    'header.nav.send_openlane': 'Send Link',

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
    'footer.copyright': 'Automode SRL',

    // Dashboard Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.car_requests': 'Car Requests',
    'sidebar.calculator': 'Cost Calculator',
    'sidebar.contracts': 'Contracts',
    'sidebar.logout': 'Logout',

    // Dashboard Page
    'dashboard.welcome': 'Good day',
    'dashboard.subtitle': 'Welcome to your Automode dashboard',
    'dashboard.stats.active_requests': 'Active Requests',
    'dashboard.stats.offers_received': 'Offers Received',
    'dashboard.stats.contracts': 'Contracts',
    'dashboard.account_info': 'Account Information',
    'dashboard.account_info.name': 'Name',
    'dashboard.account_info.email': 'Email',
    'dashboard.account_info.phone': 'Phone',
    'dashboard.account_info.member_since': 'Member since',
    'dashboard.account_info.not_set': 'Not set',
    'dashboard.recent_activity': 'Recent Activity',
    'dashboard.recent_activity.contract': 'Contract',
    'dashboard.recent_activity.client': 'Client',
    'dashboard.recent_activity.contract_date': 'Contract date',
    'dashboard.recent_activity.created': 'Created',
    'dashboard.recent_activity.status.signed': 'Signed',
    'dashboard.recent_activity.status.draft': 'Draft',
    'dashboard.recent_activity.no_activity': 'No recent activity',
    'dashboard.recent_activity.contracts_appear_here': 'Your contracts will appear here',

    // Calculator Page
    'calculator.title': 'Import Cost Calculator',
    'calculator.subtitle': 'Calculate the exact costs for importing your car from Europe',

    // Contracts Page
    'contracts.title': 'My Contracts',
    'contracts.subtitle': 'View and manage your contracts',

    // Car Requests Page
    'car_requests.new_order': 'Order New Car',
    'car_requests.form_description': 'Complete the form to create a new request',
    'car_requests.year': 'Year',
    'car_requests.max_budget': 'Max budget',
    'car_requests.fuel_type': 'Fuel type',
    'car_requests.additional_requirements': 'Additional requirements',
    'car_requests.created_on': 'Created on',
    'car_requests.not_specified': 'Not specified',

    // Calculator Component
    'calc.title': 'Import Cost Calculator',
    'calc.tab.without_vat': 'Without VAT',
    'calc.tab.with_vat': 'With VAT',
    'calc.price_label': 'Car price (€)',
    'calc.price_placeholder': 'Enter car price',
    'calc.openlane_taxes': 'OpenLane Taxes',
    'calc.transport_label': 'Transport (€)',
    'calc.transport_placeholder': 'Enter transport cost',
    'calc.warranty': 'Warranty',
    'calc.commission': 'Commission',
    'calc.vat': 'VAT (21%)',
    'calc.total': 'Total',
    'calc.advance': 'Required advance (20%)',

    // Contracts Page Details
    'contracts.loading': 'Loading contracts...',
    'contracts.no_contracts': 'You have no available contracts',
    'contracts.status.draft': 'Draft',
    'contracts.status.signed': 'Signed',
    'contracts.status.sent_to_client': 'Sent to client',
    'contracts.status.signed_by_client': 'Signed by client',
    'contracts.status.archived': 'Archived',
    'contracts.status.cancelled': 'Cancelled',
    'contracts.view_contract': 'View Contract',
    'contracts.sign_contract': 'Sign Contract',
    'contracts.contract_number': 'Contract',
    'contracts.created': 'Created',
    'contracts.amount': 'Amount',

    // Car Selection Form
    'car_form.title': 'Select Your Desired Car',
    'car_form.subtitle': 'Fill in the details about the car you are looking for',
    'car_form.make_label': 'Make *',
    'car_form.make_placeholder': 'Select make...',
    'car_form.model_label': 'Model *',
    'car_form.model_placeholder': 'Select model...',
    'car_form.year_label': 'Year *',
    'car_form.year_placeholder': 'Select year...',
    'car_form.fuel_type_label': 'Fuel Type (optional)',
    'car_form.fuel_type_placeholder': 'Select fuel type...',
    'car_form.transmission_label': 'Transmission Type (optional)',
    'car_form.transmission_placeholder': 'Select transmission type...',
    'car_form.max_mileage_label': 'Max Mileage (optional)',
    'car_form.max_mileage_placeholder': 'e.g.: 150000',
    'car_form.max_mileage_hint': 'in kilometers',
    'car_form.budget_label': 'Budget (EUR) *',
    'car_form.budget_placeholder': 'e.g.: 25000',
    'car_form.features_label': 'Desired Features (optional)',
    'car_form.features_placeholder': 'Select features...',
    'car_form.additional_notes_label': 'Additional Notes (optional)',
    'car_form.additional_notes_placeholder': 'Additional details about the desired car, special preferences...',
    'car_form.submit_button': 'Send Request',
    'car_form.submitting_button': 'Sending...',

    // Car Features
    'car_features.leather': 'Leather interior',
    'car_features.sunroof': 'Sunroof',
    'car_features.navigation': 'Navigation system',
    'car_features.heated_seats': 'Heated seats',
    'car_features.cooled_seats': 'Cooled seats',
    'car_features.heated_steering': 'Heated steering wheel',
    'car_features.bluetooth': 'Bluetooth',
    'car_features.backup_camera': 'Backup camera',
    'car_features.360_camera': '360° camera',
    'car_features.cruise_control': 'Cruise control',
    'car_features.adaptive_cruise': 'Adaptive cruise control',
    'car_features.keyless': 'Keyless start',
    'car_features.keyless_entry': 'Keyless entry',
    'car_features.premium_audio': 'Premium audio system',
    'car_features.xenon': 'Xenon/LED headlights',
    'car_features.matrix_led': 'Matrix LED headlights',
    'car_features.parking_sensors': 'Parking sensors',
    'car_features.auto_park': 'Auto park',
    'car_features.climate_control': 'Auto climate control',
    'car_features.dual_zone_climate': 'Dual-zone climate',
    'car_features.tri_zone_climate': 'Tri-zone climate',
    'car_features.lane_assist': 'Lane assist',
    'car_features.blind_spot': 'Blind spot monitor',
    'car_features.collision_warning': 'Collision warning',
    'car_features.emergency_brake': 'Emergency braking',
    'car_features.traffic_sign': 'Traffic sign recognition',
    'car_features.wireless_charging': 'Wireless charging',
    'car_features.apple_carplay': 'Apple CarPlay',
    'car_features.android_auto': 'Android Auto',
    'car_features.heads_up_display': 'Head-up Display',
    'car_features.panoramic_roof': 'Panoramic roof',
    'car_features.electric_seats': 'Electric seats',
    'car_features.memory_seats': 'Memory seats',
    'car_features.massage_seats': 'Massage seats',
    'car_features.sport_suspension': 'Sport suspension',
    'car_features.air_suspension': 'Air suspension',
    'car_features.awd': 'All-wheel drive',
    'car_features.sport_mode': 'Driving modes',
    'car_features.start_stop': 'Start-Stop system',
    'car_features.eco_mode': 'Eco mode',
    'car_features.night_vision': 'Night vision',
    'car_features.ambient_lighting': 'Ambient lighting',

    // Fuel Types
    'fuel_types.benzina': 'Gasoline',
    'fuel_types.motorina': 'Diesel',
    'fuel_types.hybrid': 'Hybrid',
    'fuel_types.electric': 'Electric',
    'fuel_types.gpl': 'LPG',
    'fuel_types.cng': 'CNG',
    'fuel_types.mild_hybrid': 'Mild Hybrid',
    'fuel_types.plug_in_hybrid': 'Plug-in Hybrid',
    'fuel_types.hydrogen': 'Hydrogen',
    'fuel_types.ethanol': 'Ethanol',
    'fuel_types.lpg': 'LPG',
    'fuel_types.flex_fuel': 'Flex Fuel',
    'fuel_types.bi_fuel': 'Bi-Fuel',
    'fuel_types.range_extender': 'Range Extender',

    // Transmission Types
    'transmission.manuala': 'Manual',
    'transmission.automata': 'Automatic',
    'transmission.semiautomata': 'Semi-automatic',
    'transmission.cvt': 'CVT',
    'transmission.dsg': 'DSG',
    'transmission.tiptronic': 'Tiptronic',
    'transmission.multitronic': 'Multitronic',
    'transmission.s_tronic': 'S-Tronic',
    'transmission.pdk': 'PDK',
    'transmission.zf_8hp': 'ZF 8HP',
    'transmission.torque_converter': 'Torque Converter',
    'transmission.dual_clutch': 'Dual Clutch',
    'transmission.single_speed': 'Single Speed (Electric)',
    'transmission.e_cvt': 'e-CVT',
    'transmission.amt': 'AMT',
    'transmission.imt': 'iMT',

    // Validation Messages
    'validation.select_make': 'Please select make',
    'validation.select_model': 'Please select model',
    'validation.year_after_1985': 'Year must be after 1985',
    'validation.year_not_future': 'Year cannot be in the future',
    'validation.budget_min': 'Minimum budget is €1,000',
    'validation.budget_max': 'Maximum budget is €500,000',

    // Toast Messages
    'toast.login_required': 'You must be logged in to submit a request.',
    'toast.profile_error': 'Could not access profile information.',
    'toast.database_error': 'Database error',
    'toast.email_failed': 'Request was saved, but email notification failed.',
    'toast.request_success': 'Your request has been sent successfully! You will find it in the requests list.',
    'toast.general_error': 'An error occurred. Please try again.',

    // Consignatie Section
    'consignatie.title': 'Car Consignment',
    'consignatie.subtitle': 'We sell your car safely and at the best price',
    'consignatie.description': 'Put your car in our consignment and let us sell it for you. We handle the entire sales process, from promotion to transaction completion.',
    'consignatie.benefit1.title': 'Professional Evaluation',
    'consignatie.benefit1.description': 'We correctly evaluate your car and establish the best selling price on the market',
    'consignatie.benefit2.title': 'Complete Marketing',
    'consignatie.benefit2.description': 'We promote your car on all relevant platforms and in our network of buyers',
    'consignatie.benefit3.title': 'Complete Documentation',
    'consignatie.benefit3.description': 'We handle all the documents and formalities necessary for the sale',
    'consignatie.benefit4.title': 'Guaranteed Payment',
    'consignatie.benefit4.description': 'You receive the money immediately after sale, without risks or delays',
    'consignatie.cta': 'Put Car in Consignment',
    'consignatie.contact': 'Contact Us for Evaluation',

    // Progress Tracking
    'progress.title': 'Car Import Progress',
    'progress.stages_completed': '{{completed}} of {{total}} stages completed',
    'progress.percent_complete': '{{percent}}% complete',
    'progress.current_stage': 'Current stage: {{stage}}',
    'progress.notification_text': 'You will be notified when this stage is completed and we move to the next one.',
    'progress.stages.requested': 'Request Sent',
    'progress.stages.requested_desc': 'Your car import request has been submitted',
    'progress.stages.searching': 'Active Search',
    'progress.stages.searching_desc': 'We are actively searching for your desired vehicle',
    'progress.stages.found': 'Car Found',
    'progress.stages.found_desc': 'Perfect match found! Vehicle details will be shared',
    'progress.stages.auction_time': 'Auction Time',
    'progress.stages.auction_time_desc': 'Car is at auction - result will be communicated soon',
    'progress.stages.auction_won': 'Auction Won',
    'progress.stages.auction_won_desc': 'Congratulations! We won the auction for your car',
    'progress.stages.auction_lost': 'Purchase Failed (price exceeded)',
    'progress.stages.auction_lost_desc': 'Unfortunately the price exceeded the set budget',
    'progress.stages.purchase_failed': 'Purchase Failed (price exceeded)',
    'progress.stages.purchase_failed_desc': 'Unfortunately the price exceeded the set budget',
    'progress.stages.purchased': 'Purchased',
    'progress.stages.purchased_desc': 'Vehicle purchased! Payment confirmed and processed',
    'progress.stages.in_transit': 'In Transit',
    'progress.stages.in_transit_desc': 'Vehicle is being transported to Romania',
    'progress.stages.delivered': 'Delivered',
    'progress.stages.delivered_desc': 'Vehicle ready for pickup or home delivery',
    'progress.status.in_progress': 'In Progress',
    'progress.status.completed': 'Completed',
    'progress.status.delayed': 'Delayed',
    'progress.date.completed': 'Completed: {{date}}',
    'progress.date.estimated': 'Estimated: {{date}}',
    'progress.date.today': 'Today',
    'progress.date.tomorrow': 'Tomorrow',
    'progress.date.in_days': 'in {{days}} days',
    'progress.date.yesterday': 'Yesterday',
    'progress.date.days_ago': '{{days}} days ago',
    'progress.last_updated': 'Last updated',

    // Notifications
    'notifications.title': 'Notifications',
    'notifications.mark_all_read': 'Mark all as read',
    'notifications.no_notifications': 'No new notifications',
    'notifications.no_notifications_desc': 'We will show you updates about your requests here.',

    // Onboarding
    'onboarding.welcome': 'Welcome',
    'onboarding.skip': 'Skip guide',
    'onboarding.next': 'Next',
    'onboarding.previous': 'Previous',
    'onboarding.finish': 'Let\'s get started!',
    'onboarding.step_of': 'Step {{current}} of {{total}}'
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