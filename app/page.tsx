import { ArchitecturePlayground } from '@/components/architecture/ArchitecturePlayground';
import { Hero } from '@/components/hero/Hero';
import { engagements, expertise, profile } from '@/data/profile';
import { technologies } from '@/data/technologies';

export default function HomePage() {
  return (
    <main id="main-content">
      <a className="skip-link" href="#expertise">Skip to content</a>
      <Hero />

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

      <ArchitecturePlayground />

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
