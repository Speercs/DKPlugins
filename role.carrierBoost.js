
const RoleBase = ModuleManager.get('role.base');

class CarrierBoost extends RoleBase {

    static findTask() {
        if (this.creep.ticksToLive < 50) {
            this.newRole = 'recycler';

            return null;
        }

        const mode = this.creep.memory.mode || 'in';
        let boosts = ['XLH2O', 'XLHO2', 'XZH2O', 'XZHO2', 'XGHO2', 'XKHO2', 'XUH2O', 'XGH2O'];

        if (this.room.level < 8) {
            boosts = ['XGH2O', 'XLH2O'];
        }

        if (!this.creep.isEmpty()) {
            const resourceType = this.creep.store.getFirst();
            const structure = this.getNearestStructureByCapacity(
                [this.room.terminal, this.room.storage, ...this.room.labs.filter(l => l.mineralType === resourceType)], resourceType);

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

        if (boosts.length === 0) {
            this.creep.wait(10);

            return null;
        }

        const labs = this.room.labs;

        for (let i = 0; i < labs.length; i++) {
            const lab = labs[i];
            const boost = boosts[i];

            if (!lab) {
                continue;
            }

            const mineralType = lab.mineralType;
            const mineralAmount = lab.store[mineralType] || 0;
            const resourceType = mineralType || boost;

            if (mode === 'in' && (mineralAmount === 0 || mineralType === boost)) {
                const capacity = lab.getCapacity(resourceType);

                if (capacity > 0) {
                    const structure = this.getNearestStructureByResource(
                        [this.room.terminal, this.room.storage], resourceType);

                    if (structure) {
                        const amount = Math.min(
                            capacity, structure.getResourceAmount(resourceType), this.creep.store.getCapacity());

                        if (amount > 0) {
                            return {
                                from: { id: structure.id, amount },
                                to: { id: lab.id, amount },
                                resourceType
                            };
                        }
                    }
                }

                const energyCapacity = lab.getCapacity(RESOURCE_ENERGY);

                if (energyCapacity > 0) {
                    const structure = this.getNearestStructureByResource(
                        [this.room.terminal, this.room.storage], RESOURCE_ENERGY);

                    if (structure) {
                        const amount = Math.min(
                            energyCapacity, structure.getResourceAmount(RESOURCE_ENERGY), this.creep.store.getCapacity());

                        if (amount > 0) {
                            return {
                                from: { id: structure.id, amount },
                                to: { id: lab.id, amount },
                                resourceType: RESOURCE_ENERGY
                            };
                        }
                    }
                }
            } else if (mineralAmount > 0 && (mode === 'out' || mineralType !== boost)) {
                const structure = this.getNearestStructureByCapacity(
                    [this.room.terminal, this.room.storage], mineralType);

                if (structure) {
                    const amount = Math.min(
                        mineralAmount, structure.getCapacity(mineralType), this.creep.store.getCapacity());

                    if (amount > 0) {
                        return {
                            from: { id: lab.id, amount },
                            to: { id: structure.id, amount },
                            resourceType: mineralType
                        };
                    }
                }
            }
        }

        if (this.room.level < 8 && this.room.energyAvailable < this.room.energyCapacityAvailable) {
            const spawn = this.room.spawns[1];

            if (spawn) {
                const capacity = spawn.getCapacity(RESOURCE_ENERGY);

                if (capacity > 0) {
                    const structure = this.findStructureByResource([this.room.terminal], RESOURCE_ENERGY);

                    if (structure) {
                        const amount = Math.min(
                            capacity, structure.getResourceAmount(RESOURCE_ENERGY), this.creep.store.getCapacity());

                        if (amount > 0) {
                            return {
                                from: { id: structure.id, amount },
                                to: { id: spawn.id, amount },
                                resourceType: RESOURCE_ENERGY
                            };
                        }
                    }
                }
            }
        }

        this.creep.wait(10);

        return null;
    }

}

module.exports = CarrierBoost;
