
function RemoteRepairer() {
}


RemoteRepairer.STANDARD_WAIT_TIME = 7000;

RemoteRepairer.WAIT_TIME = {
    E68S9: 8000,
    // E68S8: 6000,
    // E74S21: 3000,

    E42S9: 6000,
    E39S6: 6000,
    E38S12: 6000,
    E37S4: 4000,
    // E39S9: 6000,
    E45S9: 5000,
    // E44S3: 6000,
    // E38S14: 6000,
    // E44S17: 6000,

    // E38S9: 3000,
    // E42S11: 6000,
    // E47S14: 6000,
    // E44S3: 6000,
    // E37S5: 6000,
    // E47S8: 6000,
    // E48S9: 6000,
    // E49S16: 3000,
    // E35S8: 6000,
    // E42S13: 3000,
    // E35S3: 6000,
    // E45S18: 6000,
    E42S15: 5000,

    // E39S11: 2000,
};

RemoteRepairer.RESERVATION = {
    E68S9: ['E67S9', 'E69S9'],
    E68S8: ['E69S8', 'E67S8', 'E67S7'],
    E67S14: ['E66S13', 'E67S13', 'E68S13'],
    E64S13: ['E64S12', 'E65S13', 'E65S12', 'E65S11'],
    E74S21: ['E73S21', 'E75S21', 'E75S22', 'E76S21'],

    E42S9: ['E41S9', 'E42S8', 'E43S8'],
    E39S6: ['E39S7', 'E39S5', 'E39S4', 'E38S6', 'E38S7'],
    E38S12: ['E39S12', 'E39S13', 'E39S11'],
    E37S4: ['E38S3', 'E37S3', 'E36S3', 'E37S5', 'E38S4'],
    E39S9: ['E39S8', 'E38S8'],
    E44S3: ['E44S2', 'E45S2', 'E45S3'],
    E47S8: ['E47S9', 'E46S8', 'E47S7'],
    E45S9: ['E45S8', 'E46S9'],
    E38S14: ['E37S13', 'E37S14', 'E38S15', 'E39S14'],
    E37S16: ['E38S16', 'E37S15'],
    E44S17: ['E45S18', 'E45S17', 'E46S17'],
    E27S9: ['E26S9', 'E26S8', 'E27S8', 'E28S9'],
    E23S5: ['E22S5', 'E23S6'],
    E24S3: ['E23S3', 'E23S4', 'E25S3'],

    E38S9: ['E37S8', 'E38S8', 'E39S8', 'E39S9'],
    E42S11: ['E43S11', 'E43S12'],
    E47S14: ['E47S13', 'E48S13', 'E48S14'],
    E37S5: ['E37S4', 'E38S4', 'E38S5'],
    E48S9: ['E48S8', 'E47S9', 'E47S8'],
    E49S16: ['E49S17', 'E48S16', 'E49S15'],
    E42S13: ['E42S12', 'E43S13'],
    E47S11: ['E47S12'],
    E35S3: ['E37S3', 'E36S3', 'E36S2', 'E35S2'],
    E35S8: ['E34S8', 'E36S8', 'E35S7', 'E35S9'],
    E45S18: ['E44S18', 'E46S18', 'E45S19', 'E44S19'],
    E42S15: ['E41S15', 'E41S14', 'E42S16', 'E41S16', 'E42S14'],
    E32S5: ['E32S4', 'E32S6', 'E33S5', 'E33S6'],

    E39S11: ['E39S12', 'E38S12', 'E38S11'],
};

RemoteRepairer.run = function(room, creep) {
    this.room = room;

    /**
     * @type {Creep}
     */
    this.creep = creep;

    this.newRole = null;

    this.update();

    return this.newRole;
};

RemoteRepairer.moveToContainer = function(container) {
    if (!container) {
        return;
    }

    if (!this.creep.pos.isNearTo(container)) {
        this.creep.travelTo(container, {
            maxRooms: 1,
            maxOps: 1000,
            ignoreRoads: false,
            offRoad: false
        });

        const visual = this.room.visual;

        if (visual) {
            visual.circle(container.pos, {
                radius: 0.45,
                stroke: '#00f0f0',
                strokeWidth: .15,
                opacity: 0.25
            });
        }
    }
};

RemoteRepairer.moveToRoad = function(road) {
    if (!road) {
        return;
    }

    this.room.visual.circle(road.pos, {
        radius: 0.45,
        stroke: '#00f0f0',
        strokeWidth: .15,
        opacity: 0.25
    });

    const result = this.creep.repair(road);

    if (result === ERR_NOT_IN_RANGE) {
        this.creep.travelTo(road, {
            maxRooms: 1,
            maxOps: 1000
        });
    } else if (result === OK) {
        this.creep.say(road.hits);
    }
};

RemoteRepairer.findRoadInRange = function(roads, position = this.creep.pos) {
    const around = position.around(3, { encode: false });
    const pos = around.find((pos) => {
        const road = pos.getStructure(STRUCTURE_ROAD);

        if (!road) {
            return false;
        }

        return road.hits < road.hitsMax && roads.includes(road.id);
    });

    return pos ? pos.getStructure(STRUCTURE_ROAD) : null;
};

RemoteRepairer.updateRepairer = function() {
    let containers = this.creep.memory.remoteRepairerContainers;

    if (!containers) {
        containers = _.map(this.room.containers, c => c.id);

        this.creep.memory.remoteRepairerContainers = containers;
    }

    const containerId = containers[0];
    let container = null;

    if (containerId) {
        container = Game.getObjectById(containerId);

        if (!container) {
            delete this.creep.memory.remoteRepairerContainers;

            return;
        }
    } else {
        let roads = this.creep.memory.remoteRepairerRoads;

        if (roads && roads.length > 0) {
            let roadId = roads[0];
            let road = Game.getObjectById(roadId);

            if (!road || road.hits === road.hitsMax) {
                roads = roads.filter((id) => {
                    const road = Game.getObjectById(id);

                    return road && road.hits < road.hitsMax;
                });

                this.creep.memory.remoteRepairerRoads = roads;

                if (roads.length > 0) {
                    roadId = roads[0];
                    road = Game.getObjectById(roadId);
                }
            }

            if (road && road.hits < road.hitsMax) {
                this.moveToRoad(road);

                const otherRoad = this.findRoadInRange(roads);

                if (otherRoad) {
                    this.creep.repair(otherRoad);
                    this.creep.say(otherRoad.hits);
                } else if (this.room.constructionSites.length > 0) {
                    const construction = this.creep.pos.findInRange(this.room.constructionSites, 3)[0];

                    if (construction) {
                        this.creep.build(construction);
                    }
                }
            } else {
                _.pull(this.creep.memory.remoteRepairerRoads, roadId);
            }

            return;
        } else {
            _.pull(this.creep.memory.remoteRepairerRooms, this.room.name);

            delete this.creep.memory.remoteRepairerContainers;
            delete this.creep.memory.remoteRepairerRoads;
        }
    }

    if (container) {
        if (this.creep.pos.isNearTo(container)) {
            if (container.hits < container.hitsMax) {
                this.creep.repair(container);
            } else {
                _.pull(this.creep.memory.remoteRepairerContainers, container.id);
            }
        } else {
            let roads = this.creep.memory.remoteRepairerRoads;

            if (!roads) {
                roads = _.chain(this.room.roads)
                    .filter(r => r.hits < r.hitsMax)
                    // .sortBy(r => r.pos.getRangeTo(this.creep.pos))
                    .map(r => r.id)
                    .value();

                this.creep.memory.remoteRepairerRoads = roads;
            }

            const road = this.creep.pos.getStructure(STRUCTURE_ROAD);
            let canMove = true;

            if (road) {
                if (road.hits < road.hitsMax && roads.includes(road.id)) {
                    canMove = false;
                } else {
                    _.pull(roads, road.id);

                    const otherRoad = this.findRoadInRange(roads);

                    if (otherRoad) {
                        this.creep.repair(otherRoad);
                        this.creep.say(otherRoad.hits);
                    } else if (this.room.constructionSites.length > 0) {
                        const construction = this.creep.pos.findInRange(this.room.constructionSites, 3)[0];

                        if (construction) {
                            this.creep.build(construction);
                        }
                    }
                }
            } else {
                const road = this.findRoadInRange(roads);

                if (road) {
                    this.creep.repair(road);
                    this.creep.say(road.hits);
                } else if (this.room.constructionSites.length > 0) {
                    const construction = this.creep.pos.findInRange(this.room.constructionSites, 3)[0];

                    if (construction) {
                        this.creep.build(construction);
                    }
                }
            }

            if (canMove) {
                this.moveToContainer(container);
            } else {
                this.creep.repair(road);
                this.creep.say(road.hits);
            }
        }
    }
};

RemoteRepairer.getCreepInitialRoom = function() {
    return Game.rooms[this.creep.initialRoom];
};

RemoteRepairer.update = function() {
    let remoteRepairerRooms = this.creep.memory.remoteRepairerRooms;

    if (!remoteRepairerRooms) {
        const room = this.getCreepInitialRoom();
        const state = room.memory.remoteRepairerState;

        if (state) {
            remoteRepairerRooms = state.remoteRepairerRooms;

            this.creep.memory.remoteRepairerContainers = state.remoteRepairerContainers;
            this.creep.memory.remoteRepairerRoads = state.remoteRepairerRoads;
        } else {
            remoteRepairerRooms = _.clone(this.RESERVATION[this.creep.initialRoom]);
        }

        if (!remoteRepairerRooms) {
            Game.notify(`Для комнаты ${this.creep.initialRoom} не найдены комнаты remoteRepairer`);

            remoteRepairerRooms = [];
        }

        this.creep.memory.remoteRepairerRooms = remoteRepairerRooms;
    }

    const repairerRoom = remoteRepairerRooms[0];

    if (repairerRoom) {
        if (this.room.name === this.creep.initialRoom) {
            if (this.creep.store[RESOURCE_ENERGY] >= this.creep.carryCapacity / 5) {
                this.newRole = 'traveler';
                this.creep.targetFlag = repairerRoom;
            } else {
                this.newRole = 'getter';

                return;
            }
        } else if (this.room.name === repairerRoom) {
            if (this.creep.store[RESOURCE_ENERGY] > 0) {
                this.updateRepairer();

                if (this.creep.ticksToLive < 10 || this.creep.hits < this.creep.hitsMax) {
                    const room = this.getCreepInitialRoom();

                    room.memory.remoteRepairerState = {
                        remoteRepairerRooms: remoteRepairerRooms,
                        remoteRepairerContainers: this.creep.memory.remoteRepairerContainers,
                        remoteRepairerRoads: this.creep.memory.remoteRepairerRoads
                    };
                }
            } else {
                if (this.room.containers.length < 2 || this.creep.memory.getterResult === ERR_NOT_ENOUGH_RESOURCES) {
                    this.newRole = 'traveler';
                    this.creep.targetFlag = this.creep.initialRoom;

                    delete this.creep.memory.getterResult;
                } else {
                    this.newRole = 'getter';
                }
            }
        } else {
            if (this.creep.store[RESOURCE_ENERGY] >= this.creep.carryCapacity / 5) {
                this.creep.targetFlag = repairerRoom;
            } else {
                this.creep.targetFlag = this.creep.initialRoom;
            }

            this.newRole = 'traveler';
        }
    } else if (remoteRepairerRooms.length === 0) { // прошел все коматы
        this.newRole = 'recycler';

        const room = this.getCreepInitialRoom();

        room.memory.remoteRepairerNextRegeneration = Game.time + (this.WAIT_TIME[room.name] || this.STANDARD_WAIT_TIME);

        delete room.memory.remoteRepairerState;
    }
};

module.exports = RemoteRepairer;
