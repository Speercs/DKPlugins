
const STRUCTURES_CACHE_TIME = 35;

//

class RoomCache {

    /**
     * @param {Room} room
     */
    constructor(room) {
        this.roomName = room.name;

        this._data = {};
        this._structures = {};
    }

    // properties

    /**
     * @readonly
     * @type {Room}
     * @memberof RoomCache.prototype
     */
    get room() {
        return Game.rooms[this.roomName];
    }

    // C methods

    clear() {
        this._structures = {};
    }

    /**
     * @param {string} structureType
     */
    clearStructuresCache(structureType) {
        this._structures[structureType] = null;
    }

    // G methods

    _getStructuresCacheTime(structureType) {
        if (this.room.playerEnemies.length > 0) {
            return 0;
        }

        return STRUCTURES_CACHE_TIME;
    }

    /**
     * @param {string} key
     * @param {*} defaultValue
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
     * @param {string} structureType
     * @returns {Structure[]}
     */
    getStructures(structureType) {
        if (!this._structures[structureType] || Game.time >= this._structures[structureType].expiredAt) {
            const structures = this.room.find(FIND_STRUCTURES, {
                filter: structure => structure.structureType === structureType
            });

            this._structures[structureType] = {
                data: structures.map(s => s.id),
                expiredAt: Game.time + this._getStructuresCacheTime(structureType)
            };

            return structures;
        }

        const data = this._structures[structureType].data;
        const structures = [];

        for (let i = 0; i < data.length; i++) {
            const structure = Game.getObjectById(data[i]);

            if (structure !== null) {
                structures.push(structure);
            } else {
                this.clearStructuresCache(structureType);

                return this.getStructures(structureType);
            }
        }

        return structures;
    }

    /**
     * @param {string} structureType
     * @returns {Structure}
     */
    getStructure(structureType) {
        if (!this._structures[structureType] || Game.time >= this._structures[structureType].expiredAt) {
            const structure = _.find(this.room.find(FIND_STRUCTURES), { structureType });

            this._structures[structureType] = {
                data: structure && structure.id,
                expiredAt: Game.time + this._getStructuresCacheTime(structureType)
            };

            return structure;
        }

        return  Game.getObjectById(this._structures[structureType].data);
    }

    // S methods

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

module.exports = RoomCache;
