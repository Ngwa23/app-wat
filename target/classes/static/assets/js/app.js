/* =========================================================================
   World Advanced Technology — front-end behaviour
   ========================================================================= */
(function () {
  "use strict";

  /* ---------------- i18n ---------------- */
  const T = {
    en: {
      "nav.about": "About", "nav.services": "Services", "nav.voip": "VoIP", "nav.team": "Team",
      "nav.careers": "Careers", "nav.payment": "Payment", "nav.contact": "Contact",
      "hero.badge": "Cameroon's Premier IT Company",
      "hero.sub": "IT Consultancy • DevOps • VoIP Solutions • Networks • Web & Mobile. Enterprise-grade technology built for African businesses.",
      "hero.cta1": "Our Services", "hero.cta2": "Get in Touch",
      "stat.clients": "Clients Served", "stat.years": "Years Experience", "stat.support": "Support Hours", "stat.projects": "Projects Done",
      "about.label": "Our Story", "about.title": "Pioneering Technology Excellence in Cameroon",
      "about.p1": "World Advanced Technology (WAT) is Cameroon's premier IT solutions company, founded with a singular vision: to bring enterprise-grade technology to African businesses at accessible prices.",
      "about.p2": "Led by CEO NGWA CLOVIS OCHANG, a Cisco-certified network engineer and AWS Cloud professional, our team delivers cutting-edge DevOps infrastructure, private VoIP telephone systems, and comprehensive IT consultancy.",
      "about.p3": "Our VoIP solutions are trusted by banks, microfinances and multi-branch companies, enabling seamless, cost-effective communication nationally and internationally.",
      "ceo.name": "NGWA CLOVIS OCHANG", "ceo.title": "CEO & Founder · Network Engineer",
      "ceo.bio": "\"Our mission is to empower every Cameroonian business with world-class technology. From VoIP to DevOps, we deliver solutions that matter.\"",
      "ceo.contact": "Contact the CEO",
      "why.label": "The WAT Difference", "why.title": "Why businesses choose us",
      "why.1.t": "Cisco & AWS Certified", "why.1.d": "Certified network and cloud engineers you can rely on.",
      "why.2.t": "8+ Years Experience", "why.2.d": "A proven track record delivering across Cameroon since 2016.",
      "why.3.t": "150+ Happy Clients", "why.3.d": "Banks, schools and enterprises trust us with their infrastructure.",
      "why.4.t": "24/7 Support", "why.4.d": "Round-the-clock technical support whenever you need it.",
      "svc.label": "What We Do", "svc.title": "Our Services", "svc.sub": "End-to-end IT solutions for modern businesses.", "svc.learn": "Learn More",
      "svc1.title": "IT Consultancy", "svc1.desc": "Expert IT consultation, infrastructure assessment, technology planning and strategic guidance.",
      "svc2.title": "DevOps Services", "svc2.desc": "Docker, Kubernetes, AWS, CI/CD, Ansible, Terraform, Prometheus, Grafana, ELK and more.",
      "svc3.title": "VoIP Solutions", "svc3.desc": "Private telephone systems for banks, microfinances & multi-branch companies — national & international.", "svc3.cta": "See VoIP",
      "svc4.title": "Network & Security", "svc4.desc": "Network installation, CCTV, access control, time attendance and anti-intrusion alarms.",
      "svc5.title": "Web & Mobile Dev", "svc5.desc": "Custom websites, web apps and mobile apps — Android & iOS, from landing pages to enterprise platforms.",
      "svc6.title": "Starlink Installation", "svc6.desc": "Supply, configuration & installation of Starlink kits — dish mounting, alignment and router setup for homes, offices & remote sites.",
      "svc7.title": "WiFi Zone Setup", "svc7.desc": "Professional WiFi hotspot zones for hotels, offices & campuses — captive portal, bandwidth management, VLAN & guest access.",
      "voip.label": "Private Phone Systems", "voip.title": "Enterprise VoIP Solutions", "voip.sub": "Your own private telephone network — national & international.",
      "b1.t": "Your Own Private Network", "b1.d": "A dedicated, secure telephone system owned entirely by your organisation.",
      "b2.t": "International Reach", "b2.d": "Connect branches in Cameroon and internationally — France, Belgium, any country.",
      "b3.t": "Massive Cost Savings", "b3.d": "Reduce inter-branch call costs by up to 70%. Free internal calls between all extensions.",
      "b4.t": "Call Centre Ready", "b4.d": "Full inbound/outbound call-centre capabilities — queue management, IVR, call recording.",
      "b5.t": "24/7 Support", "b5.d": "Round-the-clock technical support from our certified VoIP engineers.",
      "dev1.desc": "Enterprise IP desk phone. HD voice, 6 SIP accounts — ideal for bank tellers and branch managers.",
      "dev2.desc": "Feature-rich softphone for Windows, Mac, Android & iOS. Perfect for remote agents and call centres.",
      "dev3.desc": "Lightweight Windows SIP softphone. Low resource usage, TLS encryption for secure calls.",
      "voip.wa": "WhatsApp Us for a Quote",
      "team.label": "The People", "team.title": "Our Team", "team.sub": "Professional, well-trained specialists dedicated to your success.", "team.devs": "Development Team",
      "role.ceo": "CEO & Founder", "role.itm": "IT Manager", "role.dev": "Developer",
      "testi.label": "Social Proof", "testi.title": "What Our Clients Say", "testi.rating": "Average Rating", "testi.sat": "Satisfied Clients", "testi.track": "Proven Track Record",
      "t1.text": "\"WAT completely transformed our branch communication. Their VoIP system saved us over 40% on costs and our 12 branches are now seamlessly interconnected. Exceptional service!\"",
      "t2.text": "\"The DevOps pipeline WAT built reduced our deployment time from 3 days to 15 minutes. Their Kubernetes expertise is world-class. Highly recommended!\"",
      "t3.text": "\"Best IT company in Cameroon. Network, CCTV and access control installed in record time. Their 24/7 support gives us peace of mind. A true technology partner.\"",
      "cta.word": "Extraordinary", "cta.sub": "From VoIP infrastructure to DevOps pipelines — WAT delivers enterprise-grade technology at prices that make sense for African businesses.", "cta.start": "Start a Project", "cta.free": "Free Consultation",
      "pay.label": "Easy Payments", "pay.title": "Payment Methods", "pay.sub": "Flexible payment options for your convenience.",
      "pay.mtn": "Send payment via MTN Mobile Money. Fast, secure, instant confirmation.", "pay.mtn.ref": "Reference: WAT + Your Name",
      "pay.orange": "Pay via Orange Money. Available 24/7, nationwide coverage.", "pay.orange.ref": "Reference: WAT + Your Name",
      "pay.afriland": "Bank transfer to our Afriland First Bank account for corporate contracts.", "pay.afriland.ref": "Account details provided on invoice",
      "pay.call": "Call", "pay.email": "Email for Invoice",
      "career.label": "Join Our Team", "career.title": "We Are Hiring", "career.sub": "World Advanced Technology is growing — join our passionate team.",
      "j1.title": "Senior DevOps Engineer", "j2.title": "AWS Cloud Engineer", "j3.title": "Network Engineer (Cisco)", "j4.title": "VoIP Technician", "j5.title": "Full-Stack Web Developer",
      "career.apply": "Apply", "job.title": "Apply for a Position", "job.exp": "Years of Experience", "job.pos": "Position *", "job.cover": "Cover Letter / Message *", "job.apply": "Submit Application",
      "career.email": "Or send your CV to: worldadvancedtechnology23@gmail.com",
      "contact.label": "Get In Touch", "contact.title": "Contact Us", "contact.sub": "We respond within 2 hours — 24/7 support available.",
      "f.name": "Full Name *", "f.email": "Email *", "f.phone": "Phone", "f.service": "Service Needed", "f.subject": "Subject *", "f.message": "Message *", "f.send": "Send Message",
      "ci.phone": "Phone / WhatsApp", "ci.email": "Email", "ci.addr": "Address", "ci.hours": "Opening Hours", "ci.weekend": "Sat–Sun: Closed",
      "foot.tag": "Enterprise-grade IT, DevOps and private VoIP for African businesses. Based in Yaoundé, serving Cameroon & beyond since 2016.",
      "foot.quick": "Quick Links", "foot.services": "Services", "foot.contact": "Contact", "foot.rights": "All rights reserved.",
      "det.title": "What we deliver", "det.quote": "Get a Quote on WhatsApp", "det.contact": "Contact Us",
      "det1": "IT infrastructure audit & assessment|Technology roadmap & strategic planning|Cloud readiness & migration strategy|Vendor selection & cost optimization|Security, backup & compliance review",
      "det2": "CI/CD pipeline design & automation|Docker & Kubernetes containerization|AWS cloud architecture & IaC (Terraform)|Monitoring & logging (Prometheus, Grafana, ELK)|Configuration management with Ansible",
      "det3": "Private IP-PBX setup (Asterisk)|Desk phones & softphone configuration|Multi-branch & international extensions|Call centre, IVR & call recording|24/7 maintenance & support",
      "det4": "Structured network cabling & installation|CCTV camera supply & installation|Access control & time attendance|Anti-intrusion alarm systems|Firewall & network security hardening",
      "det5": "Custom websites & landing pages|Web applications & dashboards|Android & iOS mobile apps|E-commerce & payment integration|Maintenance, hosting & SEO",
      "det6": "Starlink kit supply & procurement|Dish mounting & optimal alignment|Router & network configuration|Coverage for homes, offices & remote sites|On-site testing & handover",
      "det7": "Site survey & access-point planning|Captive portal & guest login|Bandwidth management & VLANs|Hotspot billing / voucher system|Coverage for hotels, offices & campuses"
    },
    fr: {
      "nav.about": "À Propos", "nav.services": "Services", "nav.voip": "VoIP", "nav.team": "Équipe",
      "nav.careers": "Carrières", "nav.payment": "Paiement", "nav.contact": "Contact",
      "hero.badge": "Première Entreprise IT du Cameroun",
      "hero.sub": "Conseil IT • DevOps • Solutions VoIP • Réseaux • Web & Mobile. Une technologie d'entreprise conçue pour les sociétés africaines.",
      "hero.cta1": "Nos Services", "hero.cta2": "Nous Contacter",
      "stat.clients": "Clients Servis", "stat.years": "Ans d'Expérience", "stat.support": "Heures de Support", "stat.projects": "Projets Réalisés",
      "about.label": "Notre Histoire", "about.title": "Excellence Technologique au Cameroun",
      "about.p1": "World Advanced Technology (WAT) est la première entreprise de solutions IT du Cameroun, fondée avec une vision claire : apporter une technologie d'entreprise aux sociétés africaines à des prix accessibles.",
      "about.p2": "Dirigée par le PDG NGWA CLOVIS OCHANG, ingénieur réseau certifié Cisco et professionnel AWS Cloud, notre équipe livre des infrastructures DevOps, des systèmes VoIP privés et un conseil IT complet.",
      "about.p3": "Nos solutions VoIP sont utilisées par des banques, microfinances et entreprises multi-agences pour une communication fluide et rentable, au niveau national et international.",
      "ceo.name": "NGWA CLOVIS OCHANG", "ceo.title": "PDG & Fondateur · Ingénieur Réseau",
      "ceo.bio": "« Notre mission est d'équiper chaque entreprise camerounaise avec une technologie de classe mondiale. Du VoIP au DevOps, nous livrons des solutions qui comptent. »",
      "ceo.contact": "Contacter le PDG",
      "why.label": "La Différence WAT", "why.title": "Pourquoi les entreprises nous choisissent",
      "why.1.t": "Certifié Cisco & AWS", "why.1.d": "Des ingénieurs réseau et cloud certifiés sur qui compter.",
      "why.2.t": "8+ Ans d'Expérience", "why.2.d": "Un parcours prouvé au Cameroun depuis 2016.",
      "why.3.t": "150+ Clients Satisfaits", "why.3.d": "Banques, écoles et entreprises nous confient leur infrastructure.",
      "why.4.t": "Support 24/7", "why.4.d": "Un support technique disponible à tout moment.",
      "svc.label": "Ce Que Nous Faisons", "svc.title": "Nos Services", "svc.sub": "Des solutions IT de bout en bout pour les entreprises modernes.", "svc.learn": "En Savoir Plus",
      "svc1.title": "Conseil IT", "svc1.desc": "Consultation IT experte, évaluation d'infrastructure, planification technologique et conseil stratégique.",
      "svc2.title": "Services DevOps", "svc2.desc": "Docker, Kubernetes, AWS, CI/CD, Ansible, Terraform, Prometheus, Grafana, ELK et plus.",
      "svc3.title": "Solutions VoIP", "svc3.desc": "Systèmes téléphoniques privés pour banques, microfinances et entreprises multi-agences — national & international.", "svc3.cta": "Voir VoIP",
      "svc4.title": "Réseau & Sécurité", "svc4.desc": "Installation réseau, CCTV, contrôle d'accès, pointage et alarmes anti-intrusion.",
      "svc5.title": "Web & Mobile", "svc5.desc": "Sites web, applications web et mobiles — Android & iOS, des landing pages aux plateformes d'entreprise.",
      "svc6.title": "Installation Starlink", "svc6.desc": "Fourniture, configuration et installation de kits Starlink — montage d'antenne, alignement et réseau pour maisons, bureaux et sites isolés.",
      "svc7.title": "Zone WiFi", "svc7.desc": "Zones WiFi professionnelles pour hôtels, bureaux et campus — portail captif, gestion de bande passante, VLAN et accès invité.",
      "voip.label": "Systèmes Téléphoniques Privés", "voip.title": "Solutions VoIP d'Entreprise", "voip.sub": "Votre propre réseau téléphonique privé — national & international.",
      "b1.t": "Votre Réseau Privé", "b1.d": "Un système téléphonique dédié et sécurisé, entièrement détenu par votre organisation.",
      "b2.t": "Portée Internationale", "b2.d": "Reliez vos agences au Cameroun et à l'international — France, Belgique, tout pays.",
      "b3.t": "Économies Importantes", "b3.d": "Réduisez les coûts d'appels inter-agences jusqu'à 70 %. Appels internes gratuits.",
      "b4.t": "Prêt pour Centre d'Appels", "b4.d": "Capacités complètes de centre d'appels — files d'attente, SVI, enregistrement.",
      "b5.t": "Support 24/7", "b5.d": "Support technique permanent par nos ingénieurs VoIP certifiés.",
      "dev1.desc": "Téléphone IP de bureau d'entreprise. Voix HD, 6 comptes SIP — idéal pour guichetiers et responsables d'agence.",
      "dev2.desc": "Softphone riche pour Windows, Mac, Android & iOS. Parfait pour agents distants et centres d'appels.",
      "dev3.desc": "Softphone SIP léger pour Windows. Faible consommation, chiffrement TLS pour des appels sécurisés.",
      "voip.wa": "Demander un Devis sur WhatsApp",
      "team.label": "Les Personnes", "team.title": "Notre Équipe", "team.sub": "Des spécialistes professionnels et bien formés, dévoués à votre réussite.", "team.devs": "Équipe de Développement",
      "role.ceo": "PDG & Fondateur", "role.itm": "Responsable IT", "role.dev": "Développeur",
      "testi.label": "Preuve Sociale", "testi.title": "Ce Que Disent Nos Clients", "testi.rating": "Note Moyenne", "testi.sat": "Clients Satisfaits", "testi.track": "Expérience Prouvée",
      "t1.text": "« WAT a transformé la communication de nos agences. Leur système VoIP nous a fait économiser plus de 40 % et nos 12 agences sont désormais parfaitement interconnectées. Service exceptionnel ! »",
      "t2.text": "« Le pipeline DevOps livré par WAT a réduit notre temps de déploiement de 3 jours à 15 minutes. Leur expertise Kubernetes est de classe mondiale. Vivement recommandé ! »",
      "t3.text": "« Meilleure entreprise IT du Cameroun. Réseau, CCTV et contrôle d'accès installés en un temps record. Leur support 24/7 nous rassure. Un vrai partenaire technologique. »",
      "cta.word": "d'Extraordinaire", "cta.sub": "De l'infrastructure VoIP aux pipelines DevOps — WAT livre une technologie d'entreprise à des prix adaptés aux sociétés africaines.", "cta.start": "Démarrer un Projet", "cta.free": "Consultation Gratuite",
      "pay.label": "Paiements Faciles", "pay.title": "Moyens de Paiement", "pay.sub": "Des options de paiement flexibles pour votre confort.",
      "pay.mtn": "Payez via MTN Mobile Money. Rapide, sécurisé, confirmation instantanée.", "pay.mtn.ref": "Référence : WAT + Votre Nom",
      "pay.orange": "Payez via Orange Money. Disponible 24/7, couverture nationale.", "pay.orange.ref": "Référence : WAT + Votre Nom",
      "pay.afriland": "Virement bancaire vers notre compte Afriland First Bank pour contrats d'entreprise.", "pay.afriland.ref": "Coordonnées fournies sur la facture",
      "pay.call": "Appeler", "pay.email": "Email pour Facture",
      "career.label": "Rejoignez-Nous", "career.title": "Nous Recrutons", "career.sub": "World Advanced Technology grandit — rejoignez notre équipe passionnée.",
      "j1.title": "Ingénieur DevOps Senior", "j2.title": "Ingénieur AWS Cloud", "j3.title": "Ingénieur Réseau (Cisco)", "j4.title": "Technicien VoIP", "j5.title": "Développeur Web Full-Stack",
      "career.apply": "Postuler", "job.title": "Postuler à un Poste", "job.exp": "Années d'Expérience", "job.pos": "Poste *", "job.cover": "Lettre de Motivation / Message *", "job.apply": "Envoyer la Candidature",
      "career.email": "Ou envoyez votre CV à : worldadvancedtechnology23@gmail.com",
      "contact.label": "Contactez-Nous", "contact.title": "Contact", "contact.sub": "Nous répondons en moins de 2 heures — support 24/7 disponible.",
      "f.name": "Nom Complet *", "f.email": "Email *", "f.phone": "Téléphone", "f.service": "Service Souhaité", "f.subject": "Sujet *", "f.message": "Message *", "f.send": "Envoyer le Message",
      "ci.phone": "Téléphone / WhatsApp", "ci.email": "Email", "ci.addr": "Adresse", "ci.hours": "Heures d'Ouverture", "ci.weekend": "Sam–Dim : Fermé",
      "foot.tag": "IT, DevOps et VoIP privé de niveau entreprise pour les sociétés africaines. Basés à Yaoundé, au service du Cameroun et au-delà depuis 2016.",
      "foot.quick": "Liens Rapides", "foot.services": "Services", "foot.contact": "Contact", "foot.rights": "Tous droits réservés.",
      "det.title": "Ce que nous livrons", "det.quote": "Demander un devis sur WhatsApp", "det.contact": "Nous contacter",
      "det1": "Audit et évaluation de l'infrastructure IT|Feuille de route technologique et planification stratégique|Stratégie de migration et d'adoption du cloud|Sélection des fournisseurs et optimisation des coûts|Revue sécurité, sauvegarde et conformité",
      "det2": "Conception et automatisation de pipelines CI/CD|Conteneurisation Docker et Kubernetes|Architecture cloud AWS et IaC (Terraform)|Supervision et logs (Prometheus, Grafana, ELK)|Gestion de configuration avec Ansible",
      "det3": "Installation d'un IP-PBX privé (Asterisk)|Configuration des téléphones et softphones|Extensions multi-agences et internationales|Centre d'appels, SVI et enregistrement|Maintenance et support 24/7",
      "det4": "Câblage et installation réseau structurés|Fourniture et installation de caméras CCTV|Contrôle d'accès et pointage|Systèmes d'alarme anti-intrusion|Pare-feu et sécurisation du réseau",
      "det5": "Sites web et landing pages sur mesure|Applications web et tableaux de bord|Applications mobiles Android et iOS|E-commerce et intégration de paiement|Maintenance, hébergement et SEO",
      "det6": "Fourniture du kit Starlink|Montage de l'antenne et alignement optimal|Configuration du routeur et du réseau|Couverture maisons, bureaux et sites isolés|Tests sur site et mise en service",
      "det7": "Étude de site et planification des points d'accès|Portail captif et connexion invités|Gestion de bande passante et VLAN|Système de tickets / facturation hotspot|Couverture hôtels, bureaux et campus"
    },
    es: {
      "nav.about": "Sobre Nosotros", "nav.services": "Servicios", "nav.voip": "VoIP", "nav.team": "Equipo",
      "nav.careers": "Carreras", "nav.payment": "Pago", "nav.contact": "Contacto",
      "hero.badge": "Primera Empresa IT de Camerún",
      "hero.sub": "Consultoría IT • DevOps • Soluciones VoIP • Redes • Web & Móvil. Tecnología empresarial creada para las empresas africanas.",
      "hero.cta1": "Nuestros Servicios", "hero.cta2": "Contáctenos",
      "stat.clients": "Clientes Atendidos", "stat.years": "Años de Experiencia", "stat.support": "Horas de Soporte", "stat.projects": "Proyectos Realizados",
      "about.label": "Nuestra Historia", "about.title": "Excelencia Tecnológica en Camerún",
      "about.p1": "World Advanced Technology (WAT) es la empresa líder de soluciones IT de Camerún, fundada con una visión clara: llevar tecnología empresarial a las empresas africanas a precios accesibles.",
      "about.p2": "Bajo el liderazgo del CEO NGWA CLOVIS OCHANG, ingeniero de redes certificado Cisco y profesional AWS Cloud, nuestro equipo entrega infraestructuras DevOps, sistemas VoIP privados y consultoría IT integral.",
      "about.p3": "Nuestras soluciones VoIP son utilizadas por bancos, microfinancieras y empresas multi-sucursal para una comunicación fluida y rentable, a nivel nacional e internacional.",
      "ceo.name": "NGWA CLOVIS OCHANG", "ceo.title": "CEO & Fundador · Ingeniero de Redes",
      "ceo.bio": "«Nuestra misión es equipar a cada empresa camerunesa con tecnología de clase mundial. Del VoIP al DevOps, entregamos soluciones que importan.»",
      "ceo.contact": "Contactar al CEO",
      "why.label": "La Diferencia WAT", "why.title": "Por qué las empresas nos eligen",
      "why.1.t": "Certificado Cisco & AWS", "why.1.d": "Ingenieros de red y nube certificados en quien confiar.",
      "why.2.t": "8+ Años de Experiencia", "why.2.d": "Una trayectoria probada en Camerún desde 2016.",
      "why.3.t": "150+ Clientes Satisfechos", "why.3.d": "Bancos, escuelas y empresas confían su infraestructura en nosotros.",
      "why.4.t": "Soporte 24/7", "why.4.d": "Soporte técnico ininterrumpido cuando lo necesite.",
      "svc.label": "Lo Que Hacemos", "svc.title": "Nuestros Servicios", "svc.sub": "Soluciones IT integrales para empresas modernas.", "svc.learn": "Saber Más",
      "svc1.title": "Consultoría IT", "svc1.desc": "Consultoría IT experta, evaluación de infraestructura, planificación tecnológica y asesoramiento estratégico.",
      "svc2.title": "Servicios DevOps", "svc2.desc": "Docker, Kubernetes, AWS, CI/CD, Ansible, Terraform, Prometheus, Grafana, ELK y más.",
      "svc3.title": "Soluciones VoIP", "svc3.desc": "Sistemas telefónicos privados para bancos, microfinancieras y empresas multi-sucursal — nacional e internacional.", "svc3.cta": "Ver VoIP",
      "svc4.title": "Redes & Seguridad", "svc4.desc": "Instalación de redes, CCTV, control de acceso, control de asistencia y alarmas anti-intrusión.",
      "svc5.title": "Web & Móvil", "svc5.desc": "Sitios web, aplicaciones web y móviles — Android & iOS, desde landing pages hasta plataformas empresariales.",
      "svc6.title": "Instalación Starlink", "svc6.desc": "Suministro, configuración e instalación de kits Starlink — montaje de antena, alineación y red para hogares, oficinas y sitios remotos.",
      "svc7.title": "Zona WiFi", "svc7.desc": "Zonas WiFi profesionales para hoteles, oficinas y campus — portal cautivo, gestión de ancho de banda, VLAN y acceso de invitados.",
      "voip.label": "Sistemas Telefónicos Privados", "voip.title": "Soluciones VoIP Empresariales", "voip.sub": "Su propia red telefónica privada — nacional e internacional.",
      "b1.t": "Su Propia Red Privada", "b1.d": "Un sistema telefónico dedicado y seguro, propiedad de su organización.",
      "b2.t": "Alcance Internacional", "b2.d": "Conecte sus sucursales en Camerún e internacionalmente — Francia, Bélgica, cualquier país.",
      "b3.t": "Grandes Ahorros", "b3.d": "Reduzca los costos de llamadas inter-sucursal hasta un 70%. Llamadas internas gratuitas.",
      "b4.t": "Listo para Call Center", "b4.d": "Capacidades completas de call center entrante/saliente — colas, IVR, grabación.",
      "b5.t": "Soporte 24/7", "b5.d": "Asistencia técnica permanente de nuestros ingenieros VoIP certificados.",
      "dev1.desc": "Teléfono IP de escritorio empresarial. Voz HD, 6 cuentas SIP — ideal para cajeros y gerentes de sucursal.",
      "dev2.desc": "Softphone completo para Windows, Mac, Android & iOS. Perfecto para agentes remotos y call centers.",
      "dev3.desc": "Softphone SIP ligero para Windows. Bajo consumo, cifrado TLS para llamadas seguras.",
      "voip.wa": "Pídanos un Presupuesto por WhatsApp",
      "team.label": "Las Personas", "team.title": "Nuestro Equipo", "team.sub": "Especialistas profesionales y bien formados, dedicados a su éxito.", "team.devs": "Equipo de Desarrollo",
      "role.ceo": "CEO & Fundador", "role.itm": "Director IT", "role.dev": "Desarrollador",
      "testi.label": "Testimonios", "testi.title": "Lo Que Dicen Nuestros Clientes", "testi.rating": "Valoración Media", "testi.sat": "Clientes Satisfechos", "testi.track": "Trayectoria Probada",
      "t1.text": "«WAT transformó por completo la comunicación entre nuestras sucursales. Su sistema VoIP nos ahorró más del 40% en costos y nuestras 12 sucursales están ahora perfectamente interconectadas. ¡Servicio excepcional!»",
      "t2.text": "«El pipeline DevOps que WAT construyó redujo nuestro tiempo de despliegue de 3 días a 15 minutos. Su experiencia en Kubernetes es de clase mundial. ¡Muy recomendable!»",
      "t3.text": "«La mejor empresa IT de Camerún. Instalaron nuestra red, CCTV y control de acceso en tiempo récord. Su soporte 24/7 nos da tranquilidad. Un verdadero socio tecnológico.»",
      "cta.word": "Extraordinario", "cta.sub": "De la infraestructura VoIP a los pipelines DevOps — WAT entrega tecnología empresarial a precios que tienen sentido para las empresas africanas.", "cta.start": "Iniciar un Proyecto", "cta.free": "Consulta Gratuita",
      "pay.label": "Pagos Fáciles", "pay.title": "Métodos de Pago", "pay.sub": "Opciones de pago flexibles para su comodidad.",
      "pay.mtn": "Pague vía MTN Mobile Money. Rápido, seguro, confirmación instantánea.", "pay.mtn.ref": "Referencia: WAT + Su Nombre",
      "pay.orange": "Pague vía Orange Money. Disponible 24/7, cobertura nacional.", "pay.orange.ref": "Referencia: WAT + Su Nombre",
      "pay.afriland": "Transferencia bancaria a nuestra cuenta Afriland First Bank para contratos corporativos.", "pay.afriland.ref": "Detalles de la cuenta en la factura",
      "pay.call": "Llamar", "pay.email": "Email para Factura",
      "career.label": "Únase a Nosotros", "career.title": "Estamos Contratando", "career.sub": "World Advanced Technology está creciendo — únase a nuestro apasionado equipo.",
      "j1.title": "Ingeniero DevOps Senior", "j2.title": "Ingeniero Cloud AWS", "j3.title": "Ingeniero de Redes (Cisco)", "j4.title": "Técnico VoIP", "j5.title": "Desarrollador Full-Stack",
      "career.apply": "Aplicar", "job.title": "Solicitar un Puesto", "job.exp": "Años de Experiencia", "job.pos": "Puesto *", "job.cover": "Carta de Presentación / Mensaje *", "job.apply": "Enviar Solicitud",
      "career.email": "O envíe su CV a: worldadvancedtechnology23@gmail.com",
      "contact.label": "Contáctenos", "contact.title": "Contáctenos", "contact.sub": "Respondemos en menos de 2 horas — soporte 24/7 disponible.",
      "f.name": "Nombre Completo *", "f.email": "Email *", "f.phone": "Teléfono", "f.service": "Servicio Deseado", "f.subject": "Asunto *", "f.message": "Mensaje *", "f.send": "Enviar Mensaje",
      "ci.phone": "Teléfono / WhatsApp", "ci.email": "Email", "ci.addr": "Dirección", "ci.hours": "Horario de Atención", "ci.weekend": "Sáb–Dom: Cerrado",
      "foot.tag": "IT, DevOps y VoIP privado de nivel empresarial para empresas africanas. Con sede en Yaundé, al servicio de Camerún y más allá desde 2016.",
      "foot.quick": "Accesos Rápidos", "foot.services": "Servicios", "foot.contact": "Contacto", "foot.rights": "Todos los derechos reservados.",
      "det.title": "Lo que entregamos", "det.quote": "Pedir presupuesto por WhatsApp", "det.contact": "Contáctenos",
      "det1": "Auditoría y evaluación de la infraestructura IT|Hoja de ruta tecnológica y planificación estratégica|Estrategia de migración y adopción cloud|Selección de proveedores y optimización de costes|Revisión de seguridad, copias y cumplimiento",
      "det2": "Diseño y automatización de pipelines CI/CD|Contenerización con Docker y Kubernetes|Arquitectura cloud AWS e IaC (Terraform)|Monitorización y logs (Prometheus, Grafana, ELK)|Gestión de configuración con Ansible",
      "det3": "Instalación de IP-PBX privada (Asterisk)|Configuración de teléfonos y softphones|Extensiones multi-sucursal e internacionales|Call center, IVR y grabación de llamadas|Mantenimiento y soporte 24/7",
      "det4": "Cableado e instalación de red estructurada|Suministro e instalación de cámaras CCTV|Control de acceso y control de asistencia|Sistemas de alarma anti-intrusión|Firewall y protección de la red",
      "det5": "Sitios web y landing pages a medida|Aplicaciones web y paneles|Apps móviles Android e iOS|E-commerce e integración de pagos|Mantenimiento, hosting y SEO",
      "det6": "Suministro del kit Starlink|Montaje de antena y alineación óptima|Configuración de router y red|Cobertura para hogares, oficinas y sitios remotos|Pruebas in situ y entrega",
      "det7": "Estudio del sitio y planificación de puntos de acceso|Portal cautivo y acceso de invitados|Gestión de ancho de banda y VLAN|Sistema de tickets / facturación hotspot|Cobertura para hoteles, oficinas y campus"
    },
    de: {
      "nav.about": "Über Uns", "nav.services": "Leistungen", "nav.voip": "VoIP", "nav.team": "Team",
      "nav.careers": "Karriere", "nav.payment": "Zahlung", "nav.contact": "Kontakt",
      "hero.badge": "Kameruns führendes IT-Unternehmen",
      "hero.sub": "IT-Beratung • DevOps • VoIP-Lösungen • Netzwerke • Web & Mobil. Unternehmenstechnologie für afrikanische Unternehmen.",
      "hero.cta1": "Unsere Leistungen", "hero.cta2": "Kontakt aufnehmen",
      "stat.clients": "Bediente Kunden", "stat.years": "Jahre Erfahrung", "stat.support": "Support-Stunden", "stat.projects": "Abgeschlossene Projekte",
      "about.label": "Unsere Geschichte", "about.title": "Technologieexzellenz in Kamerun",
      "about.p1": "World Advanced Technology (WAT) ist Kameruns führendes IT-Unternehmen, gegründet mit einer klaren Vision: Unternehmenstechnologie für afrikanische Unternehmen zu erschwinglichen Preisen zugänglich zu machen.",
      "about.p2": "Geführt von CEO NGWA CLOVIS OCHANG, Cisco-zertifizierter Netzwerkingenieur und AWS Cloud-Profi, liefert unser Team moderne DevOps-Infrastrukturen, private VoIP-Systeme und umfassende IT-Beratung.",
      "about.p3": "Unsere VoIP-Lösungen werden von Banken, Mikrofinanzinstituten und Filialbetrieben für eine nahtlose, kosteneffiziente Kommunikation im In- und Ausland genutzt.",
      "ceo.name": "NGWA CLOVIS OCHANG", "ceo.title": "CEO & Gründer · Netzwerkingenieur",
      "ceo.bio": "„Unsere Mission ist es, jedes kamerunische Unternehmen mit Weltklasse-Technologie auszustatten. Von VoIP bis DevOps liefern wir Lösungen, die zählen.“",
      "ceo.contact": "CEO kontaktieren",
      "why.label": "Der WAT-Unterschied", "why.title": "Warum Unternehmen uns wählen",
      "why.1.t": "Cisco & AWS zertifiziert", "why.1.d": "Zertifizierte Netzwerk- und Cloud-Ingenieure, auf die Sie sich verlassen können.",
      "why.2.t": "8+ Jahre Erfahrung", "why.2.d": "Eine bewährte Erfolgsbilanz in Kamerun seit 2016.",
      "why.3.t": "150+ zufriedene Kunden", "why.3.d": "Banken, Schulen und Unternehmen vertrauen uns ihre Infrastruktur an.",
      "why.4.t": "24/7-Support", "why.4.d": "Rund-um-die-Uhr technischer Support, wann immer Sie ihn brauchen.",
      "svc.label": "Was Wir Tun", "svc.title": "Unsere Leistungen", "svc.sub": "End-to-End IT-Lösungen für moderne Unternehmen.", "svc.learn": "Mehr Erfahren",
      "svc1.title": "IT-Beratung", "svc1.desc": "Experten-IT-Beratung, Infrastrukturbewertung, Technologieplanung und strategische Begleitung.",
      "svc2.title": "DevOps-Dienste", "svc2.desc": "Docker, Kubernetes, AWS, CI/CD, Ansible, Terraform, Prometheus, Grafana, ELK und mehr.",
      "svc3.title": "VoIP-Lösungen", "svc3.desc": "Private Telefonanlagen für Banken, Mikrofinanzen und Filialbetriebe — national & international.", "svc3.cta": "VoIP ansehen",
      "svc4.title": "Netzwerk & Sicherheit", "svc4.desc": "Netzwerkinstallation, CCTV, Zutrittskontrolle, Zeiterfassung und Einbruchmeldeanlagen.",
      "svc5.title": "Web & Mobil", "svc5.desc": "Websites, Web- und Mobilanwendungen — Android & iOS, von Landing-Pages bis zu Unternehmensplattformen.",
      "svc6.title": "Starlink-Installation", "svc6.desc": "Lieferung, Konfiguration und Installation von Starlink-Kits — Schüsselmontage, Ausrichtung und Netzwerk für Zuhause, Büros und abgelegene Standorte.",
      "svc7.title": "WLAN-Zone", "svc7.desc": "Professionelle WLAN-Hotspot-Zonen für Hotels, Büros und Campusse — Captive Portal, Bandbreitenverwaltung, VLAN und Gastzugang.",
      "voip.label": "Private Telefonanlagen", "voip.title": "VoIP-Lösungen für Unternehmen", "voip.sub": "Ihr eigenes privates Telefonnetzwerk — national & international.",
      "b1.t": "Ihr Eigenes Privatnetz", "b1.d": "Ein dediziertes, sicheres Telefonsystem, vollständig im Eigentum Ihrer Organisation.",
      "b2.t": "Internationale Reichweite", "b2.d": "Verbinden Sie Filialen in Kamerun und international — Frankreich, Belgien, jedes Land.",
      "b3.t": "Enorme Kostenersparnis", "b3.d": "Senken Sie die Kosten für Filialgespräche um bis zu 70%. Kostenlose interne Anrufe.",
      "b4.t": "Call-Center-Bereit", "b4.d": "Vollständige Ein-/Ausgangs-Call-Center-Funktionen — Warteschlangen, IVR, Aufzeichnung.",
      "b5.t": "24/7-Support", "b5.d": "Rund-um-die-Uhr-Support durch unsere zertifizierten VoIP-Ingenieure.",
      "dev1.desc": "Professionelles IP-Tischtelefon. HD-Sprache, 6 SIP-Konten — ideal für Bankschalter und Filialleiter.",
      "dev2.desc": "Funktionsreiches Softphone für Windows, Mac, Android & iOS. Perfekt für Remote-Agenten und Call-Center.",
      "dev3.desc": "Leichtes Windows-SIP-Softphone. Geringer Ressourcenverbrauch, TLS-Verschlüsselung für sichere Anrufe.",
      "voip.wa": "WhatsApp für ein Angebot",
      "team.label": "Die Menschen", "team.title": "Unser Team", "team.sub": "Professionelle, gut ausgebildete Spezialisten für Ihren Erfolg.", "team.devs": "Entwicklungsteam",
      "role.ceo": "CEO & Gründer", "role.itm": "IT-Manager", "role.dev": "Entwickler",
      "testi.label": "Kundenstimmen", "testi.title": "Was Unsere Kunden Sagen", "testi.rating": "Durchschnittsbewertung", "testi.sat": "Zufriedene Kunden", "testi.track": "Bewährte Erfolgsbilanz",
      "t1.text": "„WAT hat unsere Filialkommunikation völlig verändert. Ihr VoIP-System sparte uns über 40% an Kosten und unsere 12 Filialen sind jetzt nahtlos verbunden. Außergewöhnlicher Service!“",
      "t2.text": "„Die von WAT erstellte DevOps-Pipeline reduzierte unsere Deployment-Zeit von 3 Tagen auf 15 Minuten. Ihre Kubernetes-Expertise ist Weltklasse. Sehr empfehlenswert!“",
      "t3.text": "„Bestes IT-Unternehmen in Kamerun. Netzwerk, CCTV und Zutrittskontrolle in Rekordzeit installiert. Ihr 24/7-Support gibt uns Sicherheit. Ein echter Technologiepartner.“",
      "cta.word": "Außergewöhnliches", "cta.sub": "Von VoIP-Infrastruktur bis DevOps-Pipelines — WAT liefert Unternehmenstechnologie zu Preisen, die für afrikanische Unternehmen sinnvoll sind.", "cta.start": "Projekt Starten", "cta.free": "Kostenlose Beratung",
      "pay.label": "Einfache Zahlungen", "pay.title": "Zahlungsmethoden", "pay.sub": "Flexible Zahlungsoptionen für Ihren Komfort.",
      "pay.mtn": "Zahlung per MTN Mobile Money. Schnell, sicher, sofortige Bestätigung.", "pay.mtn.ref": "Referenz: WAT + Ihr Name",
      "pay.orange": "Zahlung per Orange Money. 24/7 verfügbar, landesweite Abdeckung.", "pay.orange.ref": "Referenz: WAT + Ihr Name",
      "pay.afriland": "Banküberweisung auf unser Afriland First Bank-Konto für Unternehmensverträge.", "pay.afriland.ref": "Kontodetails auf der Rechnung",
      "pay.call": "Anrufen", "pay.email": "E-Mail für Rechnung",
      "career.label": "Werden Sie Teil des Teams", "career.title": "Wir Stellen Ein", "career.sub": "World Advanced Technology wächst — treten Sie unserem leidenschaftlichen Team bei.",
      "j1.title": "Senior DevOps-Ingenieur", "j2.title": "AWS Cloud-Ingenieur", "j3.title": "Netzwerkingenieur (Cisco)", "j4.title": "VoIP-Techniker", "j5.title": "Full-Stack-Entwickler",
      "career.apply": "Bewerben", "job.title": "Auf eine Stelle Bewerben", "job.exp": "Jahre Berufserfahrung", "job.pos": "Position *", "job.cover": "Anschreiben / Nachricht *", "job.apply": "Bewerbung Einreichen",
      "career.email": "Oder senden Sie Ihren Lebenslauf an: worldadvancedtechnology23@gmail.com",
      "contact.label": "Kontakt", "contact.title": "Kontaktieren Sie Uns", "contact.sub": "Wir antworten innerhalb von 2 Stunden — 24/7-Support verfügbar.",
      "f.name": "Vollständiger Name *", "f.email": "E-Mail *", "f.phone": "Telefon", "f.service": "Gewünschter Dienst", "f.subject": "Betreff *", "f.message": "Nachricht *", "f.send": "Nachricht Senden",
      "ci.phone": "Telefon / WhatsApp", "ci.email": "E-Mail", "ci.addr": "Adresse", "ci.hours": "Öffnungszeiten", "ci.weekend": "Sa–So: Geschlossen",
      "foot.tag": "Unternehmens-IT, DevOps und privates VoIP für afrikanische Unternehmen. Ansässig in Yaoundé, im Dienst Kameruns und darüber hinaus seit 2016.",
      "foot.quick": "Schnelllinks", "foot.services": "Leistungen", "foot.contact": "Kontakt", "foot.rights": "Alle Rechte vorbehalten.",
      "det.title": "Was wir liefern", "det.quote": "Angebot per WhatsApp anfordern", "det.contact": "Kontakt",
      "det1": "Audit und Bewertung der IT-Infrastruktur|Technologie-Roadmap und strategische Planung|Cloud-Migrations- und Einführungsstrategie|Anbieterauswahl und Kostenoptimierung|Sicherheits-, Backup- und Compliance-Prüfung",
      "det2": "Design und Automatisierung von CI/CD-Pipelines|Containerisierung mit Docker und Kubernetes|AWS-Cloud-Architektur und IaC (Terraform)|Monitoring und Logging (Prometheus, Grafana, ELK)|Konfigurationsmanagement mit Ansible",
      "det3": "Einrichtung einer privaten IP-PBX (Asterisk)|Konfiguration von Tisch- und Softphones|Multi-Filial- und internationale Nebenstellen|Callcenter, IVR und Anrufaufzeichnung|Wartung und Support rund um die Uhr",
      "det4": "Strukturierte Netzwerkverkabelung und -installation|Lieferung und Installation von CCTV-Kameras|Zutrittskontrolle und Zeiterfassung|Einbruchmeldeanlagen|Firewall und Netzwerkabsicherung",
      "det5": "Individuelle Websites und Landing-Pages|Webanwendungen und Dashboards|Android- und iOS-Apps|E-Commerce und Zahlungsintegration|Wartung, Hosting und SEO",
      "det6": "Lieferung des Starlink-Kits|Schüsselmontage und optimale Ausrichtung|Router- und Netzwerkkonfiguration|Abdeckung für Zuhause, Büros und abgelegene Standorte|Vor-Ort-Tests und Übergabe",
      "det7": "Standortanalyse und Access-Point-Planung|Captive Portal und Gästezugang|Bandbreitenverwaltung und VLANs|Hotspot-Abrechnung / Voucher-System|Abdeckung für Hotels, Büros und Campusse"
    }
  };

  const store = {
    get(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  let current = "en";
  let refreshOpenModal = null; // set up in init; keeps an open service modal in sync on language change
  function t(key) {
    const d = T[current] || T.en;
    return (key in d) ? d[key] : (T.en[key] != null ? T.en[key] : key);
  }

  function applyLang(lang) {
    current = T[lang] ? lang : "en";
    const dict = T[current];
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const val = dict[el.getAttribute("data-i18n")];
      if (val != null) el.textContent = val;
    });
    document.documentElement.setAttribute("lang", current);
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === current);
    });
    store.set("wat-lang", current);
    if (refreshOpenModal) refreshOpenModal();
  }

  /* ---------------- init ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    applyLang(store.get("wat-lang", "en"));

    document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
      btn.addEventListener("click", function () { applyLang(btn.getAttribute("data-lang")); });
    });

    // Theme toggle (dark / light). Initial theme is applied pre-paint in <head>.
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        const next = isLight ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        store.set("wat-theme", next);
      });
    }

    // Mobile menu
    const burger = document.getElementById("hamburger");
    const links = document.getElementById("navLinks");
    if (burger && links) {
      burger.addEventListener("click", function () {
        const open = links.classList.toggle("open");
        burger.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", String(open));
      });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          links.classList.remove("open");
          burger.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }

    // Header shadow + back-to-top visibility
    const header = document.getElementById("header");
    const backTop = document.getElementById("backTop");
    function onScroll() {
      const y = window.scrollY;
      if (header) header.classList.toggle("scrolled", y > 10);
      if (backTop) backTop.classList.toggle("show", y > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (backTop) backTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

    // Reveal on scroll
    const reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }

    // Year
    const yr = document.getElementById("year");
    if (yr) yr.textContent = new Date().getFullYear();

    // Careers "Apply" buttons -> prefill position + scroll to form
    const posSelect = document.getElementById("careerPosition");
    document.querySelectorAll(".job button[data-job]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (posSelect) posSelect.value = btn.getAttribute("data-job");
        const form = document.getElementById("careerForm");
        if (form) form.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    /* ---------- service detail modal ---------- */
    (function () {
      const modal = document.getElementById("svcModal");
      if (!modal) return;
      const icEl = document.getElementById("svcModalIc");
      const titleEl = document.getElementById("svcModalTitle");
      const descEl = document.getElementById("svcModalDesc");
      const actsEl = document.getElementById("svcModalActs");
      const quoteEl = document.getElementById("svcModalQuote");
      const closeEl = document.getElementById("svcClose");
      const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
      let openId = null;

      function render(n) {
        titleEl.textContent = t("svc" + n + ".title");
        descEl.textContent = t("svc" + n + ".desc");
        actsEl.innerHTML = "";
        t("det" + n).split("|").forEach(function (a) {
          const li = document.createElement("li");
          li.innerHTML = check + "<span></span>";
          li.lastChild.textContent = a.trim();
          actsEl.appendChild(li);
        });
        quoteEl.href = "https://wa.me/237651798173?text=" + encodeURIComponent("Hello WAT, I'm interested in " + t("svc" + n + ".title") + ". Please send a quote.");
      }
      function openModal(n, iconHtml) {
        openId = n; icEl.innerHTML = iconHtml || ""; render(n);
        modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
      }
      function closeModal() {
        openId = null; modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
      }
      refreshOpenModal = function () { if (openId) render(openId); };

      document.querySelectorAll(".svc-link[data-svc]").forEach(function (link) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          const card = link.closest(".svc");
          const icWrap = card ? card.querySelector(".svc-ic") : null;
          openModal(link.getAttribute("data-svc"), icWrap ? icWrap.innerHTML : "");
        });
      });
      closeEl.addEventListener("click", closeModal);
      modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
      const contactBtn = document.getElementById("svcModalContact");
      if (contactBtn) contactBtn.addEventListener("click", closeModal);
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
    })();

    /* ---------- cinematic behaviours ---------- */
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scroll progress bar
    const progress = document.getElementById("progress");
    if (progress) {
      const onProg = function () {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        progress.style.width = (max > 0 ? (el.scrollTop / max) * 100 : 0) + "%";
      };
      window.addEventListener("scroll", onProg, { passive: true });
      onProg();
    }

    // Animated counters
    document.querySelectorAll("[data-count]").forEach(function (el) {
      const target = parseInt(el.getAttribute("data-count"), 10) || 0;
      if (prefersReduced) { el.textContent = target; return; }
      const dur = 1500, start = performance.now();
      (function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    });

    // 3D tilt + hero-orbit parallax (fine pointers only)
    const canTilt = !prefersReduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canTilt) {
      document.querySelectorAll(".tilt").forEach(function (card) {
        card.addEventListener("pointerenter", function () { card.style.transition = "transform .06s linear"; });
        card.addEventListener("pointermove", function (e) {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = "perspective(820px) rotateY(" + (px * 7).toFixed(2) + "deg) rotateX(" + (-py * 7).toFixed(2) + "deg) translateY(-5px)";
        });
        card.addEventListener("pointerleave", function () {
          card.style.transition = "transform .5s cubic-bezier(.22,1,.36,1)";
          card.style.transform = "";
        });
      });

      const orbit = document.getElementById("orbit");
      const hero = document.getElementById("hero");
      if (orbit && hero) {
        hero.addEventListener("pointermove", function (e) {
          const r = hero.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          orbit.style.transform = "rotateY(" + (px * 16).toFixed(2) + "deg) rotateX(" + (-py * 16).toFixed(2) + "deg)";
        });
        hero.addEventListener("pointerleave", function () { orbit.style.transform = ""; });
      }
    }

    wireForm("contactForm", "/api/contact", "contactStatus");
    wireForm("careerForm", "/api/careers", "careerStatus");

    initChatbot();
  });

  /* ---------------- forms ---------------- */
  function clearErrors(form) {
    form.querySelectorAll(".err").forEach(function (e) { e.textContent = ""; });
    form.querySelectorAll(".invalid").forEach(function (e) { e.classList.remove("invalid"); });
  }

  function showErrors(form, errors) {
    Object.keys(errors).forEach(function (field) {
      const input = form.querySelector('[name="' + field + '"]');
      if (!input) return;
      input.classList.add("invalid");
      const box = input.closest(".field");
      const err = box ? box.querySelector(".err") : null;
      if (err) err.textContent = errors[field];
    });
  }

  function setStatus(el, ok, msg) {
    if (!el) return;
    el.textContent = msg;
    el.className = "form-status show " + (ok ? "ok" : "bad");
  }

  function wireForm(formId, endpoint, statusId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const status = document.getElementById(statusId);
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      clearErrors(form);
      if (status) status.className = "form-status";

      const data = {};
      new FormData(form).forEach(function (v, k) { data[k] = (typeof v === "string" ? v.trim() : v); });

      const original = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
        .then(function (res) {
          if (res.ok && res.body && res.body.ok) {
            setStatus(status, true, res.body.message || "Sent successfully.");
            form.reset();
          } else {
            const b = res.body || {};
            if (b.errors && Object.keys(b.errors).length) showErrors(form, b.errors);
            setStatus(status, false, b.message || "Please check the form and try again.");
          }
        })
        .catch(function () {
          setStatus(status, false, "Network error. Please reach us on WhatsApp: +237 651 798 173.");
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = original; }
        });
    });
  }

  /* ---------------- Chatbot: instant discussion ----------------
     A self-contained assistant. Conversation is retained in the browser
     (localStorage) ONLY after the visitor taps "Accept" — nothing is sent
     to a server. Bilingual EN/FR; ES/DE fall back to EN.                  */
  function initChatbot() {
    if (document.getElementById("watChatLaunch")) return;

    var WA = "https://wa.me/237651798173";
    var EMAIL = "worldadvancedtechnology23@gmail.com";
    var KEY_HISTORY = "wat-chat-history";
    var KEY_CONSENT = "wat-chat-consent";

    function waLink(text, label) {
      return "<a href='" + WA + "?text=" + encodeURIComponent(text) +
             "' target='_blank' rel='noopener'>" + (label || "WhatsApp") + "</a>";
    }
    function mail() { return "<a href='mailto:" + EMAIL + "'>" + EMAIL + "</a>"; }

    var ICON_BOT  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 8V4M8 3h8M8.5 13v1M15.5 13v1"/></svg>';
    var ICON_OPEN = '<svg class="wc-ico-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    var ICON_CLOSE= '<svg class="wc-ico-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    var ICON_X    = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    var ICON_TRASH= '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
    var ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>';

    var UI = {
      en: { title: "WAT Assistant", status: "Online · replies instantly",
            open: "Open chat", close: "Close chat", clear: "Clear chat",
            placeholder: "Type your message…", send: "Send",
            consent: "To keep this chat when you return, we save it on <b>this device only</b> — nothing is sent to a server. Save our conversation?",
            accept: "Accept", decline: "Not now",
            chips: ["Services", "VoIP", "Pricing", "Careers", "Contact", "Talk to a human"] },
      fr: { title: "Assistant WAT", status: "En ligne · réponse immédiate",
            open: "Ouvrir le chat", close: "Fermer le chat", clear: "Effacer",
            placeholder: "Écrivez votre message…", send: "Envoyer",
            consent: "Pour conserver cette discussion à votre retour, nous l'enregistrons <b>uniquement sur cet appareil</b> — rien n'est envoyé à un serveur. Enregistrer la conversation ?",
            accept: "Accepter", decline: "Plus tard",
            chips: ["Services", "VoIP", "Tarifs", "Carrières", "Contact", "Parler à un humain"] }
    };
    UI.es = UI.en; UI.de = UI.en;
    function lang() { return UI[current] ? current : "en"; }
    function ui() { return UI[lang()]; }

    var KB = {
      en: {
        greeting: "Hi! 👋 I'm the WAT assistant. Ask me about our <b>IT services, VoIP, pricing, careers</b> or how to reach us. What would you like to know?",
        services: "We deliver end-to-end IT solutions:<br>• <b>IT Consultancy</b><br>• <b>DevOps</b> (Docker, Kubernetes, AWS, CI/CD)<br>• <b>VoIP</b> private phone systems<br>• <b>Network &amp; Security</b> (CCTV, access control)<br>• <b>Web &amp; Mobile</b> development<br>• <b>Starlink</b> install &amp; <b>WiFi Zones</b><br>Which one interests you?",
        devops: "Our <b>DevOps</b> team builds and automates your infrastructure: Docker, Kubernetes, AWS, CI/CD pipelines, Ansible, Terraform, plus monitoring with Prometheus, Grafana &amp; ELK. Want a quote? " + waLink("I'd like a DevOps quote"),
        voip: "Our <b>VoIP</b> solutions give you a private telephone network — connect all your branches in Cameroon and abroad, cut inter-branch call costs by up to 70%, with IVR, call queues and recording. " + waLink("I need a VoIP solution"),
        web: "We build <b>websites, web apps and mobile apps</b> (Android &amp; iOS) — from landing pages to enterprise platforms. " + waLink("I need a website / app"),
        network: "<b>Network &amp; Security</b>: structured cabling, CCTV, access control, time-attendance and anti-intrusion alarms — installed and maintained. " + waLink("I need network / security"),
        starlink: "We supply, configure and install <b>Starlink</b> kits — dish mounting, alignment and router setup for homes, offices and remote sites. " + waLink("I'm interested in Starlink"),
        wifi: "We set up professional <b>WiFi Zones</b> for hotels, offices and campuses — captive portal, bandwidth management, VLAN and guest access. " + waLink("I need a WiFi Zone"),
        consultancy: "Our <b>IT Consultancy</b> covers infrastructure assessment, technology planning and strategic guidance tailored to your business. " + waLink("I'd like IT consultancy"),
        pricing: "Pricing depends on your needs, and paying is easy:<br>• <b>MTN MoMo</b>: +237 651 798 173<br>• <b>Orange Money</b>: +237 693 638 404<br>• Invoice by email: " + mail() + "<br>For a tailored quote, " + waLink("I'd like a quote") + ".",
        careers: "We're always looking for talent! Browse open roles in the <a href='#careers'>Careers</a> section and apply right there, or email your CV to " + mail() + ".",
        contact: "Here's how to reach <b>WAT</b>:<br>• 📞 Phone / WhatsApp: <b>+237 651 798 173</b><br>• ✉️ " + mail() + "<br>• 📍 Nkolbisson, L'Caramba, Yaoundé<br>• 🕗 Mon–Fri, 08:00–17:00",
        hours: "We're open <b>Monday to Friday, 08:00–17:00</b> (Yaoundé time). Message us anytime and we'll reply as soon as we're back.",
        location: "We're based in <b>Nkolbisson, L'Caramba, Yaoundé, Cameroon</b>. Want directions or a site visit? " + waLink("I'd like a site visit"),
        human: "Of course — chat with our team directly on WhatsApp: " + waLink("Hello WAT, I'd like to talk to someone") + ", or call <b>+237 651 798 173</b>.",
        thanks: "You're welcome! 😊 Anything else I can help you with?",
        fallback: "I'm not fully sure about that one, but our team can help directly. Reach us on WhatsApp " + waLink("Hello WAT, I have a question") + " or email " + mail() + ". You can also tap a topic below."
      },
      fr: {
        greeting: "Bonjour ! 👋 Je suis l'assistant WAT. Posez-moi vos questions sur nos <b>services IT, la VoIP, les tarifs, les carrières</b> ou comment nous joindre. Que souhaitez-vous savoir ?",
        services: "Nous offrons des solutions IT complètes :<br>• <b>Conseil IT</b><br>• <b>DevOps</b> (Docker, Kubernetes, AWS, CI/CD)<br>• <b>VoIP</b> — téléphonie privée<br>• <b>Réseau &amp; Sécurité</b> (vidéosurveillance, contrôle d'accès)<br>• <b>Web &amp; Mobile</b><br>• <b>Starlink</b> &amp; <b>Zones WiFi</b><br>Lequel vous intéresse ?",
        devops: "Notre équipe <b>DevOps</b> construit et automatise votre infrastructure : Docker, Kubernetes, AWS, pipelines CI/CD, Ansible, Terraform, et supervision Prometheus, Grafana &amp; ELK. Un devis ? " + waLink("Je voudrais un devis DevOps"),
        voip: "Nos solutions <b>VoIP</b> vous offrent un réseau téléphonique privé — reliez toutes vos agences au Cameroun et à l'étranger, réduisez les coûts inter-agences jusqu'à 70 %, avec SVI, files d'attente et enregistrement d'appels. " + waLink("J'ai besoin d'une solution VoIP"),
        web: "Nous créons des <b>sites web, applications web et mobiles</b> (Android &amp; iOS) — de la landing page à la plateforme d'entreprise. " + waLink("J'ai besoin d'un site / d'une app"),
        network: "<b>Réseau &amp; Sécurité</b> : câblage, vidéosurveillance, contrôle d'accès, pointage et alarmes anti-intrusion — installés et maintenus. " + waLink("J'ai besoin de réseau / sécurité"),
        starlink: "Nous fournissons, configurons et installons les kits <b>Starlink</b> — montage de l'antenne, alignement et configuration du routeur pour maisons, bureaux et sites isolés. " + waLink("Je suis intéressé par Starlink"),
        wifi: "Nous installons des <b>Zones WiFi</b> professionnelles pour hôtels, bureaux et campus — portail captif, gestion de bande passante, VLAN et accès invité. " + waLink("J'ai besoin d'une Zone WiFi"),
        consultancy: "Notre <b>Conseil IT</b> couvre l'audit d'infrastructure, la planification technologique et l'accompagnement stratégique adaptés à votre activité. " + waLink("Je voudrais un conseil IT"),
        pricing: "Les tarifs dépendent de vos besoins, et le paiement est simple :<br>• <b>MTN MoMo</b> : +237 651 798 173<br>• <b>Orange Money</b> : +237 693 638 404<br>• Facture par e-mail : " + mail() + "<br>Pour un devis personnalisé, " + waLink("Je voudrais un devis") + ".",
        careers: "Nous recherchons toujours des talents ! Consultez les postes ouverts dans la section <a href='#careers'>Carrières</a> et postulez directement, ou envoyez votre CV à " + mail() + ".",
        contact: "Pour joindre <b>WAT</b> :<br>• 📞 Téléphone / WhatsApp : <b>+237 651 798 173</b><br>• ✉️ " + mail() + "<br>• 📍 Nkolbisson, L'Caramba, Yaoundé<br>• 🕗 Lun–Ven, 08:00–17:00",
        hours: "Nous sommes ouverts du <b>lundi au vendredi, 08:00–17:00</b> (heure de Yaoundé). Écrivez-nous à tout moment, nous répondrons dès notre retour.",
        location: "Nous sommes à <b>Nkolbisson, L'Caramba, Yaoundé, Cameroun</b>. Besoin d'un itinéraire ou d'une visite ? " + waLink("Je voudrais une visite sur site"),
        human: "Bien sûr — discutez avec notre équipe sur WhatsApp : " + waLink("Bonjour WAT, je souhaite parler à quelqu'un") + ", ou appelez le <b>+237 651 798 173</b>.",
        thanks: "Avec plaisir ! 😊 Puis-je vous aider pour autre chose ?",
        fallback: "Je ne suis pas tout à fait sûr pour cela, mais notre équipe peut vous aider directement. Écrivez-nous sur WhatsApp " + waLink("Bonjour WAT, j'ai une question") + " ou par e-mail " + mail() + ". Vous pouvez aussi choisir un sujet ci-dessous."
      }
    };
    function kb(key) {
      var d = KB[lang()] || KB.en;
      return d[key] || KB.en[key] || KB.en.fallback;
    }

    // Keyword → intent (specific first; greeting/thanks use word boundaries)
    var INTENTS = [
      ["voip|voice|t[ée]l[ée]phon|phone system|pbx|\\bsip\\b", "voip"],
      ["devops|docker|kubernet|ci/?cd|\\baws\\b|cloud|terraform|ansible|pipeline", "devops"],
      ["website|site web|web app|\\bweb\\b|mobile|android|\\bios\\b|application|\\bapp\\b", "web"],
      ["network|r[ée]seau|cctv|cam[ée]ra|surveillance|security|s[ée]curit|alarm|access control|contr[ôo]le d'acc", "network"],
      ["starlink|satellite", "starlink"],
      ["wifi|wi-fi|hotspot|hot spot|captif|captive|hotel|h[ôo]tel", "wifi"],
      ["consult|conseil", "consultancy"],
      ["price|pricing|cost|how much|quote|devis|tarif|\\bprix\\b|co[ûu]t|payment|\\bpay\\b|momo|orange money|invoice|facture|combien", "pricing"],
      ["career|\\bjob\\b|hiring|recrut|emploi|\\bcv\\b|vacanc|carri", "careers"],
      ["hour|schedule|horaire|ouvert|open(ing)?", "hours"],
      ["where|location|address|adresse|located|situ|office|bureau|o[ùu] [êe]tes", "location"],
      ["human|agent|\\bperson\\b|someone|parler|humain|real person|staff|\\bteam\\b|[ée]quipe", "human"],
      ["contact|reach|e-?mail|\\bmail\\b|call|appeler|joindre|num[ée]ro|\\bnumber\\b", "contact"],
      ["service|\\boffer\\b|what do you|que faites|prestation", "services"],
      ["\\b(thanks|thank you|thx|merci|great|cool|ok|okay|super|nice|parfait)\\b", "thanks"],
      ["\\b(hi|hey|hello|salut|bonjour|bonsoir|coucou|good morning|good evening)\\b", "greeting"]
    ];
    function detect(text) {
      var s = (text || "").toLowerCase();
      for (var i = 0; i < INTENTS.length; i++) {
        if (new RegExp(INTENTS[i][0]).test(s)) return INTENTS[i][1];
      }
      return "fallback";
    }

    var CHIP_INTENTS = ["services", "voip", "pricing", "careers", "contact", "human"];

    // ---- state ----
    var history = [];
    var consent = store.get(KEY_CONSENT, "") === "yes";
    var greeted = false;

    // ---- build DOM ----
    var launch = document.createElement("button");
    launch.id = "watChatLaunch";
    launch.className = "wc-launch";
    launch.type = "button";
    launch.innerHTML = '<span class="wc-unread">1</span>' + ICON_OPEN + ICON_CLOSE;

    var panel = document.createElement("div");
    panel.id = "watChatPanel";
    panel.className = "wc-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", ui().title);
    panel.innerHTML =
      '<div class="wc-head">' +
        '<div class="wc-ava">' + ICON_BOT + '</div>' +
        '<div><h4 class="wc-title"></h4><div class="wc-status"><span class="wc-status-txt"></span></div></div>' +
        '<div class="wc-head-actions">' +
          '<button type="button" class="wc-clear">' + ICON_TRASH + '</button>' +
          '<button type="button" class="wc-close">' + ICON_X + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="wc-body"></div>' +
      '<div class="wc-chips"></div>' +
      '<div class="wc-input"><input type="text" maxlength="500" autocomplete="off"><button type="button" class="wc-send">' + ICON_SEND + '</button></div>';

    document.body.appendChild(launch);
    document.body.appendChild(panel);

    var body = panel.querySelector(".wc-body");
    var chips = panel.querySelector(".wc-chips");
    var input = panel.querySelector(".wc-input input");

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }
    function persist() { if (consent) store.set(KEY_HISTORY, JSON.stringify(history)); }
    function addMsg(role, html, save) {
      var m = document.createElement("div");
      m.className = "wc-msg " + role;
      m.innerHTML = html;
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
      if (save) { history.push({ role: role, html: html }); persist(); }
    }
    function showTyping() {
      hideTyping();
      var tp = document.createElement("div");
      tp.className = "wc-typing"; tp.id = "wcTyping";
      tp.innerHTML = "<span></span><span></span><span></span>";
      body.appendChild(tp); body.scrollTop = body.scrollHeight;
    }
    function hideTyping() { var tp = document.getElementById("wcTyping"); if (tp) tp.remove(); }

    function renderChips() {
      chips.innerHTML = "";
      ui().chips.forEach(function (label, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.addEventListener("click", function () { sendUser(label, CHIP_INTENTS[i]); });
        chips.appendChild(b);
      });
    }
    function showConsent() {
      if (consent || panel.querySelector(".wc-consent")) return;
      var c = document.createElement("div");
      c.className = "wc-consent";
      c.innerHTML = ui().consent +
        '<div class="wc-consent-acts"><button type="button" class="wc-accept"></button>' +
        '<button type="button" class="wc-decline"></button></div>';
      c.querySelector(".wc-accept").textContent = ui().accept;
      c.querySelector(".wc-decline").textContent = ui().decline;
      c.querySelector(".wc-accept").addEventListener("click", function () {
        consent = true; store.set(KEY_CONSENT, "yes"); persist(); c.remove();
      });
      c.querySelector(".wc-decline").addEventListener("click", function () { c.remove(); });
      panel.insertBefore(c, chips);
    }
    function sendUser(text, forced) {
      text = (text || "").trim();
      if (!text) return;
      addMsg("user", escapeHtml(text), true);
      var intent = forced || detect(text);
      showTyping();
      setTimeout(function () {
        hideTyping();
        addMsg("bot", kb(intent), true);
      }, 480 + Math.random() * 350);
    }
    function greet() {
      if (greeted) return;
      greeted = true;
      addMsg("bot", kb("greeting"), true);
      showConsent();
    }
    function openPanel() {
      panel.classList.add("open");
      launch.classList.add("open");
      launch.classList.remove("has-unread");
      launch.setAttribute("aria-label", ui().close);
      greet();
      setTimeout(function () { input.focus(); }, 300);
    }
    function closePanel() {
      panel.classList.remove("open");
      launch.classList.remove("open");
      launch.setAttribute("aria-label", ui().open);
    }
    function applyChatLang() {
      panel.setAttribute("aria-label", ui().title);
      panel.querySelector(".wc-title").textContent = ui().title;
      panel.querySelector(".wc-status-txt").textContent = ui().status;
      input.placeholder = ui().placeholder;
      panel.querySelector(".wc-clear").setAttribute("aria-label", ui().clear);
      panel.querySelector(".wc-close").setAttribute("aria-label", ui().close);
      panel.querySelector(".wc-send").setAttribute("aria-label", ui().send);
      launch.setAttribute("aria-label", panel.classList.contains("open") ? ui().close : ui().open);
      renderChips();
      var c = panel.querySelector(".wc-consent");
      if (c) { c.remove(); showConsent(); }
    }

    // ---- restore retained conversation ----
    if (consent) {
      try {
        var saved = JSON.parse(store.get(KEY_HISTORY, "[]"));
        if (Array.isArray(saved)) history = saved;
      } catch (e) { history = []; }
      history.forEach(function (m) { addMsg(m.role, m.html, false); });
      greeted = history.length > 0;
    }
    if (!greeted) launch.classList.add("has-unread");

    applyChatLang();

    // ---- events ----
    launch.addEventListener("click", function () {
      if (panel.classList.contains("open")) closePanel(); else openPanel();
    });
    panel.querySelector(".wc-close").addEventListener("click", closePanel);
    panel.querySelector(".wc-send").addEventListener("click", function () {
      sendUser(input.value); input.value = "";
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); sendUser(input.value); input.value = ""; }
    });
    panel.querySelector(".wc-clear").addEventListener("click", function () {
      history = []; store.set(KEY_HISTORY, "[]");
      body.innerHTML = ""; greeted = false;
      var c = panel.querySelector(".wc-consent"); if (c) c.remove();
      greet();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
    });
    // keep chatbot labels in sync when the site language changes
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.addEventListener("click", function () { setTimeout(applyChatLang, 0); });
    });
  }
})();
