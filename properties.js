
const LIMITS = {
    [STRUCTURE_TERMINAL]: {
        [RESOURCE_ENERGY]: 30000
    },
    [STRUCTURE_FACTORY]: {
        [RESOURCE_ENERGY]: 10000,

        [RESOURCE_HYDROGEN]: 1000,
        [RESOURCE_OXYGEN]: 1000,
        [RESOURCE_UTRIUM]: 1000,
        [RESOURCE_LEMERGIUM]: 1000,
        [RESOURCE_KEANIUM]: 1000,
        [RESOURCE_ZYNTHIUM]: 1000,
        [RESOURCE_CATALYST]: 1000,
        [RESOURCE_GHODIUM]: 1000,

        [RESOURCE_REDUCTANT]: 500,
        [RESOURCE_OXIDANT]: 500,
        [RESOURCE_UTRIUM_BAR]: 500,
        [RESOURCE_LEMERGIUM_BAR]: 500,
        [RESOURCE_KEANIUM_BAR]: 500,
        [RESOURCE_ZYNTHIUM_BAR]: 500,
        [RESOURCE_PURIFIER]: 500,
        [RESOURCE_GHODIUM_MELT]: 500,

        [RESOURCE_METAL]: 200,
        [RESOURCE_BIOMASS]: 200,
        [RESOURCE_SILICON]: 200,
        [RESOURCE_MIST]: 200,

        [RESOURCE_WIRE]: 117,
        [RESOURCE_CELL]: 310,
        [RESOURCE_ALLOY]: 41,
        [RESOURCE_CONDENSATE]: 30,

        [RESOURCE_COMPOSITE]: 50,
        [RESOURCE_CRYSTAL]: 110,
        [RESOURCE_LIQUID]: 150,

        // 1
        [RESOURCE_SWITCH]: 4,
        [RESOURCE_TUBE]: 15,
        [RESOURCE_PHLEGM]: 10,
        [RESOURCE_CONCENTRATE]: 10,

        // 2
        [RESOURCE_TRANSISTOR]: 5,
        [RESOURCE_TISSUE]: 6,
        [RESOURCE_FIXTURES]: 5,
        [RESOURCE_EXTRACT]: 2,

        // 3
        [RESOURCE_MICROCHIP]: 3,
        [RESOURCE_MUSCLE]: 1,
        [RESOURCE_FRAME]: 2,
        [RESOURCE_SPIRIT]: 3,

        // 4
        [RESOURCE_CIRCUIT]: 1,
        [RESOURCE_ORGANOID]: 1,
        [RESOURCE_HYDRAULICS]: 1,
        [RESOURCE_EMANATION]: 1,

        // 5
        [RESOURCE_DEVICE]: 1,
        [RESOURCE_ORGANISM]: 1,
        [RESOURCE_MACHINE]: 1,
        [RESOURCE_ESSENCE]: 1,
    }
};

const STANDARD_RESOURCE_LIMIT = 3000;



//===========================================================================
// RoomObject
//===========================================================================

// properties

Object.defineProperties(RoomObject.prototype, {

    /**
     * @type {Object}
     * @memberof RoomObject.prototype
     */
    memory: {
        get: function() {
            if (this._memory === undefined) {
                const path = `objects[${this.id}]`;

                this._memory = _.get(this.room.memory, path);

                if (this._memory === undefined) {
                    _.set(this.room.memory, path, {});

                    this._memory = _.get(this.room.memory, path);
                }
            }

            return this._memory;
        },
        set: function(value) {
            _.set(this.room.memory, `objects[${this.id}]`, value);
        }
    }

});

// methods

/**
 * @param {number} effect
 * @returns {boolean}
 */
RoomObject.prototype.hasEffect = function(effect) {
    return !!this.getEffect(effect);
};

/**
 * @param {number} effect
 * @returns {{ effect: number, level: number, ticksRemaining: number } | null}
 */
RoomObject.prototype.getEffect = function(effect) {
    if (this.effects === undefined) {
        return null;
    }

    if (this._effects === undefined) {
        this._effects = {};
    }

    if (this._effects[effect] === undefined) {
        this._effects[effect] = this.effects.find(e => e.effect === effect) || null;
    }

    return this._effects[effect];
};

/**
 * @param {string} resourceType
 * @returns {number}
 */
RoomObject.prototype.getResourceAmount = function(resourceType) {
    if (this.store[resourceType] === 0) {
        return 0;
    }

    return this.store[resourceType] - this.getRequestedResource(resourceType);
};

/**
 * @param {Object} params
 *
 * @param {string} params.creep
 * @param {string} params.resourceType
 * @param {number} params.amount
 *
 * @returns {number}
 */
RoomObject.prototype.requestResource = function({ creep, resourceType, amount }) {
    const requests = this.memory.resources || [];
    const request = { creep, resourceType, amount };

    requests.push(request);

    this.memory.resources = requests;

    return request;
};

/**
 * @param {Object} params
 *
 * @param {string} params.creep
 * @param {string} params.resourceType
 * @param {number} params.amount
 *
 * @returns {number}
 */
RoomObject.prototype.releaseResource = function({ creep, resourceType, amount }) {
    const request = _.find(this.memory.resources, { creep, resourceType });

    if (!request) {
        return ERR_NOT_FOUND;
    }

    if (request.amount > amount) {
        request.amount -= amount;
    } else {
        _.pull(this.memory.resources, request);
    }

    return OK;
};

/**
 * @param {string} resourceType
 * @returns {number}
 */
RoomObject.prototype.getRequestedResource = function(resourceType) {
    return _.reduce(this.memory.resources,
        (acc, request) =>
            ((request.resourceType === resourceType && !!Game.creeps[request.creep])
                ? acc + request.amount : acc), 0);
};

RoomObject.prototype.checkResources = function() {
    const requests = _.filter(this.memory.resources, request => !!Game.creeps[request.creep]);

    if (requests.length > 0) {
        this.memory.resources = requests;
    } else {
        delete this.memory.resources;
    }
};

RoomObject.prototype.checkMemory = function() {
    this.checkResources();
};



//===========================================================================
// Ruin
//===========================================================================

/**
 * @returns {boolean}
 */
Ruin.prototype.isEmpty = function() {
    return Object.keys(this.store).length === 0;
};

/**
 * @returns {boolean}
 */
Ruin.prototype.isFull = function() {
    return true;
};



//===========================================================================
// Tombstone
//===========================================================================

Tombstone.prototype.isEmpty = Ruin.prototype.isEmpty;
Tombstone.prototype.isFull = Ruin.prototype.isFull;



//===========================================================================
// Structure
//===========================================================================

// properties

Object.defineProperties(Structure.prototype, {

    /**
     * @readonly
     * @type {boolean}
     * @memberof Structure.prototype
     */
    rechargable: {
        get: function() {
            if (this._rechargable === undefined) {
                this._rechargable = !!this.store && this.store.getCapacity() === null;
            }

            return this._rechargable;
        }
    }

});

// methods

/**
 * @returns {boolean}
 */
Structure.prototype.isWalkable = function() {
    if (this.structureType === STRUCTURE_ROAD || this.structureType === STRUCTURE_CONTAINER) {
        return true;
    }

    if (this.structureType === STRUCTURE_RAMPART) {
        return this.my || this.isPublic;
    }

    return false;
};

/**
 * @returns {boolean}
 */
Structure.prototype.isEmpty = function() {
    if (this._isEmpty === undefined) {
        const capacity = this.store.getCapacity();

        if (capacity === null) {
            this._isEmpty = Object.keys(this.store).length === 0;
        } else {
            this._isEmpty = this.store.getFreeCapacity() === capacity;
        }
    }

    return this._isEmpty;
};

/**
 * @returns {boolean}
 */
Structure.prototype.isFull = function() {
    if (this._isFull === undefined) {
        const capacity = this.store.getCapacity();

        if (capacity === null) {
            this._isFull = !Object.keys(this.store).some(resourceType => this.store.getFreeCapacity(resourceType) > 0);
        } else {
            this._isFull = this.store.getFreeCapacity() <= 0;
        }
    }

    return this._isFull;
};

/**
 * @param {string} resourceType
 * @returns {number}
 */
Structure.prototype.getRequestedCapacity = function(resourceType) {
    return _.reduce(this.memory.capacity,
        (acc, request) =>
            (request.resourceType === resourceType && !!Game.creeps[request.creep]
                ? acc + request.amount : acc), 0);
};

/**
 * @param {string} resourceType
 * @returns {number}
 */
Structure.prototype.getCapacity = function(resourceType) {
    const store = this.store[resourceType];
    const limit = this.getLimit(resourceType);

    if (store >= limit) {
        return limit - store;
    }

    const requiredResource = limit - store;
    let freeCapacity = this.store.getFreeCapacity(resourceType) - this.getRequestedCapacity(resourceType);

    if (resourceType !== RESOURCE_ENERGY && this.structureType !== STRUCTURE_STORAGE && this.store.getCapacity() !== null && this.store.getCapacity(RESOURCE_ENERGY) > 0) {
        freeCapacity -= (this.getLimit(RESOURCE_ENERGY) - this.store[RESOURCE_ENERGY]);
    }

    if (freeCapacity <= 0) {
        return freeCapacity;
    }

    return Math.min(requiredResource, freeCapacity);
};

/**
 * @param {Object} params
 *
 * @param {string} params.creep
 * @param {string} params.resourceType
 * @param {number} params.amount
 *
 * @returns {number}
 */
Structure.prototype.requestCapacity = function({ creep, resourceType, amount }) {
    const requests = this.memory.capacity || [];
    const request = { creep, resourceType, amount };

    requests.push(request);

    this.memory.capacity = requests;

    return request;
};

/**
 * @param {Object} params
 *
 * @param {string} params.creep
 * @param {string} params.resourceType
 * @param {number} params.amount
 *
 * @returns {number}
 */
Structure.prototype.releaseCapacity = function({ creep, resourceType, amount }) {
    const request = _.find(this.memory.capacity, { creep, resourceType });

    if (!request) {
        return ERR_NOT_FOUND;
    }

    if (request.amount > amount) {
        request.amount -= amount;
    } else {
        _.pull(this.memory.capacity, request);
    }

    return OK;
};

/**
 * @param {string} resourceType
 * @returns {number}
 */
Structure.prototype.getLimit = function(resourceType) {
    const limit = _.get(LIMITS, [this.structureType, resourceType]);

    if (Number.isFinite(limit)) {
        return limit;
    }

    if (resourceType === RESOURCE_ENERGY || this.structureType === STRUCTURE_STORAGE) {
        return this.store.getCapacity(resourceType);
    }

    const capacity = this.store.getCapacity();

    if (capacity === null) {
        return this.store.getCapacity(resourceType) || 0;
    }

    return Math.min(STANDARD_RESOURCE_LIMIT, capacity);
};

Structure.prototype.checkCapacity = function() {
    const requests = _.filter(this.memory.capacity, (request) => !!Game.creeps[request.creep]);

    if (requests.length > 0) {
        this.memory.capacity = requests;
    } else {
        delete this.memory.capacity;
    }
};

Structure.prototype.checkMemory = function() {
    RoomObject.prototype.checkMemory.call(this);
    this.checkCapacity();
};



//===========================================================================
// StructureController
//===========================================================================

Object.defineProperties(StructureController.prototype, {

    /**
     * @readonly
     * @type {StructureLink}
     * @memberof StructureController.prototype
     */
    link: {
        get: function() {
            if (this.room.my && this.room.level < 5) {
                return null;
            }

            if (this._link === undefined) {
                const linkId = this.room.cache.get('controllerLink', () => {
                     const link = this.pos.findInRange(this.room.links, 3)[0];

                     return link ? link.id : null;
                });

                this._link = Game.getObjectById(linkId);
            }

            return this._link;
        }
    }

});



//===========================================================================
// StructureLab
//===========================================================================

/**
 * @override
 * @returns {boolean}
 */
StructureLab.prototype.isEmpty = function() {
    return this.mineralType === undefined && this.store[RESOURCE_ENERGY] === 0;
};

/**
 * @override
 * @returns {boolean}
 */
StructureLab.prototype.isFull = function() {
    if (this.mineralType !== undefined && this.store.getFreeCapacity(this.mineralType) > 0) {
        return false;
    }

    if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        return false;
    }

    return true;
};



//===========================================================================
// StructureNuker
//===========================================================================

/**
 * @override
 * @returns {boolean}
 */
StructureNuker.prototype.isEmpty = function() {
    return this.store[RESOURCE_GHODIUM] === 0 && this.store[RESOURCE_ENERGY] === 0;
};

/**
 * @override
 * @returns {boolean}
 */
StructureNuker.prototype.isFull = function() {
    return this.store.getFreeCapacity(RESOURCE_GHODIUM) === 0
        && this.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
};



//===========================================================================
// StructureObserver
//===========================================================================

/**
 * @param {string} room
 * @param {number} [ticks=1]
 * @returns {Boolean}
 */
StructureObserver.prototype.requestRoom = function(room, ticks = 1) {
    if (!this.my) {
        return false;
    }

    if (this.memory.request) {
        return this.memory.request.room === room;
    }

    if (!this.hasEffect(PWR_OPERATE_OBSERVER) && Game.map.getRoomLinearDistance(this.room.name, room) > OBSERVER_RANGE) {
        return false;
    }

    this.memory.request = { room, ticks };

    return true;
};



//===========================================================================
// StructurePowerSpawn
//===========================================================================

/**
 * @override
 * @returns {boolean}
 */
StructurePowerSpawn.prototype.isEmpty = function() {
    return this.store[RESOURCE_POWER] === 0 && this.store[RESOURCE_ENERGY] === 0;
};

/**
 * @override
 * @returns {boolean}
 */
StructurePowerSpawn.prototype.isFull = function() {
    return this.store.getFreeCapacity(RESOURCE_POWER) === 0
        && this.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
};



//===========================================================================
// StructureTerminal
//===========================================================================

/**
 * @param {string} destination
 * @returns {number}
 */
StructureTerminal.prototype.getEnergyForTransfer = function(destination) {
    const distance = Game.map.getRoomLinearDistance(this.room.name, destination, true);
    const effect = this.getEffect(PWR_OPERATE_TERMINAL);
    let multiplier = 1;

    if (effect) {
        multiplier = POWER_INFO[PWR_OPERATE_TERMINAL].effect[effect.level - 1];
    }

    return Math.floor(
        this.store[RESOURCE_ENERGY] / (2 - Math.exp(-distance / 30 * multiplier)));
};

/**
 * @returns {boolean}
 */
StructureTerminal.prototype.isSending = function() {
    return this._sending;
};

/**
 * @param {string} resourceType
 * @param {number} amount
 * @param {string} destination
 * @param {Object} [options={}]
 *
 * @param {boolean} [options.log=true]
 * @param {string} [options.description]
 * @param {boolean} [options.createTask]
 * @param {string} [options.initiator]
 *
 * @returns {number}
 */
StructureTerminal.prototype.transfer = function(resourceType, amount, destination, options = {}) {
    if (!this.my) {
        return ERR_NOT_OWNER;
    }

    _.defaults(options, { log: true });

    if (this.cooldown > 0 || this.isSending()) {
        if (options.createTask) {
            this.addTask(destination, resourceType, amount, options);
        }

        return ERR_TIRED;
    }

    if (!amount) {
        if (resourceType === RESOURCE_ENERGY) {
            amount = this.getEnergyForTransfer(destination);
        } else {
            amount = this.store[resourceType];
        }
    } else if (amount > 0 && amount < 1) {
        amount = this.store[resourceType] * amount;
    }

    if (amount <= 0) {
        if (options.log) {
            console.log('Terminal in the room ' + linkRoom(this.room.name) + ' do not have ' + resourceImg(resourceType));
        }

        return ERR_NOT_ENOUGH_RESOURCES;
    }

    const result = this.send(resourceType, amount, destination, options.description);

    if (result === OK) {
        this._sending = true;

        if (options.log) {
            const cost = Market.cost(amount, this.room.name, destination);
            let message = `Transferred ${amount} ${resourceImg(resourceType)} from ${linkRoom(this.room)} to ${linkRoom(destination)}. Cost: ${cost}`;

            if (options.initiator) {
                message += `. Initiator: ${options.initiator}`;
            }

            console.log(message);
        }
    } else if (options.log && result === ERR_NOT_ENOUGH_RESOURCES) {
        const transferCost = Market.cost(amount, this.room.name, destination);

        console.log('Not enough resources. In the terminal of room ' + linkRoom(this.room.name) + ' is stored ' + this.store[resourceType] + ' ' + resourceImg(resourceType) + ' (cost for ' + amount + ': ' + transferCost + ')');
    } else if (options.createTask && result === ERR_TIRED) {
        this.addTask(destination, resourceType, amount, options);
    }

    return result;
};

/**
 * @param {string} room
 * @param {string} resourceType
 * @param {number} amount
 * @param {Object} [options={}]
 */
StructureTerminal.prototype.addTask = function(room, resourceType, amount, options = {}) {
    if (!this.memory.queue) {
        this.memory.queue = [];
    }

    this.memory.queue.push({ room, resourceType, amount, options });

    console.log('Created a new terminal task for ' + amount + ' ' + resourceImg(resourceType) + ' from ' + linkRoom(this.room.name) + ' to ' + linkRoom(room));
};

/**
 * @param {string} [resourceType=RESOURCE_ENERGY]
 * @param {number} [amount=1000]
 * @param {Object} [options={}]
 *
 * @param {number} [options.minAmount]
 * @param {number} [options.minStore]
 *
 * @returns {number}
 */
StructureTerminal.prototype.requireResource = function(resourceType = RESOURCE_ENERGY, amount = 1000, options = {}) {
    if (!amount) {
        return (this.memory.requiredResources || []).length;
    }

    const requiredResources = this.memory.requiredResources || [];

    if (Array.isArray(resourceType)) {
        resourceType.forEach(resource => this.requireResource(resource, amount, options));

        return this.memory.requiredResources.length;
    } else if (Array.isArray(Resource[resourceType])) {
        Resource[resourceType].forEach(resource => this.requireResource(resource, amount, options));

        return this.memory.requiredResources.length;
    }

    resourceType = global.getResourceType(resourceType);

    const data = requiredResources.find(d => d.resourceType === resourceType);

    if (data) {
        data.amount += amount;

        console.log(`Added required resource ${amount} (total: ${data.amount}) ${resourceImg(resourceType)} to ${this.room.name}`);
    } else {
        requiredResources.push({ resourceType, amount, options });

        console.log(`Required ${amount} ${resourceImg(resourceType)} to ${this.room.name}`);
    }

    this.memory.requiredResources = requiredResources;

    return requiredResources.length;
};

/**
 * @param {boolean} value
 */
StructureTerminal.prototype.setSending = function(value) {
    this._sending = value;
};

StructureTerminal.prototype.processTasks = function() {
    if (!this.my || this.cooldown > 0 || this.isSending()) {
        return false;
    }

    const queue = _.filter(this.memory.queue, (task) => {
        if (task.options.expiredAt > Game.time) {
            return false;
        }

        return true;
    });

    let transferred = false;

    for (let i = 0; i < queue.length; i++) {
        const task = queue[i];

        if (this.store[task.resourceType] === 0) {
            continue;
        }

        const room = Game.rooms[task.room];
        let amount = Math.min(task.amount, this.store[task.resourceType]);

        if (room) {
            const terminal = room.terminal;

            if (!terminal) {
                continue;
            }

            const freeCapacity = terminal.store.getFreeCapacity();

            if (freeCapacity === 0) {
                continue;
            }

            if (amount > freeCapacity) {
                amount = freeCapacity;
            }
        }

        if (this.transfer(task.resourceType, amount, task.room, { ...task.options, createTask: false, initiator: 'task' }) === OK) {
            if (task.amount > amount) {
                task.amount -= amount;

                console.log(`Remaining amount ${task.amount} ${resourceImg(task.resourceType)} from ${linkRoom(this.room.name)} to ${linkRoom(task.room)}`);
            } else {
                _.pull(queue, task);

                console.log(`Completed task for ${amount} ${resourceImg(task.resourceType)} from ${linkRoom(this.room.name)} to ${linkRoom(task.room)}`);
            }

            transferred = true;

            break;
        }
    }

    this.memory.queue = queue;

    return transferred;
};

// TODO: перенести в Shard
StructureTerminal.prototype.processRequiredResources = function() {
    const requiredResources = this.memory.requiredResources;

    if (!requiredResources || requiredResources.length === 0) {
        return;
    }

    const myRooms = Shard.myRooms.filter(room =>
        room !== this.room && room.level === 8 && room.terminal && room.terminal.my
        && room.terminal.cooldown === 0 && !room.terminal.isSending());

    let freeCapacity = this.store.getFreeCapacity();

    if (freeCapacity === 0) {
        return;
    }

    for (let i = 0; i < requiredResources.length; i++) {
        const data = requiredResources[i];
        const resourceType = data.resourceType;
        const limit = this.getLimit(resourceType);
        const store = _.clone(this.store);
        const rooms = myRooms.filter((room) => {
            if (resourceType === RESOURCE_ENERGY && room.store[RESOURCE_ENERGY] < 50000) {
                return false;
            }

            if (room.store[resourceType] < (data.options.minStore || 1)) {
                return false;
            }

            if (room.terminal.isRequiredResource(resourceType)) {
                return false;
            }

            const resourceAmount = room.terminal.getResourceAmount(resourceType);
            const minAmount = data.options.minAmount || 1;

            return resourceAmount >= minAmount;
        }).sort((a, b) => b.store[resourceType] - a.store[resourceType]);

        for (let j = 0; j < rooms.length; j++) {
            const room = rooms[j];
            let amount = Math.min(
                (resourceType === RESOURCE_ENERGY ? limit / 2 : limit),
                data.amount,
                limit * 2 - (store[resourceType] || 0),
                freeCapacity,
                room.terminal.getResourceAmount(resourceType));

            if (amount <= 0) {
                break;
            }

            if (resourceType === RESOURCE_ENERGY && amount < 1000 && data.amount >= 1000) {
                break;
            }

            if (room.terminal.transfer(resourceType, amount, this.room.name) === OK) {
                if (data.amount === amount) {
                    console.log(`Completed required resource: ${amount} ${resourceImg(resourceType)}`);

                    _.pull(requiredResources, data);
                    _.pull(myRooms, room);

                    if (myRooms.length === 0) {
                        return;
                    }

                    i--;
                    freeCapacity -= amount;

                    if (store[resourceType] > 0) {
                        store[resourceType] += amount;
                    } else {
                        store[resourceType] = amount;
                    }

                    if (freeCapacity === 0) {
                        return;
                    }

                    break;
                } else {
                    data.amount -= amount;
                    freeCapacity -= amount;

                    if (store[resourceType] > 0) {
                        store[resourceType] += amount;
                    } else {
                        store[resourceType] = amount;
                    }
                }

                console.log(`Remaining required resource: ${data.amount} ${resourceImg(resourceType)}`);

                if (freeCapacity === 0) {
                    return;
                }
            }
        }
    }

    if (requiredResources.length > 0) {
        this.memory.requiredResources = requiredResources;
    } else {
        delete this.memory.requiredResources;
    }
};

StructureTerminal.prototype.isRequiredResource = function(resourceType) {
    return _.some(this.memory.requiredResources, data => data.resourceType === resourceType);
};



//===========================================================================
// StructureTower
//===========================================================================

/**
 * @param {Creep | PowerCreep} creep
 * @returns {number}
 */
StructureTower.prototype.getAttackEfficiency = function(creep) {
    let range = Math.max(Math.abs(creep.pos.x - this.pos.x), Math.abs(creep.pos.y - this.pos.y));
    let amount = TOWER_POWER_ATTACK;

    if (range > TOWER_OPTIMAL_RANGE) {
        if (range > TOWER_FALLOFF_RANGE) {
            range = TOWER_FALLOFF_RANGE;
        }

        amount -= amount * TOWER_FALLOFF * (range - TOWER_OPTIMAL_RANGE)
            / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE) ;
    }

    [PWR_OPERATE_TOWER, PWR_DISRUPT_TOWER].forEach((power) => {
        const effect = this.getEffect(power);

        if (effect) {
            amount *= POWER_INFO[power].effect[effect.level - 1];
        }
    });

    return Math.floor(amount);
};

/**
 * @param {Creep | PowerCreep} creep
 * @returns {number}
 */
StructureTower.prototype.getHealEfficiency = function(creep) {
    let range = Math.max(Math.abs(creep.pos.x - this.pos.x), Math.abs(creep.pos.y - this.pos.y));
    let amount = TOWER_POWER_HEAL;

    if (range > TOWER_OPTIMAL_RANGE) {
        if (range > TOWER_FALLOFF_RANGE) {
            range = TOWER_FALLOFF_RANGE;
        }

        amount -= amount * TOWER_FALLOFF * (range - TOWER_OPTIMAL_RANGE)
            / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE);
    }

    [PWR_OPERATE_TOWER, PWR_DISRUPT_TOWER].forEach((power) => {
        const effect = this.getEffect(power);

        if (effect) {
            amount *= POWER_INFO[power].effect[effect.level - 1];
        }
    });

    return Math.floor(amount);
};

/**
 * @param {Structure} target
 * @returns {number}
 */
StructureTower.prototype.getRepairEfficiency = function(target) {
    let range = Math.max(Math.abs(target.pos.x - this.pos.x), Math.abs(target.pos.y - this.pos.y));
    let amount = TOWER_POWER_REPAIR;

    if (range > TOWER_OPTIMAL_RANGE) {
        if (range > TOWER_FALLOFF_RANGE) {
            range = TOWER_FALLOFF_RANGE;
        }

        amount -= amount * TOWER_FALLOFF * (range - TOWER_OPTIMAL_RANGE)
            / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE);
    }

    [PWR_OPERATE_TOWER, PWR_DISRUPT_TOWER].forEach((power) => {
        const effect = this.getEffect(power);

        if (effect) {
            amount *= POWER_INFO[power].effect[effect.level - 1];
        }
    });

    return Math.floor(amount);
};



//===========================================================================
// Creep
//===========================================================================

// properties

Object.defineProperties(Creep.prototype, {
    role: {
        get: function () {
            return this.memory.role || this.nameParts[0];
        },
        set: function (value) {
            this.memory.role = value;
        },
        configurable: true
    },
    initialRole: {
        get: function () {
            return this.memory.initRole || this.role;
        },
        set: function (value) {
            this.memory.initRole = value;
        },
        configurable: true
    },
    initialRoom: {
        get: function () {
            return this.memory.initRoom || this.room.name;
        },
        set: function (value) {
            this.memory.initRoom = value;
        },
        configurable: true
    },
    targetFlag: {
        get: function () {
            return this.memory.targetFlag;
        },
        set: function (value) {
            this.memory.targetFlag = value;
        },
        configurable: true
    },
    getterType: {
        get: function () {
            return this.memory.getterType;
        },
        set: function (value) {
            this.memory.getterType = global.getResourceType(value);
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {string[]}
     * @memberof {Creep.prototype}
     */
    nameParts: {
        get: function() {
            if (this._nameParts === undefined) {
                this._nameParts = this.name.split('-');

                this._nameParts[this._nameParts.length - 1] = this._nameParts[this._nameParts.length - 1].split(' ')[0];
            }

            return this._nameParts;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {number}
     * @memberof Creep.prototype
     */
    fatigueRestore: {
        get: function() {
            if (this._fatigueRestore === undefined) {
                const move = this.getActiveBodyparts(MOVE);
                const boosted = this.getBoostedBodyparts(MOVE);

                this._fatigueRestore =
                    boosted.reduce((acc, part) => acc + (MOVE_FATIGUE_RESTORE * BOOSTS[MOVE][part.boost].fatigue), 0)
                    + (move - boosted.length) * MOVE_FATIGUE_RESTORE;
            }

            return this._fatigueRestore;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {number}
     * @memberof Creep.prototype
     */
    fatigueUses: {
        get: function() {
            if (this._fatigueUses === undefined) {
                this._fatigueUses = this.body.reduce((acc, part) => {
                    if (part.type === CARRY || part.type === MOVE) {
                        return acc;
                    }

                    return acc + BODYPART_FATIGUE_USE;
                }, 0) + this.getUsedCarryParts() * BODYPART_FATIGUE_USE;
            }

            return this._fatigueUses;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {number}
     * @memberof Creep.prototype
     */
    buildEfficiency: {
        get: function() {
            if (this._buildEfficiency === undefined) {
                const work = this.getActiveBodyparts(WORK);

                if (work === 0) {
                    this._buildEfficiency = 0;

                    return this._buildEfficiency;
                }

                const boosted = this.getBoostedBodyparts(WORK);

                this._buildEfficiency =
                    boosted.reduce((acc, part) => acc + BUILD_POWER * (BOOSTS[WORK][part.boost].build || 1), 0)
                    + BUILD_POWER * (work - boosted.length);
            }

            return this._buildEfficiency;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {number}
     * @memberof Creep.prototype
     */
    harvestEfficiency: {
        get: function() {
            if (this._harvestEfficiency === undefined) {
                const work = this.getActiveBodyparts(WORK);

                if (work === 0) {
                    this._harvestEfficiency = 0;

                    return this._harvestEfficiency;
                }

                const boosted = this.getBoostedBodyparts(WORK);

                this._harvestEfficiency =
                    boosted.reduce((acc, part) => acc + HARVEST_POWER * (BOOSTS[WORK][part.boost].harvest || 1), 0)
                    + HARVEST_POWER * (work - boosted.length);
            }

            return this._harvestEfficiency;
        },
        configurable: true
    }

});

// methods

/**
 * @returns {boolean}
 */
Creep.prototype.isDangerous = function() {
    return this.getActiveBodyparts(ATTACK) + this.getActiveBodyparts(RANGED_ATTACK) > 0;
};

/**
 * @returns {boolean}
 */
Creep.prototype.isInvader = function() {
    return this.owner.username === INVADER_USERNAME;
};

/**
 * @returns {boolean}
 */
Creep.prototype.isSourceKeeper = function() {
    return this.owner.username === SOURCE_KEEPER_USERNAME;
};

/**
 * @returns {boolean}
 */
Creep.prototype.isNPC = function() {
    return this.isInvader() || this.isSourceKeeper();
};

/**
 * @returns {boolean}
 */
Creep.prototype.isEmpty = function() {
    if (this._isEmpty === undefined) {
        this._isEmpty = this.store.getUsedCapacity() === 0;
    }

    return this._isEmpty;
};

/**
 * @returns {boolean}
 */
Creep.prototype.isFull = function() {
    if (this._isFull === undefined) {
        this._isFull = this.store.getFreeCapacity() === 0;
    }

    return this._isFull;
};

/**
 * @param {number} duration
 */
Creep.prototype.wait = function(duration) {
    this.memory.w = duration || 0;
};

/**
 * @returns {boolean}
 */
Creep.prototype.isWaiting = function() {
    return this.memory.w > 0;
};

/**
 * @param {string} bodypart
 * @returns {{ type: string, boost: string, hits: number}[]}
 */
Creep.prototype.getBoostedBodyparts = function(bodypart) {
    if (this.__body === undefined) {
        this.__body = this.body.reduce((acc, part) => {
            if (part.boost === undefined || part.hits === 0) {
                return acc;
            }

            if (!acc[part.type]) {
                acc[part.type] = [];
            }

            acc[part.type].push(part);

            return acc;
        }, {});
    }

    return this.__body[bodypart] || [];
};

Creep.prototype.getUsedCarryParts = function() {
    if (this._usedCarryParts === undefined) {
        this._usedCarryParts = 0;

        const store = this.store.getUsedCapacity();

        if (store === 0) {
            return 0;
        }

        this._usedCarryParts = Math.ceil(store / CARRY_CAPACITY);
    }

    return this._usedCarryParts;
};

Creep.prototype.getEmptyCarryParts = function() {
    if (this._emptyCarryParts === undefined) {
        this._emptyCarryParts = this.getActiveBodyparts(CARRY) - this.getUsedCarryParts();
    }

    return this._emptyCarryParts;
};

Creep.prototype.canOffRoad = function() {
    return this.fatigueRestore >= this.fatigueUses * SWAMP_FATIGUE_RATIO;
};

Creep.prototype.canIgnoreRoads = function() {
    return this.fatigueRestore >= this.fatigueUses * PLAIN_FATIGUE_RATIO;
};

Creep.prototype.canSwap = function() {
    if (!this.my || this._swapped || this.fatigue > 0) {
        return false;
    }

    const role = this.role;

    if (role === 'central') {
        return false;
    }

    return (this.isWaiting() || ['carrier', 'getter', 'carrierRoom', 'builder', 'ramparter', 'recycler'].includes(role) || this.name.startsWith('caravan'))
        && !this.pos.isBorder();
};

Creep.prototype.swap = function(creep, direction1, nextPos) {
    if (this.move(direction1) !== OK) {
        return false;
    }

    if (creep.move(nextPos.getDirectionTo(this.pos)) !== OK) {
        return false;
    }

    this._swapped = true;
    creep._swapped = true;

    this.say('swap');
    creep.say('swap');

    return true;
};



//===========================================================================
// PowerCreep
//===========================================================================

PowerCreep.prototype.isEmpty = Creep.prototype.isEmpty;
PowerCreep.prototype.isFull = Creep.prototype.isFull;
PowerCreep.prototype.isWaiting = Creep.prototype.isWaiting;
PowerCreep.prototype.wait = Creep.prototype.wait;
PowerCreep.prototype.swap = Creep.prototype.swap;

PowerCreep.prototype.canSwap = function() {
    return this.my && !this._swapped;
};



//===========================================================================
// ConstructionSite
//===========================================================================

/**
 * @returns {boolean}
 */
ConstructionSite.prototype.isWalkable = function() {
    if (!this.my) {
        return true;
    }

    return [STRUCTURE_ROAD, STRUCTURE_RAMPART, STRUCTURE_CONTAINER].includes(this.structureType);
};



//===========================================================================
// Resource
//===========================================================================

// static properties

Resource.T0 = [RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_LEMERGIUM,
    RESOURCE_KEANIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST];
Resource.T1 = ['UH', 'UO', 'LH', 'LO', 'KH', 'KO', 'ZH', 'ZO', 'GH', 'GO', 'OH', 'UL', 'ZK'];
Resource.T2 = ['UH2O', 'UHO2', 'LH2O', 'LHO2', 'KH2O', 'KHO2', 'ZH2O', 'ZHO2', 'GH2O', 'GHO2'];
Resource.FACTORY_MINERALS = [RESOURCE_METAL, RESOURCE_BIOMASS, RESOURCE_SILICON, RESOURCE_MIST];
Resource.COMMODITIES = [RESOURCE_UTRIUM_BAR, RESOURCE_LEMERGIUM_BAR, RESOURCE_ZYNTHIUM_BAR,
    RESOURCE_KEANIUM_BAR, RESOURCE_GHODIUM_MELT, RESOURCE_OXIDANT, RESOURCE_REDUCTANT,
    RESOURCE_PURIFIER];
Resource.COMMODITIES1 = [RESOURCE_COMPOSITE];
Resource.COMMODITIES2 = [RESOURCE_CRYSTAL];
Resource.COMMODITIES3 = [RESOURCE_LIQUID];
Resource.COMMON_COMMODITIES = [RESOURCE_COMPOSITE, RESOURCE_CRYSTAL, RESOURCE_LIQUID];
Resource.FACTORIES0 = [RESOURCE_ALLOY, RESOURCE_WIRE, RESOURCE_CELL, RESOURCE_CONDENSATE];
Resource.FACTORIES1 = [RESOURCE_TUBE, RESOURCE_SWITCH, RESOURCE_PHLEGM, RESOURCE_CONCENTRATE];
Resource.FACTORIES2 = [RESOURCE_FIXTURES, RESOURCE_TRANSISTOR, RESOURCE_TISSUE, RESOURCE_EXTRACT];
Resource.FACTORIES3 = [RESOURCE_FRAME, RESOURCE_MICROCHIP, RESOURCE_MUSCLE, RESOURCE_SPIRIT];
Resource.FACTORIES4 = [RESOURCE_HYDRAULICS, RESOURCE_CIRCUIT, RESOURCE_ORGANOID, RESOURCE_EMANATION];
Resource.FACTORIES5 = [RESOURCE_MACHINE, RESOURCE_DEVICE, RESOURCE_ORGANISM, RESOURCE_ESSENCE];
Resource.MECHANICAL = [RESOURCE_TUBE, RESOURCE_FIXTURES, RESOURCE_FRAME, RESOURCE_HYDRAULICS, RESOURCE_MACHINE];
Resource.BIOLOGICAL = [RESOURCE_PHLEGM, RESOURCE_TISSUE, RESOURCE_MUSCLE, RESOURCE_ORGANOID, RESOURCE_ORGANISM];
Resource.ELECTRONICAL = [RESOURCE_SWITCH, RESOURCE_TRANSISTOR, RESOURCE_MICROCHIP, RESOURCE_CIRCUIT, RESOURCE_DEVICE];
Resource.MYSTICAL = [RESOURCE_CONCENTRATE, RESOURCE_EXTRACT, RESOURCE_SPIRIT, RESOURCE_EMANATION, RESOURCE_ESSENCE];

// static properties

Object.defineProperties(Resource, {

    /**
     * @readonly
     * @type {string[]}
     * @memberof Resource
     */
    FACTORIES: {
        get: function() {
            if (this._FACTORIES === undefined) {
                this._FACTORIES = _.reduce(COMMODITIES, (acc, data, resourceType) => {
                    if (resourceType === RESOURCE_COMPOSITE || resourceType === RESOURCE_CRYSTAL || resourceType === RESOURCE_LIQUID) {
                        return acc;
                    }

                    if (data.level >= 0) {
                        acc.push(resourceType);
                    }

                    return acc;
                }, []);
            }

            return this._FACTORIES;
        }
    }

});

// properties

Object.defineProperties(Resource.prototype, {

    /**
     * @readonly
     * @type {number}
     * @memberof Resource.prototype
     */
    ticksToDecay: {
        get: function() {
            if (this._ticksToDecay === undefined) {
                let amount = this.amount;
                let ticks = 0;

                for (let decay = Math.ceil(amount / 1000); decay > 0; decay--) {
                    const remainder = (amount - 1) % 1000 + 1;
                    const ticksToJump = Math.ceil(remainder / decay) || 1;

                    ticks += ticksToJump;
                    amount -= ticksToJump * decay;
                }

                this._ticksToDecay = ticks;
            }

            return this._ticksToDecay;
        }
    }

});

// static methods

/**
 * @static
 * @param {string} value
 * @returns {boolean}
 */
Resource.isResource = function(value) {
    return RESOURCES_ALL.includes(value);
};

// methods

/**
 * @override
 * @param {string} resourceType
 * @returns {number}
 */
Resource.prototype.getResourceAmount = function(resourceType) {
    if (this.resourceType !== resourceType) {
        return 0;
    }

    return this.amount - this.getRequestedResource(this.resourceType);
};



//===========================================================================
// Store
//===========================================================================

Object.defineProperties(Store.prototype, {

    /**
     * @readonly
     * @type {Object}
     * @memberof {Store.prototype}
     */
    forecasted: {
        get: function() {
            if (this._forecasted === undefined) {
                this._forecasted = RESOURCES_ALL.reduce((acc, resourceType) => {
                    acc[resourceType] = this[resourceType];

                    return acc;
                }, {});
            }

            return this._forecasted;
        }
    }

});

/**
 * @deprecated
 * @returns {boolean}
 */
Store.prototype.isEmpty = function() {
    if (this._isEmpty === undefined) {
        const capacity = this.getCapacity();
        let isEmpty;

        if (capacity === null) {
            isEmpty = Object.keys(this).length === 0;
        } else {
            isEmpty = this.getFreeCapacity() === capacity;
        }

        Object.defineProperty(this, '_isEmpty', {
            value: isEmpty,
            enumerable: false
        });

        return isEmpty;
    }

    return this._isEmpty;
};

/**
 * @deprecated
 * @returns {boolean}
 */
Store.prototype.isFull = function() {
    if (this._isFull === undefined) {
        const capacity = this.getCapacity();
        let isFull = false;

        if (capacity === null) {
            const resourceType = this.getFirst();

            if (resourceType) {
                isFull = this.getFreeCapacity(resourceType) <= 0;
            }
        } else {
            isFull = this.getFreeCapacity() <= 0;
        }

        Object.defineProperty(this, '_isFull', {
            value: isFull,
            enumerable: false
        });

        return isFull;
    }

    return this._isFull;
};

/**
 * @param {number} [minAmount=1]
 * @returns {string}
 */
Store.prototype.getFirst = function(minAmount = 1) {
    return Object.keys(this)
                  .find(resourceType => this[resourceType] >= minAmount);
};

/**
 * @param {number} [minAmount=1]
 * @returns {string}
 */
Store.prototype.getFirstResource = function(minAmount = 1) {
    return Object.keys(this)
                  .find(resourceType => resourceType !== RESOURCE_ENERGY && this[resourceType] >= minAmount);
};

/**
 * @param {number} [minAmount=1]
 * @returns {string[]}
 */
Store.prototype.getResources = function(minAmount = 1) {
    if (minAmount === 1) {
        return Object.keys(this);
    }

    return Object.keys(this).filter(resourceType => this[resourceType] >= minAmount);
};

/**
 * @param {string} [resourceType]
 * @returns {number}
 */
Store.prototype.getPercents = function(resourceType) {
    const used = this.getUsedCapacity(resourceType);

    if (used === 0) {
        return 0;
    }

    return Math.min(100, Math.ceil(used / this.getCapacity(resourceType) * 100));
};



//===========================================================================
// RoomPosition
//===========================================================================

// properties

Object.defineProperties(RoomPosition.prototype, {

    /**
     * @readonly
     * @type {Room}
     * @memberof RoomPosition.prototype
     */
    room: {
        get: function() {
            return Game.rooms[this.roomName];
        }
    },

    /**
     * @readonly
     * @type {Structure[]}
     * @memberof RoomPosition.prototype
     */
    structures: {
        get: function() {
            if (this._structures === undefined) {
                this._structures = this.lookFor(LOOK_STRUCTURES);
            }

            return this._structures;
        }
    },

    /**
     * @readonly
     * @type {StructureRampart}
     * @memberof RoomPosition.prototype
     */
    rampart: {
        get: function() {
            if (this._rampart === undefined) {
                this._rampart = _.find(this.structures, { structureType: STRUCTURE_RAMPART }) || null;
            }

            return this._rampart;
        }
    },

    /**
     * @readonly
     * @type {Creep}
     * @memberof RoomPosition.prototype
     */
    creep: {
        get: function() {
            if (this._creep === undefined) {
                this._creep = this.room.allCreeps
                    .find(c => c.pos.x === this.x && c.pos.y === this.y) || null;
            }

            return this._creep;
        }
    },

    /**
     * @readonly
     * @type {PowerCreep}
     * @memberof RoomPosition.prototype
     */
    powerCreep: {
        get: function() {
            if (this._powerCreep === undefined) {
                this._powerCreep = this.room.allPowerCreeps
                    .find(c => c.pos.x === this.x && c.pos.y === this.y) || null;
            }

            return this._powerCreep;
        }
    },

    /**
     * @readonly
     * @type {ConstructionSite}
     * @memberof RoomPosition.prototype
     */
    constructionSite: {
        get: function() {
            if (this._constructionSite === undefined) {
                this._constructionSite = this.room.constructionSites
                    .find(c => c.pos.x === this.x && c.pos.y === this.y) || null;
            }

            return this._constructionSite;
        }
    }

});

// static methods

/**
 * @static
 * @private
 * @param {string} roomName
 * @returns {number[]}
 *
 */
RoomPosition._parseRoomName = function(roomName) {
    const WORLD_SIDES = { N: 1, S: 1, W: 1, E: 1 };
    const WORLD_SIDE_TO_QUAD = { EN: 0, WN: 1, WS: 2, ES: 3 };
    const res = [0, 0, 0, 0];
    let [j, numAcc] = [0, ''];

    for (let i = 0; i < roomName.length; ++i) {
        const char = roomName[i];

        if (!WORLD_SIDES[char]) {
            numAcc += char;
        } else {
            if (numAcc.length > 0) {
                res[j++] = +numAcc;
                numAcc = '';
            }

            res[j++] = char;
        }
    }

    res[j++] = +numAcc;

    return [WORLD_SIDE_TO_QUAD[res[0] + res[2]], res[1], res[3]];
};

/**
 * @static
 * @param {string} data
 * @returns {RoomPosition}
 */
RoomPosition.decode = function(data) {
    const codec = new Codec({ depth: [2, 7, 7, 6, 6], array: 1 });
    const result = codec.decode(data);
    const WORLD_QUAD_TO_SIDE = ['EN', 'WN', 'WS', 'ES'];
    const side = WORLD_QUAD_TO_SIDE[result[0]];

    return new RoomPosition(result[3], result[4], side[0] + result[1] + side[1] + result[2]);
};

/**
 * @static
 * @param {...string} positions
 * @returns {RoomPosition | null}
 */
RoomPosition.commonPos = function() {
    const result = _.intersection(...arguments);

    if (result.length > 0) {
        return RoomPosition.decode(result[0]) || null;
    }

    return null;
};

/**
 * @static
 * @param {Structure[]} objects
 * @param {number} [range=1]
 * @returns {RoomPosition | null}
 */
RoomPosition.findCommonPos = function(objects, range = 1) {
    const positions = _.reduce(objects, (acc, obj) => {
        if (!obj) {
            return acc;
        }

        const pos = obj.pos || obj;

        if (typeof pos.around === 'function') {
            acc.push(pos.around(range));
        }

        return acc;
    }, []);

    return this.commonPos(...positions);
};

// methods

/**
 * @returns {string}
 */
RoomPosition.prototype.encode = function() {
    const values = RoomPosition._parseRoomName(this.roomName);

    values[3] = this.x;
    values[4] = this.y;

    const codec = new Codec({ depth: [2, 7, 7, 6, 6], array: 1 });

    return codec.encode(values);
};

/**
 * @param {boolean} [checkCreeps=false]
 * @returns {boolean}
 */
RoomPosition.prototype.isWalkable = function(checkCreeps = false) {
    if (this._isWalkable === undefined) {
        this._isWalkable = false;

        const terrain = new Room.Terrain(this.roomName);

        if (terrain.get(this.x, this.y) === TERRAIN_MASK_WALL) {
            return false;
        }

        if (this.room) {
            this._isWalkable = this.structures.every(obj => obj.isWalkable());

            if (this._isWalkable && this.room.my) {
                const construction = this.constructionSite;

                if (construction) {
                    this._isWalkable = construction.isWalkable();
                }
            }
        } else {
            const memory = Memory.rooms[this.roomName];

            if (memory) {
                const cache = memory.cache;

                if (cache && cache.walls.includes(this.encode())) {
                    return false;
                }
            }

            this._isWalkable = true;
        }
    }

    if (!checkCreeps) {
        return this._isWalkable;
    }

    return !(this.creep || this.powerCreep);
};

/**
 * @param {number} range
 * @param {Object} [options={}]
 *
 * @param {function} [options.filter]
 * @param {boolean} [options.walkableCheckCreeps]
 * @param {boolean} [options.encode=true]
 *
 * @returns {RoomPosition[] | string[]}
 */
RoomPosition.prototype.around = function(range, options = {}) {
    _.defaults(options, {
        filter: pos => pos.isWalkable(options.walkableCheckCreeps),
        encode: true
    });

    const x = this.x;
    const y = this.y;
    const roomName = this.roomName;
    const startX = Math.max(0, x - range);
    const finishX = Math.min(49, x + range);
    const startY = Math.max(0, y - range);
    const finishY = Math.min(49, y + range);
    let positions = [];

    for (let _x = startX; _x <= finishX; _x++) {
        for (let _y = startY; _y <= finishY; _y++) {
            if (_x !== x || _y !== y) {
                positions.push(new RoomPosition(_x, _y, roomName));
            }
        }
    }

    if (options.filter) {
        if (options.encode) {
            positions = positions.reduce((acc, pos) => {
                if (options.filter(pos)) {
                    acc.push(pos.encode());
                }

                return acc;
            }, []);
        } else {
            positions = positions.filter(options.filter);
        }
    } else if (options.encode) {
        positions = positions.map(pos => pos.encode());
    }

    return positions;
};

/**
 * @returns {boolean}
 */
RoomPosition.prototype.isBorder = function() {
    return this.x === 0 || this.y === 0 || this.x === 49 || this.y === 49;
};

/**
 * @param {string} structureType
 *
 * @returns {Structure | undefined}
 */
RoomPosition.prototype.getStructure = function(structureType) {
    if (!Game.rooms[this.roomName]) {
        return undefined;
    }

    return _.find(this.structures, { structureType });
};

/**
 * @returns {string}
 */
RoomPosition.prototype.toKey = function() {
    return `${this.x},${this.y},${this.roomName}`;
};



//===========================================================================
// Codec
//===========================================================================

global.Codec.encodeId = function(id) {
    const values = [];

    for (let i = 0, length = id.length; i < length; i++) {
        const point = parseInt(id[i], 16);

        values.push(point);
    }

    const codec = new Codec({ depth: 4, array: 1 });

    return codec.encode(values);
};

global.Codec.decodeId = function(data) {
    const codec = new Codec({ depth: 4, array: 1 });

    return codec.decode(data).reduce((acc, x) => (acc + x.toString(16)), '');
};
