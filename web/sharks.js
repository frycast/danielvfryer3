// Optional background only. Disable it with background_sharks: false in data/site.yaml.
const canvas = document.querySelector("[data-sharks]");
const toggle = document.querySelector("[data-sharks-toggle]");

if (canvas && toggle) {
  try {
    const { World, AsciiRenderer } = await import("./vendor/ascii-sharks.js");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const storageKey = "background-sharks";
    let paused = motion.matches;
    try {
      // Reduced motion always starts paused, regardless of a saved preference.
      paused ||= localStorage.getItem(storageKey) === "paused";
    } catch {
      // The controls still work if browser storage is blocked.
    }

    const smallScreen = innerWidth < 700;
    const world = new World(
      smallScreen
        ? [{ kind: "classic", size: 0.8 }]
        : [
            { kind: "classic", size: 0.85 },
            { kind: "hammerhead", size: 0.7 },
          ],
      smallScreen ? 18 : 36,
    );
    const renderer = new AsciiRenderer(canvas);
    renderer.setFontFamily("ui-monospace, Consolas, monospace");
    let frame = 0;
    let last = 0;
    const step = 1 / 30;

    function draw(now) {
      if (paused || document.hidden) return;
      if (now - last >= 1000 / 30) {
        // A fixed step avoids jumps after a slow frame or a hidden tab.
        world.step(step);
        renderer.render(world, step);
        last = now;
      }
      frame = requestAnimationFrame(draw);
    }

    function schedule() {
      cancelAnimationFrame(frame);
      canvas.hidden = paused;
      toggle.textContent = paused ? "Play sharks" : "Pause sharks";
      canvas.dataset.state = paused
        ? "paused"
        : document.hidden
          ? "hidden"
          : "swimming";
      if (!paused && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(draw);
      }
    }

    function resize() {
      const { width, height } = canvas.getBoundingClientRect();
      // hidden elements have no dimensions; use the viewport while paused.
      const w = width || innerWidth;
      const h = height || innerHeight;
      renderer.resize(w, h, Math.min(devicePixelRatio || 1, 1.5));
      world.resize(w, h, renderer.cellWidth, renderer.cellHeight);
      if (!paused) renderer.render(world, step);
    }

    toggle.addEventListener("click", () => {
      paused = !paused;
      try {
        localStorage.setItem(storageKey, paused ? "paused" : "playing");
      } catch {
        // No persistence is needed for the current visit.
      }
      schedule();
    });
    motion.addEventListener("change", () => {
      if (motion.matches) paused = true;
      schedule();
    });
    document.addEventListener("visibilitychange", schedule);
    window.addEventListener("pagehide", () => cancelAnimationFrame(frame));
    window.addEventListener("pageshow", schedule);
    window.addEventListener("resize", resize, { passive: true });
    resize();
    toggle.hidden = false;
    schedule();
  } catch {
    // A decorative effect must never prevent reading or using the site.
    canvas.remove();
    toggle.remove();
  }
}
