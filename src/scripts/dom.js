import {
    BOTTOMSHEET_VISIBILITY_EVENT,
    MAX_TEMPO,
    MIN_TEMPO
} from './constants.js';

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
    #extra;
    #resetButton;
    #settingsBpmInput;
    #tempoButtons;

    constructor() {
        this.#bpm = document.querySelector('.bpm');
        this.#timeSignature = document.querySelector('.time-signature');
        this.#extra = document.querySelector('.extra-button');
        this.#resetButton = document.querySelector('.reset-button');
        this.#settingsBpmInput = document.querySelector('.settings-bpm-input');
        this.#tempoButtons = document.querySelectorAll('.tempo-button');
    }

    setBpm(tempo) {
        this.#bpm.innerText = tempo;
        this.#settingsBpmInput.value = tempo;
    }

    setTimeSignature(beatsCount, noteValue) {
        this.#timeSignature.innerText = `${beatsCount} / ${noteValue}`;
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

    onTimeSignatureButtonClick = (cb) => {
        this.#timeSignature.addEventListener('click', cb);
    };

    onExtraButtonClick = (cb) => {
        this.#extra.addEventListener('click', cb);
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

    openBottomSheet(type) {
        dispatchOpenBottomSheet(type);
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
    #bpmValue = null;

    constructor() {
        this.#bpmInput = document.querySelector('.settings-bpm-input');
        this.#saveButton = document.querySelector('.bpm-controls > .bottomsheet-control-save-button');
        this.#cancelButton = document.querySelector('.bpm-controls > .bottomsheet-control-close-button');
    }

    set(bpm) {
        const isBpmValid = validateBpm(bpm);

        if (isBpmValid) {
            this.#bpmInput.value = bpm;
            return;
        }

        this.#updateControls({ isBpmValid });
    }

    listen(onBpmChange) {
        this.#bpmInput.addEventListener('input', (event) => {
            const { value } = event.target;

            const bpm = parseInt(value);

            if (!validateBpm(bpm)) {
                this.#updateControls({ isBpmValid: false });
                return;
            }

            this.#updateControls({ isBpmValid: true });
            this.#bpmValue = bpm;
        });

        this.#saveButton.addEventListener('click', () => {
            if (this.#bpmValue) {
                onBpmChange(this.#bpmValue);
                this.#bpmValue = null;
                dispatchCloseBottomSheet();
            }
        });

        this.#cancelButton.addEventListener('click', () => {
            dispatchCloseBottomSheet();
            this.#bpmValue = null;
        });
    }

    #updateControls({ isBpmValid }) {
        this.#saveButton.disabled = !isBpmValid;

        if (isBpmValid) {
            this.#saveButton.classList.remove('bottomsheet-control-button_disabled')
        } else {
            this.#saveButton.classList.add('bottomsheet-control-button_disabled')
        }
    }
}

export class SettingsTsDom {
    #beatsUpButton;
    #beatsDownButton;
    #notevalueUpButton;
    #notevalueDownButton;
    #outputWindowBeats;
    #outputWindowNoteValue;
    #beatsCount = null;
    #noteValue = null;


    constructor() {
        this.#beatsUpButton = document.querySelector('.beats-up');
        this.#beatsDownButton = document.querySelector('.beats-down');
        this.#notevalueUpButton = document.querySelector('.notevalue-up');
        this.#notevalueDownButton = document.querySelector('.notevalue-down');
        this.#outputWindowBeats = document.querySelector('.settings-output-window-beats');
        this.#outputWindowNoteValue = document.querySelector('.settings-output-window-notevalue');
    }

    set(beatsCount, noteValue) {
        this.#beatsCount = beatsCount;
        this.#noteValue = noteValue;
        this.#outputWindowBeats.textContent = beatsCount;
        this.#outputWindowNoteValue.textContent = noteValue;

        this.#updateControlsVisibility();
    }

    listen(onTsChange) {
        this.#beatsUpButton.addEventListener('click', () => {
            this.#updateBeatsCount(this.#beatsCount + 1, onTsChange);
        });

        this.#beatsDownButton.addEventListener('click', () => {
            this.#updateBeatsCount(this.#beatsCount - 1, onTsChange);
        });

        this.#notevalueUpButton.addEventListener('click', () => {
            this.#updateNoteValue(this.#noteValue * 2, onTsChange);
        });

        this.#notevalueDownButton.addEventListener('click', () => {
            this.#updateNoteValue(Math.floor(this.#noteValue / 2), onTsChange);
        });
    }

    #updateBeatsCount(newBeatsCount, onTsChange) {
        if (validateBeatsCount(newBeatsCount)) {
            this.#beatsCount = newBeatsCount;
            this.#outputWindowBeats.innerText = newBeatsCount;
            onTsChange({ newBeatsCount });
            this.#updateControlsVisibility();
        }
    }

    #updateNoteValue(newNoteValue, onTsChange) {
        if (validateNoteValue(newNoteValue)) {
            this.#noteValue = newNoteValue;
            this.#outputWindowNoteValue.innerText = newNoteValue;
            onTsChange({ newNoteValue });
            this.#updateControlsVisibility();
        }
    }

    #updateControlsVisibility() {
        if (validateBeatsCountIsMax(this.#beatsCount)) {
            this.#beatsUpButton.classList.add('button-hidden')
        } else if (validateBeatsCountIsMin(this.#beatsCount)) {
            this.#beatsDownButton.classList.add('button-hidden');
        } else {
            this.#beatsUpButton.classList.remove('button-hidden');
            this.#beatsDownButton.classList.remove('button-hidden');
        }

        if (validateNoteValueIsMax(this.#noteValue)) {
            this.#notevalueUpButton.classList.add('button-hidden');
        } else if (validateNoteValueIsMin(this.#noteValue)) {
            this.#notevalueDownButton.classList.add('button-hidden');
        } else {
            this.#notevalueUpButton.classList.remove('button-hidden');
            this.#notevalueDownButton.classList.remove('button-hidden');
        }
    }
}

export class SettingsExtraDom {
    #theme = null;
    #sound = null;

    constructor() {
    }

    set({ theme, sound }) {
        this.#theme = theme;
        this.#sound = sound;
    }
}

const MAX_BEATS_COUNT = 16;
const MIN_BEATS_COUNT = 1;
const validateBeatsCountIsMax = (beats) => beats === MAX_BEATS_COUNT;
const validateBeatsCountIsMin = (beats) => beats === MIN_BEATS_COUNT;
const validateBeatsCount = (beats) => beats >= MIN_BEATS_COUNT && beats <= MAX_BEATS_COUNT;

const MAX_NOTE_VALUE = 32;
const MIN_NOTE_VALUE = 1;
const NOTE_VALUES = [MIN_NOTE_VALUE, 2, 4, 8, 16, MAX_NOTE_VALUE];
const validateNoteValueIsMax = (noteValue) => noteValue === MAX_NOTE_VALUE;
const validateNoteValueIsMin = (noteValue) => noteValue === MIN_NOTE_VALUE;
const validateNoteValue = (noteValue) => NOTE_VALUES.includes(noteValue);

const validateBpm = (bpm) => {
    if (Number.isNaN(bpm)) {
        return false;
    }

    return bpm >= MIN_TEMPO && bpm <= MAX_TEMPO;
};


const dispatchOpenBottomSheet = (type) => {
    dispatchEvent(BOTTOMSHEET_VISIBILITY_EVENT, { status: 'open', type });
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
