export type Language = 'es' | 'en' | 'fr';

export const translations: Record<Language, {
  heading: string;
  subtitle: string;
  magicLine: string;
  share: string;
  copied: string;
  notificationTitle: string;
  milestones: Record<'30d' | '1d' | '1h', string>;
  countdownLabel: string;
  languageLabel: string;
  timezoneLabel: string;
  musicLabel: string;
  notificationLabel: string;
  accessibilitySkip: string;
  units: Record<'days' | 'hours' | 'minutes' | 'seconds', string>;
}> = {
  es: {
    heading: 'Cuenta regresiva mágica',
    subtitle: 'Camino al 25 de febrero de 2026 - 09:30',
    magicLine: '✨ Donde los sueños despiertan la imaginación ✨',
    share: 'Compartir la magia',
    copied: 'Enlace copiado. ¡Comparte la magia!',
    notificationTitle: 'Recordatorio mágico',
    milestones: {
      '30d': '¡Solo faltan 30 días para el gran momento Disney!',
      '1d': '¡Mañana es el gran día, prepara tu varita! ✨',
      '1h': 'En una hora empieza la magia. ¡No llegues tarde!'
    },
    countdownLabel: 'Tiempo restante',
    languageLabel: 'Idioma',
    timezoneLabel: 'Zona horaria',
    musicLabel: 'Música ambiental',
    notificationLabel: 'Notificaciones',
    accessibilitySkip: 'Saltar al contador',
    units: {
      days: 'Días',
      hours: 'Horas',
      minutes: 'Minutos',
      seconds: 'Segundos'
    }
  },
  en: {
    heading: 'Magical Countdown',
    subtitle: 'On the way to Feb 25, 2026 - 09:30',
    magicLine: '✨ Where dreams awaken imagination ✨',
    share: 'Share the magic',
    copied: 'Link copied. Share the magic!',
    notificationTitle: 'Magical reminder',
    milestones: {
      '30d': 'Only 30 days left until the Disney moment!',
      '1d': 'Tomorrow is the big day—ready your wand! ✨',
      '1h': 'One hour until the magic begins. Do not be late!'
    },
    countdownLabel: 'Time remaining',
    languageLabel: 'Language',
    timezoneLabel: 'Time zone',
    musicLabel: 'Ambient music',
    notificationLabel: 'Notifications',
    accessibilitySkip: 'Skip to countdown',
    units: {
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds'
    }
  },
  fr: {
    heading: 'Compte à rebours magique',
    subtitle: 'En route vers le 25 février 2026 - 09:30',
    magicLine: '✨ Là où les rêves éveillent l\'imagination ✨',
    share: 'Partager la magie',
    copied: 'Lien copié. Partage la magie !',
    notificationTitle: 'Rappel magique',
    milestones: {
      '30d': 'Plus que 30 jours avant l\'instant Disney !',
      '1d': 'Demain est le grand jour, prépare ta baguette ! ✨',
      '1h': 'Dans une heure la magie commence. Ne sois pas en retard !'
    },
    countdownLabel: 'Temps restant',
    languageLabel: 'Langue',
    timezoneLabel: 'Fuseau horaire',
    musicLabel: "Musique d'ambiance",
    notificationLabel: 'Notifications',
    accessibilitySkip: 'Aller au compteur',
    units: {
      days: 'Jours',
      hours: 'Heures',
      minutes: 'Minutes',
      seconds: 'Secondes'
    }
  }
};
