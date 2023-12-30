
function Repairer() {
}

Repairer.run = function(room, creep) {
    // let targetRoom = creep.targetRoom;
    // if (targetRoom && creep.room.name !== targetRoom) {
    //     creep.role = 'traveler';
    //     return;
    // }
    this.room = room;
    this.creep = creep;
    this.newRole = null;
    this.update();
    return this.newRole;
};

Repairer.getStructures = function() {
    return this.room.roads.concat(this.room.containers);
};

Repairer.findNearestStructure = function() {
    let structures = _.filter(this.getStructures(), structure => structure.hits < structure.hitsMax);
    if (structures.length > 0) {
        return this.creep.pos.findClosestByPath(structures);
    }
    return null;
};

Repairer.moveToStructure = function(structure) {
    if (!structure) {
        return;
    }
    if (this.creep.repair(structure) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(structure, {
            maxRooms: 1,
            visualizePathStyle: {
                fill: 'transparent',
                stroke: '#00f0f0',
                lineStyle: 'dashed',
                strokeWidth: .15,
                opacity: 0.2
            }
        });
        var visual = this.room.visual;
        if (visual) {
            visual.circle(structure.pos, {
                radius: 0.45,
                stroke: '#00f0f0',
                strokeWidth: .15,
                opacity: 0.25
            });
        }
    }
};

Repairer.moveToNearestStructure = function() {
    if (this.creep.memory.structureSearchTimeout > 0) {
        this.creep.memory.structureSearchTimeout--;
        return;
    }
    let findNew = true;
    let structureId = this.creep.memory.repairerStructureId;
    let structure = null;
    if (structureId) {
        structure = Game.getObjectById(structureId);
        if (structure && structure.hits < structure.hitsMax) {
            findNew = false;
        }
    }
    if (findNew) {
        delete this.creep.memory.repairerStructureId;
        structure = this.findNearestStructure();
        if (structure) {
            this.creep.memory.repairerStructureId = structure.id;
            this.creep.memory.structureSearchTimeout = 0;
        } else {
            let structures = this.getStructures();
            if (structures.length > 0) {
                structure = _.sortBy(structures, 'ticksToDecay')[0];
                if (structure) {
                    this.creep.memory.repairerStructureId = structure.id;
                    this.creep.memory.structureSearchTimeout = structure.ticksToDecay;
                }
            } else {
                this.creep.memory.structureSearchTimeout = 10;
            }
        }
    }
    this.moveToStructure(structure);
};

Repairer.update = function() {
    if (this.creep.hits < this.creep.hitsMax) {
        this.creep.heal(this.creep);
    }
    if (this.creep.carry.energy > 0) {
        this.moveToNearestStructure();
    }
    if (this.creep.carry.energy === 0) {
        this.newRole = 'getter';
    }
};

module.exports = Repairer;
