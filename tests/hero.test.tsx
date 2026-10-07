import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Hero } from '../components/hero/Hero';
import { PresentationProvider } from '../components/presentation/PresentationProvider';

afterEach(() => { vi.useRealTimers(); });

describe('Hero presentation', () => {
  it('keeps identity, seven-year fact and contact actions visible', () => {
    render(<Hero forceFallback />);
    expect(screen.getByRole('heading', { level: 1, name: /intelligence, engineered/i })).toBeVisible();
    expect(screen.getByText('Nabil Rakdani')).toBeVisible();
    expect(screen.getByText(/7 years of experience/i)).toBeVisible();
    expect(screen.getByRole('link', { name: /discuss your infrastructure/i })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('link', { name: /explore the architecture/i })).toHaveAttribute('href', '#architecture');
  });

  it('shows the server, opens its compute tray and demonstrates a request without controls', () => {
    vi.useFakeTimers();
    render(<Hero forceFallback />);
    expect(screen.getByRole('img', { name: /GPU server in a compact rack/i })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'System' })).toHaveAttribute('aria-selected', 'true');
    act(() => { vi.advanceTimersByTime(4000); });
    expect(screen.getByRole('tab', { name: 'Inside' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('compute-poster')).toHaveAttribute('data-phase', 'inside');
    act(() => { vi.advanceTimersByTime(6000); });
    expect(screen.getByRole('tab', { name: 'Data flow' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Requests, context, inference, response.')).toBeVisible();
    act(() => { vi.advanceTimersByTime(6000); });
    expect(screen.getByRole('tab', { name: 'System' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('compute-poster')).toHaveAttribute('data-phase', 'return');
    act(() => { vi.advanceTimersByTime(4000); });
    expect(screen.getByTestId('compute-poster')).toHaveAttribute('data-phase', 'system');
  });

  it('holds a manual phase even at a pending transition and resumes explicitly', () => {
    vi.useFakeTimers();
    render(<Hero forceFallback />);
    act(() => { vi.advanceTimersByTime(3999); });
    fireEvent.click(screen.getByRole('tab', { name: 'Inside' }));
    act(() => { vi.advanceTimersByTime(30000); });
    expect(screen.getByRole('tab', { name: 'Inside' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Resume server presentation' }));
    expect(screen.getByRole('button', { name: 'Pause server presentation' })).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(6000); });
    expect(screen.getByRole('tab', { name: 'Data flow' })).toHaveAttribute('aria-selected', 'true');
  });

  it('holds the currently selected phase and supports keyboard phase navigation', async () => {
    const user = userEvent.setup();
    render(<Hero forceFallback />);
    const system = screen.getByRole('tab', { name: 'System' });
    await user.click(system);
    expect(screen.getByRole('button', { name: 'Resume server presentation' })).toBeVisible();
    await user.keyboard('{ArrowRight}');
    const inside = screen.getByRole('tab', { name: 'Inside' });
    expect(inside).toHaveFocus();
    expect(inside).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('button', { name: /pause motion|exploded|select data layer/i })).not.toBeInTheDocument();
  });

  it('keeps auto changes silent and does not freeze when hovered', () => {
    vi.useFakeTimers();
    const { container } = render(<Hero forceFallback />);
    fireEvent.mouseEnter(screen.getByTestId('compute-scene'));
    act(() => { vi.advanceTimersByTime(4000); });
    expect(screen.getByRole('tab', { name: 'Inside' })).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelector('[aria-live]')).toBeNull();
  });

  it('stops while the page is hidden and gives the current frame its full time after returning', () => {
    vi.useFakeTimers();
    render(<PresentationProvider><Hero forceFallback /></PresentationProvider>);
    act(() => { vi.advanceTimersByTime(2500); });
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    fireEvent(document, new Event('visibilitychange'));
    act(() => { vi.advanceTimersByTime(30000); });
    expect(screen.getByRole('tab', { name: 'System' })).toHaveAttribute('aria-selected', 'true');
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    fireEvent(document, new Event('visibilitychange'));
    act(() => { vi.advanceTimersByTime(3999); });
    expect(screen.getByRole('tab', { name: 'System' })).toHaveAttribute('aria-selected', 'true');
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByRole('tab', { name: 'Inside' })).toHaveAttribute('aria-selected', 'true');
  });
});
