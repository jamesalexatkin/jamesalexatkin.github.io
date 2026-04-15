// Navbar hamburger
document.getElementById("navHamburger").addEventListener("click", function () {
  const nav = document.getElementById("rightHandNav");
  const expanded = this.getAttribute("aria-expanded") === "true";
  this.setAttribute("aria-expanded", String(!expanded));
  nav.classList.toggle("is-open", !expanded);
});

// Pomodoro logic
(function () {
  // Set to true to use 5-second sessions for local development
  const DEBUG_SHORT_TIMERS = false;

  const clockEl = document.getElementById("pomodoroClock");
  const statusEl = document.getElementById("pomodoroStatus");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playPauseLabel = document.getElementById("playPauseLabel");
  const resetBtn = document.getElementById("resetBtn");
  const workInput = document.getElementById("workDurationInput");
  const breakInput = document.getElementById("breakDurationInput");

  let isRunning = false;
  let isWorkSession = true;
  let secondsRemaining = 0;
  let intervalId = null;

  function getWorkSeconds() {
    if (DEBUG_SHORT_TIMERS) return 5;
    const val = parseInt(workInput.value, 10);
    return (isNaN(val) || val < 1 ? 25 : val) * 60;
  }

  function getBreakSeconds() {
    if (DEBUG_SHORT_TIMERS) return 5;
    const val = parseInt(breakInput.value, 10);
    return (isNaN(val) || val < 1 ? 5 : val) * 60;
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return m + ":" + s;
  }

  function updateDisplay() {
    clockEl.textContent = formatTime(secondsRemaining);
    const label = isWorkSession ? "Work" : "Break";
    statusEl.textContent = label;
    clockEl.classList.toggle("is-break", !isWorkSession);
    statusEl.classList.toggle("is-break", !isWorkSession);
    document.title =
      (!isRunning ? "⏸ " : "") +
      formatTime(secondsRemaining) +
      " — " +
      (isWorkSession ? "Work" : "Break") +
      " — Pomodoro";
  }

  function setPlayPauseUI() {
    if (isRunning) {
      playPauseLabel.textContent = "Pause";
      playPauseBtn.setAttribute("aria-label", "Pause timer");
      playPauseBtn.querySelector(".fa").className = "fa fa-pause";
    } else {
      playPauseLabel.textContent = "Start";
      playPauseBtn.setAttribute("aria-label", "Start timer");
      playPauseBtn.querySelector(".fa").className = "fa fa-play";
    }
  }

  function tick() {
    if (secondsRemaining <= 0) {
      // Switch session
      isWorkSession = !isWorkSession;
      secondsRemaining = isWorkSession ? getWorkSeconds() : getBreakSeconds();
      // Notify user
      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        new Notification(
          isWorkSession ? "Time to work!" : "Work section finished!",
        );
      }
    } else {
      secondsRemaining--;
    }
    updateDisplay();
  }

  function startTimer() {
    if (intervalId !== null) return;
    intervalId = setInterval(tick, 1000);
    isRunning = true;
    setPlayPauseUI();
    updateDisplay();
    // Request notification permission once
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }

  function pauseTimer() {
    clearInterval(intervalId);
    intervalId = null;
    isRunning = false;
    setPlayPauseUI();
    updateDisplay();
  }

  function resetTimer() {
    pauseTimer();
    isWorkSession = true;
    secondsRemaining = getWorkSeconds();
    updateDisplay();
    document.title = "Pomodoro — James Atkin";
  }

  playPauseBtn.addEventListener("click", function () {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  resetBtn.addEventListener("click", resetTimer);

  // When settings change while not running, update the clock
  workInput.addEventListener("change", function () {
    if (!isRunning && isWorkSession) {
      secondsRemaining = getWorkSeconds();
      updateDisplay();
    }
  });

  breakInput.addEventListener("change", function () {
    if (!isRunning && !isWorkSession) {
      secondsRemaining = getBreakSeconds();
      updateDisplay();
    }
  });

  // Initialise
  secondsRemaining = getWorkSeconds();
  updateDisplay();
})();
