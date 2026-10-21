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
