# Original GPU infrastructure illustration

The rack, mesh geometry and SVG fallback are original work. They depict a generic class of equipment, not an exact NVIDIA product or a client installation. No NVIDIA images, marks, gold styling, 3D assets or performance claims are included in the delivered scene.

Form references inspected before modeling:

- [NVIDIA DGX H100/H200 User Guide: front panel, rear modules, motherboard and GPU trays](https://docs.nvidia.com/dgx/dgxh100-user-guide/introduction-to-dgxh100.html)
- [Front without bezel](https://docs.nvidia.com/dgx/dgxh100-user-guide/_images/dgx-h100-front-view.png): repeated ventilated modules, handles and rack attachment rails.
- [GPU tray](https://docs.nvidia.com/dgx/dgxh100-user-guide/_images/dgx-h100-gpu-tray.png): eight accelerators in two columns, shared connections and a distinct service tray.
- [DGX SuperPOD components](https://docs.nvidia.com/dgx-superpod/reference-architecture-scalable-infrastructure-h100/latest/dgx-superpod-components.html): separation of compute, network and storage infrastructure.

The data-flow overlay illustrates logical request/context/inference/response work over a physical connection. It is not a claim that software functions are dedicated hardware cards, and is not live telemetry.

The server presentation uses the shared visibility scheduler (4 / 6 / 6 / 4 seconds). A manual phase selection, including the current phase, holds that block until Continue presentation. Offscreen, background-tab and reduced-motion conditions stop continuous rendering. Manual changes use demand rendering and explicit invalidation; context loss returns to the meaningful SVG illustration.

Rendering reference: [React Three Fiber scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance). Repeated grille openings, rail perforations and heatsink fins are instanced; materials and primitive box geometry are shared. DPR is capped at 1.5 and the scene uses no postprocessing.
