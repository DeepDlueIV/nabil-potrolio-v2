import { profile } from '@/data/profile';
import { ExperienceShowcase } from './ExperienceShowcase';
import './experience-showcase.css';

export function Experience() {
  return <section id="experience" className="experience-section light-chapter" aria-labelledby="experience-title">
    <div className="chapter-intro chapter-intro--experience">
      <p className="technical-label">04 / EXPERIENCE · 2019 — PRESENT</p>
      <h2 id="experience-title">Seven years, one continuous systems perspective.</h2>
      <p>From performance-critical software to the infrastructure that makes private AI operable.</p>
    </div>
    <ExperienceShowcase />
    <section className="career-chronology" aria-label="Career chronology">
      {profile.experience.map((role, index) => <article key={role.id}>
        <div className="career-period"><span className="technical-label">0{profile.experience.length - index}</span><p>{role.dates}</p></div>
        <div className="career-role"><h3>{role.title}</h3><p>{role.organization}</p><small>{role.technologies.join(' · ')}</small></div>
        <div className="career-evidence"><p>{role.description}</p><ul>{role.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </article>)}
    </section>
  </section>;
}
