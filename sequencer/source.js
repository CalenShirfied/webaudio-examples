// create audio context
const audioCtx = new AudioContext();

const wave = audioCtx.createPeriodicWave(wavetable.real, wavetable.imag);

// the sweep oscillator
function playSweep(time) {
  const osc = audioCtx.createOscillator();
  osc.setPeriodicWave(wave);
  osc.frequency.value = 440;
  osc.connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + 1);
}

// envelope input listeners
let attackTime = 0.5;
const attackControl = document.querySelector("#attack");
attackControl.addEventListener(
  "input",
  (ev) => {
    attackTime = Number(ev.target.value);
  },
  false
);

let releaseTime = 0.5;
const releaseControl = document.querySelector("#release");
releaseControl.addEventListener(
  "input",
  (ev) => {
    releaseTime = Number(ev.target.value);
  },
  false
);

// playsweep function
const sweepLength = 2;
function playSweep(time) {
  const osc = audioCtx.createOscillator();
  osc.setPeriodicWave(wave);
  osc.frequency = 440;

  // gain node
  const sweepEnv = audioCtx.createGain();
  sweepEnv.gain.cancelScheduledValues(time);
  sweepEnv.gain.setValueAtTime(0, time);
  // set attack
  sweepEnv.gain.linearRampToValueAtTime(1, time + attackTime);
  // set release
  sweepEnv.gain.linearRampToValueAtTime(0, time + sweepLength - releaseTime);

  osc.connect(sweepEnv).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + sweepLength);
}

//sine oscillator
const osc = audioCtx.createOscillator();
osc.type = "sine";
osc.frequency.value = 880;

// gain node
const amp = audioCtx.createGain();
amp.gain.setValueAtTime(1, audioCtx.currentTime);

// low frequency osc
const lfo = audioCtx.createOscillator();
lfo.type = "square";
lfo.frequency.value = 30;

// connect the graph start both oscillators
lfo.connect(amp.gain);
osc.connect(amp).connect(audioCtx.destination);
lfo.start();
osc.start(time);
osc.stop(time + pulseTime);
