import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ArchitecturePlayground } from '../components/architecture/ArchitecturePlayground';

const diagram = () => screen.getByTestId('architecture-diagram');
const advance = () => act(() => { vi.advanceTimersByTime(3200); });

describe('Architecture presentation', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts healthy and completes five stages before changing scenarios', () => {
    render(<ArchitecturePlayground />);
    expect(diagram()).toHaveAttribute('data-status', 'running');
    advance();
    expect(screen.getByText('Context retrieval')).toBeVisible();
    advance();
    expect(diagram()).toHaveAttribute('data-load', 'burst');
    advance();
    expect(diagram()).toHaveAttribute('data-status', 'rerouted');
    expect(diagram()).toHaveAttribute('data-route', 'app>gateway>retrieval>vector-store>retrieval>inference-b>gateway>app');
    advance();
    expect(diagram()).toHaveAttribute('data-status', 'running');
    expect(screen.getByRole('tab', { name: 'Private LLM / RAG' })).toHaveAttribute('aria-selected', 'true');
    advance();
    expect(screen.getByRole('tab', { name: 'Streaming Data Platform' })).toHaveAttribute('aria-selected', 'true');
  });

  it('holds a manual scenario near a transition until explicit continuation', () => {
    render(<ArchitecturePlayground />);
    act(() => { vi.advanceTimersByTime(3199); });
    fireEvent.click(screen.getByRole('tab', { name: 'Secure Enterprise AI' }));
    act(() => { vi.advanceTimersByTime(40000); });
    expect(diagram()).toHaveAttribute('data-route', 'enterprise-user>identity>policy>private-inference>response');
    fireEvent.click(screen.getByRole('button', { name: 'Continue presentation' }));
    advance(); advance(); advance();
    expect(diagram()).toHaveAttribute('data-status', 'queued');
    expect(diagram()).toHaveAttribute('data-route', 'enterprise-user>identity>policy');
    advance();
    expect(diagram()).toHaveAttribute('data-status', 'running');
  });

  it('keeps all summaries readable without node controls or automatic announcements', () => {
    render(<ArchitecturePlayground />);
    expect(screen.getByRole('heading', { name: 'Private LLM / RAG' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Streaming Data Platform' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Secure Enterprise AI' })).toBeVisible();
    expect(screen.queryByRole('button', { name: /inspect/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Continue presentation' })).not.toBeInTheDocument();
  });

  it('supports keyboard selection while keeping focus and holding the chosen scenario', () => {
    render(<ArchitecturePlayground />);
    const first = screen.getByRole('tab', { name: 'Private LLM / RAG' });
    act(() => first.focus());
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    const streaming = screen.getByRole('tab', { name: 'Streaming Data Platform' });
    expect(streaming).toHaveFocus();
    act(() => { vi.advanceTimersByTime(40000); });
    expect(streaming).toHaveAttribute('aria-selected', 'true');
  });

  it('does not move focus during automatic transitions', () => {
    render(<ArchitecturePlayground />);
    const initialFocus = document.activeElement;
    for (let index = 0; index < 5; index++) advance();
    expect(document.activeElement).toBe(initialFocus);
  });

  it('returns keyboard focus to the selected scenario on continuation', () => {
    render(<ArchitecturePlayground />);
    fireEvent.click(screen.getByRole('tab', { name: 'Streaming Data Platform' }));
    const resume = screen.getByRole('button', { name: 'Continue presentation' });
    act(() => resume.focus());
    fireEvent.click(resume);
    expect(screen.getByRole('tab', { name: 'Streaming Data Platform' })).toHaveFocus();
    advance();
    expect(screen.getByText('Stream processing')).toBeVisible();
  });
});
