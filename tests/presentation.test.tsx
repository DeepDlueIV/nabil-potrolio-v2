import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PresentationProvider } from '@/components/presentation/PresentationProvider';
import { usePresentation } from '@/components/presentation/usePresentation';

let notify: IntersectionObserverCallback;
class Observer {
  constructor(callback: IntersectionObserverCallback) { notify = callback; }
  observe() {}
  unobserve() {}
  disconnect() {}
}

function Demo({ id = 'one', ready = true }: { id?: string; ready?: boolean }) {
  const { ref, step, held, select, resume, interactionProps } = usePresentation({ id, durations: [1000, 2000], ready, pauseOnHover: true });
  return <section ref={ref} data-testid={id} {...interactionProps}>
    <output>{id}:{step}:{held ? 'held' : 'auto'}</output>
    <button onClick={() => select(1)}>Select {id}</button>
    <button onClick={resume}>Continue {id}</button>
  </section>;
}

function visible(id: string, ratio = .8) {
  act(() => {
    notify([{ target: screen.getByTestId(id), intersectionRatio: ratio, isIntersecting: ratio > 0 } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
  });
}

describe('presentation scheduling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('IntersectionObserver', Observer);
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
  });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it('advances visible ready steps and loops after their full durations', () => {
    render(<PresentationProvider><Demo /></PresentationProvider>);
    visible('one');
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('one:1:auto')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText('one:0:auto')).toBeInTheDocument();
  });

  it('manual selection cancels a near-expired timer and holds until explicit resume', () => {
    render(<PresentationProvider><Demo /></PresentationProvider>);
    visible('one');
    act(() => vi.advanceTimersByTime(999));
    fireEvent.click(screen.getByText('Select one'));
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByText('one:1:held')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Continue one'));
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText('one:0:auto')).toBeInTheDocument();
  });

  it('does not count loading time as viewing time', () => {
    const { rerender } = render(<PresentationProvider><Demo ready={false} /></PresentationProvider>);
    visible('one');
    act(() => vi.advanceTimersByTime(9000));
    expect(screen.getByText('one:0:auto')).toBeInTheDocument();
    rerender(<PresentationProvider><Demo ready /></PresentationProvider>);
    act(() => vi.advanceTimersByTime(999));
    expect(screen.getByText('one:0:auto')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText('one:1:auto')).toBeInTheDocument();
  });

  it('suspends a hidden page and starts a fresh viewing interval on return', () => {
    render(<PresentationProvider><Demo /></PresentationProvider>);
    visible('one');
    act(() => vi.advanceTimersByTime(900));
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    fireEvent(document, new Event('visibilitychange'));
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByText('one:0:auto')).toBeInTheDocument();
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    fireEvent(document, new Event('visibilitychange'));
    act(() => vi.advanceTimersByTime(999));
    expect(screen.getByText('one:0:auto')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText('one:1:auto')).toBeInTheDocument();
  });

  it('keeps two visible presentations independent even when one is more visible', () => {
    render(<PresentationProvider><Demo /><Demo id="two" /></PresentationProvider>);
    visible('one', .6);
    visible('two', .65);
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('one:1:auto')).toBeInTheDocument();
    expect(screen.getByText('two:1:auto')).toBeInTheDocument();
    visible('two', .9);
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText('two:0:auto')).toBeInTheDocument();
  });

  it('hover pauses temporarily but focus holds after pointer exit', () => {
    render(<PresentationProvider><Demo /></PresentationProvider>);
    visible('one');
    fireEvent.mouseEnter(screen.getByTestId('one'));
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByText('one:0:auto')).toBeInTheDocument();
    fireEvent.mouseLeave(screen.getByTestId('one'));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('one:1:auto')).toBeInTheDocument();
    fireEvent.focus(screen.getByText('Select one'));
    fireEvent.mouseLeave(screen.getByTestId('one'));
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByText('one:1:held')).toBeInTheDocument();
  });

  it('offscreen returns do not catch up missed steps', () => {
    render(<PresentationProvider><Demo /></PresentationProvider>);
    visible('one');
    act(() => vi.advanceTimersByTime(999));
    visible('one', 0);
    act(() => vi.advanceTimersByTime(20000));
    visible('one');
    act(() => vi.advanceTimersByTime(999));
    expect(screen.getByText('one:0:auto')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText('one:1:auto')).toBeInTheDocument();
  });
});
