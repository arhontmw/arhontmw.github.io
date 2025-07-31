export class Metronome {
    #ctx;
    #visr;
    #player;
    #secondsInMinute;
    #lookahead;
    #scheduleAheadTime;
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

    setOptions(options) {
        const {
            tempo,
            beats,
            noteValue,
            secondsInMinute,
            lookahead,
            scheduleAheadTime
        } = options;

        this.#inited = true;

        this.#secondsInMinute = secondsInMinute;
        this.#lookahead = lookahead;
        this.#scheduleAheadTime = scheduleAheadTime;

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
        while (this.#nextNoteTime < this.#ctx.currentTime + this.#scheduleAheadTime) {
            this.#playNote(this.#noteIdx, this.#nextNoteTime);
            this.#nextNote();
        }
    }

    #playNote(beatNumber, time) {
        if (!this.#visr.isBarMuted(beatNumber)) {
            this.#player.playSound({ beatNumber, time, beats: this.#beats });
        }

        this.#visr.activate({ beatNumber, time, beats: this.#beats });
    }

    #nextNote() {
        const secondsPerBeat = this.getSecondsPerBeat();

        this.#nextNoteTime += secondsPerBeat;
        this.#noteIdx = (this.#noteIdx + 1) % this.#beats;
    }

    #start() {
        if (this.#isRunning) {
            return;
        }

        this.#reset();

        this.#isRunning = true;
        this.#nextNoteTime = this.#ctx.currentTime + 0.05;

        this.#intervalId = setInterval(() => this.#schedule(), this.#lookahead);
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
        return this.#secondsInMinute / this.#tempo;
    }
}
