
function Defender() {
}

Defender.ROOMS = {
    // E32S5: true,
    // E62S27: true,
    // E46S13: true,
};

Defender.run = function(room, creep) {
    this.room = room;
    this.creep = creep;
    this.creeps = room.woundedCreeps;
    this.enemies = room.enemies;
    this.playerEnemies = room.playerEnemies;
    this.update();
};

Defender.canMove = function() {
    if (this.ROOMS[this.creep.room.name]) {
        return true;
    }

    // return true;
    // if (this.creep.hits < 4700) {
    //     return false;
    // }

    const defenderType = this.creep.memory.defenderType;

    // if (defenderType === 'ranged') {
    //     return true;


    if (defenderType === 'warrior' || defenderType === 'ranged') {
        if (this.enemies.length === 0) {
            return true;
        }

        const creeps = this.room.creeps.filter(c => c.role === 'healerDefender');
        const healers = this.creep.pos.findInRange(creeps, 1);

        if (healers.length === 0) {
            return false;
        }

        return healers.every(c => c.fatigue === 0 && c.getActiveBodyparts(MOVE) > 0);
    }

    return true;
};

Defender.moveToCreep = function(creep) {
    // if (!creep) {
    //     return;
    // }
    // if (!this.canMove()) {
    //     this.moveToHealer();
    //     return;
    // }

    if (!creep || !this.canMove()) {
        return;
    }

    this.creep.travelTo(creep, {
        maxRooms: 1,
        ignoreRoads: creep.hits === creep.hitsMax,
        ignoreCreeps: false,
    });
};

Defender.updateWarrior = function() {
    if (this.creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        // if (this.room.terminal && this.creep.pos.findInRange([this.room.terminal], 3).length === 0) {
            this.creep.rangedMassAttack();
            // const enemies = this.creep.pos.findInRange(this.room.enemies, 3);
            // if (enemies.length > 0) {
            //     const enemy = this.creep.pos.findClosestByPath(enemies);
            //     this.creep.rangedAttack(enemy);
            // } else {
            //     this.creep.rangedMassAttack();
            // }
        // } else {
            const enemies = this.creep.pos.findInRange(this.room.enemies, 3);
            if (enemies.length > 0) {
                const enemy = this.creep.pos.findClosestByPath(enemies);
                this.creep.rangedAttack(enemy);
            }
        // }
    }

    if (this.creep.getActiveBodyparts(HEAL) > 0) {
        if (this.creep.hits < this.creep.hitsMax) {
            this.creep.heal(this.creep);

            if (this.creep.hits <= this.creep.hitsMax * 0.75) {
                this.moveToHealer();

                return;
            }
        } else {
            // const creep = this.creep.pos.findInRange(
            //     this.creeps.filter(c => c.role === 'healerDefender' || c.role === 'rangedDefender'), 1)[0];
            //
            // if (creep) {
            //     this.creep.heal(creep);
            //
            //     return;
            // }
        }
    }

    // if (this.creep.getActiveBodyparts(HEAL) > 0) {
    //     this.creep.heal(this.creep);
    // }

    const tasks = {
        E62S12: 1,
        E64S11: 1,
        E62S16: '5e2f1f6d600aa61dc70b76ab',
        E68S17: '5e2e8be25cc913b1a43b29bd',
        E66S18: '5e3e79e08812355d1e533e35',
        E64S17: '5e2fb24b644a561b1ee4589e',
        E63S19: '5e2f7b0c21cffc4be35415b4',
        E68S16: '5e3fcd6d99111e2606253f17',
        E69S12: '639955f3c4739de740e7cf8b',

        E41S13: '63a685a8dda170ae5a17db08',
        E49S13: '6173b24c4f0d5ec63090f830',
        E27S9: ['5bf5095c7a11b045dcc73ee2', '5c0f81f156e6a83ad6e482da'],
        E25S8: ['5bce1e47194e6b7ce0c2a32b', '5be6a6ed6bc2f040ec545ba4'],
        E29S6: '5c1aa860cc29c97158ed70c2',
        E33S13: [],
        E33S14: [],
        E22S6: '5bd0bac2fdeb211b692d2e36',
        E22S4: 1,
        E22S7: 1,
        E24S3: 1,
        E46S13: '6077038bcc697434254fc9d4',
        E49S14: '637524a3af1f64e8f5d12e4c',
        E51S16: '635a80fbdb54e5c3c307fee7',
        E48S11: ['61734e5e9faff286a0fb3a15', '61734ee4d45697a26abdef62', '6173475959e951dbc78cc62d', '61734afa9505cf4db0c36a86', '6173441ee05c6ca548934e6f'],
        // E34S13: '5e25c0daca55d73706770d5d',
        // E38S14: '5e259b5448a65b2e32319bf7',
    };

    if (tasks[this.creep.room.name] && !this.room.my) {

        // var enemy = this.creep.pos.findInRange(this.enemies, 1)[0];
        // if (enemy) {
        //     if (this.creep.attack(enemy) === ERR_NOT_IN_RANGE) {
        //         this.moveToCreep(enemy);
        //     }
        //     return;
        // } else {

        if (this.creep.hits <= this.creep.hitsMax * 0.75) {
            this.moveToHealer();

            return;
        }

        const targets = tasks[this.creep.room.name];
        let rampart = null;

        if (Array.isArray(targets)) {
            rampart = targets.map(t => Game.getObjectById(t)).find(t => !!t);
        } else {
            rampart = Game.getObjectById(tasks[this.creep.room.name]);
        }

            if (rampart && rampart.room.name === this.creep.room.name) {
                if (this.creep.getActiveBodyparts(ATTACK) > this.creep.getActiveBodyparts(WORK)) {
                    if (this.creep.attack(rampart) === ERR_NOT_IN_RANGE) {
                        if (this.creep.getActiveBodyparts(HEAL) > 0) {
                            this.creep.heal(this.creep);
                        }

                        this.moveToCreep(rampart);
                    }
                } else {
                    if (this.creep.dismantle(rampart) === ERR_NOT_IN_RANGE) {
                        if (this.creep.getActiveBodyparts(HEAL) > 0) {
                            this.creep.heal(this.creep);
                        }

                        this.moveToCreep(rampart);
                    }
                }

                return;
            } else {
                // rampart = Game.getObjectById('5963a6090f978e07159742a3');
                // if (rampart) {
                //     if (this.creep.dismantle(rampart) === ERR_NOT_IN_RANGE) {
                //         this.moveToCreep(rampart);
                //     }
                //     return;
                // } else {

                // this.moveToCreep(new RoomPosition(44, 20, this.creep.room.name));
                // return;
                    const spawns = this.room.spawns;

                    if (spawns.length > 0) {
                        const spawn = spawns[0];

                        if (this.creep.dismantle(spawn) === ERR_NOT_IN_RANGE) {
                            this.moveToCreep(spawn);
                        }
                    } else {
                        const towers = this.room.towers;

                        if (towers.length > 0) {
                            const tower = this.creep.pos.findClosestByPath(towers);

                            if (this.creep.dismantle(tower) === ERR_NOT_IN_RANGE) {
                                this.moveToCreep(tower);
                            }
                        } else {
                            const extensions = this.room.extensions;

                            if (extensions.length > 0) {
                                const extension = this.creep.pos.findClosestByPath(extensions); // extensions[0];

                                if (this.creep.dismantle(extension) === ERR_NOT_IN_RANGE) {
                                    this.moveToCreep(extension);
                                }
                            } else {
                                const labs = this.room.labs;

                                if (labs.length > 0) {
                                    const lab = labs[0];

                                    if (this.creep.dismantle(lab) === ERR_NOT_IN_RANGE) {
                                        this.moveToCreep(lab);
                                    }
                                } else {
                                    const links = this.room.links;

                                    if (links.length > 0) {
                                        const link = links[0];

                                        if (this.creep.dismantle(link) === ERR_NOT_IN_RANGE) {
                                            this.moveToCreep(link);
                                        }
                                    } else {
                                        // const structures = _.filter(this.room.structures, function(structure) {
                                        //     return structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_TERMINAL;
                                        // });
                                        //
                                        // if (structures.length > 0) {
                                        //     const structure = structures[0];
                                        //
                                        //     if (this.creep.dismantle(structure) === ERR_NOT_IN_RANGE) {
                                        //         this.moveToCreep(structure);
                                        //     }
                                        // }
                                    }
                                }
                                // const structures = _.filter(this.room.structures, function(structure) {
                                //     return structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_TERMINAL;
                                // });
                                // if (structures.length > 0) {
                                //     const structure = structures[0];
                                //     if (this.creep.dismantle(structure) === ERR_NOT_IN_RANGE) {
                                //         this.moveToCreep(structure);
                                //     }
                                // }
                            }
                        }
                    }
                // }
            }
    }

    if (this.room.my && this.enemies.length > 0 && this.creep.getActiveBodyparts(ATTACK) > 0) {
        const enemy = this.creep.pos.findClosestByPath(this.enemies);
        if (enemy) {
            if (this.creep.attack(enemy) === ERR_NOT_IN_RANGE) {
                this.moveToCreep(enemy);
            }
        }
    }

    // if (this.enemies.length > 0) {
    //     let enemy = this.creep.pos.findClosestByPath(this.enemies);
    //     if (enemy) {
    //         this.creep.memory.defenderResurrectionWait = 75;
    //         if (this.creep.attack(enemy) === ERR_NOT_IN_RANGE) {
    //             this.moveToCreep(enemy);
    //         }
    //     }
    // }

    // if (this.creep.room.name === 'E63S15') {
    //     var spawns = _.filter(this.room.structures, function(structure) {
    //         return structure.structureType === STRUCTURE_SPAWN;
    //     });
    //     if (spawns.length > 0) {
    //         var spawn = spawns[0];
    //         if (this.creep.attack(spawn) === ERR_NOT_IN_RANGE) {
    //             this.moveToCreep(spawn);
    //         }
    //     } else {
    //         var towers = _.filter(this.room.structures, function(structure) {
    //             return structure.structureType === STRUCTURE_TOWER;
    //         });
    //         if (towers.length > 0) {
    //             var tower = towers[0];
    //             if (this.creep.attack(tower) === ERR_NOT_IN_RANGE) {
    //                 this.moveToCreep(tower);
    //             }
    //         } else {
    //             var extensions = _.filter(this.room.structures, function(structure) {
    //                 return structure.structureType === STRUCTURE_EXTENSION;
    //             });
    //             if (extensions.length > 0) {
    //                 var extension = extensions[0];
    //                 if (this.creep.attack(extension) === ERR_NOT_IN_RANGE) {
    //                     this.moveToCreep(extension);
    //                 }
    //             } else {
    //                 var structures = _.filter(this.room.structures, function(structure) {
    //                     return structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_TERMINAL || structure.structureType === STRUCTURE_CONTAINER;
    //                 });
    //                 if (structures.length > 0) {
    //                     var structure = structures[0];
    //                     if (this.creep.attack(structure) === ERR_NOT_IN_RANGE) {
    //                         this.moveToCreep(structure);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
};

Defender.updateRanged = function() {
    if (Game.time % 2 === 0) {
        this.creep.say('Welcome to', true);
    } else {
        this.creep.say('Russia!', true);
    }
    // var enemies = this.creep.pos.findInRange(this.enemies, 3);
    // if (enemies.length > 1) {
    //     this.creep.rangedMassAttack();
    // }

    // if (this.creep.room.name === 'E86S9') {
    //     var rampart = Game.getObjectById('58ee896ecf8fda1e0fbf6277');
    //     if (rampart) {
    //         // this.moveToCreep(rampart);
    //         if (this.creep.rangedAttack(rampart) === ERR_NOT_IN_RANGE) {
    //             this.moveToCreep(rampart);
    //         }
    //         return;
    //     }
    // }

    // if (this.playerEnemies.length > 1) {
    //     this.creep.rangedMassAttack();
    // }
    let enemy = this.creep.pos.findClosestByPath(this.enemies);
    if (enemy) {
        this.creep.memory.defenderResurrectionWait = 75;
        this.moveToCreep(enemy);
        if (this.creep.rangedAttack(enemy) === ERR_NOT_IN_RANGE) {
            this.moveToCreep(enemy);
        }
    }

    // if (this.creep.room.name === 'E63S15') {
    //         // let enemy = this.creep.pos.findInRange(this.enemies, 1)[0];
    //     this.creep.rangedMassAttack();
    //     let enemy;
    //     if (Game.time % 10 === 0) {
    //         enemy = this.creep.pos.findClosestByPath(this.enemies);
    //     }
    //     // let enemy = Game.getObjectById('59921b20f4b4483e0309e74b');
    //         if (enemy) {
    //             if (this.creep.rangedAttack(enemy) === ERR_NOT_IN_RANGE) {
    //                 this.moveToCreep(enemy);
    //             } else {
    //                 this.moveToCreep(enemy);
    //             }
    //             return;
    //         }
    //     //     // } else {
    //     let rampart = Game.getObjectById('587308b292cf63442c1deaf0');
    //     if (rampart) {
    //         if (this.creep.dismantle(rampart) === ERR_NOT_IN_RANGE) {
    //             this.moveToCreep(rampart);
    //         }
    //         return;
    //     } else {
    //         rampart = Game.getObjectById('58581ef0959eff7667c12a2c');
    //         if (rampart) {
    //             if (this.creep.dismantle(rampart) === ERR_NOT_IN_RANGE) {
    //                 this.moveToCreep(rampart);
    //             }
    //             return;
    //         } else {
    //             this.creep.rangedMassAttack();
    //             let spawns = _.filter(this.room.structures, function(structure) {
    //                 return structure.structureType === STRUCTURE_SPAWN;
    //             });
    //             if (spawns.length > 0) {
    //                 let spawn = spawns[0];
    //                 if (this.creep.rangedAttack(spawn) === ERR_NOT_IN_RANGE) {
    //                     this.moveToCreep(spawn);
    //                 } else {
    //                     this.moveToCreep(spawn);
    //                 }
    //             } else {
    //                 let towers = _.filter(this.room.structures, function(structure) {
    //                     return structure.structureType === STRUCTURE_TOWER;
    //                 });
    //                 if (towers.length > 0) {
    //                     let tower = this.creep.pos.findClosestByPath(towers);
    //                     if (this.creep.rangedAttack(tower) === ERR_NOT_IN_RANGE) {
    //                         this.moveToCreep(tower);
    //                     }
    //                 } else {
    //                     let extensions = _.filter(this.room.structures, function(structure) {
    //                         return structure.structureType === STRUCTURE_EXTENSION;
    //                     });
    //                     if (extensions.length > 0) {
    //                         let extension = extensions[0];
    //                         if (this.creep.rangedAttack(extension) === ERR_NOT_IN_RANGE) {
    //                             this.moveToCreep(extension);
    //                         } else {
    //                             this.moveToCreep(extension);
    //                         }
    //                     } else {
    //                         let structures = _.filter(this.room.structures, function(structure) {
    //                             return structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_TERMINAL || structure.structureType === STRUCTURE_LINK || structure.structureType === STRUCTURE_EXTRACTOR;
    //                         });
    //                         if (structures.length > 0) {
    //                             let structure = structures[0];
    //                             if (this.creep.rangedAttack(structure) === ERR_NOT_IN_RANGE) {
    //                                 this.moveToCreep(structure);
    //                             } else {
    //                                 this.moveToCreep(structure);
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
};

Defender.updateHeal = function() {
    // if (this.creep.room.name === 'E63S15') {
    //     if (this.creep.hits < this.creep.hitsMax) {
    //         this.creep.heal(this.creep);
    //         return;
    //     }
    // }

    if (this.creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        // this.creep.rangedMassAttack();

        if ((this.room.terminal || this.room.storage)) {
            const structures = [];

            if (this.room.terminal) {
                structures.push(this.room.terminal);
            }

            if (this.room.storage) {
                structures.push(this.room.storage);
            }

            if (this.room.factory) {
                structures.push(this.room.factory);
            }

            if (structures.length === 0 || this.creep.pos.findInRange(structures, 3).length === 0) {
                this.creep.rangedMassAttack();
            }

            const enemies = this.creep.pos.findInRange(this.room.enemies, 3);

            if (enemies.length > 0) {
                const enemy = this.creep.pos.findClosestByPath(enemies);

                this.creep.cancelOrder('rangedMassAttack');
                this.creep.rangedAttack(enemy);
            }
        } else {
            const enemies = this.creep.pos.findInRange(this.room.enemies, 3);

            if (enemies.length > 0) {
                let enemy = this.creep.pos.findClosestByPath(enemies);

                if (!enemy) {
                    enemy = enemies[0];
                }

                this.creep.rangedAttack(enemy);
            }
        }
    }

    let creeps = this.creep.pos.findInRange(this.creeps, 3);

    if (creeps.length > 0) {
        creeps.sort((a, b) => a.hits - b.hits);

        const creep = creeps[0];

        if (this.creep.pos.isNearTo(creep)) {
            if (this.creep !== creep) {
                this.moveToCreep(creep);
            } else {
                const creeps = this.room.creeps
                    .filter(c => c.role === 'warriorDefender' || c.role === 'rangedDefender');
                const otherCreep = this.creep.pos.findClosestByPath(creeps);

                if (otherCreep) {
                    this.moveToCreep(otherCreep);
                }
            }

            this.creep.heal(creep);
        } else {
            this.moveToCreep(creep);

            if (this.creep.rangedHeal(creep) !== OK) {
                this.creep.heal(this.creep);
            }
        }
    } else {
        let creep = this.creep.pos.findClosestByPath(this.creeps);

        if (creep) {
            if (this.creep.heal(creep) === ERR_NOT_IN_RANGE) {
                this.moveToCreep(creep);

                this.creep.heal(this.creep);
            }
        } else {
            creeps = this.room.creeps
                .filter(c => c.role === 'warriorDefender' || c.role === 'rangedDefender');

            if (creeps.length > 0) {
                creep = this.creep.pos.findClosestByPath(creeps);

                if (creep) {
                    this.moveToCreep(creep);

                    if (this.creep.pos.isNearTo(creep)) {
                        this.creep.heal(creep);
                    } else {
                        if (this.creep.rangedHeal(creep) !== OK) {
                            this.creep.heal(this.creep);
                        }
                    }
                }
            } else {
                this.creep.heal(this.creep);
            }
        }
    }

    // if (this.enemies.length > 0) {
    //     this.creep.memory.defenderResurrectionWait = 75;
    // }
};

Defender.updateResurrector = function() {
    if (this.creep.ticksToLive < 1470 && this.creep.room.energyAvailable > this.creep.room.energyCapacityAvailable * 0.5) {
        // let structures = this.creep.pos.findInRange(FIND_MY_STRUCTURES, 50, {
        //     filter: function(structure) {
        //         return !structure.spawning && structure.structureType === STRUCTURE_SPAWN;
        //     }
        // });

        const structures = _.filter(this.room.spawns, spawn => !spawn.spawning);

        if (structures.length > 0) {
            const spawn = structures[0];
            const result = spawn.renewCreep(this.creep);
            if (result === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(spawn);

                if (this.creep.hits === this.creep.hitsMax) {
                    return true;
                }
            } else if (result === OK) {
                this.creep.memory.boosted = 0;

                if (this.creep.hits === this.creep.hitsMax) {
                    return true;
                }
            }
        }
    }
    return false;
};

Defender.update = function() {
    // if (this.creep.room.name === 'E64S13') {
    //     this.creep.heal(this.creep);
    //     this.creep.moveTo(27, 30);
    //     return;
    // }
    // if (this.room.my && this.playerEnemies.length === 0) { // this.room.name !== 'E64S13'
    //     let wait = this.creep.memory.defenderResurrectionWait;
    //     if (wait > 0) {
    //         this.creep.memory.defenderResurrectionWait = wait - 1;
    //         return;
    //     }
    //     if (this.updateResurrector()) {
    //         return;
    //     }
    // }

    if (this.playerEnemies.length === 0 && !this.creep.memory.boosted) {
        if (this.updateResurrector()) {
            return;
        }
    }

    switch (this.creep.memory.defenderType) {
        case 'warrior': {
            // if (this.playerEnemies.length > 0 && !this.creep.memory.boosted) {
            //     this.creep.role = 'booster';
            //     this.creep.memory.boosts = [
            //         RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
            //         RESOURCE_CATALYZED_UTRIUM_ACID,
            //         RESOURCE_CATALYZED_GHODIUM_ALKALIDE
            //     ];
            //     return;
            // }
            this.updateWarrior();
            break;
        }

        case 'ranged': {
            // if (this.playerEnemies.length > 0 && !this.creep.memory.boosted) {
            //     this.creep.role = 'booster';
            //     this.creep.memory.boosts = [
            //         RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
            //         RESOURCE_CATALYZED_KEANIUM_ALKALIDE,
            //         RESOURCE_CATALYZED_GHODIUM_ALKALIDE
            //     ];
            //     return;
            // }
            this.updateRanged();
            break;
        }

        case 'heal': {
            // if (this.playerEnemies.length > 0 && !this.creep.memory.boosted) {
            //     this.creep.role = 'booster';
            //     this.creep.memory.boosts = [
            //         RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
            //         RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
            //         RESOURCE_CATALYZED_GHODIUM_ALKALIDE
            //     ];
            //     return;
            // }
            this.updateHeal();
            break;
        }
    }
    // if (this.enemies.length === 0) {
    //     this.updateTraveler();
    // }
};

Defender.moveToHealer = function() {
    const creeps = this.room.creeps.filter(c => c.role === 'healerDefender');
    const creep = this.creep.pos.findClosestByPath(creeps);

    if (creep) {
        this.creep.travelTo(creep, { maxRooms: 1, ignoreCreeps: false });
    }
};

Defender.updateTraveler = function() {
    const targetFlag = this.creep.targetFlag;

    if (!targetFlag) {
        return;
    }

    if (this.room.name === targetFlag && !this.creep.pos.isBorder()) {
        return;
    }

    if (this.canMove()) {
        ModuleManager.run('traveler', this.room, this.creep);
    }
};

module.exports = Defender;
