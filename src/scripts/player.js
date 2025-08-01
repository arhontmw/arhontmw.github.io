import { PITCH } from './constants.js';

export class Player {
    #dom;
    #playing;
    #ctx;
    #playSoundMethod;

    constructor(dom, ctx) {
        this.#dom = dom;
        this.#ctx = ctx;
        this.#playing = false;

        this.setPlaySoundMethod();
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
            default:
                this.#playSoundMethod = this.#playOscillator;
                return;
        }
    }

    playSound({ time, pitch }) {
        this.#dom.animatePlayButton();
        this.#playSoundMethod({ time, pitch });
    }

    #playOscillator({ time, pitch }) {
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
}
