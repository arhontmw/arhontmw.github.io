export const PITCH_VALUES = ['accent', 'ordinary', 'muted'];
export const PITCH = {
    ACCENT: PITCH_VALUES[0],
    ORDINARY: PITCH_VALUES[1],
    MUTED: PITCH_VALUES[2]
};

export const SECONDS_IN_MINUTE = 60;
export const LOOKAHEAD = 25; // ms
export const SCHEDULE_AHEAD_TIME = 0.1; // sec

export const BOTTOMSHEET_VISIBILITY_EVENT = 'bottomsheet-visibility';
export const BOTTOMSHEET_TYPE = {
    BPM_SETTINS: 'bpm_settings',
    TIME_SIGNATURE_SETTINGS: 'time_signature_settings',
    EXTRA_SETTINGS: 'extra_settings'
};

export const MAX_TEMPO = 600;
export const MIN_TEMPO = 20;

export const MAX_BEATS_COUNT = 16;
export const MIN_BEATS_COUNT = 1;

export const MAX_NOTE_VALUE = 32;
export const MIN_NOTE_VALUE = 1;

export const THEME_VALUES = ['sunset', 'titan'];
export const THEMES = {
    SUNSET: THEME_VALUES[0],
    TITAN: THEME_VALUES[1]
};
export const THEMES_BACKGROUND_COLOR = {
    [THEMES.SUNSET]: '#030f76',
    [THEMES.TITAN]: '#000000'
};

export const SOUND_VALUES = ['snap', 'drums'];
export const SOUNDS = {
    SNAP: SOUND_VALUES[0],
    DRUMS: SOUND_VALUES[1]
};

export const SETTINGS_KEY = 'metronome-settings';

export const DEFAULT_TEMPO = 120;
const DEFAULT_BEATS = [
    { idx: 0, pitch: PITCH.ACCENT },
    { idx: 1, pitch: PITCH.ORDINARY },
    { idx: 2, pitch: PITCH.ORDINARY },
    { idx: 3, pitch: PITCH.ORDINARY }
];
const DEFAULT_NOTE_VALUE = 4;
const DEFAULT_EXTRA = {
    theme: THEMES.SUNSET,
    sound: SOUNDS.SNAP
};
export const DEFAULT_SETTINGS = {
    tempo: DEFAULT_TEMPO,
    beats: DEFAULT_BEATS,
    noteValue: DEFAULT_NOTE_VALUE,
    extra: DEFAULT_EXTRA
};
