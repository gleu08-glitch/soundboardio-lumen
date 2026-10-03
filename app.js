const sounds = [
  { key: '1', title: 'Lumen - 开心', frequency: 392, duration: 0.18 },
  { key: 'q', title: 'Gato - 无聊', frequency: 220, duration: 0.22 },
  { key: '2', title: 'Lumen - Excited', frequency: 440, duration: 0.18 },
  { key: 'w', title: 'Gato - Curious', frequency: 262, duration: 0.2 },
  { key: '3', title: 'Lumen - Victory', frequency: 523, duration: 0.16 },
  { key: 'e', title: 'Gato - Sneaky', frequency: 330, duration: 0.18 }
];

const soundMap = new Map(sounds.map((sound) => [sound.key, sound]));
const board = document.querySelector('#soundboard');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const toneCache = new Map();

function playTone(sound) {
  if (toneCache.has(sound.key)) {
    const saved = toneCache.get(sound.key);
    saved.currentTime = 0;
    saved.play();
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.value = sound.frequency;
  gainNode.gain.value = 0.03;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + sound.duration);

  toneCache.set(sound.key, { play: () => { /* noop */ } });
}

function renderBoard() {
  if (!board) {
    return;
  }

  board.innerHTML = sounds
    .map(
      (sound) => `
        <button class="sound-card" type="button" data-key="${sound.key}" aria-label="Play ${sound.title}">
          <span class="key">${sound.key}</span>
          <span class="label">${sound.title}</span>
        </button>
      `
    )
    .join('');
}

function handleSoundActivation(key) {
  const sound = soundMap.get(key);
  if (!sound) {
    return;
  }

  playTone(sound);

  const button = document.querySelector(`[data-key="${key}"]`);
  if (button) {
    button.classList.add('playing');
    window.setTimeout(() => button.classList.remove('playing'), 140);
  }
}

document.addEventListener('click', (event) => {
  const triggeredButton = event.target.closest('.sound-card');
  if (!triggeredButton) {
    return;
  }

  handleSoundActivation(triggeredButton.dataset.key);
});

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (soundMap.has(key)) {
    event.preventDefault();
    handleSoundActivation(key);
  }
});

renderBoard();
