const textInput = document.getElementById('text-input');
const convertBtn = document.getElementById('convert-btn');
const stopBtnText = document.getElementById('stop-btn-text');
const stopBtnVoice = document.getElementById('stop-btn-voice');
const langSelect = document.getElementById('tts-language');
const langSelectSTT = document.getElementById('language-stt');

// Missing button references
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const clearOutputBtn = document.getElementById('clear-output');
const themeToggle = document.getElementById('theme-toggle');

let speechSynthesis = window.speechSynthesis;
let speechSynthesisUtterance = new SpeechSynthesisUtterance();
speechSynthesisUtterance.onend = () => {
    convertBtn.disabled = false;
    stopBtnText.disabled = false;
};

convertBtn.addEventListener('click', () => {
    let text = textInput.value.trim();
    if (text !== '') {
        speechSynthesisUtterance.text = text;
        speechSynthesisUtterance.lang = langSelect.value;

        speechSynthesis.speak(speechSynthesisUtterance);
        convertBtn.disabled = true;
        stopBtnText.disabled = false;
    }
});

/* =========================
   STOP SPEECH
========================= */

stopBtnText.addEventListener("click", () => {
  speechSynthesis.cancel();
  convertBtn.disabled = false;
  stopBtnText.disabled = true;
});

// speech to text
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn-voice');
    const output = document.getElementById('output');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = langSelectSTT.value;

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript;
            }
            output.value = transcript;
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
        };

        startBtn.addEventListener('click', () => {
            recognition.lang = langSelect.value; // dynamic language
            recognition.start();
        });

        stopBtnVoice.addEventListener('click', () => {
            recognition.stop();
            listeningStatus.textContent = "⛔ Stopped";
            startBtn.disabled = false;
            stopBtnVoice.disabled = true;
        });
    } else {
        listeningStatus.textContent =
            "❌ Speech Recognition not supported in this browser.";
    }
});

/* =========================
   COPY OUTPUT
========================= */

copyBtn.addEventListener("click", async () => {
  if (!output.value.trim()) {
    alert("Nothing to copy!");
    return;
  }

  await navigator.clipboard.writeText(output.value);
  alert("Copied successfully!");
});

/* =========================
   DOWNLOAD OUTPUT
========================= */

downloadBtn.addEventListener("click", () => {
  if (!output.value.trim()) {
    alert("Nothing to download!");
    return;
  }

  const blob = new Blob([output.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "speech-text.txt";
  a.click();
});

/* =========================
   CLEAR OUTPUT
========================= */

clearOutputBtn.addEventListener("click", () => {
  output.value = "";
  listeningStatus.textContent = "";
});

/* =========================
   THEME TOGGLE
========================= */

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
});