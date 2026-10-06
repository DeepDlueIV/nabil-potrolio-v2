import { sceneComponents, type SceneComponentId, type SceneMode, type ScenePhase } from './compute-model';

type ComputePosterProps = {
  mode: SceneMode;
  selected: SceneComponentId;
  phase: ScenePhase;
};

export function ComputePoster({ mode, selected, phase }: ComputePosterProps) {
  const selectedIndex = sceneComponents.findIndex((component) => component.id === selected);
  const spread = mode === 'exploded' ? 34 : 0;

  return (
    <figure className="compute-poster" data-mode={mode} data-selected={selected} data-phase={phase} data-testid="compute-poster">
      <svg role="img" aria-label="Illustrated private compute cluster with accelerator blades, interconnect fabric, policy gateway, and data layer" viewBox="0 0 720 560">
        <defs>
          <linearGradient id="poster-metal" x1="0" x2="1">
            <stop offset="0" stopColor="#111a24" />
            <stop offset=".5" stopColor="#25313d" />
            <stop offset="1" stopColor="#0b1118" />
          </linearGradient>
          <filter id="poster-glow"><feGaussianBlur stdDeviation="5" /></filter>
        </defs>
        <g className="poster-grid" opacity=".3">
          {Array.from({ length: 9 }, (_, index) => <path key={`v-${index}`} d={`M${80 + index * 70} 60V505`} />)}
          {Array.from({ length: 7 }, (_, index) => <path key={`h-${index}`} d={`M60 ${70 + index * 68}H665`} />)}
        </g>
        <g className={`poster-layer ${selected === 'data' ? 'is-selected' : ''}`} transform={`translate(0 ${spread})`}>
          <path d="M142 422L353 336 584 426 371 516Z" fill="url(#poster-metal)" />
          <path d="M164 421L354 346 560 427 370 503Z" fill="none" />
          <text x="329" y="472">DATA LAYER</text>
        </g>
        <g className={`poster-layer ${selected === 'fabric' ? 'is-selected' : ''}`} transform={`translate(0 ${spread * .3})`}>
          <path d="M123 355L351 265 602 360 371 454Z" fill="none" />
          <path className="poster-pulse" d="M182 347L351 283 548 357L371 427Z" fill="none" />
        </g>
        <g className={`poster-layer poster-blades ${selected === 'accelerators' ? 'is-selected' : ''}`} transform={`translate(0 ${-spread})`}>
          {[0, 1, 2, 3].map((index) => (
            <g key={index} transform={`translate(${205 + index * 74} ${218 - index * 22})`}>
              <path d="M0 0l125 48v53L0 52z" fill="url(#poster-metal)" />
              <path d="M13 21l88 34" /><circle cx="103" cy="77" r="4" />
            </g>
          ))}
        </g>
        <g className={`poster-layer ${selected === 'gateway' ? 'is-selected' : ''}`} transform={`translate(${mode === 'exploded' ? -45 : 0} ${mode === 'exploded' ? -8 : 0})`}>
          <path d="M84 238l90-36 70 27v74l-91 37-69-27z" fill="url(#poster-metal)" />
          <path d="M107 263l44-18 53 20" fill="none" />
          <text x="94" y="222">POLICY GATEWAY</text>
        </g>
        <g className="poster-signals" aria-hidden="true">
          {Array.from({ length: mode === 'exploded' ? 8 : 5 }, (_, index) => <circle key={index} cx={168 + index * 52} cy={344 - index * 12} r="3" />)}
        </g>
        <text className="poster-index" x="616" y="84">0{selectedIndex + 1} / 04</text>
      </svg>
      <figcaption>Fallback system view: four accelerator blades, an addressed interconnect, a policy gateway, and a separate data layer.</figcaption>
    </figure>
  );
}
