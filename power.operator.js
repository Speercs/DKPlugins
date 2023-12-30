function PowerOperator() {}

const MINIMUM_OPS = 200;

PowerOperator.TASKS = {
    ENABLE_POWER: 1,
    RENEW: 2,
    WITHDRAW_OPS: 3,
    OPERATE_POWER: 4,
    OPERATE_TERMINAL: 5,
    OPERATE_EXTENSION: 6,
    OPERATE_TOWER: 7,
    REGEN_SOURE: 8,
    OPERATE_FACTORY: 9,
    OPERATE_SPAWN: 10,
    REGEN_MINERAL: 11,
    OPERATE_STORAGE: 12,
    OPERATE_CONTROLLER: 13,
    BUY_OPS: 14,
    TRANSFER_OPS: 15,
};

//

/**
 * @static
 * @param {PowerCreep} creep
 * @returns {string | null}
 */
PowerOperator.run = function(creep) {
    this.creep = creep;
    this.room = creep.room;
    this.newRole = null;

    this.update();

    return this.newRole;
};

PowerOperator.travelTo = function(destination, options) {
    return this.creep.travelTo(destination, {
        maxRooms: 1,
        ignoreCreeps: false,
        ...options
    });
}

PowerOperator.requestResource = function(resourceType) {
    return Shard.myRooms.some((room) => {
        if (room.name === this.room.name || !room.terminal || room.terminal.cooldown > 0) {
            return false;
        }

        if (room.terminal.store[resourceType] === 0) {
            return false;
        }

        if (resourceType === RESOURCE_OPS) {
            const powerCreeps = room.powerCreeps;

            if (powerCreeps.length > 1 && room.store[resourceType] < 10000) {
                return false;
            } else if (powerCreeps.length === 1 && powerCreeps[0].level > 1 && room.store[resourceType] < 5000) {
                return false;
            }
        }

        return room.terminal.transfer(
            resourceType, Math.min(2000, room.terminal.store[resourceType]), this.room.name) === OK;
    });
}

// process

PowerOperator.processEnablePower = function() {
    let result = OK;

    if (this.room.controller && !this.room.controller.isPowerEnabled) {
        result = this.creep.enableRoom(this.room.controller);

        if (result === ERR_NOT_IN_RANGE) {
            this.travelTo(this.room.controller);
        }
    }

    return result;
};

PowerOperator.processRenew = function() {
    let result = OK;

    if (this.creep.ticksToLive < 150) {
        let structure = null;

        if (this.room.my && this.room.level === 8) {
            structure = this.room.powerSpawn;
        } else if (this.room.ighway) {
            structure = this.room.powerBank;
        }

        if (structure) {
            result = this.creep.renew(structure);

            if (result === ERR_NOT_IN_RANGE) {
                this.travelTo(structure);
            } else if (result === OK) {
                this.creep.say('renewed!');
            }
        } else {
            result = ERR_INVALID_TARGET;
        }
    }

    return result;
};

PowerOperator.processGenerateOps = function() {
    if (this.creep.usePower(PWR_GENERATE_OPS) === OK) {
        this.creep.say('ops');
    }
};

PowerOperator.processWithdrawOps = function() {
    let result = OK;

    if (this.creep.store[RESOURCE_OPS] < MINIMUM_OPS) {
        let withdrawStructureId = this.creep.memory.task.withdrawStructureId;
        let structure = null;

        if (withdrawStructureId) {
            structure = Game.getObjectById(withdrawStructureId);

            if (!structure || !structure.store[RESOURCE_OPS]) {
                structure = null;

                delete this.creep.memory.task.withdrawStructureId;
            }
        }

        if (!structure) {
            const structures = _.filter([this.room.terminal, this.room.storage], s => s && s.store.ops > 0);

            structure = this.creep.pos.findClosestByPath(structures);

            if (structure) {
                this.creep.memory.task.withdrawStructureId = structure.id;
            }
        }

        if (structure) {
            result = this.creep.withdraw(structure, RESOURCE_OPS);

            if (result === ERR_NOT_IN_RANGE) {
                this.travelTo(structure);
            }
        }
    }

    return result;
};

PowerOperator.processOperatePower = function() {
    let result = OK;

    if (this.creep.store[RESOURCE_OPS] < POWER_INFO[PWR_OPERATE_POWER].ops) {
        return ERR_NOT_ENOUGH_RESOURCES;
    }

    const powerSpawn = this.room.powerSpawn;

    if (!powerSpawn) {
        return ERR_INVALID_TARGET;
    }

    result = this.creep.usePower(PWR_OPERATE_POWER, powerSpawn);

    if (result === ERR_NOT_IN_RANGE) {
        this.travelTo(powerSpawn, { range: POWER_INFO[PWR_OPERATE_POWER].range });
    } else if (result === OK) {
        _.set(this.creep.memory, `updateEffects.${PWR_OPERATE_POWER}`, Game.time + (POWER_INFO[PWR_OPERATE_POWER].duration || 0));
    }

    return result;
};

PowerOperator.processOperateTerminal = function() {
    let result = OK;

    if (this.creep.store[RESOURCE_OPS] < POWER_INFO[PWR_OPERATE_TERMINAL].ops) {
        return ERR_NOT_ENOUGH_RESOURCES;
    }

    const terminal = this.room.terminal;

    if (!terminal) {
        return ERR_INVALID_TARGET;
    }

    result = this.creep.usePower(PWR_OPERATE_TERMINAL, terminal);

    if (result === ERR_NOT_IN_RANGE) {
        this.travelTo(terminal, { range: POWER_INFO[PWR_OPERATE_TERMINAL].range });
    } else if (result === OK) {
        _.set(this.creep.memory, `updateEffects.${PWR_OPERATE_TERMINAL}`, Game.time + (POWER_INFO[PWR_OPERATE_TERMINAL].duration || 0));
    }

    return result;
};

PowerOperator.processOperateExtension = function() {
    let result = OK;

    if (this.creep.store[RESOURCE_OPS] < POWER_INFO[PWR_OPERATE_EXTENSION].ops) {
        return ERR_NOT_ENOUGH_RESOURCES;
    }

    if (this.room.energyPercents > 80) {
        return ERR_FULL;
    }

    const storage = this.room.storage;
    const terminal = this.room.terminal;
    const factory = this.room.factory;
    let structure = _.chain([storage, terminal, factory])
        .filter(s => !!s)
        .sortBy(s => s.store[RESOURCE_ENERGY])
        .last()
        .value();

    if (!structure) {
        return ERR_INVALID_TARGET;
    }

    result = this.creep.usePower(PWR_OPERATE_EXTENSION, structure);

    if (result === ERR_NOT_IN_RANGE) {
        this.travelTo(structure, { range: POWER_INFO[PWR_OPERATE_EXTENSION].range });
    }

    return result;
};

PowerOperator.processOperateTower = function() {
    let result = OK;

    if (this.creep.store[RESOURCE_OPS] < POWER_INFO[PWR_OPERATE_TOWER].ops) {
        return ERR_NOT_ENOUGH_RESOURCES;
    }

    const towers = this.room.towers.filter(t => !t.hasEffect(PWR_OPERATE_TOWER));

    if (towers.length === 0) {
        const durations = this.room.towers.map(t => t.effects[PWR_OPERATE_TOWER].ticksRemaining);

        _.set(this.creep.memory, `updateEffects.${PWR_OPERATE_TOWER}`, Game.time + (Math.min.apply(Math, durations) || 0));

        return ERR_FULL;
    }

    const tower = towers[0];

    result = this.creep.usePower(PWR_OPERATE_TOWER, tower);

    if (result === ERR_NOT_IN_RANGE) {
        this.travelTo(tower, { range: POWER_INFO[PWR_OPERATE_TOWER].range });
    }
    // else if (result === OK && towers.length === 1) {
    //     _.set(this.creep.memory, `updateEffects.${PWR_OPERATE_TOWER}`, Game.time + (POWER_INFO[PWR_OPERATE_TOWER].duration || 0));
    // }

    return result;
};

PowerOperator.processRegenSource = function() {
    let result = OK;

    if (this.creep.store[RESOURCE_OPS] < POWER_INFO[PWR_REGEN_SOURCE].ops) {
        return ERR_NOT_ENOUGH_RESOURCES;
    }

    const sourceIndex = this.creep.memory.task.sourceIndex;
    let source = null;

    if (sourceIndex) {
        source = this.room.sources[sourceIndex];

        if (!source || source.hasEffect(PWR_REGEN_SOURCE)) {
            source = null;

            delete this.creep.memory.task.sourceIndex;
        }
    }

    if (!source) {
        const sources = this.room.sources; // .filter(s => !s.hasEffect(PWR_REGEN_SOURCE));

        if (sources.length === 0) {
            // const durations = this.room.sources.map(t => t.effects[PWR_REGEN_SOURCE].ticksRemaining);

            // _.set(this.creep.memory, `updateEffects.${PWR_REGEN_SOURCE}`, Game.time + (Math.min.apply(Math, durations || 0)));

            return ERR_FULL;
        }

        source = sources.find(s => !s.hasEffect(PWR_REGEN_SOURCE));

        if (!source) {
            source = sources.find((source) => {
                const effect = source.getEffect(PWR_REGEN_SOURCE);

                if (effect) {
                    return effect.ticksRemaining - POWER_INFO[PWR_REGEN_SOURCE].range <= source.pos.getRangeTo(this.creep.pos);
                }

                return false;
            });
        }

        if (source) {
            this.creep.memory.task.sourceIndex = sources.indexOf(source); // this.room.sources.indexOf(source);
        }
    }

    if (!source) {
        return ERR_INVALID_TARGET;
    }

    result = this.creep.usePower(PWR_REGEN_SOURCE, source);

    if (source.hasEffect(PWR_REGEN_SOURCE)) {
        result = ERR_NOT_IN_RANGE;
    }

    if (result === ERR_NOT_IN_RANGE) {
        this.travelTo(source, { range: POWER_INFO[PWR_REGEN_SOURCE].range });
    }
    // else if (result === OK && sources.length === 1) {
    //     _.set(this.creep.memory, `updateEffects.${PWR_REGEN_SOURCE}`, Game.time + (POWER_INFO[PWR_REGEN_SOURCE].duration || 0));
    // }

    return result;
};

PowerOperator.processRegenMineral = function() {
    let result = OK;

    if (this.creep.store[RESOURCE_OPS] < POWER_INFO[PWR_REGEN_MINERAL].ops) {
        return ERR_NOT_ENOUGH_RESOURCES;
    }

    const mineral = this.room.mineral;

    if (!mineral || mineral.ticksToRegeneration > 0 || mineral.hasEffect(PWR_REGEN_MINERAL)) {
        return ERR_FULL;
    }

    result = this.creep.usePower(PWR_REGEN_MINERAL, mineral);

    if (result === ERR_NOT_IN_RANGE) {
        this.travelTo(mineral, { range: POWER_INFO[PWR_REGEN_MINERAL].range });
    } else if (result === OK) {
        _.set(this.creep.memory, `updateEffects.${PWR_REGEN_MINERAL}`, Game.time + (POWER_INFO[PWR_REGEN_MINERAL].duration || 0));
    }

    return result;
};

PowerOperator.processOperateFactory = function() {
    let result = OK;

    if (this.creep.store[RESOURCE_OPS] < POWER_INFO[PWR_OPERATE_FACTORY].ops) {
        return ERR_NOT_ENOUGH_RESOURCES;
    }

    const factory = this.room.factory;

    if (!factory || factory.cooldown > 20) {
        return ERR_INVALID_TARGET;
    }

    result = this.creep.usePower(PWR_OPERATE_FACTORY, factory);

    if (result === ERR_NOT_IN_RANGE) {
        this.travelTo(factory, { range: POWER_INFO[PWR_OPERATE_FACTORY].range });
    } else if (result === OK) {
        _.set(this.creep.memory, `updateEffects.${PWR_OPERATE_FACTORY}`, Game.time + (POWER_INFO[PWR_OPERATE_FACTORY].duration || 0));
    }

    return result;
};

PowerOperator.processOperateSpawn = function() {
    let result = OK;

    if (this.creep.store[RESOURCE_OPS] < POWER_INFO[PWR_OPERATE_SPAWN].ops) {
        return ERR_NOT_ENOUGH_RESOURCES;
    }

    const spawns = this.room.spawns.filter((spawn) => {
        if (spawn.hasEffect(PWR_OPERATE_SPAWN)) {
            return false;
        }

        if (spawn.spawning && spawn.spawning.remainingTime > 10) {
            return false;
        }

        return true;
    }).sort((a, b) => {
        if (a.spawning && b.spawning) {
            return a.spawning.remainingTime - b.spawning.remainingTime;
        }

        return 0;
    });

    // if (spawns.length === 0) {
    //     const durations = this.room.spawns.map(t => t.effects[PWR_OPERATE_SPAWN].ticksRemaining);
    //
    //     _.set(this.creep.memory, `updateEffects.${PWR_OPERATE_SPAWN}`, Game.time + (Math.min.apply(Math, durations) || 0));
    //
    //     return ERR_FULL;
    // }

    const spawn = spawns[0];

    if (!spawn) {
        return ERR_INVALID_TARGET;
    }

    result = this.creep.usePower(PWR_OPERATE_SPAWN, spawn);

    if (result === ERR_NOT_IN_RANGE) {
        this.travelTo(spawn, { range: POWER_INFO[PWR_OPERATE_SPAWN].range });
    }

    return result;
};

PowerOperator.processOperateStorage = function() {
    let result = OK;

    if (this.creep.store[RESOURCE_OPS] < POWER_INFO[PWR_OPERATE_STORAGE].ops) {
        return ERR_NOT_ENOUGH_RESOURCES;
    }

    const storage = this.room.storage;

    if (!storage) {
        return ERR_INVALID_TARGET;
    }

    result = this.creep.usePower(PWR_OPERATE_STORAGE, storage);

    if (result === ERR_NOT_IN_RANGE) {
        this.travelTo(storage);
    } else if (result === OK) {
        _.set(this.creep.memory, `updateEffects.${PWR_OPERATE_STORAGE}`, Game.time + (POWER_INFO[PWR_OPERATE_STORAGE].duration || 0));
    }

    return result;
};

PowerOperator.processOperateController = function() {
    let result = OK;

    if (this.creep.store[RESOURCE_OPS] < POWER_INFO[PWR_OPERATE_CONTROLLER].ops) {
        return ERR_NOT_ENOUGH_RESOURCES;
    }

    const controller = this.room.controller;

    if (!controller) {
        return ERR_INVALID_TARGET;
    }

    result = this.creep.usePower(PWR_OPERATE_CONTROLLER, controller);

    if (result === ERR_NOT_IN_RANGE) {
        this.travelTo(controller, { range: POWER_INFO[PWR_OPERATE_CONTROLLER].range });
    } else if (result === OK) {
        _.set(this.creep.memory, `updateEffects.${PWR_OPERATE_CONTROLLER}`, Game.time + (POWER_INFO[PWR_OPERATE_CONTROLLER].duration || 0));
    }

    return result;
};

PowerOperator.processBuyOps = function() {
    Market.buy({ room: this.room.name, resourceType: RESOURCE_OPS, amount: MINIMUM_OPS, maxPrice: 0.25 });

    return OK;
};

PowerOperator.processTransferOps = function() {
    let result = OK;

    if (this.creep.store[RESOURCE_OPS] === 0) {
        return OK;
    }

    const storage = this.room.storage;

    if (!storage) {
        return ERR_INVALID_TARGET;
    }

    result = this.creep.transfer(storage, RESOURCE_OPS);

    if (result === ERR_NOT_IN_RANGE) {
        this.travelTo(storage);
    }

    return result;
};

// needs

PowerOperator.needsWithdrawOps = function() {
    if (this.creep.store[RESOURCE_OPS] >= MINIMUM_OPS || this.creep.level === 1) {
        return false;
    }

    if (this.room.store[RESOURCE_OPS] === 0) {
        return false;
    }

    return true;
};

PowerOperator.needsOperatePower = function() {
    if (!this.room.my || this.room.level < 8 || !Memory.powerEnabled) {
        return false;
    }

    const power = this.creep.powers[PWR_OPERATE_POWER];

    if (!power || power.cooldown > 0) {
        return false;
    }

    if (Game.time < _.get(this.creep.memory, `updateEffects.${PWR_OPERATE_POWER}`)) {
        return false;
    }

    if (this.room.store[RESOURCE_POWER] === 0 || this.room.store[RESOURCE_ENERGY] < 55000) {
        return false;
    }

    if (this.room.store[RESOURCE_OPS] < 50000) {
        return false;
    }

    const powerSpawn = this.room.powerSpawn;

    if (!powerSpawn || powerSpawn.hasEffect(PWR_OPERATE_POWER)) {
        return false;
    }

    const central = this.room.creeps.find(c => c.role === 'central');

    if (!central) {
        return false;
    }

    return true;
};

PowerOperator.needsOperateTerminal = function() {
    // return false;

    if (Shard.shard3) {
        return false;
    }

    if (!this.room.my || this.room.level < 6) {
        return false;
    }

    const power = this.creep.powers[PWR_OPERATE_TERMINAL];

    if (!power || power.cooldown > 0) {
        return false;
    }

    if (Game.time < _.get(this.creep.memory, `updateEffects.${PWR_OPERATE_TERMINAL}`)) {
        return false;
    }

    const terminal = this.room.terminal;

    if (!terminal || terminal.hasEffect(PWR_OPERATE_TERMINAL)) {
        return false;
    }

    return true;
};

PowerOperator.needsOperateExtension = function() {
    if (!this.room.my || this.room.energyPercents > 80) {
        return false;
    }

    if (!this.room.storage || !this.room.terminal) {
        return false;
    }

    const power = this.creep.powers[PWR_OPERATE_EXTENSION];

    if (!power || power.cooldown > 0) {
        return false;
    }

    return true;
};

PowerOperator.needsOperateTower = function() {
    return false;

    if (!this.room.my || this.room.level < 3) {
        return false;
    }

    const power = this.creep.powers[PWR_OPERATE_TOWER];

    if (!power || power.cooldown > 0) {
        return false;
    }

    // if (Game.time < _.get(this.creep.memory, `updateEffects.${PWR_OPERATE_TOWER}`)) {
    //     return false;
    // }

    const towers = this.room.towers;

    if (towers.length === 0) {
        return false;
    }

    if (towers.every(t => t.hasEffect(PWR_OPERATE_TOWER))) {
        return false;
    }

    return true;
};

PowerOperator.needsRegenSource = function() {
    if (!this.room.my) {
        return false;
    }

    const power = this.creep.powers[PWR_REGEN_SOURCE];

    if (!power || power.cooldown > 0) {
        return false;
    }

    // if (Game.time < _.get(this.creep.memory, `updateEffects.${PWR_REGEN_SOURCE}`)) {
    //     return false;
    // }

    const sources = this.room.sources;

    if (sources.length === 0) {
        return false;
    }

    let source = sources.find(s => !s.hasEffect(PWR_REGEN_SOURCE));

    if (source) {
        return true;
    }

    source = sources.find((source) => {
        const effect = source.getEffect(PWR_REGEN_SOURCE);

        if (effect) {
            return effect.ticksRemaining - POWER_INFO[PWR_REGEN_SOURCE].range <= source.pos.getRangeTo(this.creep.pos);
        }

        return false;
    });

    if (source) {
        return true;
    }

    return false;
};

PowerOperator.needsRegenMineral = function() {
    if (!this.room.my || this.room.level < 6) {
        return false;
    }

    const power = this.creep.powers[PWR_REGEN_MINERAL];

    if (!power || power.cooldown > 0) {
        return false;
    }

    if (Game.time < _.get(this.creep.memory, `updateEffects.${PWR_REGEN_MINERAL}`)) {
        return false;
    }

    const mineral = this.room.mineral;

    if (!mineral || mineral.ticksToRegeneration > 0 || mineral.hasEffect(PWR_REGEN_MINERAL)) {
        return false;
    }

    return true;
};

PowerOperator.needsOperateFactory = function() {
    if (Shard.shard3) {
        return false;
    }

    if (!this.room.my) {
        return false;
    }

    const power = this.creep.powers[PWR_OPERATE_FACTORY];

    if (!power || power.cooldown > 0) {
        return false;
    }

    if (Game.time < _.get(this.creep.memory, `updateEffects.${PWR_OPERATE_FACTORY}`)) {
        return false;
    }

    const factory = this.room.factory;

    if (!factory || factory.hasEffect(PWR_OPERATE_FACTORY) || factory.cooldown > 20) {
        return false;
    }

    // if (factory.level >= 4) {
    //     return false;
    // }

    return true;
};

PowerOperator.needsOperateSpawn = function() {
    if (!Memory.caravanEnabled) {
        return false;
    }

    if (!this.room.my) {
        return false;
    }

    const power = this.creep.powers[PWR_OPERATE_SPAWN];

    if (!power || power.cooldown > 0) {
        return false;
    }

    // if (Game.time < _.get(this.creep.memory, `updateEffects.${PWR_OPERATE_TOWER}`)) {
    //     return false;
    // }

    return this.room.spawns.some((spawn) => {
        if (spawn.hasEffect(PWR_OPERATE_SPAWN)) {
            return false;
        }

        if (spawn.spawning && spawn.spawning.remainingTime > 10) {
            return false;
        }

        return true;
    });
};

PowerOperator.needsOperateStorage = function() {
    if (this.room.store[RESOURCE_OPS] < 50000) {
        return false;
    }

    if (!this.room.my || this.room.level < 4) {
        return false;
    }

    const power = this.creep.powers[PWR_OPERATE_STORAGE];

    if (!power || power.cooldown > 0) {
        return false;
    }

    if (Game.time < _.get(this.creep.memory, `updateEffects.${PWR_OPERATE_STORAGE}`)) {
        return false;
    }

    const storage = this.room.storage;

    if (!storage || storage.hasEffect(PWR_OPERATE_STORAGE)) {
        return false;
    }

    if (storage.isFull() || storage.store.getFreeCapacity() <= 50000) {
        return true;
    }

    // if (Game.shard.name === 'shard3' && this.room.name === 'E39S11') {
    //     return true;
    // }

    return true;
};

PowerOperator.needsOperateController = function() {
    if (!this.room.my) {
        return false;
    }

    const power = this.creep.powers[PWR_OPERATE_CONTROLLER];

    if (!power || power.cooldown > 0) {
        return false;
    }

    if (Game.time < _.get(this.creep.memory, `updateEffects.${PWR_OPERATE_CONTROLLER}`)) {
        return false;
    }

    const controller = this.room.controller;

    if (!controller || controller.hasEffect(PWR_OPERATE_CONTROLLER)) {
        return false;
    }

    return true;
};

PowerOperator.needsBuyOps = function() {
    if (!this.room.my || this.room.level < 4 || !this.room.terminal) {
        return false;
    }

    if (this.room.terminal.cooldown > 0 || this.room.store[RESOURCE_OPS] > 2000 || this.room.terminal.isFull()) {
        return false;
    }

    return true;
};

PowerOperator.needsTransferOps = function() {
    if (this.creep.store[RESOURCE_OPS] < this.creep.store.getCapacity()) {
        return false;
    }

    return this.creep.powers[PWR_GENERATE_OPS] && Object.keys(this.creep.powers).length === 1;
};

//

PowerOperator.findTask = function() {
    if (this.room.controller && !this.room.controller.isPowerEnabled) {
        return { type: PowerOperator.TASKS.ENABLE_POWER };
    }

    if (this.creep.ticksToLive < 150) {
        return { type: PowerOperator.TASKS.RENEW };
    }

    if (this.room.my && this.room.store[RESOURCE_OPS] <= 2000) {
        if (!this.requestResource(RESOURCE_OPS)) {
            const order = Market.findMyOrder({ type: ORDER_BUY, resourceType: RESOURCE_OPS });

            if (order) {
                if (order.remainingAmount === 0) {
                    Market.extend(order.id, 5000, { updatePrice: true, maxPrice: 0.250 });
                }
            } else if (Game.shard.name === 'shard0' || Game.shard.name === 'shard1') {
                Market.createOrder({ type: ORDER_BUY, resourceType: RESOURCE_OPS, roomName: this.room.name, amount: 5000, price: 0.1 });
            }

            if (this.needsBuyOps()) {
                this.processBuyOps();
            }
        } else {
            return null;
        }
    }

    if (this.needsWithdrawOps()) {
        return { type: PowerOperator.TASKS.WITHDRAW_OPS };
    }

    if (this.needsOperateExtension()) {
        return { type: PowerOperator.TASKS.OPERATE_EXTENSION };
    }

    if (this.needsOperateSpawn()) {
        return { type: PowerOperator.TASKS.OPERATE_SPAWN };
    }

    if (this.needsOperateStorage()) {
        return { type: PowerOperator.TASKS.OPERATE_STORAGE };
    }

    if (this.needsOperateTower()) {
        return { type: PowerOperator.TASKS.OPERATE_TOWER };
    }

    if (this.needsOperateFactory()) {
        return { type: PowerOperator.TASKS.OPERATE_FACTORY };
    }

    if (this.needsOperateTerminal()) {
        return { type: PowerOperator.TASKS.OPERATE_TERMINAL };
    }

    if (this.needsOperatePower()) {
        return { type: PowerOperator.TASKS.OPERATE_POWER };
    }

    if (this.needsOperateController()) {
        return { type: PowerOperator.TASKS.OPERATE_CONTROLLER };
    }

    if (this.needsRegenSource()) {
        return { type: PowerOperator.TASKS.REGEN_SOURE };
    }

    if (this.needsRegenMineral()) {
        return { type: PowerOperator.TASKS.REGEN_MINERAL };
    }

    if (this.needsTransferOps()) {
        return { type: PowerOperator.TASKS.TRANSFER_OPS };
    }

    this.creep.wait(3);

    return null;
};

PowerOperator.processTask = function(task) {
    let result = null;

    switch (task.type) {
        case PowerOperator.TASKS.ENABLE_POWER:
            result = this.processEnablePower();
            break;
        case PowerOperator.TASKS.RENEW:
            result = this.processRenew();
            break;
        case PowerOperator.TASKS.WITHDRAW_OPS:
            result = this.processWithdrawOps();
            break;
        case PowerOperator.TASKS.OPERATE_POWER:
            result = this.processOperatePower();
            break;
        case PowerOperator.TASKS.OPERATE_TERMINAL:
            result = this.processOperateTerminal();
            break;
        case PowerOperator.TASKS.OPERATE_EXTENSION:
            result = this.processOperateExtension();
            break;
        case PowerOperator.TASKS.OPERATE_TOWER:
            result = this.processOperateTower();
            break;
        case PowerOperator.TASKS.REGEN_SOURE:
            result = this.processRegenSource();
            break;
        case PowerOperator.TASKS.OPERATE_FACTORY:
            result = this.processOperateFactory();
            break;
        case PowerOperator.TASKS.OPERATE_SPAWN:
            result = this.processOperateSpawn();
            break;
        case PowerOperator.TASKS.REGEN_MINERAL:
            result = this.processRegenMineral();
            break;
        case PowerOperator.TASKS.OPERATE_STORAGE:
            result = this.processOperateStorage();
            break;
        case PowerOperator.TASKS.OPERATE_CONTROLLER:
            result = this.processOperateController();
            break;
        case PowerOperator.TASKS.BUY_OPS:
            result = this.processBuyOps();
            break;
        case PowerOperator.TASKS.TRANSFER_OPS:
            result = this.processTransferOps();
            break;
    }

    if (result !== ERR_NOT_IN_RANGE) {
        if (result === ERR_NOT_ENOUGH_RESOURCES && this.needsWithdrawOps()) {
            this.creep.memory.task = { type: PowerOperator.TASKS.WITHDRAW_OPS };
        } else {
            delete this.creep.memory.task;
        }

        delete this.creep.memory.trav;
    }
};

PowerOperator.update = function() {
    this.processGenerateOps();

    let task = this.creep.memory.task;

    if (!task) {
        task = this.findTask();

        if (task) {
            this.creep.memory.task = task;
        }
    }

    if (task) {
        this.processTask(task);
    }
};

module.exports = PowerOperator;
