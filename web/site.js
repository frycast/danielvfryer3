const search = document.querySelector("[data-paper-search]");
if (search) {
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    document.querySelectorAll("[data-paper]").forEach((paper) => {
      paper.hidden = !paper.dataset.search.includes(query);
      if (!paper.hidden) count++;
    });
    document.querySelector("[data-no-results]").hidden = count !== 0;
    document.querySelector("[data-search-status]").textContent =
      `${count} publication${count === 1 ? "" : "s"} found`;
  });
}

const contactForm = document.querySelector('form[name="contact"]');
if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');
    if (button.disabled) return;
    const status = contactForm.querySelector("[data-form-status]");
    status.hidden = true;
    button.disabled = true;
    button.textContent = "Sending…";
    contactForm.setAttribute("aria-busy", "true");

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(contactForm)).toString(),
      });
      if (!response.ok)
        throw new Error(`Form submission returned ${response.status}`);
      window.location.assign(contactForm.action);
    } catch {
      status.hidden = false;
      button.disabled = false;
      button.textContent = "Send message";
      contactForm.removeAttribute("aria-busy");
    }
  });
}
