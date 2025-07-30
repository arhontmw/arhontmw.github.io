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

    // Запрет на масштабирование при двойном тапе
    document.addEventListener('dblclick', (e) => {
        e.preventDefault();
      }, { passive: false });
}

init();
