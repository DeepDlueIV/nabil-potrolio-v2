'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { profile } from '@/data/profile';

export function Experience() {
  const [activeId, setActiveId] = useState(profile.experience[0].id);
  const roleTabs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeRole = profile.experience.find((role) => role.id === activeId) ?? profile.experience[0];

  const handleRoleKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % profile.experience.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + profile.experience.length) % profile.experience.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = profile.experience.length - 1;
    else return;

    event.preventDefault();
    setActiveId(profile.experience[nextIndex].id);
    roleTabs.current[nextIndex]?.focus();
  };

  return (
    <section id="experience" className="experience-section light-chapter" aria-labelledby="experience-title">
      <div className="chapter-intro chapter-intro--experience">
        <p className="technical-label">03 / EXPERIENCE · 2019 — PRESENT</p>
        <h2 id="experience-title">Seven years, one continuous systems perspective.</h2>
        <p>The timeline is calibrated to the verified seven-year span. Select a role to inspect its technical focus.</p>
      </div>

      <div className="experience-console">
        <div className="experience-timeline" role="tablist" aria-label="Experience roles">
          {profile.experience.map((role, index) => (
            <button
              key={role.id}
              ref={(node) => { roleTabs.current[index] = node; }}
              type="button"
              role="tab"
              aria-selected={role.id === activeRole.id}
              aria-controls="experience-role-panel"
              tabIndex={role.id === activeRole.id ? 0 : -1}
              onKeyDown={(event) => handleRoleKey(event, index)}
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

      <details className="complete-record complete-record--experience" role="group" aria-label="Complete experience record">
        <summary>Complete experience record</summary>
        <div className="complete-record__grid">
          {profile.experience.map((role) => (
            <article key={role.id}>
              <p className="technical-label">{role.dates} · {role.domain}</p>
              <h3>{role.title}</h3>
              <p>{role.organization}</p>
              <p>{role.description}</p>
              <ul>{role.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
              <p className="experience-stack">{role.technologies.join(' · ')}</p>
            </article>
          ))}
        </div>
      </details>
    </section>
  );
}
