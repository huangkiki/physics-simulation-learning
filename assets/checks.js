"use strict";
const fixed = document.querySelector("#fix-node");
if (fixed) {
  fixed.addEventListener("change", () => {
    document.querySelector("#free-count").textContent = fixed.checked ? "6" : "8";
    document.querySelector("#fixed-note").textContent = fixed.checked
      ? "P₁ 的两个坐标已指定：6 个自由位置分量；完整位置数组仍可保留 8 个数。"
      : "四个节点都能在平面内独立移动：8 个自由位置分量。";
    document.querySelector("#node-one").setAttribute("fill", fixed.checked ? "#bc5b39" : "#126f66");
  });
}
const form = document.querySelector("#state-quiz");
if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    const values = ["positions", "state", "matrix"].map(id => Number(document.getElementById(id).value));
    const expected = [8, 16, 8];
    const hints = ["位置：4 个节点 × 每个节点 2 个坐标。", "本例状态：位置和速度各一份。", "质量矩阵把 8 维加速度映射成 8 维力。"];
    const errors = values.flatMap((value, i) => value === expected[i] ? [] : [hints[i]]);
    document.querySelector("#quiz-feedback").textContent = errors.length
      ? "再检查一下：" + errors.join(" ")
      : "三项都对：x 有 8 个分量，(x, v) 共 16 个标量，M 是 8 × 8。接着解释：为什么速度分量不算额外的位置自由度？";
  });
}
