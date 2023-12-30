
const RoleBase = ModuleManager.get('role.base');

//

class Caravan extends RoleBase {

    static getTravelOptions(task) {
        return { ...RoleBase.getTravelOptions.call(this, task), avoidHostileCreeps: true };
    }

    static findPortal(shard) {
        return this.room.portals.find((portal) => {
            if (shard === 'shard0') {
                return portal.destination.shard === shard && portal.destination.room === 'E70S10';
            }

            return portal.destination.shard === shard;
        });
    }

    static findPath(to) {
        const flag = Game.flags[to];
        const creepPos = this.creep.pos.encode();
        const destination = flag && flag.pos || new RoomPosition(25, 25, to);
        const destinationPos = destination.encode();
        const data = _.get(this.PATHS, [creepPos, destinationPos]);

        if (data && data.expiredAt > Game.time) {
            return data.path;
        }

        const pathData = Traveler.findTravelPath(this.creep.pos, destination, {
            ignoreCreeps: true,
            ignoreRoads: true,
            offRoad: false,
            maxOps: 3000
        }).path;

        const path = Traveler.serializePath(this.creep.pos, pathData, true,'#00bbff');

        if (!this.PATHS) {
            this.PATHS = {};
        }

        _.set(this.PATHS, [creepPos, destinationPos], { path, expiredAt: Game.time + 1000 });

        return path;
    }

    static checkOtherRooms(resourceType) {
        if (resourceType === RESOURCE_ENERGY) {
            return false;
        }

        const amount = Math.min(this.creep.store.getFreeCapacity(), 1250);
        const minStoreAmount = (Resource.T0.includes(resourceType) ? 7500 : amount);
        const rooms = Shard.myRooms.filter(r =>
            r.level >= 6 && r.terminal &&
            r.store[RESOURCE_ENERGY] >= 15000 &&
            r.store[resourceType] >= minStoreAmount
        ).sort((a, b) => b.store[resourceType] - a.store[resourceType]);

        return rooms.some(r => r.terminal.transfer(resourceType, amount, this.room.name, { initiator: 'caravan' }) === OK);
    }

    /**
     * @override
     * @static
     * @param {Object} task
     * @return {Boolean}
     */
    static isValid(task) {
        if (task.state === 'from' && Memory.caravanLimit <= 0) {
            return false;
        }

        return super.isValid(task);
    }

    /**
     * @override
     * @static
     * @param {Number} requiredAmount
     * @param {Object} task
     * @return {Number}
     */
    static calculateWithdrawAmount(requiredAmount, task) {
        const amount = super.calculateWithdrawAmount(requiredAmount, task);
        const limit = Memory.caravanLimit;

        if (amount > limit) {
            return limit;
        }

        return amount;
    }

    /**
     * @override
     * @static
     * @param {Number} amount
     * @param {Structure} structure
     * @param {String} resourceType
     * @param {Object} task
     */
    static onWithdrawSuccess(amount, structure, resourceType, task) {
        if (Number.isFinite(Memory.caravanLimit)) {
            Memory.caravanLimit -= amount;

            console.log(`Caravan limit left: ${Memory.caravanLimit} ${global.resourceImg(resourceType)}`);
        }
    }

    static findTask() {
        if (this.room.my) {
            if (Game.shard.name === this.creep.nameParts[3]) {
                if (!this.creep.memory.logged) {
                    const resources = _.map(this.creep.store, (amount, resourceType) => {
                        return `${amount} ${resourceImg(resourceType)}`;
                    }).join(', ');

                    console.log(`Delivered ${resources} to ${Game.shard.name} (${linkRoom(this.room)})`);

                    this.creep.memory.logged = 1;
                }

                if (!this.creep.isEmpty()) {
                    const resourceType = this.creep.store.getFirst();
                    const terminal = this.room.terminal;
                    let structure = this.findStructureByCapacity([
                        terminal, this.room.storage], resourceType);
                    let ignoreLimit = false;

                    if (structure !== terminal && terminal && terminal.store.getFreeCapacity(resourceType) >= terminal.store.getCapacity(resourceType) / 3) {
                        structure = terminal;
                        ignoreLimit = true;
                    }

                    if (structure) {
                        const amount = Math.min(
                            ignoreLimit ?
                                structure.store.getFreeCapacity(resourceType) :
                                structure.getCapacity(resourceType),
                            this.creep.store[resourceType]);

                        if (amount > 0) {
                            return {
                                to: { id: structure.id, amount },
                                resourceType,
                                state: 'to'
                            };
                        }
                    }
                } else {
                    this.newRole = 'recycler';

                    return null;
                }
            } else {
                if (!this.creep.isFull()) {
                    if (Memory.caravanLimit <= 0 && this.creep.isEmpty()) {
                        this.newRole = 'recycler';

                        return null;
                    }

                    if (Memory.caravanBoosts && Memory.caravanLimit >= 35000 && !this.creep.memory.boosted) {
                        const carryParts = this.creep.getActiveBodyparts(CARRY);
                        const moveParts = this.creep.getActiveBodyparts(MOVE);
                        const moveBoost = [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE, RESOURCE_ZYNTHIUM_ALKALIDE, RESOURCE_ZYNTHIUM_HYDRIDE].find(
                            boost => this.room.labs.some(
                                lab => lab.store[boost] >= moveParts * LAB_BOOST_MINERAL
                                    && lab.store[RESOURCE_ENERGY] >= moveParts * LAB_BOOST_ENERGY));
                        const carryBoost = [RESOURCE_CATALYZED_KEANIUM_ACID, RESOURCE_KEANIUM_ACID, RESOURCE_KEANIUM_HYDRIDE].find(
                            boost => this.room.labs.some(
                                lab => lab.store[boost] >= carryParts * LAB_BOOST_MINERAL
                                    && lab.store[RESOURCE_ENERGY] >= carryParts * LAB_BOOST_ENERGY));

                        if (moveBoost && carryBoost) {
                            this.creep.memory.boosts = [moveBoost, carryBoost];
                            this.creep.memory.roleAfterBoost = 'caravan';
                            this.newRole = 'booster';

                            return null;
                        }
                    }

                    let resourceType = this.creep.memory.resourceType || this.creep.nameParts[2] || 'T0';

                    if (resourceType === 'ALL') {
                        const roomStore = this.room.store;
                        let store = Object.keys(roomStore).filter(key => roomStore[key] > 0);

                        if (this.room.factory) {
                            const factoryStore = this.room.factory.store;
                            const resources = Object.keys(factoryStore).filter(key => factoryStore[key] > 0);

                            store = _.difference(store, resources);
                        }

                        resourceType = _.last(store);
                    } else if (Resource[resourceType]) {
                        const roomStore = this.room.store;
                        let store = Object.keys(roomStore).filter(key => roomStore[key] > 0);

                        if (this.room.factory) {
                            const factoryStore = this.room.factory.store;
                            const resources = Object.keys(factoryStore).filter(key => factoryStore[key] > 0);

                            store = _.difference(store, resources);
                        }

                        resourceType = Resource[resourceType].find(resource => store.includes(resource));
                    }

                    const structure = this.findStructureByResource(
                        [this.room.storage, this.room.terminal, this.room.factory], resourceType);

                    if (structure) {
                        delete this.creep.memory.searches;

                        const amount = Math.min(
                            this.creep.store.getFreeCapacity(),
                            structure.getResourceAmount(resourceType));

                        if (amount > 0) {
                            return {
                                from: { id: structure.id, amount },
                                resourceType
                            };
                        }
                    } else {
                        const searches = this.creep.memory.searches || 0;

                        if (searches >= 10) {
                            delete this.creep.memory.searches;

                            if (!this.creep.isEmpty()) {
                                console.log(`Partial caravan in the room ${linkRoom(this.room)}: ${this.creep.store.getUsedCapacity()}/${this.creep.store.getCapacity()}`);

                                let options = { repath: 0.01, maxOps: 3000, avoidHostileCreeps: true };

                                if (Game.shard.name === 'shard0' || Game.shard.name === 'shard3') {
                                    const path = this.findPath(this.creep.nameParts[1]);

                                    if (path) {
                                        this.creep.memory.trav = { path };

                                        options = { repath: 0 };
                                    }
                                }

                                return {
                                    to: this.creep.nameParts[1],
                                    options,
                                    state: 'travel'
                                };
                            } else {
                                console.log(`Caravan can't find a resources in the room ${linkRoom(this.room)}!`);

                                this.newRole = 'recycler';

                                return null;
                            }
                        } else {
                            if (this.checkOtherRooms(resourceType)) {
                                return null;
                            }

                            this.creep.memory.searches = searches + 1;

                            this.creep.wait(10);

                            console.log(`Caravan waiting a resource ${resourceImg(resourceType)} in the room ${linkRoom(this.room)}`);

                            return null;
                        }
                    }
                } else {
                    let options = { repath: 0.01, maxOps: 3000, avoidHostileCreeps: true };

                    if (Game.shard.name === 'shard0' || Game.shard.name === 'shard3') {
                        const path = this.findPath(this.creep.nameParts[1]);

                        if (path) {
                            this.creep.memory.trav = { path };

                            options = { repath: 0 };
                        }
                    }

                    return {
                        to: this.creep.nameParts[1],
                        options,
                        state: 'travel'
                    };
                }
            }
        }

        const targetShard = this.creep.nameParts[3];

        if (Game.shard.name !== targetShard) {
            const roomName = this.room.name;
            let shard = null;

            if (roomName === 'E70S10' || roomName === 'E70S20') {
                shard = 'shard1';
            } else if (roomName === 'E40S10') {
                shard = targetShard;

                if (Game.shard.name === 'shard1' && targetShard === 'shard3' || Game.shard.name === 'shard3') {
                    shard = 'shard2';
                }

                if (Game.shard.name === 'shard2' && targetShard === 'shard0') {
                    shard = 'shard1';
                }
            }

            if (shard) {
                const portal = this.findPortal(shard);

                if (portal) {
                    return {
                        to: { pos: portal.pos },
                        state: 'move'
                    };
                } else {
                    Game.notify(`Не удалось найти портал!`);
                }
            }
        } else {
            if (Memory.caravanIndex == null) {
                Memory.caravanIndex = 0;
            }

            const rooms = this.ROOMS[Game.shard.name];
            const targetRoom = rooms[Memory.caravanIndex++ % rooms.length];

            if (Game.shard.name === 'shard3') {
                if (!Memory.CaravanValue) {
                    Memory.CaravanValue = {};
                }

                const resourceType = this.creep.store.getFirst();

                if (resourceType) {
                    if (!Memory.CaravanValue[resourceType]) {
                        Memory.CaravanValue[resourceType] = 0;
                    }

                    Memory.CaravanValue[resourceType] += (this.creep.store[resourceType] || 0);
                } else {
                    Game.notify(`Не удалось найти ресурс крипа!`);
                }
            }

            if (targetRoom) {
                return {
                    to: targetRoom,
                    options: { avoidHostileCreeps: true, repath: 0 },
                    state: 'travel'
                };
            } else {
                Game.notify(`Не удалось найти комнату для каравана!`);
            }
        }

        this.creep.wait(3);

        return null;
    }

}

Caravan.ROOMS = {
    shard0: ['E68S9'],
    shard1: ['E42S9', 'E39S9'],
    shard2: ['E42S11', 'E38S9'],
    shard3: ['E39S11']
};

module.exports = Caravan;
