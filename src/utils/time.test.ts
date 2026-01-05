import { DateTime } from 'luxon';
import { getCountdownParts, getTargetDate, TARGET_ISO } from './time';

describe('getCountdownParts', () => {
  it('returns zeroed values when past', () => {
    const target = DateTime.fromISO(TARGET_ISO);
    const now = target.plus({ minutes: 10 });

    const result = getCountdownParts(now, target);

    expect(result.isPast).toBe(true);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it('calculates remaining time precisely', () => {
    const target = DateTime.fromISO(TARGET_ISO);
    const now = target.minus({ days: 1, hours: 2, minutes: 3, seconds: 4 });

    const result = getCountdownParts(now, target);

    expect(result.isPast).toBe(false);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(2);
    expect(result.minutes).toBe(3);
    expect(result.seconds).toBe(4);
  });
});

describe('getTargetDate', () => {
  it('returns date in provided zone', () => {
    const target = getTargetDate('Europe/Paris');
    expect(target.zoneName).toBe('Europe/Paris');
  });
});
