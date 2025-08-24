import { BOTTOMSHEET_VISIBILITY_EVENT, BOTTOMSHEET_TYPE } from './constants.js';

export function initBottomsheetManager() {
    const bottomSheetWrappers = document.querySelectorAll('.bottomsheet-wrapper');

    const SETTINGS_WRAPPERS = {
        [BOTTOMSHEET_TYPE.BPM_SETTINS]: document.querySelector('.bottomsheet-wrapper.bpm-settings'),
        [BOTTOMSHEET_TYPE.TIME_SIGNATURE_SETTINGS]: document.querySelector('.bottomsheet-wrapper.time-signature-settings'),
        [BOTTOMSHEET_TYPE.EXTRA_SETTINGS]: document.querySelector('.bottomsheet-wrapper.extra-settings')
    };

    const openBottomSheet = (type) => {
        const settingsWrapper = SETTINGS_WRAPPERS[type];
        settingsWrapper.classList.add('bottomsheet-wrapper_visible');
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
