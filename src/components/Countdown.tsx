import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { Language, translations } from '../i18n';
import { getCountdownParts, getTargetDate } from '../utils/time';

type CountdownProps = {
  timezone: string;
  language: Language;
};

type CountdownState = ReturnType<typeof getCountdownParts>;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80 } }
};

const numberVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: 'tween', duration: 0.4 } }
};

export default function Countdown({ timezone, language }: CountdownProps) {
  const [state, setState] = useState<CountdownState>(() =>
    getCountdownParts(DateTime.now().setZone(timezone), getTargetDate(timezone))
  );

  const labels = translations[language].units;

  useEffect(() => {
    const update = () => {
      const now = DateTime.now().setZone(timezone);
      const target = getTargetDate(timezone);
      setState(getCountdownParts(now, target));
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const segments = useMemo(
    () => [
      { key: 'days', value: state.days, label: labels.days },
      { key: 'hours', value: state.hours, label: labels.hours },
      { key: 'minutes', value: state.minutes, label: labels.minutes },
      { key: 'seconds', value: state.seconds, label: labels.seconds }
    ],
    [labels.days, labels.hours, labels.minutes, labels.seconds, state.days, state.hours, state.minutes, state.seconds]
  );

  return (
    <motion.div
      className="countdown"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="timer"
      aria-live="polite"
    >
      {segments.map(({ key, value, label }) => (
        <motion.div key={key} className="time-card" variants={cardVariants}>
          <AnimatePresence mode="wait">
            <motion.span
              key={value}
              className="time-value"
              variants={numberVariants}
              initial="initial"
              animate="animate"
              exit="initial"
              aria-label={`${value} ${label}`}
            >
              {value.toString().padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
          <span className="time-label">{label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
