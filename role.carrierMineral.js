
const RoleBase = ModuleManager.get('role.base');

class CarrierMineral extends RoleBase {

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

        const resourceType = task.resourceType || RESOURCE_ENERGY;
        let amount = this.creep.store.getFreeCapacity();
        let result = null;

        if (target instanceof Resource) {
            result = this.creep.pickup(target);
        } else if (target instanceof Creep) {
            amount = Math.min(amount, target.store[resourceType]);

            result = target.transfer(this.creep, resourceType, amount);
        } else {
            if (target.store[resourceType] < amount && this.room.mineral.mineralAmount === 0) {
                amount = target.store[resourceType];
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
                this.creep.wait(5);
            }
        } else if (result === ERR_NOT_ENOUGH_RESOURCES || result === ERR_FULL) {
            this.clearTask(task);
        }

        return null;
    }

    static findTask() {
        if (this.creep.memory.mode === undefined && this.creep.isFull()) {
            this.creep.memory.mode = 'transfer';
        }

        if (this.creep.memory.mode === 'transfer') {
            if (!this.creep.isEmpty()) {
                const resourceType = this.creep.store.getFirst();
                const structure = this.findStructureByCapacity(
                    [this.room.terminal, this.room.storage], resourceType);

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

                this.creep.wait(3);

                return null;
            } else {
                delete this.creep.memory.mode;
            }
        }

        const resourceType = this.room.mineral.mineralType;
        const resource = this.room.droppedResources.find(
            resource => resource.resourceType === resourceType && resource.getResourceAmount(resourceType) >= 50);

        if (resource) {
            return {
                from: { id: resource.id, amount: resource.amount },
                resourceType
            };
        }

        let containerId = this.cache.get('containerId');
        let container = null;

        if (containerId) {
            container = Game.getObjectById(containerId);

            if (!container) {
                this.cache.set('containerId', null);

                containerId = null;
                container = null;
            }
        }

        if (!containerId) {
            container = this.room.containers.find(c => c.getResourceAmount(resourceType) > 0);
        }

        if (container) {
            const amount = Math.min(this.creep.store.getFreeCapacity(), container.getResourceAmount(resourceType));

            if (amount > 0) {
                this.cache.set('containerId', container.id);

                return {
                    from: { id: container.id, amount },
                    resourceType
                };
            }
        }

        const tombstone = this.room.tombstones.find(t => t.getResourceAmount(resourceType) > 0);

        if (tombstone) {
            const amount = Math.min(this.creep.store.getFreeCapacity(), tombstone.getResourceAmount(resourceType));

            if (amount > 0) {
                return {
                    from: { id: tombstone.id, amount },
                    resourceType
                };
            }
        }

        const mineral = this.room.mineral;

        if (mineral.mineralAmount > 0) {
            if (this.creep.isEmpty()) {
                if (!this.creep.pos.inRangeTo(mineral.pos, 2)) {
                    this.creep.travelTo(mineral, { range: 2 });
    
                    return null;
                }
            }
        } else {
            if (mineral.ticksToRegeneration >= this.creep.ticksToLive) {
                this.newRole = 'recycler';
            }
            
            return null;
        }

        this.creep.wait(3);

        return null;
    }

}

module.exports = CarrierMineral;
