import { Metronome } from './metronome.js';
import { Player } from './player.js';
import { Visualizer } from './visualizer.js';
import { Settings, SETTINGS_KEY } from './settings.js';
import { initWakeLock } from './wake-lock.js';
import { initVibration } from './vibration.js';
import { Storage } from './utils.js';

const retrieveSavedSettings = () => Storage.read(SETTINGS_KEY) || {};

function init() {
    const visualizer = new Visualizer();
    const audioContext = new AudioContext();
    const player = new Player(audioContext);
    const metronome = new Metronome(
        audioContext,
        visualizer,
        player
    );

    const savedSettings = retrieveSavedSettings();
    const settings = new Settings(
        metronome,
        visualizer,
        player,
        savedSettings
    );

    settings.init();
    initWakeLock();
    initVibration();

    player.listen(() => {
        visualizer.toggleBeatExtraAnimator({
            shouldPause: player.isPlaying(),
            duration: metronome.getSecondsPerBeat()
        });
        player.togglePlay();
        metronome.togglePlay();
    });
}

init();
