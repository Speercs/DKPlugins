
const RoleBase = ModuleManager.get('role.base');

class Central extends RoleBase {

    /**
     * @param {Structure} structure
     *
     * @returns {RoomPosition | null}
     */
    static findPos() {
        return RoomPosition.findCommonPos(
            [this.room.storage, this.room.factory, this.room.powerSpawn, this.room.centralLink]);
    }

    /**
     * @param {Structure[]} structures
     * @param {String} resourceType
     * @param {Number} [amount=1]
     *
     * @returns {Structure | null}
     */
    static findStructureByResource(structures, resourceType, amount = 1) {
        const filtered = structures
            .filter(s => s && s.getResourceAmount(resourceType) >= amount && this.creep.pos.isNearTo(s));

        if (filtered.length > 1) {
            let structure = null;
            let maxAmount = 0;

            for (const s of filtered) {
                const resourceAmount = s.getResourceAmount(resourceType);

                if (resourceAmount > maxAmount) {
                    maxAmount = resourceAmount;
                    structure = s;
                }
            }

            return structure;
        }

        return filtered[0] || null;
    }

    static getTravelOptions(task) {
        return { ...RoleBase.getTravelOptions(task), maxOps: 1000, ...task.options };
    }

    static requestResource(resourceType, amount) {
        if (!this.room.terminal) {
            return false;
        }

        return Shard.myRooms.some((room) => {
            if (room.level < 8 || room.name === this.room.name || room.store[resourceType] <= 5000) {
                return false;
            }

            if (!room.terminal || room.terminal.cooldown > 0 || room.terminal.store[resourceType] === 0) {
                return false;
            }

            return room.terminal.transfer(
                resourceType, Math.min(amount, room.terminal.store[resourceType]), this.room.name) === OK;
        });
    }


    static findLinkTask() {
        if (this.creep.isEmpty()) {
            const link = this.room.centralLink;

            if (!link) {
                return null;
            }

            let amount = link.getResourceAmount(RESOURCE_ENERGY);

            if (amount >= 300) {
                let structure = null;

                if (!structure) {
                    const structures = [this.room.storage, this.room.terminal, this.room.factory];

                    if (Memory.powerEnabled && this.room.store[RESOURCE_ENERGY] >= 45000) {
                        structures.push(this.room.powerSpawn);
                    }

                    structure = this.findStructureByCapacity(structures, RESOURCE_ENERGY, amount);

                    if (!structure) {
                        structure = this.findStructureByCapacity(structures, RESOURCE_ENERGY);
                    }
                }

                // TODO: добавить игнорирование structure.getCapacity(RESOURCE_ENERGY) ниже
                // if (!structure) {
                //     const terminal = this.room.terminal;
                //
                //     if (terminal && terminal.store.getFreeCapacity() >= 10000) {
                //         structure = this.room.terminal;
                //     }
                // }

                if (structure) {
                    amount = Math.min(
                        this.creep.store.getFreeCapacity(), amount, structure.getCapacity(RESOURCE_ENERGY));

                    if (amount > 0) {
                        return {
                            from: { id: link.id, amount },
                            to: { id: structure.id, amount },
                            resourceType: RESOURCE_ENERGY
                        };
                    }
                }
            }

            return null;
        }

        return null;
    }

    static findPowerTask() {
        if (!Memory.powerEnabled) {
            return null;
        }

        const powerSpawn = this.room.powerSpawn;

        if (!powerSpawn) {
            return null;
        }

        const creepCapacity = this.creep.store.getCapacity();
        const effect = powerSpawn.getEffect(PWR_OPERATE_POWER) || { level: 0 };
        const powerAmount = powerSpawn.getResourceAmount(RESOURCE_POWER);

        if (powerAmount < (effect.level + 1) * 2) {
            const capacity = powerSpawn.getCapacity(RESOURCE_POWER);

            if (capacity > 0) {
                const structure = this.findStructureByResource(
                    [this.room.terminal, this.room.storage], RESOURCE_POWER);

                if (structure) {
                    const amount = Math.min(creepCapacity, capacity, structure.getResourceAmount(RESOURCE_POWER));

                    return {
                        from: { id: structure.id, amount },
                        to: { id: powerSpawn.id, amount },
                        resourceType: RESOURCE_POWER
                    };
                } else if (this.room.store[RESOURCE_POWER] < 1000) {
                    this.requestResource(RESOURCE_POWER, 1000);
                }
            }
        }

        if (this.room.store[RESOURCE_ENERGY] < 45000) {
            return null;
        }

        const capacity = powerSpawn.getCapacity(RESOURCE_ENERGY);
        const processing = (effect.level + 1) * POWER_SPAWN_ENERGY_RATIO;

        if (capacity + processing >= creepCapacity) {
            const storage = this.room.storage;
            let structure;

            if (storage && storage.getResourceAmount(RESOURCE_ENERGY) > 0) {
                structure = storage;
            } else {
                structure = this.findStructureByResource(
                    [this.room.terminal, this.room.factory], RESOURCE_ENERGY);
            }

            if (structure) {
                const amount = Math.min(
                    creepCapacity,
                    structure.getResourceAmount(RESOURCE_ENERGY));

                return {
                    from: { id: structure.id, amount },
                    to: { id: powerSpawn.id, amount },
                    resourceType: RESOURCE_ENERGY
                };
            }
        }

        return null;
    }

    static findFactoryTask() {
        const factory = this.room.factory;

        if (!factory) {
            return null;
        }

        const creepCapacity = this.creep.store.getCapacity();

        if (factory.getResourceAmount(RESOURCE_BATTERY) > factory.getLimit(RESOURCE_BATTERY)
            && (this.room.store[RESOURCE_ENERGY] > 100000 || this.room.store[RESOURCE_ENERGY] + factory.store[RESOURCE_BATTERY] * 10 > 125500)) {
            const structure = this.findStructureByCapacity(
                [this.room.storage, this.room.terminal], RESOURCE_BATTERY);

            if (structure) {
                const amount = Math.min(
                    creepCapacity,
                    structure.getCapacity(RESOURCE_BATTERY),
                    factory.getResourceAmount(RESOURCE_BATTERY) - factory.getLimit(RESOURCE_BATTERY));

                if (amount > 0) {
                    return {
                        from: { id: factory.id, amount },
                        to: { id: structure.id, amount },
                        resourceType: RESOURCE_BATTERY
                    };
                }
            }
        } else if (this.room.store[RESOURCE_ENERGY] < 100000) {
            const capacity = factory.getCapacity(RESOURCE_BATTERY);

            if (capacity >= 50) {
                if (factory.getResourceAmount(RESOURCE_BATTERY) === 0 || capacity >= creepCapacity) {
                    const structure = this.findStructureByResource(
                        [this.room.storage, this.room.terminal], RESOURCE_BATTERY);

                    if (structure) {
                        const amount = Math.min(
                            structure.getResourceAmount(RESOURCE_BATTERY),
                            factory.getCapacity(RESOURCE_BATTERY));

                        if (amount > 0) {
                            return {
                                from: { id: structure.id, amount },
                                to: { id: factory.id, amount },
                                resourceType: RESOURCE_BATTERY
                            };
                        }
                    }
                }
            }
        }

        if (factory.getResourceAmount(RESOURCE_ENERGY) >= factory.getLimit(RESOURCE_ENERGY) * 1.25) {
            if (factory.getResourceAmount(RESOURCE_ENERGY) - factory.getLimit(RESOURCE_ENERGY) * 1.25 >= creepCapacity) {
                const structure = this.findStructureByCapacity(
                    [this.room.storage, this.room.terminal], RESOURCE_ENERGY);

                if (structure) {
                    const amount = Math.min(
                        structure.getCapacity(RESOURCE_ENERGY),
                        factory.getResourceAmount(RESOURCE_ENERGY) - factory.getLimit(RESOURCE_ENERGY) * 1.25);

                    if (amount > 0) {
                        return {
                            from: { id: factory.id, amount },
                            to: { id: structure.id, amount },
                            resourceType: RESOURCE_ENERGY
                        };
                    }
                }
            }
        }

        if (factory.getCapacity(RESOURCE_ENERGY) >= creepCapacity && this.room.store[RESOURCE_ENERGY] >= 40000) {
            const storage = this.room.storage;

            if (storage && storage.getResourceAmount(RESOURCE_ENERGY) > 0) {
                const amount = Math.min(
                    factory.getCapacity(RESOURCE_ENERGY),
                    storage.getResourceAmount(RESOURCE_ENERGY));

                if (amount > 0) {
                    return {
                        from: { id: storage.id, amount },
                        to: { id: factory.id, amount },
                        resourceType: RESOURCE_ENERGY
                    };
                }
            }
        }

        return null;
    }

    static findBalanceTask() {
        if (this.room.level < 8) {
            return null;
        }

        const storage = this.room.storage;
        const terminal = this.room.terminal;

        if (!storage || !terminal || !this.creep.pos.isNearTo(terminal)) {
            return null;
        }

        const resources = _.uniq(Object.keys(storage.store).concat(Object.keys(terminal.store)));
        const creepCapacity = this.creep.store.getCapacity();

        for (const resourceType of resources) {
            const terminalLimit = terminal.getLimit(resourceType);
            const terminalAmount = terminal.getResourceAmount(resourceType);
            const terminalCapacity = terminal.getCapacity(resourceType);

            if (terminalAmount > terminalLimit && terminalAmount - terminalLimit > 0) {
                const storageCapacity = storage.getCapacity(resourceType);

                if (storageCapacity > 0) {
                    const amount = Math.min(
                        creepCapacity, storageCapacity, terminalAmount - terminalLimit);

                    if (amount > 0) {
                        return {
                            from: { id: terminal.id, amount },
                            to: { id: storage.id, amount },
                            resourceType
                        }
                    }
                }
            } else if (terminalAmount < terminalLimit && terminalLimit > 0 && terminalCapacity > 0) {
                const storageAmount = storage.getResourceAmount(resourceType);

                if (storageAmount > 0) {
                    const amount = Math.min(
                        creepCapacity, storageAmount, terminalCapacity, terminalLimit - terminalAmount);

                    if (amount > 0) {
                        return {
                            from: { id: storage.id, amount },
                            to: { id: terminal.id, amount },
                            resourceType
                        }
                    }
                }
            }
        }

        return null;
    }

    static findFactoryTask1() {
        if (this.room.level < 8 || !Memory.factoryEnabled) {
            return null;
        }

        const factory = this.room.factory;

        if (!factory) {
            return null;
        }

        const reactions = this.room.getFactoryReactions();
        const components = this.room.getFactoryComponents();
        const creepCapacity = this.creep.store.getCapacity();

        for (const component of components) {
            const capacity = factory.getCapacity(component);

            if (capacity > 0) {
                const structure = this.findStructureByResource(
                    [this.room.storage, this.room.terminal], component);

                if (structure) {
                    const amount = Math.min(creepCapacity, capacity, structure.getResourceAmount(component));

                    if (amount > 0) {
                        const reaction = _.min(reactions, r => COMMODITIES[r].components[component] || Number.MAX_SAFE_INTEGER);
                        const minAmount = reaction && COMMODITIES[reaction].components[component] || 0;

                        if (minAmount > 0 && factory.store[component] + amount >= minAmount) {
                            return {
                                from: { id: structure.id, amount },
                                to: { id: factory.id, amount },
                                resourceType: component
                            };
                        }
                    }
                }
            } else if (capacity < 0) {
                const structure = this.findStructureByCapacity(
                    [this.room.storage, this.room.terminal], component);

                if (structure) {
                    const amount = Math.min(creepCapacity, Math.abs(capacity), structure.getCapacity(component));

                    if (amount > 0) {
                        return {
                            from: { id: factory.id, amount },
                            to: { id: structure.id, amount },
                            resourceType: component
                        };
                    }
                }
            }
        }

        const out = _.difference(Object.keys(factory.store), components, [RESOURCE_ENERGY, RESOURCE_BATTERY]);

        for (const resourceType of out) {
            const withdrawMinAmount = Resource.T0.includes(resourceType) ? 100 : 1;

            if (factory.getResourceAmount(resourceType) >= withdrawMinAmount) {
                const terminal = this.room.terminal;
                let structure = null;

                if (terminal && terminal.getCapacity(resourceType) >= withdrawMinAmount) {
                    structure = terminal;
                } else {
                    structure = this.findStructureByCapacity([this.room.storage], resourceType);
                }

                if (structure) {
                    const amount = Math.min(
                        creepCapacity,
                        structure.getCapacity(resourceType),
                        factory.getResourceAmount(resourceType));

                    if (amount > 0) {
                        return {
                            from: { id: factory.id, amount },
                            to: { id: structure.id, amount },
                            resourceType
                        };
                    }
                }
            }
        }

        return null;
    }

    static findTask() {
        if (this.creep.ticksToLive <= 15) {
            if (this.creep.isEmpty()) {
                this.creep.role = 'recycler';

                return null;
            }
        }

        let pos = this.creep.memory.pos;

        if (pos !== OK) {
            if (pos === undefined) {
                pos = this.findPos();

                if (pos) {
                    this.creep.memory.pos = { x: pos.x, y: pos.y };
                }
            }

            if (pos && (this.creep.pos.x !== pos.x || this.creep.pos.y !== pos.y)) {
                return {
                    to: { pos },
                    state: 'move',
                    options: { movingTarget: true }
                };
            } else {
                this.creep.memory.pos = OK;
            }
        }

        if (!this.creep.isEmpty()) {
            const resourceType = this.creep.store.getFirst();
            let structure = this.findStructureByCapacity(
                [this.room.terminal, this.room.storage, this.room.powerSpawn], resourceType);
            let amount = this.creep.store[resourceType];

            if (!structure) {
                const storage = this.room.storage;
                const terminal = this.room.terminal;

                if (storage && storage.isFull() && terminal && terminal.store.getFreeCapacity() >= 5000) {
                    structure = terminal;
                } else {
                    // TODO:

                    return null;
                }
            } else {
                amount = Math.min(amount, structure.getCapacity(resourceType))
            }

            return {
                to: { id: structure.id, amount },
                resourceType,
                state: 'to'
            };
        }

        const task =
            this.findLinkTask()
            || this.findBalanceTask()
            || this.findPowerTask()
            || this.findFactoryTask()
            || this.findFactoryTask1();

        if (task === null) {
            this.creep.wait(1);
        }

        return task;
    }

}

module.exports = Central;
