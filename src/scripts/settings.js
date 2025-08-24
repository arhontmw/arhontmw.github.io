import { Storage } from './utils.js';
import {
    PITCH,
    BOTTOMSHEET_TYPE,
    MAX_TEMPO,
    MIN_TEMPO
} from './constants.js';

const DEFAULT_TEMPO = 120;
const DEFAULT_BEATS = [
    { idx: 0, pitch: PITCH.ACCENT },
    { idx: 1, pitch: PITCH.ORDINARY },
    { idx: 2, pitch: PITCH.ORDINARY },
    { idx: 3, pitch: PITCH.ORDINARY }
];
const DEFAULT_NOTE_VALUE = 4;
const DEFAULT_EXTRA = {
    theme: 'sunset',
    sound: 'snap'
};

export const SETTINGS_KEY = 'metronome-settings';

export class Settings {
    #dom;
    #settingsBpmDom;
    #settingsTsDom;
    #settingsExtraDom;
    #metronome;
    #visr;
    #tempo;
    #beats;
    #noteValue;
    #player;
    #extra;

    constructor(dom, settingsBpmDom, settingsTsDom, settingsExtraDom, metronome, visr, player, savedSettings) {
        this.#dom = dom;
        this.#settingsBpmDom = settingsBpmDom;
        this.#settingsTsDom = settingsTsDom;
        this.#settingsExtraDom = settingsExtraDom;

        this.#metronome = metronome;
        this.#visr = visr;
        this.#player = player;

        const {
            tempo,
            beats,
            noteValue,
            extra
        } = savedSettings;

        this.#tempo = tempo || DEFAULT_TEMPO;
        this.#beats = beats || DEFAULT_BEATS;
        this.#noteValue = noteValue || DEFAULT_NOTE_VALUE;

        this.#extra = extra || DEFAULT_EXTRA;
    }

    init() {
        const settings = this.#getSettings();

        this.#metronome.init(settings);
        this.#visr.init(settings, this.#onOptionsChangeCb)

        this.#dom.setBpm(this.#tempo);
        this.#dom.setTimeSignature(this.#beats.length, this.#noteValue);
        this.#listen();
    }

    #onOptionsChangeCb = ({ beat }) => {
        if (beat) {
            const { idx, pitch } = beat;

            this.#beats[idx].pitch = pitch;
            this.#updateSettings({ isTsChanged: true });
        }
    };

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

            this.#updateSettings({ isBpmChanged: true });
        });

        this.#dom.onBpmButtonClick(() => {
            this.#settingsBpmDom.set(this.#tempo);
            this.#dom.openBottomSheet(BOTTOMSHEET_TYPE.BPM_SETTINS);
        });

        this.#dom.onTimeSignatureButtonClick(() => {
            this.#settingsTsDom.set(this.#beats.length, this.#noteValue);
            this.#dom.openBottomSheet(BOTTOMSHEET_TYPE.TIME_SIGNATURE_SETTINGS);
        });

        this.#dom.onExtraButtonClick(() => {
            this.#settingsExtraDom.set(this.#extra);
            this.#dom.openBottomSheet(BOTTOMSHEET_TYPE.EXTRA_SETTINGS);
        });

        this.#dom.onResetButtonClick(() => {
            this.#tempo = DEFAULT_TEMPO;
            this.#updateSettings({ isBpmChanged: true });
        });

        this.#settingsBpmDom.listen((newBpm) => {
            this.#tempo = newBpm;
            this.#updateSettings({ isBpmChanged: true });
        });

        this.#settingsTsDom.listen(({ newBeatsCount, newNoteValue }) => {
            if (newBeatsCount) {
                this.#changeBeats(newBeatsCount)
            }

            if (newNoteValue) {
                this.#noteValue = newNoteValue;
            }

            this.#updateSettings({ isTsChanged: true });
        });
    }

    #changeBeats(newBeatsCount) {
        const beatsCount = this.#beats.length;

        if (newBeatsCount < beatsCount) {
            this.#beats.length = newBeatsCount;
        } else {
            const diffBeatsCount = newBeatsCount - beatsCount;

            for (let i = 0; i < diffBeatsCount; i++) {
                this.#beats.push({ idx: beatsCount + i, pitch: PITCH.ORDINARY });
            }
        }

        this.#visr.setBarsFromBeats(this.#beats);
    }

    #updateSettings({ isBpmChanged, isTsChanged }) {
        if (isBpmChanged) {
            this.#dom.setBpm(this.#tempo);
            this.#dom.animateTempoChange();
        } else if (isTsChanged) {
            this.#dom.setTimeSignature(this.#beats.length, this.#noteValue);
        }

        this.#saveSettings();
        this.#metronome.setTempo(this.#tempo, this.#player.isPlaying());
        this.#metronome.setBeats(this.#beats, this.#player.isPlaying());
        this.#metronome.setNoteValue(this.#noteValue);
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
            extra: this.#extra
        };
    }

    #saveSettings() {
        Storage.save(SETTINGS_KEY, this.#getSettings());
    }
}
