export interface AlarmSound {
  id: string;
  name: string;
  description: string;
}

export const ALARM_SOUNDS: AlarmSound[] = [
  {
    id: "classic",
    name: "Clásico",
    description: "Tono tradicional de alarma",
  },
  {
    id: "gentle",
    name: "Suave",
    description: "Despertar gradual y relajante",
  },
  {
    id: "urgent",
    name: "Urgente",
    description: "Alarma intensa para despertar rápido",
  },
  {
    id: "melody",
    name: "Melodía",
    description: "Secuencia musical agradable",
  },
  {
    id: "birdsong",
    name: "Canto de pájaros",
    description: "Sonidos de naturaleza",
  },
  {
    id: "chimes",
    name: "Campanas",
    description: "Sonido de campanas suaves",
  },
];

export const playSound = (soundId: string = "classic") => {
  const audioContext = new AudioContext();

  switch (soundId) {
    case "classic":
      playClassicAlarm(audioContext);
      break;
    case "gentle":
      playGentleAlarm(audioContext);
      break;
    case "urgent":
      playUrgentAlarm(audioContext);
      break;
    case "melody":
      playMelodyAlarm(audioContext);
      break;
    case "birdsong":
      playBirdsongAlarm(audioContext);
      break;
    case "chimes":
      playChimesAlarm(audioContext);
      break;
    default:
      playClassicAlarm(audioContext);
  }
};

const playClassicAlarm = (audioContext: AudioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 2);
};

const playGentleAlarm = (audioContext: AudioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 400;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 1);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 3);
};

const playUrgentAlarm = (audioContext: AudioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 1000;
  oscillator.type = "square";

  for (let i = 0; i < 6; i++) {
    const startTime = audioContext.currentTime + i * 0.3;
    gainNode.gain.setValueAtTime(0.4, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
  }

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 2);
};

const playMelodyAlarm = (audioContext: AudioContext) => {
  const notes = [523.25, 587.33, 659.25, 783.99]; // C, D, E, G
  
  notes.forEach((freq, i) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = freq;
    oscillator.type = "sine";

    const startTime = audioContext.currentTime + i * 0.4;
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.35);
  });
};

const playBirdsongAlarm = (audioContext: AudioContext) => {
  // Simulate bird chirps with rapid frequency changes
  for (let i = 0; i < 4; i++) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const startTime = audioContext.currentTime + i * 0.6;
    oscillator.frequency.setValueAtTime(1800, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(2400, startTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(2000, startTime + 0.2);
    
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.2, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  }
};

const playChimesAlarm = (audioContext: AudioContext) => {
  const notes = [523.25, 659.25, 783.99]; // C, E, G major chord
  
  notes.forEach((freq, i) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = freq;
    oscillator.type = "sine";

    const startTime = audioContext.currentTime + i * 0.3;
    gainNode.gain.setValueAtTime(0.25, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);

    oscillator.start(startTime);
    oscillator.stop(startTime + 1.5);
  });
};
