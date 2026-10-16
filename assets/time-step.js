"use strict";

const mass = 2;
const force = 6;
const dt = 0.1;
const maxSteps = 10;
let step = 0;
let position = 0;
let velocity = 1;

const advanceButton = document.querySelector("#advance-step");
const explanation = document.querySelector("#step-explanation");

function renderState() {
  document.querySelector("#step-index").textContent = String(step);
  document.querySelector("#step-time").textContent = (step * dt).toFixed(2);
  document.querySelector("#step-x").textContent = position.toFixed(3);
  document.querySelector("#step-v").textContent = velocity.toFixed(3);
  document.querySelector("#step-point").setAttribute("cx", String(40 + 176 * position));
  advanceButton.disabled = step >= maxSteps;
}

advanceButton.addEventListener("click", () => {
  if (step >= maxSteps) return;
  const oldPosition = position;
  const oldVelocity = velocity;
  position = oldPosition + dt * oldVelocity;
  velocity = oldVelocity + dt * force / mass;
  step += 1;
  renderState();
  explanation.textContent =
    "位置：" + oldPosition.toFixed(3) + " + 0.1 × " + oldVelocity.toFixed(3) + " = " + position.toFixed(3) + " m；" +
    "速度：" + oldVelocity.toFixed(3) + " + 0.1 × 3 = " + velocity.toFixed(3) + " m/s。";
});

document.querySelector("#reset-step").addEventListener("click", () => {
  step = 0;
  position = 0;
  velocity = 1;
  renderState();
  explanation.textContent = "起点：x⁰ = 0 m，v⁰ = 1 m/s。第一步会得到什么？";
});

document.querySelector("#euler-quiz").addEventListener("submit", event => {
  event.preventDefault();
  const nextX = Number(document.querySelector("#next-x").value);
  const nextV = Number(document.querySelector("#next-v").value);
  const hints = [];
  if (Math.abs(nextX - 0.23) > 1e-9) {
    hints.push("位置使用当前速度 1.3：0.1 + 0.1 × 1.3。");
  }
  if (Math.abs(nextV - 1.6) > 1e-9) {
    hints.push("先算加速度 6 ÷ 2 = 3，再算 1.3 + 0.1 × 3。");
  }
  document.querySelector("#euler-feedback").textContent = hints.length
    ? "再检查一下：" + hints.join(" ")
    : "符合前向 Euler 的更新规则：x² = 0.23 m，v² = 1.6 m/s。本例 t=0.2 s 的精确位置是 0.26 m，位置仍有 0.03 m 的误差。";
});
