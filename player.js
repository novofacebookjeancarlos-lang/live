const player = document.querySelector('main');
const scene = document.querySelector('.scene');
const audio = document.querySelector('audio');
const controls = document.querySelector('.controls');
const picker = document.querySelector('#music-file');
const videoPicker = document.querySelector('#video-file');
const video = document.querySelector('video');
const choose = document.querySelector('#choose');
const play = document.querySelector('#play');
const status = document.querySelector('#status');
let localTrack;
let localVideo;
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

async function startPlayback() {
  if (!video.src) return;
  showStatus('');
  try {
    await Promise.all([video.play(), audio.src ? audio.play() : Promise.resolve()]);
  } catch (error) {
    if (error.name === 'AbortError') return;
    video.pause();
    audio.pause();
    showStatus('Não foi possível iniciar. Tente um vídeo MP4 e uma faixa MP3 ou M4A.');
  }
}

if (audio.dataset.track) {
  audio.src = audio.dataset.track;
  video.muted = true;
}

document.querySelector('#choose-video').addEventListener('click', () => videoPicker.click());
videoPicker.addEventListener('change', () => {
  const file = videoPicker.files[0];
  if (!file) return;
  audio.pause();
  const previousVideo = localVideo;
  localVideo = URL.createObjectURL(file);
  video.src = localVideo;
  if (previousVideo) URL.revokeObjectURL(previousVideo);
  play.hidden = false;
  videoPicker.value = '';
  showStatus('');
});

choose.addEventListener('click', () => picker.click());
picker.addEventListener('change', () => {
  const file = picker.files[0];
  if (!file) return;
  video.pause();
  const previousTrack = localTrack;
  localTrack = URL.createObjectURL(file);
  audio.src = localTrack;
  video.muted = true;
  if (previousTrack) URL.revokeObjectURL(previousTrack);
  picker.value = '';
  showStatus('');
});

play.addEventListener('click', () => {
  if (video.paused) startPlayback();
  else {
    video.pause();
    audio.pause();
  }
});

for (const event of ['playing', 'pause']) {
  video.addEventListener(event, () => {
    play.textContent = video.paused ? 'Iniciar' : 'Pausar';
    if (!video.paused) keepScreenOn();
  });
}

video.addEventListener('error', () => {
  audio.pause();
  showStatus('Não foi possível abrir o vídeo. Tente um MP4 compatível com o navegador.');
});
audio.addEventListener('error', () => {
  video.pause();
  showStatus('Não foi possível abrir a faixa. Tente um MP3 ou M4A.');
});

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
  if (!controls.hidden && video.paused) return;
  keepScreenOn();
});
