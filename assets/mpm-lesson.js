"use strict";

const stages = [
  ["P2G：粒子把信息交给网格", "每个粒子把质量、动量和内部力按权重分给附近的网格节点。此时网格节点被临时“点亮”。"],
  ["Grid：在网格上计算", "网格节点汇总作用力，加入重力、碰撞边界等条件，然后更新节点速度。"],
  ["G2P：网格把结果还给粒子", "粒子从附近节点取回更新后的速度。网格完成本轮任务，随后可以清空。"],
  ["Move：粒子带着材料前进", "用新速度移动粒子，并更新体积和变形状态。下一个时间步再重复同样循环。"]
];

const stage = document.querySelector("#mpm-stage");
const title = document.querySelector("#mpm-stage-title");
const text = document.querySelector("#mpm-stage-text");
const buttons = [...document.querySelectorAll("[data-mpm-stage]")];
const feedback = document.querySelector("#mpm-feedback");
const next = document.querySelector("#mpm-next");

function showStage(index) {
  stage.dataset.stage = String(index);
  title.textContent = stages[index][0];
  text.textContent = stages[index][1];
  buttons.forEach((button, buttonIndex) => button.classList.toggle("is-active", buttonIndex === index));
}

buttons.forEach(button => button.addEventListener("click", () => showStage(Number(button.dataset.mpmStage))));

document.querySelectorAll("[data-mpm-answer]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.mpmAnswer === "particle") {
      feedback.textContent = "对。粒子跟着材料走并保存历史；背景网格只在每个时间步临时参与计算。";
      next.classList.remove("disabled-link");
      next.removeAttribute("aria-disabled");
      next.href = "0007-ipc-intuition.html?completed=mpm";
      try {
        const progress = JSON.parse(localStorage.getItem("physics-learning-today-v2")) || {};
        progress.mpm = true;
        localStorage.setItem("physics-learning-today-v2", JSON.stringify(progress));
      } catch (_) {}
    } else {
      feedback.textContent = "再想一下：网格每一步都可以清空，长期记住材料身份和状态的是粒子。";
    }
  });
});

next.addEventListener("click", event => {
  if (next.getAttribute("aria-disabled") === "true") event.preventDefault();
});

showStage(0);
