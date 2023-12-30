
function Getter() {
}

Getter.PERCENTS = 0.95;

Getter.BLOCKED_STRUCTURES = {
    E68S9: ['5898e8e8e1a287688da7a36e', '5890c2c5ef91b4b53e04efa7', '5d094743cec5537a547b9c82'],
    E68S8: [],
    E67S14: [],
    E64S13: [],

    E42S9: [],
    E39S6: [],
    E38S12: [],
    E37S4: [],
    E39S9: [],
    E38S14: [],
    E37S4: ['5df48af77f473710b8657f9a'],
    E37S16: ['5d5e3c7286cfad0df6821f6f'],
    E44S17: ['5e03024d508a7821f7e2737a'],
    E27S9: [],
    E23S5: [],
    E24S3: ['647ebebe68f1014c3b8e3f86'],

    E38S9: ['5a2680ed776bb86f5145b457'],
    E42S11: [],
    E47S14: [],
    E44S3: [],
    E37S5: ['5b5c1d07c75ae85cbd841065'],
    E47S8: ['5b6de6dd592ca855c9ac3d55'],
    E48S9: ['5bdea98d0f16fc40296141a6'],
    E49S16: ['5bea9039b4a5532a2daea96f'],
    E35S8: ['5c2332d1a28f31206119a70f'],
    E42S13: [],
    E45S9: [],
    E47S11: [],
    E35S3: [],
    E45S18: [],
    E42S15: ['5cbb7217cdd70d74dc7359dd'],
    E32S5: ['5e205e5888e10a0bf1fdfbd9'],

    E39S11: ['5c39902d0d40bf24655ce039', '5c987af53be07b5d65fd8cf9'],
};

Getter.run = function(room, creep) {
    this.room = room;
    this.creep = creep;
    this.reservedGetterStructures = room.memory.reservedGetterStructures;

    if (!this.reservedGetterStructures) {
        room.memory.reservedGetterStructures = {};

        this.reservedGetterStructures = room.memory.reservedGetterStructures;
    }

    this.getterType = creep.getterType;

    this.newRole = null;

    this.update();

    return this.newRole;
};

//

Getter.filterStructures = function(needAmount, structure) {
    return structure && !_.includes((this.BLOCKED_STRUCTURES[this.creep.room.name] || []), structure.id) && this.getAvailableResources(structure) > needAmount;
};

Getter.filterResources = function(needAmount, resource) {
    return resource && resource.amount > needAmount && resource.resourceType === this.getterType;
};

//

Getter.getStructureResources = function(structure, resourceType) {
    if (!structure) {
        return 0;
    }

    resourceType = resourceType || this.getterType;

    let resources;

    if (structure.store) {
        resources = structure.store[resourceType];
    } else if (structure instanceof Resource && structure.resourceType === resourceType) {
        resources = structure.amount;
    }

    return resources || 0;
};

Getter.getAvailableResources = function(structure, resourceType) {
    return this.getStructureResources(structure, resourceType || this.getterType);
};

Getter.resetGetterMemory = function() {
    delete this.creep.memory.trav;
    delete this.creep.memory.getterStructureId;
    delete this.creep.memory.getterStructureIdTimeout;
    delete this.creep.memory.getterStructureIdSearches;
};

//

Getter.findTargets = function() {
    const containers = this.room.containers;
    const storages = [this.room.storage];
    const terminals = [this.room.terminal];
    let structures = [];

    const role = this.creep.memory.roleForGetter || this.creep.initialRole;

    switch (role) {
        case 'carrier': {
            structures = _.filter(containers, this.filterStructures.bind(this, 100));

            if (this.room.energyAvailable < this.room.energyCapacityAvailable || this.room.expiringTowers.length > 0 || this.room.playerEnemies.length > 0) {
                const filtredStructures = _.filter(storages.concat(terminals), this.filterStructures.bind(this, 0));

                // if (this.room.level >= 7 && this.room.energyPercents < 25) { // percents
                if (this.room.level >= 7) {
                    const filtered = _.filter([this.room.factory], this.filterStructures.bind(this, 0));

                    if (filtered.length > 0) {
                        structures = structures.concat(filtered);
                    }
                }

                if (this.room.level >= 6 && this.room.energyPercents < 10) { // percents
                    const filtered = _.filter(this.room.labs.concat(this.room.powerSpawns), this.filterStructures.bind(this, 0));

                    if (filtered.length > 0) {
                        structures = structures.concat(filtered);
                    }
                }

                if (filtredStructures.length > 0) {
                    structures = structures.concat(filtredStructures);
                }

                const droppedResources = _.filter(_.filter(this.room.droppedEnergy, (resource) => {
                    if (resource.amount < 100) {
                        const container = containers.find(
                            c => c.pos.isEqualTo(resource.pos) && c.getResourceAmount(RESOURCE_ENERGY) > 0);

                        if (container) {
                            return false;
                        }
                    }

                    if (resource.ticksToDecay > this.creep.pos.getRangeTo(resource.pos) * 2) {
                        return true;
                    }

                    return false;
                }), this.filterResources.bind(this, 10));

                if (droppedResources.length > 0) {
                    structures = structures.concat(droppedResources);
                }
            } else {
                const resources = _.filter(this.room.droppedEnergy.filter((resource) => {
                    if (resource.amount < 100) {
                        const container = containers.find(
                            c => c.pos.isEqualTo(resource.pos) && c.getResourceAmount(RESOURCE_ENERGY) > 0);

                        if (container) {
                            return false;
                        }
                    }

                    if (resource.ticksToDecay > this.creep.pos.getRangeTo(resource.pos) * 2) {
                        return true;
                    }

                    return false;
                }), this.filterResources.bind(this, 10));
                const tombstones = this.room.tombstones.filter(this.filterStructures.bind(this, 10));
                const ruins = this.room.ruins.filter(this.filterStructures.bind(this, 10));
                const objects = ruins.concat(tombstones, resources);

                if (objects.length > 0) {
                    return objects;
                }

                const storage = this.room.storage;
                const terminal = this.room.terminal;

                if (this.room.level >= 1 && this.room.level <= 4 && structures.length === 0 && (storage || terminal)) {
                    structures = _.filter(storages.concat(terminals), this.filterStructures.bind(this, 0));
                }
            }

            break;
        }

        case 'builder': {
            if (this.room.level >= 5 && (this.room.storage || this.room.terminal)) {
                structures = _.filter(storages.concat(terminals, [this.room.factory]), this.filterStructures.bind(this, 0));

                if (structures.length > 0) {
                    return structures;
                } else {
                    if (this.room.storage && this.filterStructures(0, this.room.storage)) {
                        structures.push(this.room.storage);
                    }

                    if (this.room.terminal && this.filterStructures(0, this.room.terminal)) {
                        structures.push(this.room.terminal);
                    }

                    if (this.room.factory && this.filterStructures(0, this.room.factory)) {
                        structures.push(this.room.factory);
                    }

                    const resources = this.room.droppedEnergy.filter(this.filterResources.bind(this, 10));

                    if (resources.length > 0) {
                        structures = structures.concat(resources);
                    }

                    const tombstones = this.room.tombstones.filter(this.filterStructures.bind(this, 0));

                    if (tombstones.length > 0) {
                        structures = structures.concat(tombstones);
                    }

                    const ruins = this.room.ruins.filter(this.filterStructures.bind(this, 0));

                    if (ruins.length > 0) {
                        structures = structures.concat(ruins);
                    }
                }
            }

            structures = _.filter(containers, this.filterStructures.bind(this, 50));

            if (this.room.storage) {
                if (this.room.storage.my || !this.room.storage.pos.rampart) {
                    structures = structures.concat([this.room.storage]);
                }
            }

            if (this.room.terminal) {
                if (this.room.terminal.my || !this.room.terminal.pos.rampart) {
                    structures = structures.concat([this.room.terminal]);
                }

            }

            if (this.room.factory) {
                if (this.room.factory.my || !this.room.factory.pos.rampart) {
                    structures = structures.concat([this.room.factory]);
                }
            }

            structures = _.filter(structures, this.filterStructures.bind(this, 0));

            const resources = _.filter(this.room.droppedEnergy, this.filterResources.bind(this, 10));

            if (resources.length > 0) {
                structures = structures.concat(resources);
            }

            const tombstones = _.filter(this.room.tombstones, this.filterStructures.bind(this, 0));

            if (tombstones.length > 0) {
                structures = structures.concat(tombstones);
            }

            const ruins = _.filter(this.room.ruins, this.filterStructures.bind(this, 0));

            if (ruins.length > 0) {
                structures = structures.concat(ruins);
            }

            break;
        }

        case 'remoteRepairer': {
            if (this.room.my) {
                return _.filter(storages.concat(terminals, [this.room.factory]), this.filterStructures.bind(this, 0));
            } else {
                structures = _.filter(containers, this.filterStructures.bind(this, 500));

                if (structures.length > 0) {
                    return structures;
                }

                const droppedResources = _.filter(_.filter(this.room.droppedResources, (resource) => {
                    return resource.amount >= 500;
                }), this.filterResources.bind(this, 0));

                if (droppedResources.length > 0) {
                    return droppedResources;
                }
            }

            break;
        }

        default: {
            structures = containers;

            if (this.room.storage) {
                structures.push(this.room.storage);
            }

            if (this.room.terminal) {
                structures.push(this.room.terminal);
            }

            if (this.room.factory) {
                structures.push(this.room.factory);
            }

            if (!this.room.my) {
                structures = structures.concat(this.room.tombstones, this.room.ruins.filter(r => r.structure.structureType === STRUCTURE_TERMINAL || r.structure.structureType === STRUCTURE_STORAGE));

                if (this.room.enemies.length > 0) {
                    structures = _.filter(structures, structure => {
                        return this.filterStructures(0, structure) && structure.pos.findInRange(this.room.enemies, 4).length === 0;
                    });
                } else {
                    structures = _.filter(structures, this.filterStructures.bind(this, 0));
                }

                return structures;
            }

            return _.filter(structures, this.filterStructures.bind(this, 0));

            break;
        }
    }

    return structures;
};

Getter.moveToTarget = function(target) {
    if (!target) {
        return;
    }

    const carry = this.creep.store[this.getterType] || 0;
    const getterAmount = this.creep.memory.getterAmount;
    let amount;

    if (getterAmount > 0) {
        if (carry > 0) {
            amount = getterAmount - carry;
        } else {
            if (getterAmount > this.creep.carryCapacity) {
                amount = this.creep.carryCapacity;

                delete this.creep.memory.getterAmount;
            } else {
                amount = getterAmount;
            }
        }

        if (target.mineralAmount < amount) {
            amount = target.mineralAmount;
        }

        if (target.store && target.store[this.getterType] < amount) {
            amount = target.store[this.getterType];
        }
    }

    let result;

    if (target instanceof Creep) {
        result = target.transfer(this.creep, this.getterType, amount);
    } else if (target instanceof Resource) {
        result = this.creep.pickup(target);
    } else {
        result = this.creep.withdraw(target, this.getterType, amount);
    }

    if (result === ERR_NOT_IN_RANGE) {
        this.creep.travelTo(target, { ignoreCreeps: false, maxRooms: 1 });

        this.room.visual.circle(target.pos, {
            radius: 0.75,
            stroke: '#ff0000',
            strokeWidth: 0.15,
            opacity: 0.2
        });
    } else if (result === OK) {
        this.resetGetterMemory();
    } else if (result === ERR_FULL) {
        if (this.creep.store[this.getterType] > 0 && this.creep.isFull()) {
            this.resetGetterMemory();

            this.newRole = this.creep.memory.roleAfterGetter || this.creep.initialRole;
        }
    }
};

Getter.moveToNearestTarget = function() {
    if (this.creep.ticksToLive <= 5) {
        this.resetGetterMemory();

        this.creep.wait(this.creep.ticksToLive);

        return;
    }

    const targetId = this.creep.memory.getterStructureId;
    const targetIdTimeout = this.creep.memory.getterStructureIdTimeout || 0;
    let targetIdSearches = this.creep.memory.getterStructureIdSearches || 0;
    let findNew = true;
    let target = null;

    if (targetId) {
        target = Game.getObjectById(targetId);

        if (target) {
            if (target.room === this.room && targetIdTimeout > 0) {
                if (target instanceof Resource && target.resourceType === this.getterType && target.amount > 0 || target.store[this.getterType] > 0) {
                    findNew = false;

                    this.creep.memory.getterStructureIdTimeout--;
                    this.creep.memory.getterStructureIdSearches = 0;
                } else {
                    target = null;
                }
            } else {
                target = null;
            }
        }
    }

    if (findNew) {
        delete this.creep.memory.getterStructureId;
        delete this.creep.memory.getterStructureIdTimeout;

        const targets = this.findTargets();
        const targetsLength = targets.length;

        if (targetsLength === 1) {
            target = targets[0];
        } else if (targetsLength > 1) {
            target = this.creep.pos.findClosestByPath(targets, { ignoreCreeps: true });
        }

        if (target) {
            this.creep.memory.getterStructureId = target.id;

            if (this.room.my) {
                this.creep.memory.getterStructureIdTimeout = 20;
            } else {
                this.creep.memory.getterStructureIdTimeout = 25;
            }

            targetIdSearches = 0;

            this.creep.memory.getterStructureIdSearches = targetIdSearches;
        } else {
            targetIdSearches++;

            this.creep.wait(2);
            this.creep.memory.getterStructureIdSearches = targetIdSearches;
        }
    }

    const limit = this.room.my ? 2 : 3;

    if (targetIdSearches >= limit) {
        const carry = this.creep.store[this.getterType] || 0;
        let result = null;

        if (carry > 0 && (targetIdSearches >= 5 || carry >= Math.floor(this.creep.carryCapacity / targetIdSearches))) {
            result = OK;
        } else if (carry === 0) {
            result = ERR_NOT_ENOUGH_RESOURCES;
        }

        if (result !== null) {
            this.resetGetterMemory();

            this.newRole = this.creep.memory.roleAfterGetter || this.creep.initialRole;

            this.creep.wait(0);
            this.creep.memory.getterResult = result;

            return;
        }
    }

    this.moveToTarget(target);
};

Getter.update = function() {
    // if (this.creep.carryCapacity === 0) {
    //     return;
    // }

    if (this.creep.hits < this.creep.hitsMax && this.creep.getActiveBodyparts(HEAL) > 0) {
        this.creep.heal(this.creep);
    }

    if (this.creep.store[this.getterType] >= this.creep.memory.getterAmount) {
        this.newRole = this.creep.memory.roleAfterGetter || this.creep.initialRole;

        return;
    }

    if (!this.creep.store[this.getterType] || this.creep.store[this.getterType] < this.creep.carryCapacity) {
        this.moveToNearestTarget();
    }

    if (this.creep.store[this.getterType] >= this.creep.carryCapacity * this.PERCENTS) {
        this.newRole = this.creep.memory.roleAfterGetter || this.creep.initialRole;

        this.creep.memory.getterResult = OK;

        this.creep.wait(0);

        this.resetGetterMemory();
    }
};

module.exports = Getter;
