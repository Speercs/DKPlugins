
let CarrierUpgrader;
let Repairer;
let RemoteRepairer;
let Upgrader;
let Warrior;
let Reserver;
let WarriorKeeper;
let Defender;



// properties

Object.defineProperties(Room.prototype, {

    /**
     * @readonly
     * @type {Boolean}
     * @memberof Room.prototype
     */
    my: {
        get: function() {
            if (this._my === undefined) {
                this._my = !!(this.controller && this.controller.my);
            }

            return this._my;
        }
    },

    /**
     * @readonly
     * @type {Number}
     * @memberof Room.prototype
     */
    level: {
        get: function() {
            if (this._level === undefined) {
                this._level = this.my ? this.controller.level : -1;
            }

            return this._level;
        }
    },

    /**
     * @readonly
     * @type {RoomCache}
     * @memberof Room.prototype
     */
    cache: {
        get: function() {
            if (this._cache === undefined) {
                this._cache = GlobalCache.getRoomCache(this);
            }

            return this._cache;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Object}
     * @memberof Room.prototype
     */
    store: {
        get: function() {
            if (this._store === undefined) {
                const storage = this.storage;
                const terminal = this.terminal;
                const factory = this.factory;

                this._store = RESOURCES_ALL.reduce((acc, resourceType) => {
                    if (!Number.isFinite(acc[resourceType])) {
                        acc[resourceType] = 0;
                    }

                    if (storage) {
                        acc[resourceType] += storage.store[resourceType];
                    }

                    if (terminal) {
                        acc[resourceType] += terminal.store[resourceType];
                    }

                    if (factory) {
                        acc[resourceType] += factory.store[resourceType];
                    }

                    return acc;
                }, {});
            }

            return this._store;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Object}
     * @memberof Room.prototype
     */
    forecastedStore: {
        get: function() {
            if (this._forecastedStore === undefined) {
                this._forecastedStore = _.clone(this.store);
            }

            return this._forecastedStore;
        }
    },

    /**
     * @readonly
     * @type {Number}
     * @memberof Room.prototype
     */
    energyPercents: {
        get: function() {
            if (this._energyPercents === undefined) {
                this._energyPercents = 100;

                if (this.my) {
                    this._energyPercents = Math.floor(this.energyAvailable * 100 / this.energyCapacityAvailable);
                }
            }

            return this._energyPercents;
        }
    },

    /**
     * @readonly
     * @type {Number}
     * @memberof Room.prototype
     */
    terminalCapacity: {
        get: function() {
            if (this._terminalCapacity === undefined) {
                this._terminalCapacity = (this.terminal ? this.terminal.store.getCapacity() : 0);
            }

            return this._terminalCapacity;
        }
    },

    /**
     * @readonly
     * @type {Number}
     * @memberof Room.prototype
     */
    terminalUsedCapacity: {
        get: function() {
            if (this._terminalUsedCapacity === undefined) {
                this._terminalUsedCapacity = (this.terminal ? this.terminal.store.getUsedCapacity() : 0);
            }

            return this._terminalUsedCapacity;
        }
    },

    /**
     * @readonly
     * @type {Number}
     * @memberof Room.prototype
     */
    terminalFreeCapacity: {
        get: function() {
            if (this._terminalFreeCapacity === undefined) {
                this._terminalFreeCapacity = (this.terminal ? this.terminal.store.getFreeCapacity() : 0);
            }

            return this._terminalFreeCapacity;
        }
    },

    /**
     * @readonly
     * @type {Number}
     * @memberof Room.prototype
     */
    storageCapacity: {
        get: function() {
            if (this._storageCapacity === undefined) {
                this._storageCapacity = (this.storage ? this.storage.store.getCapacity() : 0);
            }

            return this._storageCapacity;
        }
    },

    /**
     * @readonly
     * @type {Number}
     * @memberof Room.prototype
     */
    storageUsedCapacity: {
        get: function() {
            if (this._storageUsedCapacity === undefined) {
                this._storageUsedCapacity = (this.storage ? this.storage.store.getUsedCapacity() : 0);
            }

            return this._storageUsedCapacity;
        }
    },

    /**
     * @readonly
     * @type {Number}
     * @memberof Room.prototype
     */
    storageFreeCapacity: {
        get: function() {
            if (this._storageFreeCapacity === undefined) {
                this._storageFreeCapacity = (this.storage ? this.storage.store.getFreeCapacity() : 0);
            }

            return this._storageFreeCapacity;
        }
    },

    /**
     * @readonly
     * @type {ConstructionSite[]}
     * @memberof Room.prototype
     */
    constructionSites: {
        get: function() {
            if (this._constructionSites === undefined) {
                this._constructionSites = this.find(FIND_CONSTRUCTION_SITES);
            }

            return this._constructionSites;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Flag[]}
     * @memberof Room.prototype
     */
    flags: {
        get: function() {
            if (this._flags === undefined) {
                this._flags = this.find(FIND_FLAGS);
            }

            return this._flags;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Nuke[]}
     * @memberof Room.prototype
     */
    nukes: {
        get: function() {
            if (this._nukes === undefined) {
                this._nukes = this.find(FIND_NUKES);
            }

            return this._nukes;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Source[]}
     * @memberof Room.prototype
     */
    sources: {
        get: function() {
            if (this._sources === undefined) {
                this._sources = this.find(FIND_SOURCES);
            }

            return this._sources;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Deposit}
     * @memberof Room.prototype
     */
    deposit: {
        get: function() {
            if (this._deposit === undefined) {
                this._deposit = this.find(FIND_DEPOSITS)[0] || null;
            }

            return this._deposit;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Mineral}
     * @memberof Room.prototype
     */
    mineral: {
        get: function() {
            if (this._mineral === undefined) {
                this._mineral = this.find(FIND_MINERALS)[0] || null;
            }

            return this._mineral;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Creep[]}
     * @memberof Room.prototype
     */
    allCreeps: {
        get: function() {
            if (this._allCreeps === undefined) {
                this._allCreeps = this.find(FIND_CREEPS);
            }

            return this._allCreeps;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {PowerCreep[]}
     * @memberof Room.prototype
     */
    allPowerCreeps: {
        get: function() {
            if (this._allPowerCreeps === undefined) {
                this._allPowerCreeps = this.find(FIND_POWER_CREEPS);
            }

            return this._allPowerCreeps;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Creep[]}
     * @memberof Room.prototype
     */
    creeps: {
        get: function() {
            if (this._creeps === undefined) {
                this._creeps = this.find(FIND_MY_CREEPS);
            }

            return this._creeps;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {PowerCreep[]}
     * @memberof Room.prototype
     */
    powerCreeps: {
        get: function() {
            if (this._powerCreeps === undefined) {
                this._powerCreeps = this.find(FIND_MY_POWER_CREEPS);
            }

            return this._powerCreeps;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Creep[]}
     * @memberof Room.prototype
     */
    hostileCreeps: {
        get: function() {
            if (this._hostileCreeps === undefined) {
                this._hostileCreeps = this.find(FIND_HOSTILE_CREEPS);
            }

            return this._hostileCreeps;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {PowerCreep[]}
     * @memberof Room.prototype
     */
    hostilePowerCreeps: {
        get: function() {
            if (this._hostilePowerCreeps === undefined) {
                this._hostilePowerCreeps = this.find(FIND_HOSTILE_POWER_CREEPS);
            }

            return this._hostilePowerCreeps;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Creep[]}
     * @memberof Room.prototype
     */
    invaders: {
        get: function() {
            if (this._invaders === undefined) {
                this._invaders = this.hostileCreeps.filter(c => c.owner.username === INVADER_USERNAME);
            }

            return this._invaders;
        },
        configurable: true
    },

    // TODO:
    /**
     * @readonly
     * @type {Creep[]}
     * @memberof Room.prototype
     */
    enemies: {
        get: function() {
            if (this._enemies === undefined) {
                this._enemies = this.hostileCreeps.filter(this.filterEnemies.bind(this));
            }

            return this._enemies;
        },
        configurable: true
    },

    // TODO:
    /**
     * @readonly
     * @type {Creep[]}
     * @memberof Room.prototype
     */
    playerEnemies: {
        get: function() {
            if (this._playerEnemies === undefined) {
                this._playerEnemies = this.enemies.filter(this.filterPlayerEnemies.bind(this));
            }

            return this._playerEnemies;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Creep[]}
     * @memberof Room.prototype
     */
    sourceKeepers: {
        get: function() {
            if (this._sourceKeepers === undefined) {
                this._sourceKeepers = this.hostileCreeps.filter(c => c.owner.username === SOURCE_KEEPER_USERNAME);
            }

            return this._sourceKeepers;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Creep[]}
     * @memberof Room.prototype
     */
    woundedCreeps: {
        get: function() {
            if (this._woundedCreeps === undefined) {
                this._woundedCreeps = this.creeps.filter(creep => creep.hits < creep.hitsMax);
            }

            return this._woundedCreeps;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {PowerCreep[]}
     * @memberof Room.prototype
     */
    woundedPowerCreeps: {
        get: function() {
            if (this._woundedPowerCreeps === undefined) {
                this._woundedPowerCreeps = this.powerCreeps.filter(creep => creep.hits < creep.hitsMax);
            }

            return this._woundedPowerCreeps;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Structure[]}
     * @memberof Room.prototype
     */
    structures: {
        get: function() {
            if (this._structures === undefined) {
                this._structures = this.find(FIND_STRUCTURES);
            }

            return this._structures;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureSpawn[]}
     * @memberof Room.prototype
     */
    spawns: {
        get: function() {
            if (this._spawns === undefined) {
                this._spawns = this.cache.getStructures(STRUCTURE_SPAWN);
            }

            return this._spawns;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureExtension[]}
     * @memberof Room.prototype
     */
    extensions: {
        get: function() {
            if (this._extensions === undefined) {
                this._extensions = this.cache.getStructures(STRUCTURE_EXTENSION);
            }

            return this._extensions;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructurePowerSpawn | null}
     * @memberof Room.prototype
     */
    powerSpawn: {
        get: function() {
            if (this.my && this.level < 8) {
                return null;
            }

            if (this._powerSpawn === undefined) {
                this._powerSpawn = this.cache.getStructure(STRUCTURE_POWER_SPAWN) || null;
            }

            return this._powerSpawn;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureFactory | null}
     * @memberof Room.prototype
     */
    factory: {
        get: function() {
            if (this.my && this.level < 7) {
                return null;
            }

            if (this._factory === undefined) {
                this._factory = this.cache.getStructure(STRUCTURE_FACTORY) || null;
            }

            return this._factory;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureTower[]}
     * @memberof Room.prototype
     */
    towers: {
        get: function() {
            if (this.my && this.level < 3) {
                return [];
            }

            if (this._towers === undefined) {
                this._towers = this.cache.getStructures(STRUCTURE_TOWER);
            }

            return this._towers;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureLink[]}
     * @memberof Room.prototype
     */
    links: {
        get: function() {
            if (this.my && this.level < 5) {
                return [];
            }

            if (this._links === undefined) {
                this._links = this.cache.getStructures(STRUCTURE_LINK);
            }

            return this._links;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureLab[]}
     * @memberof Room.prototype
     */
    labs: {
        get: function() {
            if (this.my && this.level < 6) {
                return [];
            }

            if (this._labs === undefined) {
                this._labs = this.cache.getStructures(STRUCTURE_LAB);
            }

            return this._labs;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureNuker | null}
     * @memberof Room.prototype
     */
    nuker: {
        get: function() {
            if (this.my && this.level < 8) {
                return null;
            }

            if (this._nuker === undefined) {
                this._nuker = this.cache.getStructure(STRUCTURE_NUKER) || null;
            }

            return this._nuker;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureObserver | null}
     * @memberof Room.prototype
     */
    observer: {
        get: function() {
            if (this.my && this.level < 8) {
                return null;
            }

            if (this._observer === undefined) {
                this._observer = this.cache.getStructure(STRUCTURE_OBSERVER) || null;
            }

            return this._observer;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureInvaderCore | null}
     * @memberof Room.prototype
     */
    invaderCore: {
        get: function() {
            if (this.my || this.isHighway) {
                return null;
            }

            if (this._invaderCore === undefined) {
                this._invaderCore = this.cache.getStructure(STRUCTURE_INVADER_CORE) || null;
            }

            return this._invaderCore;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureContainer[]}
     * @memberof Room.prototype
     */
    containers: {
        get: function() {
            if (this._containers === undefined) {
                this._containers = this.cache.getStructures(STRUCTURE_CONTAINER);
            }

            return this._containers;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureRoad[]}
     * @memberof Room.prototype
     */
    roads: {
        get: function() {
            if (this._roads === undefined) {
                this._roads = this.cache.getStructures(STRUCTURE_ROAD);
            }

            return this._roads;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureWall[]}
     * @memberof Room.prototype
     */
    walls: {
        get: function() {
            if (this._walls === undefined) {
                this._walls = this.cache.getStructures(STRUCTURE_WALL);
            }

            return this._walls;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureRampart[]}
     * @memberof Room.prototype
     */
    ramparts: {
        get: function() {
            if (this._ramparts === undefined) {
                this._ramparts = this.cache.getStructures(STRUCTURE_RAMPART);
            }

            return this._ramparts;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureRampart[]}
     * @memberof Room.prototype
     */
    allRamparts: {
        get: function() {
            if (this._allRamparts === undefined) {
                this._allRamparts = this.find(FIND_STRUCTURES, {
                    filter: { structureType: STRUCTURE_RAMPART }
                });
            }

            return this._allRamparts;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Structure[]}
     * @memberof Room.prototype
     */
    carrierStructures: {
        get: function() {
            if (this._carrierStructures === undefined) {
                this._carrierStructures = this.extensions.concat(this.spawns, this.expiringTowers);
            }

            return this._carrierStructures;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureTower[]}
     * @memberof Room.prototype
     */
    expiringTowers: {
        get: function() {
            if (this._expiringTowers === undefined) {
                this._expiringTowers = this.towers.filter(structure => structure.store[RESOURCE_ENERGY] < 300);
            }

            return this._expiringTowers;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Resource[]}
     * @memberof Room.prototype
     */
    droppedResources: {
        get: function() {
            if (this._droppedResources === undefined) {
                this._droppedResources = this.find(FIND_DROPPED_RESOURCES);
            }

            return this._droppedResources;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Resource[]}
     * @memberof Room.prototype
     */
    droppedEnergy: {
        get: function() {
            if (this._droppedEnergy === undefined) {
                this._droppedEnergy = this.droppedResources.filter(r => r.resourceType === RESOURCE_ENERGY);
            }

            return this._droppedEnergy;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Tombstone[]}
     * @memberof Room.prototype
     */
    tombstones: {
        get: function() {
            if (this._tombstones === undefined) {
                this._tombstones = this.find(FIND_TOMBSTONES, { filter: t => !t.isEmpty() });
            }

            return this._tombstones;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Ruin[]}
     * @memberof Room.prototype
     */
    ruins: {
        get: function() {
            if (this._ruins === undefined) {
                this._ruins = this.find(FIND_RUINS, { filter: r => !r.isEmpty() });
            }

            return this._ruins;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureKeeperLair[]}
     * @memberof Room.prototype
     */
    keeperLairs: {
        get: function() {
            if (this._keeperLairs === undefined) {
                this._keeperLairs = this.find(FIND_STRUCTURES, {
                    filter: { structureType: STRUCTURE_KEEPER_LAIR }
                });
            }

            return this._keeperLairs;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructurePowerBank | null}
     * @memberof Room.prototype
     */
    powerBank: {
        get: function() {
            if (this.isHighway) {
                if (this._powerBank === undefined) {
                    this._powerBank = _.find(this.find(FIND_STRUCTURES), { structureType: STRUCTURE_POWER_BANK }) || null;
                }

                return this._powerBank;
            }

            return null;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructurePortal[]}
     * @memberof Room.prototype
     */
    portals: {
        get: function() {
            if (this._portals === undefined) {
                this._portals = this.find(FIND_STRUCTURES, {
                    filter: { structureType: STRUCTURE_PORTAL }
                });
            }

            return this._portals;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureLab | null}
     * @memberof Room.prototype
     */
    labSource1: {
        get: function() {
            if (this._labSource1 === undefined) {
                try {
                    this._labSource1 = Game.getObjectById(this.memory.labSource1);
                } catch(e) {
                    this._labSource1 = null;
                }
            }

            return this._labSource1;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureLab | null}
     * @memberof Room.prototype
     */
    labSource2: {
        get: function() {
            if (this._labSource2 === undefined) {
                try {
                    this._labSource2 = Game.getObjectById(this.memory.labSource2);
                } catch(e) {
                    this._labSource2 = null;
                }
            }

            return this._labSource2;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureLab[]}
     * @memberof Room.prototype
     */
    filteredLabs: {
        get: function() {
            if (this._filteredLabs === undefined) {
                const labSource1 = this.labSource1 || {};
                const labSource2 = this.labSource2 || {};

                this._filteredLabs = _.filter(this.labs, (lab) => {
                    return lab.id !== labSource1.id && lab.id !== labSource2.id;
                });
            }

            return this._filteredLabs;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {StructureLink}
     * @memberof Room.prototype
     */
    centralLink: {
        get: function() {
            if (this.my && this.level < 5 || !this.storage) {
                return null;
            }

            if (this._centralLink === undefined) {
                const linkId = this.cache.get('centralLink', () => {
                    const link = this.storage.pos.findInRange(this.links, 1)[0];

                    return link ? link.id : null;
                });

                this._centralLink = Game.getObjectById(linkId);
            }

            return this._centralLink;
        },
        configurable: true
    },

    /**
     * @readonly
     * @type {Boolean}
     * @memberof Room.prototype
     */
    isReserved: {
        get: function() {
            if (this._isReserved === undefined) {
                this._isReserved = Boolean(this.controller && this.controller.reservation);
            }

            return this._isReserved;
        }
    },

    /**
     * @readonly
     * @type {Boolean}
     * @memberof Room.prototype
     */
    isReservedByMe: {
        get: function() {
            if (this._isReservedByMe === undefined) {
                this._isReservedByMe = this.isReserved && this.controller.reservation.username === MY_USERNAME;
            }

            return this._isReservedByMe;
        }
    },

    /**
     * @readonly
     * @type {Boolean}
     * @memberof Room.prototype
     */
    isReservedByPlayer: {
        get: function() {
            if (this._isReservedByPlayer === undefined) {
                this._isReservedByPlayer = this.isReserved
                    && this.controller.reservation.username !== MY_USERNAME
                    && this.controller.reservation.username !== INVADER_USERNAME;
            }

            return this._isReservedByPlayer;
        }
    },

    /**
     * @readonly
     * @type {Boolean}
     * @memberof Room.prototype
     */
    isHostile: {
        get: function() {
            if (this._isHostile === undefined) {
                this._isHostile = Boolean(this.controller && this.controller.owner && this.controller.owner.username !== MY_USERNAME);
            }

            return this._isHostile;
        }
    },

    /**
     * @readonly
     * @type {Boolean}
     * @memberof Room.prototype
     */
    isSK: {
        get: function() {
            if (this._isSK === undefined) {
                this._isSK = !this.controller && this.sources.length === 3;
            }

            return this._isSK;
        }
    },

    /**
     * @readonly
     * @type {Boolean}
     * @memberof Room.prototype
     */
    isHighway: {
        get: function() {
            if (this._isHighway === undefined) {
                this._isHighway = !this.controller && this.sources.length === 0;
            }

            return this._isHighway;
        }
    }

});

// static methods

/**
 * @static
 * @param {string} value
 * @returns {boolean}
 */
Room.isRoomName = function(value) {
    if (!value) {
        return false;
    }

    value = value.toUpperCase();

    if (Game.rooms[value]) {
        return true;
    }

    const char = value[0];

    if (char === 'E' || char === 'W') {
        return value.includes('S') || value.includes('N');
    }

    return false;
};

/**
 * @static
 * @param {string} roomName
 * @returns {boolean}
 */
Room.isSK = function(roomName) {
    const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
    const fMod = parsed[1] % 10;
    const sMod = parsed[2] % 10;

    return !(fMod === 5 && sMod === 5) && ((fMod >= 4) && (fMod <= 6)) && ((sMod >= 4) && (sMod <= 6));
};

/**
 * @static
 * @param {string} roomName
 * @returns {boolean}
 */
Room.isHighway = function(roomName) {
     const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);

     return (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
};

// methods

Room.prototype.initialize = function() {
    if (this.my) {
        this.reservedCarrierStructures = this.memory.reservedCarrierStructures;

        if (!this.reservedCarrierStructures) {
            this.memory.reservedCarrierStructures = {};

            this.reservedCarrierStructures = this.memory.reservedCarrierStructures;
        }
    }

    this.initializeAll();
    this.checkAll();
    this.updateMemory();
};

//

Room.prototype.filterEnemies = function(creep) {
    const pos = creep.pos;
    const x = pos.x;
    const y = pos.y;

    if (!creep.my) {
        const username = creep.owner.username;

        if (username === 'Orlet' && Game.shard.name === 'shard1' && creep.room.name === 'E35S4') {
            return false;
        }

        const inRoom = (x !== 0 && x !== 49 && y !== 0 && y !== 49) || username === INVADER_USERNAME || username === SOURCE_KEEPER_USERNAME;

        return inRoom;
    }

    return false;
};

Room.prototype.filterPlayerEnemies = function(creep) {
    const username = creep.owner.username;

    return username !== INVADER_USERNAME && username !== SOURCE_KEEPER_USERNAME && !creep.pos.isBorder();
};

//

Room.prototype.initializeRamparts = function() {
    if (!this.my || Game.cpu.bucket < 500) {
        return;
    }

    if (!this.memory.ramparts) {
        const ramparts = {};
        const codec = new global.Codec({ depth: 29 });

        _.forEach(this.ramparts, (rampart) => {
            if (rampart.hits > 100000) {
                ramparts[rampart.pos.encode()] = codec.encode(rampart.hits);
            }
        });

        this.memory.ramparts = ramparts;
    } else if (Game.time % 75 === 0) {
        const ramparts = this.ramparts;
        const length = ramparts.length;
        const memoryRamparts = this.memory.ramparts;

        if (length > 0) {
            const codec = new global.Codec({ depth: 29 });
                if (length !== memoryRamparts.length) {

                _.forEach(ramparts, rampart => {
                    if (rampart.hits > 100000) {
                        const pos = rampart.pos.encode();
                        if (!memoryRamparts[pos]) {
                            memoryRamparts[pos] = codec.encode(rampart.hits);
                        }
                    }
                });
            }
        } else if (length === 0) {
            this.memory.ramparts = {};
        }
    }
};

Room.prototype.initializeAll = function() {
    this.initializeRamparts();
};

//

Room.prototype.checkNukes = function() {
    if (Game.time % 1000 === 0 && this.nukes.length > 0) {
        Game.notify(`В комнате ${this.name} ${this.nukes.length} нюков!`);

        this.nukes.forEach((nuke) => {
            Game.map.visual.circle(
                nuke.pos,{ fill: 'transparent', radius: NUKE_RANGE * 50, stroke: '#ff0000' });
        });
    }
};

Room.prototype.checkAll = function() {
    if (this.my) {
        this.checkNukes();
    }
};

//

Room.prototype.runAll = function() {
    if (this.my) {
        try {
            this.runSpawns();
        } catch(e) {
            console.log('runSpawns (' + linkRoom(this) + '): ' + (e && e.stack ? e.stack : e));
        }
    }

    try {
        this.runRoles();
    } catch(e) {
        console.log('runRoles (' + linkRoom(this) + '): ' + (e && e.stack ? e.stack : e));
    }

    try {
        this.runPowerCreeps();
    } catch(e) {
        console.log('runPowerCreeps (' + linkRoom(this) + '): ' + (e && e.stack ? e.stack : e));
    }

    if (this.my) {
        try {
            this.runTowers();
        } catch(e) {
            console.log('runTowers (' + linkRoom(this) + '): ' + e);
        }

        try {
            this.runLinks();
        } catch(e) {
            console.log('runLinks (' + linkRoom(this) + '): ' + e);
        }

        try {
            this.runTerminal();
        } catch(e) {
            console.log('runTerminal (' + linkRoom(this) + '): ' + e);
        }

        if (this.level >= 7) {
            try {
                this.runFactory();
            } catch (e) {
                console.log('runFactory (' + linkRoom(this) + '): ' + e);
            }
        }

        if (this.level === 8) {
            try {
                if (this.labs.length === 10 && Game.cpu.bucket >= 250) {
                    this.runLabs();
                }
            } catch(e) {
                console.log('runLabs (' + linkRoom(this) + '): ' + e);
            }

            try {
                this.runObserver();
            } catch(e) {
                console.log('runObserver (' + linkRoom(this) + '): ' + e);
            }

            try {
                this.runPowerSpawn();
            } catch(e) {
                console.log('runPowerSpawn (' + linkRoom(this) + '): ' + e);
            }

            // try {
            //     this.runFactory();
            // } catch(e) {
            //     console.log('runFactory (' + linkRoom(this) + '): ' + e);
            // }
        }

        try {
            this.runVisual();
        } catch(e) {
            console.log('runVisual (' + linkRoom(this) + '): ' + e);
        }
    }

    if (this.my && this.playerEnemies.length > 0) {
        if (this.controller.safeMode === undefined) {
            this.cache.clear();
        }

        if (this.level === 8 && (this.energyCapacityAvailable < 10000 || this.towers.length < 5 || this.creeps.length === 0 || !this.storage || !this.terminal)) {
            this.controller.activateSafeMode();

            Game.notify('В комнате ' + this.name + ' активирован безопасный режим!');
        } else if (this.level === 7 && this.energyCapacityAvailable < 5000) {
            this.controller.activateSafeMode();

            Game.notify('В комнате ' + this.name + ' активирован безопасный режим!');
        } else if (this.level === 6 && (this.energyCapacityAvailable < 2000 || !this.storage || !this.terminal)) {

        }
    }
};

Room.prototype.runSpawns = function() {
    ModuleManager.run('spawnManager', this);
};

Room.prototype.runRoles = function() {
    this.creeps.forEach((creep) => {
        if (creep.spawning) {
            return;
        }

        if (creep.memory.s === 1) {
            if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL) > 0) {
                creep.heal(creep);
            }

            return;
        }

        if (Game.cpu.bucket < 200 && !this.my) {
            // if (Game.cpu.tickLimit === 0 || Game.cpu.getUsed() >= Game.cpu.limit) {
                return;
            // }
        }


        if (creep.isWaiting()) {
            if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL) > 0) {
                creep.heal(creep);
            }

            creep.memory.w--;

            creep.say(`⏱️ - ${creep.memory.w}`);

            return;
        }

        let newRole = this.runRole(creep);

        if (newRole) {
            creep.role = newRole;
            creep.say(newRole);
            newRole = this.runRole(creep);
        }

        if (newRole) {
            creep.role = newRole;
            creep.say(newRole);
            newRole = this.runRole(creep);
        }

        // this.runDroppedEnergy(creep);
        //
        // if (newRole) {
        //     creep.role = newRole;
        //     creep.say(newRole);
        // }
    });
};

Room.prototype.runPowerCreeps = function() {
    const roomCreep = _.find(Game.powerCreeps, creep => creep.name === this.name);

    if (roomCreep && !roomCreep.room) {
        const powerSpawn = this.powerSpawn;

        if (powerSpawn && roomCreep.spawn(powerSpawn) === OK) {
            console.log(`Resurrected power creep in the room ${linkRoom(this)}`);
        }
    }

    this.powerCreeps.forEach((creep) => {
        if (creep.memory.s === 1) {
            return;
        }

        if (creep.memory.w > 0) {
            creep.memory.w--;

            creep.say(`w - ${creep.memory.w}`);

            return;
        }

        switch (creep.className) {
            case POWER_CLASS.OPERATOR:
                ModuleManager.run('power.operator', creep);
                break;
        }
    });
};

Room.prototype.convertRole = function(role) {
    if (!role) {
        return role;
    }

    if (role === 'minerMineral') {
        return role;
    }

    if (role.startsWith('miner')) {
        return 'miner';
    }

    if (role.startsWith('carrier-E') || role.startsWith('carrierMineral-E') || role === 'carrierRoom') {
        return 'carrierRoom';
    }

    if (role.startsWith('builder')) {
        return 'builder';
    }

    if (role.startsWith('warrior')) {
        if (role.includes('Defender')) {
            return 'defender';
        }

        if (role.includes('Keeper')) {
            return 'warriorKeeper';
        }

        return 'warrior';
    }

    if (role.includes('Defender')) {
        return 'defender';
    }

    if (role.startsWith('reserver')) {
        return 'reserver';
    }

    return role;
};

Room.prototype.runRole = function(creep) {
    let newRole = null;

    const role = this.convertRole(creep.role);

    switch (role) {
        case 'miner':
            ModuleManager.run('miner', this, creep);
            break;
        case 'minerMineral':
            ModuleManager.run('minerMineral', creep);
            break;
        case 'getter':
            newRole = ModuleManager.run('getter', this, creep);
            break;
        case 'carrier':
            newRole = ModuleManager.run('role.carrier', creep);
            break;
        case 'central':
            newRole = ModuleManager.run('role.central', creep);
            break;
        case 'carrierLinkTerminal':
            newRole = ModuleManager.run('carrierLinkTerminal', this, creep);
            break;
        case 'carrierRoom':
            newRole = ModuleManager.run('role.carrierRoom', creep);
            break;
        case 'caravan':
            newRole = ModuleManager.run('role.caravan', creep);
            break;
        case 'carrierMineral':
            newRole = ModuleManager.run('role.carrierMineral', creep);
            break;
        case 'carrierStorage':
            newRole = ModuleManager.run('role.carrierStorage', creep);
            break;
        case 'carrierTerminal':
            newRole = ModuleManager.run('role.carrierTerminal', creep);
            break;
        case 'carrierLab':
            newRole = ModuleManager.run('role.carrierLab', creep);
            break;
        case 'carrierBoost':
            newRole = ModuleManager.run('role.carrierBoost', creep);
            break;
        case 'carrierNuker':
            newRole = ModuleManager.run('role.carrierNuker', creep);
            break;
        case 'carrierUpgrader':
            if (!CarrierUpgrader) {
                CarrierUpgrader = require('carrierUpgrader');
            }
            newRole = CarrierUpgrader.run(this, creep);
            break;
        case 'repairer':
            if (!Repairer) {
                Repairer = require('repairer');
            }
            newRole = Repairer.run(this, creep);
            break;
        case 'remoteRepairer':
            if (!RemoteRepairer) {
                RemoteRepairer = require('remoteRepairer');
            }
            newRole = RemoteRepairer.run(this, creep);
            break;
        case 'upgrader':
        case 'upgrader-E40S10':
        case 'upgrader-E50S10':
            if (!Upgrader) {
                Upgrader = require('upgrader');
            }
            newRole = Upgrader.run(this, creep);
            break;
        case 'builder':
            newRole = ModuleManager.run('role.builder', creep);
            break;
        case 'warrior':
            if (!Warrior) {
                Warrior = require('warrior');
            }
            Warrior.run(this, creep);
            break;
        case 'traveler':
            newRole = ModuleManager.run('traveler', this, creep);
            break;
        case 'reserver':
            if (!Reserver) {
                Reserver = require('reserver');
            }
            Reserver.run(creep);
            break;
        case 'ramparter':
        case 'waller':
            newRole = ModuleManager.run('worker', this, creep);
            break;
        case 'booster':
            newRole = ModuleManager.run('booster', this, creep);
            break;
        case 'defender':
            if (!Defender) {
                Defender = require('defender');
            }
            Defender.run(this, creep);
            break;
        case 'recycler':
            newRole = ModuleManager.run('recycler', creep);
            break;
        case 'warriorKeeper':
            if (!WarriorKeeper) {
                WarriorKeeper = require('warriorKeeper');
            }
            WarriorKeeper.run(this, creep);
            break;
        case 'dismantler':
            newRole = ModuleManager.run('creep.dismantler', creep);
            break;
        case 'marauder':
            newRole = ModuleManager.run('role.marauder', creep);
            break;
        default:
            const message = 'Неизвестная роль: ' + role + ' (' + creep.name + ') (' + linkRoom(creep.room) + ')';

            console.log(message);

            Game.notify(message, 60);

            break;
    }

    return newRole;
};

Room.prototype.runDroppedEnergy = function(creep) {
    // if ((creep.initialRole === 'upgrader-E38S14') && creep.room.name !== 'E38S14') {
    //     creep.drop(creep.getterType);
    //     return;
    // }

    // if ((creep.initialRole === 'builder-E42S15') && creep.room.name !== 'E45S18') {
    //     creep.drop(creep.getterType);
    //     return;
    // }

    // if (creep.initialRole === 'carrierResource') {
    //     return;
    // }

    if (creep.carryCapacity === 0 || creep.store[creep.getterType] === creep.carryCapacity) {
        return;
    }

    const rooms = [];

    for (let name in this.droppedResources) {
        let energy = this.droppedResources[name];

        if (!energy || energy.resourceType !== creep.getterType) {
            continue;
        }

        if (creep.pickup(energy) === OK) {
            creep.say('pickup');
        } else {
            if (energy.amount > 200 && creep.role === 'getter' && rooms.includes(this.name)) {
                this._moveToPickup(creep, energy);

                return;
            }
        }
    }
};

Room.prototype.runTowers = function() {
    ModuleManager.run('tower', this);
};

Room.prototype.runLinks = function() {
    ModuleManager.run('link', this);
};

Room.prototype.runLabs = function() {
    ModuleManager.run('lab', this);
};

Room.prototype.runObserver = function() {
    ModuleManager.run('observer', this);
};

Room.prototype.runTerminal = function() {
    if (Game.time % 10 === 0 && this.terminal) {
        this.terminal.processTasks();
    }

    // const rooms = ['E68S9', 'E68S8', 'E67S14', 'E64S13', 'E74S21',
    //     'E42S9', 'E38S12', 'E39S6', 'E39S9', 'E37S4', 'E44S3', 'E47S8', 'E45S9', 'E38S14', 'E37S16', 'E44S17', 'E27S9', 'E23S5', 'E24S3',
    //     'E38S9', 'E42S11', 'E47S14', 'E37S5', 'E48S9', 'E49S16', 'E35S8', 'E42S13', 'E47S11', 'E35S3', 'E45S18', 'E42S15', 'E32S5',
    //     'E39S11'];
    //
    // const store = this.store;
    //
    // if (store[RESOURCE_ENERGY] < 35000 && this.terminalUsedCapacity < this.terminalCapacity && (store[RESOURCE_BATTERY] < 1000 || !this.factory)) {
    //     if (this.enemies.length === 0 && rooms.includes(this.name)) {
    //         const order = Market.findMyOrder({ type: ORDER_BUY, resourceType: RESOURCE_ENERGY, roomName: this.name });
    //         const amount = 35000 - store[RESOURCE_ENERGY];
    //
    //         if (order) {
    //             if (order.remainingAmount > 0) {
    //                 const ignoreLimit = store[RESOURCE_ENERGY] < 10000 && order.remainingAmount < 5000 || this.energyPercents < 25 && order.remainingAmount < 30000;
    //
    //                 Market.updatePrice(order.id, { ignoreLimit, log: ignoreLimit });
    //             } else if (order.remainingAmount === 0 && amount >= 1000) {
    //                 const ignoreLimit = store[RESOURCE_ENERGY] < 10000 && amount < 5000;
    //
    //                 Market.extend(order.id, amount, { ignoreLimit, log: (ignoreLimit || order.price * amount > 1000) });
    //             }
    //         } else {
    //             Market.createOrder({ type: ORDER_BUY, resourceType: RESOURCE_ENERGY, price: 0, amount, roomName: this.name });
    //         }
    //
    //         return;
    //     }
    // }

    // terminal.processRequiredResources();
    //
    // if (terminal.cooldown > 0 || terminal.isSending()) {
    //     return;
    // }
    //
    // if (terminal.processTasks()) {
    //     return;
    // }

    // orders for T0
    // if (Game.time % 40 === 0) {
    //     for (const resourceType of Resource.T0) {
    //         if (store[resourceType] >= 500) {
    //             if (store[resourceType] >= 2500) {
    //                 const order = Market.findMyOrder({
    //                     type: ORDER_BUY,
    //                     resourceType,
    //                     roomName: this.name,
    //                     empty: true
    //                 });
    //
    //                 if (order) {
    //                     Market.cancel(order.id);
    //                 }
    //             }
    //
    //             continue;
    //         }
    //
    //         const buyPrice = _.get(Memory, `trade[${ORDER_SELL}][${resourceType}].price`);
    //
    //         if (!Number.isFinite(buyPrice)) {
    //             continue;
    //         }
    //
    //         const currentPrice = Market.getCurrentPrice({ type: ORDER_BUY, resourceType });
    //         const order = Market.findMyOrder({ type: ORDER_BUY, resourceType, roomName: this.name });
    //
    //         if (currentPrice > buyPrice) {
    //             if (order && order.remainingAmount === 0) {
    //                 Market.cancel(order.id);
    //             }
    //
    //             continue;
    //         }
    //
    //         if (order) {
    //             if (order.remainingAmount === 0) {
    //                 Market.extend(order.id, 2500, { updatePrice: true, maxPrice: buyPrice, initiator: 'orders for T0' });
    //             } else {
    //                 Market.updatePrice(order.id, { maxPrice: buyPrice, initiator: 'orders for T0' });
    //             }
    //         } else {
    //             Market.createOrder({ type: ORDER_BUY, resourceType, amount: 2500, price: currentPrice, roomName: this.name, initiator: 'orders for T0' });
    //         }
    //     }
    // }

    // sell a lot of energy
    // if (Game.time % 40 === 0 && terminal.store[RESOURCE_ENERGY] >= 25000 && store[RESOURCE_ENERGY] >= 100000) {
    //     const storage = this.storage;
    //
    //     if (storage && storage.store.getFreeCapacity() <= 1000) {
    //         if (Market.sell({ resourceType: RESOURCE_ENERGY, amount: 5000, roomName: this.name, initiator: 'a lot of energy' }) === OK) {
    //             return;
    //         }
    //     }
    // }
};

Room.prototype.runPowerSpawn = function() {
    const powerSpawn = this.powerSpawn;

    if (powerSpawn && powerSpawn.store[RESOURCE_POWER] > 0 && powerSpawn.store[RESOURCE_ENERGY] >= 50) {
        powerSpawn.processPower();
    }
};

Room.prototype.runFactory = function() {
    const factory = this.factory;

    if (factory && factory.cooldown === 0) {
        ModuleManager.run('factory', this);
    }
};

Room.prototype.runVisual = function() {
    if (Game.cpu.bucket >= 250) {
        ModuleManager.run('visual', this);
    }
};

//

Room.prototype.updateMemory = function() {
    this.memory.updatedAt = Game.time;

    if (!this.my) {
        this.memory.enemies = this.enemies.length;
        this.memory.invaders = this.invaders.length;
        this.memory.playerEnemies = this.playerEnemies.length;

        if (this.memory.enemies > 0) {
            Game.map.visual.text(
                `Enemies: ${this.memory.enemies}`,
                new RoomPosition(0, 0, this.name),
                { color: '#f00', fontSize: 10 });
        }

        const invaderCore = this.invaderCore;
        if (invaderCore) {
            const data = { level: invaderCore.level };

            if (invaderCore.ticksToDeploy > 0) {
                data.ticksToDeploy = invaderCore.ticksToDeploy;
            } else if (invaderCore.hasEffect(EFFECT_COLLAPSE_TIMER)) {
                const effect = invaderCore.getEffect(EFFECT_COLLAPSE_TIMER);

                data.expiredAt = Game.time + effect.ticksRemaining;
            }

            Game.map.visual.circle(invaderCore.pos, { radius: 5, color: '#f00' });
            Game.map.visual.text(String(invaderCore.level || 0), invaderCore.pos, { fontSize: 14 });

            this.memory.invaderCore = data;
        } else {
            delete this.memory.invaderCore;
        }

        if (!this.isHighway && !this.memory.sources) {
            this.memory.sources = this.sources.map(source => source.pos.encode());
        }
    }

    if (this.controller) {
        const reservationInfo = this.controller.reservation;

        if (reservationInfo) {
            if (reservationInfo.username === INVADER_USERNAME && !this.invaderCore) {
                delete this.memory.reservation;
            } else {
                this.memory.reservation = reservationInfo.ticksToEnd;
            }
        } else {
            delete this.memory.reservation;
        }
    }

    if (this.isHighway) {
        this.memory.hw = 1;

        const powerBank = this.powerBank;
        if (powerBank) {
            this.memory.powerBank = {
                id: powerBank.id,
                hits: powerBank.hits,
                power: powerBank.power,
                ticksToDecay: powerBank.ticksToDecay
            };
        } else {
            delete this.memory.powerBank;
        }

        const deposit = this.deposit;
        if (deposit) {
            this.memory.deposit = {
                id: deposit.id,
                depositType: deposit.depositType,
                ticksToDecay: deposit.ticksToDecay
            }
        } else {
            delete this.memory.deposit;
        }
    }

    if (this.isSK) {
        this.memory.sk = 1;

        const keeperLairs = this.keeperLairs;
        if (keeperLairs.length > 0) {
            this.memory.keeperLairs = keeperLairs.map(keeperLair => keeperLair.pos.encode());
        }

        this.updateMineral();
    }

    this.updateCache();

    this.updateObjectsMemory();
};

Room.prototype.updateMineral = function() {
    const mineral = this.mineral;

    if (mineral) {
        let mineralInfo = this.memory.mineral;

        if (!mineralInfo) {
            mineralInfo = {
                id: mineral.id,
                pos: mineral.pos.encode(),
                type: mineral.mineralType
            };
        }

        mineralInfo.amount = mineral.mineralAmount;

        if (mineral.mineralAmount > 0) {
            mineralInfo.generatedAt = Game.time;
        } else if (mineral.ticksToRegeneration > 0) {
            mineralInfo.generatedAt = Game.time + mineral.ticksToRegeneration;
        }

        this.memory.mineral = mineralInfo;
    }
};

Room.prototype.updateCache = function() {
    if (this.my || this.isReservedByMe) {
        delete this.memory.cache;

        return;
    }

    if (this.memory.cache && (Game.time % 50 === 0 || Game.time >= this.memory.cache.expiredAt)) {
        delete this.memory.cache;
    }

    if (!this.memory.cache) {
        const cache = { expiredAt: Game.time + 20000 };

        const walls = this.walls;
        if (walls.length > 0) {
            cache.walls = _.map(walls, wall => wall.pos.encode());
        }

        const ramparts = this.allRamparts;
        if (ramparts.length > 0) {
            cache.ramparts = _.map(ramparts, rampart => rampart.pos.encode());
        }

        const roads = this.roads;
        if (roads.length > 0) {
            cache.roads = _.map(this.roads, road => road.pos.encode());
        }

        const towers = this.towers;
        if (towers.length > 0) {
            cache.towers = towers.map(tower => tower.pos.encode());
        }

        const controller = this.controller;
        if (controller) {
            if (controller.level > 0) {
                cache.level = controller.level;
            }

            if (controller.owner) {
                const hostile = (controller.owner.username !== MY_USERNAME ? 1 : 0);

                if (hostile) {
                    cache.hostile = hostile;
                    cache.owner = controller.owner.username;
                }
            }

            cache.controller = this.controller.pos.encode();
        }

        if (this.isSK || this.isHighway) {
            const portals = this.portals;
            if (portals.length > 0) {
                cache.portals = _.map(portals, portal => portal.pos.encode());
            }
        }

        this.memory.cache = cache;
    }
};

Room.prototype.updateObjectsMemory = function() {
    if (Game.time % 100 !== 0) {
        return;
    }

    _.forEach(this.memory.objects, (memory, id) => {
        const object = Game.getObjectById(id);

        if (!object) {
            delete this.memory.objects[id];

            return;
        }

        object.checkMemory();
    });
};

//

Room.prototype._moveToPickup = function(creep, target) {
    if (creep.pickup(target) === OK) {
        creep.say('pickup');

        // creep.cancelOrder('move');
        // creep.cancelOrder('moveTo');

        return;
    }

    creep.moveTo(target, {
        maxRooms: 1,
        maxOps: 500,
        range: 1,
        visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ff0000',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: 0.2
        }
    });

    const visual = this.visual;

    if (visual) {
        visual.circle(target.pos, {
            radius: 0.75,
            stroke: '#ff0000',
            strokeWidth: .15,
            opacity: 0.2
        });
    }

    if (creep.carry.energy === creep.carryCapacity) {
        creep.role = creep.memory.roleAfterGetter || creep.initialRole;
    }
};

/**
 * @param {string} room
 * @param {number} [ticks=1]
 *
 * @returns {boolean}
 */
Room.prototype.tryToRequestObserve = function(room, ticks = 1) {
    const observer = this.observer;

    return observer ? observer.requestRoom(room, ticks) : false;
};

Room.prototype.requestCreepOld = function(role, options = {}) {
    if (!this.memory.spawnQueue) {
        this.memory.spawnQueue = [];
    }

    if (!options.amount) {
        options.amount = 1;
    }

    this.memory.spawnQueue.push({
        ...options,
        expiredAt: Game.time + 50000 + (options.expiredAt || 0),
        role,
    });
};

Room.prototype.requestCreep = function(name, body, memory = {}) {
    if (!this.memory.spawnQueueNew) {
        this.memory.spawnQueueNew = [];
    }

    this.memory.spawnQueueNew.push({ name, body, memory });
};

Room.prototype.around = function(range = 1, options = { my: true, reservedByMe: true, reserved: false, all: false, hostile: false }) {
    const regex = /(\w)(\d+)(\w)(\d+)/;
    const result = regex.exec(this.name);

    const s1 = result[1];
    const s2 = result[3];

    const x = Number(result[2]);
    const y = Number(result[4]);

    const startX = x - range;
    const finishX = x + range;
    const startY = y - range;
    const finishY = y + range;

    const rooms = [];

    for (let _x = startX; _x <= finishX; _x++) {
        for (let _y = startY; _y <= finishY; _y++) {
            if (_x !== x || _y !== y) {
                const roomName = s1 + _x + s2 + _y;

                if (options.all) {
                    rooms.push(roomName);
                } else {
                    if (options.my) {
                        const room = Game.rooms[roomName];

                        if (room && room.my) {
                            rooms.push(roomName);
                        }
                    }

                    if (options.reserved) {
                        const room = Game.rooms[roomName];

                        if (room && room.isReserved) {
                            rooms.push(roomName);
                        }
                    }

                    if (options.reservedByMe) {
                        const room = Game.rooms[roomName];

                        if (room && room.isReservedByMe) {
                            rooms.push(roomName);
                        }
                    }

                    if (options.hostile) {
                        const room = Game.rooms[roomName];
                        const memory = Memory.rooms[roomName];

                        if (room && room.isHostile || memory && memory.hostile === 1) {
                            rooms.push(roomName);
                        }
                    }
                }
            }
        }
    }

    return rooms;
};

/**
 * @returns {string[]}
 */
Room.prototype.getFactoryReactions = function() {
    if (this._factoryReactions === undefined) {
        const factory = this.factory;
        let reactions = this.memory.factoryReactions || Memory.factoryResources || [];

        if (reactions.length === 0 || !factory) {
            this._factoryReactions = [];

            return this._factoryReactions;
        }

        let level = factory.level;

        if (level > 0 && !factory.hasEffect(PWR_OPERATE_FACTORY)) {
            level = undefined;

            reactions = _.pull(Resource.COMMODITIES.slice(), RESOURCE_PURIFIER);
        }

        this._factoryReactions = reactions.filter((reaction) => {
           const data = COMMODITIES[reaction];

           return data.level === undefined || data.level === level;
        });
    }

    return this._factoryReactions;
};

/**
 * @returns {string[]}
 */
Room.prototype.getFactoryComponents = function() {
    if (this._factoryComponents === undefined) {
        const reactions = this.getFactoryReactions();

        if (reactions.length === 0) {
            this._factoryComponents = [];

            return this._factoryComponents;
        }

        this._factoryComponents =
            _.chain(reactions)
            .reduce((acc, reaction) => acc.concat(Object.keys(COMMODITIES[reaction].components)), [])
            .uniq()
            .pull(RESOURCE_ENERGY)
            .value();
    }

    return this._factoryComponents;
};

//

module.exports = Room;
