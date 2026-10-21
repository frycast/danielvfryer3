# Optional ASCII sharks

Set `background_sharks: false` in `data/site.yaml`, then rebuild. This removes the canvas, controls, stylesheet link, and module script from every page. No shark code loads or runs. Set it back to `true` to compare the effect in a deploy preview.

Visitors can pause or resume the effect with the small control at the bottom left; their choice is remembered when browser storage is available. The control lives in the footer markup but stays visible while scrolling. Reduced motion starts it paused and stops a running animation if the preference changes. Hidden tabs stop drawing. The canvas cannot intercept clicks and is hidden from assistive technology. If JavaScript or canvas is unavailable, the page remains usable without the effect.

`web/sharks.js` is the site integration, `web/sharks.css` is the presentation, and `web/vendor/ascii-sharks.js` contains the locally bundled simulation and renderer. There are no external requests, runtime packages, or framework dependencies. These three files can be deleted after disabling the setting to remove the feature permanently; remove the conditional hooks from `scripts/build.mjs` at the same time.

## Upstream source

The simulation and renderer come from [stackedlol/ascii-sharks](https://github.com/stackedlol/ascii-sharks), revision [`c521e24a787e6d4cc460d4cf2b9815f25e4fe453`](https://github.com/stackedlol/ascii-sharks/tree/c521e24a787e6d4cc460d4cf2b9815f25e4fe453). Upstream supplies no license file; no new license is asserted for that code. The site's own integration is separate from the upstream code.

The bundle uses `src/renderer.ts`, `src/world.ts`, `src/math.ts`, and `src/species.ts`. It exports `AsciiRenderer` and `World`. The renderer was adapted to use an alpha canvas and clear its background each frame, omitting the black fill and decorative grid. The simulation is unchanged. The wrapper limits the population, frame rate, and pixel ratio, supplies pause and visibility behavior, and does not enable pointer attraction or splash effects on top of page controls.

The source was bundled once with esbuild 0.25.12, ESM format, target ES2022. No new tooling is needed to build or deploy this website.
