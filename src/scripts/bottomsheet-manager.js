import { BOTTOMSHEET_VISIBILITY_EVENT } from './constants.js';

export function initBottomsheetManager() {
    const bottomSheetWrapper = document.querySelector('.bottomsheet-wrapper');
    const openBottomSheet = () => bottomSheetWrapper.classList.add('bottomsheet-wrapper_visible');
    const closeBottomSheet = () => bottomSheetWrapper.classList.remove('bottomsheet-wrapper_visible');;


    document.addEventListener(BOTTOMSHEET_VISIBILITY_EVENT, (event) => {
        const { status } = event.detail;

        if (status === 'open') {
            openBottomSheet();
        } else if (status === 'close') {
            closeBottomSheet();
        }
    });

    bottomSheetWrapper.addEventListener('click', (event) => {
        if (event.target === bottomSheetWrapper) {
            closeBottomSheet();
        }
    });
}
