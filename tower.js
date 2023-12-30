
function Tower() {
}

Tower.STRUCTURES = {};

Tower.TIMING = {
    E68S9: 20,
    E68S8: 20,
    E67S14: 20,
    E64S13: 20,
    E74S21: 20,

    E39S11: 4,
};

Tower.STANDARD_TIMING = 2;

Tower.HITS = {
    rampart: 100000,
    road: 4000
};

Tower.run = function(room) {
    this.room = room;

    if (Game.time % (room.level === 8 ? 15 : 10) === 0) {
        this.STRUCTURES[this.room.name] = null;
    }

    const enemies = room.enemies;
    const playerEnemies = room.playerEnemies;
    const woundedCreeps = room.woundedCreeps.concat(room.woundedPowerCreeps);
    let structure = null;

    const timing = this.TIMING[this.room.name] || this.STANDARD_TIMING;

    if (enemies.length === 0 && woundedCreeps.length === 0 && Game.time % timing !== 0) {
        return;
    }

    const length = room.towers.length;
    let index = 0, enemyIndex = 0, woundedCreepIndex = 0;

    room.towers.forEach((tower) => {
        if (tower.energy < 10) {
            return;
        }

        if (enemies.length === 0 && woundedCreeps.length === 0 && this.room.energyPercents > 15) {
            structure = this.findNearestStructure(length, index);
            index++;
        }

        enemyIndex++;
        woundedCreepIndex++;

        this.update(tower, enemies, playerEnemies, woundedCreeps, structure, enemyIndex, woundedCreepIndex);
    });
};

Tower.filterStructures = function(structure) {
    let hits = this.HITS[structure.structureType] || structure.hitsMax;

    if (structure.structureType === STRUCTURE_ROAD) {
        if (structure.hitsMax === 25000) {
            hits = 24000;
        }

        if (structure.hitsMax === 750000) {
            hits = 735000;
        }
    }

    if (structure.structureType === STRUCTURE_RAMPART) {
        if (structure.hits < hits) {
            return true;
        }

        try {
            const pos = structure.pos.encode();

            if (this.room.memory.ramparts.hasOwnProperty(pos)) {
                const codec = new global.Codec({ depth: 29 });

                return structure.hits < codec.decode(this.room.memory.ramparts[pos]);
            }
        } catch(e) {
            return structure.hits < hits;
        }
    }

    return structure.hits < hits;
};

Tower.findStructures = function(towersLength) {
    const ramparts = this.room.ramparts;
    const roads = this.room.roads;
    const containers = this.room.containers;
    const structures = ramparts.concat(roads, containers);

    const filteredStructures = structures.filter(this.filterStructures.bind(this));

    if (filteredStructures.length > 1) {
        filteredStructures.sort((a, b) => a.hits - b.hits);
    }

    return filteredStructures.slice(0, towersLength);
};

Tower.findNearestStructure = function(towersLength, index) {
    let structures = this.STRUCTURES[this.room.name];
    let structuresInfo = this.room.memory.towerRepairInfo;

    if (!structuresInfo || Game.time > structuresInfo.nextRefresh) {
        structures = this.findStructures(towersLength);

        structuresInfo = {
            structures: structures.map(s => Codec.encodeId(s.id)),
            nextRefresh: (this.room.level === 8 ? Game.time + 15 : Game.time + 10)
        };

        this.room.memory.towerRepairInfo = structuresInfo;
    } else if (!structures) {
        structures = [];

        const _structures = structuresInfo.structures;

        for (let i = 0; i < towersLength; i++) {
            const structureId = _structures[i];

            if (structureId) {
                structures.push(Game.getObjectById(Codec.decodeId(structureId)));
            }
        }

        this.STRUCTURES[this.room.name] = structures;
    }

    const length = structures.length;

    if (length > 0) {
        if (index >= length) {
            index = index % length;
        }

        return structures[index];
    }

    return null;
};

Tower.update = function(tower, enemies, playerEnemies, woundedCreeps, structure, enemyIndex, woundedCreepIndex) {
    if (enemies.length > 0) {
        const hasEnemies = playerEnemies.length > 0;

        if (enemies.length > 0) {
            let enemy = null;

            if (hasEnemies) {
                const enemiesInRange = tower.pos.findInRange(playerEnemies, 20);
                const length = enemiesInRange.length;

                if (length > 0) {
                    if (enemyIndex >= length) {
                        enemyIndex = enemyIndex % length;
                    }

                    enemy = enemiesInRange[enemyIndex];
                }
            } else {
                const length = enemies.length;

                if (length > 0) {
                    if (enemyIndex >= length) {
                        enemyIndex = enemyIndex % length;
                    }

                    enemy = enemies[enemyIndex];

                    if (length <= 4 &&
                        enemies.every(e => e.owner.username === INVADER_USERNAME &&
                            e.getActiveBodyparts(HEAL) > 0 &&
                            e.getActiveBodyparts(ATTACK) === 0 &&
                            e.getActiveBodyparts(RANGED_ATTACK) === 0)) {
                                enemy = null;
                    }
                }
            }

            if (enemy) {
                tower.attack(enemy);

                return;
            }
        }
    }

    if (woundedCreeps.length > 0) {
        const length = woundedCreeps.length;

        if (length > 1) {
            if (woundedCreepIndex >= length) {
                woundedCreepIndex = woundedCreepIndex % length;
            }
        } else {
            woundedCreepIndex = 0;
        }

        const woundedCreep = woundedCreeps[woundedCreepIndex];

        if (woundedCreep) {
            tower.heal(woundedCreep);

            return;
        }
    }

    if (structure) {
        tower.repair(structure);
    }
};

module.exports = Tower;
