const player = document.querySelector('main');
const scene = document.querySelector('.scene');
const audio = document.querySelector('audio');
const controls = document.querySelector('.controls');
const picker = document.querySelector('input');
const choose = document.querySelector('#choose');
const play = document.querySelector('#play');
const status = document.querySelector('#status');
let localTrack;
let wakeLock;
let requestingLock = false;

function showStatus(message) {
  status.textContent = message;
  status.hidden = !message;
}

async function keepScreenOn() {
  if (!navigator.wakeLock || document.hidden || wakeLock || requestingLock) return;
  requestingLock = true;
  try {
    const lock = await navigator.wakeLock.request('screen');
    wakeLock = lock;
    lock.addEventListener('release', () => { wakeLock = null; });
  } catch {
    // A cena e a música continuam se o navegador recusar.
  } finally {
    requestingLock = false;
  }
}

function setControlsVisible(visible) {
  controls.hidden = !visible;
  if (!visible) keepScreenOn();
}

async function startMusic() {
  showStatus('');
  try {
    await audio.play();
  } catch (error) {
    if (error.name !== 'AbortError') {
      showStatus('Não foi possível tocar esta faixa. Tente um MP3, M4A ou WAV.');
    }
  }
}

if (audio.dataset.track) {
  audio.src = audio.dataset.track;
  play.hidden = false;
}

choose.addEventListener('click', () => picker.click());
picker.addEventListener('change', () => {
  const file = picker.files[0];
  if (!file) return;
  const previousTrack = localTrack;
  localTrack = URL.createObjectURL(file);
  audio.src = localTrack;
  if (previousTrack) URL.revokeObjectURL(previousTrack);
  play.hidden = false;
  picker.value = '';
  startMusic();
});

play.addEventListener('click', () => {
  if (audio.paused) startMusic();
  else audio.pause();
});

function updateAudioState() {
  play.textContent = audio.paused ? 'Tocar música' : 'Pausar música';
  scene.classList.toggle('music-paused', Boolean(audio.src) && audio.paused);
  if (!audio.paused) keepScreenOn();
}

for (const event of ['playing', 'pause', 'error']) {
  audio.addEventListener(event, updateAudioState);
}
updateAudioState();

document.querySelector('#fullscreen').addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await player.requestFullscreen();
  } catch {
    showStatus('Tela cheia indisponível neste navegador.');
  }
});
document.querySelector('#hide').addEventListener('click', () => setControlsVisible(false));
scene.addEventListener('click', () => setControlsVisible(controls.hidden));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && controls.hidden) setControlsVisible(true);
});
document.addEventListener('visibilitychange', () => {
  if (!controls.hidden && audio.paused) return;
  keepScreenOn();
});
