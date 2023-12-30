
class MinerDeposit {

    static run(creep) {
        this.creep = creep;
        this.room = creep.room;

        this.update();
    }

    static findContainerPos(source) {
        const roomContainers = this.room.containers;

        if (roomContainers.length > 0) {
            const container = source.pos.findInRange(roomContainers, 1)[0];

            if (container) {
                return container.pos;
            }
        }

        return null;
    }

    static findMinerPos() {
        return this.creep.pos.findClosestByPath(this.room.deposit.pos.around(1, { encode: false }));
    }

    static update() {
        const deposit = this.room.deposit;

        if (!deposit) {
            this.creep.role = 'recycler';

            return;
        }

        const result = this.creep.harvest(deposit);

        if (result === ERR_NOT_IN_RANGE) {
            let pos = this.creep.memory.pos;

            if (pos !== OK) {
                if (!pos) {
                    pos = this.findMinerPos();

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
        } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
            if (deposit.mineralAmount === 0 && deposit.ticksToRegeneration > this.creep.ticksToLive) {
                this.creep.role = 'recycler';

                return;
            }
        } else if (result === OK) {
            delete this.creep.memory.minerPos;

            this.creep.wait(EXTRACTOR_COOLDOWN);
        }
    }

}

module.exports = MinerDeposit;
