import { ContactDialog } from '@/components/contact/ContactDialog';
import { engagements } from '@/data/profile';

export function Engagement() {
  return (
    <section id="engagement" className="engagement-section" aria-labelledby="engagement-title">
      <div className="section-heading engagement-heading">
        <p className="technical-label">05 / ENGAGEMENT MODELS</p>
        <h2 id="engagement-title">Bring the hard infrastructure question.</h2>
        <p>Each engagement begins with the constraint, the evidence available, and the decision that needs to become clearer.</p>
      </div>
      <div className="engagement-list">
        {engagements.map((engagement, index) => (
          <article key={engagement.id}>
            <div className="engagement-title">
              <p className="technical-label">0{index + 1}</p>
              <h3>{engagement.title}</h3>
              <p>{engagement.prompt}</p>
            </div>
            <div>
              <p className="technical-label">Inside the engagement</p>
              <ul>{engagement.includes.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <p className="technical-label">Working outcome</p>
              <ul>{engagement.outcomes.map((item) => <li key={item}>{item}</li>)}</ul>
              <ContactDialog
                initialService={engagement.id}
                triggerLabel={`Discuss ${engagement.title.split(' & ')[0]}`}
                triggerClassName="engagement-cta"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
