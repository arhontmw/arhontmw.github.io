export class PlayerDom {
    #playButton;
    #playButtonIcon;

    constructor() {
        this.#playButton = document.querySelector('.play-button');
        this.#playButtonIcon = document.querySelector('.play-pause-icon');
    }

    togglePlay() {
        this.#playButtonIcon.classList.toggle('play-pause-icon_play');
        this.#playButtonIcon.classList.toggle('play-pause-icon_stop');
    }

    listen(cb) {
        this.#playButton.addEventListener('click' , cb);
    }

    animatePlayButton() {
        this.#playButton.className = 'play-button';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.#playButton.classList.add('play-active');
            });
        });
    }
}

export class SettingsDom {
    #bpm;
    #timeSignature;
    #resetButton;
    #settingsBpmInput;
    #tempoButtons;

    constructor() {
        this.#bpm = document.querySelector('.bpm');
        this.#timeSignature = document.querySelector('.time-signature');
        this.#resetButton = document.querySelector('.reset-button');
        this.#settingsBpmInput = document.querySelector('.settings-bpm-input');
        this.#tempoButtons = document.querySelectorAll('.tempo-button');
    }

    setBpm(tempo) {
        this.#bpm.innerText = tempo;
        this.#settingsBpmInput.value = tempo;
    }

    setTimeSignature(beats) {
        this.#timeSignature.innerText = `${beats} / 4`;
    }

    listenTempoButtonClick = (cb) => {
        this.#tempoButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const delta = Number(event.target.dataset.delta || 0);

                cb({ delta });
            });
        });
    }

    listenResetButtonClick = (cb) => {
        this.#resetButton.addEventListener('click', () => {
            cb();
        });
    };

    animateTempoChange() {
        this.#bpm.className = 'bpm';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.#bpm.classList.add('bpm-changed');
            });
        });
    }
}

export class VisualizerDom {
    #barsContainer;
    #beatExtraAnimator;
    #bars;

    constructor() {
        this.#barsContainer = document.querySelector('.bars-container');
        this.#beatExtraAnimator = document.querySelector('.beat-extra-animator');
        this.#bars = [];
    }

    clearBars() {
        this.#barsContainer.innerHTML = '';
    }

    setBars(barsCount) {
        this.clearBars();

        this.#bars = new Array(barsCount);

        for (let i = 0; i < barsCount; i++)  {
            const div = document.createElement('div');

            div.className = 'bar';

            div.addEventListener('click', (event) => {
                event.target.classList.toggle('bar-muted');
            });

            this.#barsContainer.appendChild(div);
            this.#bars[i] = div;
        }
    }

    toggleBeatExtraAnimator({ shouldPause, duration }) {
        if (shouldPause) {
            this.#beatExtraAnimator.style.animationPlayState = 'paused';
        } else {
            this.#beatExtraAnimator.style.animationDuration = `${duration}s`;
            this.#beatExtraAnimator.style.animationPlayState = 'running';
            this.#beatExtraAnimator.className = 'beat-extra-animator';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.#beatExtraAnimator.classList.add('beat-extra-animator_active');
                });
            });
        }
    }

    isBarMuted(idx) {
        return this.#bars[idx].classList.contains('bar-muted');
    }

    barPulse = ({ beatNumber: idx, time, beats }) => {
        this.#bars.forEach((bar) => {
            bar.classList.remove('bar-active')
        });

        const currentBar = this.#bars[idx];

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                currentBar.classList.add('bar-active');
            });
        });
    }
}

