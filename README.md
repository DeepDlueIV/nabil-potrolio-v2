# Nabil Rakdani — Portfolio V2

A Next.js portfolio for a Principal AI & High-Performance Systems Architect and Fractional CTO. The Computational Atelier direction combines an authored compute scene, deterministic architecture illustrations, editorial experience, technology context, and an honest project brief.

## Run locally

Install Node.js 22 or newer. In PowerShell:

```powershell
npm ci
npm run dev
```

Open http://localhost:3000.

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm run check
```

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

## Structure

- `app/` — App Router page, metadata, and global visual system.
- `components/` — focused interactive client islands and server-rendered chapters.
- `data/` — verified profile, technology, and architecture source data.
- `lib/` — deterministic state and contact helpers.
- `tests/` — Vitest behavior tests.

## Contact behavior

Until an email address is configured, the contact dialog prepares a project brief and copies it locally. Nothing is sent or stored. Once a verified email is configured, submitting opens a draft for the visitor to review and send.

Professional claims come from the supplied profile legend. Generic employers remain generic; illustrative images and diagrams do not imply employment, client work, or endorsements.
