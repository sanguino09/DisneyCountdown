import { DateTime } from 'luxon';

export const TARGET_ISO = '2026-02-25T09:30:00';
export const TARGET_ZONE_DEFAULT = 'Europe/Paris';

export function getTargetDate(zone = TARGET_ZONE_DEFAULT) {
  return DateTime.fromISO(TARGET_ISO, { zone });
}

export function getCountdownParts(now: DateTime, target: DateTime) {
  const diff = target.diff(now, ['milliseconds']);
  const totalMs = diff.milliseconds;

  if (totalMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      totalMs
    } as const;
  }

  const duration = target.diff(now, ['days', 'hours', 'minutes', 'seconds']).shiftTo(
    'days',
    'hours',
    'minutes',
    'seconds'
  );

  const days = Math.floor(duration.days);
  const hours = Math.floor(duration.hours);
  const minutes = Math.floor(duration.minutes);
  const seconds = Math.floor(duration.seconds % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
    totalMs
  } as const;
}
