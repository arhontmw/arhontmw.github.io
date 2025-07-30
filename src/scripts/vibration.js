export function initVibration() {
    if (!navigator.vibrate) {
        return;
    }

    document.addEventListener('click', (event) => {
        if (event.target.dataset.vibro === '1') {
            navigator.vibrate(70);
        }
    });
}
