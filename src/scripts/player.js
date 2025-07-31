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

    listen(cb) {
        this.#dom.listen(cb);
    }

    setPlaySoundMethod(method) {
        switch (method) {
            default:
                this.#playSoundMethod = this.#playOscillator;
                return;
        }
    }

    playSound({ beatNumber, time, beats }) {
        this.#dom.animatePlayButton();
        this.#playSoundMethod({ beatNumber, time, beats });
    }

    #playOscillator({ beatNumber, time, beats }) {
        const osc = this.#ctx.createOscillator();
        const envelope = this.#ctx.createGain();

        osc.frequency.value = (beatNumber % beats === 0) ? 1200 : 800;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

        osc.connect(envelope);
        envelope.connect(this.#ctx.destination);

        osc.start(time);
        osc.stop(time + 0.03);
    }
}
