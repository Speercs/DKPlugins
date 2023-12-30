
function Upgrader() {
}

Upgrader.IGNORED_LINKS = {
    E47S8: ['5b73161d0c6b1555bc7cd86d'],
};

Upgrader.run = function(room, creep) {
    this.room = room;
    this.creep = creep;
    this.controller = room.controller;
    this.moveToController();
};

Upgrader.moveToController = function() {

    // if ((this.creep.room.name === 'E40S10' || this.creep.room.name === 'E50S10') && Game.shard.name === 'shard2') {
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
    //             p(e)
    //         }
    //     }
    //
    //     return;
    // } else if (this.room.name === 'E40S10' || this.room.name === 'E50S10') {
    //     if (Game.shard.name === 'shard3') {
    //         this.creep.role = 'traveler';
    //
    //         if (this.creep.initialRoom === 'E38S9' || this.creep.initialRoom === 'E42S11') {
    //             this.creep.targetFlag = 'E39S11';
    //         } else if (this.creep.initialRoom === 'E48S9') {
    //             this.creep.targetFlag = 'E49S9';
    //         } else if (this.creep.initialRoom === 'E47S14') {
    //             this.creep.targetFlag = 'E51S11';
    //         }
    //
    //         return;
    //     }
    // }

    if (!this.controller) {
        return;
    }

    const result = this.creep.upgradeController(this.controller);

    if (result === ERR_NOT_IN_RANGE) {
        this.creep.travelTo(this.controller, {
            maxRooms: 1,
            range: 3,
            maxOps: 1000
        });
    } else if (result === ERR_NOT_ENOUGH_ENERGY || result === OK) {

        if (!(this.creep.store[RESOURCE_ENERGY] < this.creep.carryCapacity / 3 || this.creep.store[RESOURCE_ENERGY] <= this.creep.getActiveBodyparts(WORK))) {
            return;
        }

        // if (this.creep.room.name === 'E24S3') {
            // if (Game.time % 3 === 0) {
                // if (this.creep.pos.x === 13 && this.creep.pos.y === 23) {
                //     if (new RoomPosition(14, 22, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(14, 22);
                //
                //         return;
                //     } else if (new RoomPosition(13, 22, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(13, 22);
                //
                //         return;
                //     }
                // }
                //
                // if (this.creep.pos.x === 30 && this.creep.pos.y === 25) {
                //     if (new RoomPosition(31, 24, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(31, 24);
                //
                //         return;
                //     }
                // }
                // if (this.creep.pos.x === 32 && this.creep.pos.y === 25) {
                //     if (new RoomPosition(33, 25, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(33, 25);
                //
                //         return;
                //     }
                // }
                // if (this.creep.pos.x === 32 && this.creep.pos.y === 25) {
                //     if (new RoomPosition(32, 26, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(32, 26);
                //
                //         return;
                //     }
                // }
                // if (this.creep.pos.x === 32 && this.creep.pos.y === 23) {
                //     if (new RoomPosition(33, 23, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(33, 23);
                //
                //         return;
                //     }
                // }
                // if (this.creep.pos.x === 32 && this.creep.pos.y === 23) {
                //     if (new RoomPosition(33, 24, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(33, 24);
                //
                //         return;
                //     }
                // }
                // if (this.creep.pos.x === 31 && this.creep.pos.y === 24) {
                //     if (new RoomPosition(32, 23, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(32, 23);
                //
                //         return;
                //     }
                // }
                // if (this.creep.pos.x === 31 && this.creep.pos.y === 25) {
                //     if (new RoomPosition(32, 25, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(32, 25);
                //
                //         return;
                //     }
                // }
                // if (this.creep.pos.x === 31 && this.creep.pos.y === 25) {
                //     if (new RoomPosition(32, 26, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(32, 26);
                //
                //         return;
                //     }
                // }
                // if (this.creep.pos.x === 30 && this.creep.pos.y === 25) {
                //     if (new RoomPosition(31, 26, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(31, 26);
                //
                //         return;
                //     }
                // }
                // if (this.creep.pos.x === 31 && this.creep.pos.y === 27) {
                //     if (new RoomPosition(32, 26, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(32, 26);
                //
                //         return;
                //     }
                // }
                // if (this.creep.pos.x === 31 && this.creep.pos.y === 26) {
                //     if (new RoomPosition(32, 25, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(32, 25);
                //
                //         return;
                //     }
                // }
                // if (this.creep.pos.x === 32 && this.creep.pos.y === 26) {
                //     if (new RoomPosition(33, 25, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //         this.creep.moveTo(33, 25);
                //
                //         return;
                //     }
                // }
                // else if (this.creep.pos.x === 38 && this.creep.pos.y === 25) {
                //             if (new RoomPosition(39, 25, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //                 this.creep.moveTo(39, 25);
                //                 return;
                //             }
                //         } else if (this.creep.pos.x === 39 && this.creep.pos.y === 25) {
                //             if (new RoomPosition(40, 25, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //                 this.creep.moveTo(40, 25);
                //                 return;
                //             }
                //         } else if (this.creep.pos.x === 40 && this.creep.pos.y === 25) {
                //             if (new RoomPosition(40, 26, this.creep.room.name).lookFor(LOOK_CREEPS).length === 0) {
                //                 this.creep.moveTo(40, 26);
                //                 return;
                //             }
                //         }
                //     }
            // }
            //
            // const structure = this.creep.room.terminal;
            // if (structure) {
            //    if (this.creep.withdraw(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            //         this.creep.moveTo(structure);
            //     }
            // }
        //
        //     const structure = this.creep.pos.findClosestByPath([this.room.terminal, this.room.containers[0]].filter(s => s && s.store[RESOURCE_ENERGY] > 0));
        //     if (structure) {
        //         if (this.creep.withdraw(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        //             this.creep.moveTo(structure);
        //         }
        //     }
        //
        //     return;
        // }

        const roomLinks = this.room.links;
        let link = null;
        let container = null;

        if (roomLinks.length > 0) {
            const linkId = this.creep.memory.upgraderLinkId;
            let linkIndex = this.creep.memory.upgraderLinkIndex;

            if (linkIndex != null) {
                link = roomLinks[linkIndex];

                if (!link || link.id !== linkId) {
                    linkIndex = null;

                    delete this.creep.memory.upgraderLinkIndex;
                    delete this.creep.memory.upgraderLinkId;
                }
            }

            if (linkIndex == null) {
                const searches = this.creep.memory.upgraderLinkSearches || 0;
                const timeout = this.creep.memory.upgraderLinkSearchTimeout || 0;

                if (timeout === 0) {
                    const ignoredLinks = this.IGNORED_LINKS[this.room.name] || [];
                    let links = roomLinks;

                    if (ignoredLinks.length > 0) {
                        links = links.filter(link => !ignoredLinks.includes(link.id));
                    }

                    links = this.controller.pos.findInRange(links, 4);

                    if (links.length > 0) {
                        link = links[0];

                        linkIndex = roomLinks.indexOf(link);

                        this.creep.memory.upgraderLinkIndex = linkIndex;
                        this.creep.memory.upgraderLinkId = link.id;

                        delete this.creep.memory.upgraderLinkSearches;
                        delete this.creep.memory.upgraderLinkSearchTimeout;
                    } else {
                        this.creep.memory.upgraderLinkSearches = searches + 1;
                        this.creep.memory.upgraderLinkSearchTimeout = searches + 1;
                    }
                } else if (timeout < 0) {
                    this.creep.memory.upgraderLinkSearchTimeout = 0;
                } else {
                    this.creep.memory.upgraderLinkSearchTimeout = timeout - 1;
                }
            }

        }

        if (link === null) {
            const roomContainers = this.room.containers;

            if (roomContainers.length > 0) {
                const containerId = this.creep.memory.upgraderContainerId;
                let containerIndex = this.creep.memory.upgraderContainerIndex;

                if (containerIndex != null) {
                    container = roomContainers[containerIndex];

                    if (!container || container.id !== containerId) {
                        containerIndex = null;

                        delete this.creep.memory.upgraderContainerIndex;
                        delete this.creep.memory.upgraderContainerId;
                    }
                }

                if (containerIndex == null) {
                    const searches = this.creep.memory.upgraderContainerSearches || 0;
                    const timeout = this.creep.memory.upgraderContainerSearchTimeout || 0;

                    if (timeout === 0) {
                        let containers = this.controller.pos.findInRange(roomContainers, 3);

                        if (containers.length === 0) {
                            containers = this.controller.pos.findInRange(roomContainers, 5);
                        }

                        if (containers.length > 0) {
                            container = containers[0];
                            containerIndex = roomContainers.indexOf(container);

                            this.creep.memory.upgraderContainerIndex = containerIndex;
                            this.creep.memory.upgraderContainerId = container.id;

                            delete this.creep.memory.upgraderContainerSearches;
                            delete this.creep.memory.upgraderContainerSearchTimeout;
                        } else {
                            this.creep.memory.upgraderContainerSearches = searches + 1;
                            this.creep.memory.upgraderContainerSearchTimeout = searches + 1;
                        }
                    } else if (timeout < 0) {
                        this.creep.memory.upgraderContainerSearchTimeout = 0;
                    } else {
                        this.creep.memory.upgraderContainerSearchTimeout = timeout - 1;
                    }
                }
            }
        }

        let structure = link || container;
        
        if (!structure && this.room.level === 8 && this.room.controller.ticksToDowngrade <= CONTROLLER_DOWNGRADE[this.room.level] / 2) {
            const structures = [this.room.terminal, this.room.storage].filter(s => s && s.store[RESOURCE_ENERGY] > 0);
            
            structure = this.creep.pos.findClosestByPath(structures);
        }

        if (structure) {
            if (this.creep.withdraw(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.creep.travelTo(structure, {
                    range: 1,
                    maxRooms: 1,
                    maxOps: 1000,
                    offRoad: this.creep.pos.inRangeTo(structure, 3)
                });
            }
        }

    }
};

module.exports = Upgrader;
