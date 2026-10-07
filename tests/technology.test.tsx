import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TechnologyExplorer } from '@/components/technology/TechnologyExplorer';
import { PresentationProvider } from '@/components/presentation/PresentationProvider';
import { MotionProvider } from '@/components/ui/MotionProvider';

describe('technology purpose presentation', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it('lets visitors select a group using the capability cards above the tool', () => {
    render(<TechnologyExplorer />);
    const show = screen.getByRole('figure', { name: 'Technology purpose presentation' });
    const card = within(show).getByText('Events & semantic context').closest('button');
    expect(card).not.toBeNull();
    fireEvent.click(card!);
    expect(within(show).getByRole('heading', { name: 'Apache Kafka' })).toBeInTheDocument();
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(within(show).getAllByRole('button', { name: /^Data & streaming/ })).toHaveLength(1);
    expect(within(show).queryByText('Continue presentation')).toBeNull();
  });

  it('keeps playback paused when a mouse click first focuses the pause control', () => {
    render(<TechnologyExplorer />);
    const pause = screen.getByRole('button', { name: 'Pause technology presentation' });
    fireEvent.focus(pause);
    fireEvent.click(pause);
    act(() => vi.advanceTimersByTime(5000));
    const show = screen.getByRole('figure', { name: 'Technology purpose presentation' });
    expect(within(show).getByRole('heading', { name: 'vLLM' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Resume technology presentation' }));
    act(() => vi.advanceTimersByTime(4500));
    expect(within(show).getByRole('heading', { name: 'CUDA' })).toBeInTheDocument();
  });

  it('makes the complete six-group stack readable without interaction', () => {
    render(<TechnologyExplorer />);
    const stack = screen.getByRole('region', { name: 'Complete technology stack' });
    expect(within(stack).getAllByRole('heading', { level: 3 })).toHaveLength(6);
    expect(within(stack).getAllByRole('listitem')).toHaveLength(34);
    expect(stack).toHaveTextContent('SOC 2 — Audit-readiness context, not a claimed certification');
    expect(stack).toHaveTextContent('OVH — Bare-metal infrastructure option');
    expect(stack).toHaveTextContent('Rust — Safe systems programming');
    expect(within(stack).queryAllByRole('button')).toHaveLength(0);
    expect(stack.querySelector('details')).toBeNull();
  });

  it('finishes two meaningful compute steps before presenting the next group', () => {
    render(<TechnologyExplorer />);
    const show = screen.getByRole('figure', { name: 'Technology purpose presentation' });
    expect(within(show).getByRole('heading', { name: 'vLLM' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4499));
    expect(within(show).getByRole('heading', { name: 'vLLM' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(within(show).getByRole('heading', { name: 'CUDA' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4500));
    expect(within(show).getByRole('heading', { name: 'Apache Kafka' })).toBeInTheDocument();
    for (const tool of ['Qdrant', 'Kubernetes', 'Terraform', 'Vault', 'Prometheus', 'vLLM']) {
      act(() => vi.advanceTimersByTime(4500));
      expect(within(show).getByRole('heading', { name: tool })).toBeInTheDocument();
    }
    expect(show.querySelector('[aria-live]')).toBeNull();
  });

  it('holds a manual group even at an expiring deadline and resumes explicitly', () => {
    render(<TechnologyExplorer />);
    act(() => vi.advanceTimersByTime(4499));
    fireEvent.click(screen.getByRole('button', { name: 'Security & observability' }));
    act(() => vi.advanceTimersByTime(20000));
    const show = screen.getByRole('figure', { name: 'Technology purpose presentation' });
    expect(within(show).getByRole('heading', { name: 'Vault' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Resume technology presentation' }));
    act(() => vi.advanceTimersByTime(4500));
    expect(within(show).getByRole('heading', { name: 'Prometheus' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pause technology presentation' })).toBeInTheDocument();
  });

  it('pauses the readable presentation on hover and holds keyboard focus', () => {
    render(<TechnologyExplorer />);
    const show = screen.getByRole('figure', { name: 'Technology purpose presentation' });
    fireEvent.mouseEnter(show);
    act(() => vi.advanceTimersByTime(10000));
    expect(within(show).getByRole('heading', { name: 'vLLM' })).toBeInTheDocument();
    fireEvent.mouseLeave(show);
    act(() => vi.advanceTimersByTime(4500));
    expect(within(show).getByRole('heading', { name: 'CUDA' })).toBeInTheDocument();
    fireEvent.focus(screen.getByRole('button', { name: 'Compute' }));
    act(() => vi.advanceTimersByTime(10000));
    expect(within(show).getByRole('heading', { name: 'CUDA' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resume technology presentation' })).toBeInTheDocument();
  });

  it('preserves the current step in a hidden tab and restarts its viewing time', () => {
    render(<PresentationProvider><TechnologyExplorer /></PresentationProvider>);
    const show = screen.getByRole('figure', { name: 'Technology purpose presentation' });
    act(() => vi.advanceTimersByTime(4000));
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    fireEvent(document, new Event('visibilitychange'));
    act(() => vi.advanceTimersByTime(20000));
    expect(within(show).getByRole('heading', { name: 'vLLM' })).toBeInTheDocument();
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    fireEvent(document, new Event('visibilitychange'));
    act(() => vi.advanceTimersByTime(4499));
    expect(within(show).getByRole('heading', { name: 'vLLM' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(within(show).getByRole('heading', { name: 'CUDA' })).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it('keeps all content readable and group selection available with reduced motion', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    render(<MotionProvider><TechnologyExplorer /></MotionProvider>);
    act(() => vi.advanceTimersByTime(20));
    act(() => vi.advanceTimersByTime(20000));
    const show = screen.getByRole('figure', { name: 'Technology purpose presentation' });
    expect(within(show).getByRole('heading', { name: 'vLLM' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Data & streaming' }));
    expect(within(show).getByRole('heading', { name: 'Apache Kafka' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Complete technology stack' })).toHaveTextContent('TensorRT-LLM');
  });
});
