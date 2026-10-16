"use strict";

const PROGRESS_KEY = "physics-learning-timeline-v1";
const SCHEDULE_KEY = "physics-learning-schedule-v1";
const lessons = [
  { key: "mpm", day: "2026-10-16", minutes: 12 },
  { key: "ipc", day: "2026-10-16", minutes: 12 },
  { key: "transfers", day: null, minutes: 15 },
  { key: "deformation", day: null, minutes: 15 },
  { key: "materials", day: null, minutes: 15 },
  { key: "point-edge", day: null, minutes: 15 },
  { key: "base-01", day: "2026-10-15", minutes: 12 },
  { key: "base-02", day: "2026-10-15", minutes: 12 },
  { key: "base-03", day: "2026-10-15", minutes: 12 },
  { key: "base-04", day: "2026-10-15", minutes: 12 },
  { key: "base-05", day: "2026-10-15", minutes: 8 }
];

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    const legacy = JSON.parse(localStorage.getItem("physics-learning-today-v2")) || {};
    return { ...saved, mpm: saved.mpm || legacy.mpm || false, ipc: saved.ipc || legacy.ipc || false };
  } catch (_) { return {}; }
}

function saveProgress(value) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(value)); } catch (_) {}
}

function readSchedule() {
  try { return JSON.parse(localStorage.getItem(SCHEDULE_KEY)) || {}; } catch (_) { return {}; }
}

function saveSchedule(value) {
  try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(value)); } catch (_) {}
}

const progress = readProgress();
const schedule = readSchedule();
const completedFromUrl = new URLSearchParams(location.search).get("completed");
if (completedFromUrl) {
  completedFromUrl.split(",").filter(key => lessons.some(lesson => lesson.key === key)).forEach(key => { progress[key] = true; });
  saveProgress(progress);
}

function sumMinutes(items) { return items.reduce((sum, lesson) => sum + lesson.minutes, 0); }

function renderDay(day) {
  const dayLessons = lessons.filter(lesson => lesson.day === day);
  const complete = dayLessons.filter(lesson => progress[lesson.key]);
  const completedMinutes = sumMinutes(complete);
  const totalMinutes = sumMinutes(dayLessons);
  document.querySelector(`[data-day-progress="${day}"]`).textContent = `${completedMinutes} / ${totalMinutes} 分钟`;
  document.querySelector(`[data-day-status="${day}"]`).textContent = complete.length === dayLessons.length ? "当天学习已完成" : `${dayLessons.length - complete.length} 节待学习`;
}

function renderSchedule() {
  document.querySelectorAll("[data-schedule-input]").forEach(input => {
    const key = input.dataset.scheduleInput;
    input.value = schedule[key] || "";
    const status = document.querySelector(`[data-schedule-status="${key}"]`);
    if (!schedule[key]) {
      status.textContent = "尚未安排";
      return;
    }
    const target = new Date(schedule[key]);
    const label = new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(target);
    status.textContent = progress[key] ? `已完成 · 原计划 ${label}` : target.getTime() < Date.now() ? `目标时间已到 · ${label}` : `计划 ${label}`;
  });
}

function render() {
  const complete = lessons.filter(lesson => progress[lesson.key]);
  const completedMinutes = sumMinutes(complete);
  const totalMinutes = sumMinutes(lessons);
  document.querySelector("#overall-progress-number").textContent = `${completedMinutes} / ${totalMinutes} 分钟`;
  document.querySelector("#overall-progress-bar").style.width = `${completedMinutes / totalMinutes * 100}%`;
  document.querySelector("#overall-progress-text").textContent = completedMinutes === totalMinutes ? "全部课程已完成" : completedMinutes >= 80 ? "继续四个进阶小课" : completedMinutes >= 56 ? "继续今天的 MPM 与 IPC" : "按自己的节奏补齐学习记录";
  for (const day of new Set(lessons.map(lesson => lesson.day).filter(Boolean))) renderDay(day);
  document.querySelectorAll("[data-completion]").forEach(mark => {
    const done = Boolean(progress[mark.dataset.completion]);
    mark.textContent = done ? "已完成" : "未完成";
    mark.classList.toggle("is-done", done);
  });
  document.querySelectorAll("[data-progress-card]").forEach(card => card.classList.toggle("is-complete", Boolean(progress[card.dataset.progressCard])));
  document.querySelectorAll("[data-progress-toggle]").forEach(button => {
    const done = Boolean(progress[button.dataset.progressToggle]);
    button.textContent = done ? "撤销完成" : "标记完成";
    button.setAttribute("aria-pressed", String(done));
  });
  renderSchedule();
}

document.querySelectorAll("[data-progress-toggle]").forEach(button => {
  button.addEventListener("click", () => {
    const key = button.dataset.progressToggle;
    progress[key] = !progress[key];
    saveProgress(progress);
    render();
  });
});

document.querySelectorAll("[data-schedule-input]").forEach(input => {
  input.addEventListener("change", () => {
    const key = input.dataset.scheduleInput;
    if (input.value) schedule[key] = input.value;
    else delete schedule[key];
    saveSchedule(schedule);
    renderSchedule();
  });
});

render();
