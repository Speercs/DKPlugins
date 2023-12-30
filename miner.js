
function Miner() {
}

Miner.run = function(room, creep) {
    const targetFlag = creep.targetFlag;

    this.room = room;
    this.creep = creep;

    // if (this.creep.room.name === 'E40S10' && Game.shard.name === 'shard2') {
    //     const portals = _.filter(this.creep.room.structures, structure => structure.structureType === STRUCTURE_PORTAL);
    //     const portal = _.find(portals, function(portal) {
    //         return portal.destination.shard === 'shard3';
    //     });
    //     if (portal) {
    //         this.creep.travelTo(portal);
    //     }
    //     try {
    //         let memory = JSON.parse(RawMemory.interShardSegment);
    //         memory[this.creep.name] = this.creep.memory;
    //         RawMemory.interShardSegment = JSON.stringify(memory);
    //     } catch(e) {
    //         try {
    //             let memory = {};
    //             memory[this.creep.name] = this.creep.memory;
    //             RawMemory.interShardSegment = JSON.stringify(memory);
    //         } catch (e) {
    //
    //         }
    //     }
    //
    //     return;
    // }
    //
    // if (this.room.name === 'E50S10') {
    //     if (Game.shard.name === 'shard3') {
    //         this.creep.role = 'traveler';
    //
    //         if (this.creep.initialRoom === 'E38S9') {
    //             this.creep.targetFlag = 'E49S9';
    //         } else if (this.creep.initialRoom === 'E42S11') {
    //             this.creep.targetFlag = 'E51S11';
    //         }
    //
    //         return;
    //     }
    // }

    if (targetFlag && room.name !== targetFlag) {
        creep.role = 'traveler';

        return;
    }

    // if (this.creep.getActiveBodyparts(HEAL) > 0 && this.creep.hits < this.creep.hitsMax) {
    //     this.creep.heal(this.creep);
    // }

    this.getterType = creep.getterType;

    this.updateMiner();
};

Miner.findSourceIndex = function() {
    if (this.creep.initialRole.match(/-(\d+)/i)) {
        return Number(RegExp.$1);
    }

    return 3;
};

Miner.findContainerPos = function(source) {
    const roomContainers = this.room.containers;

    if (roomContainers.length > 0) {
        const container = source.pos.findInRange(roomContainers, 1)[0];

        if (container) {
            if (!this.room.my) {
                this.creep.memory.minerContainerId = container.id;
            }

            return container.pos;
        }
    }

    return null;
};

Miner.findLinkPos = function(source) {
    const roomLinks = this.room.links;

    if (roomLinks.length > 0) {
        const link = source.pos.findInRange(roomLinks, 2)[0];

        if (link) {
            const sourcePositions = source.pos.around(1);
            const linkPositions = link.pos.around(1);

            return RoomPosition.commonPos(sourcePositions, linkPositions);
        }
    }

    return null;
};

Miner.findConstructionContainerPos = function(source) {
    const roomConstructions = this.room.find(FIND_CONSTRUCTION_SITES, {
        filter: c => c.structureType === STRUCTURE_CONTAINER
    });

    if (roomConstructions.length > 0) {
        const construction = source.pos.findInRange(roomConstructions, 1)[0];

        if (construction) {
            return construction.pos;
        }
    }

    return null;
};

Miner.findMinerPos = function(source) {
    if (this.room.level >= 5 && this.creep.carryCapacity > 0) {
        const linkPos = this.findLinkPos(source);

        if (linkPos) {
            return linkPos;
        }
    }

    const containerPos = this.findContainerPos(source);

    if (containerPos) {
        return containerPos;
    }

    const constructionContainerPos = this.findConstructionContainerPos(source);

    if (constructionContainerPos) {
        return constructionContainerPos;
    }

    Game.notify('minerPos -1 в комнате ' + this.room.name + ' ' + this.creep.name, 15);

    return -1;
};

Miner.getMinerPos = function(sourceIndex) {
    const source = this.getSourceByIndex(sourceIndex);

    let pos = this.findMinerPos(source);

    if (pos instanceof RoomPosition) {
        pos = pos.encode();
    }

    return pos;
};

/**
 * @param {number} index
 * @returns {Source | Mineral}
 */
Miner.getSourceByIndex = function(index) {
    if (index === 3) {
        return this.room.mineral;
    }

    return this.room.sources[index];
};

Miner.updateMiner = function() {
    let sourceIndex = this.creep.memory.minerSourceIndex;

    /**
     * @type {Source | Mineral}
     */
    let source = null;

    if (sourceIndex == null) {
        sourceIndex = this.findSourceIndex();

        this.creep.memory.minerSourceIndex = sourceIndex;

        if (this.room.level >= 5 && this.creep.carryCapacity > 0 && this.room.links.length > 0) {
            this.creep.memory.minerLinkSearches = 0;
            this.creep.memory.minerLinkSearchTimeout = 0;
        }
    }

    if (sourceIndex < 3) {
        if (this.creep.memory.minerLastResult === OK && Game.time % 2 === sourceIndex % 2) {
            if (!this.room.my) {
                const containerDecay = this.creep.memory.minerContainerTicksToDecay;

                if (containerDecay > 0) {
                    this.creep.memory.minerContainerTicksToDecay -= 2;

                    return;
                }

                let containerId = this.creep.memory.minerContainerId;

                if (!containerId) {
                    const roomContainers = this.room.containers;

                    if (roomContainers.length > 0) {
                        const container = this.creep.pos.findInRange(roomContainers, 0)[0];

                        // console.log(this.creep.pos.getStructure(STRUCTURE_CONTAINER));

                        if (container) {
                            containerId = container.id;

                            this.creep.memory.minerContainerId = containerId;
                        }
                    }
                }

                if (containerId) {
                    const container = Game.getObjectById(containerId);

                    if (container) {
                        if (container.hits < container.hitsMax) {
                            this.creep.repair(container);
                        } else {
                            this.creep.memory.minerContainerTicksToDecay = container.ticksToDecay - 2;
                        }
                    } else {
                        delete this.creep.memory.minerContainerId;
                    }
                }
            }

            return;
        }

        source = this.getSourceByIndex(sourceIndex);
    }

    if (!source) {
        return;
    }

    if (Game.shard.name === 'shard3' && this.room.my && source.energy === 0 && source.ticksToRegeneration > 0 && this.creep.pos.isNearTo(source)) {
        if (this.creep.ticksToLive > source.ticksToRegeneration) {
            this.creep.wait(source.ticksToRegeneration - 1);
        } else if (this.creep.getActiveBodyparts(WORK) < 20) {
            this.creep.role = 'recycler';
        }

        return;
    }

    const result = this.creep.harvest(source);

    this.creep.memory.minerLastResult = result;

    if (result === ERR_NOT_IN_RANGE) {
        let minerPos = this.creep.memory.minerPos;

        if (!minerPos) {
            minerPos = this.getMinerPos(sourceIndex);

            this.creep.memory.minerPos = minerPos;
        }

        if (minerPos === -1) {
            delete this.creep.memory.minerPos;

            return;
        }

        if (minerPos) {
            const pos = RoomPosition.decode(minerPos);

            this.creep.travelTo(pos, {
                maxRooms: 1,
                ignoreCreeps: false,
                avoidHostileCreeps: true
            });

            this.room.visual.circle(pos, {
                radius: 0.75,
                stroke: '#ffff00',
                strokeWidth: .15,
                opacity: 0.2
            });
        }
    } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
        if (this.room.name === 'E68S8' || this.room.name === 'E39S6' || Game.shard.name === 'shard1' && this.room.name === 'E37S5') {
            if (sourceIndex === 0) {
                this.creep.memory.minerSourceIndex = 1;

                source = this.getSourceByIndex(1);
            } else if (sourceIndex === 1) {
                this.creep.memory.minerSourceIndex = 0;

                source = this.getSourceByIndex(0);
            }

            if (source) {
                this.creep.harvest(source);
            }
        }
    } else if (result === OK) {
        delete this.creep.memory.minerPos;

        if (!this.room.my || this.getterType !== RESOURCE_ENERGY) {
            return;
        }

        const capacity = this.creep.store.getCapacity();
        const energy = this.creep.store[RESOURCE_ENERGY];

        if (energy > 0 && (energy === capacity || energy + this.creep.harvestEfficiency > capacity)) {
            const roomLinks = this.room.links;
            let link = null;

            if (roomLinks.length > 0) {
                let linkIndex = this.creep.memory.minerLinkIndex;
                const linkId = this.creep.memory.minerLinkId;

                if (linkIndex != null) {
                    link = roomLinks[linkIndex];

                    if (!link || link.id !== linkId) {
                        linkIndex = null;

                        this.creep.memory.minerLinkIndex = null;
                        this.creep.memory.minerLinkId = null;
                        this.creep.memory.minerLinkSearches = 0;
                        this.creep.memory.minerLinkSearchTimeout = 0;
                    }
                }

                if (linkIndex == null) {
                    const searches = this.creep.memory.minerLinkSearches || 0;
                    const timeout = this.creep.memory.minerLinkSearchTimeout || 0;

                    if (timeout === 0) {
                        const links = this.creep.pos.findInRange(roomLinks, 1);

                        if (links.length > 0) {
                            link = links[0];

                            linkIndex = roomLinks.indexOf(link);

                            this.creep.memory.minerLinkIndex = linkIndex;
                            this.creep.memory.minerLinkId = link.id;
                            this.creep.memory.minerLinkSearches = 0;
                            this.creep.memory.minerLinkSearchTimeout = 0;
                        } else {
                            this.creep.memory.minerLinkSearches = searches + 1;
                            this.creep.memory.minerLinkSearchTimeout = searches + 1;
                        }
                    } else {
                        this.creep.memory.minerLinkSearchTimeout = timeout - 1;
                    }
                }
            }

            if (this.room.name === 'E42S13' && link && link.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                const otherLink = this.creep.pos.findInRange(roomLinks, 3).find(l => l.id !== link.id);

                if (otherLink) {
                    link = otherLink;
                }
            }

            if (link) {
                this.creep.transfer(link, RESOURCE_ENERGY);
            }

        }
    }
};

class Miner2 {

    static run(room, creep) {
        // const targetFlag = creep.targetFlag;

        this.creep = creep;
        this.room = creep.room;

        // if (this.creep.room.name === 'E40S10' && Game.shard.name === 'shard2') {
        //     const portals = _.filter(this.creep.room.structures, structure => structure.structureType === STRUCTURE_PORTAL);
        //     const portal = _.find(portals, function(portal) {
        //         return portal.destination.shard === 'shard3';
        //     });
        //     if (portal) {
        //         this.creep.travelTo(portal);
        //     }
        //     try {
        //         let memory = JSON.parse(RawMemory.interShardSegment);
        //         memory[this.creep.name] = this.creep.memory;
        //         RawMemory.interShardSegment = JSON.stringify(memory);
        //     } catch(e) {
        //         try {
        //             let memory = {};
        //             memory[this.creep.name] = this.creep.memory;
        //             RawMemory.interShardSegment = JSON.stringify(memory);
        //         } catch (e) {
        //
        //         }
        //     }
        //
        //     return;
        // }
        //
        // if (this.room.name === 'E50S10') {
        //     if (Game.shard.name === 'shard3') {
        //         this.creep.role = 'traveler';
        //
        //         if (this.creep.initialRoom === 'E38S9') {
        //             this.creep.targetFlag = 'E49S9';
        //         } else if (this.creep.initialRoom === 'E42S11') {
        //             this.creep.targetFlag = 'E51S11';
        //         }
        //
        //         return;
        //     }
        // }

        // if (targetFlag && room.name !== targetFlag) {
        //     creep.role = 'traveler';
        //
        //     return;
        // }

        // if (this.creep.getActiveBodyparts(HEAL) > 0 && this.creep.hits < this.creep.hitsMax) {
        //     this.creep.heal(this.creep);
        // }

        this.update();
    }

    static findSourceIndex() {
        if (this.creep.initialRole.match(/-(\d+)/i)) {
            return Number(RegExp.$1);
        }

        return 0;
    }

    static findContainerPos(source) {
        const roomContainers = this.room.containers;

        if (roomContainers.length > 0) {
            const container = source.pos.findInRange(roomContainers, 1)[0];

            if (container) {
                if (!this.room.my) {
                    this.creep.memory.minerContainerId = container.id;
                }

                return container.pos;
            }
        }

        return null;
    }

    static findLinkPos(source) {
        const roomLinks = this.room.links;

        if (roomLinks.length > 0) {
            const link = source.pos.findInRange(roomLinks, 2)[0];

            if (link) {
                const sourcePositions = source.pos.around(1);
                const linkPositions = link.pos.around(1);

                const pos = RoomPosition.commonPos(sourcePositions, linkPositions);

                if (pos) {
                    this.creep.memory.minerLinkId = link.id;
                    this.creep.memory.minerLinkIndex = roomLinks.indexOf(link);

                    return pos;
                }
            }
        }

        return null;
    }

    static findConstructionContainerPos(source) {
        const roomConstructions = this.room.find(FIND_CONSTRUCTION_SITES, {
            filter: c => c.structureType === STRUCTURE_CONTAINER
        });

        if (roomConstructions.length > 0) {
            const construction = source.pos.findInRange(roomConstructions, 1)[0];

            if (construction) {
                return construction.pos;
            }
        }

        return null;
    }

    static findMinerPos(source) {
        if (this.room.level >= 5 && this.creep.store.getCapacity() > 0) {
            const linkPos = this.findLinkPos(source);

            if (linkPos) {
                return linkPos;
            }
        }

        const containerPos = this.findContainerPos(source);

        if (containerPos) {
            return containerPos;
        }

        const constructionContainerPos = this.findConstructionContainerPos(source);

        if (constructionContainerPos) {
            return constructionContainerPos;
        }

        Game.notify('minerPos -1 в комнате ' + this.room.name + ' ' + this.creep.name, 15);

        return -1;
    }

    static getSourceByIndex(index) {
        return this.room.sources[index];
    }

    static update() {
        const capacity = this.creep.store.getCapacity();
        const energy = this.creep.store[RESOURCE_ENERGY];
        let sourceIndex = this.creep.memory.minerSourceIndex;

        if (sourceIndex == null) {
            sourceIndex = this.findSourceIndex();

            this.creep.memory.minerSourceIndex = sourceIndex;

            if (this.room.level >= 5 && capacity > 0 && this.room.links.length > 0) {
                this.creep.memory.minerLinkSearches = 0;
                this.creep.memory.minerLinkSearchTimeout = 0;
            }
        }

        let source = this.getSourceByIndex(sourceIndex);

        if (!source) {
            Game.notify(`!source (${sourceIndex}) в комнате ${this.room.name} ${this.creep.name}`, 15);

            return;
        }

        let pos = this.creep.memory.pos;

        if (pos !== OK) {
            if (!pos) {
                pos = this.findMinerPos(source);

                if (pos !== -1) {
                    this.creep.memory.pos = { x: pos.x, y: pos.y };
                }
            }

            if (pos === -1) {
                return;
            }

            pos = new RoomPosition(pos.x, pos.y, this.room.name);

            if (pos && !this.creep.pos.isEqualTo(pos)) {
                this.creep.travelTo(pos, {
                    maxRooms: 1,
                    ignoreCreeps: false,
                    avoidHostileCreeps: true
                });

                this.room.visual.circle(pos, {
                    radius: 0.75,
                    stroke: '#ffff00',
                    strokeWidth: .15,
                    opacity: 0.2
                });

                return;
            } else {
                this.creep.memory.pos = OK;
            }
        }

        if (source.energy === 0 && source.ticksToRegeneration > 0 && this.creep.memory.doubleMiner !== 1) {
            if (this.creep.ticksToLive > source.ticksToRegeneration) {
                if (!this.room.my || !source.hasEffect(PWR_REGEN_SOURCE)) {
                    this.creep.wait(source.ticksToRegeneration - 1);
                }
            } else if (!this.room.my) {
                this.creep.suicide();
            }

            return;
        }

        if ((Game.time % 11 === 0 || this.creep.memory.repairContainer === 1) && energy > 0 && (!this.room.my || this.room.level < 5)) {
            const container = this.creep.pos.getStructure(STRUCTURE_CONTAINER);

            if (container && container.hits < container.hitsMax) {
                this.creep.repair(container);

                delete this.creep.memory.repairContainer;

                if (container.hits <= container.hitsMax * 0.75) {
                    this.creep.memory.repairContainer = 1;
                }
            }
        }

        const result = this.creep.harvest(source);

        if (result === ERR_NOT_ENOUGH_RESOURCES && this.creep.memory.doubleMiner === 1) {
            if (sourceIndex === 0) {
                this.creep.memory.minerSourceIndex = 1;

                source = this.getSourceByIndex(1);
            } else if (sourceIndex === 1) {
                this.creep.memory.minerSourceIndex = 0;

                source = this.getSourceByIndex(0);
            }

            if (source) {
                this.creep.harvest(source);
            }
        } else if (result === OK && this.room.my) {
            if (energy > 0 && (energy === capacity || energy + this.creep.harvestEfficiency > capacity || this.creep.ticksToLive === 1)) {
                const roomLinks = this.room.links;
                let link = null;

                if (roomLinks.length > 0) {
                    const linkId = this.creep.memory.minerLinkId;
                    let linkIndex = this.creep.memory.minerLinkIndex;

                    if (linkIndex != null) {
                        link = roomLinks[linkIndex];

                        if (!link || link.id !== linkId) {
                            linkIndex = null;

                            this.creep.memory.minerLinkIndex = null;
                            this.creep.memory.minerLinkId = null;
                            this.creep.memory.minerLinkSearches = 0;
                            this.creep.memory.minerLinkSearchTimeout = 0;
                        }
                    }

                    if (linkIndex == null) {
                        const searches = this.creep.memory.minerLinkSearches || 0;
                        const timeout = this.creep.memory.minerLinkSearchTimeout || 0;

                        if (timeout === 0) {
                            const links = this.creep.pos.findInRange(roomLinks, 1);

                            if (links.length > 0) {
                                link = links[0];

                                linkIndex = roomLinks.indexOf(link);

                                this.creep.memory.minerLinkIndex = linkIndex;
                                this.creep.memory.minerLinkId = link.id;
                                this.creep.memory.minerLinkSearches = 0;
                                this.creep.memory.minerLinkSearchTimeout = 0;
                            } else {
                                this.creep.memory.minerLinkSearches = searches + 1;
                                this.creep.memory.minerLinkSearchTimeout = searches + 1;
                            }
                        } else {
                            this.creep.memory.minerLinkSearchTimeout = timeout - 1;
                        }
                    }
                }

                if (this.room.name === 'E42S13' && link && link.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                    const otherLink = this.creep.pos.findInRange(roomLinks, 3).find(l => l.id !== link.id);

                    if (otherLink) {
                        link = otherLink;
                    }
                }

                if (link) {
                    this.creep.transfer(link, RESOURCE_ENERGY);
                }

            }
        } else if (result === ERR_NOT_IN_RANGE && pos === OK) {
            delete this.creep.memory.pos;
        }
    }

}

module.exports = Miner2;
