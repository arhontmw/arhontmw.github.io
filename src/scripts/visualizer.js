export class Visualizer {
    #barsContainer;
    #barsCount;
    #barIdx;
    #bars;
    #barActivationMethod;
    #beatExtraAnimator;

    constructor() {
        this.#barsContainer = document.querySelector('.bars-container');
        this.#beatExtraAnimator = document.querySelector('.beat-extra-animator')
        this.#bars = [];
        this.#barIdx = 0;
        this.setBarActivationMethod();
    }

    resetIdx() {
        this.#barIdx = 0;
    }

    setOptions(options) {
        const { measure } = options;

        this.setBars(measure);
    }

    setBars(barsCount) {
        this.#barsContainer.innerHTML = '';
        this.#bars = new Array(barsCount);

        this.resetIdx();

        this.#barsCount = barsCount;

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

    setBarActivationMethod(method) {
        switch (method) {
            default:
                this.#barActivationMethod = this.#barPulse;
                return;
        }
    }

    activate({ beatNumber, time, measure }) {
        this.#barActivationMethod({ beatNumber, time, measure });
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

    isBarMuted({ beatNumber: idx }) {
        return this.#bars[idx].classList.contains('bar-muted');
    }

    #barPulse({ beatNumber: idx, time, measure }) {
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
