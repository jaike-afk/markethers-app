export interface Testimonial {
  name: string;
  role: string;
  business: string;
  avatar: string;
  quote: string;
  metric: string;
  stars: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface Translations {
  nav: {
    brandSubtitle: string;
    demoStores: string;
    demoStoresTitle: string;
    appPortal: string;
    cashierScanner: string;
    merchantPanel: string;
    tryCustomerCard: string;
    langSelect: string;
    pricingNav: string;
  };
  hero: {
    badge: string;
    headlinePart1: string;
    headlineHighlight: string;
    headlinePart2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaScanner: string;
    check1: string;
    check2: string;
    check3: string;
    simTitle: string;
    simSubtitle: string;
    simButton: string;
    simRewardUnlocked: string;
  };
  statsBar: {
    activeBusinesses: string;
    activeBusinessesLabel: string;
    rating: string;
    ratingLabel: string;
    walletsCreated: string;
    walletsCreatedLabel: string;
    zeroCommission: string;
    zeroCommissionLabel: string;
  };
  menuSpotlight: {
    tag: string;
    headline: string;
    headlineHighlight: string;
    description: string;
    tabUpload: string;
    tabPlatform: string;
    uploadTitle: string;
    uploadSubtitle: string;
    uploadStep1Title: string;
    uploadStep1Desc: string;
    uploadStep2Title: string;
    uploadStep2Desc: string;
    uploadStep3Title: string;
    uploadStep3Desc: string;
    uploadSimDrag: string;
    uploadSimOr: string;
    uploadSimButton: string;
    uploadSimSuccessTitle: string;
    uploadSimSuccessMsg: string;
    platformTitle: string;
    platformSubtitle: string;
    platformStep1Title: string;
    platformStep1Desc: string;
    platformStep2Title: string;
    platformStep2Desc: string;
    platformStep3Title: string;
    platformStep3Desc: string;
    platformSimDemoCategory: string;
    platformSimAvailable: string;
    platformSimSoldOut: string;
    platformSimPriceUpdated: string;
    whatsappBadge: string;
    whatsappTitle: string;
    whatsappDesc: string;
    whatsappButton: string;
  };
  infoLink: {
    tag: string;
    headline: string;
    headlineHighlight: string;
    subtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
    previewTitle: string;
    previewBioDesc: string;
  };
  pillars: {
    tag: string;
    headline: string;
    subtitle: string;
    pillar1Tag: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar1Item1Title: string;
    pillar1Item1Desc: string;
    pillar1Item2Title: string;
    pillar1Item2Desc: string;
    pillar1Item3Title: string;
    pillar1Item3Desc: string;

    pillar2Tag: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar2Item1Title: string;
    pillar2Item1Desc: string;
    pillar2Item2Title: string;
    pillar2Item2Desc: string;
    pillar2Item3Title: string;
    pillar2Item3Desc: string;
    pillar2TryScanner: string;

    pillar3Tag: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar3Item1Title: string;
    pillar3Item1Desc: string;
    pillar3Item2Title: string;
    pillar3Item2Desc: string;
    pillar3Item3Title: string;
    pillar3Item3Desc: string;
  };
  googleReviews: {
    tag: string;
    headline: string;
    headlineHighlight: string;
    subtitle: string;
    simTitle: string;
    simSubtitle: string;
    filterHighTitle: string;
    filterHighDesc: string;
    filterLowTitle: string;
    filterLowDesc: string;
    benefitTitle: string;
    benefitDesc: string;
  };
  problem: {
    tag: string;
    headline: string;
    subtitle: string;
    cardboardTitle: string;
    cardboardDesc: string;
    cardboardFooter: string;
    appTitle: string;
    appDesc: string;
    appFooter: string;
    solutionTitle: string;
    solutionDesc: string;
    solutionFooter: string;
  };
  comparison: {
    tag: string;
    headline: string;
    colFeature: string;
    colPaper: string;
    colApp: string;
    colMarkethers: string;
    row1Title: string;
    row1Paper: string;
    row1App: string;
    row1Markethers: string;
    row2Title: string;
    row2Paper: string;
    row2App: string;
    row2Markethers: string;
    row3Title: string;
    row3Paper: string;
    row3App: string;
    row3Markethers: string;
    row4Title: string;
    row4Paper: string;
    row4App: string;
    row4Markethers: string;
    row5Title: string;
    row5Paper: string;
    row5App: string;
    row5Markethers: string;
    row6Title: string;
    row6Paper: string;
    row6App: string;
    row6Markethers: string;
  };
  testimonials: {
    tag: string;
    headline: string;
    headlineHighlight: string;
    subtitle: string;
    items: Testimonial[];
  };
  pricing: {
    tag: string;
    headline: string;
    headlineHighlight: string;
    subtitle: string;
    monthly: string;
    annual: string;
    annualDiscount: string;
    billedAnnually: string;
    billedMonthly: string;
    guaranteeTitle: string;
    guaranteeDesc: string;
    trust1: string;
    trust2: string;
    trust3: string;
    plans: PricingPlan[];
  };
  roi: {
    tag: string;
    headline: string;
    subtitle: string;
    sliderClients: string;
    sliderTicket: string;
    baseCalculo: string;
    monthlyEst: string;
    avgLift: string;
    extraRevenueBadge: string;
    extraVisitsNotice: string;
    ctaButton: string;
  };
  industries: {
    tag: string;
    headline: string;
    tabCafe: string;
    tabBarber: string;
    tabRestaurant: string;
    recommendedMechanic: string;
  };
  faq: {
    tag: string;
    headline: string;
    items: Array<{ q: string; a: string }>;
  };
  cta: {
    tag: string;
    headline: string;
    subtitle: string;
    btnPanel: string;
    btnDemo: string;
  };
  footer: {
    rights: string;
    slogan: string;
  };
}

export const translations: Record<'es' | 'en', Translations> = {
  es: {
    nav: {
      brandSubtitle: 'Plataforma de Lealtad & Menú Digital',
      demoStores: 'Ver Negocios Demo',
      demoStoresTitle: 'Tiendas de Demostración',
      appPortal: 'Markethers OS (/app)',
      cashierScanner: 'Escáner de Cajero (PWA)',
      merchantPanel: 'Panel de Menú',
      tryCustomerCard: 'Probar Tarjeta Cliente',
      langSelect: 'Idioma',
      pricingNav: 'Planes & Precios',
    },
    hero: {
      badge: 'El Sistema Operativo y Club de Clientes para Negocios Locales',
      headlinePart1: 'Fidelización en',
      headlineHighlight: 'Apple Wallet & Google Wallet',
      headlinePart2: '+ Menú Digital sin apps que descargar.',
      subtitle:
        'Vende directo por WhatsApp, llena tus mesas con tarjetas de sellos en el celular de tus clientes y multiplica tus reseñas de 5 estrellas en Google Maps. Todo en un solo lugar y listo en 2 minutos.',
      ctaPrimary: 'Explorar Panel (/app)',
      ctaSecondary: 'Probar como Cliente (Demo)',
      ctaScanner: 'Escáner de Cajero',
      check1: 'Sin apps para el cliente (100% nativo)',
      check2: 'Sube tu PDF o crea en 2 minutos',
      check3: '0% comisiones por tus pedidos',
      simTitle: 'Simulador interactivo en tiempo real',
      simSubtitle: 'Haz clic para simular cómo un cliente suma sellos en tu cafetería o negocio:',
      simButton: 'Simular compra (+1 Sello)',
      simRewardUnlocked: '¡Premio desbloqueado! 🎉',
    },
    statsBar: {
      activeBusinesses: '+180',
      activeBusinessesLabel: 'Negocios Locales Activos',
      rating: '4.9 / 5.0 ⭐',
      ratingLabel: 'Satisfacción Comprobada',
      walletsCreated: '+125,000',
      walletsCreatedLabel: 'Pases Guardados en Wallets',
      zeroCommission: '0%',
      zeroCommissionLabel: 'Comisión en Tus Pedidos',
    },
    menuSpotlight: {
      tag: '⭐ Estrella del Producto: Menú Digital',
      headline: 'Tu Menú Digital Listo en Minutos:',
      headlineHighlight: 'Tú Eliges Cómo Tenerlo',
      description:
        'Diseñado para ser sumamente fácil y amigable. Si ya tienes tu menú en PDF, foto o papel, súbelo directamente. Si prefieres crearlo desde cero, nuestro editor visual te toma menos de 2 minutos e incluye fotos y videos.',
      tabUpload: '📄 Opción 1: Subir mi Menú Existente',
      tabPlatform: '⚡ Opción 2: Crearlo en la Plataforma',
      uploadTitle: '¿Ya tienes tu carta impresa o en PDF? Solo súbela.',
      uploadSubtitle:
        'Cero trabajo manual para ti. Sube tu archivo y Markethers lo digitaliza al instante.',
      uploadStep1Title: '1. Sube tu PDF, Foto o Enlace',
      uploadStep1Desc: 'Toma una foto con tu teléfono a tu carta física, menú en pizarra o arrastra tu PDF.',
      uploadStep2Title: '2. Digitalización Inteligente',
      uploadStep2Desc: 'Nuestra tecnología extrae platillos, descripciones, categorías y precios de forma limpia.',
      uploadStep3Title: '3. QR para tus Mesas al Segundo',
      uploadStep3Desc: 'Tus clientes escanean el código en la mesa y navegan tu carta interactiva con fotos claras.',
      uploadSimDrag: 'Arrastra aquí tu carta (PDF, JPG, PNG) o haz clic para seleccionar',
      uploadSimOr: 'o prueba con un archivo de muestra:',
      uploadSimButton: 'Subir archivo de muestra (Carta_Restaurante.pdf)',
      uploadSimSuccessTitle: '¡Menú Digitalizado con Éxito! ✨',
      uploadSimSuccessMsg: 'Detectamos 16 productos en 4 categorías (Cafés, Desayunos, Postres, Bebidas). ¡Ya está activo en tus códigos QR!',
      platformTitle: 'Editor Visual Súper Fácil e Intuitivo',
      platformSubtitle:
        'Crea tu catálogo producto por producto sin conocimientos técnicos. Sube fotos y videos de cada plato.',
      platformStep1Title: '1. Agrega Categorías & Platillos',
      platformStep1Desc: 'Organiza por Entradas, Platos Fuertes, Bebidas y Especialidades con fotos y videos.',
      platformStep2Title: '2. Control de Stock en 1 Clic',
      platformStep2Desc: '¿Se terminó un ingrediente? Apágalo en tiempo real sin tener que tachar cartas de papel.',
      platformStep3Title: '3. Cambios en Vivo en Todas las Mesas',
      platformStep3Desc: 'Cualquier cambio de precio o platillo nuevo se refleja al instante para todos tus comensales.',
      platformSimDemoCategory: 'Categoría: Cafés de Especialidad',
      platformSimAvailable: 'Disponible',
      platformSimSoldOut: 'Agotado',
      platformSimPriceUpdated: '¡Precio y disponibilidad actualizados en vivo!',
      whatsappBadge: 'Pedidos Directos a tu WhatsApp',
      whatsappTitle: 'Tus clientes ordenan desde su celular directo a tu cocina',
      whatsappDesc:
        'Sin pagar comisiones del 30% a aplicaciones de terceros. El cliente arma su carrito en el menú digital y te envía un WhatsApp con la orden perfectamente desglosada y el total sumado.',
      whatsappButton: 'Ver Demo de Pedido WhatsApp',
    },
    infoLink: {
      tag: 'Ecosistema Todo en Uno',
      headline: 'Un Solo Enlace Inteligente para',
      headlineHighlight: 'Instagram, WhatsApp y tus Mesas',
      subtitle:
        'Reemplaza los enlaces genéricos de Linktree. Markethers te da una página ultra rápida que convierte seguidores de redes en comensales presenciales y pedidos directos.',
      feature1Title: 'Carta Digital con Fotos & Videos:',
      feature1Desc: 'Tus clientes hojean tu menú interactivo o tu PDF oficial desde su teléfono.',
      feature2Title: 'Pase de Lealtad en 1 Toque:',
      feature2Desc: 'Guardan su tarjeta en Apple Wallet o Google Wallet al instante sin formularios largos.',
      feature3Title: 'Filtro de Reseñas 5 Estrellas:',
      feature3Desc: 'Canaliza comensales felices directo a tu ficha de Google Maps para subir en el ranking.',
      feature4Title: 'Chat y Pedidos sin Comisiones:',
      feature4Desc: 'Envía pedidos armados directo a tu WhatsApp con el 100% de la ganancia para tu caja.',
      previewTitle: 'Así ve el cliente tu InfoLink:',
      previewBioDesc: 'Tu link exclusivo: markethers.com/tu-negocio',
    },
    pillars: {
      tag: 'Los 3 Pilares Markethers',
      headline: 'Todo lo que tu negocio necesita en una sola plataforma',
      subtitle: 'Tres herramientas diseñadas para llenar tus mesas y aumentar la lealtad de tus clientes.',
      pillar1Tag: 'Pilar 1: Fidelización',
      pillar1Title: 'Tarjetas de Sellos en Apple Wallet & Google Wallet',
      pillar1Desc:
        'Tus clientes guardan su tarjeta con 1 toque en su iPhone o Android. Sin descargar apps ni llenar formularios tediosos. Acumulan sellos y reciben notificaciones en pantalla de bloqueo cuando están cerca de tu negocio.',
      pillar1Item1Title: 'Notificaciones Push Georreferenciadas:',
      pillar1Item1Desc: 'La tarjeta avisa al cliente cuando pasa caminando cerca de tu local comercial.',
      pillar1Item2Title: 'Totalmente Personalizable:',
      pillar1Item2Desc: 'Logotipo de tu marca, colores corporativos, ícono personalizado e incentivo de regalo.',
      pillar1Item3Title: 'Seguridad Antifraude:',
      pillar1Item3Desc: 'Códigos QR criptográficos únicos verificados por tu terminal de cajero.',

      pillar2Tag: 'Pilar 2: Escáner PWA',
      pillar2Title: 'Escáner de Cajero sin Hardware Costoso',
      pillar2Desc:
        'Tu personal de caja o meseros usan cualquier teléfono o tablet. Abren el enlace del escáner, ingresan su PIN y otorgan sellos en 2 segundos con confirmación sonora.',
      pillar2Item1Title: 'Operación en 2 Segundos:',
      pillar2Item1Desc: 'Apunta la cámara al teléfono del cliente y presiona "+1 Sello".',
      pillar2Item2Title: 'Alerta Sonora & Confeti:',
      pillar2Item2Desc: 'Celebra en pantalla cuando el cliente completa la tarjeta para canjear su premio.',
      pillar2Item3Title: 'Auditoría por Empleado:',
      pillar2Item3Desc: 'Cada sello queda registrado con fecha, hora y cajero responsable.',
      pillar2TryScanner: 'Probar Escáner en Vivo',

      pillar3Tag: 'Pilar 3: Menú Digital',
      pillar3Title: 'Menú Interactivo con Catálogo y Pedidos',
      pillar3Desc:
        'Tus clientes consultan tu menú escaneando el código QR en mesa o desde el enlace en tu biografía de Instagram.',
      pillar3Item1Title: '0% Comisiones de Delivery:',
      pillar3Item1Desc: 'Todos los pedidos van directo a tu WhatsApp con el dinero 100% para tu negocio.',
      pillar3Item2Title: 'Flexibilidad Total:',
      pillar3Item2Desc: 'Sube tu PDF existente o constrúyelo en minutos en nuestra plataforma.',
      pillar3Item3Title: 'Siempre Actualizado:',
      pillar3Item3Desc: 'Olvida volver a gastar en reimpresiones por cambiar un precio.',
    },
    googleReviews: {
      tag: 'Pilar 4: Reputación Digital',
      headline: 'Filtro Inteligente de Reseñas en',
      headlineHighlight: 'Google Maps 5 Estrellas',
      subtitle:
        'Multiplica tus calificaciones de 5 estrellas en Google y protege tu negocio de comentarios negativos antes de que se hagan públicos.',
      simTitle: 'Prueba cómo funciona el Filtro Inteligente:',
      simSubtitle: 'Selecciona cuántas estrellas le darías a la experiencia:',
      filterHighTitle: 'Si califica 4 o 5 estrellas: Google Maps Directo',
      filterHighDesc:
        'El cliente es redirigido en 1 clic a tu ficha oficial de Google Maps para que su recomendación suba tu puntuación pública y te traiga nuevos clientes de tu zona.',
      filterLowTitle: 'Si califica 1 a 3 estrellas: Feedback Privado a WhatsApp',
      filterLowDesc:
        'Se abre un formulario privado que te llega directo a tu WhatsApp personal. Puedes resolver la inconformidad al instante sin dañar tu reputación en Google.',
      benefitTitle: 'Tu negocio siempre en el Top 3 de tu ciudad',
      benefitDesc: 'Los comercios con más de 4.7 estrellas en Google Maps reciben hasta 3 veces más llamadas y visitas de comensales que buscan en la zona.',
    },
    problem: {
      tag: 'La Realidad de los Comercios',
      headline: '¿Por qué las soluciones tradicionales ya no funcionan?',
      subtitle: 'El 80% de los clientes no vuelve no porque no le gustó tu comida o servicio, sino porque se olvidó de ti.',
      cardboardTitle: 'Tarjetas de Cartón',
      cardboardDesc:
        'El 72% de los clientes las pierde o las deja en otro pantalón. No te dejan su WhatsApp ni su nombre. Y cuando se terminan tienes que volver a pagar imprenta.',
      cardboardFooter: 'Cero datos • Se pierden siempre • Costo recurrente',
      appTitle: 'Crear tu Propia App',
      appDesc:
        'Cuesta miles de dólares programarla y mantenerla en las tiendas. Los clientes en caja se niegan a esperar que descargue 80MB con el internet del local.',
      appFooter: 'Costo prohibitivo • 85% de rechazo en fila',
      solutionTitle: 'Markethers: Apple & Google Wallet',
      solutionDesc:
        'La tarjeta vive en la app nativa de Wallet que ya viene en el celular de tu cliente. Cero descargas, se activa en 5 segundos y envía notificaciones.',
      solutionFooter: 'Adopción inmediata • 100% de retención • Fácil y amigable',
    },
    comparison: {
      tag: 'Comparativa Transparente',
      headline: '¿Cómo se compara Markethers frente a otras opciones?',
      colFeature: 'Característica',
      colPaper: 'Tarjetas de Papel',
      colApp: 'App Móvil Dedicada',
      colMarkethers: 'Markethers OS',
      row1Title: 'Descargas requeridas al cliente',
      row1Paper: 'No aplica',
      row1App: 'Obligatoria (App Store 80MB)',
      row1Markethers: '0 Descargas (Apple/Google Wallet nativo)',
      row2Title: 'Tasa de adopción en caja',
      row2Paper: 'Baja (se pierden)',
      row2App: 'Menos del 15%',
      row2Markethers: '+85% de los clientes en fila',
      row3Title: 'Menú digital amigable',
      row3Paper: 'Papel manchado/roto',
      row3App: 'Pesado de cargar',
      row3Markethers: 'Sube tu PDF o crea en 2 min con QR en mesa',
      row4Title: 'Filtro inteligente Google Reviews',
      row4Paper: 'Inexistente',
      row4App: 'Rara vez incluido',
      row4Markethers: 'Filtro 5⭐ a Maps y feedback privado',
      row5Title: 'Captura de WhatsApp / CRM',
      row5Paper: 'Imposible',
      row5App: 'Sí pero con fricción',
      row5Markethers: 'Automática desde el primer escaneo',
      row6Title: 'Costo de implementación',
      row6Paper: 'Gasto continuo de imprenta',
      row6App: '$3,000 - $8,000 USD',
      row6Markethers: 'Accesible, listo hoy mismo',
    },
    testimonials: {
      tag: 'Casos Reales de Éxito',
      headline: 'Negocios que dejaron atrás el cartón y',
      headlineHighlight: 'multiplicaron sus visitas',
      subtitle: 'Conoce cómo comercios locales como el tuyo aumentan su facturación y ahorran miles en comisiones.',
      items: [
        {
          name: 'Mariana López',
          role: 'Fundadora',
          business: 'Bruma Café de Especialidad',
          avatar: '☕',
          quote:
            'Nuestros clientes quedaron fascinados al ver su tarjeta en Apple Wallet. En el primer mes logramos +38% de visitas recurrentes y dejamos de gastar en imprimir tarjetas de cartón que siempre terminaban en la basura.',
          metric: '+38% en visitas recurrentes',
          stars: 5,
        },
        {
          name: 'Carlos Restrepo',
          role: 'Chef & Propietario',
          business: 'Craft Burger Lab',
          avatar: '🍔',
          quote:
            'El menú con pedidos directos a WhatsApp nos cambió la vida. Ahorramos más de $1,200 USD al mes que antes se llevaban las aplicaciones de delivery en comisiones. El dinero entra directo a nuestra cuenta.',
          metric: '$1,200 USD/mes ahorrados en comisiones',
          stars: 5,
        },
        {
          name: 'Javier Morales',
          role: 'Master Barber',
          business: 'El Galán Barber Studio',
          avatar: '💈',
          quote:
            'El filtro de Google Reviews es una genialidad. Pasamos de 4.2 a 4.9 estrellas con más de 280 calificaciones reales. Ahora somos la barbería número 1 que recomienda Google Maps en nuestra ciudad.',
          metric: '4.9⭐ #1 en Google Maps local',
          stars: 5,
        },
      ],
    },
    pricing: {
      tag: 'Inversión Clara & Sin Comisiones',
      headline: 'Planes Transparentes que se pagan solos',
      headlineHighlight: 'desde el primer fin de semana',
      subtitle:
        'Cero comisiones por venta. Todo lo que generas es 100% para tu negocio. Elige el plan perfecto para tu local.',
      monthly: 'Pago Mensual',
      annual: 'Pago Anual',
      annualDiscount: 'Ahorra 35%',
      billedAnnually: 'facturado anualmente',
      billedMonthly: 'facturado mes a mes',
      guaranteeTitle: '🛡️ Garantía Blindada de Satisfacción por 14 Días',
      guaranteeDesc:
        'Prueba Markethers en tu negocio. Si no ves más clientes regresando o no te encanta la experiencia, te devolvemos el 100% de tu dinero sin preguntas ni condiciones ocultas.',
      trust1: 'Sin contratos forzosos',
      trust2: 'Cancela en cualquier momento con 1 clic',
      trust3: 'Soporte humano por WhatsApp',
      plans: [
        {
          id: 'starter',
          name: 'Plan Despegue',
          description: 'Perfecto para negocios que quieren eliminar el cartón y tener su menú digital listo.',
          monthlyPrice: 29,
          annualPrice: 19,
          features: [
            'Hasta 400 clientes activos en Wallet',
            'Menú Digital (Sube PDF o crea en sistema)',
            'Tarjetas Apple Wallet & Google Wallet',
            'Escáner Web PWA para 2 cajeros',
            'Pedidos directos por WhatsApp (0% comisiones)',
            'Código QR para mostrador y mesas',
            'Soporte por email y WhatsApp',
          ],
          cta: 'Comenzar con Despegue',
        },
        {
          id: 'pro',
          name: 'Plan Pro Markethers',
          badge: '🔥 El Más Elegido (92% de negocios)',
          popular: true,
          description: 'Para comercios que quieren dominar su zona, llenar mesas y blindar su reputación.',
          monthlyPrice: 49,
          annualPrice: 32,
          features: [
            'Clientes y Tarjetas Wallet ILIMITADAS',
            'Menú Digital con Fotos Y VIDEOS de platillos',
            'Sube tu carta en PDF con visor de alta definición',
            'Filtro Inteligente de Reseñas Google 5⭐',
            'Notificaciones Push Georreferenciadas (cercanía)',
            'Escáneres de cajero ilimitados con PIN',
            'InfoLink centralizado para bio de Instagram',
            'CRM con segmentación de clientes VIP y en riesgo',
            'Soporte prioritario 24/7 por WhatsApp',
          ],
          cta: 'Comenzar Prueba Pro Gratis',
        },
        {
          id: 'franchise',
          name: 'Plan Multi-Sucursal',
          description: 'Para marcas con varias sucursales o cadenas que buscan un control centralizado.',
          monthlyPrice: 99,
          annualPrice: 65,
          features: [
            'Todo lo incluido en el Plan Pro',
            'Hasta 5 sucursales administradas en un solo panel',
            'Dominio propio personalizado (tu-marca.com)',
            'Métricas comparativas entre sucursales',
            'Auditoría y reportes avanzados de cajeros',
            'Capacitación personalizada por videollamada para tu equipo',
            'Gerente de cuenta dedicado',
          ],
          cta: 'Hablar con Especialista',
        },
      ],
    },
    roi: {
      tag: 'Calculadora de Retorno de Inversión',
      headline: '¿Cuánto dinero extra puede generar tu negocio?',
      subtitle: 'Ajusta los controles según los números de tu comercio y mira el impacto proyectado en tus ventas mensuales.',
      sliderClients: 'Clientes atendidos por día:',
      sliderTicket: 'Ticket promedio por consumo:',
      baseCalculo: 'Base de cálculo estimada:',
      monthlyEst: 'Ventas mensuales estimadas:',
      avgLift: 'Aumento de frecuencia comprobado con Wallet:',
      extraRevenueBadge: 'Ingreso Extra Estimado al Mes',
      extraVisitsNotice: 'Generado por visitas recurrentes adicionales de clientes leales que prefieren tu marca.',
      ctaButton: 'Comenzar a Fidelizar Hoy',
    },
    industries: {
      tag: 'Adaptable a tu Industria',
      headline: 'Diseñado especialmente para el comercio local',
      tabCafe: 'Cafeterías & Reposterías',
      tabBarber: 'Barberías & Salones',
      tabRestaurant: 'Restaurantes, Pizzerías & Bares',
      recommendedMechanic: 'Mecánica recomendada:',
    },
    faq: {
      tag: 'Preguntas Frecuentes',
      headline: 'Resolvemos tus dudas en segundos',
      items: [
        {
          q: '¿Cómo funciona la facilidad de subir mi menú?',
          a: 'Es extremadamente sencillo: si ya tienes tu menú diseñado en PDF, una foto de tu carta o una imagen clara, puedes subirlo con un solo clic. Nuestra plataforma lo interpreta de inmediato y genera tus códigos QR para colocar en mesas o barra. Si prefieres crearlo aquí, nuestro editor paso a paso te permite agregar platillos, fotos, videos y precios en menos de 2 minutos.',
        },
        {
          q: '¿Mis clientes necesitan instalar alguna aplicación para su tarjeta de sellos?',
          a: 'No. Ese es el superpoder de Markethers. Las tarjetas se añaden de forma 100% nativa a Apple Wallet en iPhone y a Google Wallet en Android. Son las mismas aplicaciones oficiales donde tus clientes ya guardan sus tarjetas de crédito o pases de abordar.',
        },
        {
          q: '¿Qué pasa si un cliente califica con pocas estrellas en el filtro de Google?',
          a: 'Nuestro Filtro Inteligente protege la reputación de tu negocio. Si un cliente da 4 o 5 estrellas, se le invita a publicarlo en Google Maps para subir tu ranking. Si da 1, 2 o 3 estrellas, se abre una ventana de feedback privado que te llega directo a tu WhatsApp para que puedas compensarlo y resolver el problema en privado sin dañar tu puntuación pública.',
        },
        {
          q: '¿Cobran alguna comisión por los pedidos que recibo en mi menú?',
          a: '0% comisiones. A diferencia de las apps de entrega que cobran entre el 20% y el 35% de cada platillo, con Markethers el cliente hace su pedido y te llega directo a tu WhatsApp. El 100% del dinero es para tu negocio.',
        },
        {
          q: '¿Cómo atienden mis meseros o cajeros los sellos de lealtad?',
          a: 'Cero aparatos especiales. Tu personal abre la web del escáner en cualquier teléfono celular o tablet con cámara, introduce un PIN seguro de 4 dígitos y al enfocar la pantalla del cliente suma el sello en 2 segundos con sonido de confirmación.',
        },
        {
          q: '¿Puedo cancelar mi plan si no estoy satisfecho?',
          a: 'Sí, en cualquier momento con un solo clic desde tu panel y sin penalizaciones. Además, cuentas con nuestra Garantía de 14 Días para probarlo sin ningún riesgo.',
        },
      ],
    },
    cta: {
      tag: 'Comienza en Minutos',
      headline: 'Convierte comensales de una sola vez en clientes frecuentes de por vida',
      subtitle: 'Únete a los más de 180 restaurantes, cafeterías y salones que están modernizando su negocio con Markethers.',
      btnPanel: 'Abrir Panel de Control (/app)',
      btnDemo: 'Ver Negocio de Demostración',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      slogan: 'El Sistema Operativo de Fidelización, Menú Digital & Reseñas de Google para Negocios Locales.',
    },
  },
  en: {
    nav: {
      brandSubtitle: 'Loyalty & Digital Menu Platform',
      demoStores: 'Explore Demo Businesses',
      demoStoresTitle: 'Live Demo Stores',
      appPortal: 'Markethers OS (/app)',
      cashierScanner: 'Cashier Scanner (PWA)',
      merchantPanel: 'Menu Manager',
      tryCustomerCard: 'Try Customer Card',
      langSelect: 'Language',
      pricingNav: 'Plans & Pricing',
    },
    hero: {
      badge: 'The Operating System and Loyalty Club for Local Businesses',
      headlinePart1: 'Customer Loyalty in',
      headlineHighlight: 'Apple Wallet & Google Wallet',
      headlinePart2: '+ Digital Menu with zero apps to install.',
      subtitle:
        'Sell directly via WhatsApp, fill your tables with digital stamp cards living inside your customers’ smartphones, and boost your 5-star Google Maps reviews. All in one place and ready in 2 minutes.',
      ctaPrimary: 'Explore Dashboard (/app)',
      ctaSecondary: 'Try as Customer (Demo)',
      ctaScanner: 'Cashier Scanner',
      check1: 'No apps for customers (100% native)',
      check2: 'Upload your PDF or build in 2 min',
      check3: '0% sales commissions on your orders',
      simTitle: 'Real-time Interactive Simulator',
      simSubtitle: 'Click to simulate how a customer collects stamps at your shop:',
      simButton: 'Simulate purchase (+1 Stamp)',
      simRewardUnlocked: 'Reward Unlocked! 🎉',
    },
    statsBar: {
      activeBusinesses: '+180',
      activeBusinessesLabel: 'Active Local Businesses',
      rating: '4.9 / 5.0 ⭐',
      ratingLabel: 'Verified Customer Rating',
      walletsCreated: '+125,000',
      walletsCreatedLabel: 'Wallet Passes Installed',
      zeroCommission: '0%',
      zeroCommissionLabel: 'Sales Commission Fees',
    },
    menuSpotlight: {
      tag: '⭐ Star Feature: Digital Menu',
      headline: 'Your Digital Menu Ready in Minutes:',
      headlineHighlight: 'Your Way, Zero Hassle',
      description:
        'Designed to be exceptionally friendly and easy. If you already have your menu in PDF, photo, or paper, upload it directly. If you prefer to build it from scratch, our visual editor takes less than 2 minutes and supports food photos and videos.',
      tabUpload: '📄 Option 1: Upload Existing Menu',
      tabPlatform: '⚡ Option 2: Build in Platform',
      uploadTitle: 'Already have a printed menu or PDF? Just upload it.',
      uploadSubtitle:
        'Zero tedious typing for you. Upload your file and Markethers instantly converts it into a digital catalog.',
      uploadStep1Title: '1. Upload PDF, Photo, or Link',
      uploadStep1Desc: 'Take a quick smartphone snapshot of your paper menu, chalkboard, or drag your PDF file.',
      uploadStep2Title: '2. Smart Instant Digitization',
      uploadStep2Desc: 'Our smart reader extracts dishes, prices, descriptions, and categories cleanly.',
      uploadStep3Title: '3. Instant QR Codes for Tables',
      uploadStep3Desc: 'Guests scan the table QR code and browse your mouthwatering interactive menu with photos.',
      uploadSimDrag: 'Drag and drop your menu here (PDF, JPG, PNG) or click to browse',
      uploadSimOr: 'or test with our sample menu file:',
      uploadSimButton: 'Upload sample menu file (Restaurant_Menu.pdf)',
      uploadSimSuccessTitle: 'Menu Digitized Successfully! ✨',
      uploadSimSuccessMsg: 'Extracted 16 items across 4 categories (Coffee, Breakfast, Desserts, Drinks). Live on your table QR codes right now!',
      platformTitle: 'Super Friendly Visual Menu Builder',
      platformSubtitle:
        'Create and customize your menu item by item without any technical skills. Upload photos and dish preparation videos.',
      platformStep1Title: '1. Add Categories & Dishes',
      platformStep1Desc: 'Group your offerings by Starters, Mains, Cocktails, and Desserts with crisp photos and videos.',
      platformStep2Title: '2. One-Tap Stock Control',
      platformStep2Desc: 'Ran out of an ingredient? Mark it as "Sold Out" instantly without scratching paper menus.',
      platformStep3Title: '3. Live Updates Across All Tables',
      platformStep3Desc: 'Any price tweak or new seasonal special updates in real time for every table.',
      platformSimDemoCategory: 'Category: Specialty Coffee',
      platformSimAvailable: 'In Stock',
      platformSimSoldOut: 'Sold Out',
      platformSimPriceUpdated: 'Price & availability updated live!',
      whatsappBadge: 'Direct WhatsApp Ordering',
      whatsappTitle: 'Guests order from their phone straight to your kitchen',
      whatsappDesc:
        'No 30% delivery commission cuts to third-party apps. Guests build their cart on the digital menu and send a neat, calculated order breakdown straight to your WhatsApp.',
      whatsappButton: 'View WhatsApp Order Demo',
    },
    infoLink: {
      tag: 'All-In-One Ecosystem',
      headline: 'One Smart Bio Link for',
      headlineHighlight: 'Instagram, WhatsApp & Tables',
      subtitle:
        'Replace generic link-in-bio pages. Markethers gives you an ultra-fast portal that turns social media followers into in-person diners and direct orders.',
      feature1Title: 'Digital Menu with Photos & Videos:',
      feature1Desc: 'Guests browse your interactive items or view your official designed PDF right on their phones.',
      feature2Title: '1-Tap Mobile Wallet Pass:',
      feature2Desc: 'Customers save their stamp card directly to Apple or Google Wallet without lengthy forms.',
      feature3Title: '5-Star Google Review Booster:',
      feature3Desc: 'Routes happy diners to your Google Maps listing to dominate local search rankings.',
      feature4Title: 'Commission-Free Ordering:',
      feature4Desc: 'Guests send complete orders straight to your WhatsApp with 100% revenue kept by your store.',
      previewTitle: 'How guests see your InfoLink:',
      previewBioDesc: 'Your custom link: markethers.com/your-business',
    },
    pillars: {
      tag: 'The 3 Markethers Pillars',
      headline: 'Everything your local business needs in one platform',
      subtitle: 'Three integrated tools built to pack your tables and boost repeat visits.',
      pillar1Tag: 'Pillar 1: Loyalty Cards',
      pillar1Title: 'Stamp Cards in Apple Wallet & Google Wallet',
      pillar1Desc:
        'Customers save their stamp card with 1 tap on their iPhone or Android. No apps to download, no tedious forms. They collect stamps and receive push notifications on their lock screen when near your store.',
      pillar1Item1Title: 'Geofenced Push Notifications:',
      pillar1Item1Desc: 'The wallet pass notifies customers whenever they walk near your storefront.',
      pillar1Item2Title: 'Fully Custom Brand Identity:',
      pillar1Item2Desc: 'Your logo, custom colors, stamp icon (coffee, star, gift, scissors, burger) and reward title.',
      pillar1Item3Title: 'Anti-Fraud Security:',
      pillar1Item3Desc: 'Unique cryptographic QR codes verified by your authorized cashier screen.',

      pillar2Tag: 'Pillar 2: PWA Scanner',
      pillar2Title: 'Cashier Scanner with Zero Costly Hardware',
      pillar2Desc:
        'Your staff or cashiers use any phone or tablet. They open the scanner web link, enter their PIN, and award stamps in 2 seconds with sound feedback.',
      pillar2Item1Title: '2-Second Operation:',
      pillar2Item1Desc: 'Point the camera at the customer’s phone and tap "+1 Stamp".',
      pillar2Item2Title: 'Sound Alert & Confetti:',
      pillar2Item2Desc: 'Celebrates on screen when a customer completes their card to redeem a prize.',
      pillar2Item3Title: 'Cashier Audit Trail:',
      pillar2Item3Desc: 'Every stamp is logged with timestamp, date, and staff member name.',
      pillar2TryScanner: 'Try Live Scanner',

      pillar3Tag: 'Pillar 3: Digital Menu',
      pillar3Title: 'Interactive Menu with Catalog & WhatsApp Ordering',
      pillar3Desc:
        'Customers browse your menu by scanning the QR code on the table or clicking your Instagram bio link.',
      pillar3Item1Title: '0% Delivery Commissions:',
      pillar3Item1Desc: 'All orders go straight to your WhatsApp with 100% revenue kept by your business.',
      pillar3Item2Title: 'Total Flexibility:',
      pillar3Item2Desc: 'Upload your existing PDF or build it in minutes inside our visual platform.',
      pillar3Item3Title: 'Always Up to Date:',
      pillar3Item3Desc: 'Never spend money reprinting menus just to tweak a price again.',
    },
    googleReviews: {
      tag: 'Pillar 4: Digital Reputation',
      headline: 'Smart 5-Star Filter for',
      headlineHighlight: 'Google Maps Reviews',
      subtitle:
        'Multiply your 5-star ratings on Google Maps and protect your business from negative feedback before it becomes public.',
      simTitle: 'Test how the Smart Filter works:',
      simSubtitle: 'Select how many stars you would give the experience:',
      filterHighTitle: 'If rated 4 or 5 stars: Direct to Google Maps',
      filterHighDesc:
        'Happy customers are redirected in 1 click to your official Google Maps listing so their glowing review boosts your local ranking and attracts more foot traffic.',
      filterLowTitle: 'If rated 1 to 3 stars: Private Feedback to WhatsApp',
      filterLowDesc:
        'Opens a private feedback form sent directly to your personal WhatsApp. You can resolve the issue privately and delight the customer without harming your public score.',
      benefitTitle: 'Rank among the Top 3 businesses in your city',
      benefitDesc: 'Businesses with 4.7+ stars on Google Maps get up to 3x more phone calls and visits from hungry locals browsing nearby.',
    },
    problem: {
      tag: 'The Reality of Local Commerce',
      headline: 'Why traditional approaches fail local businesses',
      subtitle: '80% of first-time customers never return — not because of bad food, but simply because they forgot about you.',
      cardboardTitle: 'Paper Punch Cards',
      cardboardDesc:
        '72% of customers lose them or leave them at home. They never capture WhatsApp numbers or customer names, and you constantly re-pay print shops.',
      cardboardFooter: 'Zero customer data • Easily lost • Constant print costs',
      appTitle: 'Building a Custom App',
      appDesc:
        'Costs $5,000+ to build and maintain on app stores. Customers standing in line refuse to wait to download an 80MB app over cellular data.',
      appFooter: 'Prohibitive cost • 85% drop-off in line',
      solutionTitle: 'Markethers: Apple & Google Wallet',
      solutionDesc:
        'The loyalty card lives in the native Wallet app already installed on their phone. Zero downloads, activated in 5 seconds, and delivers push updates.',
      solutionFooter: 'Instant adoption • 100% retention • Friendly & effortless',
    },
    comparison: {
      tag: 'Transparent Comparison',
      headline: 'How does Markethers stack up against alternatives?',
      colFeature: 'Feature',
      colPaper: 'Paper Cards',
      colApp: 'Custom App',
      colMarkethers: 'Markethers OS',
      row1Title: 'Customer downloads required',
      row1Paper: 'None',
      row1App: 'Mandatory (App Store 80MB)',
      row1Markethers: '0 Downloads (Native Apple & Google Wallet)',
      row2Title: 'Checkout adoption rate',
      row2Paper: 'Low (forgotten)',
      row2App: 'Less than 15%',
      row2Markethers: '+85% of checkout customers',
      row3Title: 'Friendly digital menu',
      row3Paper: 'Stained paper',
      row3App: 'Slow and heavy',
      row3Markethers: 'Upload PDF or build in 2 min with table QR',
      row4Title: 'Smart Google Reviews filter',
      row4Paper: 'Non-existent',
      row4App: 'Rarely included',
      row4Markethers: '5⭐ to Maps & private WhatsApp triage',
      row5Title: 'WhatsApp capture / CRM',
      row5Paper: 'Impossible',
      row5App: 'Yes but with high friction',
      row5Markethers: 'Automatic on first scan',
      row6Title: 'Setup investment',
      row6Paper: 'Continuous paper re-prints',
      row6App: '$3,000 - $8,000 USD',
      row6Markethers: 'Affordable, ready today',
    },
    testimonials: {
      tag: 'Real Success Stories',
      headline: 'Local businesses that ditched paper cards and',
      headlineHighlight: 'multiplied their customer visits',
      subtitle: 'See how local businesses just like yours grow revenue and save thousands in delivery commissions.',
      items: [
        {
          name: 'Mariana Lopez',
          role: 'Founder',
          business: 'Bruma Specialty Coffee',
          avatar: '☕',
          quote:
            'Our customers were blown away having their stamp card right inside Apple Wallet. In month one we saw a +38% jump in repeat visits, and we stopped throwing money away on paper punch cards.',
          metric: '+38% increase in repeat visits',
          stars: 5,
        },
        {
          name: 'Carlos Restrepo',
          role: 'Chef & Owner',
          business: 'Craft Burger Lab',
          avatar: '🍔',
          quote:
            'Direct WhatsApp ordering completely changed our unit economics. We save over $1,200 USD every month that previously vanished into delivery app commission cuts. The revenue stays with us.',
          metric: '$1,200 USD/mo saved in commissions',
          stars: 5,
        },
        {
          name: 'Javier Morales',
          role: 'Master Barber',
          business: 'El Galan Barber Studio',
          avatar: '💈',
          quote:
            'The Smart Google Reviews filter is pure magic. We went from a 4.2 to a 4.9 rating with over 280 genuine 5-star reviews. Today we are the #1 barbershop recommended on Google Maps in our city.',
          metric: '4.9⭐ #1 ranking on Google Maps',
          stars: 5,
        },
      ],
    },
    pricing: {
      tag: 'Clear Investment & Zero Commissions',
      headline: 'Transparent plans that pay for themselves',
      headlineHighlight: 'on your very first weekend',
      subtitle:
        'Zero commission cuts on your orders. Everything you make belongs 100% to your business. Pick the plan built for you.',
      monthly: 'Monthly Billing',
      annual: 'Annual Billing',
      annualDiscount: 'Save 35%',
      billedAnnually: 'billed annually',
      billedMonthly: 'billed monthly',
      guaranteeTitle: '🛡️ 14-Day Ironclad Satisfaction Guarantee',
      guaranteeDesc:
        'Try Markethers in your business risk-free. If you do not see more repeat customers or do not love the software, we will refund 100% of your money. No hassle, no questions asked.',
      trust1: 'No lock-in contracts',
      trust2: 'Cancel anytime with 1 click',
      trust3: 'Human support via WhatsApp',
      plans: [
        {
          id: 'starter',
          name: 'Starter Plan',
          description: 'Great for single stores looking to replace paper cards and launch a digital menu.',
          monthlyPrice: 29,
          annualPrice: 19,
          features: [
            'Up to 400 active Wallet pass customers',
            'Digital Menu (Upload PDF or build online)',
            'Apple Wallet & Google Wallet stamp cards',
            'PWA Web Scanner for 2 cashiers',
            'Direct WhatsApp ordering (0% commissions)',
            'Printable table and counter QR stand',
            'Email & WhatsApp support',
          ],
          cta: 'Start with Starter',
        },
        {
          id: 'pro',
          name: 'Pro Markethers Plan',
          badge: '🔥 Most Popular (Chosen by 92% of businesses)',
          popular: true,
          description: 'For growing businesses looking to dominate their area, pack tables, and protect reviews.',
          monthlyPrice: 49,
          annualPrice: 32,
          features: [
            'UNLIMITED customers & Wallet passes',
            'Digital Menu with Food Photos AND VIDEOS',
            'Upload designed PDF menu with HD viewer',
            'Smart 5-Star Google Reviews Filter',
            'Geofenced Lock-Screen Push Notifications',
            'Unlimited cashier scanners with PIN code',
            'Centralized InfoLink for Instagram bio',
            'CRM with VIP & At-Risk customer segmentation',
            '24/7 Priority WhatsApp support',
          ],
          cta: 'Start Free Pro Trial',
        },
        {
          id: 'franchise',
          name: 'Multi-Location Plan',
          description: 'For multi-location brands and restaurant groups requiring centralized oversight.',
          monthlyPrice: 99,
          annualPrice: 65,
          features: [
            'Everything included in Pro Plan',
            'Up to 5 locations managed in one account',
            'Custom brand domain (your-brand.com)',
            'Cross-branch comparative performance analytics',
            'Advanced cashier audit trail & logs',
            '1-on-1 team onboarding video call',
            'Dedicated account manager',
          ],
          cta: 'Talk to a Specialist',
        },
      ],
    },
    roi: {
      tag: 'Return on Investment Calculator',
      headline: 'How much extra revenue can your business generate?',
      subtitle: 'Adjust the sliders to match your business numbers and see the projected monthly revenue lift.',
      sliderClients: 'Customers served per day:',
      sliderTicket: 'Average check per visit:',
      baseCalculo: 'Estimated calculation baseline:',
      monthlyEst: 'Projected monthly revenue:',
      avgLift: 'Proven visit frequency lift with Wallet:',
      extraRevenueBadge: 'Estimated Extra Monthly Revenue',
      extraVisitsNotice: 'Driven by extra repeat visits from loyal customers choosing your place over competitors.',
      ctaButton: 'Start Building Loyalty Today',
    },
    industries: {
      tag: 'Built for Any Niche',
      headline: 'Tailored for the local businesses powering our cities',
      tabCafe: 'Cafes, Bakeries & Brunch',
      tabBarber: 'Barbershops, Salons & Spas',
      tabRestaurant: 'Restaurants, Pizzerias & Bars',
      recommendedMechanic: 'Recommended program mechanic:',
    },
    faq: {
      tag: 'Frequently Asked Questions',
      headline: 'Clear answers to your top questions',
      items: [
        {
          q: 'How easy is it to upload my existing menu?',
          a: 'Extremely easy! If you have your menu designed as a PDF, a photo of your paper menu, or an image file, simply upload it with one click. Our system reads it cleanly and generates your ready-to-print table QR codes in seconds. If you prefer building it in the platform, our visual editor lets you add dishes, photos, videos, and prices in under 2 minutes.',
        },
        {
          q: 'Do my customers need to install an app to get their loyalty card?',
          a: 'No. That is Markethers’ superpower. Cards are saved 100% natively in Apple Wallet on iPhone and Google Wallet on Android. These are the exact official apps where your customers already keep their credit cards and boarding passes.',
        },
        {
          q: 'What happens if a customer gives a low rating in the Google filter?',
          a: 'Our Smart Filter safeguards your public reputation. If a customer awards 4 or 5 stars, they are invited to publish it directly on Google Maps. If they select 1, 2, or 3 stars, it opens a private feedback form that goes straight to your WhatsApp so you can resolve it privately without hurting your public score.',
        },
        {
          q: 'Do you take any commissions on WhatsApp digital menu orders?',
          a: '0% commissions. Unlike delivery apps that take 20% to 35% cuts from your food, Markethers orders are delivered directly to your WhatsApp with 100% of the money kept by your business.',
        },
        {
          q: 'Do my cashiers need expensive barcode scanners or hardware?',
          a: 'Zero special hardware. Your staff simply opens the web scanner link on any smartphone or tablet with a camera, types in their 4-digit PIN, and scans the customer’s screen in 2 seconds with clear audio confirmation.',
        },
        {
          q: 'Can I cancel my plan if I am not satisfied?',
          a: 'Yes, anytime with 1 click from your dashboard with zero cancellation fees. Plus, you are covered by our 14-Day Money-Back Guarantee to try it completely risk-free.',
        },
      ],
    },
    cta: {
      tag: 'Get Started in Minutes',
      headline: 'Turn one-time diners into lifelong regulars',
      subtitle: 'Join over 180 local restaurants, cafes, and salons modernizing their customer experience with Markethers.',
      btnPanel: 'Open Control Dashboard (/app)',
      btnDemo: 'Explore Live Demo Store',
    },
    footer: {
      rights: 'All rights reserved.',
      slogan: 'The Loyalty, Digital Menu & Google Reviews Operating System for Local Businesses.',
    },
  },
};
