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
  const imageCache = useRef(new Map<number, Promise<boolean>>());
  const container = useRef<HTMLDivElement | null>(null);
  const { ref: registerRef, step, held, progressKey, duration, running, select, resume, interactionProps } = usePresentation({ id: 'experience', durations, readyStep, pauseOnHover: true });
  const prepare = useCallback((index: number) => {
    const cached = imageCache.current.get(index);
    if (cached) return cached;
    const request = new Promise<boolean>((resolve) => {
      const { props } = getImageProps({ src: images[index], alt: '', fill: true, sizes });
      const image = new window.Image();
      image.onload = () => { void image.decode().then(() => resolve(true), () => resolve(false)); };
      image.onerror = () => resolve(false);
      image.sizes = props.sizes ?? sizes;
      image.srcset = props.srcSet ?? '';
      image.src = props.src;
    });
    imageCache.current.set(index, request);
    return request;
  }, []);
  const frame = useReadyFrame(step, prepare, near, setReadyStep);
  const role = profile.experience[frame.index];
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

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
      {frame.previous !== null ? <Image className="experience-photo--previous" src={images[frame.previous]} alt="" fill sizes={sizes} aria-hidden="true" style={{ objectPosition: profile.experience[frame.previous].imagePosition }} /> : null}
      {frame.failed ? <div className="experience-photo-fallback"><span>{role.domain}</span><p>Systems, from software to infrastructure.</p></div> : <Image
        key={frame.index} className={frame.ready ? 'experience-photo--current' : ''}
        src={images[frame.index]} alt={role.imageAlt} fill sizes={sizes}
        placeholder={typeof images[frame.index] === 'string' ? 'empty' : 'blur'} style={{ objectPosition: role.imagePosition }} />}
      <p className="experience-photo-caption">Editorial infrastructure imagery</p>
    </div>
    <div className="experience-frame-copy">
      <p className="technical-label">0{frame.index + 1} / 04 · {role.dates}</p>
      <h3>{role.title}</h3>
      <p>{role.domain}</p>
      <div className="experience-frame-navigation" aria-label="Experience frames">
        {profile.experience.map((candidate, index) => <button key={candidate.id} ref={(node) => { buttons.current[index] = node; }}
          type="button" aria-label={`Show experience frame ${index + 1}`} aria-pressed={step === index}
          onClick={() => select(index)} onKeyDown={(event) => key(event, index)}>{String(index + 1).padStart(2, '0')}</button>)}
      </div>
      <div className="presentation-progress" aria-hidden="true"><span key={progressKey} style={{ animationDuration: `${duration}ms`, animationPlayState: running ? 'running' : 'paused' }} /></div>
      {held ? <button className="presentation-continue" type="button" onClick={resume}>Continue presentation <span aria-hidden="true">→</span></button> : null}
    </div>
  </div>;
}
