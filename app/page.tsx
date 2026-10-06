import { architectureScenarios } from '@/data/architecture-scenarios';
import { engagements, expertise, profile } from '@/data/profile';
import { technologies } from '@/data/technologies';

export default function HomePage() {
  return (
    <main id="main-content">
      <a className="skip-link" href="#expertise">Skip to content</a>

      <section className="foundation-hero" aria-labelledby="hero-title">
        <p className="kicker">Nabil Rakdani · Principal AI &amp; High-Performance Systems Architect</p>
        <h1 id="hero-title">Intelligence,<br />engineered.</h1>
        <p className="foundation-lede">{profile.description}</p>
        <p className="technical-label">{profile.location} · {profile.availability} · {profile.years} years of experience</p>
        <nav aria-label="Primary">
          <a className="button" href="#contact">Discuss your infrastructure</a>
          <a className="text-link" href="#architecture">Explore the architecture</a>
        </nav>
      </section>

      <section id="expertise" className="foundation-section light-section" aria-labelledby="expertise-title">
        <p className="technical-label">01 / EXPERTISE</p>
        <h2 id="expertise-title">Architecture starts with the system constraint.</h2>
        <div className="foundation-grid">
          {expertise.map((area) => (
            <article key={area.id}>
              <p className="technical-label">{area.problem}</p>
              <h3>{area.title}</h3>
              <p>{area.approach}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="architecture" className="foundation-section" aria-labelledby="architecture-title">
        <p className="technical-label">02 / ARCHITECTURE PLAYGROUND</p>
        <h2 id="architecture-title">Systems you can inspect, not claims you have to trust.</h2>
        <div className="foundation-grid">
          {architectureScenarios.map((scenario) => (
            <article key={scenario.id}>
              <p className="technical-label">{scenario.eyebrow}</p>
              <h3>{scenario.label}</h3>
              <p>{scenario.summary}</p>
              <small>{scenario.disclaimer}</small>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="foundation-section light-section" aria-labelledby="experience-title">
        <p className="technical-label">03 / EXPERIENCE · 2019 — PRESENT</p>
        <h2 id="experience-title">Seven years across compute, infrastructure, and technical direction.</h2>
        {profile.experience.map((role) => (
          <article className="foundation-role" key={role.id}>
            <p className="technical-label">{role.dates}</p>
            <h3>{role.title}</h3>
            <p>{role.organization} · {role.description}</p>
          </article>
        ))}
      </section>

      <section id="technology" className="foundation-section" aria-labelledby="technology-title">
        <p className="technical-label">04 / TECHNOLOGY EXPLORER</p>
        <h2 id="technology-title">Tools placed where they do useful work.</h2>
        <div className="foundation-grid">
          {technologies.map((group) => (
            <article key={group.id}>
              <h3>{group.label}</h3>
              <p>{group.items.map((item) => item.name).join(' · ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="engagement" className="foundation-section" aria-labelledby="engagement-title">
        <p className="technical-label">05 / ENGAGEMENT</p>
        <h2 id="engagement-title">Bring the hard infrastructure question.</h2>
        <div className="foundation-grid">
          {engagements.map((engagement) => (
            <article key={engagement.id}>
              <h3>{engagement.title}</h3>
              <p>{engagement.prompt}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="foundation-section contact-foundation" aria-labelledby="contact-title">
        <p className="technical-label">06 / START A CONVERSATION</p>
        <h2 id="contact-title">Let&apos;s make the system legible.</h2>
        <p>Share the infrastructure constraint, decision, or transition you need to work through.</p>
        <p className="technical-label">Contacts are intentionally not fabricated. A project brief can be copied locally until a verified email is configured.</p>
      </section>
    </main>
  );
}
