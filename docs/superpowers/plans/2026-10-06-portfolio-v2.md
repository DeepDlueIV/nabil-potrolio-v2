# Nabil Portfolio V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the previous static portfolio with the complete Computational Atelier Next.js experience described in the approved V2 brief.

**Architecture:** Next.js App Router renders all core content server-side while focused client islands own the 3D hero, stateful explorers, scroll narrative, and honest contact flow. Typed profile and architecture data feed both visual and accessible representations; deterministic reducers own interaction state.

**Tech Stack:** Next.js 16.3.8, React 19.3.0, TypeScript 7, Tailwind CSS 4, Motion 14, GSAP 3, Three.js 0.186, React Three Fiber 9, Vitest 5, Testing Library, Playwright CLI.

**Spec:** `docs/superpowers/specs/2026-10-06-portfolio-v2-design.md`

## Global Constraints

- Display 7 years and the 2019 — Present career span defined in the spec.
- Preserve only sourced professional claims; never invent clients, performance metrics, contacts, employers, or certifications.
- Render core identity, experience, services, stack, and contact fallback without client initialization.
- Keep exactly one WebGL canvas and provide a meaningful poster/text alternative.
- Use Motion for interface state transitions, GSAP only for the desktop scroll narrative, and CSS for simple hover/focus effects.
- Respect `prefers-reduced-motion` and the explicit Full/Reduced motion control.
- Do not push, merge, or deploy without explicit permission.

## Review Focus

- WebGL unavailable or context lost: poster and component explanations remain complete and usable.
- Scenario switched mid-demo: old timers/animation state cancel and the new scenario starts cleanly.
- Single available worker paused: the interface reports a queued demonstration instead of inventing a route.
- Contact email unconfigured: submit copies or exposes the brief and never claims it was sent.
- 360 px viewport and large text: no page-level horizontal overflow or inaccessible controls.

---

### Task 1: Next.js foundation and verified content model

**Files:**
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `data/profile.ts`, `data/technologies.ts`, `data/architecture-scenarios.ts`, `vitest.config.ts`, `tests/data.test.ts`
- Modify: `package.json`, `README.md`, `.gitignore`
- Remove after replacement: legacy `src/`, `assets/app.js`, `assets/style.css`, and static build scripts

**Interfaces:**
- Produces: `profile`, `expertise`, `engagements`, `technologies`, `architectureScenarios`, and stable TypeScript types consumed by every later task.

- [ ] Write `tests/data.test.ts` to assert the 7-year label, exact four role ranges, full stack coverage, three distinct scenarios, honest contacts, and absence of disallowed claims.
- [ ] Run the test and verify it fails because the TypeScript data modules do not exist.
- [ ] Add the pinned Next.js toolchain, App Router shell, typed data modules, base tokens, metadata, and semantic server-rendered page skeleton.
- [ ] Run unit tests, typecheck, lint, and production build; verify all pass.
- [ ] Commit as `feat: establish portfolio v2 foundation`.

### Task 2: Hero compute scene and scroll narrative

**Files:**
- Create: `components/hero/Hero.tsx`, `components/scene/ComputeScene.tsx`, `components/scene/ComputePoster.tsx`, `components/scene/compute-model.ts`, `components/hero/HeroNarrative.tsx`, `tests/hero.test.tsx`
- Modify: `app/page.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: `profile` and architecture types from Task 1.
- Produces: accessible `SceneMode`, `SceneComponentId`, poster fallback, and hero navigation anchors.

- [ ] Write component tests for immediate identity/CTA visibility, 7-year text, Assembled/Exploded switching, component selection, pause control, and text fallback.
- [ ] Run the tests and verify the missing hero modules fail.
- [ ] Build the responsive hero, R3F cluster scene, deterministic finite activation, restrained pointer parallax, component controls, and GSAP desktop narrative with cleanup.
- [ ] Run the hero tests, full unit suite, typecheck, lint, and build.
- [ ] Commit as `feat: build interactive compute hero`.

### Task 3: Deterministic Architecture Playground

**Files:**
- Create: `lib/architecture/playground-reducer.ts`, `components/architecture/ArchitecturePlayground.tsx`, `components/architecture/ArchitectureDiagram.tsx`, `tests/playground-reducer.test.ts`, `tests/playground.test.tsx`
- Modify: `app/page.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: `ArchitectureScenario` from Task 1.
- Produces: `PlaygroundState`, `PlaygroundAction`, `getActiveRoute()`, and the accessible interactive illustration.

- [ ] Write reducer tests for scenario reset, Normal/Burst, run flow, redundant-worker reroute, queued single-worker failure, and Reset.
- [ ] Run reducer tests and verify they fail because the reducer is absent.
- [ ] Implement the minimal deterministic reducer and route derivation; rerun reducer tests to green.
- [ ] Write component tests for scenario/node selection, flow controls, status messaging, and keyboard use; verify they fail.
- [ ] Implement the SVG/DOM diagram and controls with explicit illustration labeling and cancellable animation state.
- [ ] Run the full unit suite, typecheck, lint, and build.
- [ ] Commit as `feat: add architecture playground`.

### Task 4: Expertise, experience, technology, engagement, and contact

**Files:**
- Create: `components/expertise/Expertise.tsx`, `components/experience/Experience.tsx`, `components/technology/TechnologyExplorer.tsx`, `components/engagement/Engagement.tsx`, `components/contact/ContactDialog.tsx`, `components/ui/SiteHeader.tsx`, `components/ui/MotionProvider.tsx`, `lib/contact/brief.ts`, `tests/explorers.test.tsx`, `tests/contact.test.tsx`
- Modify: `app/page.tsx`, `app/globals.css`, `data/profile.ts`, `ASSETS.md`, `public/images/*`

**Interfaces:**
- Consumes: all Task 1 content types and the hero motion preference.
- Produces: `buildProjectBrief()`, service-prefilled contact flow, role/technology selection, and global motion setting.

- [ ] Write tests for role/image changes, technology-to-layer context, View all technologies, service prefill, form validation, configured-email draft, unconfigured-email copy fallback, and reduced-motion control.
- [ ] Run the tests and verify the missing components/brief builder fail.
- [ ] Implement the remaining chapters, local attributed imagery, contact behavior, responsive navigation, and motion provider.
- [ ] Run the full unit suite, typecheck, lint, and build.
- [ ] Commit as `feat: complete portfolio chapters and contact flow`.

### Task 5: Browser verification, polish, documentation, and source archive

**Files:**
- Create: `output/playwright/*` (ignored QA artifacts), `docs/QA.md`, `public/social-preview.svg`, `Nabil-Portfolio-V2-source.zip`
- Modify: `README.md`, `ASSETS.md`, `app/globals.css`, and focused source/tests for verified defects

**Interfaces:**
- Consumes: the complete site.
- Produces: reproducible PowerShell setup instructions, verified QA record, optimized source archive, and final clean branch history.

- [ ] Run `npm ci`, typecheck, lint, unit tests, and production build; correct any failures with a RED→GREEN regression test.
- [ ] Serve the production build and inspect 1440×900, 1280×800, 768×1024, and 390×844 screenshots plus 360/1920 overflow.
- [ ] Exercise scenario switching, worker failure, Reset, technology and role selection, service prefill, validation, keyboard navigation, reduced motion, and WebGL fallback; capture a trace or frame sequence.
- [ ] Fix verified visual/interaction defects, keeping each behavioral fix test-first.
- [ ] Update README, ASSETS, and QA with exact commands, provenance, checks, and remaining limits.
- [ ] Create and inspect a ZIP excluding `.git`, `.next`, `node_modules`, output artifacts, secrets, and caches.
- [ ] Run the entire verification matrix again and commit as `chore: verify and package portfolio v2`.
