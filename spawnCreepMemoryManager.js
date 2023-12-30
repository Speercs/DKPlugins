
function SpawnCreepMemoryManager() {
}

//

SpawnCreepMemoryManager.getMemory = function(role) {
    let memory = {
        w: 0,
        role: 'getter',
        getterType: RESOURCE_ENERGY,
        initRole: role,
        initRoom: this.room.name,
    };

    switch (role) {
        case 'remoteRepairer':
            break;
        case 'ramparter':
            memory.role = 'booster';
            memory.boosts = [RESOURCE_CATALYZED_LEMERGIUM_ACID];
            memory.workerStructureType = STRUCTURE_RAMPART;
            break;
        case 'waller':
            memory.role = 'booster';
            memory.boosts = [RESOURCE_CATALYZED_LEMERGIUM_ACID];
            memory.workerStructureType = STRUCTURE_WALL;
            break;
        case 'minerMineral':
            memory.role = 'minerMineral';
            memory.getterType = this.room.mineral.mineralType;
            break;
        case 'carrier':
        case 'carrierUpgrader':
            memory.getterType = RESOURCE_ENERGY;
            break;
        case 'central':
        case 'carrierLab':
        case 'carrierMineral':
        case 'carrierNuker':
            memory = { role };
            break;
        case 'carrierLinkTerminal':
            memory.role = role;
            memory.getterType = RESOURCE_ENERGY;
            break;
        case 'carrierBoost':
            memory.role = role;

            delete memory.getterType;
            break;
        case 'warriorDefender':
            memory.role = role;
            memory.defenderType = 'warrior';
            memory.boosts = [
                RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
                // RESOURCE_CATALYZED_UTRIUM_ACID,
                RESOURCE_CATALYZED_ZYNTHIUM_ACID,
                RESOURCE_CATALYZED_GHODIUM_ALKALIDE,
                RESOURCE_CATALYZED_KEANIUM_ALKALIDE,
                RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE
            ];
            memory.roleAfterBoost = role;

            delete memory.getterType;

            break;
        case 'rangedDefender':
            memory.role = role;
            memory.defenderType = 'ranged';
            memory.boosts = [
                RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
                RESOURCE_CATALYZED_KEANIUM_ALKALIDE,
                RESOURCE_CATALYZED_GHODIUM_ALKALIDE
            ];
            memory.roleAfterBoost = role;

            delete memory.getterType;

            break;
        case 'healerDefender':
            memory.role = role;
            memory.defenderType = 'heal';
            memory.boosts = [
                RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
                RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
                RESOURCE_CATALYZED_GHODIUM_ALKALIDE,
                RESOURCE_CATALYZED_KEANIUM_ALKALIDE
            ];
            memory.roleAfterBoost = role;

            delete memory.getterType;

            break;

        default:
            const splittedRole = this.roleOptions.splittedRole;
            const roleBase = splittedRole[0];

            if (roleBase) {
                // 1 - option (room or other)
                // 2 - option (room or other)

                const room = splittedRole[1];

                if (Room.isRoomName(room)) {
                    memory.role = 'traveler';
                    memory.targetFlag = room;
                }

                switch (roleBase) {
                    case 'warriorMineral':
                    case 'warriorKeeper': {
                        memory.roleAfterTraveler = 'warriorKeeper';
                        memory.warriorKeeperMapPart = Number(splittedRole[2]) || null;
                        break;
                    }
                    case 'miner': {
                        let index;

                        delete memory.w;
                        delete memory.getterType;

                        if (Room.isRoomName(room)) {
                            memory.roleAfterTraveler = 'miner';
                            index = Number(splittedRole[2]);

                            if (room === 'E37S5' && Shard.shard1) {
                                memory.doubleMiner = 1;
                            }
                        } else {
                            memory = { role: roleBase, minerSourceIndex: Number(splittedRole[1]), initRole: role };

                            if (this.room.name === 'E68S8' || this.room.name === 'E39S6') {
                                memory.doubleMiner = 1;
                            }

                            return memory;
                        }

                        if (Number.isFinite(index)) {
                            memory.minerSourceIndex = index;
                        }

                        break;
                    }
                    case 'minerMineral': {
                        memory.roleAfterTraveler = 'minerMineral';

                        // TODO: check Game.rooms

                        delete memory.w;
                        delete memory.getterType;

                        const roomMemory = Memory.rooms[room];

                        if (roomMemory) {
                            memory.getterType = roomMemory.mineral.type;
                        }

                        break;
                    }
                    case 'marauder':
                        memory = { role: roleBase, initRoom: this.room.name };
                        break;
                    case 'caravan': {
                        memory = { role: roleBase, initRoom: this.room.name };

                        // memory.role = 'booster';
                        // memory.boosts = ['KH'];
                        // memory.roleAfterBoost = 'caravan';
                        break;
                    }
                    case 'carrier':
                    case 'carrierMineral': {
                        const option = splittedRole[2];

                        memory = {
                            role: 'carrierRoom',
                            initRoom: this.room.name,
                            initRole: role,
                            from: room
                        };

                        if (Room.isRoomName(option)) {
                            memory.to = option;
                        } else {
                            memory.to = this.room.name;
                        }

                        if (Resource.isResource(option)) {
                            memory.resourceType = option;
                        } else if (Resource.isResource(splittedRole[3])) {
                            memory.resourceType = splittedRole[3];
                        }

                        if (roleBase === 'carrierMineral') {
                            const roomMemory = Memory.rooms[room];

                            if (roomMemory) {
                                memory.resourceType = roomMemory.mineral.type;
                            }
                        }

                        break;
                    }
                    case 'carrierStorage':
                    case 'carrierTerminal': {
                        memory = { role: roleBase };
                        break;
                    }
                    case 'upgrader': {
                        if (room) {
                            memory.role = 'booster';
                            memory.boosts = [RESOURCE_CATALYZED_GHODIUM_ACID];
                            memory.roleAfterBoost = 'traveler';
                            memory.targetFlag = room;
                            memory.roleAfterTraveler = 'upgrader';
                        } else {
                            memory.role = 'upgrader';
                            memory.boosts = [RESOURCE_CATALYZED_GHODIUM_ACID];
                            memory.roleAfterBoost = 'upgrader';

                            if (this.room.level < 8 && this.room.terminal && this.room.labs.length > 0) {
                                memory.role = 'booster';
                            }
                        }

                        break;
                    }
                    case 'builder': {
                        if (room) {
                            memory.role = 'booster';
                            memory.boosts = [RESOURCE_CATALYZED_LEMERGIUM_ACID];
                            memory.roleAfterBoost = 'traveler';
                            memory.roleForGetter = 'builder';
                            memory.targetFlag = room;
                        } else {
                            memory.role = 'booster';
                            memory.boosts = [RESOURCE_CATALYZED_LEMERGIUM_ACID];
                        }

                        break;
                    }
                    case 'dismantler': {
                        memory.roleAfterTraveler = 'dismantler';
                        break;
                    }
                }

                return memory;
            }

            break;
    }

    return memory;
};


module.exports = SpawnCreepMemoryManager;
