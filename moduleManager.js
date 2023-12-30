
/**
 * @class ModuleManager
 */
global.ModuleManager = class {

    /**
     * @static
     */
    static clear() {
        this._modules = {};
    }

    /**
     * @static
     * @param {String} moduleName
     * @returns {*}
     */
    static get(moduleName) {
        if (this._modules[moduleName] === undefined) {
            try {
                this._modules[moduleName] = require(moduleName);
            } catch (e) {
                const message = `Module not found: ${moduleName}!`;

                console.log(message);

                Game.notify(message);
            }
        }

        return this._modules[moduleName];
    }

    /**
     * @static
     * @param {String} moduleName
     * @param {*} params
     *
     * @returns {*}
     */
    static run(moduleName, ...params) {
        return this.get(moduleName).run(...params);
    }

};

module.exports = global.ModuleManager;
