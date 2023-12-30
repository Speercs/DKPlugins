
function Recycler() {
}

Recycler.run = function(creep) {
    this.creep = creep;
    this.room = creep.room;
    this.newRole = null;

    this.update();

    return this.newRole;
};

Recycler.update = function() {
    if (this.room.my) {
        const resourceType = this.creep.store.getFirst();
        let recycle = false;

        if (!this.creep.isEmpty() && resourceType !== RESOURCE_ENERGY) {
            const carry = this.creep.store[resourceType];
            let structure;

            if (this.room.terminal && this.room.terminalUsedCapacity + carry <= TERMINAL_CAPACITY) {
                structure = this.room.terminal;
            } else if (this.room.storage && this.room.storageUsedCapacity + carry <= STORAGE_CAPACITY) {
                structure = this.room.storage;
            }

            if (structure) {
                if (this.creep.transfer(structure, resourceType) === ERR_NOT_IN_RANGE) {
                    this.creep.travelTo(structure, {
                        maxRooms: 1,
                        ignoreCreeps: false,
                        maxOps: 500
                    });
                }
            } else {
                recycle = true;
            }

        } else {
            recycle = true;
        }

        if (recycle) {
            // if (this.room.level >= 6 && this.room.labs.length > 0 && this.creep.memory.boosted) {
            //     const labIndex = this.creep.memory.recyclerLabIndex;
            //     let lab = null;
            //
            //     if (labIndex !== undefined) {
            //         lab = this.room.labs[labIndex];
            //
            //         if (!lab || lab.cooldown > 0) {
            //             lab = null;
            //
            //             delete this.creep.memory.recyclerLabIndex;
            //         }
            //     }
            //
            //     if (lab == null) {
            //         lab = _.find(this.room.labs, lab => lab.cooldown === 0);
            //
            //         if (lab) {
            //             this.creep.memory.recyclerLabIndex = this.room.labs.indexOf(lab);
            //         } else {
            //             this.creep.wait(3);
            //
            //             return;
            //         }
            //     }
            //
            //     if (lab) {
            //         const result = lab.unboostCreep(this.creep);
            //
            //         if (result === ERR_NOT_IN_RANGE) {
            //             this.creep.travelTo(lab, {
            //                 maxRooms: 1,
            //                 ignoreCreeps: false,
            //                 maxOps: 500
            //             });
            //
            //             return;
            //         } else if (result === OK || result === ERR_NOT_FOUND) {
            //             delete this.creep.memory.boosted;
            //         } else if (result === ERR_TIRED) {
            //             this.creep.wait(3);
            //
            //             return;
            //         }
            //     } else {
            //         this.creep.wait(3);
            //
            //         return;
            //     }
            // }

            if (this.room.spawns.length > 0) {
                delete this.creep.memory.getterType;

                const spawn = this.room.spawns[0];
                const result = spawn.recycleCreep(this.creep);

                if (result === ERR_NOT_IN_RANGE) {
                    this.creep.travelTo(spawn, {
                        maxRooms: 1,
                        ignoreCreeps: false,
                        maxOps: 750
                    });

                    this.creep.say('I\'m going', true);
                } else if (result === OK) {
                    this.creep.canSwap = () => true;
                }
            } else {
                this.creep.memory.targetFlag = this.creep.initialRoom;
                this.creep.memory.roleAfterTraveler = 'recycler';

                this.newRole = 'traveler';
            }
        }
    } else {
        this.creep.memory.targetFlag = this.creep.initialRoom;
        this.creep.memory.roleAfterTraveler = 'recycler';

        this.newRole = 'traveler';
    }
};

module.exports = Recycler;
