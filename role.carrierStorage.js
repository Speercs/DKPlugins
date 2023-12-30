
const RoleBase = require('role.base');

class CarrierStorage extends RoleBase {

    static getTravelOptions(task) {
        return { ...RoleBase.getTravelOptions(task), maxOps: 1000, ...task.options };
    }

    static findTask() {
        const storage = this.room.storage;
        const terminal = this.room.terminal || this.room.ruins.find(
            r => r.structure.structureType === STRUCTURE_TERMINAL);

        if (!storage || !terminal) {
            this.creep.wait(5);

            return null;
        }

        if (!this.creep.isEmpty()) {
            const resourceType = this.creep.store.getFirst();
            const structure = this.findStructureByCapacity([storage, terminal], resourceType);

            if (structure) {
                const amount = Math.min(this.creep.store[resourceType], structure.getCapacity(resourceType));

                if (amount > 0) {
                    return {
                        to: { id: structure.id, amount },
                        resourceType,
                        state: 'to'
                    };
                }
            }
        }

        if (this.creep.ticksToLive <= 15) {
            this.newRole = 'recycler';

            return null;
        }

        let resourceType = this.creep.memory.resourceType || this.creep.nameParts[1] || RESOURCE_ENERGY;

        if (resourceType === 'ALL') {
            let resources = Object.keys(terminal.store).filter(resource => terminal.getResourceAmount(resource) > 0);

            if (this.creep.memory.factory) {
                const factory = this.room.factory;

                if (factory) {
                    resources = _.uniq(resources.concat(Object.keys(factory.store)));
                }
            }

            resourceType = _.last(resources);
        } else if (Resource[resourceType]) {
            let resources = Object.keys(terminal.store);

            if (this.creep.memory.factory) {
                const factory = this.room.factory;

                if (factory) {
                    resources = _.uniq(resources.concat(Object.keys(factory.store)));
                }
            }

            resourceType = Resource[resourceType].find(resource => resources.includes(resource));
        }

        if (terminal.getResourceAmount(resourceType) > 0 && this.creep.pos.getRangeTo(terminal) * 2.5 <= this.creep.ticksToLive) {
            const capacity = storage.getCapacity(resourceType);

            if (capacity > 0) {
                const amount = Math.min(
                    this.creep.store.getFreeCapacity(), capacity, terminal.getResourceAmount(resourceType));

                if (amount > 0) {
                    return {
                        from: { id: terminal.id, amount },
                        to: { id: storage.id, amount },
                        resourceType
                    };
                }
            }
        }

        if (this.creep.memory.factory) {
            const factory = this.room.factory;

            if (factory && factory.getResourceAmount(resourceType) > 0 && this.creep.pos.getRangeTo(factory) * 2.5 <= this.creep.ticksToLive) {
                const capacity = storage.getCapacity(resourceType);

                if (capacity > 0) {
                    const amount = Math.min(
                        this.creep.store.getFreeCapacity(), capacity, factory.getResourceAmount(resourceType));

                    if (amount > 0) {
                        return {
                            from: { id: factory.id, amount },
                            to: { id: storage.id, amount },
                            resourceType
                        };
                    }
                }
            }
        }

        this.creep.wait(5);

        return null;
    }

}

module.exports = CarrierStorage;
