
const RoleBase = require('role.base');

class CarrierTerminal extends RoleBase {

    static getTravelOptions(task) {
        return { ...RoleBase.getTravelOptions(task), maxOps: 1000, ...task.options };
    }

    static findTask() {
        if (this.creep.ticksToLive <= 10) {
            return null;
        }

        const storage = this.room.storage || this.room.ruins.find(
            r => r.structure.structureType === STRUCTURE_STORAGE);
        const terminal = this.room.terminal;

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

        let resourceType = this.creep.nameParts[1] || RESOURCE_ENERGY;

        if (resourceType === 'ALL') {
            let resources = Object.keys(storage.store).filter(resource => storage.getResourceAmount(resource) > 0);

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

        if (storage.getResourceAmount(resourceType) > 0) {
            const capacity = terminal.store.getFreeCapacity();

            if (capacity > 0) {
                const amount = Math.min(
                    this.creep.store.getFreeCapacity(), capacity, storage.getResourceAmount(resourceType));

                if (amount > 0) {
                    return {
                        from: { id: storage.id, amount },
                        to: { id: terminal.id, amount },
                        resourceType
                    };
                }
            }
        }

        if (this.creep.memory.factory) {
            const factory = this.room.factory;

            if (factory && factory.getResourceAmount(resourceType) > 0) {
                const capacity = terminal.store.getFreeCapacity();

                if (capacity > 0) {
                    const amount = Math.min(
                        this.creep.store.getFreeCapacity(), capacity, factory.getResourceAmount(resourceType));

                    if (amount > 0) {
                        return {
                            from: { id: factory.id, amount },
                            to: { id: terminal.id, amount },
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

module.exports = CarrierTerminal;
