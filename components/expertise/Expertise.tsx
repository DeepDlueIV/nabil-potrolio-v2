import { expertise } from '@/data/profile';

function ExpertiseGlyph({ kind }: { kind: string }) {
  return (
    <div className={`expertise-glyph expertise-glyph--${kind}`} aria-hidden="true">
      <span /><span /><span /><span />
    </div>
  );
}

export function Expertise() {
  return (
    <section id="expertise" className="expertise-section light-chapter" aria-labelledby="expertise-title">
      <div className="chapter-intro">
        <p className="technical-label">01 / EXPERTISE</p>
        <h2 id="expertise-title">Architecture starts with the system constraint.</h2>
        <p>Four connected practices, from silicon-level performance to the decisions that keep a technical organization moving.</p>
      </div>
      <div className="expertise-list">
        {expertise.map((area, index) => (
          <article className="expertise-row" key={area.id}>
            <p className="expertise-index technical-label">0{index + 1}</p>
            <ExpertiseGlyph kind={area.diagram} />
            <div className="expertise-copy">
              <h3>{area.title}</h3>
              <dl>
                <div><dt>Constraint</dt><dd>{area.problem}</dd></div>
                <div><dt>Response</dt><dd>{area.approach}</dd></div>
              </dl>
              <p className="expertise-tools">{area.tools.join(' · ')}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
