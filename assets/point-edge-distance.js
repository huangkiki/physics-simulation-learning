"use strict";

const start = { x: 120, y: 190 };
const end = { x: 500, y: 190 };
const xControl = document.querySelector("#point-x");
const yControl = document.querySelector("#point-y");
const point = document.querySelector("#moving-point");
const pointLabel = document.querySelector("#point-label");
const closest = document.querySelector("#closest-point");
const line = document.querySelector("#distance-line");
const distanceOutput = document.querySelector("#point-edge-distance");
const kind = document.querySelector("#closest-kind");
const explanation = document.querySelector("#point-edge-explanation");
const lab = document.querySelector(".point-edge-lab");
const feedback = document.querySelector("#point-edge-feedback");
const finish = document.querySelector("#point-edge-finish");
const completed = new Set((new URLSearchParams(location.search).get("completed") || "").split(",").filter(Boolean));

function renderDistance() {
  const p = { x: Number(xControl.value), y: Number(yControl.value) };
  const rawT = (p.x - start.x) / (end.x - start.x);
  const t = Math.max(0, Math.min(1, rawT));
  const q = { x: start.x + t * (end.x - start.x), y: start.y };
  const distance = Math.hypot(p.x - q.x, p.y - q.y);
  point.setAttribute("cx", p.x); point.setAttribute("cy", p.y);
  pointLabel.setAttribute("x", p.x + 14); pointLabel.setAttribute("y", p.y - 12);
  closest.setAttribute("cx", q.x); closest.setAttribute("cy", q.y);
  line.setAttribute("x1", p.x); line.setAttribute("y1", p.y); line.setAttribute("x2", q.x); line.setAttribute("y2", q.y);
  distanceOutput.textContent = distance.toFixed(1);
  lab.classList.toggle("barrier-near", distance < 45);
  if (rawT < 0) {
    kind.textContent = "左端点 A";
    explanation.textContent = "垂直投影落在线段左边，因此有限线段上的最近点是端点 A，使用点—点距离。";
  } else if (rawT > 1) {
    kind.textContent = "右端点 B";
    explanation.textContent = "垂直投影落在线段右边，因此有限线段上的最近点是端点 B，使用点—点距离。";
  } else {
    kind.textContent = "线段内部";
    explanation.textContent = distance < 45 ? "投影在线段内，使用点—线距离；现在已经进入示意屏障范围。" : "投影在线段内，最近距离是到投影点的垂直距离。";
  }
}

function recordCompletion(key) {
  completed.add(key);
  try {
    const progress = JSON.parse(localStorage.getItem("physics-learning-timeline-v1")) || {};
    progress[key] = true;
    localStorage.setItem("physics-learning-timeline-v1", JSON.stringify(progress));
  } catch (_) {}
}

[xControl, yControl].forEach(control => control.addEventListener("input", renderDistance));
document.querySelectorAll("[data-point-edge-answer]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.pointEdgeAnswer === "endpoint") {
      feedback.textContent = "对。线段是有限的；投影超出范围时，最近点只能是对应端点。";
      recordCompletion("point-edge");
      finish.classList.remove("disabled-link");
      finish.removeAttribute("aria-disabled");
      finish.href = `../index.html?completed=${[...completed].join(",")}#learning-plan`;
    } else {
      feedback.textContent = "无限延长线不属于这条有限线段。超出范围后要切换为端点距离。";
    }
  });
});
finish.addEventListener("click", event => { if (finish.getAttribute("aria-disabled") === "true") event.preventDefault(); });
renderDistance();
