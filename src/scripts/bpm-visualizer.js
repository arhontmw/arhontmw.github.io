import { PITCH } from "./constants.js";

const PITCH_TO_BARS = {
    [PITCH.ACCENT]: 2,
    [PITCH.ORDINARY]: 1,
    [PITCH.MUTED]: 0
};

const BARS_TO_PITCH = {
    0: PITCH.MUTED,
    1: PITCH.ORDINARY,
    2: PITCH.ACCENT
};

const NEXT_PITCH_STATE = {
    [PITCH.ACCENT]: PITCH.ORDINARY,
    [PITCH.ORDINARY]: PITCH.MUTED,
    [PITCH.MUTED]: PITCH.ACCENT
};

export class BpmVisualizer {
    #dom;
    #barActivationMethod;
    #onOptionsChangeCb;

    constructor(dom) {
        this.#dom = dom;
        this.setBarActivationMethod();
        this.#onOptionsChangeCb = Function.prototype;
    }

    init(options, onOptionsUpdateCb) {
        const { beats } = options;

        this.#setBarsFromBeats(beats);
        this.#onOptionsChangeCb = onOptionsUpdateCb;
    }

    #setBarsFromBeats(beats) {
        const bars = convertBeatsToBars(beats);

        this.#dom.setBars(
            bars,
            this.#getNextPitchOnClickCb
        );
    };

    #getNextPitchOnClickCb = (bar) => {
        const pitch = BARS_TO_PITCH[bar.pitchBarsCount];
        const nextPitch = NEXT_PITCH_STATE[pitch];

        bar.pitchBarsCount = PITCH_TO_BARS[nextPitch];

        this.#onOptionsChangeCb({
            beat: { idx: bar.idx, pitch: nextPitch }
        });

        return PITCH_TO_BARS[nextPitch];
    };

    setBarActivationMethod(method) {
        switch (method) {
            default:
                this.#barActivationMethod = this.#dom.barPulse;
                return;
        }
    }

    activate({ beatNumber }) {
        this.#barActivationMethod({ beatNumber });
    }

    toggleBeatExtraAnimator({ shouldPause, duration }) {
        this.#dom.toggleBeatExtraAnimator({ shouldPause, duration });
    }
}

const convertBeatsToBars = (beats) => beats.map(({ pitch, idx }) => ({
    pitchBarsCount: PITCH_TO_BARS[pitch],
    idx
}));
