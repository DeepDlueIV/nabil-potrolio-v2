# Nabil Rakdani — Portfolio V2

A Next.js portfolio for a Principal AI & High-Performance Systems Architect and Fractional CTO. The Computational Atelier direction combines an authored compute scene, deterministic architecture illustrations, editorial experience, technology context, and an honest project brief.

## Run locally

Install Node.js 22 or newer. In PowerShell:

```powershell
npm ci
npx playwright install chromium
npm run dev
```

Open http://localhost:3000.

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm run check
```

`npm run test:e2e` exercises the production build. Run `npm run build` first, or use `npm run check` for the complete sequence.

Production-browser tests use port **3100**, isolated from a local development server. The suite records automatic presentations and saves screenshots and diagnostics in ignored `output/playwright/`.

## Automatic presentation

Памятка об остановке анимаций из-за системного reduced-motion: [диагностика и проверка](docs/ANIMATION-TROUBLESHOOTING.md).

Native scrolling is never intercepted. Hero, architecture, experience and tools share viewport-aware timer ownership. Manual selection and keyboard focus hold a presentation until Continue presentation; hover temporarily pauses photos and tools. Hidden tabs and offscreen scenes do not catch up missed steps. Presentations play by default independently of OS animation effects. The header Motion control pauses all motion and smooth anchor scrolling; the visitor's explicit choice is saved locally across visits.

About follows the hero; all four career records and all six technology groups stay open. Photographs commit only after decoding the actual responsive candidate. A resize prepares the appropriate candidate while retaining the current image and caption. Failed loads use a bounded textual fallback.

## Edit the profile

Edit `data/profile.ts`. Contact values intentionally start empty:

```ts
contacts: {
  email: '',
  github: '',
  linkedin: '',
}
```

Use a plain email address and full `https://` social URLs. Experience, expertise, services, and languages live in `data/profile.ts`. Technologies and architecture illustrations have their own typed data modules in `data/`.

Set `profile.contacts.github` to show the real GitHub icon/link; an empty string renders nothing. Replace `public/images/nabil-portrait.webp` and update `profile.portrait.src`, `alt` and `objectPosition` for a new portrait. Set `profile.portrait` to `null` to remove the photograph without an empty slot. Keep full-resolution originals outside `public/`.

The visible career span is intentionally fixed at **7 years / 2019 — Present**. The four role ranges are `2021 — Present`, `2021 — 2024`, `2020 — 2021`, and `2019 — 2020`; update the data tests with any future verified change.

## Structure

- `app/` — App Router page, metadata, and global visual system.
- `components/` — focused interactive client islands and server-rendered chapters.
- `data/` — verified profile, technology, and architecture source data.
- `lib/` — deterministic state and contact helpers.
- `tests/` — Vitest behavior tests.
- `tests/e2e/` — Playwright production-browser checks for responsive layout and the main interaction paths.
- `ASSETS.md` — local image provenance and generated-asset disclosures.
- `docs/QA.md` — verification matrix, viewport record, and known limitations.

## Contact behavior

Until an email address is configured, the contact dialog prepares a project brief and copies it locally. Nothing is sent or stored. Once a verified email is configured, submitting opens a draft for the visitor to review and send.

Professional claims come from the supplied profile legend. Generic employers remain generic; illustrative images and diagrams do not imply employment, client work, or endorsements.

## Source archive

After committing the intended source state, create a clean handoff archive from Git:

```powershell
git archive --format=zip --output=Nabil-Portfolio-V2-source.zip HEAD
```

Because it is generated from the committed tree, the archive excludes `.git`, `.next`, `node_modules`, Playwright output, local caches, ignored secrets, and the archive itself.
