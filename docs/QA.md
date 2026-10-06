# Portfolio V2 QA record

Date: 2026-10-07

Environment: Windows, Node.js 22.23.2, Chromium 153 (Playwright 1.63.0)

## Automated verification

The complete local gate is:

```powershell
npm ci
npx playwright install chromium
npm run check
```

`npm run check` runs, in order:

1. TypeScript typecheck (`tsc --noEmit`).
2. ESLint with zero warnings.
3. Vitest component and reducer tests.
4. Next.js production build and static prerender.
5. Playwright against the production server.

The latest run passed **32/32 Vitest tests** and **2/2 Chromium end-to-end tests**. The browser suite asserts the seven-year claim, server-rendered identity, page-level overflow at 360, 390, 768, 1280, 1440, and 1920 px, architecture failure/reset behavior, role and image switching, technology-layer selection, full technology disclosure, explicit reduced motion, service prefill, contact validation, and the honest local-copy result.

## Visual inspection

Screenshots were inspected at:

| Viewport | Focus |
| --- | --- |
| 1440 × 900 | Desktop hero, experience, technology, and contact composition |
| 1280 × 800 | Desktop hero density and fixed header |
| 768 × 1024 | Tablet hero split, scene controls, and narrative |
| 390 × 844 | Mobile hero hierarchy, CTA reachability, experience timeline, and contact dialog |
| 360 × 800 | Minimum-width page overflow |
| 1920 × 1080 | Large-screen line length, max-width behavior, and composition |

The local QA images and Playwright traces live under ignored `output/playwright/` and are intentionally excluded from the source archive.

## Content and behavior checks

- Experience reads **7 years** and spans **2019 — Present**; no 11-year claim remains.
- All three architecture scenarios are labeled as deterministic illustrations, not live systems or benchmarks.
- Pausing a redundant worker reroutes; pausing the only secure-inference worker queues; Reset restores the initial state.
- Core text and the SVG poster remain available if WebGL does not initialize.
- WebGL context loss returns the hero to the code-native SVG poster.
- Global Full/Reduced motion control and `prefers-reduced-motion` disable CSS, GSAP, Motion, and WebGL animation.
- The architecture tabs move selection and focus with the arrow keys; the contact modal traps focus and restores it to its trigger.
- Native disclosure elements retain the complete experience and technology records without client-side interaction.
- Images are local, optimized WebP files and are disclosed as AI-generated editorial references, not client facilities.
- No verified contact address was supplied. The contact form prepares and copies a brief locally and never reports a send.

## Dependency audit and limits

- `npm audit --omit=dev` reports no production dependency vulnerabilities at this snapshot.
- The full development tree reports five high-severity advisories in transitive lint tooling. Applying the suggested forced audit fix would require breaking framework/toolchain changes, so it is not performed automatically.
- WebGL rendering remains device-dependent; the code-native poster and full component descriptions are the supported fallback.
- Deployment, domain configuration, analytics, and a public recipient email remain intentionally unconfigured.
