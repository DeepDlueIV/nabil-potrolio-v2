import Image from 'next/image';
import { profile } from '@/data/profile';
import './about.css';

export function About() {
  return (
    <section id="about" className={`about-section${profile.portrait ? '' : ' about-section--text'}`} aria-labelledby="about-title">
      {profile.portrait ? <figure className="about-portrait">
        <Image src={profile.portrait.src} alt={profile.portrait.alt} width={1000} height={1250}
          sizes="(max-width: 720px) 90vw, (max-width: 1080px) 42vw, 36vw"
          style={{ objectPosition: profile.portrait.objectPosition }} />
        <figcaption>{profile.name} <span>{profile.location}</span></figcaption>
      </figure> : null}
      <div className="about-copy">
        <p className="technical-label">01 / ABOUT</p>
        <h2 id="about-title">The person<br />behind the system.</h2>
        <p className="about-introduction">I’m Nabil Rakdani, a Principal AI &amp; High-Performance Systems Architect and Fractional CTO based in Pavia, Italy. My seven years of experience span performance-critical software, cloud infrastructure and private AI platforms.</p>
        <p>I work where models, data and infrastructure need to become an operable system: GPU-backed inference, distributed processing, vector retrieval, observability and clearly defined security boundaries.</p>
        <p>As an independent architect and fractional CTO, I help enterprises and growth-stage companies work through architecture decisions, technical debt, infrastructure costs and engineering roadmaps. My work combines hands-on systems engineering with architectural direction and technical leadership.</p>
        <p className="about-availability">Available for global B2B consulting, architecture advisory and fractional CTO engagements.</p>
        <p className="about-languages">{profile.languages.map((language) => language.replace(' / ', ' — ')).join(' · ')}</p>
      </div>
    </section>
  );
}
