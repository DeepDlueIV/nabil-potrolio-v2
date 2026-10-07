'use client';

import { useEffect } from 'react';
import { useMotionPreference } from './MotionProvider';

export function AnchorNavigation() {
  const { preference } = useMotionPreference();
  useEffect(() => {
    let frame = 0;
    const cancel = () => { cancelAnimationFrame(frame); frame = 0; };
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!link || link.hasAttribute('download') || link.target && link.target !== '_self') return;
      const hash = link.hash;
      let target: HTMLElement | null;
      try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
      if (!target) return;
      cancel();
      if (preference === 'reduced') return;
      event.preventDefault();
      const start = window.scrollY;
      const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 74;
      const destination = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, start + target.getBoundingClientRect().top - header - 14));
      if (location.hash !== hash) history.pushState(null, '', hash);
      const began = performance.now();
      const duration = Math.min(950, 450 + Math.abs(destination - start) * .08);
      // Анимируем только переход по ссылке: пользовательская прокрутка отменяет его.
      const tick = (now: number) => {
        const t = Math.min(1, (now - began) / duration);
        const eased = t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
        window.scrollTo({ top: start + (destination - start) * eased, behavior: 'instant' });
        if (t < 1) frame = requestAnimationFrame(tick);
        else {
          frame = 0;
          if (event.detail === 0) {
            const oldTabIndex = target.getAttribute('tabindex');
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
            if (oldTabIndex === null) target.removeAttribute('tabindex');
            else target.setAttribute('tabindex', oldTabIndex);
          }
        }
      };
      frame = requestAnimationFrame(tick);
    };
    const key = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancel();
    };
    document.addEventListener('click', navigate);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('pointerdown', cancel, { passive: true });
    window.addEventListener('keydown', key);
    window.addEventListener('popstate', cancel);
    return () => {
      cancel();
      document.removeEventListener('click', navigate);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('pointerdown', cancel);
      window.removeEventListener('keydown', key);
      window.removeEventListener('popstate', cancel);
    };
  }, [preference]);
  return null;
}
