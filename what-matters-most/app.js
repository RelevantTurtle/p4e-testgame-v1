(function () {
  const allValues = window.WMM_VALUES;
  const startingValueIds = window.WMM_STARTING_VALUE_IDS;
  const valueById = new Map(allValues.map((value) => [value.id, value]));

  let ranking = [...startingValueIds];
  let justification = "";

  const screens = document.querySelectorAll("[data-screen]");
  const rankingList = document.querySelector("[data-ranking-list]");
  const resultList = document.querySelector("[data-result-list]");
  const reflectionOutput = document.querySelector("[data-reflection-output]");
  const justificationInput = document.querySelector("[data-justification]");

  function showScreen(name) {
    screens.forEach((screen) => {
      screen.hidden = screen.dataset.screen !== name;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function moveValue(fromIndex, direction) {
    const toIndex = fromIndex + direction;

    if (toIndex < 0 || toIndex >= ranking.length) {
      return;
    }

    const updatedRanking = [...ranking];
    const [movedValue] = updatedRanking.splice(fromIndex, 1);
    updatedRanking.splice(toIndex, 0, movedValue);
    ranking = updatedRanking;
    renderRanking();
  }

  function renderRanking() {
    rankingList.innerHTML = "";

    ranking.forEach((valueId, index) => {
      const value = valueById.get(valueId);
      const item = document.createElement("li");
      item.className = "value-card";

      const position = document.createElement("span");
      position.className = "rank-number";
      position.textContent = String(index + 1);

      const label = document.createElement("strong");
      label.textContent = value.label;

      const controls = document.createElement("div");
      controls.className = "card-controls";

      const upButton = document.createElement("button");
      upButton.className = "icon-button";
      upButton.type = "button";
      upButton.textContent = "↑";
      upButton.title = "Move up";
      upButton.disabled = index === 0;
      upButton.setAttribute("aria-label", "Move " + value.label + " up");
      upButton.addEventListener("click", () => moveValue(index, -1));

      const downButton = document.createElement("button");
      downButton.className = "icon-button";
      downButton.type = "button";
      downButton.textContent = "↓";
      downButton.title = "Move down";
      downButton.disabled = index === ranking.length - 1;
      downButton.setAttribute("aria-label", "Move " + value.label + " down");
      downButton.addEventListener("click", () => moveValue(index, 1));

      controls.append(upButton, downButton);
      item.append(position, label, controls);
      rankingList.append(item);
    });
  }

  function renderResults() {
    resultList.innerHTML = "";

    ranking.forEach((valueId) => {
      const value = valueById.get(valueId);
      const item = document.createElement("li");
      item.textContent = value.label;
      resultList.append(item);
    });

    const trimmedJustification = justification.trim();
    reflectionOutput.textContent =
      trimmedJustification || "No written reflection added yet.";
  }

  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) {
      return;
    }

    const action = actionButton.dataset.action;

    if (action === "start") {
      showScreen("ranking");
    }

    if (action === "to-justify") {
      showScreen("justification");
      justificationInput.focus();
    }

    if (action === "back-ranking") {
      showScreen("ranking");
    }

    if (action === "show-results") {
      justification = justificationInput.value;
      renderResults();
      showScreen("results");
    }

    if (action === "back-justify") {
      showScreen("justification");
      justificationInput.focus();
    }

    if (action === "restart") {
      ranking = [...startingValueIds];
      justification = "";
      justificationInput.value = "";
      renderRanking();
      showScreen("landing");
    }
  });

  renderRanking();
})();
