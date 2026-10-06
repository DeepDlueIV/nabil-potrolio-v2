import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Hero } from '../components/hero/Hero';

describe('Hero', () => {
  it('keeps identity, positioning, seven-year fact, and primary actions visible immediately', () => {
    render(<Hero />);

    expect(screen.getByRole('heading', { level: 1, name: /intelligence, engineered/i })).toBeVisible();
    expect(screen.getByText(/Nabil Rakdani/)).toBeVisible();
    expect(screen.getByText(/7 years of experience/i)).toBeVisible();
    expect(screen.getByRole('link', { name: /discuss your infrastructure/i })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('link', { name: /explore the architecture/i })).toHaveAttribute('href', '#architecture');
  });

  it('switches between physically described assembled and exploded modes', async () => {
    const user = userEvent.setup();
    render(<Hero />);

    expect(screen.getByRole('status', { name: /scene mode/i })).toHaveTextContent('Assembled view active');
    await user.click(screen.getByRole('button', { name: 'Exploded' }));
    expect(screen.getByRole('status', { name: /scene mode/i })).toHaveTextContent('Exploded view active');
    expect(screen.getByTestId('compute-poster')).toHaveAttribute('data-mode', 'exploded');
  });

  it('exposes component selection and a meaningful explanation outside the canvas', async () => {
    const user = userEvent.setup();
    render(<Hero />);

    await user.click(screen.getByRole('button', { name: /select data layer/i }));
    expect(screen.getByRole('status', { name: /selected component/i })).toHaveTextContent(/retrieval context and operational state/i);
    expect(screen.getByTestId('compute-poster')).toHaveAttribute('data-selected', 'data');
  });

  it('moves narrative tab selection and focus with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Hero forceFallback />);
    const compute = screen.getByRole('tab', { name: /compute/i });

    compute.focus();
    await user.keyboard('{ArrowRight}');

    const orchestration = screen.getByRole('tab', { name: /orchestration/i });
    expect(orchestration).toHaveFocus();
    expect(orchestration).toHaveAttribute('aria-selected', 'true');
  });

  it('offers an explicit motion pause and a complete fallback illustration', async () => {
    const user = userEvent.setup();
    render(<Hero forceFallback />);

    expect(screen.getByRole('img', { name: /illustrated private compute cluster/i })).toBeVisible();
    expect(within(screen.getByTestId('compute-poster')).getByText(/fallback system view: four accelerator blades/i)).toBeVisible();
    await user.click(screen.getByRole('button', { name: /pause motion/i }));
    expect(screen.getByRole('button', { name: /resume motion/i })).toHaveAttribute('aria-pressed', 'true');
  });
});
