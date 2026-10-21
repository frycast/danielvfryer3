(() => {
  const storageKey = "color-theme";
  const valid = (value) => ["automatic", "light", "dark"].includes(value);
  const readPreference = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      return valid(saved) ? saved : "automatic";
    } catch {
      return "automatic";
    }
  };
  const apply = (mode) => {
    document.documentElement.dataset.theme = mode;
    document.querySelectorAll("[data-theme-select]").forEach((select) => {
      select.value = mode;
    });
  };

  // Run in the head so a remembered choice takes effect before first paint.
  apply(readPreference());
  document.addEventListener("DOMContentLoaded", () => {
    apply(readPreference());
    document.querySelectorAll("[data-theme-select]").forEach((select) => {
      select.closest("label").hidden = false;
      select.addEventListener("change", () => {
        const mode = valid(select.value) ? select.value : "automatic";
        apply(mode);
        try {
          localStorage.setItem(storageKey, mode);
        } catch {
          // The current page still works when browser storage is unavailable.
        }
      });
    });
  });
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) apply(readPreference());
  });
})();
