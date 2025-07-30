import { Metronome } from './metronome.js';
import { Player } from './player.js';
import { Visualizer } from './visualizer.js';
import { Settings, SETTINGS_KEY } from './settings.js';
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

    player.onClick(() => {
        visualizer.toggleBeatExtraAnimator({
            shouldPause: player.isPlaying(),
            duration: metronome.getSecondsPerBeat()
        });
        player.togglePlay();
        metronome.togglePlay();
    });

    runWakeLock();
}

init();

async function runWakeLock() {
    let wakeLock = null;

    const requestWakeLock = async () => {
        try {
            wakeLock = await navigator.wakeLock.request();
            wakeLock.addEventListener('release', () => {
                console.log('Screen Wake Lock released:', wakeLock.released);
            });
            console.log('Screen Wake Lock released:', wakeLock.released);
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    };

    await requestWakeLock();
    window.setTimeout(() => {
        wakeLock.release();
        wakeLock = null;
    }, 5000);
};
