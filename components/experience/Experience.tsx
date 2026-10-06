'use client';

import Image from 'next/image';
import { useState } from 'react';
import { profile } from '@/data/profile';

export function Experience() {
  const [activeId, setActiveId] = useState(profile.experience[0].id);
  const activeRole = profile.experience.find((role) => role.id === activeId) ?? profile.experience[0];

  return (
    <section id="experience" className="experience-section light-chapter" aria-labelledby="experience-title">
      <div className="chapter-intro chapter-intro--experience">
        <p className="technical-label">03 / EXPERIENCE · 2019 — PRESENT</p>
        <h2 id="experience-title">Seven years, one continuous systems perspective.</h2>
        <p>The timeline is calibrated to the verified seven-year span. Select a role to inspect its technical focus.</p>
      </div>

      <div className="experience-console">
        <div className="experience-timeline" role="tablist" aria-label="Experience roles">
          {profile.experience.map((role) => (
            <button
              key={role.id}
              type="button"
              role="tab"
              aria-selected={role.id === activeRole.id}
              aria-controls="experience-role-panel"
              onClick={() => setActiveId(role.id)}
              className={role.id === activeRole.id ? 'is-active' : undefined}
              aria-label={`Show ${role.title}`}
            >
              <span className="technical-label">{role.dates}</span>
              <strong>{role.title}</strong>
            </button>
          ))}
        </div>

        <article id="experience-role-panel" className="experience-panel" role="tabpanel">
          <div className="experience-image">
            <Image
              key={activeRole.image}
              src={activeRole.image}
              alt={activeRole.imageAlt}
              fill
              sizes="(max-width: 720px) 100vw, 48vw"
              style={{ objectPosition: activeRole.imagePosition }}
              priority={activeRole.id === profile.experience[0].id}
            />
            <p className="technical-label">Editorial reference / not a client site</p>
          </div>
          <div className="experience-detail">
            <p className="technical-label">{activeRole.dates} · {activeRole.domain}</p>
            <h3>{activeRole.title}</h3>
            <p className="experience-organization">{activeRole.organization}</p>
            <p>{activeRole.description}</p>
            <ul>
              {activeRole.responsibilities.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="experience-stack">{activeRole.technologies.join(' · ')}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
