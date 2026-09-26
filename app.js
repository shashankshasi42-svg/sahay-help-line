/* =========================================================
   SAHAY 360
   HTML + CSS + JavaScript only
========================================================= */


/* =========================
   GLOBAL VARIABLES
========================= */

let currentPage = "home";

let assessmentScore = 0;
let assessmentLevel = "LOW";

let selectedMood = "";

let holdTimer = null;
let tapTimer = null;
let tapCount = 0;
let isHolding = false;

let breathingTimer = null;
let breathingSeconds = 120;

let relaxTimer = null;
let relaxSeconds = 120;
let selectedEnvironment = "";

let dailyCalmTimer = null;
let dailyCalmSeconds = 120;

let incidentRecognition = null;

let soundEnabled = true;


/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageId) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
    currentPage = pageId;
    window.scrollTo(0, 0);
  }
}


function goHome() {
  stopBreathing();
  pauseRelaxation();
  pauseDailyCalm();
  showPage("home");
}


/* =========================
   ASSESSMENT
========================= */

function startAssessment() {
  showPage("assessment");
}


function calculateAssessment() {

  let score = 0;

  for (let i = 1; i <= 5; i++) {

    const answer = document.querySelector(
      `input[name="q${i}"]:checked`
    );

    if (!answer) {
      alert("Please answer all questions.");
      return;
    }

    score += Number(answer.value);
  }

  assessmentScore = Math.round((score / 15) * 100);

  if (score <= 3) {

    assessmentLevel = "LOW";

  } else if (score <= 7) {

    assessmentLevel = "MODERATE";

  } else if (score <= 11) {

    assessmentLevel = "HIGH";

  } else {

    assessmentLevel = "CRITICAL";

  }

  const icon = document.getElementById("resultIcon");

  if (assessmentLevel === "LOW") {
    icon.textContent = "🟢";
  } else if (assessmentLevel === "MODERATE") {
    icon.textContent = "🟡";
  } else if (assessmentLevel === "HIGH") {
    icon.textContent = "🟠";
  } else {
    icon.textContent = "🔴";
  }

  document.getElementById("resultLevel").textContent =
    assessmentLevel;

  document.getElementById("sviScore").textContent =
    assessmentScore;

  document.getElementById("resultMessage").textContent =
    getAssessmentMessage(assessmentLevel);

  showPage("result");

  speak(
    "Your assessment result is " +
    assessmentLevel +
    ". You can choose what support you need now."
  );
}


function getAssessmentMessage(level) {

  if (level === "LOW") {
    return "Your responses indicate lower support priority at this moment.";
  }

  if (level === "MODERATE") {
    return "Your responses indicate that some additional emotional support may be useful.";
  }

  if (level === "HIGH") {
    return "Your responses indicate a higher support priority. Consider connecting with a trusted person or support service.";
  }

  return "Your responses indicate a critical support priority. Consider using the urgent support options available in SAHAY.";
}


/* =========================
   MOOD MENU
========================= */

function showMoodMenu() {
  showPage("moodMenu");
}


function selectMood(option) {

  selectedMood = option;

  if (option === "calm") {
    showPage("calmScreen");
  }

  else if (option === "encourage") {
    showPage("encourageScreen");
  }

  else if (option === "talk") {
    openChat();
  }

  else if (option === "focus") {
    showPage("focusScreen");
  }

  else if (option === "connect") {
    openServices();
  }

  else if (option === "urgent") {
    showUrgentSupport();
  }
}


function showCalmScreen() {
  showPage("calmScreen");
}


function showEncourageScreen() {
  showPage("encourageScreen");
}


function showTalkScreen() {
  openChat();
}


function showFocusScreen() {
  showPage("focusScreen");
}


function showConnectScreen() {
  openServices();
}


function showUrgentScreen() {
  showUrgentSupport();
}


/* =========================
   VOICE SYSTEM
========================= */

function getSelectedVoiceGender() {

  const selected =
    document.querySelector(
      'input[name="voiceGender"]:checked'
    );

  return selected ? selected.value : "female";
}


function getLanguageCode() {

  const select =
    document.getElementById("languageSelect");

  return select ? select.value : "en";
}


function getLanguageSpeechCode() {

  const language = getLanguageCode();

  const languages = {

    en: "en-IN",
    hi: "hi-IN",
    te: "te-IN",
    ta: "ta-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    bn: "bn-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    ur: "ur-IN"

  };

  return languages[language] || "en-IN";
}


function speak(text) {

  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang = getLanguageSpeechCode();

  const voices =
    window.speechSynthesis.getVoices();

  const gender =
    getSelectedVoiceGender();

  let matchingVoice = null;

  if (gender === "female") {

    matchingVoice = voices.find(v =>
      /female|zira|samantha|google.*female|heera/i.test(v.name)
    );

  } else {

    matchingVoice = voices.find(v =>
      /male|david|alex|google.*male|ravi/i.test(v.name)
    );

  }

  if (!matchingVoice) {

    matchingVoice = voices.find(v =>
      v.lang.toLowerCase()
        .startsWith(
          getLanguageCode().toLowerCase()
        )
    );

  }

  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  utterance.rate = 0.95;
  utterance.pitch = gender === "female" ? 1.1 : 0.9;

  window.speechSynthesis.speak(utterance);
}


function testVoice() {

  const messages = {

    en: "Hello. I am SAHAY. I am here to listen and support you.",

    hi: "नमस्ते। मैं सहाय हूँ। मैं आपकी बात सुनने और सहायता करने के लिए यहाँ हूँ।",

    te: "నమస్కారం. నేను సహాయ్. మీ మాట వినడానికి మరియు మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను.",

    ta: "வணக்கம். நான் சஹாய். உங்கள் பேச்சைக் கேட்டு உதவ இங்கே இருக்கிறேன்.",

    kn: "ನಮಸ್ಕಾರ. ನಾನು ಸಹಾಯ್. ನಿಮ್ಮ ಮಾತನ್ನು ಕೇಳಲು ಮತ್ತು ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ.",

    ml: "നമസ്കാരം. ഞാൻ സഹായി. നിങ്ങളുടെ വാക്കുകൾ കേൾക്കാനും സഹായിക്കാനും ഞാൻ ഇവിടെയുണ്ട്.",

    bn: "নমস্কার। আমি সহায়। আপনার কথা শুনতে এবং সাহায্য করতে আমি এখানে আছি।",

    mr: "नमस्कार. मी सहाय आहे. तुमचे म्हणणे ऐकण्यासाठी आणि मदत करण्यासाठी मी येथे आहे.",

    gu: "નમસ્તે. હું સહાય છું. તમારી વાત સાંભળવા અને મદદ કરવા માટે હું અહીં છું.",

    ur: "السلام علیکم۔ میں سہای ہوں۔ آپ کی بات سننے اور مدد کرنے کے لیے یہاں ہوں۔"

  };

  speak(messages[getLanguageCode()] || messages.en);
}


window.speechSynthesis.onvoiceschanged = function () {
  window.speechSynthesis.getVoices();
};


/* =========================
   LANGUAGE
========================= */

function changeLanguage() {

  const language =
    getLanguageCode();

  const greetings = {

    en: "Language changed to English.",

    hi: "भाषा हिन्दी में बदल दी गई है।",

    te: "భాష తెలుగుకు మార్చబడింది.",

    ta: "மொழி தமிழுக்கு மாற்றப்பட்டது.",

    kn: "ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಲಾಗಿದೆ.",

    ml: "ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി.",

    bn: "ভাষা বাংলায় পরিবর্তন করা হয়েছে।",

    mr: "भाषा मराठीत बदलली आहे.",

    gu: "ભાષા ગુજરાતીમાં બદલવામાં આવી છે.",

    ur: "زبان اردو میں تبدیل کر دی گئی ہے۔"

  };

  speak(greetings[language] || greetings.en);
}


/* =========================
   AI CHAT
========================= */

function openChat() {

  showPage("chat");

  const box =
    document.getElementById("chatMessages");

  if (box.children.length === 0) {

    addBotMessage(
      "I'm listening. You can tell me what happened in your own words."
    );

  }
}


function addBotMessage(message) {

  const box =
    document.getElementById("chatMessages");

  const div =
    document.createElement("div");

  div.className = "bot-message";

  div.innerHTML =
    `<b>SAHAY</b><p>${escapeHTML(message)}</p>`;

  box.appendChild(div);

  box.scrollTop = box.scrollHeight;
}


function addUserMessage(message) {

  const box =
    document.getElementById("chatMessages");

  const div =
    document.createElement("div");

  div.className = "user-message";

  div.textContent = message;

  box.appendChild(div);

  box.scrollTop = box.scrollHeight;
}


function sendChat() {

  const input =
    document.getElementById("chatInput");

  const message =
    input.value.trim();

  if (!message) {
    return;
  }

  addUserMessage(message);

  input.value = "";

  setTimeout(() => {

    const reply =
      generateSupportReply(message);

    addBotMessage(reply);

    speak(reply);

  }, 500);
}


function generateSupportReply(message) {

  const text =
    message.toLowerCase();

  if (
    text.includes("danger") ||
    text.includes("unsafe") ||
    text.includes("threat") ||
    text.includes("kill")
  ) {

    return "I hear you. If you are in immediate danger, please consider using the urgent support options or contacting emergency services. You can also use SAHAY Safe Signal.";

  }

  if (
    text.includes("legal") ||
    text.includes("law") ||
    text.includes("police")
  ) {

    return "You can explore the Legal Support section in SAHAY. You may also choose to contact an appropriate authority or trusted person.";

  }

  if (
    text.includes("scared") ||
    text.includes("fear") ||
    text.includes("anxious")
  ) {

    return "It sounds like this situation may feel difficult. You can take a slow breath, tell me what happened in your own words, or open the Personal Comfort Room.";

  }

  if (
    text.includes("doctor") ||
    text.includes("medical") ||
    text.includes("injury")
  ) {

    return "If you need medical attention, please consider contacting an appropriate healthcare professional or emergency service.";

  }

  return "I'm listening. You can continue describing what happened, or choose one of the support options available in SAHAY.";
}


function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


/* =========================
   SPEECH RECOGNITION
========================= */

function startSpeechRecognition() {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    alert(
      "Speech recognition is not supported in this browser. Try Chrome."
    );

    return;
  }

  const recognition =
    new SpeechRecognition();

  recognition.lang =
    getLanguageSpeechCode();

  recognition.interimResults = false;

  recognition.onresult = function(event) {

    const transcript =
      event.results[0][0].transcript;

    document.getElementById("chatInput").value =
      transcript;

  };

  recognition.onerror = function() {
    alert("Voice recognition could not start.");
  };

  recognition.start();
}


/* =========================
   SAFE SIGNAL
========================= */

function openSafeSignal() {

  resetSafeSignal();

  showPage("safeSignal");
}


function activateSafeMode() {
  showPage("safeSignal");
}


function handleTap() {

  if (isHolding) {
    return;
  }

  tapCount++;

  clearTimeout(tapTimer);

  tapTimer = setTimeout(() => {

    if (tapCount === 1) {

      sendSafeSignal("support");

    } else if (tapCount >= 2) {

      sendSafeSignal("unsafe");

    }

    tapCount = 0;

  }, 400);
}


function startHold(event) {

  if (event) {
    event.preventDefault();
  }

  if (isHolding) {
    return;
  }

  isHolding = true;

  holdTimer = setTimeout(() => {

    isHolding = false;
    tapCount = 0;

    sendSafeSignal("urgent");

  }, 2000);
}


function cancelHold(event) {

  if (event) {
    event.preventDefault();
  }

  clearTimeout(holdTimer);

  setTimeout(() => {
    isHolding = false;
  }, 50);
}


function sendSafeSignal(type) {

  let signal = {
    type: type,
    priority: "NORMAL",
    timestamp: new Date().toISOString(),
    status: "Awaiting human response"
  };

  if (type === "unsafe") {
    signal.priority = "HIGH";
  }

  if (type === "urgent") {
    signal.priority = "URGENT";
  }

  localStorage.setItem(
    "sahaySafeSignal",
    JSON.stringify(signal)
  );

  showSignalConfirmation(signal);
}


function showSignalConfirmation(signal) {

  let emoji = "🟢";
  let title = "I NEED SUPPORT";

  if (signal.type === "unsafe") {
    emoji = "🟡";
    title = "I FEEL UNSAFE";
  }

  if (signal.type === "urgent") {
    emoji = "🔴";
    title = "URGENT HELP";
  }

  document.getElementById("signalEmoji").textContent =
    emoji;

  document.getElementById("signalTitle").textContent =
    title;

  document.getElementById("signalPriority").textContent =
    signal.priority;

  document.getElementById("signalTime").textContent =
    formatTime(signal.timestamp);

  showPage("signalResult");

  if (signal.type === "urgent") {
    setTimeout(() => {
      showUrgentSupport();
    }, 1500);
  }
}


function showSupportAlert() {

  const saved =
    localStorage.getItem("sahaySafeSignal");

  if (!saved) {
    alert("No signal found.");
    return;
  }

  const signal =
    JSON.parse(saved);

  document.getElementById("alertSignal").textContent =
    signal.type === "support"
      ? "I NEED SUPPORT"
      : signal.type === "unsafe"
        ? "I FEEL UNSAFE"
        : "URGENT HELP";

  document.getElementById("alertPriority").textContent =
    signal.priority;

  document.getElementById("alertTime").textContent =
    formatTime(signal.timestamp);

  showPage("supportAlert");
}


function showUrgentSupport() {
  showPage("urgentScreen");
}


function resetSafeSignal() {

  clearTimeout(holdTimer);
  clearTimeout(tapTimer);

  tapCount = 0;
  isHolding = false;
}


/* =========================
   PERSONAL COMFORT ROOM
========================= */

function openComfortRoom() {
  showPage("comfortRoom");
}


function selectEnvironment(environment) {

  selectedEnvironment = environment;

  const data = {

    rain: {
      icon: "🌧️",
      title: "Rain",
      background: "linear-gradient(135deg,#dbeeff,#edf6ff)"
    },

    ocean: {
      icon: "🌊",
      title: "Ocean",
      background: "linear-gradient(135deg,#d7f8ff,#e7f9ff)"
    },

    nature: {
      icon: "🌳",
      title: "Nature",
      background: "linear-gradient(135deg,#ddf6dd,#effbef)"
    },

    piano: {
      icon: "🎹",
      title: "Piano Music",
      background: "linear-gradient(135deg,#eee0ff,#f8f0ff)"
    },

    soft: {
      icon: "🎶",
      title: "Soft Music",
      background: "linear-gradient(135deg,#fff0da,#fff8ee)"
    }

  };

  const selected =
    data[environment];

  document.getElementById("relaxIcon").textContent =
    selected.icon;

  document.getElementById("environmentTitle").textContent =
    selected.title;

  document.getElementById("relaxSession").style.background =
    selected.background;

  localStorage.setItem(
    "sahayComfortEnvironment",
    environment
  );
}


function startRelaxation() {

  if (!selectedEnvironment) {

    alert("Please choose an environment first.");

    return;
  }

  if (relaxTimer) {
    return;
  }

  relaxTimer =
    setInterval(() => {

      if (relaxSeconds <= 0) {

        clearInterval(relaxTimer);
        relaxTimer = null;

        alert(
          "🌿 Session Complete\n\nTake a slow breath. You've completed your relaxation moment."
        );

        return;
      }

      relaxSeconds--;

      updateRelaxTimer();

    }, 1000);
}


function pauseRelaxation() {

  clearInterval(relaxTimer);
  relaxTimer = null;
}


function resetRelaxation() {

  pauseRelaxation();

  relaxSeconds = 120;

  updateRelaxTimer();
}


function updateRelaxTimer() {

  document.getElementById("relaxTimer").textContent =
    formatSeconds(relaxSeconds);
}


function toggleSound() {

  soundEnabled = !soundEnabled;

  alert(
    soundEnabled
      ? "Sound enabled. Add audio files later if required."
      : "Sound disabled."
  );
}


/* =========================
   BREATHING
========================= */

function startBreathing() {

  if (breathingTimer) {
    return;
  }

  document.getElementById("breathingCircle")
    .classList.add("breathe-animation");

  let phase = 0;

  breathingTimer =
    setInterval(() => {

      if (breathingSeconds <= 0) {

        stopBreathing();

        document.getElementById("breathingText")
          .textContent = "Complete 💙";

        return;
      }

      breathingSeconds--;

      document.getElementById("calmTimer").textContent =
        formatSeconds(breathingSeconds);

      phase++;

      if (phase % 3 === 0) {

        document.getElementById("breathingText")
          .textContent = "Breathe In";

      } else if (phase % 3 === 1) {

        document.getElementById("breathingText")
          .textContent = "Hold";

      } else {

        document.getElementById("breathingText")
          .textContent = "Breathe Out";

      }

    }, 1000);
}


function stopBreathing() {

  clearInterval(breathingTimer);

  breathingTimer = null;

  const circle =
    document.getElementById("breathingCircle");

  if (circle) {
    circle.classList.remove("breathe-animation");
  }
}


/* =========================
   DAILY RECOVERY
========================= */

function getTodayKey() {

  const date =
    new Date();

  return date.toISOString().split("T")[0];
}


function getDailyData() {

  const key =
    "sahayDaily_" + getTodayKey();

  const saved =
    localStorage.getItem(key);

  if (saved) {
    return JSON.parse(saved);
  }

  return {

    date: getTodayKey(),

    mood: "",

    calmCompleted: false,

    journalCompleted: false,

    journalText: "",

    positiveActivity: "",

    positiveCompleted: false,

    supportOpened: false,

    completed: false

  };
}


function saveDailyData(data) {

  const key =
    "sahayDaily_" + getTodayKey();

  localStorage.setItem(
    key,
    JSON.stringify(data)
  );
}


function openDailyRecovery() {

  showPage("dailyRecovery");

  loadTodayCheckIn();

  loadPositiveActivity();

  updateRecoveryProgress();
}


function loadTodayCheckIn() {

  const data =
    getDailyData();

  if (data.mood) {

    document.getElementById("moodStatus")
      .textContent =
      "Mood saved: " + data.mood;

  }

  document.getElementById("journalText").value =
    data.journalText || "";

  if (data.journalCompleted) {

    document.getElementById("journalStatus")
      .textContent = "Journal saved.";

  }

  if (data.positiveCompleted) {

    document.getElementById("positiveStatus")
      .textContent = "Completed.";

  }

  if (data.supportOpened) {

    document.getElementById("supportStatus")
      .textContent = "Support section opened.";

  }
}


function saveMood(mood) {

  const data =
    getDailyData();

  data.mood = mood;

  saveDailyData(data);

  document.getElementById("moodStatus")
    .textContent =
    "Thank you. Mood saved: " + mood;

  updateRecoveryProgress();
}


function startDailyCalm() {

  if (dailyCalmTimer) {
    return;
  }

  dailyCalmTimer =
    setInterval(() => {

      if (dailyCalmSeconds <= 0) {

        pauseDailyCalm();

        const data =
          getDailyData();

        data.calmCompleted = true;

        saveDailyData(data);

        document.getElementById("calmStatus")
          .textContent =
          "✓ Calm activity completed.";

        updateRecoveryProgress();

        return;
      }

      dailyCalmSeconds--;

      document.getElementById("dailyCalmTimer")
        .textContent =
        formatSeconds(dailyCalmSeconds);

    }, 1000);
}


function pauseDailyCalm() {

  clearInterval(dailyCalmTimer);
  dailyCalmTimer = null;
}


function resetDailyCalm() {

  pauseDailyCalm();

  dailyCalmSeconds = 120;

  document.getElementById("dailyCalmTimer")
    .textContent =
    "02:00";
}


function saveJournal() {

  const text =
    document.getElementById("journalText").value.trim();

  const data =
    getDailyData();

  data.journalText = text;
  data.journalCompleted = true;

  saveDailyData(data);

  document.getElementById("journalStatus")
    .textContent =
    text
      ? "Journal saved privately on this device."
      : "Journal marked complete.";

  updateRecoveryProgress();
}


function skipJournal() {

  const data =
    getDailyData();

  data.journalCompleted = true;

  saveDailyData(data);

  document.getElementById("journalStatus")
    .textContent =
    "Journal skipped.";

  updateRecoveryProgress();
}


function loadPositiveActivity() {

  const activities = [

    "Drink a glass of water.",

    "Take five slow breaths.",

    "Spend two quiet minutes outside.",

    "Listen to a calming song.",

    "Write down one thing you want to finish today.",

    "Talk to someone you trust.",

    "Take a short walk.",

    "Give yourself a few quiet minutes."

  ];

  const index =
    new Date().getDate() %
    activities.length;

  const data =
    getDailyData();

  data.positiveActivity =
    activities[index];

  saveDailyData(data);

  document.getElementById("positiveActivity")
    .textContent =
    activities[index];
}


function completePositiveActivity() {

  const data =
    getDailyData();

  data.positiveCompleted = true;

  saveDailyData(data);

  document.getElementById("positiveStatus")
    .textContent =
    "✓ Small step completed.";

  updateRecoveryProgress();
}


function openSupportConnection() {

  const data =
    getDailyData();

  data.supportOpened = true;

  saveDailyData(data);

  updateRecoveryProgress();

  openServices();
}


function skipSupport() {

  const data =
    getDailyData();

  data.supportOpened = true;

  saveDailyData(data);

  document.getElementById("supportStatus")
    .textContent =
    "Support skipped for now.";

  updateRecoveryProgress();
}


function updateRecoveryProgress() {

  const data =
    getDailyData();

  let completed = 0;

  if (data.mood) {
    completed++;
  }

  if (data.calmCompleted) {
    completed++;
  }

  if (data.journalCompleted) {
    completed++;
  }

  if (data.positiveCompleted) {
    completed++;
  }

  if (data.supportOpened) {
    completed++;
  }

  const percentage =
    (completed / 5) * 100;

  document.getElementById(
    "recoveryProgress"
  ).style.width =
    percentage + "%";

  document.getElementById(
    "recoveryProgressText"
  ).textContent =
    completed + "/5";
}


function completeDailyCheckIn() {

  const data =
    getDailyData();

  if (
    !data.mood ||
    !data.calmCompleted ||
    !data.positiveCompleted
  ) {

    alert(
      "Please complete the Mood Check, 2-Minute Calm and Positive Activity. Journal and Support are optional."
    );

    return;
  }

  data.completed = true;

  saveDailyData(data);

  document.getElementById(
    "completionMessage"
  ).textContent =
    "💙 TODAY'S CHECK-IN COMPLETE — You've completed today's check-in.";

  updateRecoveryProgress();
}


function saveDailyCheckIn() {
  const data = getDailyData();
  saveDailyData(data);
}


function loadRecoveryHistory() {

  const history = [];

  for (let i = 0; i < localStorage.length; i++) {

    const key =
      localStorage.key(i);

    if (key.startsWith("sahayDaily_")) {

      history.push(
        JSON.parse(
          localStorage.getItem(key)
        )
      );

    }

  }

  return history;
}


/* =========================
   INCIDENT MAP
========================= */

function openIncidentMap() {

  showPage("incidentMap");

  document.getElementById("incidentResult")
    .style.display = "none";
}


function createIncidentMap() {

  const narrative =
    document.getElementById(
      "incidentNarrative"
    ).value.trim();

  if (!narrative) {

    alert(
      "Please describe what happened first."
    );

    return;
  }

  const lower =
    narrative.toLowerCase();


  /* WHEN */

  let when = "Not mentioned.";

  const datePatterns = [

    /yesterday/i,
    /today/i,
    /tomorrow/i,
    /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/,
    /\b\d{1,2}(st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\b/i

  ];

  for (const pattern of datePatterns) {

    const match =
      narrative.match(pattern);

    if (match) {

      when = match[0];

      break;
    }
  }


  /* WHERE */

  let where = "Not mentioned.";

  const locationMatch =
    narrative.match(
      /\b(?:near|at|in|inside|outside)\s+([A-Za-z0-9 ,.'-]{2,60})/i
    );

  if (locationMatch) {

    where =
      locationMatch[1]
        .split(/[.!?]/)[0]
        .trim();

  }


  /* WHAT HAPPENED */

  let what = "Not mentioned.";

  const incidentWords = [
    "threatened",
    "threat",
    "attacked",
    "attack",
    "harassed",
    "harassment",
    "abused",
    "abuse",
    "violence",
    "assault",
    "discriminated",
    "discrimination"
  ];

  const foundIncident =
    incidentWords.find(word =>
      lower.includes(word)
    );

  if (foundIncident) {

    what =
      "Narrative contains information about " +
      foundIncident + ".";

  }


  /* PEOPLE */

  let people = "Not mentioned.";

  const peopleWords = [
    "my friend",
    "my brother",
    "my sister",
    "my father",
    "my mother",
    "my family",
    "a person",
    "someone",
    "neighbour",
    "neighbor",
    "teacher",
    "student"
  ];

  const foundPeople =
    peopleWords.filter(word =>
      lower.includes(word)
    );

  if (foundPeople.length > 0) {

    people =
      foundPeople.join(", ");

  }


  /* FEELING */

  let feeling = "Not mentioned.";

  const feelingWords = [
    "scared",
    "afraid",
    "fear",
    "anxious",
    "anxiety",
    "worried",
    "unsafe",
    "sad",
    "angry",
    "distressed"
  ];

  const foundFeeling =
    feelingWords.filter(word =>
      lower.includes(word)
    );

  if (foundFeeling.length > 0) {

    feeling =
      foundFeeling.join(", ");

  }


  /* SUPPORT */

  let support = "Not mentioned.";

  if (
    lower.includes("legal") ||
    lower.includes("law")
  ) {

    support = "Legal support";

  } else if (
    lower.includes("police")
  ) {

    support = "Police/support authority";

  } else if (
    lower.includes("doctor") ||
    lower.includes("medical") ||
    lower.includes("hospital")
  ) {

    support = "Medical support";

  } else if (
    lower.includes("counselling") ||
    lower.includes("counseling")
  ) {

    support = "Counselling support";

  } else if (
    lower.includes("emergency") ||
    lower.includes("urgent")
  ) {

    support = "Emergency support";

  }


  document.getElementById("incidentWhen").value =
    when;

  document.getElementById("incidentWhere").value =
    where;

  document.getElementById("incidentWhat").value =
    what;

  document.getElementById("incidentPeople").value =
    people;

  document.getElementById("incidentFeeling").value =
    feeling;

  document.getElementById("incidentSupport").value =
    support;

  document.getElementById("incidentResult")
    .style.display = "block";

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });

}


function editIncidentMap() {

  document.getElementById("incidentWhen").disabled =
    false;

  document.getElementById("incidentWhere").disabled =
    false;

  document.getElementById("incidentWhat").disabled =
    false;

  document.getElementById("incidentPeople").disabled =
    false;

  document.getElementById("incidentFeeling").disabled =
    false;

  document.getElementById("incidentSupport").disabled =
    false;

}


function confirmIncident() {

  const incidentData = {

    when:
      document.getElementById("incidentWhen").value,

    where:
      document.getElementById("incidentWhere").value,

    whatHappened:
      document.getElementById("incidentWhat").value,

    peopleInvolved:
      document.getElementById("incidentPeople").value,

    feeling:
      document.getElementById("incidentFeeling").value,

    supportNeeded:
      document.getElementById("incidentSupport").value,

    originalNarrative:
      document.getElementById("incidentNarrative").value,

    timestamp:
      new Date().toISOString()

  };

  localStorage.setItem(
    "sahayIncident",
    JSON.stringify(incidentData)
  );

  alert(
    "✓ Incident Map confirmed and saved locally for this prototype."
  );

}


/* =========================
   INCIDENT VOICE
========================= */

function startIncidentVoice() {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    alert(
      "Speech recognition is not supported. Try Chrome."
    );

    return;
  }

  incidentRecognition =
    new SpeechRecognition();

  incidentRecognition.lang =
    getLanguageSpeechCode();

  incidentRecognition.interimResults =
    false;

  incidentRecognition.onresult =
    function(event) {

      const transcript =
        event.results[0][0].transcript;

      document.getElementById(
        "incidentNarrative"
      ).value +=
        " " + transcript;

    };

  incidentRecognition.start();
}


/* =========================
   SERVICES
========================= */

function openServices() {

  showPage("services");

}


function showResources() {

  showPage("resources");

}


/* =========================
   UTILITY FUNCTIONS
========================= */

function formatSeconds(totalSeconds) {

  const minutes =
    Math.floor(totalSeconds / 60);

  const seconds =
    totalSeconds % 60;

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  );
}


function formatTime(timestamp) {

  const date =
    new Date(timestamp);

  return date.toLocaleString();

}


/* =========================
   INITIALIZATION
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    showPage("home");

    updateRelaxTimer();

    document.getElementById(
      "dailyCalmTimer"
    ).textContent =
      "02:00";

    const savedEnvironment =
      localStorage.getItem(
        "sahayComfortEnvironment"
      );

    if (savedEnvironment) {

      selectEnvironment(
        savedEnvironment
      );

    }

  }
);













/* =================================
   ABOUT / PROFILE
================================= */

function openProfile() {

    // Hide all existing pages
    document.querySelectorAll(".page").forEach(function(page) {
        page.style.display = "none";
    });

    // Show profile page
    const profilePage =
        document.getElementById("profilePage");

    if (profilePage) {
        profilePage.style.display = "block";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function goHome() {

    const profilePage =
        document.getElementById("profilePage");

    if (profilePage) {
        profilePage.style.display = "none";
    }

    // If your existing app already has a home function,
    // use that function here.
    if (typeof showPage === "function") {
        showPage("home");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}














/* =====================================
   SAHAY 360 USER PROFILE
===================================== */


/* OPEN PROFILE */

function openUserProfile() {

    // Hide existing pages
    document.querySelectorAll(".page").forEach(function(page) {
        page.style.display = "none";
    });

    // Hide other main sections if your app uses sections
    const home = document.getElementById("homePage");

    if (home) {
        home.style.display = "none";
    }


    // Show profile
    const profile =
        document.getElementById("userProfilePage");

    if (profile) {

        profile.style.display = "block";

        loadUserProfile();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


/* CLOSE PROFILE */

function closeUserProfile() {

    const profile =
        document.getElementById("userProfilePage");

    if (profile) {
        profile.style.display = "none";
    }


    // Return to your existing home
    if (typeof showPage === "function") {

        showPage("home");

    } else {

        const home =
            document.getElementById("homePage");

        if (home) {
            home.style.display = "block";
        }
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ENABLE EDIT */

function enableProfileEdit() {

    const fields = [
        "profileName",
        "profileEmail",
        "profileMobile",
        "profileAge",
        "profileGender"
    ];


    fields.forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.disabled = false;
        }

    });


    alert(
        "You can now edit your profile information."
    );
}


/* SAVE PROFILE */

function saveUserProfile() {

    const profileData = {

        name:
            document.getElementById("profileName").value,

        email:
            document.getElementById("profileEmail").value,

        mobile:
            document.getElementById("profileMobile").value,

        age:
            document.getElementById("profileAge").value,

        gender:
            document.getElementById("profileGender").value,

        location:
            document.getElementById("profileLocation").value,

        language:
            document.getElementById("profileLanguage").value,

        voice:
            document.getElementById("profileVoice").value,

        sound:
            document.getElementById("profileSound").checked,

        emergencyName:
            document.getElementById("emergencyName").value,

        emergencyNumber:
            document.getElementById("emergencyNumber").value
    };


    localStorage.setItem(
        "sahayUserProfile",
        JSON.stringify(profileData)
    );


    // Update header
    updateProfileHeader(profileData);


    // Disable personal fields
    [
        "profileName",
        "profileEmail",
        "profileMobile",
        "profileAge",
        "profileGender"
    ].forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.disabled = true;
        }

    });


    alert(
        "Your profile has been saved successfully."
    );
}


/* LOAD PROFILE */

function loadUserProfile() {

    const saved =
        localStorage.getItem(
            "sahayUserProfile"
        );


    if (!saved) {

        // Use login information if available
        const loginUser =
            localStorage.getItem(
                "sahayUser"
            );

        if (loginUser) {

            document.getElementById(
                "profileName"
            ).value = loginUser;

            document.getElementById(
                "profileDisplayName"
            ).textContent = loginUser;
        }

        return;
    }


    const data =
        JSON.parse(saved);


    document.getElementById(
        "profileName"
    ).value = data.name || "";


    document.getElementById(
        "profileEmail"
    ).value = data.email || "";


    document.getElementById(
        "profileMobile"
    ).value = data.mobile || "";


    document.getElementById(
        "profileAge"
    ).value = data.age || "";


    document.getElementById(
        "profileGender"
    ).value = data.gender || "";


    document.getElementById(
        "profileLocation"
    ).value = data.location || "";


    document.getElementById(
        "profileLanguage"
    ).value = data.language || "English";


    document.getElementById(
        "profileVoice"
    ).value = data.voice || "Female";


    document.getElementById(
        "profileSound"
    ).checked =
        data.sound !== false;


    document.getElementById(
        "emergencyName"
    ).value = data.emergencyName || "";


    document.getElementById(
        "emergencyNumber"
    ).value = data.emergencyNumber || "";


    updateProfileHeader(data);
}


/* UPDATE HEADER */

function updateProfileHeader(data) {

    const name =
        data.name || "Your Name";

    const email =
        data.email || "your@email.com";


    document.getElementById(
        "profileDisplayName"
    ).textContent = name;


    document.getElementById(
        "profileDisplayEmail"
    ).textContent = email;
}


/* PROFILE PHOTO */

function changeProfilePhoto() {

    alert(
        "Profile photo selection can be connected to a real image upload later."
    );
}


/* LOGOUT */

function logoutUser() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {
        return;
    }


    localStorage.removeItem(
        "sahayLoggedIn"
    );


    window.location.href =
        "login.html";
}