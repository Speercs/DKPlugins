
function Reserver() {
}

Reserver.run = function(creep) {
    this.creep = creep;
    this.room = creep.room;
    this.controller = creep.room.controller;

    this.update();
};

Reserver.update = function() {

    // var targetFlag = this.creep.targetFlag;
    // if (targetFlag && this.creep.room.name !== targetFlag) {
    //     this.creep.role = 'traveler';
    //     return;
    // }

    // if (this.room.name === 'E27S9' && this.room.isHostile) {
    //     if (this.creep.ticksToLive >= (this.controller.upgradeBlocked || 0)) {
    //         if (!this.creep.pos.isNearTo(this.controller)) {
    //             this.creep.travelTo(this.controller, {
    //                 maxRooms: 1,
    //                 ignoreCreeps: false,
    //                 range: 1
    //             });
    //         } else {
    //             if (!this.controller.upgradeBlocked) {
    //                 const otherCreep = this.room.creeps.find(
    //                     c => c !== this.creep && c.name.startsWith('reserver-E30S10'));
    //
    //                 if (otherCreep) {
    //                     if (otherCreep.pos.isNearTo(this.controller)) {
    //                         this.creep.attackController(this.controller);
    //                         otherCreep.attackController(this.controller);
    //                     }
    //                 } else if (this.creep.ticksToLive <= 40) {
    //                     this.creep.attackController(this.controller);
    //                 }
    //             } else {
    //                 this.creep.wait(this.controller.upgradeBlocked - 1);
    //             }
    //         }
    //     } else {
    //         this.creep.suicide();
    //     }
    //
    //     return;
    // }

    // if (this.creep.memory.sign) {
    //     if (this.creep.signController(this.controller, this.creep.memory.sign) === ERR_NOT_IN_RANGE) {
    //         this.creep.travelTo(this.controller, {
    //             maxRooms: 1,
    //             ignoreCreeps: false,
    //             range: 1
    //         });
    //
    //         return;
    //     }
    // }

    // if (Game.shard.name === 'shard2') {
        if (this.creep.memory.attack === 1 || this.room.isHostile) {
            if (this.creep.attackController(this.controller) !== OK && this.creep.ticksToLive >= (this.controller.upgradeBlocked || 0)) {
                if (!this.creep.pos.isNearTo(this.controller)) {
                    this.creep.travelTo(this.controller, {
                        maxRooms: 1,
                        ignoreCreeps: false,
                        range: 1
                    });
                } else {
                    this.creep.wait(this.controller.upgradeBlocked - 1);
                }
            } else {
                this.creep.role = 'recycler';
            }

            return;
        }
    // }

    if (this.creep.memory.claim === 1) {
        if (this.creep.claimController(this.controller) === ERR_NOT_IN_RANGE) {
            this.creep.travelTo(this.controller, {
                maxRooms: 1,
                ignoreCreeps: false,
                range: 1
            });
        }

        return;
    }

    if (this.room.name === 'E30S10') {
        if (Game.shard.name === 'shard2') {
            const portal = this.room.portals.find(p => p.destination.shard === 'shard1');

            if (portal) {
                this.creep.travelTo(portal, { maxRooms: 1 });
            }
        } else if (Game.shard.name === 'shard1') {
            this.creep.role = 'traveler';
            this.creep.targetFlag = 'E27S9';
            this.creep.memory.roleAfterTraveler = 'reserver';
        }

        return;
    }

    // const sign = this.controller.sign;
    // if (!sign || sign.text !== 'Happy New Year!') {
    //     if (this.creep.signController(this.controller, 'Happy New Year!') === ERR_NOT_IN_RANGE) {
    //         this.creep.moveTo(this.controller);
    //     }
    // }

    const result = this.creep.reserveController(this.controller);

    if (result === ERR_NOT_IN_RANGE) {
        this.creep.travelTo(this.controller, {
            maxRooms: 1,
            ignoreCreeps: false,
            range: 1
        });
    } else if (result === ERR_INVALID_TARGET && this.controller.reservation) {
        if (this.creep.attackController(this.controller) === ERR_NOT_IN_RANGE) {
            this.creep.travelTo(this.controller, {
                maxRooms: 1,
                ignoreCreeps: false,
                range: 1
            });
        }
    }
};

module.exports = Reserver;
