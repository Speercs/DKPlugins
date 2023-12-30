
const RoomCache = require('cache.room');

global.GlobalCache = class {

    // properties

    static get cache() {
        return this._cache;
    }

    // methods

    static initialize() {
        if (this._cache === undefined) {
            this._cache = { rooms: {} };
        } else {
            Object.keys(this._cache.rooms).forEach((roomName) => {
                if (!Game.rooms[roomName]) {
                    delete this._cache.rooms[roomName];
                }
            });
        }
    }

    static clear() {
        this._cache = undefined;
    }

    /**
     * @static
     * @param {Room} room
     * @returns {RoomCache}
     */
    static getRoomCache(room) {
        if (this._cache.rooms[room.name] === undefined) {
            this._cache.rooms[room.name] = new RoomCache(room);
        }

        return this._cache.rooms[room.name];
    }

};

module.exports = GlobalCache;
