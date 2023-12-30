
class Cache {

    constructor() {
        this.clear();
    }

    // methods

    clear() {
        this._data = {};
    }

    /**
     * @param {string} key
     * @param {Function | *} [defaultValue]
     * @returns {*}
     */
    get(key, defaultValue) {
        if (this._data[key] === undefined) {
            if (typeof defaultValue === 'function') {
                this._data[key] = defaultValue();
            } else {
                this._data[key] = defaultValue;
            }
        }

        return this._data[key];
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {*}
     */
    set(key, value) {
        this._data[key] = value;

        return this._data[key];
    }

}

module.exports = Cache;
