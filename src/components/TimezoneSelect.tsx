import timezones from '../data/timezones';

type Props = {
  value: string;
  onChange: (tz: string) => void;
  ariaLabel?: string;
};

export function TimezoneSelect({ value, onChange, ariaLabel }: Props) {
  return (
    <label className="pill" aria-label={ariaLabel}>
      🕓
      <select
        className="select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
      >
        {timezones.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
          </option>
        ))}
      </select>
    </label>
  );
}
