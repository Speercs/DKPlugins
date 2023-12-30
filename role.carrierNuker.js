
const RoleBase = ModuleManager.get('role.base');

//

module.exports = class CarrierNuker extends RoleBase {

    static findTask() {
        if (this.room.level < 7) {
            this.newRole = 'recycler';

            return null;
        }

        if (!this.creep.isEmpty()) {
            const resourceType = this.creep.store.getFirst();
            const structure = this.findStructureByCapacity(
                [this.room.nuker, this.room.terminal, this.room.storage], resourceType);

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

        const nuker = this.room.nuker;

        if (!nuker) {
            this.creep.wait(25);

            return null;
        }

        if (nuker.getCapacity(RESOURCE_GHODIUM) > 0) {
            const structure = this.findStructureByResource(
                [this.room.terminal, this.room.storage, this.room.factory], RESOURCE_GHODIUM);

            if (structure) {
                const amount = Math.min(
                    structure.getResourceAmount(RESOURCE_GHODIUM),
                    nuker.getCapacity(RESOURCE_GHODIUM), this.creep.store.getCapacity());

                if (amount > 0) {
                    return {
                        from: { id: structure.id, amount },
                        to: { id: nuker.id, amount },
                        resourceType: RESOURCE_GHODIUM
                    };
                }
            }
        }

        if (this.room.store[RESOURCE_ENERGY] >= 35000 && nuker.getCapacity(RESOURCE_ENERGY) > 0) {
            const structure = this.findStructureByResource(
                [this.room.terminal, this.room.storage], RESOURCE_ENERGY);

            if (structure) {
                const amount = Math.min(
                    structure.getResourceAmount(RESOURCE_ENERGY),
                    nuker.getCapacity(RESOURCE_ENERGY), this.creep.store.getCapacity());

                if (amount > 0) {
                    return {
                        from: { id: structure.id, amount },
                        to: { id: nuker.id, amount },
                        resourceType: RESOURCE_ENERGY
                    };
                }
            }
        }

        this.creep.wait(3);

        return null;
    }

}
