
const RoleBase = require('role.base');

class CarrierLink extends RoleBase {

    static findLink() {
        const links = this.room.links;

        if (links.length > 0) {
            return this.room.storage.pos.findInRange(links, 3)[0];
        }

        return null;
    }

    /**
     * @param {Structure} structure
     *
     * @returns {RoomPosition | null}
     */
    static findPos() {
        const link = this.findLink();

        if (link) {
            const storagePositions = this.room.storage.pos.around(1);
            const linkPositions = link.pos.around(1);
            const pos = RoomPosition.commonPos(storagePositions, linkPositions);

            if (pos) {
                this.creep.memory.link = link.id;

                return pos;
            }
        }

        return null;
    }

    static getTravelOptions(task) {
        return { ...RoleBase.getTravelOptions(task), maxOps: 1000, ...task.options };
    }

    static findTask() {
        const storage = this.room.storage;

        if (!storage) {
            this.creep.wait(10);

            return null;
        }

        if (this.creep.ticksToLive <= 40) {
            // TODO: suicide
        }

        let pos = this.creep.memory.pos;

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
        }

        if (this.creep.isEmpty()) {
            const linkId = this.creep.memory.link;
            let link = Game.getObjectById(linkId);

            if (!link) {
                link = this.findLink();

                if (link) {
                    this.creep.memory.link = link.id;
                } else {
                    this.creep.wait(5);

                    return null;
                }
            }

            const amount = link.getResourceAmount(RESOURCE_ENERGY);

            if (amount > 0) {
                return {
                    from: { id: link.id, amount },
                    resourceType: RESOURCE_ENERGY
                };
            }

            if (this.room.energyAvailable < this.room.energyCapacityAvailable) {
                const amount = storage.getResourceAmount(RESOURCE_ENERGY);

                if (amount > 0) {
                    let structures = this.creep.memory.structures;
                    let structure = null;

                    if (structures === undefined) {
                        structures = this.creep.pos.findInRange(this.room.towers.concat(this.room.spawns), 1);

                        this.creep.memory.structures = structures.map(s => s.id);
                    } else if (structures.length > 0) {
                        structures = structures.reduce((acc, id) => {
                            const structure = Game.getObjectById(id);

                            if (structure) {
                                acc.push(structure);
                            }

                            return acc;
                        }, []);
                    }

                    if (structures.length > 0) {
                        structure = _.find(structures, s => s.getCapacity(RESOURCE_ENERGY) >= 200);
                    }

                    if (structure) {
                        const carryCapacity = this.creep.store.getCapacity();

                        return {
                            from: { id: storage.id, amount: Math.min(amount, carryCapacity) },
                            to: { id: structure.id, amount: Math.min(structure.getCapacity(RESOURCE_ENERGY), carryCapacity) },
                            resourceType: RESOURCE_ENERGY
                        };
                    }
                }
            }

            this.creep.wait(3);

            return null;
        }

        if (this.room.energyAvailable < this.room.energyCapacityAvailable) {
            let structures = this.creep.memory.structures;
            let structure = null;

            if (structures === undefined) {
                structures = this.creep.pos.findInRange(this.room.towers.concat(this.room.spawns), 1);

                this.creep.memory.structures = structures.map(s => s.id);
            } else if (structures.length > 0) {
                structures = structures.reduce((acc, id) => {
                    const structure = Game.getObjectById(id);

                    if (structure) {
                        acc.push(structure);
                    }

                    return acc;
                }, []);
            }

            if (structures.length > 0) {
                structure = _.find(structures, s => s.getCapacity(RESOURCE_ENERGY) >= 200);
            }

            if (structure) {
                return {
                    to: { id: structure.id, amount: Math.min(structure.getCapacity(RESOURCE_ENERGY), this.creep.store[RESOURCE_ENERGY]) },
                    resourceType: RESOURCE_ENERGY,
                    state: 'to'
                };
            }
        }

        const capacity = storage.getCapacity(RESOURCE_ENERGY);

        if (capacity > 0) {
            return {
                to: { id: storage.id, amount: Math.min(capacity, this.creep.store[RESOURCE_ENERGY]) },
                resourceType: RESOURCE_ENERGY,
                state: 'to'
            };
        }

        // const terminal = this.room.terminal;
        //
        // if (terminal) {
        //     const capacity = terminal.getCapacity(RESOURCE_ENERGY);
        //
        //     if (capacity > 0) {
        //         return {
        //             to: { id: terminal.id, amount: Math.min(capacity, this.creep.store[RESOURCE_ENERGY]) },
        //             resourceType: RESOURCE_ENERGY,
        //             state: 'to'
        //         };
        //     }
        // }

        this.creep.wait(3);

        return null;
    }

}

module.exports = CarrierLink;
