
function WarriorKeeper() {
}

WarriorKeeper.run = function(room, creep) {
    if (creep.room.name !== creep.targetFlag) {
        creep.role = 'traveler';

        return;
    }

    this.room = room;
    this.creep = creep;
    this.enemies = room.enemies;

    if (this.room.mineral.mineralAmount === 0 && this.room.mineral.ticksToRegeneration > this.creep.ticksToLive) {
        this.creep.role = 'recycler';

        return;
    }

    this.moveToNearestEnemy();
};

WarriorKeeper.findNearestEnemy = function() {
    let mapPart = this.creep.memory.warriorKeeperMapPart;
    let enemies = this.enemies;

    switch (mapPart) {
        case 1:
            enemies = _.filter(enemies, enemy => enemy.pos.x <= 24 && enemy.pos.y <= 24 && enemy.isSourceKeeper());
            break;
        case 2:
            enemies = _.filter(enemies, enemy => enemy.pos.x >= 24 && enemy.pos.y <= 24 && enemy.isSourceKeeper());
            break;
        case 3:
            enemies = _.filter(enemies, enemy => enemy.pos.x <= 24 && enemy.pos.y >= 24 && enemy.isSourceKeeper());
            break;
        case 4:
            enemies = _.filter(enemies, enemy => enemy.pos.x >= 24 && enemy.pos.y >= 24 && enemy.isSourceKeeper());
            break;
        default:
            if (mapPart !== -1) {
                this.findMapPart();

                return this.findNearestEnemy();
            }
            break;
    }

    return this.creep.pos.findClosestByPath(enemies);
};

WarriorKeeper.findNearestKeeperLair = function() {
    const mapPart = this.creep.memory.warriorKeeperMapPart;
    let keeperLairs = this.room.keeperLairs;
    switch (mapPart) {
        case 1:
            keeperLairs = _.filter(keeperLairs, function(keeperLair) {
                return keeperLair.pos.x <= 24 && keeperLair.pos.y <= 24;
            });
            break;
        case 2:
            keeperLairs = _.filter(keeperLairs, function(keeperLair) {
                return keeperLair.pos.x >= 24 && keeperLair.pos.y <= 24;
            });
            break;
        case 3:
            keeperLairs = _.filter(keeperLairs, function(keeperLair) {
                return keeperLair.pos.x <= 24 && keeperLair.pos.y >= 24;
            });
            break;
        case 4:
            keeperLairs = _.filter(keeperLairs, function(keeperLair) {
                return keeperLair.pos.x >= 24 && keeperLair.pos.y >= 24;
            });
            break;
        default:
            if (mapPart !== -1) {
                this.findMapPart();
                return this.findNearestKeeperLair();
            }
            break;
    }
    return _.sortBy(keeperLairs, 'ticksToSpawn')[0];
};

WarriorKeeper.findMapPart = function() {
    let mapPart = -1;
    if (this.creep.name.match(/-(\d+)/)) {
        mapPart = Number(RegExp.$1);
    }
    this.creep.memory.warriorKeeperMapPart = mapPart;
};

WarriorKeeper.moveToEnemy = function(enemy) {
    if (!enemy) {
        return;
    }

    // if (this.creep.hits < this.creep.hitsMax) {
    //     this.creep.heal(this.creep);
    // }
    // else {
    //     this.creep.rangedMassAttack();
    // }

    if (enemy.hits >= 100) {
        if (this.creep.hits < this.creep.hitsMax) {
            this.creep.heal(this.creep);
        }
    }

    if (this.creep.getActiveBodyparts(ATTACK) > 0) {
        let result = this.creep.attack(enemy);
        if (result === ERR_NOT_IN_RANGE) {
            this.creep.travelTo(enemy, {
                maxRooms: 1,
                ignoreCreeps: false,
                avoidHostileCreeps: true
            });

            // this.creep.moveTo(enemy, {
            //     maxRooms: 1,
            //     visualizePathStyle: {
            //         fill: 'transparent',
            //         stroke: '#FF1493',
            //         lineStyle: 'dashed',
            //         strokeWidth: .15,
            //         opacity: 0.3
            //     }
            // });
        }
    } else if (this.creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        let result = this.creep.rangedAttack(enemy);

        if (result === ERR_NOT_IN_RANGE) {
            this.creep.moveTo(enemy, {
                maxRooms: 1,
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#FF1493',
                    lineStyle: 'dashed',
                    strokeWidth: .15,
                    opacity: 0.3
                }
            });
        } else if (result === OK) {
            if (!this.creep.pos.isNearTo(enemy)) {
                this.creep.moveTo(enemy);
            }
        }
    }
};

WarriorKeeper.moveToKeeperLair = function(keeperLair) {
    if (!keeperLair) {
        return;
    }

    if (this.creep.hits < this.creep.hitsMax) {
        this.creep.heal(this.creep);
    }

    if (this.creep.pos.isNearTo(keeperLair)) {
        if (keeperLair.ticksToSpawn > 5) {
            this.creep.wait(5);
        }
    } else {
        this.creep.travelTo(keeperLair, {
            maxRooms: 1,
            ignoreCreeps: false,
            avoidHostileCreeps: true
        });
    }
};

WarriorKeeper.moveToNearestEnemy = function() {
    const enemyIdTimeout = this.creep.memory.enemyIdTimeout;
    const enemyId = this.creep.memory.enemyId;
    let findNew = true;
    let enemy = null;

    if (enemyId) {
        enemy = Game.getObjectById(enemyId);

        if (enemy && enemyIdTimeout > 0 && enemy.room === this.creep.room) {
            findNew = false;

            this.creep.memory.warriorEnemyIdTimeout--;
        } else {
            delete this.creep.memory.enemyId;
            delete this.creep.memory.warriorEnemyIdTimeout;
        }
    }

    if (findNew) {
        enemy = this.findNearestEnemy();

        if (enemy) {
            delete this.creep.memory.keeperLairId;

            this.creep.memory.enemyId = enemy.id;
            this.creep.memory.warriorEnemyIdTimeout = 2;
        } else {
            this.moveToNearestKeeperLair();

            return;
        }
    }

    this.moveToEnemy(enemy);
};

WarriorKeeper.moveToNearestKeeperLair = function() {
    let keeperLair = null;
    let findNew = true;

    let keeperLairId = this.creep.memory.keeperLairId;

    if (keeperLairId) {
        keeperLair = Game.getObjectById(keeperLairId);
        if (keeperLair) {
            findNew = false;
        }
    }

    if (findNew) {
        keeperLair = this.findNearestKeeperLair();
        if (keeperLair) {
            this.creep.memory.keeperLairId = keeperLair.id;
        }
    }

    this.moveToKeeperLair(keeperLair);
};

module.exports = WarriorKeeper;
