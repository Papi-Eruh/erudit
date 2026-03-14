const musicBtn = document.getElementById('music-btn');
const musicAudio = document.getElementById('bg-music');
let isMusicOn = false;

musicBtn.onclick = () => {
  isMusicOn = !isMusicOn;
  if (isMusicOn) {
    musicAudio.play().catch(() => {
      isMusicOn = false;
    });
  } else {
    musicAudio.pause();
  }
};
