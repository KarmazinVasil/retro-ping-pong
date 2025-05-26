const bootSound = document.getElementById("bootSound");
const bgNoise = document.getElementById("bgNoise");
const keyClick = document.getElementById("keyClick");
const paddleHit = document.getElementById("paddleHit");
const wallHit = document.getElementById("wallHit");
const scoreSound = document.getElementById("scoreSound");

function startAudio() {
  bootSound.volume = 0.5;
  bgNoise.volume = 0.2;
  keyClick.volume = 0.1;
  paddleHit.volume = 0.3;
  wallHit.volume = 12.8;
  scoreSound.volume = 0.4;

  const tryPlay = (audio) => {
    if (audio.paused) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  tryPlay(bootSound);
  tryPlay(bgNoise);

  document.removeEventListener("keydown", startAudio);
  document.removeEventListener("click", startAudio);
}

document.addEventListener("keydown", startAudio);
document.addEventListener("click", startAudio);



let pressedKeys = new Set();

document.addEventListener("keydown", (e) => {

  if (pressedKeys.has(e.code)) return;

  pressedKeys.add(e.code);

  keyClick.playbackRate = 0.9 + Math.random() * 0.3; 
  keyClick.currentTime = 0;
  keyClick.play().catch(() => {});
});

document.addEventListener("keyup", (e) => {
  pressedKeys.delete(e.code);
});

window.GameSounds = {
  paddleHit,
  wallHit,
  scoreSound
};