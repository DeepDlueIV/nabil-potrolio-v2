import { ArchitecturePlayground } from '@/components/architecture/ArchitecturePlayground';
import { ContactDialog } from '@/components/contact/ContactDialog';
import { Engagement } from '@/components/engagement/Engagement';
import { Experience } from '@/components/experience/Experience';
import { Expertise } from '@/components/expertise/Expertise';
import { Hero } from '@/components/hero/Hero';
import { TechnologyExplorer } from '@/components/technology/TechnologyExplorer';
import { MotionProvider } from '@/components/ui/MotionProvider';
import { SiteHeader } from '@/components/ui/SiteHeader';
import { profile } from '@/data/profile';
import { getContactAvailabilityCopy } from '@/lib/contact/brief';

export default function HomePage() {
  return (
    <MotionProvider>
      <a className="skip-link" href="#expertise">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <Expertise />
        <ArchitecturePlayground />
        <Experience />
        <TechnologyExplorer />
        <Engagement />

        <section id="contact" className="contact-section" aria-labelledby="contact-title">
          <p className="technical-label">06 / START A CONVERSATION</p>
          <div>
            <h2 id="contact-title">Let&apos;s make the system legible.</h2>
            <p>Share the infrastructure constraint, technical decision, or transition you need to work through.</p>
          </div>
          <div className="contact-callout">
            <p className="technical-label">Project brief</p>
            <p>A structured local-first form helps turn the first message into useful technical context.</p>
            <ContactDialog triggerLabel="Prepare a project brief" />
            <small>{getContactAvailabilityCopy(profile.contacts.email).callout}</small>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div><strong>{profile.name}</strong><span>{profile.title}</span></div>
        <p>{profile.location} · {profile.availability}</p>
        <p className="technical-label">Independent portfolio / 2026</p>
      </footer>
    </MotionProvider>
  );
}
