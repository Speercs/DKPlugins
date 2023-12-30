
const RESOURCE_LIMIT = 4000;
const RESOURCE_ROOM_STANDARD_LIMIT = 30000;
const BATTERY_LIMIT = 15000;
const RESOURCE_LIMITS = {
    [RESOURCE_REDUCTANT]: 12500,
    [RESOURCE_OXIDANT]: 12500,
    [RESOURCE_UTRIUM_BAR]: 12500,
    [RESOURCE_LEMERGIUM_BAR]: 12500,
    [RESOURCE_KEANIUM_BAR]: 12500,
    [RESOURCE_ZYNTHIUM_BAR]: 12500,
    [RESOURCE_PURIFIER]: 12500,
    [RESOURCE_GHODIUM_MELT]: 12500,
};

//

class Factory {

    static run(room) {
        this.room = room;
        this.factory = room.factory;

        this.process();
    }

    static requestResource(resourceType, isT0, minAmount, needed) {
        return Shard.myRooms.some((room) => {
            if (room === this.room || !room.terminal || room.terminal.cooldown > 0 || room.terminal.isSending() || room.terminal.store[RESOURCE_ENERGY] < 5000 || room.store[RESOURCE_ENERGY] < 25000) {
                return false;
            }

            if (isT0 && room.memory.labReaction) {
                const CarrierLab = ModuleManager.get('role.carrierLab');

                if (CarrierLab && CarrierLab.REACTIONS[room.memory.labReaction].includes(resourceType) && room.store[resourceType] < 5000) {
                    return false;
                }
            }

            const resourceAmount = room.terminal.getResourceAmount(resourceType);
            const stored = room.store[resourceType];

            if (resourceAmount > 0 && (stored > needed && needed <= 50 || stored >= minAmount * 10 || !room.getFactoryComponents().includes(resourceType))) {
                const amount = Math.min(
                    (stored > needed * 5 ? needed * 5 : needed),
                    resourceAmount,
                    this.room.terminal.getCapacity(resourceType));

                if (amount > 0) {
                    return room.terminal.transfer(resourceType, amount, this.room.name, { initiator: 'factory' }) === OK;
                }
            }

            return false;
        });
    }

    static process() {
        if ((this.room.store[RESOURCE_ENERGY] < 150000 || this.factory.store[RESOURCE_ENERGY] === 0) && this.factory.store[RESOURCE_BATTERY] > 0) {
            if (this.factory.produce(RESOURCE_ENERGY) === OK) {
                return;
            }
        }

        let reactions = this.room.getFactoryReactions();

        if (this.factory.level === undefined) {
            reactions = _.sortBy(reactions, reaction => this.room.store[reaction]);
        }

        for (const reaction of reactions) {
            if (COMMODITIES[reaction].level > 0 && Shard.store[reaction] >= 1000 && !Resource.COMMON_COMMODITIES.includes(reaction)) {
                continue;
            }

            if (this.factory.store[reaction] < RESOURCE_LIMIT && this.room.store[reaction] < (RESOURCE_LIMITS[reaction] || RESOURCE_ROOM_STANDARD_LIMIT)) {
                const result = this.factory.produce(reaction);

                if (result === OK) {
                    if (COMMODITIES[reaction].level >= 1) {
                        console.log(`Produced ${COMMODITIES[reaction].amount} ${resourceImg(reaction)} in the room ${linkRoom(this.room)}`);
                    }

                    return;
                } else if (result === ERR_NOT_ENOUGH_RESOURCES /*&& Game.time % 3 !== 0*/ && !Shard.shard3 && this.room.terminal) {
                    const components = COMMODITIES[reaction].components;

                    for (const component in components) {
                        if (component === RESOURCE_ENERGY) {
                            continue;
                        }

                        if (Shard.store[component] - Shard.factoryStore[component] < components[component]) {
                            break;
                        }

                        const stored = this.room.store[component];
                        const needed = components[component] - stored;

                        if (needed > 0) {
                            const isT0 = Resource.T0.includes(component);
                            const minAmount = (isT0 ? 100 : 1);

                            if (this.room.terminal.getCapacity(component) >= minAmount) {
                                this.requestResource(component, isT0, minAmount, needed);
                            }
                        }
                    }
                }
            }
        }

        if (this.room.store[RESOURCE_ENERGY] > 200000 && this.factory.store[RESOURCE_BATTERY] < BATTERY_LIMIT) {
            if (this.factory.produce(RESOURCE_BATTERY) === OK) {
                return;
            }
        }

        // _.forEach(Resource.COMMODITIES, (reaction) => {
        //     if (this.room.store[reaction] < RESOURCE_ROOM_STANDARD_LIMIT && this.factory.store[reaction] < RESOURCE_LIMIT && !reactions.includes(reaction)) {
        //         const components = Object.keys(COMMODITIES[reaction].components);
        //         const component = components.find(component => component !== RESOURCE_ENERGY);
        //
        //         if (this.room.store[component] >= 15000 && this.factory.produce(reaction) === OK) {
        //             console.log(`Produce extra commodity: ${COMMODITIES[reaction].amount} ${resourceImg(reaction)}`);
        //
        //             return false;
        //         }
        //     }
        // });
    }

};

module.exports = Factory;
