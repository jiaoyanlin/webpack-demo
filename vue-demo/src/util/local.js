class Local {
    constructor() {
    }
    get(key) {
        return localStorage.getItem(key);
    }
    set(key, val) {
        localStorage.setItem(key, val);
    }
    remove(key) {
        localStorage.removeItem(key);
    }
}

export default new Local();
