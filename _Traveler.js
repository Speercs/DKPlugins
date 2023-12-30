
class Traveler {

    /**
     * move creep to destination
     *
     * @param {Creep | PowerCreep} creep
     * @param {RoomPosition} destination
     * @param {Object} [options={}]
     *
     * @returns {Number}
     */
    static travelTo(creep, destination, options = {}) {
        this.creep = creep;

        if (!destination) {
            return ERR_INVALID_ARGS;
        }

        if (creep.fatigue > 0) {
            Traveler.circle(creep.pos, 'aqua', 0.3);

            return ERR_TIRED;
        }

        destination = this.normalizePos(destination);

        // manage case where creep is nearby destination
        const rangeToDestination = creep.pos.getRangeTo(destination);

        if (options.range && rangeToDestination <= options.range) {
            return OK;
        } else if (rangeToDestination <= 1) {
            if (rangeToDestination === 1 && !options.range) {
                const direction = creep.pos.getDirectionTo(destination);

                if (creep.move(direction) === OK && Traveler.positionAtDirection(creep.pos, direction).isWalkable(true)) {
                    return OK;
                }
            }
        }

        if (!creep.memory.trav) {
            creep.memory.trav = {};

            // if (creep.id === '5dd26c1408b67a31b9b46234') {
            //     if (!this.paths) {
            //         this.paths = {};
            //     }
            //
            //     if  (!this.paths[creep.id]) {
            //         this.paths[creep.id] = {};
            //     }
            //
            //     delete creep.memory.trav;
            // }
        }

        // const travelData = _.get(this.paths, [creep.id], creep.memory.trav || {});
        const travelData = creep.memory.trav;
        const state = this.deserializeState(travelData, destination);
        let pathDeleted = false;
        let nextPos;

        // check if creep is stuck
        if (this.isStuck(creep, state)) {
            state.stuckCount++;

            Traveler.circle(creep.pos, 'magenta', state.stuckCount * 0.2);

            nextPos = this.getNextPosition(creep, travelData.path);

            if (nextPos) {
                const otherCreep = nextPos.creep || nextPos.powerCreep;

                if (otherCreep && otherCreep.canSwap()) {
                    const nextDirection = parseInt(travelData.path[0], 10);

                    if (creep.swap(otherCreep, nextDirection, nextPos)) {
                        state.stuckCount = 0;

                        return OK;
                    } else {
                        state.stuckCount = DEFAULT_STUCK_VALUE;
                    }
                } else {
                    state.stuckCount = DEFAULT_STUCK_VALUE;
                }
            }
        } else {
            state.stuckCount = 0;
        }

        if (creep._swapped) {
            return ERR_BUSY;
        }

        // handle case where creep is stuck

        if (state.stuckCount >= DEFAULT_STUCK_VALUE && Math.random() > 0.35 / state.stuckCount) {
            if (!creep.room.isHostile) {
                if (nextPos === undefined) {
                    nextPos = this.getNextPosition(creep, travelData.path);
                }

                if (nextPos) {
                    if (!nextPos.creep && !nextPos.powerCreep) {
                        options.freshMatrix = true;
                    } else {
                        options.ignoreCreeps = false;
                    }
                } else {
                    options.ignoreCreeps = false;
                    options.freshMatrix = true;
                }
            } else {
                options.ignoreCreeps = false;
                options.freshMatrix = true;
            }

            pathDeleted = true;

            delete travelData.path;
        }

        // TODO: handle case where creep moved by some other function, but destination is still the same

        // delete path cache if destination is different
        if (!pathDeleted && !this.samePos(state.destination, destination)) {
            if (options.movingTarget && state.destination.isNearTo(destination)) {
                travelData.path += state.destination.getDirectionTo(destination);

                state.destination = destination;
            } else {
                pathDeleted = true;

                delete travelData.path;
            }
        }

        if (!pathDeleted && options.repath && Math.random() < options.repath) {
            pathDeleted = true;

            delete travelData.path;
        }

        if (!pathDeleted && options.avoidHostileCreeps) {
            const repath = creep.room.hostileCreeps.some((hostileCreep) => {
                if (hostileCreep.getActiveBodyparts(RANGED_ATTACK) > 0) {
                    const range = (creep.isSourceKeeper() ? RANGED_ATTACK_RANGE + 1 : RANGED_ATTACK_RANGE + 2);

                    return hostileCreep.pos.inRangeTo(creep, range);
                } else if (hostileCreep.getActiveBodyparts(ATTACK) > 0) {
                    return hostileCreep.pos.inRangeTo(creep, ATTACK_RANGE + 2);
                }

                return false;
            });

            if (repath) {
                pathDeleted = true;

                delete travelData.path;
            }
        }

        // pathfinding
        let newPath = false;

        if (!travelData.path) {
            if (Game.shard.name === 'shard3' && creep instanceof Creep && creep.nameParts[3] === 'shard3') {
                const pos = creep.pos;

                if (creep.room.name === 'E40S10') {
                    if (destination.roomName === 'E39S11') {
                        const key = pos.toKey();
                        let caravanPath = Memory['CaravanPaths'][key];

                        if (!caravanPath || caravanPath.expiredAt < Game.time) {
                            Memory['CaravanPaths'][key] = {
                                expiredAt: Game.time + 10000,
                                path: this.serializePath(pos,
                                    this.findTravelPath(pos,
                                        new RoomPosition(47, 21, 'E39S11'),
                                        // Game.flags['E39S11'].pos,
                                        { ignoreCreeps: true, ignoreRoads: true }).path,
                                    true)
                            };

                            caravanPath = Memory['CaravanPaths'][key];
                        }

                        travelData.path = caravanPath.path;
                        state.stuckCount = 0;
                        newPath = true;
                    }
                } else if (creep.room.name === 'E39S11') {
                    if (pos.x === 48 && (pos.y >= 18 || pos.y <= 29)) {
                        const key = pos.toKey();
                        let caravanPath = Memory['CaravanPaths'][key];

                        if (!caravanPath || caravanPath.expiredAt < Game.time) {
                            Memory['CaravanPaths'][key] = {
                                expiredAt: Game.time + 10000,
                                path: this.serializePath(pos,
                                    this.findTravelPath(pos,
                                        Game.rooms['E39S11'].storage.pos,
                                        { ignoreCreeps: false, ignoreRoads: true }).path)
                            };

                            caravanPath = Memory['CaravanPaths'][key];
                        }

                        travelData.path = caravanPath.path;
                        state.stuckCount = 0;
                        newPath = true;
                    }
                }
            }
        }

        if (!travelData.path) {
            newPath = true;

            if (creep.spawning) {
                return ERR_BUSY;
            }

            // if (state.cpu > REPORT_CPU_THRESHOLD && options.maxRooms !== 1) {
            //     options.maxRooms = DEFAULT_MAXROOMS + 4;
            // }

            state.destination = destination;

            const cpu = Game.cpu.getUsed();
            const ret = this.findTravelPath(creep.pos, destination, options);
            const cpuUsed = Game.cpu.getUsed() - cpu;

            state.cpu = Math.round(cpuUsed + state.cpu);

            if (state.cpu > REPORT_CPU_THRESHOLD) {
                // see note at end of file for more info on this
                console.log(`TRAVELER: heavy cpu use: ${creep.name}, room: ${linkRoom(creep.room.name)}, cpu: ${state.cpu} origin: ${creep.pos}, dest: ${destination}`);
            }

            let color = '#FFC0CB';

            if (ret.incomplete) {
                // uncommenting this is a great way to diagnose creep behavior issues
                // console.log(`TRAVELER: incomplete path for ${creep.name}`);
                color = 'red';
            }

            travelData.path = Traveler.serializePath(
                creep.pos, ret.path, creep.pos.roomName !== destination.roomName, color);

            state.stuckCount = 0;
        }

        this.serializeState(creep, destination, state, travelData);

        if (!travelData.path || travelData.path.length === 0) {
            return ERR_NO_PATH;
        }

        // consume path
        if (state.stuckCount === 0 && !newPath) {
            travelData.path = travelData.path.substr(1);
        }

        const nextDirection = parseInt(travelData.path[0], 10);
        const result = creep.move(nextDirection);

        if (result === OK) { // TODO:
            creep._swapped = true;
            creep._moved = nextDirection;
        }

        return result;
    }

    /**
     * make position objects consistent so that either can be used as an argument
     *
     * @param destination
     * @returns {RoomPosition}
     */
    static normalizePos(destination) {
        if (typeof destination === 'string') {
            return RoomPosition.decode(destination);
        }

        if (!(destination instanceof RoomPosition)) {
            return destination.pos;
        }

        return destination;
    }

    /**
     * Check if room should be avoided by findRoute algorithm
     *
     * @param {string} roomName
     *
     * @returns {boolean}
     */
    static checkAvoid(roomName) {
        // const room = Game.rooms[roomName];
        const memory = Memory.rooms[roomName];

        if (memory) {
            if (memory.avoid === 0) {
                return false;
            }

            if (memory.avoid) {
                return true;
            }

            const invaderCore = memory.invaderCore;
            if (invaderCore && invaderCore.level > 0 && invaderCore.expiredAt > Game.time) {
                return true;
            }

            const cache = memory.cache;
            if (cache && cache.hostile === 1 && cache.expiredAt > Game.time && cache.towers && cache.towers.length > 0) {
                return true;
            }
        } else {
            Shard.requestObserver(roomName, 1);
        }

        return false;
    }

    /**
     * check if a position is an exit
     * @param pos
     * @returns {boolean}
     */
    static isExit(pos) {
        return pos.x === 0 || pos.y === 0 || pos.x === 49 || pos.y === 49;
    }

    /**
     * check two coordinates match
     * @param pos1
     * @param pos2
     * @returns {boolean}
     */
    static sameCoord(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    }

    /**
     * check if two positions match
     * @param pos1
     * @param pos2
     * @returns {boolean}
     */
    static samePos(pos1, pos2) {
        return this.sameCoord(pos1, pos2) && pos1.roomName === pos2.roomName;
    }

    /**
     * draw a circle at position
     * @param pos
     * @param color
     * @param opacity
     */
    static circle(pos, color, opacity) {
        new RoomVisual(pos.roomName).circle(pos, {
            radius: .45, fill: "transparent", stroke: color, strokeWidth: .15, opacity: opacity
        });
    }

    /**
     * find a path from origin to destination
     * @param origin
     * @param destination
     * @param options
     * @returns {PathfinderReturn}
     */
    static findTravelPath(origin, destination, options = {}) {
        _.defaults(options, {
            ignoreCreeps: true,
            maxOps: DEFAULT_MAXOPS,
            maxRooms: DEFAULT_MAXROOMS,
            range: 1,
            allowSK: true
        });

        if (options.offRoad === undefined && typeof this.creep.canOffRoad === 'function') {
            options.offRoad = this.creep.canOffRoad();
        }

        if (!options.offRoad && options.ignoreRoads === undefined && typeof this.creep.canIgnoreRoads === 'function') {
            options.ignoreRoads = this.creep.canIgnoreRoads();
        }

        if (options.movingTarget) {
            options.range = 0;
        }

        origin = this.normalizePos(origin);
        destination = this.normalizePos(destination);

        const originRoomName = origin.roomName;
        const destRoomName = destination.roomName;

        // check to see whether findRoute should be used
        const roomDistance = Game.map.getRoomLinearDistance(origin.roomName, destination.roomName);
        let allowedRooms = options.route;

        if (!allowedRooms && (options.useFindRoute || (options.useFindRoute === undefined && roomDistance > 2))) {
            let route = this.findRoute(origin.roomName, destination.roomName, options);

            if (route) {
                allowedRooms = route;
            }
        }

        let roomsSearched = 0;
        let callback = (roomName) => {
            if (allowedRooms) {
                if (!allowedRooms[roomName]) {
                    return false;
                }
            } else if (roomName !== destRoomName && roomName !== originRoomName && Traveler.checkAvoid(roomName)) {
                return false;
            }

            roomsSearched++;

            const room = Game.rooms[roomName];
            let matrix;

            if (room) {
                matrix = this.getCreepMatrix(room, options);

                if (room.name === originRoomName) {
                    matrix = matrix.clone();

                    if (room.isSK) {
                        const keeperLairs = room.keeperLairs.filter(k => k.ticksToSpawn <= 50);

                        keeperLairs.forEach((keeperLair) => {
                            const range = origin.getRangeTo(keeperLair);

                            if (range <= 4 && keeperLair.ticksToSpawn >= 4) {
                                return;
                            }

                            const positions = keeperLair.pos.around(4, { filter: null, encode: false });

                            for (const pos of positions) {
                                matrix.set(pos.x, pos.y, Math.max(matrix.get(pos.x, pos.y), 50));
                            }
                        });
                    }

                    if (options.avoidHostileCreeps) {
                        //const roomTerrain = Game.map.getRoomTerrain(roomName);
                        const creeps = room.hostileCreeps.filter(
                            c => c.getActiveBodyparts(ATTACK) + c.getActiveBodyparts(RANGED_ATTACK) > 0);

                        creeps.forEach((creep) => {
                            let positions = [];
                            let attackRange = 0;

                            if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
                                const range = (creep.isSourceKeeper() ? RANGED_ATTACK_RANGE : RANGED_ATTACK_RANGE + 2);

                                positions = creep.pos.around(range, { encode: false });
                                attackRange = RANGED_ATTACK_RANGE;
                            } else if (creep.getActiveBodyparts(ATTACK) > 0) {
                                positions = creep.pos.around(ATTACK_RANGE + 2, { encode: false });
                                attackRange = ATTACK_RANGE;
                            } else {
                                return;
                            }

                            if (positions.some(pos => pos.isEqualTo(destination))) {
                                return;
                            }

                            positions.forEach((pos) => {
                                const x = pos.x;
                                const y = pos.y;
                                const range = pos.getRangeTo(creep.pos);
                                const multiplier = (range <= attackRange ? 1 : Math.max(2, range - attackRange));
                                const value = Math.max(
                                    matrix.get(x, y),
                                    //100 / (Math.pow(range, 0.5) * multiplier / (roomTerrain.get(x, y) === TERRAIN_MASK_SWAMP ? 2 : 1)));
                                    100 / (Math.pow(range, 0.5) * multiplier));

                                matrix.set(x, y, value);
                            });
                        });
                    }

                    matrix.set(origin.x, origin.y, 0);
                }

                if (room.isReservedByMe || room.isSK) {
                    const visual = room.visual;

                    for (let x = 0; x < 50; x++) {
                        for (let y = 0; y < 50; y++) {
                            const value = matrix.get(x, y);

                            if (value > 0) {
                                visual.text(value.toString(), x, y);
                            }
                        }
                    }
                }
            } else if (Memory.rooms[roomName]) {
                matrix = this.getStructureMatrixFromCache(roomName, options);
            }

            if (options.roomCallback) {
                if (!matrix) {
                    matrix = new PathFinder.CostMatrix();
                }

                let outcome = options.roomCallback(roomName, matrix, options);

                if (outcome !== undefined) {
                    return outcome;
                }
            }

            return matrix;
        };

        let ret = PathFinder.search(origin, { pos: destination, range: options.range }, {
            maxOps: options.maxOps,
            maxRooms: options.maxRooms,
            plainCost: (options.offRoad ? 1 : (options.ignoreRoads ? 1 : 2)),
            swampCost: (options.offRoad ? 1 : (options.ignoreRoads ? 5 : 10)),
            roomCallback: callback,
        });

        if (ret.incomplete && options.ensurePath) {
            if (options.useFindRoute === undefined) {
                // handle case where pathfinder failed at a short distance due to not using findRoute
                // can happen for situations where the creep would have to take an uncommonly indirect path
                // options.allowedRooms and options.routeCallback can also be used to handle this situation
                if (roomDistance <= 2) {
                    console.log(`TRAVELER: path failed without findroute, trying with options.useFindRoute = true`);
                    console.log(`from: ${origin}, destination: ${destination}`);

                    options.useFindRoute = true;

                    ret = this.findTravelPath(origin, destination, options);

                    console.log(`TRAVELER: second attempt was ${ret.incomplete ? "not " : ""}successful`);

                    return ret;
                }

                // TODO: handle case where a wall or some other obstacle is blocking the exit assumed by findRoute
            }
        }

        return ret;
    }

    /**
     * find a viable sequence of rooms that can be used to narrow down pathfinder's search algorithm
     * @param origin
     * @param destination
     * @param options
     * @returns {{}}
     */
    static findRoute(origin, destination, options = {}) {
        const restrictDistance = options.restrictDistance || Game.map.getRoomLinearDistance(origin, destination) + 10;
        let allowedRooms = { [origin]: true, [destination]: true };
        let highwayBias = 1;

        // if (options.preferHighway) {
        //     highwayBias = 2.5;
        //
        //     if (options.highwayBias) {
        //         highwayBias = options.highwayBias;
        //     }
        // }

        let ret = Game.map.findRoute(origin, destination, {
            routeCallback: (roomName) => {
                // if (options.routeCallback) {
                //     let outcome = options.routeCallback(roomName);
                //
                //     if (outcome !== undefined) {
                //         return outcome;
                //     }
                // }

                const rangeToRoom = Game.map.getRoomLinearDistance(origin, roomName);

                if (rangeToRoom > restrictDistance) {
                    // room is too far out of the way
                    return Number.POSITIVE_INFINITY;
                }

                if (roomName !== destination && roomName !== origin && Traveler.checkAvoid(roomName)) {
                    return Number.POSITIVE_INFINITY;
                }

                let parsed;

                // if (options.preferHighway) {
                //     parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                //
                //     const isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
                //
                //     if (isHighway) {
                //         return 1;
                //     }
                // }

                // SK rooms are avoided when there is no vision in the room, harvested-from SK rooms are allowed
                if (!options.allowSK && !Game.rooms[roomName]) {
                    if (!parsed) {
                        parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                    }

                    const fMod = parsed[1] % 10;
                    const sMod = parsed[2] % 10;
                    const isSK = !(fMod === 5 && sMod === 5) &&
                        ((fMod >= 4) && (fMod <= 6)) &&
                        ((sMod >= 4) && (sMod <= 6));

                    if (isSK) {
                        return 10 * highwayBias;
                    }
                }

                return highwayBias;
            },
        });

        if (!_.isArray(ret)) {
            if (origin.room) {
                console.log(`couldn't findRoute to ${destination} from ${origin} ${linkRoom(origin.room)}`);
            } else {
                console.log(`couldn't findRoute to ${destination} from ${origin}`);
            }

            return;
        }

        for (const value of ret) {
            allowedRooms[value.room] = true;
        }

        return allowedRooms;
    }

    /**
     * check how many rooms were included in a route returned by findRoute
     * @param origin
     * @param destination
     * @returns {number}
     */
    static routeDistance(origin, destination) {
        let linearDistance = Game.map.getRoomLinearDistance(origin, destination);

        if (linearDistance >= 32) {
            return linearDistance;
        }

        let allowedRooms = this.findRoute(origin, destination);

        if (allowedRooms) {
            return Object.keys(allowedRooms).length;
        }
    }

    /**
     * build a cost matrix based on structures in the room. Will be cached for more than one tick. Requires vision.
     *
     * @param {Room} room
     * @param {Object} [options={}]
     *
     * @returns {CostMatrix}
     */
    static getStructureMatrix(room, options = {}) {
        if (!this.structureMatrixCache[room.name] || (options.freshMatrix || Game.time > this.structureMatrixCache[room.name].expiredAt)) {
            let expiredAt = Game.time;

            if (room.my) {
                if (room.playerEnemies.length > 1) {
                    expiredAt += 5;
                } else {
                    expiredAt += room.level * 100;
                }
            } else if (room.isReserved) {
                expiredAt += room.controller.reservation.ticksToEnd;
            } else if (room.isHostile) {
                expiredAt += 5;
            } else {
                expiredAt += 10;
            }

            this.structureMatrixCache[room.name] = {
                matrix: this.addStructuresToMatrix(room, new PathFinder.CostMatrix(), options),
                expiredAt
            };
        }

        if ((options.ignoreRoads || options.offRoad) && !room.isHostile) {
            const matrix = this.structureMatrixCache[room.name].matrix.clone();
            const roadCost = 2;

            room.roads.forEach((road) => {
                const x = road.pos.x;
                const y = road.pos.y;

                matrix.set(x, y, Math.max(matrix.get(x, y), roadCost));
            });

            return matrix;
        }

        return this.structureMatrixCache[room.name].matrix;
    }

    /**
     * @param {string} roomName
     * @param {Object} options
     * @returns {CostMatrix}
     */
    static getStructureMatrixFromCache(roomName, options = {}) {
        if (!this.structureMatrixCache[roomName] || (options.freshMatrix || Game.time > this.structureMatrixCache[roomName].expiredAt)) {
            this.structureMatrixCache[roomName] = {
                matrix: this.addStructuresToMatrixFromCache(roomName, new PathFinder.CostMatrix(), options),
                expiredAt: Game.time + 1
            };
        }

        return this.structureMatrixCache[roomName].matrix;
    }

    /**
     * build a cost matrix based on creeps and structures in the room. Will be cached for one tick. Requires vision.
     *
     * @param {Room} room
     * @param {Object} [options={}]
     *
     * @returns {CostMatrix}
     */
    static getCreepMatrix(room, options = {}) {
        if (!this.creepMatrixCache[room.name]) {
            const matrix = this.addCreepsToMatrix(room, this.getStructureMatrix(room, options).clone(), options);
            let needCache = true;

            if (options.ignoreCreeps) {
                room.hostileCreeps.forEach((creep) => {
                    matrix.set(creep.pos.x, creep.pos.y, 0xff);
                });

                room.hostilePowerCreeps.forEach((creep) => {
                    matrix.set(creep.pos.x, creep.pos.y, 0xff);
                });

                if (room.my) {
                    const central = room.creeps.find(c => c.role === 'central');

                    if (central) {
                        matrix.set(central.pos.x, central.pos.y, 0xff);
                    }
                }

                needCache = false;
            }

            if (options.maxRooms === 1) {
                for (let i = 0; i < 50; i++) {
                    matrix.set(i, 0, 0xff);
                    matrix.set(0, i, 0xff);
                    matrix.set(i, 49, 0xff);
                    matrix.set(49, i, 0xff);
                }

                needCache = false;
            }

            if (!needCache) {
                return matrix;
            }

            this.creepMatrixCache[room.name] = matrix;
        }

        return this.creepMatrixCache[room.name];
    }

    /**
     * add structures to matrix so that impassible structures can be avoided and roads given a lower cost
     *
     * @param {Room} room
     * @param {CostMatrix} matrix
     * @param {Object} [options={}]
     *
     * @returns {CostMatrix}
     */
    static addStructuresToMatrix(room, matrix, options = {}) {
        const impassibleStructures = [];

        for (const structure of room.structures) {
            if (structure.structureType === STRUCTURE_RAMPART) {
                if (!structure.my && !structure.isPublic) {
                    impassibleStructures.push(structure);
                }
            } else if (structure.structureType === STRUCTURE_ROAD) {
                matrix.set(structure.pos.x, structure.pos.y, 1);
            } else if (structure.structureType === STRUCTURE_CONTAINER) {
                matrix.set(structure.pos.x, structure.pos.y, 5);
            } else {
                impassibleStructures.push(structure);
            }
        }

        // if (room.isSK) {
        //     _.forEach(room.sources, (source) => {
        //         const positions = source.pos.around(4, { encode: false });
        //
        //         for (const position of positions) {
        //             matrix.set(position.x, position.y, 50);
        //         }
        //     });
        // }

        for (const site of room.constructionSites) {
            if (!site.my) {
                continue;
            }

            if (site.structureType === STRUCTURE_CONTAINER || site.structureType === STRUCTURE_ROAD || site.structureType === STRUCTURE_RAMPART) {
                continue;
            }

            matrix.set(site.pos.x, site.pos.y, 0xff);
        }

        for (const structure of impassibleStructures) {
            matrix.set(structure.pos.x, structure.pos.y, 0xff);
        }

        return matrix;
    }

    /**
     * @param {string} roomName
     * @param {CostMatrix} matrix
     * @param {Object} options
     * @returns {CostMatrix}
     */
    static addStructuresToMatrixFromCache(roomName, matrix, options = {}) {
        const roadCost = ((options.ignoreRoads || options.offRoad) ? 2 : 1);
        const memory = Memory.rooms[roomName];
        const cache = memory.cache;

        if (cache) {
            _.forEach(cache.walls, (data) => {
                const pos = RoomPosition.decode(data);

                matrix.set(pos.x, pos.y, 0xff);
            });

            _.forEach(cache.ramparts, (data) => {
                const pos = RoomPosition.decode(data);

                matrix.set(pos.x, pos.y, 0xff);
            });

            _.forEach(cache.roads, (data) => {
                const pos = RoomPosition.decode(data);

                matrix.set(pos.x, pos.y, roadCost);
            });

            if (memory.sk === 1) {
                if (memory.keeperLairs) {
                    for (const data of memory.keeperLairs) {
                        const pos = RoomPosition.decode(data);
                        const positions = pos.around(4, { filter: null, encode: false });

                        for (const position of positions) {
                            matrix.set(position.x, position.y, Math.max(matrix.get(position.x, position.y), 50));
                        }
                    }
                }

                if (memory.sources) {
                    for (const data of memory.sources) {
                        const pos = RoomPosition.decode(data);
                        const positions = pos.around(4, { filter: null, encode: false });

                        for (const position of positions) {
                            matrix.set(position.x, position.y, Math.max(matrix.get(position.x, position.y), 50));
                        }
                    }
                }

                if (memory.mineral) {
                    const pos = RoomPosition.decode(memory.mineral.pos);
                    const positions = pos.around(4, { filter: null, encode: false });

                    for (const position of positions) {
                        matrix.set(position.x, position.y, Math.max(matrix.get(position.x, position.y), 50));
                    }
                }
            }

            if (cache.portals) {
                for (const data of cache.portals) {
                    const pos = RoomPosition.decode(data);

                    matrix.set(pos.x, pos.y, 0xff);
                }
            }
        }

        return matrix;
    }

    /**
     * add creeps to matrix so that they will be avoided by other creeps
     *
     * @param {Room} room
     * @param {CostMatrix} matrix
     * @param {Object} [options={}]
     *
     * @returns {CostMatrix}
     */
    static addCreepsToMatrix(room, matrix, options = {}) {
        room.allCreeps.forEach((creep) => {
            if (creep.canSwap()) {
                const pos = creep.pos;

                matrix.set(pos.x, pos.y, Math.max(matrix.get(pos.x, pos.y), 2));
            } else {
                matrix.set(creep.pos.x, creep.pos.y, 0xff);
            }
        });

        room.allPowerCreeps.forEach((creep) => {
            if (creep.canSwap()) {
                const pos = creep.pos;

                matrix.set(pos.x, pos.y, Math.max(matrix.get(pos.x, pos.y), 5));
            } else {
                matrix.set(creep.pos.x, creep.pos.y, 0xff);
            }
        });

        return matrix;
    }

    /**
     * serialize a path, traveler style. Returns a string of directions.
     * @param {RoomPosition} startPos
     * @param {RoomPosition[]} path
     * @param {Boolean} [visualMap=false]
     * @param {string} [color='#FFC0CB']
     * @return {string}
     */
    static serializePath(startPos, path, visualMap= false, color = '#FFC0CB') {
        let serializedPath = '';
        let lastPosition = startPos;

        this.circle(startPos, color);

        for (const position of path) {
            if (position.roomName === lastPosition.roomName) {
                new RoomVisual(position.roomName).line(position, lastPosition, { color, lineStyle: 'dashed' });

                serializedPath += lastPosition.getDirectionTo(position);
            }

            lastPosition = position;
        }

        if (visualMap) {
            Game.map.visual.poly(path, { stroke: color, lineStyle: 'dashed' });
        }

        return serializedPath;
    }

    /**
     * returns a position at a direction relative to origin
     * @param origin
     * @param direction
     * @returns {RoomPosition}
     */
    static positionAtDirection(origin, direction) {
        const offsetX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
        const offsetY = [0, -1, -1, 0, 1, 1, 1, 0, -1];
        const x = origin.x + offsetX[direction];
        const y = origin.y + offsetY[direction];

        if (x > 49 || x < 0 || y > 49 || y < 0) {
            return null;
        }

        return new RoomPosition(x, y, origin.roomName);
    }

    /**
     * @param {Creep | PowerCreep} creep
     * @param {string} path
     *
     * @returns {RoomPosition | null}
     */
    static getNextPosition(creep, path) {
        if (path && path.length > 0) {
            return Traveler.positionAtDirection(creep.pos, parseInt(path[0], 10));
        }

        return null;
    }

    static deserializeState(travelData, destination) {
        let state = {};

        if (travelData.state) {
            state.lastCoord = { x: travelData.state[STATE_PREV_X], y: travelData.state[STATE_PREV_Y] };
            state.cpu = travelData.state[STATE_CPU];
            state.stuckCount = travelData.state[STATE_STUCK];
            state.destination = new RoomPosition(travelData.state[STATE_DEST_X], travelData.state[STATE_DEST_Y], travelData.state[STATE_DEST_ROOMNAME]);
        } else {
            state.cpu = 0;
            state.destination = destination;
        }

        return state;
    }

    static serializeState(creep, destination, state, travelData) {
        travelData.state = [creep.pos.x, creep.pos.y, state.stuckCount, state.cpu, destination.x, destination.y,
            destination.roomName];
    }

    static isStuck(creep, state) {
        let stuck = false;

        if (state.lastCoord !== undefined) {
            if (this.sameCoord(creep.pos, state.lastCoord)) {
                // didn't move
                stuck = true;
            }
            else if (this.isExit(creep.pos) && this.isExit(state.lastCoord)) {
                // moved against exit
                stuck = true;
            }
        }

        return stuck;
    }

    static clearCache(roomName) {
        this.clearStructuresCache(roomName);
        this.clearCreepsCache(roomName);
    }

    static clearStructuresCache(roomName) {
        if (roomName) {
            delete this.structureMatrixCache[roomName];
        } else {
            this.structureMatrixCache = {};
        }
    }

    static clearCreepsCache(roomName) {
        if (roomName) {
            delete this.creepMatrixCache[roomName];
        } else {
            this.creepMatrixCache = {};
        }
    }

};

Traveler.structureMatrixCache = {};
Traveler.creepMatrixCache = {};
Traveler.paths = {};

module.exports = Traveler;

// this might be higher than you wish, setting it lower is a great way to diagnose creep behavior issues. When creeps
// need to repath to often or they aren't finding valid paths, it can sometimes point to problems elsewhere in your code

const REPORT_CPU_THRESHOLD = 2000;
const DEFAULT_MAXOPS = 20000;
const DEFAULT_MAXROOMS = 18;
const DEFAULT_STUCK_VALUE = 2;
const STATE_PREV_X = 0;
const STATE_PREV_Y = 1;
const STATE_STUCK = 2;
const STATE_CPU = 3;
const STATE_DEST_X = 4;
const STATE_DEST_Y = 5;
const STATE_DEST_ROOMNAME = 6;

//

Creep.prototype.travelTo = function(destination, options) {
    return Traveler.travelTo(this, destination, options);
};

PowerCreep.prototype.travelTo = function(destination, options) {
    return Traveler.travelTo(this, destination, { ...options, offRoad: true });
};
