const orb = document.querySelector(".cursor-orb");
const soundButton = document.querySelector(".sound-toggle");
const soundLabel = document.querySelector(".sound-label");

let audioContext;
let masterGain;
let oscillators = [];
let isPlaying = false;

window.addEventListener("pointermove", (event) => {
  orb.style.left = `${event.clientX}px`;
  orb.style.top = `${event.clientY}px`;
});

function createAmbientLoop() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioContext.destination);

  [130.81, 196, 261.63, 329.63].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = index % 2 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.value = index === 0 ? 0.018 : 0.009;
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start();
    oscillators.push(oscillator);
  });
}

soundButton.addEventListener("click", () => {
  if (!audioContext) createAmbientLoop();
  if (audioContext.state === "suspended") audioContext.resume();
  isPlaying = !isPlaying;
  masterGain.gain.cancelScheduledValues(audioContext.currentTime);
  masterGain.gain.linearRampToValueAtTime(isPlaying ? 0.7 : 0, audioContext.currentTime + 0.8);
  soundButton.setAttribute("aria-pressed", String(isPlaying));
  soundLabel.textContent = isPlaying ? "Sound on" : "Sound off";
  soundButton.querySelector(".sound-icon").textContent = isPlaying ? "◖" : "♫";
});
