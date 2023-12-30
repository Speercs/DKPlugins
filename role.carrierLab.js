
const RoleBase = ModuleManager.get('role.base');

//

class CarrierLab extends RoleBase {

    static run(creep) {
        this.creep = creep;
        this.room = creep.room;
        this.reaction = this.room.memory.labReaction;

        if (!this.reaction) {
            this.creep.wait(3);

            return;
        }

        this.labSource1 = this.room.labSource1;
        this.labSource2 = this.room.labSource2;

        if (!this.labSource1 || !this.labSource2) {
            this.creep.wait(3);

            return;
        }

        this.update();
    }

    // task methods

    static requestComponent(resourceType) {
        return Shard.myRooms.some((room) => {
            if (room === this.room || !room.terminal || room.terminal.cooldown > 0 || room.terminal.isSending() || room.terminal.store[RESOURCE_ENERGY] < 5000 || room.store[RESOURCE_ENERGY] < 25000) {
                return false;
            }

            const store = room.store[resourceType];

            if (store === 0) {
                return false;
            }

            if (room.memory.labReaction && CarrierLab.REACTIONS[room.memory.labReaction].includes(resourceType) && store < 5000) {
                return false;
            }

            const amount = room.terminal.getResourceAmount(resourceType);

            if (amount > 0 && room.terminal.transfer(resourceType, Math.min(3000, amount), this.room.name, { initiator: 'carrierLab' }) === OK) {
                return true;
            }

            return false;
        });
    }

    static findTask() {
        const terminal = this.room.terminal;
        const storage = this.room.storage;

        if (!terminal || !storage) {
            this.creep.wait(10);

            return null;
        }

        if (!this.creep.isEmpty()) {
            const resourceType = this.creep.store.getFirst();
            const structure = this.getNearestStructureByCapacity([terminal, storage], resourceType);

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

            return null;
        }

        if (this.creep.ticksToLive <= 10) {
            this.creep.wait(this.creep.ticksToLive);

            // TODO: suicide
            // return {
            //     state: 'suicide'
            // };

            return null;
        }

        const components = CarrierLab.REACTIONS[this.reaction];
        const reactionAmount = this.room.memory.labReactionAmount;
        const canTransferComponents = (reactionAmount === undefined || this.room.store[this.reaction] < reactionAmount);
        const creepCapacity = this.creep.store.getCapacity();
        let resourceOutCapacity = creepCapacity;

        for (let i = 0; i < 2; i++) {
            const component = components[i];
            const lab = this['labSource' + (i + 1)];
            const labMineral = lab.mineralType;

            if (canTransferComponents && (component === labMineral || !labMineral)) {
                const capacity = lab.getCapacity(component);

                if (capacity >= creepCapacity) {
                    const structure = this.getNearestStructureByResource(
                        [terminal, storage, ...this.room.filteredLabs], component);

                    if (structure) {
                        const store = structure.getResourceAmount(component);
                        const amount = Math.min(creepCapacity, store);

                        if (amount > 0) {
                            return {
                                to: { id: lab.id, amount },
                                from: { id: structure.id, amount },
                                resourceType: component
                            };
                        }
                    } else if (this.room.store[component] <= 3000 && this.requestComponent(component)) {
                        return null;
                    } else {
                        if (lab.store[component] < LAB_REACTION_AMOUNT) {
                            resourceOutCapacity = 1;
                        }

                        // TODO: покупать на рынке ?
                    }
                }
            } else if (labMineral) {
                const mineralAmount = lab.getResourceAmount(labMineral);

                if (mineralAmount > 0) {
                    const structure = this.getNearestStructureByCapacity([terminal, storage], labMineral);

                    if (structure) {
                        const store = structure.getCapacity(labMineral);
                        const amount = Math.min(creepCapacity, mineralAmount, store);

                        if (amount > 0) {
                            return {
                                to: { id: structure.id, amount },
                                from: { id: lab.id, amount },
                                resourceType: labMineral
                            };
                        }
                    }
                }
            }
        }

        if (!canTransferComponents) {
            resourceOutCapacity = 1;
        }

        let labs = this.room.filteredLabs.filter(
            lab => lab.mineralType && lab.mineralType !== this.reaction);

        for (let i = 0; i < labs.length; i++) {
            const lab = labs[i];
            const labMineral = lab.mineralType;
            const mineralAmount = lab.getResourceAmount(labMineral);

            if (mineralAmount > 0) {
                const structure = this.getNearestStructureByCapacity([terminal, storage], labMineral);

                if (structure) {
                    const capacity = structure.getCapacity(labMineral);
                    const amount = Math.min(creepCapacity, mineralAmount, capacity);

                    if (amount > 0) {
                        return {
                            to: { id: structure.id, amount },
                            from: { id: lab.id, amount },
                            resourceType: labMineral
                        };
                    }
                }
            }
        }

        labs = this.room.filteredLabs.filter(lab => lab.mineralType === this.reaction
            && lab.getResourceAmount(this.reaction) >= resourceOutCapacity);

        if (labs.length > 0) {
            labs.sort((a, b) =>
                b.getResourceAmount(this.reaction) - a.getResourceAmount(this.reaction));

            let structure = null;

            if (terminal && terminal.getCapacity(this.reaction) > 0) {
                structure = terminal;
            } else if (storage && storage.getCapacity(this.reaction) > 0) {
                structure = storage;
            }

            if (structure) {
                const lab = labs[0];
                const capacity = structure.getCapacity(this.reaction);
                const amount = Math.min(creepCapacity, lab.getResourceAmount(this.reaction), capacity);

                if (amount > 0) {
                    return {
                        to: { id: structure.id, amount },
                        from: { id: lab.id, amount },
                        resourceType: this.reaction
                    };
                }
            }
        }

        this.creep.wait(
            Math.min(25, this.creep.ticksToLive,
                Math.ceil(creepCapacity / LAB_REACTION_AMOUNT * REACTION_TIME[this.reaction] / 4)));

        return null;
    }

}

CarrierLab.REACTIONS = {
    [RESOURCE_GHODIUM]:                 [RESOURCE_UTRIUM_LEMERGITE, RESOURCE_ZYNTHIUM_KEANITE],
    [RESOURCE_HYDROXIDE]:               [RESOURCE_OXYGEN, RESOURCE_HYDROGEN],
    [RESOURCE_ZYNTHIUM_KEANITE]:        [RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM],
    [RESOURCE_UTRIUM_LEMERGITE]:        [RESOURCE_UTRIUM, RESOURCE_LEMERGIUM],
    UH:                                 [RESOURCE_UTRIUM, RESOURCE_HYDROGEN],
    UO:                                 [RESOURCE_UTRIUM, RESOURCE_OXYGEN],
    KH:                                 [RESOURCE_KEANIUM, RESOURCE_HYDROGEN],
    KO:                                 [RESOURCE_KEANIUM, RESOURCE_OXYGEN],
    LH:                                 [RESOURCE_LEMERGIUM, RESOURCE_HYDROGEN],
    LO:                                 [RESOURCE_LEMERGIUM, RESOURCE_OXYGEN],
    ZH:                                 [RESOURCE_ZYNTHIUM, RESOURCE_HYDROGEN],
    ZO:                                 [RESOURCE_ZYNTHIUM, RESOURCE_OXYGEN],
    GH:                                 [RESOURCE_GHODIUM, RESOURCE_HYDROGEN],
    GO:                                 [RESOURCE_GHODIUM, RESOURCE_OXYGEN],
    UH2O:                               ['UH', RESOURCE_HYDROXIDE],
    UHO2: ['UO', RESOURCE_HYDROXIDE],
    KH2O: ['KH', RESOURCE_HYDROXIDE],
    KHO2: ['KO', RESOURCE_HYDROXIDE],
    LH2O: ['LH', RESOURCE_HYDROXIDE],
    LHO2: ['LO', RESOURCE_HYDROXIDE],
    ZH2O: ['ZH', RESOURCE_HYDROXIDE],
    ZHO2: ['ZO', RESOURCE_HYDROXIDE],
    GH2O: ['GH', RESOURCE_HYDROXIDE],
    GHO2: ['GO', RESOURCE_HYDROXIDE],
    XUH2O:  ['UH2O', RESOURCE_CATALYST],
    XUHO2: ['UHO2', RESOURCE_CATALYST],
    XKH2O: ['KH2O', RESOURCE_CATALYST],
    XKHO2: ['KHO2', RESOURCE_CATALYST],
    XLH2O: ['LH2O', RESOURCE_CATALYST],
    XLHO2: ['LHO2', RESOURCE_CATALYST],
    XZH2O: ['ZH2O', RESOURCE_CATALYST],
    XZHO2: ['ZHO2', RESOURCE_CATALYST],
    XGH2O: ['GH2O', RESOURCE_CATALYST],
    XGHO2: ['GHO2', RESOURCE_CATALYST]
};

module.exports = CarrierLab;
