import { BOTTOMSHEET_VISIBILITY_EVENT, MAX_TEMPO, MIN_TEMPO } from './constants.js';

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

    onClick(cb) {
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

    setTimeSignature(beatsCount) {
        this.#timeSignature.innerText = `${beatsCount} / 4`;
    }

    onTempoButtonClick = (cb) => {
        this.#tempoButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const delta = Number(event.target.dataset.delta || 0);

                cb({ delta });
            });
        });
    };

    onBpmButtonClick = (cb) => {
        this.#bpm.addEventListener('click', cb);
    };

    onResetButtonClick = (cb) => {
        this.#resetButton.addEventListener('click', cb);
    };

    animateTempoChange() {
        this.#bpm.className = 'bpm';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.#bpm.classList.add('bpm-changed');
            });
        });
    }

    openBottomSheet() {
        dispatchOpenBottomSheet();
    }
}

export class BpmVisualizerDom {
    #barsContainer;
    #beatExtraAnimator;
    #barDivs;

    constructor() {
        this.#barsContainer = document.querySelector('.bars-container');
        this.#beatExtraAnimator = document.querySelector('.beat-extra-animator');
        this.#barDivs = [];
    }

    #clearBars() {
        this.#barsContainer.innerHTML = '';
    }

    setBars(bars, getNextPitchOnClickCb) {
        this.#clearBars();

        this.#barDivs = [];

        for (const bar of bars)  {
            const barDiv = document.createElement('div');
            barDiv.className = 'bar';
            this.#barsContainer.appendChild(barDiv);

            this.#barDivs.push(barDiv);
            this.#modifyPitchBarsInBar(barDiv, bar.pitchBarsCount);

            barDiv.addEventListener('click', () => {
                const newPitchBarsCount = getNextPitchOnClickCb(bar);
                this.#modifyPitchBarsInBar(barDiv, newPitchBarsCount);
            });
        }
    }

    #modifyPitchBarsInBar(barElement, pitchBarsCount) {
        barElement.innerHTML = '';

        for (let i = 0; i < pitchBarsCount; i++) {
            const pitchBarDiv = document.createElement('div');
            pitchBarDiv.className = 'pitch-bar';

            barElement.appendChild(pitchBarDiv);
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

    barPulse = ({ beatNumber: idx }) => {
        this.#barDivs.forEach((bar) => {
            bar.classList.remove('bar-active');

            [...bar.children].forEach((pitchBar) => {
                pitchBar.classList.remove('pitch-bar-active');
            });
        });

        const currentBar = this.#barDivs[idx];

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                currentBar.classList.add('bar-active');

                [...currentBar.children].forEach((pitchBar) => {
                    pitchBar.classList.add('pitch-bar-active');
                });
            });
        });
    }
}

export class SettingsBpmDom {
    #bpmInput;
    #saveButton;
    #cancelButton;
    #isBpmInputValid = true;

    constructor() {
        this.#bpmInput = document.querySelector('.settings-bpm-input');
        this.#saveButton = document.querySelector('.bottomsheet-control-save-button');
        this.#cancelButton = document.querySelector('.bottomsheet-control-close-button');
    }

    setSettingsBpm(bpm) {
        this.#bpmInput.value = bpm;
    }

    listen(onBpmChange) {
        this.#bpmInput.addEventListener('input', (event) => {
            const { value } = event.target;

            if (!validateBpm(value)) {
                this.#updateBpmControls({ isValid: false });
                return;
            }

            this.#updateBpmControls({ isValid: true });
        });

        this.#saveButton.addEventListener('click', () => {
            console.log('### SAVE');
        });

        this.#cancelButton.addEventListener('click', dispatchCloseBottomSheet);
    }

    #updateBpmControls({ isValid }) {
        this.#isBpmInputValid = isValid;
        this.#saveButton.disabled = !isValid;

        if (isValid) {
            this.#saveButton.classList.remove('bottomsheet-control-button_disabled')
        } else {
            this.#saveButton.classList.add('bottomsheet-control-button_disabled')
        }
    }
}

const dispatchOpenBottomSheet = () => {
    dispatchEvent(BOTTOMSHEET_VISIBILITY_EVENT, { status: 'open' });
};

const dispatchCloseBottomSheet = () => {
    dispatchEvent(BOTTOMSHEET_VISIBILITY_EVENT, { status: 'close' });
};

const dispatchEvent = (eventName, detail) => {
    const event = new CustomEvent(eventName, {
        detail,
        bubbles: true,
        cancelable: true
    });

    document.dispatchEvent(event);
};

function validateBpm(value) {
    const bpm = parseInt(value);

    if (Number.isNaN(bpm)) {
        return false;
    }

    return bpm >= MIN_TEMPO && bpm <= MAX_TEMPO;
}
