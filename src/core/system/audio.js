export function playStartupChime() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();

  // Create a clean, pleasant C Major chord (heavenly bell/chime sound)
  const frequencies = [
    130.81, // C3 (soft body)
    261.63, // C4 (root)
    329.63, // E4 (third)
    392.00, // G4 (fifth)
    523.25, // C5 (octave)
    659.25, // E5 
  ];

  const duration = 4.0;
  const attack = 0.05;
  const decay = 3.5;

  // Master volume control - keep it gentle
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + attack);
  masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + attack + decay);
  
  // Clean up
  setTimeout(() => {
    masterGain.disconnect();
  }, (duration + 0.5) * 1000);

  frequencies.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    // Pure sine waves sound like glass bells or tuning forks
    osc.type = "sine";

    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Balance volumes: lower notes are slightly louder for warmth, high notes are soft
    const volume = index === 0 ? 0.5 : 0.3 / (index + 1);
    oscGain.gain.value = volume;

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  });
}
