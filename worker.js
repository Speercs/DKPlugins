
function Worker() {
}

Worker.run = function(room, creep) {
    this.room = room;
    this.creep = creep;
    this.newRole = null;
    this.update();
    return this.newRole;
};

Worker.RAMPART_HITS = {
    E68S9:  60000000,
    E68S8:  60000000,
    E67S14: 60000000,
    E64S13: 60000000,
    E74S21: 60000000,

    E42S9:  100000000,
    E39S6:  100000000,
    E38S12: 100000000,
    E37S4:  100000000,
    E39S9:  100000000,
    E44S3:  100000000,
    E47S8:  100000000,
    E45S9:  100000000,
    E38S14: 100000000,
    E37S16: 100000000,
    E44S17: 100000000,
    E27S9:  100000000,
    E23S5:  100000000,
    E24S3:  100000000,

    E38S9:  100000000,
    E42S11: 100000000,
    E47S14: 100000000,
    E37S5:  100000000,
    E48S9:  100000000,
    E49S16: 100000000,
    E35S8:  100000000,
    E42S13: 100000000,
    E47S11: 100000000,
    E35S3:  100000000,
    E45S18: 100000000,
    E42S15: 100000000,
    E32S5:  100000000,

    E39S11: 50000000,
};

Worker.WALL_HITS = {
    'E68S9': 5000000,
    'E68S8': 5000000,
    'E64S13': 5000000,
};

Worker.STANDARD_HITS = 500000;

Worker.filterStructures = function(hits, structure) {
    return structure.hits < hits;
};

Worker.findNearestStructure = function() {

    let structureType = this.creep.memory.workerStructureType;
    let structures, hits;

    if (structureType === STRUCTURE_RAMPART) {
        structures = this.room.ramparts;
        hits = this.RAMPART_HITS[this.creep.room.name] || this.STANDARD_HITS;
    } else { // wall
        structures = this.room.walls;
        hits = this.WALL_HITS[this.creep.room.name] || this.STANDARD_HITS;
    }

    if (structures && structures.length > 0) {
        let filtredStructures = _.filter(structures, this.filterStructures.bind(this, hits));
        return this.creep.pos.findClosestByPath(filtredStructures);
    }

    return null;
};

Worker.moveToStructure = function(structure) {
    if (!structure) {
        return;
    }
    const result = this.creep.repair(structure);
    if (result === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(structure, {
            maxRooms: 1,
            visualizePathStyle: {
                fill: 'transparent',
                stroke: '#D4F01D',
                lineStyle: 'dashed',
                strokeWidth: .15,
                opacity: 0.2
            }
        });
    } else if (result === OK && structure instanceof StructureRampart) {
        try {
            const pos = structure.pos.encode();
            const codec = new global.Codec({ depth: 29 });
            const hits = codec.encode(structure.hits + this.creep.getActiveBodyparts(WORK) * 100);
            this.room.memory.ramparts[pos] = hits;
        } catch (e) {

        }
    }
};

Worker.moveToNearestStructure = function() {
    var findNew = true;
    var structureId = this.creep.memory.workerStructureId;
    var structureType = this.creep.memory.workerStructureType;
    var structure = null;

    if (structureId) {
        let hits;

        if (structureType === STRUCTURE_RAMPART) {
            hits = this.RAMPART_HITS[this.creep.room.name] || this.STANDARD_HITS;
        } else { // wall
            hits = this.WALL_HITS[this.creep.room.name] || this.STANDARD_HITS;
        }

        structure = Game.getObjectById(structureId);

        if (structure && structure.hits < hits) {
            findNew = false;
        } else if (this.room.level < 8) {
            this.newRole = 'upgrader';

            return;
        }
    }

    if (findNew) {
        this.creep.memory.workerStructureId = '';

        structure = this.findNearestStructure();

        if (structure) {
            this.creep.memory.workerStructureId = structure.id;
        } else if (this.room.level < 8) {
            this.newRole = 'upgrader';

            return;
        }
    }

    this.moveToStructure(structure);
};

Worker.update = function() {
    if (this.creep.store[RESOURCE_ENERGY] > 0) {
        this.moveToNearestStructure();
    }

    if (this.creep.store[RESOURCE_ENERGY] === 0) {
        this.newRole = 'getter';

        if (this.room.store[RESOURCE_ENERGY] < 35000) {
            this.newRole = null;

            this.creep.wait(10);
        }
    }
}

module.exports = Worker;
