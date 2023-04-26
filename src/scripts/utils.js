export class Storage {
    static save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('failed to save in localStorage', error);
        }
    }

    static read(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (error) {
            console.error('failed to read value from localStorage', key, error);
        }

        return null;
    }
}
