'use client';

import Image, { getImageProps } from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { profile } from '@/data/profile';
import { usePresentation } from '../presentation/usePresentation';
import { useReadyFrame } from './useReadyFrame';
import datacenter from '@/public/images/experience-datacenter.webp';
import network from '@/public/images/experience-network.webp';
import systems from '@/public/images/experience-systems.webp';
import hardware from '@/public/images/experience-hardware.webp';

const images = [datacenter, network, systems, hardware];
const sizes = '(max-width: 720px) 90vw, (max-width: 1080px) 55vw, 52vw';
const durations = [8000, 8000, 8000, 8000];

export function ExperienceShowcase() {
  const [near, setNear] = useState(false);
  const [readyStep, setReadyStep] = useState(-1);
  const [viewport, setViewport] = useState('initial');
  const [display, setDisplay] = useState<{ index: number; src: string; previous: { index: number; src: string } | null } | null>(null);
  const imageCache = useRef(new Map<string, Promise<boolean>>());
  const decodedSources = useRef(new Map<string, string>());
  const container = useRef<HTMLDivElement | null>(null);
  const { ref: registerRef, step, held, progress, reduced, select, resume, interactionProps } = usePresentation({ id: 'experience', durations, readyStep, pauseOnHover: true });
  const prepare = useCallback((index: number) => {
    const candidateKey = `${viewport}:${index}`;
    const cached = imageCache.current.get(candidateKey);
    if (cached) return cached;
    const request = new Promise<boolean>((resolve) => {
      const { props } = getImageProps({ src: images[index], alt: '', fill: true, sizes });
      const image = new window.Image();
      image.onload = () => { void image.decode().then(() => {
        decodedSources.current.set(candidateKey, image.currentSrc || image.src);
        resolve(true);
      }, () => resolve(false)); };
      image.onerror = () => resolve(false);
      image.sizes = props.sizes ?? sizes;
      image.srcset = props.srcSet ?? '';
      image.src = props.src;
    });
    imageCache.current.set(candidateKey, request);
    return request;
  }, [viewport]);
  const commitReady = useCallback((index: number) => {
    const src = decodedSources.current.get(`${viewport}:${index}`);
    if (src) setDisplay((current) => ({ index, src, previous: current ? { index: current.index, src: current.src } : null }));
    setReadyStep(index);
  }, [viewport]);
  const frame = useReadyFrame(step, prepare, near, commitReady);
  const role = profile.experience[frame.index];
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    // Размер и DPR входят в ключ: готовность другого responsive-кандидата не подходит.
    let previousViewport = '';
    const update = () => {
      const nextViewport = `${window.innerWidth}:${window.devicePixelRatio}`;
      if (nextViewport === previousViewport) return;
      previousViewport = nextViewport;
      setReadyStep(-1);
      setViewport(nextViewport);
    };
    const timer = setTimeout(update, 0);
    window.addEventListener('resize', update);
    return () => { clearTimeout(timer); window.removeEventListener('resize', update); };
  }, []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      const timeout = setTimeout(() => setNear(true), 0);
      return () => clearTimeout(timeout);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); observer.disconnect(); }
    }, { rootMargin: '450px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!frame.ready) return;
    if (near) void prepare((frame.index + 1) % images.length);
  }, [frame.index, frame.ready, near, prepare]);

  const ref = useCallback((element: HTMLDivElement | null) => { container.current = element; registerRef(element); }, [registerRef]);
  const key = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % images.length;
    else if (event.key === 'ArrowLeft') next = (index + images.length - 1) % images.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = images.length - 1;
    else return;
    event.preventDefault(); select(next); buttons.current[next]?.focus();
  };

  return <div ref={ref} className="experience-showcase" data-frame={frame.index} data-requested={step} data-ready={frame.ready} {...interactionProps}>
    <div className="experience-photograph">
      {!frame.failed && display?.previous ? <Image className="experience-photo--previous" src={display.previous.src} unoptimized alt="" fill aria-hidden="true" style={{ objectPosition: profile.experience[display.previous.index].imagePosition }} /> : null}
      {frame.failed ? <div className="experience-photo-fallback"><span>{role.domain}</span><p>Systems, from software to infrastructure.</p></div> : <Image
        key={display?.src ?? 'initial'} className={frame.ready ? 'experience-photo--current' : ''}
        src={display?.src ?? images[frame.index]} unoptimized={!!display} alt={role.imageAlt} fill sizes={sizes}
        placeholder={!display && typeof images[frame.index] !== 'string' ? 'blur' : 'empty'} style={{ objectPosition: role.imagePosition }} />}
      <p className="experience-photo-caption">Editorial infrastructure imagery</p>
    </div>
    <div className="experience-frame-copy">
      <p className="technical-label">0{frame.index + 1} / 04 · {role.dates}</p>
      {/* Скрытые варианты резервируют высоту по реальному переносу текста, включая мобильный экран. */}
      <div className="experience-title-slot">
        {profile.experience.map((candidate) => <span className="experience-title-measure" aria-hidden="true" key={candidate.id}>{candidate.title}</span>)}
        <h3 key={frame.index}>{role.title}</h3>
      </div>
      <div className="experience-domain-slot">
        {profile.experience.map((candidate) => <span aria-hidden="true" key={candidate.id}>{candidate.domain}</span>)}
        <p>{role.domain}</p>
      </div>
      <div className="experience-frame-navigation" aria-label="Experience frames">
        {profile.experience.map((candidate, index) => <button key={candidate.id} ref={(node) => { buttons.current[index] = node; }}
          type="button" aria-label={`Show experience frame ${index + 1}`} aria-pressed={frame.index === index}
          onClick={() => select(index)} onKeyDown={(event) => key(event, index)}>{String(index + 1).padStart(2, '0')}</button>)}
        {!reduced ? <button className="experience-playback" data-presentation-playback type="button" aria-label={held ? 'Resume experience presentation' : 'Pause experience presentation'}
          onClick={() => { if (held) resume(); else select(frame.index); }}><span aria-hidden="true">{held ? '▶' : 'Ⅱ'}</span></button> : null}
      </div>
      <div className="presentation-progress" aria-hidden="true"><span style={{ animation: 'none', transform: `scaleX(${progress})` }} /></div>
    </div>
  </div>;
}
