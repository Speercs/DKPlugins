
function CarrierLinkTerminal() {
}

CarrierLinkTerminal.run = function(room, creep) {
    this.room = room;
    this.creep = creep;

    this.update();
};

CarrierLinkTerminal.findLink = function() {
    const links = this.room.links;

    if (links.length > 0) {
        const terminal = this.room.terminal;

        if (terminal) {
            return terminal.pos.findInRange(links, 3)[0];
        }
    }

    return null;
};

CarrierLinkTerminal.findPos = function(structure) {
    if (structure) {
        const links = this.room.links;

        if (links.length > 0) {
            const link = structure.pos.findInRange(links, 3)[0];

            if (link) {
                const terminalPositions = structure.pos.around(1);
                const linkPositions = link.pos.around(1);
                const pos = RoomPosition.commonPos(terminalPositions, linkPositions);

                if (pos) {
                    return pos;
                }
            }
        }
    }

    return null;
};

CarrierLinkTerminal.findTerminalPos = function() {
    return this.findPos(this.room.terminal);
};

CarrierLinkTerminal.findStoragePos = function() {
    return this.findPos(this.room.storage);
};

CarrierLinkTerminal.transferEnergyToStructures = function() {
    const terminal = this.room.terminal;
    const storage = this.room.storage;
    let structure = null;

    const structures = this.room.towers.concat(this.room.spawns);

    structure = this.creep.pos.findInRange(structures, 1, {
        filter: s => {
            if (s.structureType === STRUCTURE_TOWER) {
                return s.energy < s.energyCapacity * 0.9;
            }

            return s.energy < s.energyCapacity;
        }
    })[0];

    if (!structure) {
        if (terminal && this.room.terminalUsedCapacity < TERMINAL_CAPACITY) {
            structure = terminal;
        } else if (storage && this.room.storageUsedCapacity < storage.storeCapacity) {
            structure = storage;
        }
    }

    if (structure) {
        if (this.creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            let pos = null;

            if (structure.structureType === STRUCTURE_TERMINAL) {
                pos = this.creep.memory.carrierLinkTerminalPos;

                if (!pos) {
                    pos = this.findTerminalPos();

                    if (pos) {
                        this.creep.memory.carrierLinkTerminalPos = pos.encode();
                    }
                } else {
                    pos = RoomPosition.decode(pos);
                }
            } else {
                pos = this.creep.memory.carrierLinkStoragePos;

                if (!pos) {
                    let posIsNotExist = this.creep.memory.carrierLinkStoragePosIsNotExist;

                    if (posIsNotExist == null) {
                        pos = this.findStoragePos();

                        this.creep.memory.carrierLinkStoragePosIsNotExist = !pos;

                        if (pos) {
                            this.creep.memory.carrierLinkStoragePos = pos.encode();
                        }
                    } else {
                        pos = terminal.pos;
                    }
                } else {
                    pos = RoomPosition.decode(pos);
                }
            }

            if (pos) {
                this.creep.travelTo(pos, {
                    maxRooms: 1,
                    maxOps: 500
                });
            }
        }
    }
};

CarrierLinkTerminal.withdrawEnergyFromLink = function() {
    if (this.creep.memory.findLinkTimeout > 0) {
        this.creep.memory.findLinkTimeout--;

        return;
    }

    let findNew = true;
    const linkId = this.creep.memory.linkId;
    const linkIndex = this.creep.memory.linkIndex;
    let link = null;

    if (linkId) {
        link = this.room.links[linkIndex];

        if (link && link.id === linkId) {
            findNew = false;
        }
    }

    if (findNew) {
        let link = this.findLink();

        if (link) {
            this.creep.memory.linkId = link.id;
            this.creep.memory.linkIndex = _.indexOf(this.room.links, link);
        } else {
            this.creep.memory.findLinkTimeout = 20;
        }
    }

    if (link && link.energy > 0) {
        if (this.creep.withdraw(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.creep.travelTo(link, {
                maxRooms: 1,
                maxOps: 500
            });
        }
    } else if (Game.time % 15 === 0 && this.room.energyAvailable < this.room.energyCapacityAvailable) {
        const terminal = this.room.terminal;

        if (terminal && terminal.store[RESOURCE_ENERGY] > 0 && this.creep.pos.isNearTo(terminal)) {
            const structure = this.creep.pos.findInRange(this.room.carrierStructures, 1, {
                filter: s => s.energy < s.energyCapacity
            })[0];

            if (structure) {
                this.creep.withdraw(structure, RESOURCE_ENERGY);
            }
        }
    }
};

CarrierLinkTerminal.update = function() {
    if (this.creep.carry.energy > 0) {
        this.transferEnergyToStructures();
    } else {
        this.withdrawEnergyFromLink();
    }
};

module.exports = CarrierLinkTerminal;
