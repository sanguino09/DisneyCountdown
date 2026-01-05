import { useEffect, useMemo, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import Countdown from './components/Countdown';
import { LanguageSelector } from './components/LanguageSelector';
import { TimezoneSelect } from './components/TimezoneSelect';
import { Language, translations } from './i18n';
import { getTargetDate, TARGET_ZONE_DEFAULT } from './utils/time';

const SHARE_URL = typeof window !== 'undefined' ? window.location.href : '';

const audioSrc = '/ambient-magic.mp3';

function App() {
  const [language, setLanguage] = useState<Language>('es');
  const [timezone, setTimezone] = useState(TARGET_ZONE_DEFAULT);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | 'unsupported'
  >('default');
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
      title: 'Cuenta regresiva Disney',
      text: t.magicLine,
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
          <p className="tag">{t.magicLine}</p>
          <h1 className="title" aria-label={t.heading}>
            {t.heading}
          </h1>
          <p className="subtitle">{t.subtitle}</p>

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
        </header>

        <section id="countdown" className="panel" aria-label={t.countdownLabel}>
          <Countdown language={language} timezone={timezone} />
          <div className="cta-row">
            <button className="cta" onClick={shareMagic} aria-label={t.share}>
              🚀 {t.share}
            </button>
          </div>
        </section>
      </main>

      <audio ref={audioRef} src={audioSrc} aria-hidden="true" />
    </div>
  );
}

export default App;
