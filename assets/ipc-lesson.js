"use strict";

const slider = document.querySelector("#ipc-distance");
const value = document.querySelector("#ipc-distance-value");
const object = document.querySelector("#ipc-object");
const gap = document.querySelector("#ipc-gap");
const meter = document.querySelector("#ipc-barrier-meter");
const status = document.querySelector("#ipc-status");
const feedback = document.querySelector("#ipc-feedback");
const finish = document.querySelector("#ipc-finish");
const inheritedProgress = new Set((new URLSearchParams(location.search).get("completed") || "").split(",").filter(Boolean));

function renderDistance() {
  const distance = Number(slider.value);
  const barrier = Math.max(0, Math.min(100, (42 - distance) * 2.5));
  const wallLeftFromRight = 79;
  const gapPixels = Math.max(2, distance * 1.7);
  value.textContent = String(distance);
  object.style.right = `${wallLeftFromRight + gapPixels}px`;
  gap.style.right = `${wallLeftFromRight}px`;
  gap.style.width = `${gapPixels}px`;
  meter.style.width = `${barrier}%`;
  if (distance > 42) {
    status.textContent = "距离充足，屏障几乎不介入";
    status.dataset.level = "safe";
  } else if (distance > 15) {
    status.textContent = "进入接触区，屏障开始快速增强";
    status.dataset.level = "active";
  } else {
    status.textContent = "非常接近：继续靠近的代价急剧上升";
    status.dataset.level = "critical";
  }
}

slider.addEventListener("input", renderDistance);

document.querySelectorAll("[data-ipc-answer]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.ipcAnswer === "path") {
      feedback.textContent = "对。只看起点和终点可能漏掉中途穿越；CCD 检查整段运动并限制安全步长。";
      finish.classList.remove("disabled-link");
      finish.removeAttribute("aria-disabled");
      inheritedProgress.add("ipc");
      finish.href = `../index.html?completed=${[...inheritedProgress].join(",")}#day-2026-10-16`;
      try {
        const progress = JSON.parse(localStorage.getItem("physics-learning-today-v2")) || {};
        progress.ipc = true;
        localStorage.setItem("physics-learning-today-v2", JSON.stringify(progress));
      } catch (_) {}
    } else {
      feedback.textContent = "不是渲染问题。CCD 负责检查运动路径中间是否发生碰撞。";
    }
  });
});

finish.addEventListener("click", event => {
  if (finish.getAttribute("aria-disabled") === "true") event.preventDefault();
});

renderDistance();
