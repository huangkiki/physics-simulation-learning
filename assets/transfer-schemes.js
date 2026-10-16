"use strict";

const schemes = {
  pic: { title: "PIC：稳定，但会慢慢磨掉细节", text: "粒子直接采用网格插值速度。结果平滑，旋转和小尺度运动容易被耗散。", stable: 92, detail: 38, rotation: 30 },
  flip: { title: "FLIP：细节鲜活，也更容易噪", text: "粒子拿回网格速度的变化量。运动细节保留更多，但高频噪声也可能累积。", stable: 48, detail: 94, rotation: 68 },
  apic: { title: "APIC：给粒子多一份局部速度记忆", text: "粒子除平移速度外还携带局部仿射速度，因此能更好地保留旋转与角动量。", stable: 82, detail: 82, rotation: 95 }
};

const stage = document.querySelector("#transfer-stage");
const title = document.querySelector("#scheme-title");
const explanation = document.querySelector("#scheme-text");
const bars = {
  stable: document.querySelector("#stable-bar"),
  detail: document.querySelector("#detail-bar"),
  rotation: document.querySelector("#rotation-bar")
};
const buttons = [...document.querySelectorAll("[data-transfer-scheme]")];
const feedback = document.querySelector("#transfer-feedback");
const next = document.querySelector("#transfer-next");
const completed = new Set((new URLSearchParams(location.search).get("completed") || "").split(",").filter(Boolean));

function showScheme(name) {
  const scheme = schemes[name];
  stage.dataset.scheme = name;
  title.textContent = scheme.title;
  explanation.textContent = scheme.text;
  Object.entries(bars).forEach(([key, bar]) => { bar.style.width = `${scheme[key]}%`; });
  buttons.forEach(button => button.classList.toggle("is-active", button.dataset.transferScheme === name));
}

function recordCompletion(key) {
  completed.add(key);
  try {
    const progress = JSON.parse(localStorage.getItem("physics-learning-timeline-v1")) || {};
    progress[key] = true;
    localStorage.setItem("physics-learning-timeline-v1", JSON.stringify(progress));
  } catch (_) {}
}

buttons.forEach(button => button.addEventListener("click", () => showScheme(button.dataset.transferScheme)));
document.querySelectorAll("[data-transfer-answer]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.transferAnswer === "apic") {
      feedback.textContent = "对。APIC 用局部仿射速度保留旋转，同时通常比纯 FLIP 更平稳。";
      recordCompletion("transfers");
      next.classList.remove("disabled-link");
      next.removeAttribute("aria-disabled");
      next.href = `0009-deformation-gradient.html?completed=${[...completed].join(",")}`;
    } else {
      feedback.textContent = button.dataset.transferAnswer === "pic" ? "PIC 很稳，但更容易耗散旋转。再比较一下 APIC。" : "FLIP 保留细节，但题目还要求更稳并保留局部旋转。";
    }
  });
});
next.addEventListener("click", event => { if (next.getAttribute("aria-disabled") === "true") event.preventDefault(); });
showScheme("pic");
