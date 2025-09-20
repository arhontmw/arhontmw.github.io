import {
    PITCH_VALUES,
    THEME_VALUES,
    SOUND_VALUES,
    DEFAULT_SETTINGS,
    MIN_BEATS_COUNT,
    MAX_BEATS_COUNT,
    MIN_NOTE_VALUE,
    MAX_NOTE_VALUE,
    MIN_TEMPO,
    MAX_TEMPO,
    SETTINGS_KEY
} from './constants.js';

class Storage {
    static save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('failed to save in localStorage', error);
        }
    }

    static read(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (error) {
            console.error('failed to read value from localStorage', key, error);
        }

        return null;
    }
}

export const validateBeatsCountIsMax = (beats) => beats === MAX_BEATS_COUNT;
export const validateBeatsCountIsMin = (beats) => beats === MIN_BEATS_COUNT;
export const validateBeatsCount = (beats) => beats >= MIN_BEATS_COUNT && beats <= MAX_BEATS_COUNT;

export const NOTE_VALUES = [MIN_NOTE_VALUE, 2, 4, 8, 16, MAX_NOTE_VALUE];
export const validateNoteValueIsMax = (noteValue) => noteValue === MAX_NOTE_VALUE;
export const validateNoteValueIsMin = (noteValue) => noteValue === MIN_NOTE_VALUE;
export const validateNoteValue = (noteValue) => NOTE_VALUES.includes(noteValue);

export const validateBpm = (bpm) => {
    if (Number.isNaN(bpm) || typeof bpm !== 'number') {
        return false;
    }

    return bpm >= MIN_TEMPO && bpm <= MAX_TEMPO;
};

const validateBeats = (beats) => {
    if (beats.length < MIN_BEATS_COUNT || beats.length > MAX_BEATS_COUNT) {
        return false;
    }

    if (beats[0].idx !== 0 || !PITCH_VALUES.includes(beats[0].pitch)) {
        return false;
    }

    for (let i = 1; i < beats.length; i++) {
        if (beats[i].idx - beats[i-1].idx !== 1) {
            return false;
        }

        if (!PITCH_VALUES.includes(beats[i].pitch)) {
            return false;
        }
    }

    return true;
}

const validateSettings = ({ tempo, beats, noteValue, extra }) => {
    try {
        if (!extra || !tempo || !beats || !noteValue) {
            return false;
        }

        if (!validateBpm(tempo) || !validateNoteValue(noteValue) || !validateBeats(beats)) {
            return false;
        }

        if (!THEME_VALUES.includes(extra.theme)) {
            return false;
        }

        if (!SOUND_VALUES.includes(extra.sound)) {
            return false;
        }
    } catch {
        return false;
    }

    return true;
};

export const saveSettings = (settings) => {
    Storage.save(SETTINGS_KEY, settings);
};
export const getSavedSettings = () => {
    let settings = Storage.read(SETTINGS_KEY) || {};
    if (!validateSettings(settings)) {
        settings = DEFAULT_SETTINGS;
    }

    saveSettings(settings);

    return settings;
};
