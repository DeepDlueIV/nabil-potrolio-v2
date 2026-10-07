import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MotionProvider } from '@/components/ui/MotionProvider';
import { SiteHeader } from '@/components/ui/SiteHeader';
import { usePresentation } from '@/components/presentation/usePresentation';

function Presentation() {
  const { step, running } = usePresentation({ id: 'motion-test', durations: [1000, 1000] });
  return <output>{step}:{String(running)}</output>;
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); localStorage.clear(); });

it('plays the presentation even when system animation effects are disabled', () => {
  render(<MotionProvider><Presentation /></MotionProvider>);
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByText('1:true')).toBeInTheDocument();
});

it('lets the visitor stop motion and remembers that choice on the next visit', () => {
  const first = render(<MotionProvider><SiteHeader /><Presentation /></MotionProvider>);
  fireEvent.click(screen.getByRole('button', { name: 'Pause animations' }));
  act(() => vi.advanceTimersByTime(3000));
  expect(screen.getByText('0:false')).toBeInTheDocument();
  first.unmount();
  render(<MotionProvider><SiteHeader /><Presentation /></MotionProvider>);
  act(() => vi.advanceTimersByTime(20));
  expect(screen.getByText('0:false')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Play animations' }));
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByText('1:true')).toBeInTheDocument();
});
