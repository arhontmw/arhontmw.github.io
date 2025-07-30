import { Storage } from './utils.js';

const DEFAULT_TEMPO = 120;
const DEFAULT_MEASURE = 4;
const DEFAULT_NOTE_VALUE = 4;
const SECONDS_IN_MINUTE = 60;
const LOOKAHEAD = 25; // ms
const SCHEDULE_AHEAD_TIME = 0.1; // sec

export const SETTINGS_KEY = 'metronome-settings';

export class Settings {
    #metronome;
    #visr;
    #tempo;
    #measure;
    #noteValue;
    #tempoButtons;
    #bpm;
    #measureContainer;
    #player;
    #resetButton;
    #settingsBpmValue;
    #settingsBpmInput;

    constructor(metronome, visr, player, savedSettings) {
        this.#metronome = metronome;
        this.#visr = visr;
        this.#player = player;

        const {
            tempo,
            measure,
            noteValue,
        } = savedSettings;

        this.#tempo = tempo || DEFAULT_TEMPO;
        this.#measure = measure || DEFAULT_MEASURE;
        this.#noteValue = noteValue || DEFAULT_NOTE_VALUE;

        this.#bpm = document.querySelector('.bpm');
        this.#measureContainer = document.querySelector('.measure');
        this.#resetButton = document.querySelector('.reset-button');
        this.#settingsBpmInput = document.querySelector('.settings-bpm-input');
    }

    init() {
        const settings = this.#getSettings();

        this.#metronome.setOptions(settings);
        this.#visr.setOptions(settings)

        this.#setBpm(this.#tempo);
        this.#setMeasure(this.#measure);
        this.addListeners();
    }

    #setBpm(tempo) {
        this.#bpm.innerText = tempo;
        this.#settingsBpmInput.value = tempo;
    }

    #setMeasure(measure) {
        this.#measureContainer.innerText = `${measure} / 4`;
    }

    addListeners() {
        this.#tempoButtons = document.querySelectorAll('.tempo-button');
        this.#tempoButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const delta = Number(event.target.dataset.delta || 0);

                this.#tempo += delta;
                this.#updateSettings();
            });
        });

        // this.#settingsBpmInput.addEventListener('input', (e) => {
        //     console.log(e.target.value);
        // });

        this.#resetButton.addEventListener('click', () => {
            this.#tempo = DEFAULT_TEMPO;
            this.#updateSettings();
        });
    }

    #updateSettings() {
        this.#setBpm(this.#tempo);
        this.#animateTempoChange();
        this.#saveSettings();
        this.#metronome.setTempo(this.#tempo, this.#player.isPlaying());
        this.#visr.toggleBeatExtraAnimator({
            shouldPause: !this.#player.isPlaying(),
            duration: this.#metronome.getSecondsPerBeat()
        });
    }

    #getSettings() {
        return {
            tempo: this.#tempo,
            measure: this.#measure,
            noteValue: this.#noteValue,
            secondsInMinute: SECONDS_IN_MINUTE,
            lookahead: LOOKAHEAD,
            scheduleAheadTime: SCHEDULE_AHEAD_TIME
        };
    }

    #animateTempoChange() {
        this.#bpm.className = 'bpm';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.#bpm.classList.add('bpm-changed');
            });
        });
    }

    #saveSettings() {
        Storage.save(SETTINGS_KEY, this.#getSettings());
    }
}
