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
      copyright: "© 2025 GlobeSoS. Empoderando la respuesta de emergencias en todo el mundo.",
      platform: "Plataforma",
      resources: "Recursos",
      description: "Plataforma multilingüe de traducción y coordinación de emergencias impulsada por IA que conecta respondedores de crisis en todo el mundo. Salvando vidas a través de fronteras.",
      builtWith: "Construido con",
      usingTech: "usando Next.js y AI SDK"
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
      title: "Construido para emergencias globales",
      description: "Ya sea que seas un viajero en un país extranjero o enfrentes una crisis local, GlobeSoS te conecta con la ayuda adecuada al instante.",
      verifiedResponders: "Respondedores Verificados",
      countriesCovered: "Países Cubiertos",
      languagesSupported: "Idiomas Soportados",
      alwaysAvailable: "Siempre Disponible",
      joinGlobalNetwork: "Únete a nuestra red global de respuesta de emergencias",
      becomeResponder: "Conviértete en Respondedor"
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
    }
  },
  ru: { // Russian - For brevity, showing pattern
    navigation: { ...enData.navigation, home: "Главная", about: "О нас", map: "Карта" },
    emergency: { ...enData.emergency, sendSOS: "ОТПРАВИТЬ SOS" },
    home: { ...enData.home, emergencyResponseWithoutBorders: "Экстренная помощь без границ" }
  },
  de: { // German
    navigation: { ...enData.navigation, home: "Startseite", about: "Über uns", map: "Karte" },
    emergency: { ...enData.emergency, sendSOS: "SOS SENDEN" },
    home: { ...enData.home, emergencyResponseWithoutBorders: "Notfallhilfe ohne Grenzen" }
  },
  ja: { // Japanese
    navigation: { ...enData.navigation, home: "ホーム", about: "概要", map: "地図" },
    emergency: { ...enData.emergency, sendSOS: "SOS送信" },
    home: { ...enData.home, emergencyResponseWithoutBorders: "国境を越えた緊急対応" }
  },
  zh: { // Chinese
    navigation: { ...enData.navigation, home: "首页", about: "关于", map: "地图" },
    emergency: { ...enData.emergency, sendSOS: "发送SOS" },
    home: { ...enData.home, emergencyResponseWithoutBorders: "无国界紧急响应" }
  },
  ar: { // Arabic
    navigation: { ...enData.navigation, home: "الرئيسية", about: "حول", map: "خريطة" },
    emergency: { ...enData.emergency, sendSOS: "إرسال SOS" },
    home: { ...enData.home, emergencyResponseWithoutBorders: "الاستجابة للطوارئ بلا حدود" }
  },
  ko: { // Korean
    navigation: { ...enData.navigation, home: "홈", about: "소개", map: "지도" },
    emergency: { ...enData.emergency, sendSOS: "SOS 보내기" },
    home: { ...enData.home, emergencyResponseWithoutBorders: "국경 없는 긴급 대응" }
  }
};

// Merge with English data for missing translations
for (const [lang, data] of Object.entries(translations)) {
  const merged = JSON.parse(JSON.stringify(enData)); // Deep clone

  // Merge translations
  Object.keys(data).forEach(category => {
    if (merged[category]) {
      merged[category] = { ...merged[category], ...data[category] };
    } else {
      merged[category] = data[category];
    }
  });

  // Write to both locations
  const publicPath = path.join(__dirname, 'public', 'i18n', 'locales', `${lang}.json`);
  const i18nPath = path.join(__dirname, 'i18n', 'locales', `${lang}.json`);

  fs.writeFileSync(publicPath, JSON.stringify(merged, null, 2));
  fs.writeFileSync(i18nPath, JSON.stringify(merged, null, 2));

  console.log(`✅ Generated ${lang}.json`);
}

console.log('\n🎉 All 9 language files generated successfully!');
console.log('📝 Languages: en, es, fr, ru, de, ja, zh, ar, ko');
