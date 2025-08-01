import {
    SECONDS_IN_MINUTE,
    LOOKAHEAD,
    SCHEDULE_AHEAD_TIME
} from './constants.js';

export class Metronome {
    #ctx;
    #visr;
    #player;
    #tempo;
    #beats;
    #noteValue;
    #nextNoteTime;
    #noteIdx;
    #isRunning;
    #intervalId;
    #inited;

    constructor(
        ctx,
        visr,
        player
    ) {
        this.#ctx = ctx;
        this.#visr = visr;
        this.#player = player;

        this.#reset();
    }

    init(options) {
        const {
            tempo,
            beats,
            noteValue,
        } = options;

        this.#inited = true;

        this.#tempo = tempo;
        // beats / noteValue - eg. 4 / 4
        this.#beats = beats;
        this.#noteValue = noteValue; // whole, half, quarter, eighth, sixteenth

    }

    #reset() {
        this.#nextNoteTime = 0.0;
        this.#noteIdx = 0; // according to beats. Eg 4: 0, 1, 2, 3 | 0, 1, 2, 3 | 0, 1, 2, 3
        this.#isRunning = false;
        clearInterval(this.#intervalId);
        this.#intervalId = null;
    }

    #schedule() {
        while (this.#nextNoteTime < this.#ctx.currentTime + SCHEDULE_AHEAD_TIME) {
            this.#playNote({
                pitch: this.#beats[this.#noteIdx].pitch,
                beatNumber: this.#noteIdx,
                time: this.#nextNoteTime
            });
            this.#nextNote();
        }
    }

    #playNote({ beatNumber, pitch, time }) {
        this.#player.playSound({ time, pitch });
        this.#visr.activate({ beatNumber });
    }

    #nextNote() {
        const secondsPerBeat = this.getSecondsPerBeat();

        this.#nextNoteTime += secondsPerBeat;
        this.#noteIdx = (this.#noteIdx + 1) % this.#beats.length;
    }

    #start() {
        if (this.#isRunning) {
            return;
        }

        this.#reset();

        this.#isRunning = true;
        this.#nextNoteTime = this.#ctx.currentTime + 0.05;

        this.#intervalId = setInterval(() => this.#schedule(), LOOKAHEAD);
    }

    #stop() {
        this.#reset();
    }

    togglePlay() {
        if (!this.#inited) {
            return;
        }

        if (this.#isRunning) {
            this.#stop();
        } else {
            this.#start();
        }
    }

    setTempo(tempo, start = true) {
        this.#stop();
        this.#tempo = tempo;

        if (start) {
            this.#start();
        }
    }

    setBeats(beats, start = true) {
        this.#stop();
        this.#beats = beats;

        if (start) {
            this.#start();
        }
    }

    getSecondsPerBeat() {
        return SECONDS_IN_MINUTE / this.#tempo;
    }
}
