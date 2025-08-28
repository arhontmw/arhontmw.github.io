import { Metronome } from './metronome.js';
import { Player } from './player.js';
import { BpmVisualizer } from './bpm-visualizer.js';
import { Settings, SETTINGS_KEY } from './settings.js';
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
import { Storage } from './utils.js';
import { THEMES, THEMES_BACKGROUND_COLOR } from './constants.js';

const retrieveSavedSettings = () => Storage.read(SETTINGS_KEY) || {};

const loadTheme = ({ extra }) => {
    const theme = extra ? extra.theme : THEMES.SUNSET;
    document.querySelector('.app').classList.add(`${theme}-theme`);
    document.querySelector('.app-loader').classList.remove('app-loader');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', THEMES_BACKGROUND_COLOR[theme]);
};

function init() {
    const savedSettings = retrieveSavedSettings();
    loadTheme(savedSettings);

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
