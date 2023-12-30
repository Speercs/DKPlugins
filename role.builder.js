
const RoleBase = ModuleManager.get('role.base');

class Builder2 extends RoleBase {

    static findTask(ignoredConstructionSite) {
        if (!this.creep.isFull()) {
            let structure = this.getNearestStructureByResource(
                [this.room.terminal, this.room.storage, this.room.factory, ...this.room.containers], RESOURCE_ENERGY);

            // if (!structure) {
            //     structure = this.getNearestStructureByResource(this.room.droppedResources, RESOURCE_ENERGY);
            // }

            // if (!structure) {
            //     structure = this.getNearestStructureByResource(this.room.tombstones, RESOURCE_ENERGY);
            // }

            // (!structure) {
            //     structure = this.getNearestStructureByResource(this.room.ruins, RESOURCE_ENERGY);
            // }

            // if (!this.my || this.level <= 4) {
            //     if (this.room.nuker) {
            //         // TODO: dismantle ?
            //     }
            // }

            // if (this.room.level >= 5 && (this.room.storage || this.room.terminal)) {
            //     structures = _.filter(storages.concat(terminals), this.filterStructures.bind(this, 0));
            //
            //     if (structures.length > 0) {
            //         return structures;
            //     } else {
            //         if (this.room.storage) {
            //             structures = _.filter(storages, this.filterStructures.bind(this, 0));
            //
            //             if (structures.length > 0) {
            //                 return structures;
            //             }
            //         } else {
            //             structures = _.filter(terminals, this.filterStructures.bind(this, 0));
            //
            //             if (structures.length > 0) {
            //                 return structures;
            //             }
            //         }
            //     }
            // }
            //
            // structures = containers;
            //
            // if (this.room.storage) {
            //     structures = structures.concat([this.room.storage]);
            // }
            //
            // if (this.room.terminal) {
            //     structures = structures.concat([this.room.terminal]);
            // }
            //
            // if ((!this.room.my || this.room.level <= 2) && containers.length < 2) {
            //     const resources = _.filter(this.room.droppedResources, this.filterResources.bind(this, 0));
            //
            //     if (resources.length > 0) {
            //         return resources;
            //     }
            // }
            //
            // return _.filter(structures, this.filterStructures.bind(this, 0));

            if (structure) {
                const amount = Math.min(this.creep.store.getFreeCapacity(), structure.getResourceAmount(RESOURCE_ENERGY));

                if (amount > 0) {
                    return {
                        from: { id: structure.id, amount },
                        resourceType: RESOURCE_ENERGY
                    };
                }

                this.creep.wait(3);

                return null;
            }
        }

        const constructionSites = _.filter(this.room.constructionSites, c => c.my && c.id !== ignoredConstructionSite);

        // if (constructionSites.length === 0) {
        //     if (this.room.my) {
        //         if (this.room.level >= 6) {
        //             this.newRole = 'ramparter';
        //
        //             this.creep.memory.workerStructureType = STRUCTURE_RAMPART;
        //
        //             return null;
        //         }
        //     } else {
        //         this.newRole = 'traveler';
        //
        //         this.creep.memory.roleForGetter = 'builder';
        //         this.creep.targetFlag = this.creep.initialRoom;
        //     }
        //
        //     return null;
        // }

        const constructionSite = this.creep.pos.findClosestByPath(constructionSites);

        if (constructionSite) {
            return {
                to: {
                    id: constructionSite.id,
                    structureType: constructionSite.structureType,
                    progress: constructionSite.progress,
                    progressTotal: constructionSite.progressTotal
                },
                state: 'build'
            };
        }

        this.creep.wait(3);

        return null;
    }

}

const RoleBase2 = ModuleManager.get('role.base.builder');

class Builder3 extends RoleBase2 {

    static findBuildTask() {
        const construction = this.findConstructionSite();

        if (construction) {
            return {
                id: construction.id,
                structureType: construction.structureType,
                progress: constructionSite.progress,
                progressTotal: constructionSite.progressTotal
            };
        }

        return null;
    }

}

function Builder() {}

Builder.run = function(creep) {
    this.creep = creep;
    this.room = creep.room;
    this.newRole = null;

    this.update();

    return this.newRole;
};

Builder.findConstructionSite = function() {
    let constructions = this.cache.get('constructions', () => this.room.find(FIND_MY_CONSTRUCTION_SITES));

    if (constructions.length === 0) {
        return null;
    }

    if (this.room.my) {
        if (this.room.level === 8) {

        }
    } else {

    }

    return null;
};

Builder.findTask = function(ignoredConstructionSite) {
    if (this.creep.store[RESOURCE_ENERGY] === 0) {
        this.newRole = 'getter';

        return;
    }

    const constructionSites = _.filter(this.room.constructionSites, c => c.my && c.id !== ignoredConstructionSite);

    if (constructionSites.length === 0) {
        if (this.room.my) {
            if (this.room.level >= 6) {
                this.newRole = 'ramparter';

                this.creep.memory.workerStructureType = STRUCTURE_RAMPART;
            }
        } else {
            this.newRole = 'traveler';

            this.creep.memory.roleForGetter = 'builder';
            this.creep.targetFlag = this.creep.initialRoom;

            if (this.room.isReservedByMe) {
                const around = this.room.around(2, { reservedByMe: true });

                for (const roomName of around) {
                    const room = Game.rooms[roomName];

                    if (room.constructionSites.some(c => c.my)) {
                        this.creep.targetFlag = roomName;

                        break;
                    }
                }
            }
        }

        return null;
    }

    const constructionSite = this.creep.pos.findClosestByPath(constructionSites, {
        ignoreCreeps: true,
        range: 2
    });

    if (constructionSite) {
        return {
            id: constructionSite.id,
            structureType: constructionSite.structureType,
            progress: constructionSite.progress,
            progressTotal: constructionSite.progressTotal
        };
    }

    this.creep.wait(3);

    return null;
};

Builder.processTask = function(task) {
    const construction = Game.getObjectById(task.id);

    if (construction) {
        if (construction.room.name === this.creep.room.name) {
            const result = this.creep.build(construction);

            if (result === ERR_NOT_IN_RANGE) {
                this.creep.travelTo(construction, {
                    maxRooms: 1,
                    ignoreCreeps: false,
                    range: 3,
                });

                this.room.visual.circle(construction.pos, {
                    radius: 0.5,
                    stroke: '#D4F01D',
                    strokeWidth: .15,
                    opacity: 0.2
                });
            } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
                this.newRole = 'getter';
            } else if (result === OK) {
                task.structureType = construction.structureType;
                task.progress = construction.progress;

                delete this.creep.memory.trav;
            }
        } else {
            delete this.creep.memory.task;
        }
    } else {
        const event = _.find(this.room.getEventLog(), { event: EVENT_BUILD, data: { targetId: task.id } });

        if (event && task.progress + event.data.amount >= CONSTRUCTION_COST[task.structureType]) {
            this.room.cache.clearStructuresCache(task.structureType);

            global.Traveler.clearStructuresCache(this.room.name);
        }

        delete this.creep.memory.task;

        if (this.room.constructionSites.length > 0) {
            const newTask = this.findTask(task.id);

            if (newTask) {
                this.creep.memory.task = newTask;

                this.processTask(newTask);
            }
        }
    }
};

Builder.update = function() {
    // if ((this.creep.room.name === 'E40S10' || this.creep.room.name === 'E50S10') && Game.shard.name === 'shard2') {
    //     const portals = _.filter(this.creep.room.structures, structure => structure.structureType === STRUCTURE_PORTAL);
    //     const portal = _.find(portals, function(portal) {
    //         return portal.destination.shard === 'shard3';
    //     });
    //     if (portal) {
    //         this.creep.travelTo(portal);
    //     }
    //     try {
    //         let memory = JSON.parse(RawMemory.interShardSegment);
    //         memory[this.creep.name] = this.creep.memory;
    //         RawMemory.interShardSegment = JSON.stringify(memory);
    //     } catch(e) {
    //         try {
    //             let memory = {};
    //             memory[this.creep.name] = this.creep.memory;
    //             RawMemory.interShardSegment = JSON.stringify(memory);
    //         } catch (e) {
    //
    //         }
    //     }
    //
    //     return;
    // }

    // if (this.room.name === 'E40S10') {
    //     if (Game.shard.name === 'shard3') {
    //         this.creep.role = 'traveler';
    //
    //         if (this.creep.initialRoom === 'E38S9') {
    //             this.creep.targetFlag = 'E39S11';
    //         } else if (this.creep.initialRoom === 'E42S11') {
    //             this.creep.targetFlag = 'E39S11';
    //         }
    //
    //         return;
    //     }
    // }

    // if (this.room.name === 'E50S10') {
    //     if (Game.shard.name === 'shard3') {
    //         this.creep.role = 'traveler';
    //
    //         if (this.creep.initialRoom === 'E48S9') {
    //             this.creep.targetFlag = 'E49S9';
    //         } else if (this.creep.initialRoom === 'E47S14') {
    //             this.creep.targetFlag = 'E51S11';
    //         }
    //
    //         return;
    //     }
    // }

    // if (this.creep.room.name === 'E46S8') {
    //     const obj = Game.getObjectById('5a2fd78583b4e24930426e9e');
    //
    //     if (obj) {
    //         if (this.creep.dismantle(obj) === ERR_NOT_IN_RANGE) {
    //             this.creep.travelTo(obj);
    //         }
    //     }
    //     return;
    // }

    let task = this.creep.memory.task;

    if (!task) {
        task = this.findTask();

        if (task) {
            this.creep.memory.task = task;
        }

        if (this.newRole) {
            return;
        }
    }

    if (task) {
        this.processTask(task);
    }
};

module.exports = Builder;
