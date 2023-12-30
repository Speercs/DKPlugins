
function Warrior() {
}

Warrior.run = function(room, creep) {
    this.room = room;
    this.creep = creep;
    this.enemies = room.enemies;
    this.woundedCreeps = room.woundedCreeps;

    this.moveToNearestEnemy();
};

Warrior.findNearestEnemy = function() {
    let enemies = this.enemies;
    return this.creep.pos.findClosestByPath(enemies);
};

Warrior.findNearestWoundedCreep = function() {
    let creeps = this.woundedCreeps;

    return this.creep.pos.findClosestByPath(creeps);
};

Warrior.moveToEnemy = function(enemy) {
    if (!enemy) {
        return;
    }

    if (this.creep.getActiveBodyparts(RANGED_ATTACK) > 0 && this.enemies.length > 1) {
        if (this.creep.pos.findInRange(this.enemies, 3).length > 1) {
            this.creep.rangedMassAttack();
        }
    }

    let result = this.creep.rangedAttack(enemy);

    if (result === ERR_NOT_IN_RANGE && result !== ERR_NO_BODYPART) {
        this.creep.travelTo(enemy, {
            maxRooms: 1,
            ignoreCreeps: false,
            repath: 0.15
        });
    } else if (result === OK) {
        // if (enemy.owner.username === INVADER_USERNAME || !enemy.isDangerous()) {
        if (!enemy.pos.isBorder()) {
            this.creep.travelTo(enemy, {
                maxRooms: 1,
                ignoreCreeps: false,
                repath: 0.15
            });
        }
        // }

        return;
    }

    result = this.creep.attack(enemy);

    if (result === ERR_NOT_IN_RANGE) {
        this.creep.travelTo(enemy, {
            maxRooms: 1,
            ignoreCreeps: false,
            repath: 0.15
        });
    }
};

Warrior.moveToCreep = function(creep) {
    if (!creep) {
        return;
    }

    const result = this.creep.heal(creep);

    if (result === ERR_NOT_IN_RANGE) {
        this.creep.rangedHeal(creep);

        this.creep.moveTo(creep, {
            maxRooms: 1,
            visualizePathStyle: {
                fill: 'transparent',
                stroke: '#66ff66',
                lineStyle: 'dashed',
                strokeWidth: .15,
                opacity: 0.2
            }
        });
    } else if (result === OK) {
        this.creep.moveTo(creep, {
            maxRooms: 1,
            visualizePathStyle: {
                fill: 'transparent',
                stroke: '#66ff66',
                lineStyle: 'dashed',
                strokeWidth: .15,
                opacity: 0.2
            }
        });
    }
};

Warrior.moveToCore = function(core) {
    if (!core) {
        return;
    }

    let result = null;

    if (this.creep.getActiveBodyparts(ATTACK) > 0) {
        result = this.creep.attack(core);
    } else if (this.creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        result = this.creep.rangedAttack(core);
    }

    if (result === ERR_NOT_IN_RANGE || result === OK && !this.creep.pos.isNearTo(core.pos)) {
        this.creep.travelTo(core, { maxRooms: 1 });
    }
};

Warrior.moveToNearestEnemy = function() {
    if (this.creep.hits < this.creep.hitsMax) {
        this.creep.heal(this.creep);
    }

    // if (this.creep.room.name === 'E62S16') {
        // let construction = this.creep.pos.findClosestByPath(this.creep.room.find(FIND_CONSTRUCTION_SITES), {
        //     filter: construction => construction.progress > 0
        // });
        // if (construction) {
        //     this.creep.moveTo(construction);
        // }
        // this.creep.rangedMassAttack();
    //     let structures = _.filter(this.room.structures, function(structure) {
    //         return structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_LINK || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_TERMINAL;
    //     });
    //     if (structures.length > 0) {
    //         let structure = structures[0];
    //         this.creep.moveTo(structure);
    //         if (this.creep.rangedAttack(structure) === ERR_NOT_IN_RANGE) {
    //
    //         }
    //     }
    //     return;
    // }

    if (this.enemies.length > 0) {
        const enemyId = this.creep.memory.warriorEnemyId;
        const enemyIdTimeout = this.creep.memory.warriorEnemyIdTimeout;
        let findNew = true;
        let enemy = null;

        if (enemyId) {
            enemy = Game.getObjectById(enemyId);

            if (enemy && enemyIdTimeout > 0 && enemy.room === this.creep.room) {
                findNew = false;
                this.creep.memory.warriorEnemyIdTimeout--;
            } else {
                delete this.creep.memory.warriorEnemyId;
                delete this.creep.memory.warriorEnemyIdTimeout;
            }
        }

        if (findNew) {
            enemy = this.findNearestEnemy();

            if (enemy) {
                this.creep.memory.warriorEnemyId = enemy.id;
                this.creep.memory.warriorEnemyIdTimeout = 2;
            }
        }

        this.moveToEnemy(enemy);

        this.creep.memory.warriorWoundedCreepId = '';
    } else if (this.room.invaderCore) {
        if (this.creep.getActiveBodyparts(ATTACK) === 0 && this.creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
            this.creep.role = 'recycler';

            return;
        } else {
            this.moveToCore(this.room.invaderCore);
        }
    } else if (this.woundedCreeps.length > 0) {
        delete this.creep.memory.warriorEnemyId;
        delete this.creep.memory.warriorEnemyIdTimeout;

        if (this.creep.hits === this.creep.hitsMax && this.creep.getActiveBodyparts(HEAL) > 0) {
            const creepId = this.creep.memory.warriorWoundedCreepId;
            let findNew = true;
            let creep = null;

            if (creepId) {
                creep = Game.getObjectById(creepId);

                if (creep && creep.hits < creep.hitsMax && creep.room.name === this.creep.room.name) {
                    findNew = false;
                }
            }

            if (findNew) {
                delete this.creep.memory.warriorWoundedCreepId;

                creep = this.findNearestWoundedCreep();

                if (creep) {
                    this.creep.memory.warriorWoundedCreepId = creep.id;
                }
            }

            this.moveToCreep(creep);
        } else {
            delete this.creep.memory.warriorWoundedCreepId;
        }
    } else {
        delete this.creep.memory.warriorWoundedCreepId;

        // if (this.creep.room.name !== 'E35S7') {
            if (this.room.isReservedByMe) {
                const around = this.room.around(1);
                let recycler = true;

                for (const roomName of around) {
                    const room = Game.rooms[roomName];
                    const roomMemory = Memory.rooms[roomName];

                    if (room && (room.isReservedByMe || room.my && room.level < 3) && (room.invaders.length > 0 || room.playerEnemies.length > 0) || roomMemory && roomMemory.invaders > 0) {
                        this.creep.role = 'traveler';
                        this.creep.targetFlag = room.name;

                        recycler = false;
                    }
                }

                if (recycler) {
                    this.creep.role = 'recycler';
                }
            } else if (this.room.isHostile) {
                const spawns = this.room.spawns;

                if (spawns.length > 0) {
                    const spawn = this.creep.pos.findClosestByPath(spawns);

                    if (spawn) {
                        if (this.creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
                            if (this.creep.rangedAttack(spawn) === ERR_NOT_IN_RANGE || !this.creep.pos.isNearTo(spawn)) {
                                this.creep.travelTo(spawn, { maxRooms: 1 });
                            }

                            return;
                        }
                    }
                }

                const constructions = this.room.constructionSites;

                if (constructions.length > 0) {
                    const construction = constructions[0];

                    this.creep.travelTo(construction, { maxRooms: 1 });
                }
            } else if (!this.room.my && this.creep.getActiveBodyparts(ATTACK) > 0 && this.creep.getActiveBodyparts(RANGED_ATTACK) === 0) {
                this.creep.role = 'recycler';
            }
        // }
    }
};

module.exports = Warrior;
