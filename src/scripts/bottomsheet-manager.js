import { BOTTOMSHEET_VISIBILITY_EVENT, BOTTOMSHEET_TYPE } from './constants.js';

export function initBottomsheetManager() {
    const settingsBpmWrapper = document.querySelector('.bottomsheet-wrapper.bpm-settings');
    const settingsTimeSignatureWrapper = document.querySelector('.bottomsheet-wrapper.time-signature-settings');
    const bottomSheetWrappers = document.querySelectorAll('.bottomsheet-wrapper');

    const openBottomSheet = (type) => {
        if (type === BOTTOMSHEET_TYPE.BPM_SETTINS) {
            settingsBpmWrapper.classList.add('bottomsheet-wrapper_visible');
        } else if (type === BOTTOMSHEET_TYPE.TIME_SIGNATURE_SETTINGS) {
            settingsTimeSignatureWrapper.classList.add('bottomsheet-wrapper_visible');
        }

    };
    const closeBottomSheet = () => {
        bottomSheetWrappers.forEach((bs) => bs.classList.remove('bottomsheet-wrapper_visible'));
    };

    document.addEventListener(BOTTOMSHEET_VISIBILITY_EVENT, (event) => {
        const { status, type } = event.detail;

        if (status === 'open') {
            openBottomSheet(type);
        } else if (status === 'close') {
            closeBottomSheet();
        }
    });

    bottomSheetWrappers.forEach((bs) => {
        bs.addEventListener('click', (event) => {
            if (event.target === bs) {
                closeBottomSheet();
            }
        });
    });
}
