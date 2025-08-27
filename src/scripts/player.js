import { PITCH, SOUNDS } from './constants.js';

export class Player {
    #dom;
    #playing;
    #ctx;
    #playSoundMethod;
    #drumsVolume = 0.8;

    constructor(dom, ctx) {
        this.#dom = dom;
        this.#ctx = ctx;
        this.#playing = false;
    }

    togglePlay() {
        this.togglePlayingStatus();
        this.#dom.togglePlay();
    }

    togglePlayingStatus() {
        this.#playing = !this.#playing;
    }

    isPlaying() {
        return this.#playing;
    }

    onClick(cb) {
        this.#dom.onClick(cb);
    }

    setPlaySoundMethod(method) {
        switch (method) {
            case SOUNDS.DRUMS:
                this.#playSoundMethod = this.#playDrums;
                return;

            case SOUNDS.SNAP:
                this.#playSoundMethod = this.#playSnap;
                return;
        }
    }

    playSound({ time, pitch }) {
        this.#dom.animatePlayButton();
        this.#playSoundMethod({ time, pitch });
    }

    #playSnap({ time, pitch }) {
        if (pitch === PITCH.MUTED) {
            return;
        }

        const osc = this.#ctx.createOscillator();
        const envelope = this.#ctx.createGain();

        osc.frequency.value = pitch === PITCH.ACCENT ? 1200 : 800;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

        osc.connect(envelope);
        envelope.connect(this.#ctx.destination);

        osc.start(time);
        osc.stop(time + 0.03);
    }

    #playDrums({ time, pitch }) {
        if (pitch === PITCH.MUTED) {
            return;
        }

        if (pitch === PITCH.ACCENT) {
            this.#playKickDrum(time);
        } else {
            this.#playSnareDrum(time);
        }
    }

    #playKickDrum(time) {
        const osc = this.#ctx.createOscillator();
        const gain = this.#ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

        gain.gain.setValueAtTime(this.#drumsVolume, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

        osc.connect(gain);
        gain.connect(this.#ctx.destination);

        osc.start(time);
        osc.stop(time + 0.5);
    }

    #playSnareDrum(time) {
        const noiseDuration = 0.15;
        const noiseBufferSize = this.#ctx.sampleRate * noiseDuration;
        const noiseBuffer = this.#ctx.createBuffer(1, noiseBufferSize, this.#ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);

        for (let i = 0; i < noiseBufferSize; i++) {
            noiseData[i] = Math.random() * 2 - 1;
        }

        const noise = this.#ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const highPassFilter = this.#ctx.createBiquadFilter();
        highPassFilter.type = 'highpass';
        highPassFilter.frequency.value = 800;

        const peakFilter = this.#ctx.createBiquadFilter();
        peakFilter.type = 'peaking';
        peakFilter.frequency.value = 1200;
        peakFilter.Q.value = 1.0;
        peakFilter.gain.value = 6.0;

        const noiseGain = this.#ctx.createGain();
        noiseGain.gain.setValueAtTime(0, time);
        noiseGain.gain.linearRampToValueAtTime(this.#drumsVolume * 0.9, time + 0.002);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        const attackOsc = this.#ctx.createOscillator();
        attackOsc.type = 'triangle';
        attackOsc.frequency.setValueAtTime(350, time);
        attackOsc.frequency.exponentialRampToValueAtTime(100, time + 0.03);

        const attackGain = this.#ctx.createGain();
        attackGain.gain.setValueAtTime(this.#drumsVolume * 0.4, time);
        attackGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

        noise.connect(highPassFilter);
        highPassFilter.connect(peakFilter);
        peakFilter.connect(noiseGain);
        noiseGain.connect(this.#ctx.destination);

        attackOsc.connect(attackGain);
        attackGain.connect(this.#ctx.destination);

        noise.start(time);
        noise.stop(time + noiseDuration);
        attackOsc.start(time);
        attackOsc.stop(time + 0.05);
    }
}
