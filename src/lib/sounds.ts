// Web Audio API sound effects generator
// No external files needed - generates sounds procedurally

class SoundEngine {
  private audioContext: AudioContext | null = null;
  private enabled = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  // Play a simple tone
  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume = 0.3,
    attack = 0.01,
    decay = 0.1
  ) {
    if (!this.enabled) return;
    
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // ADSR envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
    gainNode.gain.linearRampToValueAtTime(volume * 0.7, ctx.currentTime + attack + decay);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  // Play a noise burst (for impacts)
  private playNoise(duration: number, volume = 0.2) {
    if (!this.enabled) return;
    
    const ctx = this.getContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1000;

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + duration);
  }

  // === Snake Sounds ===
  
  snakeEat() {
    this.playTone(523.25, 0.1, "sine", 0.3); // C5
    setTimeout(() => this.playTone(659.25, 0.1, "sine", 0.3), 50); // E5
    setTimeout(() => this.playTone(783.99, 0.15, "sine", 0.3), 100); // G5
  }

  snakeMove() {
    this.playTone(200, 0.05, "sine", 0.1);
  }

  snakeGameOver() {
    this.playTone(392, 0.15, "sawtooth", 0.3); // G4
    setTimeout(() => this.playTone(349.23, 0.15, "sawtooth", 0.3), 150); // F4
    setTimeout(() => this.playTone(329.63, 0.15, "sawtooth", 0.3), 300); // E4
    setTimeout(() => this.playTone(293.66, 0.3, "sawtooth", 0.4), 450); // D4
    setTimeout(() => this.playNoise(0.2, 0.15), 600);
  }

  snakeLevelUp() {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.1, "sine", 0.25), i * 80);
    });
  }

  // === Whack-a-Mole Sounds ===
  
  molePopUp() {
    this.playTone(300, 0.1, "sine", 0.2);
    setTimeout(() => this.playTone(400, 0.08, "sine", 0.2), 50);
  }

  moleWhack() {
    this.playNoise(0.08, 0.3);
    this.playTone(200, 0.1, "square", 0.2);
  }

  moleMiss() {
    this.playTone(200, 0.15, "sawtooth", 0.15);
  }

  comboSound(combo: number) {
    // Higher pitch for higher combos
    const baseFreq = 400 + combo * 100;
    this.playTone(baseFreq, 0.1, "sine", 0.3);
    setTimeout(() => this.playTone(baseFreq * 1.25, 0.1, "sine", 0.3), 60);
    setTimeout(() => this.playTone(baseFreq * 1.5, 0.15, "sine", 0.3), 120);
  }

  whackGameOver() {
    const notes = [440, 392, 349.23, 329.63]; // A4, G4, F4, E4
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, "triangle", 0.3), i * 200);
    });
  }

  whackTimeWarning() {
    this.playTone(880, 0.1, "square", 0.15);
  }

  // === General UI Sounds ===
  
  buttonClick() {
    this.playTone(600, 0.05, "sine", 0.15);
  }

  success() {
    this.playTone(523.25, 0.1, "sine", 0.2);
    setTimeout(() => this.playTone(659.25, 0.1, "sine", 0.2), 100);
    setTimeout(() => this.playTone(783.99, 0.2, "sine", 0.25), 200);
  }
}

export const sounds = new SoundEngine();
