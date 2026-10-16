"use strict";

const modes = {
  identity: { transform: "none", matrix: "[ 1.00   0.00 ; 0.00   1.00 ]", text: "单位矩阵：局部方块和参考形状相同。" },
  stretch: { transform: "scale(1.45, .72)", matrix: "[ 1.45   0.00 ; 0.00   0.72 ]", text: "横向被拉长、纵向被压短。F 的对角项直观对应两个方向的伸缩。" },
  shear: { transform: "skewX(24deg)", matrix: "[ 1.00   0.45 ; 0.00   1.00 ]", text: "方块被推斜了。非对角项可以表达方向之间的耦合和剪切。" },
  rotate: { transform: "rotate(30deg)", matrix: "[ 0.87  -0.50 ; 0.50   0.87 ]", text: "局部形状发生旋转。F 可以同时包含旋转和伸缩。" }
};

const shape = document.querySelector("#deformation-shape");
const matrix = document.querySelector("#deformation-matrix");
const explanation = document.querySelector("#deformation-text");
const buttons = [...document.querySelectorAll("[data-deformation]")];
const feedback = document.querySelector("#deformation-feedback");
const next = document.querySelector("#deformation-next");
const completed = new Set((new URLSearchParams(location.search).get("completed") || "").split(",").filter(Boolean));

function showMode(name) {
  const mode = modes[name];
  shape.style.transform = mode.transform;
  matrix.textContent = mode.matrix;
  explanation.textContent = mode.text;
  buttons.forEach(button => button.classList.toggle("is-active", button.dataset.deformation === name));
}

function recordCompletion(key) {
  completed.add(key);
  try {
    const progress = JSON.parse(localStorage.getItem("physics-learning-timeline-v1")) || {};
    progress[key] = true;
    localStorage.setItem("physics-learning-timeline-v1", JSON.stringify(progress));
  } catch (_) {}
}

buttons.forEach(button => button.addEventListener("click", () => showMode(button.dataset.deformation)));
document.querySelectorAll("[data-deformation-answer]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.deformationAnswer === "gradient") {
      feedback.textContent = "对。v 说明运动速度，F 记录局部材料相对参考形状怎样变了。";
      recordCompletion("deformation");
      next.classList.remove("disabled-link");
      next.removeAttribute("aria-disabled");
      next.href = `0010-elasticity-plasticity.html?completed=${[...completed].join(",")}`;
    } else {
      feedback.textContent = "速度告诉你正在怎样移动；题目问的是局部形状变化的记忆。";
    }
  });
});
next.addEventListener("click", event => { if (next.getAttribute("aria-disabled") === "true") event.preventDefault(); });
showMode("identity");
