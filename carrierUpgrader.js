function CarrierUpgrader() {}

CarrierUpgrader.run = function(room, creep) {
    this.room = room;
    this.creep = creep;
    this.newRole = null;

    this.update();

    return this.newRole;
};

CarrierUpgrader.moveToStructure = function(structure) {
    if (!structure) {
        return;
    }

    const result = this.creep.transfer(structure, RESOURCE_ENERGY);

    if (result === ERR_NOT_IN_RANGE) {
        this.creep.travelTo(structure, {
            maxRooms: 1,
            ignoreCreeps: false
        });

        const visual = this.room.visual;

        if (visual) {
            visual.circle(structure.pos, {
                radius: 0.75,
                stroke: '#0000ff',
                strokeWidth: .15,
                opacity: 0.2
            });
        }
    }
};

CarrierUpgrader.moveToNearestStructure = function() {
    let structure = null;

    if (this.room.name === 'E24S3') {
        structure = this.room.containers[0];
    }

    if (structure && structure.structureType === STRUCTURE_LINK && structure.cooldown > 0 && structure.energy === structure.energyCapacity) {
        this.creep.wait(structure.cooldown - 1);

        return;
    }

    this.moveToStructure(structure);
};

CarrierUpgrader.update = function() {
    const energy = this.creep.carry.energy;

    if (this.room.name === 'E24S3') {
        if (this.creep.pos.x !== 32 || this.creep.pos.y !== 25) {
            this.creep.travelTo(new RoomPosition(32, 25, this.room.name), {
                maxRooms: 1,
                ignoreCreeps: false,
            });

            return;
        }
    }

    if (energy > 0) {
        this.moveToNearestStructure();
    }

    if (energy === 0) {
        this.newRole = 'getter';
    }
};

module.exports = CarrierUpgrader;
