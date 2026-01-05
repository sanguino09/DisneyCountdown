import { Language } from '../i18n';

type Props = {
  value: Language;
  onChange: (language: Language) => void;
  ariaLabel?: string;
};

export function LanguageSelector({ value, onChange, ariaLabel }: Props) {
  return (
    <label className="pill" aria-label={ariaLabel ?? 'Language selector'}>
      🌐
      <select
        className="select"
        value={value}
        onChange={(event) => onChange(event.target.value as Language)}
        aria-label={ariaLabel ?? 'Language'}
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
        <option value="fr">FR</option>
      </select>
    </label>
  );
}
