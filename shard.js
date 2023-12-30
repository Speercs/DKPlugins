
/**
 * @class Shard
 */
global.Shard = class {

    static initialize() {
        // this._tick = undefined;
        this._cache = {};
    }

    // properties

    /**
     * @static
     * @memberof Shard
     * @returns {Room[]}
     */
    static get myRooms() {
        if (this._cache.myRooms === undefined) {
            this._cache.myRooms = _.filter(Game.rooms, r => r.my);
        }

        return this._cache.myRooms;
    }

    /**
     * @static
     * @memberof Shard
     * @returns {boolean}
     */
    static get shard0() {
        return Game.shard.name === 'shard0';
    }

    /**
     * @static
     * @memberof Shard
     * @returns {boolean}
     */
    static get shard1() {
        return Game.shard.name === 'shard1';
    }

    /**
     * @static
     * @memberof Shard
     * @returns {boolean}
     */
    static get shard2() {
        return Game.shard.name === 'shard2';
    }

    /**
     * @static
     * @memberof Shard
     * @returns {boolean}
     */
    static get shard3() {
        return Game.shard.name === 'shard3';
    }

    /**
     * @static
     * @memberof Shard
     * @returns {number}
     */
    // static get tick() {
    //     if (this._tick === undefined) {
    //         if (Memory.lastTime) {
    //             this._tick = Date.now() - Memory.lastTime;
    //         } else {
    //             this._tick = global.TICKS[Game.shard.name];
    //         }
    //     }
    //
    //     return this._tick;
    // }

    /**
     * @static
     * @memberof Shard
     * @returns {Object}
     */
    static get store() {
        if (this._cache.store === undefined) {
            const rooms = this.myRooms;
            let store = {};

            if (rooms.length > 0) {
                store = { ...rooms[0].store };

                for (let i = 1; i < rooms.length; i++) {
                    const room = rooms[i];

                    _.forEach(room.store, (value, key) => {
                        store[key] += value;
                    });
                }
            }

            this._cache.store = store;
        }

        return this._cache.store;
    }

    static get factoryStore() {
        if (this._cache.factoryStore === undefined) {
            const rooms = this.myRooms.filter(r => r.factory);
            let store = {};

            if (rooms.length > 0) {
                store = RESOURCES_ALL.reduce((acc, resourceType) => {
                    acc[resourceType] = 0;

                    return acc;
                }, {});

                for (let i = 0; i < rooms.length; i++) {
                    const room = rooms[i];

                    _.forEach(room.factory.store, (value, key) => {
                        store[key] += value;
                    });
                }
            }

            this._cache.factoryStore = store;
        }

        return this._cache.factoryStore;
    }

    // methods

    /**
     * @static
     * @returns {Room[]}
     */
    static checkPowerProcess() {
        const store = this.store;

        if (store[RESOURCE_ENERGY] >= this.myRooms.length * 75000 && store[RESOURCE_POWER] >= 5000) {
            Memory.powerEnabled = 1000;

            console.log(`Power enabled on ${Game.shard.name}!`);
        }
    }

    /**
     * @static
     * @returns {Room[]}
     */
    static getMyRooms() {
        if (this._cache.myRooms === undefined) {
            return this.myRooms.slice();
        }

        return this._cache.myRooms.slice();
    }

    /**
     * @static
     * @param {string} target
     * @param {number} [ticks=1]
     *
     * @returns {boolean}
     */
    static requestObserver(target, ticks = 1) {
        return this.myRooms.some(room => room.tryToRequestObserve(target, ticks));
    }

    static runResourcesBalancer() {
        const myRooms = this.myRooms;
        const transfers = {};
        const capacity = {};

        this.myRooms.forEach((room) => {
            if (room.level < 8 || !room.terminal || !room.storage || room.terminal.cooldown > 0 || room.terminal.isSending() || room.store[RESOURCE_ENERGY] <= 15000) {
                return;
            }

            const terminal = room.terminal;
            const store = room.store;
            const forecastedStore = room.forecastedStore;

            for (const resourceType of Object.keys(terminal.store)) {
                if (resourceType === RESOURCE_ENERGY) {
                    if (store[RESOURCE_ENERGY] < 180000) {
                        continue;
                    }
                } else if (resourceType === RESOURCE_BATTERY) {
                    if (store[RESOURCE_BATTERY] < 10000) {
                        continue;
                    }
                } else if (store[resourceType] < 10000 && Resource.T0.includes(resourceType) || store[resourceType] < 15000) {
                    continue;
                }

                const resourceAmount = terminal.getResourceAmount(resourceType);

                if (resourceAmount === 0) {
                    continue;
                }

                const limit = terminal.getLimit(resourceType);

                myRooms.sort((a, b) => a.forecastedStore[resourceType] - b.forecastedStore[resourceType]).some((r) => {
                    if (r === room || r.level < 8 || !r.terminal || !r.storage || r.storage.isFull() || r.forecastedStore[resourceType] >= forecastedStore[resourceType]) {
                        return false;
                    }

                    if ((transfers[r.name] || []).includes(resourceType)) {
                        return false;
                    }

                    const freeCapacity = capacity[r.name] !== undefined ?
                        capacity[r.name] : (capacity[r.name] = r.terminal.store.getFreeCapacity());

                    if (freeCapacity <= 0) {
                        return false;
                    }

                    let amount = Math.min(
                        limit,
                        freeCapacity,
                        resourceAmount,
                        forecastedStore[resourceType] - r.forecastedStore[resourceType]);

                    if (resourceType === RESOURCE_ENERGY) {
                        amount = Math.min(amount, limit / 2, terminal.getEnergyForTransfer(r.name));
                    }

                    const sent = amount > 10
                        && forecastedStore[resourceType] - amount >= r.forecastedStore[resourceType] + amount
                        && terminal.transfer(resourceType, amount, r.name, { initiator: 'resource balance' }) === OK;

                    if (sent) {
                        r.forecastedStore[resourceType] += amount;
                        forecastedStore[resourceType] -= amount;
                        capacity[r.name] -= amount;

                        if (capacity[r.name] <= 0) {
                            _.pull(myRooms, r);
                        }

                        transfers[room.name] ?
                            transfers[room.name].push(resourceType) : transfers[room.name] = [resourceType];

                        return true;
                    }

                    return false;
                });
            }
        });
    }

    static runResourcesBalancer2() {
        // const myRooms = this.myRooms.filter((room) => {
        //     if (!room.terminal) {
        //         return false;
        //     }
        //
        //     return true;
        // });
        const myRooms = this.getMyRooms();
        const transfers = {};
        const capacity = {};

        if (myRooms.length <= 1) {
            return;
        }

        const transferFrom = myRooms.filter((room) => {
            if (!room.terminal || !room.terminal.my || room.terminal.cooldown > 0 || room.terminal.isSending()) {
                return false;
            }

            if (room.terminal.store[RESOURCE_ENERGY] === 0) {
                return false;
            }

            if (room.playerEnemies.length > 1) {
                return true;
            }

            if (room.store[RESOURCE_ENERGY] <= 15000) {
                return false;
            }

            return true;
        });

        if (transferFrom.length === 0) {
            return;
        }

        const transferTo = myRooms.filter((room) => {
            if (room.level < 8) {
                return false;
            }

            if (!room.terminal || room.terminal.isFull()) {
                return false;
            }

            if (!room.storage || room.storage.isFull()) {
                return false;
            }

            if (!room.terminal.pos.isNearTo(room.storage.pos)) {
                return false;
            }

            if (room.playerEnemies.length > 1) {
                return false;
            }

            return true;
        });

        if (transferTo.length === 0) {
            return;
        }

        const totalRooms = myRooms.filter((room) => {
            if (room.level < 8) {
                return false;
            }

            if (!room.terminal) {
                return false;
            }

            if (room.hostileCreeps > 1) {
                return false;
            }

            return true;
        }).length;

        const resources = Object.entries(this.store)
                                    .filter(([key, value]) => value >= 10000)
                                    .sort(([aKey, aValue], [bKey, bValue]) => bValue - aValue);

        for (const resource of resources) {
            if (transferFrom.length === 0) {
                return;
            }

            const resourceType = resource[0];
            const totalAmount = resource[1];
            const roomAmount = Math.floor(totalAmount / totalRooms);

            _.forEach(transferTo, (room) => {
                if (transferFrom.length === 0) {
                    return false;
                }

                if (room.forecastedStore[resourceType] >= roomAmount) {
                   return;
                }

                if (capacity[room.name] === undefined) {
                    capacity[room.name] = room.terminal.store.getFreeCapacity();
                }

                if (capacity[room.name] <= 0) {
                    return;
                }

                const rooms = transferFrom.filter((roomFrom) => {
                    if (roomFrom === room) {
                        return false;
                    }

                    if (roomFrom.forecastedStore[resourceType] <= roomAmount) {
                        return false;
                    }

                    return true;
                }).sort((a, b) => {
                   const aValue = Math.min(
                       a.forecastedStore[resourceType] - roomAmount,
                       a.terminal.getResourceAmount(resourceType));
                   const bValue = Math.min(
                       b.forecastedStore[resourceType] - roomAmount,
                       b.terminal.getResourceAmount(resourceType));

                   if (aValue === bValue) {
                       return Market.cost(aValue, a.name, room.name) - Market.cost(bValue, b.name, room.name);
                   }

                   return bValue - aValue;
                });

                _.forEach(rooms, (roomFrom) => {
                    if (room.forecastedStore[resourceType] >= roomAmount) {
                        return false;
                    }

                    if (capacity[room.name] <= 0) {
                        return false;
                    }

                    let amount = Math.min(
                        capacity[room.name],
                        roomAmount - room.forecastedStore[resourceType],
                        roomFrom.forecastedStore[resourceType] - roomAmount,
                        roomFrom.terminal.getResourceAmount(resourceType));

                    if (resourceType === RESOURCE_ENERGY) {
                        amount = Math.min(
                            amount,
                            room.terminal.getLimit(resourceType) / 2,
                            roomFrom.terminal.getEnergyForTransfer(room.name));

                        if (amount < 5000) {
                            return;
                        }
                    }

                    if (amount < 500) {
                        return;
                    }

                    if (roomFrom.terminal.transfer(resourceType, amount, room.name, { initiator: 'resource balance' }) === OK) {
                        // console.log('---');
                        // console.log(`Balance amount: ${roomAmount}`);
                        // console.log(`Transferred ${amount} ${global.resourceImg(resourceType)} from ${global.linkRoom(roomFrom)} to ${global.linkRoom(room)}`);
                        // console.log(`Stored (from): ${roomFrom.store[resourceType]} ${global.resourceImg(resourceType)}, forecasted: ${roomFrom.forecastedStore[resourceType]}`);
                        // console.log(`Stored (to): ${room.store[resourceType]} ${global.resourceImg(resourceType)}, forecasted: ${room.forecastedStore[resourceType]}`);
                        roomFrom.forecastedStore[resourceType] -= amount;
                        room.forecastedStore[resourceType] += amount;
                        capacity[room.name] -= amount;
                        // console.log(`transferFrom: ${transferFrom.length}`);
                        _.pull(transferFrom, roomFrom);
                        // console.log('---');
                    }
               });
            });
        }
    }

    // console

    static factories() {
        let output = '<table width="400px" border="2" cellspacing="4px" cellpadding="4px">' +
            '<tr><td width="30%" align="center">Room</td>' +
            '<td width="35%" align="center">Level</td>' +
            '<td width="35% align="center">Reactions</td>';

        this.myRooms.forEach((room) => {
            const factory = room.factory;

            if (!factory) {
                return;
            }

            output += `<tr><td width="30% align="center">${linkRoom(room)}</td><td width="35% align="center">${factory.level} (${factory.cooldown || 0})</td>`;
            output += `<td width="35% align="center">${room.getFactoryReactions().map(r => global.resourceImg(r)).join(' ')}</td></tr>`;
        });

        output += `</table>`;

        return output;
    }

};

module.exports = global.Shard;
