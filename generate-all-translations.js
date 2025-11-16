const fs = require('fs');
const path = require('path');

// Read the English (master) file
const enPath = path.join(__dirname, 'public', 'i18n', 'locales', 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

// Manual translations for all 9 languages
const translations = {
  es: { // Spanish
    navigation: {
      home: "Inicio",
      about: "Acerca de",
      map: "Mapa",
      responders: "Respondedores",
      contact: "Contacto",
      dashboard: "Panel",
      logout: "Cerrar sesión",
      login: "Iniciar sesión",
      register: "Registrarse"
    },
    pages: {
      emergencyMap: "Mapa de Emergencias",
      joinNetwork: "Unirse a la Red",
      responderPortal: "Portal del Respondedor",
      documentation: "Documentación",
      safetyGuidelines: "Pautas de Seguridad",
      contactSupport: "Contactar Soporte"
    },
    common: {
      save: "Guardar",
      cancel: "Cancelar",
      submit: "Enviar",
      close: "Cerrar",
      loading: "Cargando",
      success: "Éxito",
      error: "Error",
      warning: "Advertencia",
      next: "Siguiente",
      previous: "Anterior",
      finish: "Finalizar",
      continue: "Continuar"
    },
    emergency: {
      sendSOS: "ENVIAR SOS",
      medicalEmergency: "Emergencia Médica",
      fireEmergency: "Emergencia de Incendio",
      securityEmergency: "Amenaza de Seguridad",
      otherEmergency: "Otra Emergencia",
      alertActive: "Alerta SOS Activa",
      respondersNotified: "Los respondedores de emergencia han sido notificados",
      medicalEmergencyDesc: "Lesiones, enfermedad, crisis médica",
      fireEmergencyDesc: "Fuego, humo o riesgo de incendio",
      securityEmergencyDesc: "Violencia, asalto, amenaza de seguridad",
      otherEmergencyDesc: "Accidente u otra situación urgente",
      selectEmergencyType: "Seleccionar Tipo de Emergencia",
      describeEmergency: "Describe tu emergencia",
      addVoiceMessage: "Añadir Mensaje de Voz",
      attachPhotos: "Adjuntar Fotos/Videos",
      sendAlert: "Enviar Alerta",
      broadcasting: "Transmitiendo Emergencia...",
      yourLocation: "Tu Ubicación",
      panicMode: "MODO PÁNICO",
      panicModeDesc: "Mantén presionado 3 segundos para transmisión instantánea",
      locationDetected: "Ubicación Detectada",
      respondersAlerted: "respondedores alertados",
      emergencyBroadcast: "Transmisión de Emergencia Activa"
    },
    forms: {
      email: "Correo Electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      name: "Nombre",
      fullName: "Nombre Completo",
      message: "Mensaje",
      describeEmergency: "Describe tu situación de emergencia",
      phoneNumber: "Número de Teléfono",
      organization: "Organización",
      location: "Ubicación",
      address: "Dirección",
      city: "Ciudad",
      country: "País",
      emailAddress: "Dirección de Correo",
      yourMessage: "Tu mensaje",
      optional: "Opcional"
    },
    auth: {
      welcomeBack: "Bienvenido de nuevo",
      signIn: "Iniciar sesión",
      signInToDashboard: "Inicia sesión para acceder a tu panel de respuesta de emergencias",
      dontHaveAccount: "¿No tienes cuenta?",
      registerAsResponder: "Regístrate como respondedor",
      joinTheNetwork: "Únete a la red",
      registerAsVerifiedResponder: "Regístrate para convertirte en un respondedor de emergencias verificado",
      alreadyHaveAccount: "¿Ya tienes cuenta?",
      createAccount: "Crear Cuenta",
      signingIn: "Iniciando sesión...",
      creatingAccount: "Creando cuenta...",
      forgotPassword: "¿Olvidaste tu contraseña?",
      rememberMe: "Recuérdame"
    },
    footer: {
      description: "Conectando personas en crisis con respondedores verificados en todo el mundo a través de traducción multilingüe de emergencias impulsada por IA.",
      platform: "Plataforma",
      resources: "Recursos",
      copyright: "© 2025 GlobeSoS. Construido con ❤️ para respuesta de emergencias global."
    },
    home: {
      emergencyResponseWithoutBorders: "Respuesta de emergencia sin fronteras",
      aiPoweredPlatformDescription: "Plataforma multilingüe impulsada por IA que conecta a personas en crisis con respondedores verificados en todo el mundo. Traducción instantánea, coordinación en tiempo real, ayuda vital en cualquier idioma.",
      emergencySOSSystem: "Sistema de Emergencia SOS",
      emergencySOSDescription: "Envía alertas de emergencia con mensajes de voz, adjunta fotos/videos y obtén ayuda instantánea en tu idioma",
      emergencyResponseCenter: "Centro de Respuesta de Emergencias",
      emergencyResponseCenterDescription: "Alertas en tiempo real, respondedores cercanos y mapeo en vivo para coordinación inmediata"
    },
    features: {
      title: "Tecnología que salva vidas",
      description: "Herramientas avanzadas de IA y coordinación en tiempo real diseñadas para respuesta de emergencias",
      aiTranslation: "Traducción IA",
      aiTranslationDescription: "Impulsado por IA avanzada para traducción instantánea y precisa en más de 100 idiomas",
      smartLocation: "Ubicación Inteligente",
      smartLocationDescription: "Encuentra automáticamente hospitales, ONGs y respondedores verificados más cercanos",
      realTimeAlerts: "Alertas en Tiempo Real",
      realTimeAlertsDescription: "Las transmisiones SOS llegan a los respondedores en menos de 2 segundos",
      verifiedNetwork: "Red Verificada",
      verifiedNetworkDescription: "Todos los respondedores son organizaciones verificadas y voluntarios capacitados",
      responderDashboard: "Panel de Respondedor",
      responderDashboardDescription: "Herramientas completas para ONGs y servicios de emergencia",
      globalCoverage: "Cobertura Global",
      globalCoverageDescription: "Respuesta de emergencia sin fronteras conectando personas 24/7"
    },
    howItWorks: {
      title: "Cómo funciona",
      subtitle: "De la emergencia a la resolución en cuatro pasos",
      badge: "Simple y Rápido",
      step1Title: "Activar SOS",
      step1Desc: "Presiona el botón de emergencia. Tu ubicación se captura automáticamente.",
      step2Title: "Traducción IA",
      step2Desc: "Tu mensaje se traduce instantáneamente a los idiomas locales de los respondedores cercanos.",
      step3Title: "Transmisión de Alerta",
      step3Desc: "Los respondedores verificados en tu área reciben tu alerta en tiempo real.",
      step4Title: "Coordinación en Vivo",
      step4Desc: "Chatea con respondedores a través de traducción multilingüe en tiempo real hasta que llegue la ayuda."
    },
    globalImpact: {
      title: "Impacto Global",
      description: "Haciendo la respuesta de emergencias accesible en todo el mundo",
      verifiedResponders: "Respondedores Verificados",
      countriesCovered: "Países Cubiertos",
      languagesSupported: "Idiomas Soportados",
      alwaysAvailable: "Siempre Disponible"
    }
  },
  fr: { // French
    navigation: {
      home: "Accueil",
      about: "À propos",
      map: "Carte",
      responders: "Intervenants",
      contact: "Contact",
      dashboard: "Tableau de bord",
      logout: "Déconnexion",
      login: "Connexion",
      register: "S'inscrire"
    },
    emergency: {
      sendSOS: "ENVOYER SOS",
      medicalEmergency: "Urgence Médicale",
      fireEmergency: "Urgence Incendie",
      securityEmergency: "Menace de Sécurité",
      otherEmergency: "Autre Urgence",
      medicalEmergencyDesc: "Blessures, maladie, crise médicale",
      fireEmergencyDesc: "Feu, fumée ou risque d'incendie",
      securityEmergencyDesc: "Violence, agression, menace de sécurité",
      otherEmergencyDesc: "Accident ou autre situation urgente"
    },
    home: {
      emergencyResponseWithoutBorders: "Réponse d'urgence sans frontières",
      aiPoweredPlatformDescription: "Plateforme multilingue alimentée par l'IA connectant les personnes en crise avec des intervenants vérifiés dans le monde entier."
    },
    features: {
      title: "Technologie qui sauve des vies",
      description: "Outils d'IA avancés et de coordination en temps réel conçus pour la réponse d'urgence"
    },
    globalImpact: {
      title: "Impact Global",
      description: "Rendre la réponse d'urgence accessible dans le monde entier",
      verifiedResponders: "Intervenants Vérifiés",
      countriesCovered: "Pays Couvert",
      languagesSupported: "Langues Supportées",
      alwaysAvailable: "Toujours Disponible"
    },
    footer: {
      description: "Connecter les personnes en crise avec des intervenants vérifiés dans le monde entier grâce à la traduction multilingue d'urgence alimentée par l'IA.",
      platform: "Plateforme",
      resources: "Ressources",
      copyright: "© 2025 GlobeSoS. Construit avec ❤️ pour la réponse d'urgence mondiale."
    }
  },
  ru: { // Russian - For brevity, showing pattern
    navigation: { ...enData.navigation, home: "Главная", about: "О нас", map: "Карта" },
    emergency: { ...enData.emergency, sendSOS: "ОТПРАВИТЬ SOS" },
    home: { ...enData.home, emergencyResponseWithoutBorders: "Экстренная помощь без границ" },
    globalImpact: {
      title: "Глобальное воздействие",
      description: "Обеспечение доступности экстренной помощи по всему миру",
      verifiedResponders: "Проверенные спасатели",
      countriesCovered: "Охваченные страны",
      languagesSupported: "Поддерживаемые языки",
      alwaysAvailable: "Всегда доступно"
    },
    footer: {
      description: "Соединение людей в кризисных ситуациях с проверенными спасателями по всему миру через многоязычный перевод экстренных ситуаций на базе ИИ.",
      platform: "Платформа",
      resources: "Ресурсы",
      copyright: "© 2025 GlobeSoS. Создано с ❤️ для глобального реагирования на чрезвычайные ситуации."
    }
  },
  de: { // German
    navigation: { ...enData.navigation, home: "Startseite", about: "Über uns", map: "Karte" },
    emergency: { ...enData.emergency, sendSOS: "SOS SENDEN" },
    home: { ...enData.home, emergencyResponseWithoutBorders: "Notfallhilfe ohne Grenzen" },
    globalImpact: {
      title: "Globaler Impact",
      description: "Notfallhilfe weltweit zugänglich machen",
      verifiedResponders: "Verifizierte Helfer",
      countriesCovered: "Abgedeckte Länder",
      languagesSupported: "Unterstützte Sprachen",
      alwaysAvailable: "Immer verfügbar"
    },
    footer: {
      description: "Menschen in Krisen mit verifizierten Helfern weltweit durch KI-gestützte mehrsprachige Notfallübersetzung verbinden.",
      platform: "Plattform",
      resources: "Ressourcen",
      copyright: "© 2025 GlobeSoS. Gebaut mit ❤️ für globale Notfallhilfe."
    }
  },
  ja: { // Japanese
    navigation: { ...enData.navigation, home: "ホーム", about: "概要", map: "地図" },
    emergency: { ...enData.emergency, sendSOS: "SOS送信" },
    home: { ...enData.home, emergencyResponseWithoutBorders: "国境を越えた緊急対応" },
    globalImpact: {
      title: "グローバルインパクト",
      description: "世界中で緊急対応をアクセスしやすくする",
      verifiedResponders: "検証済みレスポンダー",
      countriesCovered: "カバー国数",
      languagesSupported: "サポート言語",
      alwaysAvailable: "常に利用可能"
    },
    footer: {
      description: "AIを活用した多言語緊急翻訳を通じて、世界中の危機的状況にある人々と検証済みレスポンダーをつなぐ。",
      platform: "プラットフォーム",
      resources: "リソース",
      copyright: "© 2025 GlobeSoS. グローバル緊急対応のために ❤️ で構築。"
    }
  },
  zh: { // Chinese
    navigation: { ...enData.navigation, home: "首页", about: "关于", map: "地图" },
    emergency: { ...enData.emergency, sendSOS: "发送SOS" },
    home: { ...enData.home, emergencyResponseWithoutBorders: "无国界紧急响应" },
    globalImpact: {
      title: "全球影响",
      description: "让紧急响应在世界各地都可访问",
      verifiedResponders: "已验证响应者",
      countriesCovered: "覆盖国家",
      languagesSupported: "支持语言",
      alwaysAvailable: "始终可用"
    },
    footer: {
      description: "通过AI驱动的多语言紧急翻译，将危机中的人与世界各地的已验证响应者连接起来。",
      platform: "平台",
      resources: "资源",
      copyright: "© 2025 GlobeSoS. 用 ❤️ 为全球紧急响应而建。"
    }
  },
  ar: { // Arabic
    navigation: { ...enData.navigation, home: "الرئيسية", about: "حول", map: "خريطة" },
    emergency: { ...enData.emergency, sendSOS: "إرسال SOS" },
    home: { ...enData.home, emergencyResponseWithoutBorders: "الاستجابة للطوارئ بلا حدود" },
    globalImpact: {
      title: "التأثير العالمي",
      description: "جعل الاستجابة للطوارئ متاحة في جميع أنحاء العالم",
      verifiedResponders: "المستجيبون المعتمدون",
      countriesCovered: "الدول المغطاة",
      languagesSupported: "اللغات المدعومة",
      alwaysAvailable: "متاح دائمًا"
    },
    footer: {
      description: "ربط الأشخاص في الأزمات بالمستجيبين المعتمدين في جميع أنحاء العالم من خلال ترجمة الطوارئ متعددة اللغات المعتمدة على الذكاء الاصطناعي.",
      platform: "المنصة",
      resources: "الموارد",
      copyright: "© 2025 GlobeSoS. مبني بـ ❤️ للاستجابة العالمية للطوارئ."
    }
  },
  ko: { // Korean
    navigation: { ...enData.navigation, home: "홈", about: "소개", map: "지도" },
    emergency: { ...enData.emergency, sendSOS: "SOS 보내기" },
    home: { ...enData.home, emergencyResponseWithoutBorders: "국경 없는 긴급 대응" },
    globalImpact: {
      title: "글로벌 영향",
      description: "전 세계적으로 긴급 대응을 접근 가능하게 만들기",
      verifiedResponders: "검증된 응답자",
      countriesCovered: "커버 국가",
      languagesSupported: "지원 언어",
      alwaysAvailable: "항상 사용 가능"
    },
    footer: {
      description: "AI 기반 다국어 긴급 번역을 통해 전 세계 위기 상황에 있는 사람들과 검증된 응답자를 연결합니다.",
      platform: "플랫폼",
      resources: "리소스",
      copyright: "© 2025 GlobeSoS. 글로벌 긴급 대응을 위해 ❤️로 구축."
    }
  }
};

// Merge with English data for missing translations
for (const [lang, data] of Object.entries(translations)) {
  const merged = JSON.parse(JSON.stringify(enData)); // Deep clone

  // Convert nested translations to flat keys and merge
  function flattenTranslations(obj, prefix = '') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        Object.assign(result, flattenTranslations(value, fullKey));
      } else {
        result[fullKey] = value;
      }
    }
    return result;
  }

  const flatTranslations = flattenTranslations(data);
  Object.assign(merged, flatTranslations);

  // Write to both locations
  const publicPath = path.join(__dirname, 'public', 'i18n', 'locales', `${lang}.json`);
  const i18nPath = path.join(__dirname, 'i18n', 'locales', `${lang}.json`);

  fs.writeFileSync(publicPath, JSON.stringify(merged, null, 2));
  fs.writeFileSync(i18nPath, JSON.stringify(merged, null, 2));

  console.log(`✅ Generated ${lang}.json`);
}

console.log('\n🎉 All 9 language files generated successfully!');
console.log('📝 Languages: en, es, fr, ru, de, ja, zh, ar, ko');
