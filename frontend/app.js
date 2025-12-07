// ---------------- Basic Config ----------------
const API_BASE = "http://127.0.0.1:8000";

const backendStatusEl = document.getElementById("backendStatus");
const tabs = document.querySelectorAll(".tab");
const recordBtn = document.getElementById("recordBtn");
const recordHint = document.getElementById("recordHint");
const waveWrapper = document.getElementById("waveWrapper");
const submitBtn = document.getElementById("submitBtn");
const submitLabel = document.getElementById("submitLabel");
const resetBtn = document.getElementById("resetBtn");
const usernameInput = document.getElementById("username");
const outputLog = document.getElementById("outputLog");
const outputDot = document.getElementById("outputDot");

let currentMode = "register"; // "register" or "verify"
let mediaRecorder = null;
let audioChunks = [];
let recordedBlob = null;
let isRecording = false;

// ---------------- Backend Health Check ----------------
async function checkBackend() {
  try {
    const res = await fetch(`${API_BASE}/`);
    if (!res.ok) throw new Error("Status not OK");
    const data = await res.json();
    backendStatusEl.textContent = "● Backend: Online";
    backendStatusEl.style.color = "#bbf7d0";
    backendStatusEl.style.borderColor = "rgba(74, 222, 128, 0.6)";
    backendStatusEl.style.boxShadow = "0 0 15px rgba(34, 197, 94, 0.8)";
    backendStatusEl.style.background =
      "radial-gradient(circle at top left, rgba(22,163,74,0.25), rgba(15,23,42,0.95))";
  } catch (err) {
    backendStatusEl.textContent = "● Backend: Offline";
    backendStatusEl.style.color = "#fecaca";
    backendStatusEl.style.borderColor = "rgba(248, 113, 113, 0.6)";
    backendStatusEl.style.boxShadow = "0 0 15px rgba(248, 113, 113, 0.8)";
  }
}

// ---------------- UI Helpers ----------------
function logMessage(msg, type = "normal") {
  outputLog.textContent = msg;
  outputDot.classList.remove("error", "neutral");

  if (type === "error") {
    outputDot.classList.add("error");
  } else if (type === "neutral") {
    outputDot.classList.add("neutral");
  }
}

function resetState() {
  recordedBlob = null;
  audioChunks = [];
  isRecording = false;
  submitBtn.disabled = true;
  recordBtn.classList.remove("recording");
  waveWrapper.classList.remove("wave-active");
  logMessage("Ready. Choose a mode and record your voice.");
  recordHint.textContent =
    "Tap to start recording. Speak the phrase clearly and naturally.";
}

function updateMode(newMode) {
  currentMode = newMode;
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === newMode);
  });

  if (newMode === "register") {
    submitLabel.textContent = "Register Voice";
    logMessage(
      "Registration mode. Enter a new username, record your voice, then register."
    );
  } else {
    submitLabel.textContent = "Verify Voice";
    logMessage(
      "Verification mode. Enter an existing username and record a fresh sample."
    );
  }

  resetState();
}

// ---------------- Recording Logic ----------------
async function initMedia() {
  if (mediaRecorder) return; // Already init
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      recordedBlob = new Blob(audioChunks, { type: "audio/webm" });
      audioChunks = [];
      submitBtn.disabled = false;
      waveWrapper.classList.remove("wave-active");
      recordBtn.classList.remove("recording");
      recordHint.textContent = "Recording complete. You can now submit.";
      logMessage(
        "Recording captured. Click the main button to send it to the server."
      );
    };
  } catch (err) {
    console.error("Microphone error:", err);
    logMessage(
      "Could not access microphone. Please allow mic permissions in your browser.",
      "error"
    );
  }
}

async function toggleRecording() {
  if (!mediaRecorder) {
    await initMedia();
    if (!mediaRecorder) return;
  }

  if (!isRecording) {
    // Start recording
    audioChunks = [];
    mediaRecorder.start();
    isRecording = true;
    waveWrapper.classList.add("wave-active");
    recordBtn.classList.add("recording");
    submitBtn.disabled = true;
    recordedBlob = null;
    recordHint.textContent = "Recording… tap again to stop.";
    logMessage("Recording… speak the fixed phrase now.");
  } else {
    // Stop recording
    mediaRecorder.stop();
    isRecording = false;
  }
}

// ---------------- Sending to Backend ----------------
async function sendToBackend() {
  if (!recordedBlob) {
    logMessage("No audio recorded. Please record your voice first.", "error");
    return;
  }

  const username = usernameInput.value.trim();
  if (!username) {
    logMessage("Please enter a username before submitting.", "error");
    return;
  }

  const endpoint = currentMode === "register" ? "/register" : "/verify";

  const formData = new FormData();
  formData.append("username", username);

  // We pretend it's a .webm file; backend converts it
  formData.append("file", recordedBlob, `${username}_${currentMode}.webm`);

  submitBtn.disabled = true;
  submitLabel.textContent =
    currentMode === "register" ? "Registering…" : "Verifying…";
  logMessage("Sending audio to backend for processing…", "neutral");

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    const data = await res.json();

    if (currentMode === "register") {
      logMessage(
        `✅ Registered voice for "${username}". You can now switch to Verify tab and test.`,
        "normal"
      );
    } else {
      const { match, similarity } = data;
      const score = similarity != null ? similarity.toFixed(3) : "N/A";

      if (match) {
        logMessage(
          `✅ Identity verified for "${username}".\nSimilarity score: ${score}`,
          "normal"
        );
      } else {
        logMessage(
          `❌ Verification failed for "${username}".\nSimilarity score: ${score}`,
          "error"
        );
      }
    }
  } catch (err) {
    console.error("Error sending audio:", err);
    logMessage(
      "Server error while processing audio. Check backend logs and ffmpeg.",
      "error"
    );
  } finally {
    submitBtn.disabled = false;
    submitLabel.textContent =
      currentMode === "register" ? "Register Voice" : "Verify Voice";
  }
}

// ---------------- Event Listeners ----------------
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    updateMode(tab.dataset.tab);
  });
});

recordBtn.addEventListener("click", () => {
  if (recordBtn.classList.contains("disabled")) return;
  toggleRecording();
});

submitBtn.addEventListener("click", () => {
  sendToBackend();
});

resetBtn.addEventListener("click", () => {
  resetState();
});

// ---------------- GSAP Entrance Animation ----------------
window.addEventListener("load", () => {
  checkBackend();

  if (window.gsap) {
    gsap.from(".card", {
      duration: 0.7,
      opacity: 0,
      y: 18,
      ease: "power2.out",
    });
    gsap.from(".bg-orbit", {
      duration: 1.4,
      opacity: 0,
      scale: 0.9,
      stagger: 0.2,
      ease: "power2.out",
    });
    gsap.from(".logo, .status-pill", {
      duration: 0.6,
      opacity: 0,
      y: -10,
      stagger: 0.05,
      delay: 0.1,
      ease: "power2.out",
    });
  }

  updateMode("register");
});
