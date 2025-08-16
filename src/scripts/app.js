import { Metronome } from './metronome.js';
import { Player } from './player.js';
import { BpmVisualizer } from './bpm-visualizer.js';
import { Settings, SETTINGS_KEY } from './settings.js';
import {
    PlayerDom,
    SettingsDom,
    BpmVisualizerDom,
    SettingsBpmDom,
    SettingsTsDom
} from './dom.js';
import { initWakeLock } from './wake-lock.js';
import { initVibration } from './vibration.js';
import { initBottomsheetManager } from './bottomsheet-manager.js';
import { Storage } from './utils.js';

const retrieveSavedSettings = () => Storage.read(SETTINGS_KEY) || {};

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
    const settingsDom = new SettingsDom();
    const savedSettings = retrieveSavedSettings();
    const settings = new Settings(
        settingsDom,
        settingsBpmDom,
        settingsTsDom,
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

init();
