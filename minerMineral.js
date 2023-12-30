class MinerMineral {

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
        const source = this.room.mineral;

        if (this.room.my) {
            const containerPos = this.findContainerPos(source);

            if (containerPos) {
                return containerPos;
            }
        } else {
            const positions = source.pos.around(1, { encode: false });

            return this.creep.pos.findClosestByPath(positions);
        }

        Game.notify('minerPos -1 в комнате ' + this.room.name + ' ' + this.creep.name, 15);

        return -1;
    }

    static update() {
        const mineral = this.room.mineral;

        if (!mineral) {
            this.creep.role = 'recycler';

            return;
        }

        const result = this.creep.harvest(mineral);

        if (result === ERR_NOT_IN_RANGE || result === ERR_NOT_ENOUGH_RESOURCES && mineral.ticksToRegeneration < this.creep.ticksToLive) {
            let pos = this.creep.memory.pos;

            if (pos !== OK) {
                if (!pos) {
                    pos = this.findMinerPos();

                    if (pos && pos !== -1) {
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
            if (mineral.mineralAmount === 0 && mineral.ticksToRegeneration > this.creep.ticksToLive) {
                this.creep.role = 'recycler';

                return;
            }
        } else if (result === ERR_NOT_FOUND) {
            Game.notify(`Extractor not found in the room ${this.room.name}`);
        } else if (result === OK) {
            delete this.creep.memory.minerPos;

            this.creep.wait(EXTRACTOR_COOLDOWN);
        }
    }

}

module.exports = MinerMineral;
