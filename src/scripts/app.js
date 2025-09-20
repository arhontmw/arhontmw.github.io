import { Metronome } from './metronome.js';
import { Player } from './player.js';
import { BpmVisualizer } from './bpm-visualizer.js';
import { Settings } from './settings.js';
import {
    PlayerDom,
    SettingsDom,
    BpmVisualizerDom,
    SettingsBpmDom,
    SettingsTsDom,
    SettingsExtraDom
} from './dom.js';
import { initWakeLock } from './wake-lock.js';
import { initVibration } from './vibration.js';
import { initBottomsheetManager } from './bottomsheet-manager.js';
import { getSavedSettings } from './utils.js';

function init() {
    const bpmVisualizerDom = new BpmVisualizerDom();
    const bpmVisualizer = new BpmVisualizer(bpmVisualizerDom);

    const audioContext = new AudioContext();
    const playerDom = new PlayerDom();
    const player = new Player(playerDom, audioContext);

    const metronome = new Metronome(
        audioContext,
        bpmVisualizer,
        player
    );

    const settingsBpmDom = new SettingsBpmDom();
    const settingsTsDom = new SettingsTsDom();
    const settingsExtraDom = new SettingsExtraDom();
    const settingsDom = new SettingsDom();
    const savedSettings = getSavedSettings();

    const settings = new Settings(
        settingsDom,
        settingsBpmDom,
        settingsTsDom,
        settingsExtraDom,
        metronome,
        bpmVisualizer,
        player,
        savedSettings
    );

    settings.init();
    initWakeLock();
    initVibration();
    initBottomsheetManager();

    player.onClick(() => {
        bpmVisualizer.toggleBeatExtraAnimator({
            shouldPause: player.isPlaying(),
            duration: metronome.getSecondsPerBeat()
        });
        player.togglePlay();
        metronome.togglePlay();
    });
}

document.addEventListener('DOMContentLoaded', init);
