"use strict";
const timeStepSelect = document.querySelector("#comparison-dt");
const finalTime = 0.2;
const acceleration = 3;
const exactPosition = finalTime + 0.5 * acceleration * finalTime ** 2;

function signed(value) {
  return (value < 0 ? "−" : "+") + Math.abs(value).toFixed(3);
}

timeStepSelect.addEventListener("change", () => {
  const dt = Number(timeStepSelect.value);
  const steps = Math.round(finalTime / dt);
  let forwardX = 0;
  let symplecticX = 0;
  let velocity = 1;
  for (let step = 0; step < steps; step += 1) {
    const nextVelocity = velocity + dt * acceleration;
    forwardX += dt * velocity;
    symplecticX += dt * nextVelocity;
    velocity = nextVelocity;
  }
  document.querySelector("#comparison-steps").textContent = String(steps);
  document.querySelector("#forward-x").textContent = forwardX.toFixed(3);
  document.querySelector("#symplectic-x").textContent = symplecticX.toFixed(3);
  document.querySelector("#forward-error").textContent = signed(forwardX - exactPosition);
  document.querySelector("#symplectic-error").textContent = signed(symplecticX - exactPosition);
  document.querySelector("#comparison-note").textContent =
    "同样模拟 0.2 秒：每步 " + dt.toFixed(2) + " 秒，共 " + steps + " 步。两种方法的位置偏差大小均为 " +
    Math.abs(forwardX - exactPosition).toFixed(3) + " 米。";
});

document.querySelector("#symplectic-quiz").addEventListener("submit", event => {
  event.preventDefault();
  const nextV = Number(document.querySelector("#symplectic-next-v").value);
  const nextX = Number(document.querySelector("#symplectic-next-x").value);
  const hints = [];
  if (Math.abs(nextV + 0.4) > 1e-9) hints.push("速度：0 + 0.1 × (−4)。");
  if (Math.abs(nextX - 0.96) > 1e-9) hints.push("位置使用刚求出的新速度：1 + 0.1 × (−0.4)。");
  document.querySelector("#symplectic-feedback").textContent = hints.length
    ? "再检查一下：" + hints.join(" ")
    : "符合辛 Euler 的更新规则：新速度 −0.4 m/s，新位置 0.96 m。注意，这验证的是离散公式的计算。";
});
