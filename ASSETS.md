# Asset provenance

All visual assets shipped with this repository are local. The site does not load third-party images at runtime.

## Experience imagery

The four experience images were generated for this portfolio with OpenAI ImageGen on 2026-10-06, then resized to 1600 px wide and encoded as WebP at quality 82. They are editorial atmosphere only: they do not depict Nabil Rakdani's clients, employers, products, or facilities.

| File | Use | Prompt summary |
| --- | --- | --- |
| `public/images/experience-datacenter.webp` | Principal architect | Photorealistic GPU server-room aisle, near-black steel, restrained cyan practical light, no people, brands, text, or client identity. |
| `public/images/experience-network.webp` | Lead solutions architect | Photorealistic ordered network patch panels and cabling, graphite and muted blue, no people, brands, text, or client identity. |
| `public/images/experience-systems.webp` | Senior infrastructure engineer | Photorealistic open high-performance compute racks in an industrial machine room, no people, brands, text, or client identity. |
| `public/images/experience-hardware.webp` | Full-stack systems engineer | Photorealistic macro motherboard and processor socket, charcoal PCB and subtle cyan light, no brands, text, or employer identity. |

## Code-native assets

- `app/icon.svg`: original geometric monogram created for this site.
- `public/social-preview.svg`: original code-native social preview assembled from the site's typography and system diagram language.
- Architecture and compute diagrams are rendered locally with HTML, SVG, CSS, and Three.js; they are illustrative and contain no client data.
