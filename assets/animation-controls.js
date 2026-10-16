"use strict";

document.querySelectorAll("[data-animation]").forEach(figure => {
  const video = figure.querySelector("video");
  const toggle = figure.querySelector("[data-play-toggle]");
  const restart = figure.querySelector("[data-restart]");
  const speed = figure.querySelector("[data-playback-rate]");
  const status = figure.querySelector(".player-status");
  const progress = figure.querySelector("[data-progress]");
  const time = figure.querySelector("[data-time]");
  const name = video.getAttribute("aria-label").replace("动画播放器", "");

  function syncButton() {
    const action = video.paused ? "播放" : "暂停";
    toggle.textContent = action;
    toggle.setAttribute("aria-label", action + name);
  }

  function formatTime(seconds) {
    const whole = Math.max(0, Math.floor(seconds));
    return Math.floor(whole / 60) + ":" + String(whole % 60).padStart(2, "0");
  }
  function syncProgress() {
    if (!Number.isFinite(video.duration)) return;
    progress.disabled = false;
    progress.max = String(video.duration);
    progress.value = String(video.currentTime);
    progress.setAttribute("aria-valuetext", video.currentTime.toFixed(2) + " 秒，共 " + video.duration.toFixed(2) + " 秒");
    time.textContent = formatTime(video.currentTime) + " / " + formatTime(video.duration);
  }
  progress.addEventListener("input", () => {
    video.pause();
    video.currentTime = Number(progress.value);
    syncProgress();
  });

  toggle.addEventListener("click", () => {
    if (!video.paused) {
      video.pause();
      return;
    }
    status.textContent = "";
    video.play().catch(error => {
      if (error.name !== "AbortError") {
        status.textContent = "暂时无法播放，请尝试下方的打开视频链接。";
      }
    });
  });
  restart.addEventListener("click", () => {
    video.pause();
    video.currentTime = 0;
  });
  speed.addEventListener("change", () => {
    video.playbackRate = Number(speed.value);
  });
  video.addEventListener("play", syncButton);
  video.addEventListener("pause", syncButton);
  video.addEventListener("ended", syncButton);
  video.addEventListener("error", () => {
    status.textContent = "暂时无法载入视频，请尝试下方的打开视频链接。";
  });
  ["loadedmetadata", "durationchange", "timeupdate", "seeked"].forEach(event => {
    video.addEventListener(event, syncProgress);
  });
  // Keep the full frame visible; controls are placed outside the picture.
  video.controls = false;
  syncButton();
  syncProgress();
});
