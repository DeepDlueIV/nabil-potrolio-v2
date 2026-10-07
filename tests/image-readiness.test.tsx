import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useReadyFrame } from '@/components/experience/useReadyFrame';

describe('experience image readiness', () => {
  afterEach(() => vi.useRealTimers());

  it('keeps the previous coherent frame until the requested image decodes', async () => {
    let finish: (value: boolean) => void = () => undefined;
    const prepare = (index: number) => index === 0 ? Promise.resolve(true) : new Promise<boolean>((resolve) => { finish = resolve; });
    const { result, rerender } = renderHook(({ requested }) => useReadyFrame(requested, prepare), { initialProps: { requested: 0 } });
    await act(async () => { await Promise.resolve(); });
    rerender({ requested: 1 });
    expect(result.current.index).toBe(0);
    await act(async () => finish(true));
    expect(result.current).toMatchObject({ index: 1, ready: true, failed: false });
  });

  it('ignores stale decodes after a newer manual selection', async () => {
    const pending = new Map<number, (value: boolean) => void>();
    const prepare = (index: number) => new Promise<boolean>((resolve) => pending.set(index, resolve));
    const { result, rerender } = renderHook(({ requested }) => useReadyFrame(requested, prepare), { initialProps: { requested: 0 } });
    rerender({ requested: 1 });
    rerender({ requested: 2 });
    await act(async () => pending.get(2)?.(true));
    await act(async () => pending.get(1)?.(true));
    expect(result.current.index).toBe(2);
  });

  it('uses a bounded fallback for a hung image instead of freezing the presentation', () => {
    vi.useFakeTimers();
    const prepare = () => new Promise<boolean>(() => undefined);
    const { result } = renderHook(() => useReadyFrame(3, prepare));
    act(() => vi.advanceTimersByTime(6000));
    expect(result.current).toMatchObject({ index: 3, ready: true, failed: true });
  });
});
