
const RoleBase = ModuleManager.get('role.base');

//

module.exports = class RoleMarauder extends RoleBase {

    static findTask() {
        const roomName = this.creep.room.name;
        const from = this.creep.memory.from || this.creep.nameParts[1];
        let to = this.creep.memory.to;

        if (!to) {
            to = this.creep.nameParts[2];

            if (!to || !Room.isRoomName(to)) {
                to = this.creep.initialRoom;
            }
        }

        if (roomName === from) {
            if (!this.creep.isFull()) {
                let resourceType = this.creep.memory.resourceType || this.creep.nameParts[3] || this.creep.nameParts[2] || RESOURCE_ENERGY;

                if (resourceType !== RESOURCE_ENERGY && Room.isRoomName(resourceType)) {
                    resourceType = RESOURCE_ENERGY;
                }

                if (resourceType !== RESOURCE_ENERGY) {
                    let resources = [];

                    if (this.room.terminal) {
                        resources = resources.concat(
                            Object.keys(this.room.terminal.store)
                                   .filter(resource => this.room.terminal.getResourceAmount(resource) > 0));
                    }

                    if (this.room.storage) {
                        resources = resources.concat(
                            Object.keys(this.room.storage.store)
                                   .filter(resource => this.room.storage.getResourceAmount(resource) > 0));
                    }

                    if (this.room.factory) {
                        resources = resources.concat(
                            Object.keys(this.room.factory.store)
                                   .filter(resource => this.room.factory.getResourceAmount(resource) > 0));
                    }

                    if (this.room.containers.length > 0) {
                        this.room.containers.forEach((container) => {
                            resources = resources.concat(
                                Object.keys(container.store)
                                       .filter(resource => container.getResourceAmount(resource) > 0));
                        });
                    }

                    if (this.room.labs.length > 0) {
                        this.room.labs.forEach((lab) => {
                            resources = resources.concat(
                                Object.keys(lab.store)
                                       .filter(resource => lab.getResourceAmount(resource) > 0));
                        });
                    }

                    if (this.room.tombstones.length > 0) {
                        this.room.tombstones.forEach((tombstone) => {
                            resources = resources.concat(
                                Object.keys(tombstone.store)
                                       .filter(resource => tombstone.getResourceAmount(resource) > 0));
                        });
                    }

                    if (this.room.ruins.length > 0) {
                        this.room.ruins.forEach((ruin) => {
                            resources = resources.concat(
                                Object.keys(ruin.store)
                                       .filter(resource => ruin.getResourceAmount(resource) > 0));
                        });
                    }

                    resources = _.uniq(resources);

                    if (resourceType === 'ALL') {
                        if (resources.length > 1 && resources.includes(RESOURCE_ENERGY)) {
                            _.pull(resources, RESOURCE_ENERGY);

                            resources.unshift(RESOURCE_ENERGY);
                        }

                        resourceType = _.last(resources);
                    }  else if (Resource[resourceType]) {
                        resourceType = Resource[resourceType].find(resource => resources.includes(resource));
                    }
                }

                const structure = this.findStructureByResource(
                    this.room.containers.concat(
                        [this.room.storage, this.room.terminal, this.room.factory], this.room.labs,
                        this.room.tombstones, this.room.ruins), resourceType);

                if (structure) {
                    const amount = Math.min(
                        structure.getResourceAmount(resourceType), this.creep.store.getFreeCapacity());

                    if (amount > 0) {
                        return {
                            from: { id: structure.id, amount },
                            options: { avoidHostileCreeps: true },
                            resourceType
                        };
                    }
                } else if (!this.creep.isEmpty()) {
                    return { to, options: { avoidHostileCreeps: true }, state: 'travel' };
                }
            } else {
                return { to, options: { avoidHostileCreeps: true }, state: 'travel' };
            }
        } else if (roomName === to) {
            if (this.creep.isEmpty()) {
                if (this.creep.memory.suicide === 1) {
                     this.creep.suicide();

                     return null;
                }

                if (this.creep.memory.recycler === 1) {
                    this.newRole = 'recycler';

                    return null;
                }

                return { to: from, options: { avoidHostileCreeps: true }, state: 'travel' };
            } else {
                const resourceType = this.creep.store.getFirst();
                let structures = [];

                if (resourceType === RESOURCE_ENERGY) {
                    if (this.room.my) {
                        const links = this.room.links.filter(l => this.creep.pos.inRangeTo(l, 5));

                        structures = links.filter(l => l.getCapacity(RESOURCE_ENERGY) > 0);

                        if (structures.length === 0) {
                            structures = links.filter(l => l.cooldown > 0 && l.cooldown <= 13 || l.cooldown === 0 && l.getCapacity(RESOURCE_ENERGY) === 0);
                        }

                        if (structures.length === 0) {
                            structures = this.room.links.filter(l => l.getCapacity(RESOURCE_ENERGY) > 0);
                        }

                        if (structures.length === 0) {
                            structures = [this.room.storage, this.room.terminal, this.room.factory]
                                .concat(this.room.containers)
                                .filter(s => s && s.getCapacity(RESOURCE_ENERGY) > 0);
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
                                options: { avoidHostileCreeps: true },
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
                options: { avoidHostileCreeps: true },
                state: 'travel'
            };
        }

        this.creep.wait(3);

        return null;
    }

}
