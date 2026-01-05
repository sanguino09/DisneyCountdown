import { useEffect, useMemo, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import Countdown from './components/Countdown';
import { LanguageSelector } from './components/LanguageSelector';
import { TimezoneSelect } from './components/TimezoneSelect';
import { Language, translations } from './i18n';
import { getTargetDate, TARGET_ZONE_DEFAULT } from './utils/time';

const SHARE_URL = typeof window !== 'undefined' ? window.location.href : '';

const audioSrc = '/ambient-magic.mp3';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function App() {
  const [language, setLanguage] = useState<Language>('es');
  const [timezone, setTimezone] = useState(TARGET_ZONE_DEFAULT);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | 'unsupported'
  >('default');
  const [showSettings, setShowSettings] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const notifiedMilestones = useRef<Set<string>>(new Set());

  const t = translations[language];

  useEffect(() => {
    if (!('Notification' in window)) {
      setNotificationPermission('unsupported');
      return;
    }

    Notification.requestPermission().then(setNotificationPermission);
  }, []);

  useEffect(() => {
    if (notificationPermission !== 'granted') {
      return;
    }

    const checkMilestones = () => {
      const target = getTargetDate(timezone);
      const now = DateTime.now().setZone(timezone);
      const diffMs = target.toMillis() - now.toMillis();

      const milestones = [
        { key: '30d', threshold: 30 * 24 * 60 * 60 * 1000 },
        { key: '1d', threshold: 24 * 60 * 60 * 1000 },
        { key: '1h', threshold: 60 * 60 * 1000 }
      ];

      milestones.forEach(({ key, threshold }) => {
        if (diffMs <= threshold && !notifiedMilestones.current.has(key)) {
          new Notification(t.notificationTitle, { body: t.milestones[key as keyof typeof t.milestones] });
          notifiedMilestones.current.add(key);
        }
      });
    };

    const interval = window.setInterval(checkMilestones, 60 * 1000);
    checkMilestones();

    return () => clearInterval(interval);
  }, [notificationPermission, t, timezone]);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isMusicOn) {
      audioRef.current.volume = 0.4;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => setIsMusicOn(false));
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isMusicOn]);

  const shareMagic = async () => {
    const shareData = {
      title: 'Disney Countdown',
      text: t.shareSubtitle,
      url: SHARE_URL
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(SHARE_URL);
        alert(t.copied);
      }
    } catch (error) {
      console.error('Error sharing', error);
    }
  };

  const installApp = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setCanInstall(false);
    } else {
      alert(t.installFallback);
    }
  };

  const ariaLabels = useMemo(
    () => ({
      timezone: t.timezoneLabel,
      notifications: t.notificationLabel,
      music: t.musicLabel
    }),
    [t]
  );

  return (
    <div className="page" aria-label="Disney countdown experience">
      <a className="skip-link" href="#countdown" aria-label={t.accessibilitySkip}>
        {t.accessibilitySkip}
      </a>
      <div className="background" role="presentation" />
      <div className="sparkles" role="presentation" />
      <main className="shell">
        <header className="hero">
          <h1 className="title" aria-label={t.heading}>
            {t.heading}
          </h1>
          <p className="subtitle">{t.subtitle}</p>

          {showSettings && (
            <div className="controls" aria-label="Configuraciones">
              <LanguageSelector
                value={language}
                onChange={setLanguage}
                ariaLabel={t.languageLabel}
              />
              <TimezoneSelect
                value={timezone}
                onChange={(value) => {
                  setTimezone(value);
                  notifiedMilestones.current.clear();
                }}
                ariaLabel={ariaLabels.timezone}
              />
              <button
                className="pill"
                onClick={() => setIsMusicOn((prev) => !prev)}
                aria-pressed={isMusicOn}
                aria-label={ariaLabels.music}
              >
                {isMusicOn ? '🔊 ' : '🔇 '} {t.musicLabel}
              </button>
              <span className="pill status" aria-label={ariaLabels.notifications}>
                {notificationPermission === 'granted' ? '🔔 On' : '🔕 Off'}
              </span>
            </div>
          )}
        </header>

        <section id="countdown" className="panel" aria-label={t.countdownLabel}>
          <Countdown language={language} timezone={timezone} />
          <div className="cta-row">
            <button
              className="cta icon"
              onClick={() => setShowSettings((prev) => !prev)}
              aria-label={t.settings}
              aria-expanded={showSettings}
            >
              ⚙️
            </button>
            <button
              className="cta secondary icon"
              onClick={installApp}
              aria-label={t.installApp}
            >
              📱
            </button>
            <button className="cta" onClick={shareMagic} aria-label={t.share}>
              📤
            </button>
          </div>
          {showSettings && (
            <div className="controls" aria-label="Configuraciones">
              <LanguageSelector
                value={language}
                onChange={setLanguage}
                ariaLabel={t.languageLabel}
              />
              <TimezoneSelect
                value={timezone}
                onChange={(value) => {
                  setTimezone(value);
                  notifiedMilestones.current.clear();
                }}
                ariaLabel={ariaLabels.timezone}
              />
              <button
                className="pill"
                onClick={() => setIsMusicOn((prev) => !prev)}
                aria-pressed={isMusicOn}
                aria-label={ariaLabels.music}
              >
                {isMusicOn ? '🔊 ' : '🔇 '} {t.musicLabel}
              </button>
              <span className="pill status" aria-label={ariaLabels.notifications}>
                {notificationPermission === 'granted' ? '🔔 On' : '🔕 Off'}
              </span>
            </div>
          )}
        </section>
      </main>

      <audio ref={audioRef} src={audioSrc} aria-hidden="true" />
    </div>
  );
}

export default App;
