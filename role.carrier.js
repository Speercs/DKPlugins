
function Carrier() {
}

Carrier.run = function(creep) {
    const initialRoom = creep.initialRoom;

    if (creep.room.name !== initialRoom) {
        creep.targetFlag = initialRoom;

        return 'traveler';
    }

    this.creep = creep;
    this.room = creep.room;
    this.reservedCarrierStructures = this.room.reservedCarrierStructures;
    this.newRole = null;

    this.update();

    return this.newRole;
};

//

Carrier.removeReservation = function(structureId) {
    try {
        delete this.reservedCarrierStructures[structureId];
    } catch (e) {
        console.log('Carrier.removeReservation: ' + this.room.name + ': ' + e);
    }
};

Carrier.saveStructure = function(structure) {
    if (!structure) {
        return;
    }

    const structureId = structure.id;
    const structureType = structure.structureType;

    this.creep.memory.carrierStructureId = structureId;
    this.creep.memory.carrierStructureType = structureType;

    if (structure.energy + this.creep.carry.energy >= structure.energyCapacity || structure.store && _.sum(structure.store) + this.creep.carry.energy >= structure.storeCapacity) {
        this.reservedCarrierStructures[structureId] = this.creep.name;
    }
};

//

Carrier.filterStructures = function(structure) {
    const creepName = this.reservedCarrierStructures[structure.id];

    if (creepName) {
        const creep = Game.creeps[creepName];

        if (creep && creep.carry.energy + structure.energy >= structure.energyCapacity && creep.memory.carrierStructureId === structure.id) {
            return false;
        }
    }

    this.removeReservation(structure.id);

    return structure.energy < structure.energyCapacity;
};

Carrier.filterTowers = function(structure) {
    if (this.filterStructures(structure)) {
        return structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY) * 0.60;
    }
};

//

Carrier.findTask = function() {
    if (!this.room.terminal && !this.room.storage) {
        return null;
    }

    const tombstone = this.creep.pos.findClosestByPath(this.room.tombstones);

    if (tombstone) {
        return {
            from: { id: tombstone.id },
            state: 'from'
        };
    }

    const mineral = this.room.mineral;
    const containers = this.room.containers.filter((c) => {
        if (c.isEmpty() || c.pos.isNearTo(mineral) && c.store.getUsedCapacity() - c.store[mineral.mineralType] === 0) {
            return false;
        }

        return c.store.getUsedCapacity() - c.store[RESOURCE_ENERGY] > 0;
    });
    const container = this.creep.pos.findClosestByPath(containers);

    if (container) {
        return {
            from: { id: container.id },
            state: 'from'
        };
    }

    return null;
};

Carrier.findStructureByCapacity = function(structures, resourceType, amount = 1) {
    const filtered = structures.filter(s => s && s.getCapacity(resourceType) >= amount);

    if (filtered.length > 1) {
        let structure = null;
        let maxAmount = 0;

        for (const s of filtered) {
            const capacity = s.getCapacity(resourceType);

            if (capacity > maxAmount) {
                maxAmount = capacity;
                structure = s;
            }
        }

        return structure;
    }

    return filtered[0] || null;
}

//

Carrier.findStructures = function() {
    let structures = [];

    if (this.room.energyPercents >= 40 && this.room.enemies.length > 0) {
        const expiringTowers = this.room.expiringTowers;

        if (expiringTowers.length > 0) {
            return expiringTowers;
        }
    }

    if (this.room.energyAvailable < this.room.energyCapacityAvailable) {
        structures = _.filter(this.room.carrierStructures, this.filterStructures.bind(this));

        if (structures.length > 0) {
            return structures;
        }
    }

    const towers = this.room.towers;
    if (towers.length > 0) {
        structures = towers.filter(this.filterTowers.bind(this));

        if (structures.length > 0) {
            return structures;
        }
    }

    const labs = this.room.labs;
    if (labs.length > 0) {
        structures = labs.filter(this.filterStructures.bind(this));

        if (structures.length > 0) {
            return structures;
        }
    }

    if (this.room.name === 'E44S17') {
        const container = Game.getObjectById('5e03024d508a7821f7e2737a');

        if (container && container.store[RESOURCE_ENERGY] < 1500) {
            return [container];
        }
    }

    if (this.room.name === 'E24S3') {
        const container = Game.getObjectById('647ebebe68f1014c3b8e3f86');

        if (container && container.store[RESOURCE_ENERGY] < 1500) {
            return [container];
        }
    }

    if (this.room.level >= 1 && (this.room.level <= 4 || this.room.level <= 6 && (!this.room.storage || !this.room.terminal))) {
        const builder = this.room.creeps.find(c => c.initialRole.startsWith('builder') && c.store.getFreeCapacity() > 0);

        if (builder) {
            return [builder];
        }
    }

    // const powerSpawn = this.room.powerSpawn;
    // if (powerSpawn && powerSpawn.store[RESOURCE_ENERGY] <= 1500 && this.filterStructures(powerSpawn)) {
    //     return [powerSpawn];
    // }

    if (Game.time % 3 === 0 && this.room.level >= 4 && this.creep.ticksToLive >= 50) {
        const task = this.findTask();

        if (task) {
            this.creep.memory.task = task;

            this.updateTask();

            return [];
        }
    }

    const terminal = this.room.terminal;
    if (terminal && terminal.getCapacity(RESOURCE_ENERGY) >= terminal.getLimit(RESOURCE_ENERGY) / 2) {
        return [terminal];
    }

    const storage = this.room.storage;
    if (storage && !storage.isFull()) {
        return [storage];
    }

    const nuker = this.room.nuker;
    if (nuker && this.filterStructures(nuker)) {
        return [nuker];
    }

    if (towers.length > 0) {
        structures = towers.filter(t => t.store.getFreeCapacity() > 0);
    }

    if (structures.length === 0) {
        this.creep.wait(3);
    }

    return structures;
};

Carrier.findNearestStructure = function(ignoredStructure) {
    const structures = this.findStructures();

    if (ignoredStructure) {
        _.pull(structures, ignoredStructure);
    }

    const length = structures.length;

    if (length === 1) {
        return structures[0];
    } else if (length > 1) {
        return this.creep.pos.findClosestByPath(structures, {
            ignoreCreeps: true,
            range: 1
        });
    }

    return null;
};

Carrier.findNewStructure = function(ignoredStructure) {
    delete this.creep.memory.carrierStructureId;
    delete this.creep.memory.carrierStructureType;

    let structure = this.findNearestStructure(ignoredStructure);

    if (structure === ignoredStructure) {
        return null;
    }

   this.saveStructure(structure);

    return structure;
};

Carrier.moveToStructure = function(structure) {
    if (!structure) {
        return;
    }

    const result = this.creep.transfer(structure, RESOURCE_ENERGY);

    if (result === ERR_NOT_IN_RANGE) {
        this.creep.travelTo(structure, {
            maxRooms: 1,
            ignoreCreeps: false
        });

        const visual = this.room.visual;

        if (visual) {
            visual.circle(structure.pos, {
                radius: 0.75,
                stroke: '#0000ff',
                strokeWidth: .15,
                opacity: 0.2
            });
        }
    } else if (result === OK || result === ERR_FULL) {
        this.removeReservation(structure.id);

        delete this.creep.memory.carrierStructureId;
        delete this.creep.memory.carrierStructureType;

        if ([STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER].indexOf(structure.structureType) !== -1) {
            if (this.creep.carry.energy - (structure.energyCapacity - structure.energy) > 100) {
                const nextStructure = this.findNearestStructure(structure);

                if (nextStructure && nextStructure !== structure && !this.creep.pos.isNearTo(nextStructure)) {
                    this.saveStructure(nextStructure);

                    this.creep.travelTo(nextStructure, {
                        maxRooms: 1,
                        ignoreCreeps: false
                    });

                    const visual = this.room.visual;

                    if (visual) {
                        visual.circle(nextStructure.pos, {
                            radius: 0.75,
                            stroke: '#0000ff',
                            strokeWidth: .15,
                            opacity: 0.2
                        });
                    }
                }
            }
        }
    }
};

Carrier.moveToNearestStructure = function(ignoredStructure) {
    let findNew = true;
    const structureId = this.creep.memory.carrierStructureId;
    const structureType = this.creep.memory.carrierStructureType;
    let structure = null;

    if (structureId) {
        if (structureType === STRUCTURE_SPAWN || structureType === STRUCTURE_EXTENSION || structureType === STRUCTURE_TOWER ||
            (this.room.energyAvailable === this.room.energyCapacityAvailable && this.room.expiringTowers.length === 0)) {
            structure = Game.getObjectById(structureId);

            if (structure) {
                if (structureType === STRUCTURE_TERMINAL) {
                    if (this.room.terminalUsedCapacity < TERMINAL_CAPACITY) {
                        findNew = false;
                    }
                } else if (structureType === STRUCTURE_STORAGE) {
                    if (this.room.storageUsedCapacity < STORAGE_CAPACITY) {
                        findNew = false;
                    }
                } else if (structure.energy < structure.energyCapacity || structure.store && structure.store[RESOURCE_ENERGY] < structure.storeCapacity) {
                    findNew = false;
                }
            }
        }
    }

    if (findNew) {
        structure = this.findNewStructure(ignoredStructure);
    }

    this.moveToStructure(structure);
};

Carrier.updateTask = function() {
    const task = this.creep.memory.task;

    if (task.state === 'from') {
        const from = Game.getObjectById(task.from.id);

        if (!from) {
            if (this.creep.isEmpty()) {
                delete this.creep.memory.task;

                return this.update();
            } else {
                task.state = 'to';

                return;
            }
        }

        if (from.isEmpty() || this.creep.isFull()) {
            task.state = 'to';

            return;
        } else {
            const resourceType = from.store.getFirst();
            const result = this.creep.withdraw(from, resourceType);

            if (result === ERR_NOT_IN_RANGE) {
                this.creep.travelTo(from, { maxRooms: 1, ignoreCreeps: false });

                this.room.visual.circle(from.pos, {
                    radius: 0.75,
                    stroke: '#ff0000',
                    strokeWidth: .15,
                    opacity: 0.2
                });
            }
        }
    } else {
        if (this.creep.isEmpty()) {
            delete this.creep.memory.task;

            return this.update();
        } else {
            const resourceType = this.creep.store.getFirst();

            if (resourceType === RESOURCE_ENERGY && this.creep.store[RESOURCE_ENERGY] === this.creep.store.getUsedCapacity()) {
                delete this.creep.memory.task;

                return this.update();
            }

            if (!task.to) {
                const structure = this.findStructureByCapacity(
                    [this.room.terminal, this.room.storage], resourceType);

                if (structure) {
                    task.to = { id: structure.id };
                }
            }

            if (task.to) {
                const to = Game.getObjectById(task.to.id);

                if (to) {
                    const result = this.creep.transfer(to, resourceType);

                    if (result === ERR_NOT_IN_RANGE) {
                        this.creep.travelTo(to, { maxRooms: 1, ignoreCreeps: false });

                        this.room.visual.circle(to.pos, {
                            radius: 0.75,
                            stroke: '#0000ff',
                            strokeWidth: .15,
                            opacity: 0.2
                        });
                    } else if (result === OK) {
                        delete task.to;
                    }
                } else {
                    // TODO ?
                }
            }
        }
    }
};

Carrier.update = function() {
    if (this.creep.memory.task) {
        return this.updateTask();
    }

    const energy = this.creep.store[RESOURCE_ENERGY];
    const capacity = this.creep.store.getCapacity();

    if (energy > 0 && energy > capacity * 0.05) {
        this.moveToNearestStructure();
    }

    if (energy <= capacity * 0.05) {
        this.newRole = 'getter';
    }
};

const RoleBase = ModuleManager.get('role.base');

class Carrier2 extends RoleBase {

    static isValid(task) {
        if (task.state === 'wait' && (this.room.energyAvailable < this.room.energyCapacityAvailable || this.room.playerEnemies.length > 0)) {
            return false;
        }

        return RoleBase.isValid(task);
    }

    static getCarrierStructuresFrom() {
        let structures = this.room.containers.concat([this.room.storage, this.room.terminal, this.room.factory]);

        // if (this.room.energyAvailable < this.room.energyCapacityAvailable || this.room.expiringTowers.length > 0 || this.room.playerEnemies.length > 0) {
        //     const filtredStructures = _.filter(storages.concat(terminals), this.filterStructures.bind(this, 0));
        //
        //     if (this.room.level >= 7 && this.room.energyPercents < 25) { // percents
        //         const filtered = _.filter([this.room.factory], this.filterStructures.bind(this, 0));
        //
        //         if (filtered.length > 0) {
        //             structures = structures.concat(filtered);
        //         }
        //     }
        //
        //     if (this.room.level >= 6 && this.room.energyPercents < 10) { // percents
        //         const filtered = _.filter(this.room.labs.concat(this.room.powerSpawns), this.filterStructures.bind(this, 0));
        //
        //         if (filtered.length > 0) {
        //             structures = structures.concat(filtered);
        //         }
        //     }
        //
        //     if (filtredStructures.length > 0) {
        //         structures = structures.concat(filtredStructures);
        //     }
        // } else {
        //     const storage = this.room.storage;
        //     const terminal = this.room.terminal;
        //
        //     if (this.room.level >= 1 && this.room.level <= 4 && structures.length === 0 && (storage || terminal)) {
        //         structures = _.filter(storages.concat(terminals), this.filterStructures.bind(this, 0));
        //     }
        //
        //     if (storage && terminal && storage.my && terminal.my) {
        //         if (terminal.store[RESOURCE_ENERGY] < TERMINAL_CAPACITY / 6) {
        //             if (this.room.terminalUsedCapacity < terminal.storeCapacity && this.filterStructures(0, storage)) {
        //                 structures = structures.concat([storage]);
        //             }
        //         }
        //     }
        // }

        return structures;

        // if (!this.BLOCKED_LINKS[this.room.name]) {
        //     filtredLinks = _.filter(this.room.links, this.filterStructures.bind(this, 0));
        // }
        //
        // if (structures.length === 0 && filtredLinks.length === 0 && Game.shard.name === 'shard3') {
        //     const droppedResources = _.filter(this.room.droppedResources, this.filterResources.bind(this, 0));
        //
        //     if (droppedResources.length > 0) {
        //         return droppedResources;
        //     }
        //
        //     structures = _.filter(this.room.tombstones, this.filterStructures.bind(this, 0));
        // }
    }

    static _createCarrierTask(structure) {
        if (structure) {
            if (this.creep.store[RESOURCE_ENERGY] === 0 && !this.creep.isEmpty()) {
                // TODO: положить другой ресурс
            }

            const task = {
                to: { id: structure.id, amount: structure.getCapacity(RESOURCE_ENERGY) },
                resourceType: RESOURCE_ENERGY
            };

            if (this.creep.store[RESOURCE_ENERGY] > 0) {
                task.state = 'to';
            } else {
                task.from = this.getStructures(this.getCarrierStructuresFrom(), RESOURCE_ENERGY, this.creep.store.getCapacity());
            }

            return task;
        }

        return null;
    }

    static getCarrierTask() {
        if (this.room.energyPercents >= 40 && this.room.enemies.length > 0) {
            const structure = this.getNearestStructureByCapacity(this.room.expiringTowers, RESOURCE_ENERGY);
            const task = this._createCarrierTask(structure);

            if (task) {
                return task;
            }
        }

        if (this.room.energyAvailable < this.room.energyCapacityAvailable) {
            const structure = this.getNearestStructureByCapacity(this.room.extensions.concat(this.room.spawns), RESOURCE_ENERGY);
            const task = this._createCarrierTask(structure);

            if (task) {
                return task;
            }
        }

        const towers = this.room.towers;
        if (towers.length > 0) {
            const structure = this.getNearestStructureByCapacity(towers, RESOURCE_ENERGY, 200);
            const task = this._createCarrierTask(structure);

            if (task) {
                return task;
            }
        }

        if (this.room.name === 'E64S13') {
            const container = Game.getObjectById('59c782f7948eb737c249418a');

            if (container) {
                const capacity = container.getCapacity(RESOURCE_ENERGY);

                if (capacity >= 500) {
                    return {
                        to: { id: container.id, amount: capacity },
                        resourceType: RESOURCE_ENERGY
                    };
                }
            }
        }

        if (this.room.name === 'E42S15') {
            const container = Game.getObjectById('5cbb7217cdd70d74dc7359dd');

            if (container) {
                const capacity = container.getCapacity(RESOURCE_ENERGY);

                if (capacity >= 500) {
                    return {
                        to: { id: container.id, amount: capacity },
                        resourceType: RESOURCE_ENERGY
                    };
                }
            }
        }

        return { state: 'wait', w: 3 };
    }

    static findTask() {
        return this.getCarrierTask();

        // if (this.creep.store[RESOURCE_ENERGY] === 0 && !this.creep.isEmpty()) {
        //
        // }
        //
        // const terminal = this.room.terminal;
        // const storage = this.room.storage;
        // const factory = this.room.factory;
        //
        // if (this.room.energyPercents >= 40 && this.room.enemies.length > 0) {
        //     const expiringTowers = this.room.expiringTowers;
        //
        //     if (expiringTowers.length > 0) {
        //         const structure = _.find(expiringTowers, t => t.getCapacity(RESOURCE_ENERGY) > 0);
        //
        //         if (structure) {
        //             const capacity = structure.getCapacity(RESOURCE_ENERGY);
        //
        //             if (capacity > 0) {
        //                 return {
        //                     from: this.getStructures([terminal, storage, factory], RESOURCE_ENERGY, capacity),
        //                     to: { id: structure.id, capacity },
        //                     resourceType: RESOURCE_ENERGY
        //                 };
        //             }
        //         }
        //     }
        // }
        //
        // if (this.room.energyAvailable < this.room.energyCapacityAvailable) {
        //     const structures = this.room.extensions.concat(this.room.spawns);
        //     const structure = _.find(structures, s => s.getCapacity(RESOURCE_ENERGY) > 0);
        //
        //     if (structure) {
        //         const capacity = structure.getCapacity(RESOURCE_ENERGY);
        //
        //         if (capacity > 0) {
        //             return {
        //                 from: this.getStructures([terminal, storage, factory], RESOURCE_ENERGY, capacity),
        //                 to: { id: structure.id, capacity },
        //                 resourceType: RESOURCE_ENERGY
        //             };
        //         }
        //     }
        //
        // //     structures = _.filter(this.room.carrierStructures, this.filterStructures.bind(this));
        // //
        // //     if (structures.length > 0) {
        // //         return structures;
        // //     }
        // }
        //
        // return null;
    }

    static processFromState(task) {
        const resourceType = task.resourceType;
        let structure = null;

        if (task.from) {
            structure = Game.getObjectById(task.from.id);
        }

        if (!structure || !task.from) {
            structure = this.getNearestStructureByResource(this.getCarrierStructuresFrom(), resourceType);

            if (structure) {
                const resourceAmount = structure.getResourceAmount(resourceType);
                const amount = Math.min(resourceAmount, this.creep.store.getFreeCapacity());

                structure.requestResource({ creep: this.creep.name, resourceType, amount });

                task.from = { id: structure.id, amount };
            } else if (!this.creep.isEmpty()) {
                task.state = 'to';

                return task.state;
            } else {
                this.clearTask(task);

                return null;
            }
        }

        const amount = task.from.amount;
        const result = this.creep.withdraw(structure, resourceType, amount);

        if (result === OK) {
            structure.releaseResource({ creep: this.creep.name, resourceType, amount });

            if (!task.to) {
                this.clearTask(task);

                return null;
            }

            if (amount >= task.to.amount) {
                delete task.from;
            }

            task.state = 'to';

            return task.state;
        } else if (result === ERR_NOT_IN_RANGE) {
            this.moveToStructure(structure, task);
        }

        return null;
    }

    static processToState(task) {
        const to = task.to;
        const structure = Game.getObjectById(to.id);

        if (!structure) {
            this.clearTask(task);

            return null;
        }

        const resourceType = task.resourceType;
        const amount = Math.min(this.creep.store[resourceType], to.amount);
        let result = ERR_NOT_ENOUGH_RESOURCES;

        if (amount > 0) {
            result = this.creep.transfer(structure, resourceType, amount);
        }

        if (result === OK) {
            if (task.amount > amount) {
                task.amount -= amount;

                structure.releaseCapacity({ creep: this.creep.name, resourceType, amount });
            } else {
                // let nextTask = null;
                //
                // if (this.creep.store[resourceType] - amount > 100) {
                //     nextTask = this.findTask();
                //
                //     if (nextTask) {
                //         this.initializeTask(nextTask);
                //
                //         console.log(JSON.stringify(task), JSON.stringify(nextTask));
                //     }
                // }

                this.clearTask(task);

                // if (nextTask && nextTask.state === 'to') {
                //     this.creep.memory.task = nextTask;
                //
                //     this.processToState(nextTask);
                // }
            }
        } else if (result === ERR_NOT_IN_RANGE) {
            this.moveToStructure(structure, task);
        } else if (result === ERR_NOT_ENOUGH_RESOURCES && amount === 0) {
            task.state = 'from';

            return task.state;
        } else if (result === ERR_FULL) {
            // TODO: положить ресурс обратно ?
            this.clearTask(task);
        }

        return null;
    }

}

module.exports = Carrier;
