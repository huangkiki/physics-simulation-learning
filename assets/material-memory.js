"use strict";

const slider = document.querySelector("#material-load");
const value = document.querySelector("#material-load-value");
const unload = document.querySelector("#unload-material");
const elasticSample = document.querySelector("#elastic-sample");
const plasticSample = document.querySelector("#plastic-sample");
const elasticState = document.querySelector("#elastic-state");
const plasticState = document.querySelector("#plastic-state");
const feedback = document.querySelector("#material-feedback");
const next = document.querySelector("#material-next");
const completed = new Set((new URLSearchParams(location.search).get("completed") || "").split(",").filter(Boolean));
let maximumLoad = 0;

function renderMaterial() {
  const load = Number(slider.value);
  maximumLoad = Math.max(maximumLoad, load);
  const residual = load === 0 ? Math.max(0, (maximumLoad - 60) * 0.009) : 0;
  const elasticScale = 1 + load * 0.006;
  const plasticScale = load > 0 ? 1 + load * 0.006 : 1 + residual;
  value.textContent = `${load}%`;
  elasticSample.style.transform = `scaleX(${elasticScale})`;
  plasticSample.style.transform = `scaleX(${plasticScale})`;
  elasticState.textContent = load === 0 ? "恢复原状" : "暂时变形";
  if (load > 60) plasticState.textContent = "超过屈服点";
  else if (load > 0) plasticState.textContent = "仍在弹性区";
  else plasticState.textContent = maximumLoad > 60 ? "留下永久形变" : "恢复原状";
}

function recordCompletion(key) {
  completed.add(key);
  try {
    const progress = JSON.parse(localStorage.getItem("physics-learning-timeline-v1")) || {};
    progress[key] = true;
    localStorage.setItem("physics-learning-timeline-v1", JSON.stringify(progress));
  } catch (_) {}
}

slider.addEventListener("input", renderMaterial);
unload.addEventListener("click", () => { slider.value = "0"; renderMaterial(); });
document.querySelectorAll("[data-material-answer]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.materialAnswer === "plastic") {
      feedback.textContent = "对。卸载后仍有永久形变，就是塑性行为。";
      recordCompletion("materials");
      next.classList.remove("disabled-link");
      next.removeAttribute("aria-disabled");
      next.href = `0011-ipc-point-edge-distance.html?completed=${[...completed].join(",")}`;
    } else {
      feedback.textContent = "弹性部分卸载后会恢复；题目里的永久扁形来自塑性。";
    }
  });
});
next.addEventListener("click", event => { if (next.getAttribute("aria-disabled") === "true") event.preventDefault(); });
renderMaterial();
