import type { ContactDetails } from '@/data/types';

export function ContactLinks({ contacts }: { contacts: ContactDetails }) {
  if (!contacts.github && !contacts.linkedin) return null;
  return <div className="contact-social-links">
    {contacts.github ? <a href={contacts.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.18 1.74 1.18 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.5-.29-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.15-3.01-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.53.23 2.67.11 2.95.71.78 1.15 1.78 1.15 3.01 0 4.33-2.64 5.28-5.15 5.56.4.35.77 1.04.77 2.09v3.1c0 .3.21.65.78.54A11.2 11.2 0 0 0 12 .8Z" /></svg>
      GitHub</a> : null}
    {contacts.linkedin ? <a href={contacts.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a> : null}
  </div>;
}
