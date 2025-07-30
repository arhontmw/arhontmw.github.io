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
}

export function initWakeLock() {
    let interactionStarted = false;
    // fix: wake lock available only after interaction
    document.addEventListener('click', () => {
        if (!interactionStarted) {
            runWakeLock();
            interactionStarted = true;
        }
    });
}
