export class Visualizer {
    #dom;
    #barActivationMethod;

    constructor(dom) {
        this.#dom = dom;
        this.setBarActivationMethod();
    }

    setOptions(options) {
        const { beats } = options;

        this.setBars(beats);
    }

    setBars(barsCount) {
        this.#dom.setBars(barsCount);
    }

    setBarActivationMethod(method) {
        switch (method) {
            default:
                this.#barActivationMethod = this.#dom.barPulse;
                return;
        }
    }

    activate({ beatNumber, time, beats }) {
        this.#barActivationMethod({ beatNumber, time, beats });
    }

    toggleBeatExtraAnimator({ shouldPause, duration }) {
        this.#dom.toggleBeatExtraAnimator({ shouldPause, duration });
    }

    isBarMuted(idx) {
        return this.#dom.isBarMuted(idx);
    }
}
