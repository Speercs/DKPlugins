
function Traveler() {
}

Traveler.run = function(room, creep, options = { blockRMA: false, blockHeal: false }) {
    this.room = room;
    this.creep = creep;
    this.options = options;
    this.newRole = null;

    this.update();

    return this.newRole;
};

Traveler.update = function() {
    if (!this.options.blockRMA && this.creep.getActiveBodyparts(RANGED_ATTACK) > 0 && this.room.enemies.length > 1) {
        this.creep.rangedMassAttack();
    }

    if (!this.options.blockHeal && this.creep.hits < this.creep.hitsMax && this.creep.getActiveBodyparts(HEAL) > 0) {
        this.creep.heal(this.creep);
    }

    const targetFlag = this.creep.targetFlag;
    const flag = Game.flags[targetFlag];

    // if (this.creep.memory.caravan === 1 && Game.shard !== 'shard3'
    //     && !['E70S10', 'E70S20', 'E40S10'].includes(this.creep.room.name)
    //     && ['E70S10', 'E70S20', 'E40S10'].includes(targetFlag)) {
    //     if (!this.creep.memory.trav) {
    //         this.creep.memory.trav = {};
    //     }
    //
    //     const position = new RoomPosition(25, 25, targetFlag);
    //     const path = _.get(Memory, `CaravanCache[${this.creep.pos.toKey()}_${position.toKey()}]`);
    //
    //     if (path === undefined) {
    //         const returnData = {};
    //
    //         this.creep.travelTo(position, { ignoreRoads: this.creep.memory.caravan === 1, returnData });
    //
    //         if (returnData && returnData.path) {
    //             _.set(Memory, `CaravanCache[${this.creep.pos.toKey()}_${position.toKey()}]`, returnData.path);
    //         }
    //
    //         this.creep.cancelOrder('move');
    //
    //         delete this.creep.memory.trav;
    //     } else {
    //         this.creep.memory.trav.path = path;
    //
    //         console.log(this.creep.name, path);
    //     }
    // }

    if (flag && flag.room) {
        if (this.room.name === flag.room.name && !this.creep.pos.isBorder()) {
            this.newRole = this.creep.memory.roleAfterTraveler || this.creep.initialRole;
        } else {
            this.creep.travelTo(flag, { range: 1, avoidHostileCreeps: true });
        }
    } else {
        const roomName = targetFlag;

        if (this.room.name === roomName && !this.creep.pos.isBorder()) {
            this.newRole = this.creep.memory.roleAfterTraveler || this.creep.initialRole;
        } else {
            if (Game.time % 2 === 0) {
                const room = Game.rooms[this.creep.initialRoom];

                if (room) {
                    room.tryToRequestObserve(roomName, 10);
                }
            }

            this.creep.travelTo(new RoomPosition(25, 25, roomName), { avoidHostileCreeps: true });
        }
    }
};

module.exports = Traveler;
