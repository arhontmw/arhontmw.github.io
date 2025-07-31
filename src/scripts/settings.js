import { Storage } from './utils.js';

const DEFAULT_TEMPO = 120;
const DEFAULT_BEATS = 4;
const DEFAULT_NOTE_VALUE = 4;
const SECONDS_IN_MINUTE = 60;
const LOOKAHEAD = 25; // ms
const SCHEDULE_AHEAD_TIME = 0.1; // sec

export const SETTINGS_KEY = 'metronome-settings';

export class Settings {
    #dom;
    #metronome;
    #visr;
    #tempo;
    #beats;
    #noteValue;
    #player;

    constructor(dom, metronome, visr, player, savedSettings) {
        this.#dom = dom;

        this.#metronome = metronome;
        this.#visr = visr;
        this.#player = player;

        const {
            tempo,
            beats,
            noteValue,
        } = savedSettings;

        this.#tempo = tempo || DEFAULT_TEMPO;
        this.#beats = beats || DEFAULT_BEATS;
        this.#noteValue = noteValue || DEFAULT_NOTE_VALUE;
    }

    init() {
        const settings = this.#getSettings();

        this.#metronome.setOptions(settings);
        this.#visr.setOptions(settings)

        this.#setBpm(this.#tempo);
        this.#setTimeSignature(this.#beats);
        this.#listen();
    }

    #setBpm(tempo) {
        this.#dom.setBpm(tempo);
    }

    #setTimeSignature(beats) {
        this.#dom.setTimeSignature(beats);
    }

    #listen() {
        this.#dom.listenTempoButtonClick(({ delta }) => {
            this.#tempo += delta;
            this.#updateSettings();
        });

        // this.#settingsBpmInput.addEventListener('input', (e) => {
        //     console.log(e.target.value);
        // });

        this.#dom.listenResetButtonClick(() => {
            this.#tempo = DEFAULT_TEMPO;
            this.#updateSettings();
        });
    }

    #updateSettings() {
        this.#setBpm(this.#tempo);
        this.#dom.animateTempoChange();
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
            beats: this.#beats,
            noteValue: this.#noteValue,
            secondsInMinute: SECONDS_IN_MINUTE,
            lookahead: LOOKAHEAD,
            scheduleAheadTime: SCHEDULE_AHEAD_TIME
        };
    }

    #saveSettings() {
        Storage.save(SETTINGS_KEY, this.#getSettings());
    }
}
