"use strict";
const guessInput = document.querySelector("#implicit-guess");
const message = document.querySelector("#implicit-message");

function formatValue(value) {
  return (value < 0 ? "−" : "") + Math.abs(value).toFixed(6);
}

function evaluateGuess() {
  if (guessInput.value.trim() === "" || !guessInput.validity.valid) {
    message.textContent = "先输入一个有效的候选位置。";
    ["guess-force", "guess-velocity", "guess-position", "guess-residual"].forEach(id => {
      document.getElementById(id).textContent = "—";
    });
    return;
  }
  const guess = Number(guessInput.value);
  const force = -4 * guess;
  const velocity = 0.1 * force;
  const predictedPosition = 1 + 0.1 * velocity;
  const residual = guess - predictedPosition;
  document.querySelector("#guess-force").textContent = formatValue(force);
  document.querySelector("#guess-velocity").textContent = formatValue(velocity);
  document.querySelector("#guess-position").textContent = formatValue(predictedPosition);
  document.querySelector("#guess-residual").textContent = formatValue(residual);
  message.textContent = Math.abs(residual) < 1e-12
    ? "两条离散更新式在浮点精度内一致。残差接近零；这仍是后向 Euler 的近似运动。"
    : "候选值与回算位置仍有差异：残差 " + Number(residual.toPrecision(6)).toString() + " m。继续调整候选值，或直接解这条线性方程。";
}

guessInput.addEventListener("input", evaluateGuess);
document.querySelectorAll("[data-guess]").forEach(button => {
  button.addEventListener("click", () => {
    guessInput.value = button.dataset.guess;
    evaluateGuess();
  });
});
document.querySelector("#solve-implicit").addEventListener("click", () => {
  guessInput.value = String(1 / 1.04);
  evaluateGuess();
});
