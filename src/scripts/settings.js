import { Storage } from './utils.js';
import { PITCH, MAX_TEMPO, MIN_TEMPO } from './constants.js';

const DEFAULT_TEMPO = 120;
const DEFAULT_BEATS = [
    { idx: 0, pitch: PITCH.ACCENT },
    { idx: 1, pitch: PITCH.ORDINARY },
    { idx: 2, pitch: PITCH.ORDINARY },
    { idx: 3, pitch: PITCH.ORDINARY }
];
const DEFAULT_NOTE_VALUE = 4;

export const SETTINGS_KEY = 'metronome-settings';

export class Settings {
    #dom;
    #settingsBpmDom;
    #metronome;
    #visr;
    #tempo;
    #beats;
    #noteValue;
    #player;

    constructor(dom, settingsBpmDom, metronome, visr, player, savedSettings) {
        this.#dom = dom;
        this.#settingsBpmDom = settingsBpmDom;

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

        this.#metronome.init(settings);
        this.#visr.init(settings, this.#onOptionsChangeCb)

        this.#setBpm(this.#tempo);
        this.#setTimeSignature(this.#beats.length);
        this.#listen();
    }

    #onOptionsChangeCb = ({ beat }) => {
        if (beat) {
            const { idx, pitch } = beat;

            this.#beats[idx].pitch = pitch;
        }
    };

    #setBpm(tempo) {
        this.#dom.setBpm(tempo);
    }

    #setTimeSignature(beatsCount) {
        this.#dom.setTimeSignature(beatsCount);
    }

    #listen() {
        this.#dom.onTempoButtonClick(({ delta }) => {
            const newTempo = this.#tempo + delta;

            if (newTempo < MIN_TEMPO) {
                this.#tempo = MIN_TEMPO;
            } else if (newTempo > MAX_TEMPO) {
                this.#tempo = MAX_TEMPO;
            } else {
                this.#tempo = newTempo;
            }

            this.#updateSettings();
        });

        this.#dom.onBpmButtonClick(() => {
            this.#settingsBpmDom.setSettingsBpm(this.#tempo);
            this.#dom.openBottomSheet();
        });

        this.#dom.onResetButtonClick(() => {
            this.#tempo = DEFAULT_TEMPO;
            this.#updateSettings();
        });

        this.#settingsBpmDom.listen((newBpm) => {
            // if
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
        };
    }

    #saveSettings() {
        Storage.save(SETTINGS_KEY, this.#getSettings());
    }
}
