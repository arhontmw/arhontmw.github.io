export class Player {
    #button;
    #playing;
    #ctx;
    #playSoundMethod;
    #buttonIcon;

    constructor(ctx) {
        this.#ctx = ctx;
        this.#playing = false;

        this.#button = document.querySelector('.play-button');
        this.#buttonIcon = document.querySelector('.play-pause-icon');
        this.setPlaySoundMethod();
    }

    togglePlay() {
        this.togglePlayingStatus();
        this.#buttonIcon.classList.toggle('play-pause-icon_play');
        this.#buttonIcon.classList.toggle('play-pause-icon_stop');
    }

    togglePlayingStatus() {
        this.#playing = !this.#playing;
    }

    isPlaying() {
        return this.#playing;
    }

    listen(cb) {
        this.#button.addEventListener('click' , cb);
    }

    setPlaySoundMethod(method) {
        switch (method) {
            default:
                this.#playSoundMethod = this.#playOscillator;
                return;
        }
    }

    playSound({ beatNumber, time, measure }) {
        this.#animatePlayButton();
        this.#playSoundMethod({ beatNumber, time, measure });
    }

    #playOscillator({ beatNumber, time, measure }) {
        const osc = this.#ctx.createOscillator();
        const envelope = this.#ctx.createGain();

        osc.frequency.value = (beatNumber % measure === 0) ? 1200 : 800;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

        osc.connect(envelope);
        envelope.connect(this.#ctx.destination);

        osc.start(time);
        osc.stop(time + 0.03);
    }

    #animatePlayButton() {
        this.#button.className = 'play-button';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.#button.classList.add('play-active');
            });
        });
    }
}
