
const RoleBase = ModuleManager.get('role.base');

class CarrierRoom extends RoleBase {

    static getTravelOptions(task) {
        return { ...RoleBase.getTravelOptions(task), avoidHostileCreeps: true };
    }

    static processFromState(task) {
        const from = task.from;

        if (!from) {
            this.clearTask(task);

            return null;
        }

        const target = Game.getObjectById(from.id);

        if (!target) {
            this.clearTask(task);

            return null;
        }

        if (this.creep.hits < this.creep.hitsMax) {
            this.healSelf();
        }

        const resourceType = task.resourceType || RESOURCE_ENERGY;
        let amount = this.creep.store.getFreeCapacity();
        let result = null;

        if (target instanceof Resource) {
            result = this.creep.pickup(target);
        } else if (target instanceof Creep) {
            amount = Math.min(amount, target.store[resourceType]);

            result = target.transfer(this.creep, resourceType, amount);
        } else {
            if (!(target instanceof Structure)) {
                amount = Math.min(amount, target.store[resourceType]);
            }

            result = this.creep.withdraw(target, resourceType, amount);
        }

        if (result === OK) {
            if (typeof target.releaseResource === 'function') {
                target.releaseResource({ creep: this.creep.name, resourceType, amount });
            }

            if (task.from.amount > amount) {
                task.from.amount -= amount;
            }

            if (!task.to) {
                this.clearTask(task);

                return null;
            }

            if (amount >= task.to.amount) {
                delete task.from;
            }

            task.state = 'to';

            return null;
        } else if (result === ERR_NOT_IN_RANGE) {
            this.moveToTarget(target, task);
        } else if (result === ERR_NOT_ENOUGH_RESOURCES && target.structureType === STRUCTURE_CONTAINER) {
            if (!this.creep.pos.isNearTo(target)) {
                this.moveToTarget(target, task);
            } else {
                this.creep.wait(6);
            }
        } else if (result === ERR_NOT_ENOUGH_RESOURCES || result === ERR_FULL) {
            this.clearTask(task);
        }

        return null;
    }

    static findTravelPath(to) {
        const flag = Game.flags[to];
        const destination = flag && flag.pos || new RoomPosition(25, 25, to);

        return this.findMovePath(destination);

        // const creepPos = this.creep.pos.encode();
        //
        // const destinationPos = destination.encode();
        // const data = _.get(this.PATHS, [creepPos, destinationPos]);
        //
        // if (data && data.expiredAt > Game.time) {
        //     return data.path;
        // }
        //
        // const pathData = Traveler.findTravelPath(this.creep.pos, destination, {
        //     ignoreCreeps: true,
        //     ignoreRoads: false,
        //     offRoad: false
        // }).path;
        //
        // const path = Traveler.serializePath(this.creep.pos, pathData, true, '#00bbff');
        //
        // if (!this.PATHS) {
        //     this.PATHS = {};
        // }
        //
        // _.set(this.PATHS, [creepPos, destinationPos], { path, expiredAt: Game.time + 1000 });
        //
        // return path;
    }

    static findMovePath(destination, options = {}) {
        const creepPos = this.creep.pos.encode();
        const destinationPos = destination.encode();
        const data = _.get(this.PATHS, [creepPos, destinationPos]);

        if (data && data.expiredAt > Game.time) {
            return data.path;
        }

        const pathData = Traveler.findTravelPath(this.creep.pos, destination, {
            ignoreCreeps: false,
            ignoreRoads: false,
            offRoad: false,
            ...options
        }).path;

        const path = Traveler.serializePath(this.creep.pos, pathData, true, '#00bbff');

        if (!this.PATHS) {
            this.PATHS = {};
        }

        _.set(this.PATHS, [creepPos, destinationPos], { path, expiredAt: Game.time + 100 });

        return path;
    }

    static findTask() {
        const roomName = this.creep.room.name;
        const from = this.creep.memory.from || this.creep.nameParts[1];
        const to = this.creep.memory.to || this.creep.nameParts[2] || this.creep.initialRoom;

        if (roomName === from) {
            if (!this.creep.isFull()) {
                let resourceType = this.creep.memory.resourceType || this.creep.nameParts[2] || RESOURCE_ENERGY;

                if (resourceType === to) {
                    resourceType = RESOURCE_ENERGY;
                }

                if (resourceType === RESOURCE_ENERGY) {
                    const creepFreeCapacity = this.creep.store.getFreeCapacity();
                    const resource = this.room.droppedEnergy.find(r => r.getResourceAmount(RESOURCE_ENERGY) >= creepFreeCapacity / 4);

                    if (resource) {
                        const amount = Math.min(creepFreeCapacity, resource.amount);

                        if (amount > 0) {
                            return {
                                from: { id: resource.id, amount },
                                resourceType
                            };
                        }
                    }
                }

                const structure = this.findStructureByResource(
                    this.room.containers.concat([this.room.storage, this.room.terminal], this.room.ruins, this.room.tombstones), resourceType);

                // if (this.room.isReservedByMe && this.room.containers.length === 1) {
                //     let containerId = this.cache.get('containerId');
                //
                //     if (containerId) {
                //         structure = Game.getObjectById(containerId);
                //
                //         if (!structure) {
                //             this.cache.set('containerId');
                //
                //             containerId = null;
                //         }
                //     }
                //
                //     if (!containerId) {
                //         structure = this.findStructureByResource(this.room.containers, resourceType);
                //
                //         if (structure) {
                //             this.cache.set('containerId', structure.id);
                //         }
                //     }
                // } else {
                //
                // }

                if (structure) {
                    // const path = this.findMovePath(structure.pos, { range: 0 });
                    //
                    // if (path) {
                    //     this.creep.memory.trav = { path };
                    // }

                    const amount = Math.min(
                        structure.getResourceAmount(resourceType), this.creep.store.getFreeCapacity());

                    if (amount > 0) {
                        return {
                            from: { id: structure.id, amount },
                            resourceType
                        };
                    }
                }

                if (this.creep.name.startsWith('carrierMineral')) {
                    const creep = this.room.creeps.find(c => c.store[resourceType] > 0 && (c.isFull() || c.store[resourceType] >= this.creep.store.getFreeCapacity()) && c.name.startsWith('minerMineral'));

                    if (creep) {
                        return {
                            from: { id: creep.id, amount: Math.min(creep.store[resourceType], this.creep.store.getFreeCapacity()) },
                            resourceType
                        };
                    }

                    const resource = this.room.droppedResources.find(r => r.resourceType === resourceType && (r.amount >= 100 || r.pos.isNearTo(this.creep.pos)));

                    if (resource) {
                        return {
                            from: { id: resource.id, amount: resource.amount },
                            resourceType
                        };
                    }

                    if (this.room.mineral.mineralAmount === 0 && this.room.mineral.ticksToRegeneration > this.creep.ticksToLive) {
                        this.newRole = 'recycler';

                        return null;
                    }
                }
            } else {
                // const path = this.findTravelPath(to);
                // let options = {};
                //
                // if (path) {
                //     this.creep.memory.trav = { path };
                //
                //     options = { repath: 0.01 };
                // }

                return {
                    to,
                    options: { avoidHostileCreeps: true },
                    state: 'travel'
                };
            }
        } else if (roomName === to) {
            if (this.creep.isEmpty()) {
                // const path = this.findTravelPath(from);
                // let options = {};
                //
                // if (path) {
                //     this.creep.memory.trav = { path };
                //
                //     options = { repath: 0.01 };
                // }

                return {
                    to: from,
                    options: { avoidHostileCreeps: true },
                    state: 'travel'
                };
            } else {
                const resourceType = this.creep.store.getFirst();
                let structures = [];

                if (resourceType === RESOURCE_ENERGY) {
                    if (this.room.my) {
                        const links = _.filter(this.room.links, link => this.creep.pos.inRangeTo(link, 5));

                        structures = _.filter(links, link => link.getCapacity(RESOURCE_ENERGY) > 0);

                        if (structures.length === 0) {
                            structures = _.filter(links, link => link.cooldown > 0 && link.cooldown <= 13 || link.cooldown === 0 && link.getCapacity(RESOURCE_ENERGY) === 0);
                        }

                        if (structures.length === 0) {
                            structures = _.filter(this.room.links, link => link.getCapacity(RESOURCE_ENERGY) > 0);
                        }

                        if (structures.length === 0) {
                            structures = [this.room.storage, this.room.terminal, this.room.factory]
                                .concat(this.room.containers)
                                .filter(s => s && s.getCapacity(RESOURCE_ENERGY) > 0);
                        }

                        if (this.room.name === 'E37S4' && from === 'E38S4') {
                            const container = this.room.containers.find(
                                c => c.pos.inRangeTo(this.room.controller, 4) && c.getCapacity(RESOURCE_ENERGY) > 0);

                            if (container) {
                                structures = [container];
                            }
                        }
                    } else {
                        structures = _.filter(this.room.containers, container => !container.isFull() && container.getCapacity(resourceType) > 0);
                    }
                } else {
                    structures = [this.room.terminal, this.room.storage].filter(s => s && s.getCapacity(resourceType) > 0);
                }

                if (structures.length > 0) {
                    const structure = this.creep.pos.findClosestByPath(structures, { ignoreCreeps: true, range: 1 });

                    if (structure) {
                        const capacity = structure.getCapacity(resourceType);

                        if (capacity > 0) {
                            return {
                                to: { id: structure.id, amount: Math.min(capacity, this.creep.store[resourceType]) },
                                resourceType,
                                state: 'to'
                            };
                        } else if (structure.structureType === STRUCTURE_LINK && structure.cooldown > 0) {
                            this.creep.wait(structure.cooldown);

                            return null;
                        }
                    }
                }

                this.creep.wait(3);

                return null;
            }
        } else {
            return {
                to: (this.creep.isEmpty() ? from : to),
                state: 'travel'
            };
        }

        this.creep.wait(3);

        return null;
    }

}

module.exports = CarrierRoom;
