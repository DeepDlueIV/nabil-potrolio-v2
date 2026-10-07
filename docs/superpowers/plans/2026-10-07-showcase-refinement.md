# Showcase refinement implementation plan

> **For agentic workers:** Use test-driven development for each behavioral change. Independent visual and content work can run in parallel after the presentation interface is established.

**Goal:** Make the existing portfolio a clear automatic professional presentation, with a recognizable GPU server and all essential content visible during ordinary scrolling.

**Architecture:** One visibility coordinator chooses the most visible presentation with hysteresis. A reusable timed sequence controls automatic steps, manual hold, resume, hidden-page suspension, and readiness. Server-rendered About, full chronology, and complete stack remain independent of the demonstrations.

**Tech Stack:** Existing Next.js 16.3.8, React 19.3, TypeScript, R3F, Three.js, CSS and Motion. No new product dependencies.

**Spec:** C:/Users/DeepD/Downloads/Nabil_V2_Showcase_Refinement_Prompt.md (user-supplied complete brief).

## Global constraints

- Only DeepDlueIV/nabil-potrolio-v2, branch codex/showcase-refinement; push the branch, preserve production main.
- Seven years and the four existing date ranges remain unchanged.
- English visible copy; no invented professional claims or personal GitHub URL.
- Use the supplied portrait with CSS treatment and metadata-free web optimization; preserve the original outside public assets.
- Native scroll, no pinned hero, no global motion controls or mandatory internal controls.
- System reduced motion remains effective; WebGL failure preserves a recognizable fallback.

## Review focus

- Manual selection immediately cancels stale timers, including at step boundaries.
- Hidden tabs and offscreen scenes suspend without replaying elapsed steps on return.
- Two visible scenes do not run independently or oscillate ownership at the boundary.
- Slow or broken images preserve a coherent ready photograph/caption pair with bounded waiting.
- Keyboard and reduced-motion visitors can hold and read every presentation and all static content.

## Task 1: Presentation coordination

Files: components/presentation/PresentationProvider.tsx, usePresentation.ts, lib/presentation/sequence.ts, tests/presentation.test.tsx.

Interface: usePresentation({id, durations, ready?, pauseOnHover?}) returns {ref, step, source, held, running, progressKey, select(index), resume(), interactionProps}. Source is auto/manual; step is a zero-based flattened sequence index. Timers advance one complete step only. Readiness defaults true. Most-visible coordinator gates all sequences. useMotionPreference returns system preference only.

- [x] Write failing fake-timer tests for automatic progression, manual hold/resume, readiness, hidden page and visibility arbitration.
- [x] Implement the coordinator and hook using IntersectionObserver, one current-step timeout, and document visibility.
- [x] Run targeted tests, typecheck; commit the coherent presentation unit.

## Task 2: Server hero

Files: components/hero/*, components/scene/*, tests/hero.test.tsx, dedicated hero CSS.

Consumes Task 1 hook. Sequence durations [4000,6000,6000,4000] with return mapped to System. Manual tabs select System/Inside/Data flow and hold. Build original rack geometry from NVIDIA form references, no external assets or logos. Use calm three-quarter camera, metal chassis, rails, vents, handles, accelerator tray, cables and request/response path. Demand rendering must invalidate on props. Pointer parallax only on fine pointer, visible, unreduced. Native hero height, meaningful SVG fallback.

- [x] Replace old-control tests with first-frame identity, recognizable fallback, automatic phase and manual hold tests; observe failures.
- [x] Implement scene and composed hero; record sources in documentation.
- [x] Verify tests and types; commit only hero files.

## Task 3: Architecture presentation

Files: components/architecture/*, lib/architecture/*, data/architecture-scenarios.ts, tests/playground.test.tsx, dedicated architecture CSS.

Consumes Task 1 hook. Flatten 3 scenarios × 5 steps × 3200ms: normal, key stage, burst, failure, restored. Manual scenario chooses normal step and holds. Keep permanent overview of each scenario, noninteractive nodes, correct route and queue/reroute semantics; remove control chain/inspector. One conditional Continue presentation link.

- [x] Write failing sequence, route, manual selection and restore tests.
- [x] Implement automatic healthy-first demonstration and concise diagram/copy.
- [x] Verify tests and types; commit only architecture files.

## Task 4: Experience, stack and About

Files: components/experience/*, components/technology/*, components/about/*, data/profile.ts, data/technologies.ts, tests/explorers.test.tsx, dedicated content CSS, portrait web asset.

Consumes Task 1 hook. Experience duration 8000ms after ready; hover temporary pause, manual/focus indefinite hold. Preload next responsive source only near section. Keep current pair until next decode, bounded 6s error fallback. Full chronology always open. Complete grouped stack is plain text with compact tool-purpose sequence. Static About uses supplied portrait, profile and languages. Conditional GitHub link depends only on data.

- [x] Write failing readiness, open chronology, complete stack, hold/resume and conditional-link tests.
- [x] Implement double-layer readiness carousel, static chronology, tool showcase, About.
- [x] Verify tests and types; commit scoped content.

## Task 5: Integration and delivery

Files: app/page.tsx, app/globals.css, components/ui/*, tests/e2e/*, docs/QA.md, README.md, ASSETS.md.

- [x] Integrate provider, static About and nav; remove obsolete global controls and sticky hero rules.
- [x] Run npm ci, typecheck, lint, all unit tests, build and production e2e.
- [x] Capture before/after at 1440,1280,768,390,360; record hero, architecture and image transitions; test cold/throttled requests and image decode.
- [x] Fresh whole-branch review, fix important findings, commit, push feature branch to portfolio-v2 and verify remote SHA. No merge or production update.
