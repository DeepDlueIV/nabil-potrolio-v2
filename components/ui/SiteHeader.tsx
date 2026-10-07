'use client';

import { useMotionPreference } from './MotionProvider';

const navigation = [
  ['About', '#about'],
  ['Expertise', '#expertise'],
  ['Architecture', '#architecture'],
  ['Experience', '#experience'],
  ['Technology', '#technology'],
] as const;

export function SiteHeader() {
  const { preference, setPreference } = useMotionPreference();
  const playing = preference === 'full';
  return (
    <header className="site-header">
      <a className="site-mark" href="#top" aria-label="Nabil Rakdani, back to top">
        NR<span aria-hidden="true">/</span>
      </a>
      <nav aria-label="Primary navigation">
        {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <div className="site-header__actions">
        <button className="motion-toggle" type="button" aria-label={playing ? 'Pause animations' : 'Play animations'} aria-pressed={playing} onClick={() => setPreference(playing ? 'reduced' : 'full')}>
          <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span> Motion
        </button>
        <a className="header-contact" href="#contact">Start a conversation <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}
