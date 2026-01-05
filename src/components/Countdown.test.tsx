import { render, screen } from '@testing-library/react';
import Countdown from './Countdown';

vi.useFakeTimers();

const timezone = 'Europe/Paris';

describe('Countdown component', () => {
  it('renders labels and values', () => {
    vi.setSystemTime(new Date('2026-02-24T09:30:00Z'));

    render(<Countdown language="es" timezone={timezone} />);

    expect(screen.getByText(/días/i)).toBeInTheDocument();
    expect(screen.getByText(/horas/i)).toBeInTheDocument();
  });

  it('counts down towards target', () => {
    const start = new Date('2026-02-24T08:30:00Z');
    vi.setSystemTime(start);

    const { container } = render(<Countdown language="en" timezone={timezone} />);

    const values = container.querySelectorAll('.time-value');
    expect(values.length).toBeGreaterThan(0);
    values.forEach((node) => {
      expect(node.textContent).toMatch(/\\d{2}/);
    });
  });
});
