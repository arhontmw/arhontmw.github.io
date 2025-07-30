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

    let interactionStarted = false;
    // fix iOS wake lock
    document.addEventListener('click', () => {
        if (!interactionStarted) {
            runWakeLock();
            interactionStarted = true;
        }
    });
}

init();

function runWakeLock() {
    let wakeLock = null;

    const requestWakeLock = async () => {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock was released');
            });
            console.log('Wake Lock is active');
        } catch (e) {
            console.error(`${e.name}, ${e.message}`);
        }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
            requestWakeLock();
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange)
};
