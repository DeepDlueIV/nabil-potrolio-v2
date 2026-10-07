import { useId } from 'react';
import type { ScenePhase } from './compute-model';

export function ComputePoster({ phase, running, reduced }: { phase: ScenePhase; running: boolean; reduced: boolean }) {
  const id = useId().replace(/:/g, '');
  const open = phase === 'inside' || phase === 'flow';
  const shift = open ? 'translate(-60px, 82px)' : 'translate(0px, 0px)';

  return (
    <figure className="hardware-poster" data-testid="compute-poster" data-phase={phase} data-running={running}>
      <svg viewBox="0 0 720 650" role="img" aria-label="GPU server in a compact rack, with a network module, eight accelerators and context storage">
        <defs>
          <linearGradient id={`${id}-front`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#334250" /><stop offset="1" stopColor="#111a23" /></linearGradient>
          <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#516574" /><stop offset="1" stopColor="#243441" /></linearGradient>
          <pattern id={`${id}-vent`} width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="#070d12" /></pattern>
          <radialGradient id={`${id}-ground`}><stop stopColor="#338b9b" stopOpacity=".2" /><stop offset="1" stopColor="#338b9b" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx="360" cy="554" rx="270" ry="65" fill={`url(#${id}-ground)`} />
        <g stroke="#617888" strokeWidth="1" strokeLinejoin="round">
          <path d="M195 140L386 59 595 153 403 234Z" fill={`url(#${id}-top)`} />
          <path d="M403 234L595 153V463L403 547Z" fill="#111c26" />
          <path d="M195 140L403 234V547L195 451Z" fill="#0b121a" />
          <path d="M195 450L403 546 595 462 387 367Z" fill="#202f3c" />
          <path d="M195 140L403 234V254L195 160Z" fill={`url(#${id}-front)`} />
          <path d="M403 234L595 153V172L403 254Z" fill="#31414d" />
          <path d="M580 155V461L595 463V153Z" fill="#263745" />
          <path d="M389 228L405 235V548L389 541Z" fill={`url(#${id}-top)`} />
          <path d="M181 132L199 140V455L181 447Z" fill={`url(#${id}-top)`} />
          {Array.from({ length: 15 }, (_, i) => <g key={i}><path d={`M186 ${153 + i * 19}l8 4v7l-8-4z`} fill="#090e13" /><path d={`M394 ${248 + i * 19}l7 3v7l-7-3z`} fill="#090e13" /></g>)}
          <g>
            <path d="M204 170L390 254V286L204 202Z" fill={`url(#${id}-front)`} />
            {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${218 + i * 19} ${183 + i * 8.6}l12 5v10l-12-5Z`} fill={i < 2 ? '#63c5d5' : '#080e14'} />)}
            <path d="M204 204L390 288" stroke="#a1d7dc" strokeOpacity=".3" />
          </g>
          <g className="hardware-tray" style={{ transform: shift, transition: reduced ? 'none' : undefined }}>
            <path d="M205 288L396 207 578 290 386 373Z" fill="#21403f" />
            <path d="M205 288L386 373V421L205 339Z" fill={`url(#${id}-front)`} />
            <path d="M386 373L578 290V339L386 421Z" fill="#1f303a" />
            {[0, 1, 2, 3].flatMap((row) => [0, 1].map((column) => {
              const x = 235 + column * 87 + row * 39;
              const y = 294 + column * 39 - row * 17;
              return <g key={`${row}-${column}`}>
                <path d={`M${x} ${y}l34-14 65 29-34 15Z`} fill={phase === 'flow' ? '#5198a1' : '#687a86'} />
                <path d={`M${x} ${y}v12l65 29v-12Z`} fill="#2e4751" />
                {Array.from({ length: 5 }, (_, fin) => <path key={fin} d={`M${x + 7 + fin * 10} ${y + 1 + fin * 4.6}l26-11`} stroke="#acbec6" strokeOpacity=".5" />)}
              </g>;
            }))}
            <path d="M247 308L366 255M325 343L444 290" fill="none" stroke="#7ee7f5" strokeWidth="2.5" opacity=".7" />
            {Array.from({ length: 4 }, (_, i) => <g key={i} transform={`translate(${217 + i * 40} ${305 + i * 18})`}>
              <path d="M0 0l31 14v28L0 28Z" fill={`url(#${id}-vent)`} />
              <path d="M12 4v24l7 3V7Z" fill="#667985" />
              <circle cx="5" cy="7" r="1.7" fill="#7ee7f5" stroke="none" />
            </g>)}
            <path d="M208 293v36m174 53v31" stroke="#a7bbc5" strokeWidth="4" />
          </g>
          <g>
            <path d="M204 378L390 462V504L204 420Z" fill={`url(#${id}-front)`} />
            {Array.from({ length: 8 }, (_, i) => <g key={i} transform={`translate(${215 + i * 21} ${389 + i * 9.5})`}><path d="M0 0l17 8v22L0 22Z" fill="#0b131b" /><path d="M4 5v13m9-9v13" stroke="#697d8c" /><circle cx="8" cy="8" r="1.4" fill="#7ee7f5" stroke="none" /></g>)}
          </g>
          <path d="M165 250C120 230 139 183 190 203L224 218" fill="none" stroke="#438d9a" strokeWidth="4" />
          <path d="M165 257C125 245 134 198 190 218L225 230" fill="none" stroke="#273f4d" strokeWidth="3" />
          {phase === 'flow' && <path className="hardware-flow" d="M165 250C120 230 139 183 190 203L224 218 219 394 307 434 311 331 404 290 340 323 224 218" fill="none" stroke="#7ee7f5" strokeWidth="4" />}
          {phase === 'system' && <path className="hardware-flow hardware-entry" d="M165 250C120 230 139 183 190 203L224 218" fill="none" stroke="#7ee7f5" strokeWidth="4" />}
          <path d="M181 448L390 543V556L181 461Z" fill="#324650" />
          <path d="M390 543L595 461V474L390 556Z" fill="#1d2b35" />
          <path d="M438 304L544 258M438 322L544 276M438 340L544 294M438 358L544 312" stroke="#334c5a" />
        </g>
      </svg>
      <figcaption className="sr-only">An original hardware illustration: mounting rails, ventilated modules, network cabling, eight accelerators on a sliding compute tray, and a separate context storage module.</figcaption>
    </figure>
  );
}
