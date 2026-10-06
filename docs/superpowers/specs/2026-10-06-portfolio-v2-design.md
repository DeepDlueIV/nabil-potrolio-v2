# Nabil Portfolio V2 Design

## Outcome

Build a complete English-language one-page portfolio for Nabil Rakdani that presents him as a Principal AI & High-Performance Systems Architect and Fractional CTO. The site must feel like a living engineered system, remain useful without WebGL or client initialization, and turn exploration into an honest contact brief.

The user-supplied `Nabil_Portfolio_V2_Master_Prompt.md` is the binding visual and product brief. This document records the implementation decisions and the one explicit factual override supplied with the execution request.

## Factual override

- Display `7 years` of experience everywhere; never show `11+`.
- Keep all four supplied roles and their descriptions, but make the visible career span fit 2019 to the present:
  - 2021 — Present: Independent Principal Architect & Fractional CTO
  - 2021 — 2024: Lead Solutions Architect — AI & High-Performance Cloud
  - 2020 — 2021: Senior Infrastructure & DevOps Engineer
  - 2019 — 2020: Full-Stack Systems Engineer
- Keep Pavia, Italy, global B2B availability, the supplied languages, generic organization names, and the complete technology inventory.

## Architecture

Use Next.js App Router, React, and TypeScript. Server components own the page shell, metadata, and all professionally important copy. Client components are limited to the 3D hero, scroll narrative, architecture state machine, explorers, motion controls, and contact dialog.

`data/profile.ts`, `data/technologies.ts`, and `data/architecture-scenarios.ts` are the source of truth. Hero and Playground share architecture concepts but render them independently: React Three Fiber for the hero and accessible SVG/DOM for the Playground. The Playground reducer is deterministic and unit-tested.

## Visual system

- Direction: Computational Atelier — living systems, deliberate engineering.
- Dark chapters use `#090D13`, `#F3F6FA`, `#A9B3C2`, and ice cyan `#7EE7F5`; Experience is a porcelain `#EDF1F4` editorial chapter. Amber is reserved for the simulated worker failure.
- Manrope is the primary family and IBM Plex Mono is used only for technical labels.
- The hero is an integrated typographic/3D composition with an authored accelerator cluster, data path, selected-module state, finite activation, restrained pointer parallax, pause control, and Assembled/Exploded modes.
- Only one WebGL canvas is allowed. Every canvas concept has an equivalent text control and a meaningful poster fallback.

## Page flow

1. Hero with identity, role, CTA, 3D compute scene, component selector, motion control, and a three-phase Compute/Orchestration/System narrative.
2. Expertise with four distinct miniature diagrams and client-problem framing.
3. Architecture Playground with Private LLM / RAG, Streaming Data Platform, and Secure Enterprise AI scenarios.
4. Experience as a light editorial chapter with four selectable roles and locally stored, attributed infrastructure imagery.
5. Technology Explorer mapping technologies to architectural layers and keeping the full stack available.
6. Engagement with three service models that prefill the contact brief.
7. Contact with name, reply email, optional engagement, project summary, validation, and honest email-draft/copy behavior.
8. Compact footer and immediate navigation to contact.

## Interaction and state

The Playground state is `{ scenarioId, selectedNodeId, loadMode, unavailableWorkerId, demoStatus }`. Scenario changes cancel the previous demo and reset incompatible selections. Burst mode increases visible deterministic packets. Pausing a worker reroutes when a redundant worker exists and otherwise shows an explicit queued state. Reset returns the selected scenario to its initial state.

Technology selection updates the layer diagram and explanation. Experience selection updates the active role, image, crop, and copy. Service selection opens the brief with the corresponding engagement preselected. No interaction fabricates telemetry or successful delivery.

## Resilience and accessibility

The full profile, roles, services, stack, and contact alternatives render before client JavaScript. The site includes a skip link, one `h1`, logical heading order, visible focus, 44 px targets, keyboard-accessible tabs/buttons, labeled status messages, reduced-motion support, and useful behavior without WebGL. Mobile uses normal document flow with no scroll trapping or mandatory hover.

## Verification

Use unit/component tests for data truth, Playground transitions, explorer selection, experience selection, service-to-brief transfer, form validation, motion preference, and keyboard access. Run typecheck, lint, unit tests, production build, and browser flows. Inspect screenshots at 1440×900, 1280×800, 768×1024, and 390×844, plus overflow checks at 360 and 1920 widths. Capture a short trace or frame sequence to confirm motion.

## Editorial boundary

The diagrams are explicitly labeled as illustrations, not live systems or benchmarks. Sub-10 ms latency, millions of daily operations, zero downtime, client identities, testimonials, certifications, and measured savings are not claimed because the supplied sources do not substantiate them.
