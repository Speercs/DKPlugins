
global.Codec = require('utf15').Codec;
global.Traveler = require('_Traveler');

require('Constants');
require('moduleManager');
require('properties');
require('cache.global');
require('shard');
require('shardMemory');
require('market');
require('room');

//

const profiler = require('screeps-profiler');

// This line monkey patches the global prototypes.
// profiler.enable();

//

function getResourcesTable() {
    let output = '<table width="300px" border="2px" cellspacing="4px" cellpadding="4px"><tr>' +
        '<td align="center">T0</td>' +
        '<td align="center">T1</td>' +
        '<td align="center">T2</td>' +
        '<td align="center">T3</td>' +
        '<td align="center">COMMODITIES</td>' +
        '<td align="center">FACTORY</td>' +
        '<td align="center">FACTORY</td>' +
        '<td align="center">FACTORY</td>' +
        '<td align="center">FACTORY</td>' +
        '</tr>';

    output += `<tr><td align="right">#energy#</td><td align="right">#UH#</td><td align="right">#UH2O#</td><td align="right">#XUH2O#</td><td align="right">#utrium_bar#</td><td align="right">#wire#</td><td align="right">#cell#</td><td align="right">#alloy#</td><td align="right">#condensate#</td></tr>`;
    output += `<tr><td align="right">#power#</td><td align="right">#UO#</td><td align="right">#UHO2#</td><td align="right">#XUHO2#</td><td align="right">#silicon#</td><td align="right">#switch#</td><td align="right">#phlegm#</td><td align="right">#tube#</td><td align="right">#concentrate#</td></tr>`;
    output += `<tr><td align="right">#H#</td><td align="right">#KH#</td><td align="right">#KH2O#</td><td align="right">#XKH2O#</td><td align="right">#keanium_bar#</td><td align="right">#transistor#</td><td align="right">#tissue#</td><td align="right">#fixtures#</td><td align="right">#extract#</td></tr>`;
    output += `<tr><td align="right">#O#</td><td align="right">#KO#</td><td align="right">#KHO2#</td><td align="right">#XKHO2#</td><td align="right">#mist#</td><td align="right">#microchip#</td><td align="right">#muscle#</td><td align="right">#frame#</td><td align="right">#spirit#</td></tr>`;
    output += `<tr><td align="right">#U#</td><td align="right">#LH#</td><td align="right">#LH2O#</td><td align="right">#XLH2O#</td><td align="right">#lemergium_bar#</td><td align="right">#circuit#</td><td align="right">#organoid#</td><td align="right">#hydraulics#</td><td align="right">#emanation#</td></tr>`;
    output += `<tr><td align="right">#L#</td><td align="right">#LO#</td><td align="right">#LHO2#</td><td align="right">#XLHO2#</td><td align="right">#biomass#</td><td align="right">#device#</td><td align="right">#organism#</td><td align="right">#machine#</td><td align="right">#essence#</td></tr>`;
    output += `<tr><td align="right">#K#</td><td align="right">#ZH#</td><td align="right">#ZH2O#</td><td align="right">#XZH2O#</td><td align="right">#zynthium_bar#</td></tr>`;
    output += `<tr><td align="right">#Z#</td><td align="right">#ZO#</td><td align="right">#ZHO2#</td><td align="right">#XZHO2#</td><td align="right">#metal#</td></tr>`;
    output += `<tr><td align="right">#X#</td><td align="right">#GH#</td><td align="right">#GH2O#</td><td align="right">#XGH2O#</td><td align="right">#ghodium_melt#</td></tr>`;
    output += `<tr><td align="right">#ops#</td><td align="right">#GO#</td><td align="right">#GHO2#</td><td align="right">#XGHO2#</td><td align="right">#purifier#</td></tr>`;
    output += `<tr><td rowspan="2" align="right">#battery#</td><td colspan="4" align="center">T1</td></tr>`;
    output += `<tr><td align="right">#OH#</td><td align="right">#ZK#</td><td align="right">#UL#</td><td align="right">#G#</td></tr>`;
    output += `<tr><td colspan="5" align="center">COMMODITIES</td>`;
    output += `<tr><td align="right">#oxidant#</td><td align="right">#reductant#</td><td align="right">#composite#</td><td align="right">#crystal#</td><td align="right">#liquid#</td></tr>`;

    output += '</table>';

    return output;
}

global.TICKS = {
    shard0: 5.5,
    shard1: 4.0,
    shard2: 4.0,
    shard3: 4.0,
};

global.linkRoom = function(room) {
    if (room instanceof Room) {
        room = room.name;
    } else {
        room = room.toUpperCase();
    }

    return '<a href="https://screeps.com/a/#!/room/' + Game.shard.name + '/' + room + '">' + room + '</a>';
};

global.getResourceType = function(resourceType) {
    if (!resourceType) {
        return null;
    }

    resourceType = resourceType.trim();

    if (resourceType === 'e') {
        return RESOURCE_ENERGY;
    }

    if (resourceType === 'p') {
        return RESOURCE_POWER;
    }

    if (resourceType === 'b') {
        return RESOURCE_BATTERY;
    }

    if (resourceType === 'px') {
        return PIXEL;
    }

    if (resourceType === 'cu') {
        return CPU_UNLOCK;
    }

    if (resourceType === 'ak') {
        return ACCESS_KEY;
    }

    switch (resourceType) {
        case RESOURCE_ENERGY:
        case RESOURCE_POWER:
        case RESOURCE_OPS:
        case SUBSCRIPTION_TOKEN:
        case CPU_UNLOCK:
        case PIXEL:
        case ACCESS_KEY:
            return resourceType;
        default: {
            const lower = resourceType.toLowerCase();

            if (RESOURCES_ALL.includes(lower)) {
                return lower;
            }

            break;
        }
    }

    return resourceType.toUpperCase();
};

global.svgBody = function(color, width = 16, height = 16) {
    const cx = width / 2;
    const cy = height / 2;
    const r = cx;

    return '<svg width="' + width + '" height="' + height + '"> <circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke="black" stroke-width="1" fill="' + color + '"/></svg>';
};

global.resourceImg = function(resourceType) {
    resourceType = getResourceType(resourceType);

    let icon = resourceType;

    if (resourceType === CPU_UNLOCK) {
        icon = 'cpu-unlock';
    } else if (resourceType === ACCESS_KEY) {
        icon = 'access-key';
    }

    return '<a target="_blank" href="https://screeps.com/a/#!/market/all/' + Game.shard.name + '/' + resourceType + '"><img src ="https://s3.amazonaws.com/static.screeps.com/upload/mineral-icons/' + icon + '.png" /></a>';
};

//

global.tr = function(roomName, resourceType, amount, dest, options = {}) {
    _.defaults(options, {
        log: true
    });

    if (roomName === dest || !dest) {
        return ERR_INVALID_ARGS;
    }

    if (!Array.isArray(resourceType)) {
        resourceType = global.getResourceType(resourceType);
    }

    if (Resource[resourceType]) {
        resourceType = Resource[resourceType];
    }

    roomName = roomName.toUpperCase();
    dest = dest.toUpperCase();

    const room = Game.rooms[roomName];

    if (!room) {
        return ERR_INVALID_ARGS;
    }

    const terminal = room.terminal;
    let result;

    if (terminal && terminal.my) {
        if (Array.isArray(resourceType)) {
            _.forEach(resourceType, (resource) => {
                if (room.store[resource] > 0) {
                    terminal.addTask(dest, resource, amount);
                }
            });

            return OK;
        }

        if (options.task) {
            terminal.addTask(dest, resourceType, amount);

            return OK;
        } else {
            result = terminal.transfer(resourceType, amount, dest, { log: options.log, createTask: true });
        }
    } else if (options.log) {
        console.log('Room ' + linkRoom(roomName) + ' do not have a terminal!');
    }

    return result;
};

global.trall = function(resourceType, roomName, amount = 0, options = {}) {
    _.defaults(options, {
        ignoreCooldown: true,
        minStore: 1,
    });

    resourceType = getResourceType(resourceType);
    roomName = roomName.toUpperCase();

    let rooms = Shard.myRooms;

    if (options.filter) {
        rooms = _.filter(rooms, options.filter);
    }

    rooms.forEach((room) => {
        const terminal = room.terminal;

        if (room.name === roomName || !terminal || (!options.ignoreCooldown && terminal.cooldown > 0)) {
            return;
        }

        const store = terminal.store[resourceType];

        if (store >= options.minStore && store > amount) {
            global.tr(room.name, resourceType, amount, roomName, { task: options.task });
        }
    });
};

global.extend = function(id, amount, options = {}) {
    _.defaults(options, { updatePrice: false });

    return Market.extend(id, amount, options);
};

global.deal = Market.deal.bind(Market);

global.progress = function(room, upgrade) {
    const controller = Game.rooms[room.toUpperCase()].controller;
    const leftProgress = controller.progressTotal - controller.progress;

    if (!upgrade) {
        return leftProgress;
    }

    if (upgrade === -1) {
        const creeps = Game.rooms[room.toUpperCase()].creeps.filter(c => c.role.includes('upgrader'));

        upgrade = _.reduce(creeps, (acc, creep) => acc + creep.getActiveBodyparts(WORK) * (creep.memory.boosted ||  1 / 2) * 2, 0);
    }

    const minutes = Math.round(leftProgress / upgrade * global.TICKS[Game.shard.name] / 60);
    const timeZonePadding = 3;
    const date = new Date();

    date.setMinutes(date.getMinutes() + minutes);
    date.setHours(date.getHours() + timeZonePadding);

    return `~${minutes} minutes (~${Math.floor(minutes / 60)} hours) to next level (${date.getHours()}:${date.getMinutes()})`;
};

global.rit = function(resourceType = 'e', min = 1) {
    resourceType = getResourceType(resourceType);

    let output = '<table width="150px" border="2px" cellspacing="4px" cellpadding="4px"><tr><td width="30%" align="center">Room</td><td width="70%" align="center">Resource</td></tr>';
    let print = false;
    let sum = 0;

    _.forEach(Shard.myRooms, (room) => {
        const terminal = room.terminal;

        if (terminal) {
            const store = terminal.store[resourceType] || 0;

            if (store >= min) {
                output += `<tr><td width="30%" align="center"> ${linkRoom(room)} </td><td width="70%" align="right">${store} ${resourceImg(resourceType)}</td></tr>`;
                print = true;
            }

            sum += store;
        }
    });

    if (print) {
        output += `<tr><td width="30%" align="center">Sum</td><td width="70%" align="right">${sum} ${resourceImg(resourceType)}</td></tr></table>`;

        return output;
    }

    return '';
};

global.rir = function(resourceType = 'e', min = 1) {
    resourceType = getResourceType(resourceType);

    let output = '<table width="200px" border="2" cellspacing="4px" cellpadding="4px"><tr><td width="25%" align="center">Room</td><td width="25%" align="center">Terminal</td><td width="25% align="center">Storage</td><td width="25% align="center">Factory</td></tr>';
    let print = false;
    let terminalSum = 0, storageSum = 0, factorySum = 0;

    _.forEach(Shard.myRooms, function(room) {
        let store = 0;
        let terminalStore = 0;
        let storageStore = 0;
        let factoryStore = 0;
        const terminal = room.terminal;

        if (terminal && terminal.store[resourceType] >= min) {
            terminalStore = terminal.store[resourceType];
            store += terminalStore;
        }

        const storage = room.storage;

        if (storage && storage.store[resourceType] >= min) {
            storageStore = storage.store[resourceType];
            store += storageStore;
        }

        const factory = room.factory;

        if (factory && factory.store[resourceType] >= min) {
            factoryStore = factory.store[resourceType];
            store += factoryStore;
        }

        if (store > 0) {
            output += `<tr><td width="25%" align="center"> ${linkRoom(room)} </td><td width="25%" align="right">${terminalStore} ${resourceImg(resourceType)}</td><td width="25%" align="right">${storageStore} ${resourceImg(resourceType)}</td><td width="25%" align="right">${factoryStore} ${resourceImg(resourceType)}</td></tr>`;

            print = true;
        }

        terminalSum += terminalStore;
        storageSum += storageStore;
        factorySum += factoryStore;
    });

    if (print) {
        output += `<tr><td width="30%" align="center">Total</td><td width="25%" align="right">${terminalSum} ${resourceImg(resourceType)}</td><td width="25%" align="right">${storageSum} ${resourceImg(resourceType)}</td><td width="25%" align="right">${factorySum} ${resourceImg(resourceType)}</td></tr>`;
        output += `<tr><td width="30%" align="center">Sum</td><td width="70%" colspan="3" align="center">${terminalSum + storageSum + factorySum} ${resourceImg(resourceType)}</td></tr></table>`;

        return output;
    }

    return '';
};

global.ar = function(checkStorage = true, checkFactory = true) {
    let output = '<table width="300px" border="2px" cellspacing="4px" cellpadding="4px"><tr>' +
        '<td align="center">T0</td>' +
        '<td align="center">T1</td>' +
        '<td align="center">T2</td>' +
        '<td align="center">T3</td>' +
        '<td align="center">COMMODITIES</td>' +
        '<td align="center">FACTORY</td>' +
        '<td align="center">FACTORY</td>' +
        '<td align="center">FACTORY</td>' +
        '<td align="center">FACTORY</td>' +
        '</tr>';

    output += `<tr><td align="right">#energy#</td><td align="right">#UH#</td><td align="right">#UH2O#</td><td align="right">#XUH2O#</td><td align="right">#utrium_bar#</td><td align="right">#wire#</td><td align="right">#cell#</td><td align="right">#alloy#</td><td align="right">#condensate#</td></tr>`;
    output += `<tr><td align="right">#power#</td><td align="right">#UO#</td><td align="right">#UHO2#</td><td align="right">#XUHO2#</td><td align="right">#silicon#</td><td align="right">#switch#</td><td align="right">#phlegm#</td><td align="right">#tube#</td><td align="right">#concentrate#</td></tr>`;
    output += `<tr><td align="right">#H#</td><td align="right">#KH#</td><td align="right">#KH2O#</td><td align="right">#XKH2O#</td><td align="right">#keanium_bar#</td><td align="right">#transistor#</td><td align="right">#tissue#</td><td align="right">#fixtures#</td><td align="right">#extract#</td></tr>`;
    output += `<tr><td align="right">#O#</td><td align="right">#KO#</td><td align="right">#KHO2#</td><td align="right">#XKHO2#</td><td align="right">#mist#</td><td align="right">#microchip#</td><td align="right">#muscle#</td><td align="right">#frame#</td><td align="right">#spirit#</td></tr>`;
    output += `<tr><td align="right">#U#</td><td align="right">#LH#</td><td align="right">#LH2O#</td><td align="right">#XLH2O#</td><td align="right">#lemergium_bar#</td><td align="right">#circuit#</td><td align="right">#organoid#</td><td align="right">#hydraulics#</td><td align="right">#emanation#</td></tr>`;
    output += `<tr><td align="right">#L#</td><td align="right">#LO#</td><td align="right">#LHO2#</td><td align="right">#XLHO2#</td><td align="right">#biomass#</td><td align="right">#device#</td><td align="right">#organism#</td><td align="right">#machine#</td><td align="right">#essence#</td></tr>`;
    output += `<tr><td align="right">#K#</td><td align="right">#ZH#</td><td align="right">#ZH2O#</td><td align="right">#XZH2O#</td><td align="right">#zynthium_bar#</td></tr>`;
    output += `<tr><td align="right">#Z#</td><td align="right">#ZO#</td><td align="right">#ZHO2#</td><td align="right">#XZHO2#</td><td align="right">#metal#</td></tr>`;
    output += `<tr><td align="right">#X#</td><td align="right">#GH#</td><td align="right">#GH2O#</td><td align="right">#XGH2O#</td><td align="right">#ghodium_melt#</td></tr>`;
    output += `<tr><td align="right">#ops#</td><td align="right">#GO#</td><td align="right">#GHO2#</td><td align="right">#XGHO2#</td><td align="right">#purifier#</td></tr>`;
    output += `<tr><td rowspan="2" align="right">#battery#</td><td colspan="4" align="center">T1</td></tr>`;
    output += `<tr><td align="right">#OH#</td><td align="right">#ZK#</td><td align="right">#UL#</td><td align="right">#G#</td></tr>`;
    output += `<tr><td colspan="5" align="center">COMMODITIES</td>`;
    output += `<tr><td align="right">#oxidant#</td><td align="right">#reductant#</td><td align="right">#composite#</td><td align="right">#crystal#</td><td align="right">#liquid#</td></tr>`;
    let resources = {};

    _.forEach(Shard.myRooms, (room) => {
        const terminal = room.terminal;

        if (terminal) {
            _.forEach(terminal.store, (value, key) => {
                if (!resources[key]) {
                    resources[key] = 0;
                }
                resources[key] += value;
            });
        }

        if (checkStorage) {
            const storage = room.storage;

            if (storage) {
                _.forEach(storage.store, (value, key) => {
                    if (!resources[key]) {
                        resources[key] = 0;
                    }

                    resources[key] += value;
                });
            }
        }

        if (checkFactory) {
            const factory = room.factory;

            if (factory) {
                _.forEach(factory.store, (value, key) => {
                    if (!resources[key]) {
                        resources[key] = 0;
                    }

                    resources[key] += value;
                });
            }
        }
    });

    _.forEach(RESOURCES_ALL, (resource) => {
        const value = resources[resource] || 0;

        output = output.replace(`#${resource}#`, ` ${value.toLocaleString()} ${global.resourceImg(resource)} `);
    });

    output += '</table>';

    console.log(output);
};

global.freeS = function() {
    let output = '<table width="300px" border="2px" cellspacing="4px" cellpadding="4px"><tr><td width="30%" align="center">Room</td><td align="center">Terminal</td><td align="center">Storage</td></tr>';

    _.forEach(Game.rooms, room => {
        if (!room.my) {
            return;
        }

        const terminal = room.terminal;
        const storage = room.storage;
        const process = terminal || storage;

        if (process) {
            output += `<tr><td width="30%" align="center"> ${linkRoom(room)} </td>`;
        }

        if (terminal) {
            output += `<td width="35%" align="center">${terminal.store.getCapacity() - room.terminalUsedCapacity}</td>`;
        } else {
            output += '<td width="35%" align="center">0</td>';
        }

        if (storage) {
            output += `<td width="35%" align="center">${storage.store.getCapacity() - room.storageUsedCapacity}</td>`;
        } else {
            output += '<td width="35%" align="center">0</td>';
        }

        if (process) {
            output += '</tr>';
        }
    });

    output += '</table>';

    return output;
};

global.prices = function(type = ORDER_SELL) {
    let output = getResourcesTable();

    _.forEach(RESOURCES_ALL, (resourceType) => {
        const price = Market.getCurrentPrice({ type, resourceType });

        output = output.replace(`#${resourceType}#`, ` ${price} ${global.resourceImg(resourceType)} `);
    });

    return output;
};

global.cc = function(room, role, options) {
    if (_.isString(room)) {
        room = Game.rooms[room.toUpperCase()];
    }

    if (_.isString(options)) {
        options = { body: options };
    }

    if (Number.isFinite(options)) {
        options = { amount: options };
    }

    if (room) {
        room.requestCreepOld(role, { priority: 'low', notify: false, ...options });

        return room.memory.spawnQueue.length;
    }
};

global.ccf = function(room, role, options) {
    if (Number.isFinite(options)) {
        options = { amount: options };
    }

    return global.cc(room, role, { ...options, priority: 'high' });
};

global.ccr = function(room, role, options) {
    if (Number.isFinite(options)) {
        options = { amount: options };
    }

    return global.cc(room, role, { ...options, regular: true });
};

global.cancelCreep = function(room, index) {
    if (index < 0) {
        return;
    }

    if (_.isString(room)) {
        room = Game.rooms[room.toUpperCase()];
    }

    if (room) {
        const queue = room.memory.spawnQueue;

        if (queue && queue.length > 0) {
            queue.splice(index, 1);

            console.log(`New queue length: ${queue.length}`);

            return OK;
        }
    }
};

global.nukers = function(roomName) {
    let output = '<table width="150px" border="2px" cellspacing="4px" cellpadding="4px"><tr><td width="30%" align="center">Room</td><td width="40%" align="center">Energy</td><td width="30%" align="center">Ghodium</td></tr>';

    _.forEach(Shard.myRooms, (room) => {
        const nuker = room.nuker;
        const out = !!nuker && (!roomName || Game.map.getRoomLinearDistance(roomName, room.name) <= 10);

        if (out) {
            output += `<tr><td width="30%" align="center">${linkRoom(room)}</td><td width="40%" align="center">${nuker.energy} ${resourceImg(RESOURCE_ENERGY)}</td><td width="40%" align="center">${nuker.ghodium} ${resourceImg(RESOURCE_GHODIUM)}</td></tr>`;
        }
    });

    return output;
};

global.move = function(object, direction) {
    let creep;

    if (Game.creeps[object]) {
        creep = Game.creeps[object];
    } else if (Game.powerCreeps[object]) {
        creep = Game.powerCreeps[object];
    } else {
        creep = Game.getObjectById(object);
    }

    if (creep instanceof Creep || creep instanceof PowerCreep) {
        switch (direction) {
            case 1:
                direction = BOTTOM_LEFT;
                break;
            case 2:
                direction = BOTTOM;
                break;
            case 3:
                direction = BOTTOM_RIGHT;
                break;
            case 4:
                direction = LEFT;
                break;
            case 6:
                direction = RIGHT;
                break;
            case 7:
                direction = TOP_LEFT;
                break;
            case 8:
                direction = TOP;
                break;
            case 9:
                direction = TOP_RIGHT;
                break;
            default:
                direction = undefined;
                break;
        }

        if (direction !== undefined) {
            return creep.move(direction);
        }
    }
};

global.attackRoom = function(creepName, roomName, wait) {
    const creep = Game.getObjectById(creepName) || Game.creeps[creepName];

    if (!creep) {
        return undefined;
    }

    if (creep.room.my) {
        creep.memory.role = 'booster';
        creep.memory.roleAfterBoost = 'traveler';
    } else {
        creep.memory.role = 'traveler';
    }

    creep.memory.targetFlag = roomName.toUpperCase();

    if (wait > 0) {
        creep.wait(wait);
    }

    return OK;
};

global.caravans = function(value) {
    Memory.caravanEnabled = value || 0;
};

global.pcq = function(room) {
    room = Game.rooms[room.toUpperCase()];

    if (room) {
        const queue = room.memory.spawnQueue || [];

        console.log(JSON.stringify(queue.map(r => `${r.role} (${r.priority}${r.regular ? ', regular' : ''}) x${r.amount}`)));
    }
};

global.changePriority = function(room, index, priority) {
    room = Game.rooms[room.toUpperCase()];

    if (room) {
        const queue = room.memory.spawnQueue || [];
        const request = queue[index];

        if (request) {
            request.priority = priority;

            return OK;
        }
    }
};

global.changeOptions = function(room, index, options) {
    room = Game.rooms[room.toUpperCase()];

    if (room) {
        const queue = room.memory.spawnQueue || [];
        const request = queue[index];

        if (request) {
            if (typeof options === 'function') {
                options = options(request);
            }

            _.forEach(options, (value, key) => {
                request[key] = value;
            });

            return OK;
        }
    }
};

global.lr = function(roomName, reaction, amount) {
    if (!roomName) {
        return ERR_INVALID_ARGS;
    }

    const room = Game.rooms[roomName.toUpperCase()];

    if (room && room.my) {
        if (reaction) {
            const carrierLab = room.creeps.find(c => c.role === 'carrierLab');

            if (carrierLab && carrierLab.isWaiting()) {
                carrierLab.wait(0);
            }

            room.memory.labReaction = global.getResourceType(reaction);
            room.memory.labReactionAmount = amount;
        } else {
            delete room.memory.labReaction;
            delete room.memory.labReactionAmount;
        }

        return OK;
    }

    return ERR_INVALID_TARGET;
};

global.lrs = function() {
    let output = '<table width="300px" border="2px" cellspacing="4px" cellpadding="4px">' +
        '<tr><td align="center">Room</td><td align="center">Reaction</td><td align="center">Amount</td></tr>';

    _.forEach(Shard.myRooms, (room) => {
        const labReaction = room.memory.labReaction;

        output +=
            `<tr><td width="30%" align="center">${linkRoom(room)}</td><td width="40%" align="center">${labReaction} ${resourceImg(labReaction)}</td><td width="40%" align="center">${room.memory.labReactionAmount}</td></tr>`;
    });

    output += '</table>';

    return output;
}

global.addCaravanRoom = function(room) {
    room = room.toUpperCase();

    const rooms = Memory.caravanRooms || [];

    if (!_.includes(rooms, room)) {
        rooms.push(room);

        Memory.caravanRooms = rooms;

        return OK;
    }
};

global.removeCaravanRoom = function(room) {
    room = room.toUpperCase();

    const rooms = Memory.caravanRooms || [];

    if (_.includes(rooms, room)) {
        _.pull(rooms, room);

        Memory.caravanRooms = rooms;

        return OK;
    }
};

global.car = function(resource = 'T0', limit = undefined) {
    if (Resource.isResource(global.getResourceType(resource))) {
        resource = global.getResourceType(resource);
    }

    Memory.caravanResource = resource;
    Memory.caravanLimit = limit;
};

global.cas = function(shard = 'shard3') {
    if (Number.isFinite(shard)) {
        shard = 'shard' + shard;
    }

    if (Game.shard.name === shard) {
        throw new Error(`Same shard`);
    }

    Memory.caravanShard = shard;
};

global.caravan = function(room, resourceType, shard = 3, amount = 1) {
    room = room.toUpperCase();
    resourceType = global.getResourceType(resourceType);

    let from = 'E40S10';

    if (Shard.shard0) {
        if (room === 'E74S21') {
            from = 'E70S20';
        } else {
            from = 'E70S10';
        }
    }

    if (Memory.caravanLimit === 0) {
        delete Memory.caravanLimit;
    }

    return global.cc(room, `caravan-${from}-${resourceType}-shard${shard}`, amount);
}

global.acq = function(shard = 'shard3', resourceType = 'T0', amount = 25000) {
    if (Number.isFinite(shard)) {
        shard = 'shard' + shard;
    }

    if (Game.shard.name === shard) {
        throw new Error(`Same shard`);
    }

    if (!Memory.caravanQueue) {
        Memory.caravanQueue = [];
    }

    if (Memory.caravanEnabled && Memory.caravanLimit > 0 && Memory.caravanShard === shard && Memory.caravanResource === resourceType) {
        Memory.caravanLimit += amount;
        console.log('Expanded a existing caravan request');
        return;
    }

    const existingRequest = Memory.caravanQueue.find(r => r.shard === shard && r.resourceType === resourceType);

    if (existingRequest) {
        existingRequest.amount += amount;
        console.log('Expanded a existing caravan request');
    } else {
        Memory.caravanQueue.push({ shard, resourceType, amount });
        console.log('Added a new caravan request');
    }
}

global.cpu = function(func, ...args) {
    const start = Game.cpu.getUsed();

    func(...args);

    return Game.cpu.getUsed() - start;
};

global.rr = function(roomName, amount, resourceType = RESOURCE_ENERGY, options = {}) {
    if (!roomName || !amount) {
        return ERR_INVALID_ARGS;
    }

    const room = Game.rooms[roomName.toUpperCase()];

    if (!room || !room.terminal) {
        return ERR_NOT_FOUND;
    }

    if (resourceType instanceof Object) {
        options = resourceType;
        resourceType = RESOURCE_ENERGY;
    }

    room.terminal.requireResource(resourceType, amount, options);

    return OK;
}

global.afr = function(roomName, reaction, index = null) {
    const room = roomName.toUpperCase();
    let reactions = Memory.rooms[room].factoryReactions;

    if (!reactions) {
        reactions = Memory.rooms[room].factoryReactions = [];
    }

    if (!reactions.includes(reaction)) {
        if (index === null) {
            return reactions.push(reaction);
        } else {
            reactions.splice(index, 0, reaction);
        }
    }

    return reactions.length;
};

global.rfr = function(roomName, reaction) {
    return _.pull(Memory.rooms[roomName.toUpperCase()].factoryReactions, reaction);
};

//

global.clearMemory = function() {
    _.forEach(Memory.creeps, (memory, name) => {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    });

    console.log('Memory cleared');
}

global.clearRooms = function() {
    const myRooms = Shard.myRooms.length;
    let rooms =  _.sortBy(_.filter(_.keys(Memory.rooms), name => !Game.rooms[name]), name => Memory.rooms[name].updatedAt);

    if (rooms.length > myRooms * 7) {
        const toDelete = _.take(rooms, rooms.length - myRooms * 7);

        _.forEach(toDelete, (name) => {
            delete Memory.rooms[name];
        });

        rooms = _.slice(rooms, toDelete.length);
    }

    let i = 0;

    _.forEach(rooms, (name) => {
        if (i >= myRooms) {
            return false;
        }

        if (Game.time - Memory.rooms[name].updatedAt < 150) {
            return;
        }

        if (Shard.requestObserver(name, 1)) {
            i++;
        }
    });

    console.log('Rooms cleared');
};

//

global.lastMemoryTick = undefined;

function initializeMemory() {
    if (lastMemoryTick && global.LastMemory && Game.time === lastMemoryTick + 1) {
        delete global.Memory;

        global.Memory = global.LastMemory;

        RawMemory._parsed = global.LastMemory;
    } else {
        Memory;

        global.LastMemory = RawMemory._parsed;

        console.log('Memory copied to heap!');
    }

    global.lastMemoryTick = Game.time;
}

function tick() {
    if (global.lastTime) {
        const tick = new Date().getTime() - global.lastTime;

        global.lastTime = new Date().getTime();

        return tick / 1000;
    } else {
        global.lastTime = new Date().getTime();

        return global.TICKS[Game.shard.name];
    }
}

function visualCPU() {
    const visual = new RoomVisual();
    const cpuStyle = {
        align: 'left',
        font: 0.6,
        stroke: '#000000',
        strokeWidth: 0.2,
        backgroundColor: '#5C5E5E',
        backgroundPadding: 0.2,
        opacity: 0.7,
    };
    const bucketStyle = {
        align: 'left',
        font: 0.6,
        stroke: '#000000',
        strokeWidth: 0.2,
        backgroundColor: '#69E83F',
        backgroundPadding: 0.2,
        opacity: 0.7,
    };
    const usage = Math.ceil(Game.cpu.getUsed());
    const bucket = Game.cpu.bucket;

    if (usage >= Game.cpu.limit) {
        cpuStyle.backgroundColor = '#E6A429';
    }

    visual.text('CPU: ' + usage + ' / ' + Game.cpu.limit, 45, 0, cpuStyle);

    if (bucket <= 1500) {
        bucketStyle.backgroundColor = '#E6A429';

        if (Game.time % 20 === 0) {
            let message = 'Bucket on ' + Game.shard.name + ': ' + bucket;

            console.log(message);
        }
    }

    visual.text('Bucket: ' + bucket, 45, 1, bucketStyle);

    //

    if (!Memory.cpu) {
        Memory.cpu = [];
    }

    Memory.cpu.push(usage);

    if (Memory.cpu.length > 15) {
        Memory.cpu.shift();
    }

    const avg = Math.ceil(_.sum(Memory.cpu) / Memory.cpu.length);

    if (avg >= Game.cpu.limit) {
        cpuStyle.backgroundColor = '#E6A429';
    } else {
        cpuStyle.backgroundColor = '#5C5E5E';
    }

    visual.text('Avg: ' + avg, 45, 2, cpuStyle);
}

//

module.exports.loop = function() {

    profiler.wrap(function() {

    if (Game.cpu.bucket >= FULL_BUCKET) {
        if (Memory.pixelEnabled && Game.cpu.generatePixel() === OK) {
            console.log('Generated 1 pixel');
            return;
        }
    } else if (Game.cpu.bucket === 0) {
        console.log('Bucket is empty!');
        return;
    }

    // const start = Game.cpu.getUsed();
    // RESOURCES_ALL.map(resourceType => Game.market.getAllOrders({ resourceType }));
    // console.log(Game.cpu.getUsed()-start);

    // Memory.temp = 0;
    // Memory.temp1 = 0;
    // Memory.temp2 = 0;
    // Memory.temp3 = 0;

    ModuleManager.clear();

    initializeMemory();

    Traveler.clearCreepsCache();
    GlobalCache.initialize();
    Shard.initialize();
    ShardMemory.initialize();
    Market.initialize();

    if (Game.time % 150 === 0) {
        global.clearMemory();
    }

    if (Game.time % 2500 === 0) {
        global.clearRooms();
    }

    _.forEach(Game.rooms, (room) => {
        try {
            room.initialize();
        } catch(e) {
            console.log('Room.prototype.initialize: ' + global.linkRoom(room) + ': ' + e);
        }
    });

    _.forEach(Game.rooms, (room) => {
        try {
            room.runAll();
        } catch(e) {
            console.log('runAll (' + global.linkRoom(room) + '): ' + e);
        }
    });

    // if (Game.time % (Game.shard.name === 'shard3' ? 5 : 10) === 0 && Game.cpu.bucket > 2000) {
    if (Game.time % 10 === 0 && Game.cpu.bucket >= 250) {
        Market.processOrders();
        Market.processTrading2();
        Market.processTrading();
    }

    // if (!Shard.shard3 && Game.time % 30 === 0) {
    //     Shard.runResourcesBalancer();
    // }

    if (Game.time % 50 === 0 && Game.cpu.bucket >= 250) {
        Shard.runResourcesBalancer2();
    }

    if (Game.time % 50 === 0) {
        ShardMemory.memory.bucket = Game.cpu.bucket;
        ShardMemory.refresh();
    }

    // if (Game.time % 25 === 0) {
    //     if (!Memory.market) {
    //         Memory.market = { prices: { [ORDER_BUY]: {}, [ORDER_SELL]: {} } };
    //     }
    //
    //     RESOURCES_ALL.forEach((resourceType) => {
    //         Memory.market.prices[ORDER_BUY][resourceType] = Market.getCurrentPrice({ type: ORDER_BUY, resourceType });
    //         Memory.market.prices[ORDER_SELL][resourceType] = Market.getCurrentPrice({ type: ORDER_SELL, resourceType });
    //     });
    //
    //     console.log('Market prices updated!');
    // }

    // if (Game.shard.name === 'shard3' && Game.time % 150 === 0) {
    //     const shardMemory = ShardMemory.shard3;
    //     const room = Game.rooms.E39S11;
    //     const caravanResources = {};
    //
    //     if (room) {
    //         const storage = room.storage;
    //
    //         if (storage) {
    //             const store = room.store;
    //
    //             if (room.storageUsedCapacity < storage.storeCapacity) {
    //                 RESOURCES_ALL.forEach((resourceType) => {
    //                     caravanResources[resourceType] = (store[resourceType] || 0) < storage.storeCapacity / 10;
    //
    //                     // if (resourceType === RESOURCE_UTRIUM || resourceType === RESOURCE_OXYGEN) {
    //                     if (['H', 'O', 'Z', 'K', 'U', 'L', 'X'].includes(resourceType)) {
    //                         caravanResources[resourceType] = false;
    //                     }
    //                 });
    //             }
    //         }
    //     }
    //
    //     shardMemory.caravanResources = caravanResources;
    //
    //     ShardMemory.refresh();
    //
    //     // console.log('Caravan resources updated: ' + (_.keys(_.reduce(caravanResources, (a, v, k) => (v ? { ...a, [k]: v } : a), {})).join(',')));
    // }

    ShardMemory.update();

    // delete Memory.temp;
    // delete Memory.temp1;
    // delete Memory.temp2;
    // delete Memory.temp3;

    // if (Game.shard.name !== 'shard3') {
        // console.log('temp: ' + Memory.temp);
        // console.log('temp1: ' + Memory.temp1);
    // }

    // console.log('temp1: ' + Memory.temp1);
    // console.log('temp2: ' + Memory.temp2);
    // console.log('temp3: ' + Memory.temp3);

    // console.log('cpu: ' + Memory.temp1);

    // delete Memory.count;
    // delete Memory.sum;
    // delete Memory.max;
    // delete Memory.min;
    // delete Memory.average;
    // delete Memory.last;
    // delete Memory.limitExceeded;
    // delete Memory.testRooms;

    ModuleManager.clear();

    //

    if (Memory.caravanEnabled) {
        if (Memory.caravanLimit <= 0) {
            caravans();
            console.log('Caravans disabled!');
        }
    } else if (Memory.caravanQueue && Memory.caravanQueue.length > 0) {
        const request = Memory.caravanQueue.shift();
        let resourceType = request.resourceType;
        let spawningCreeps = 0;

        if (Resource.isResource(global.getResourceType(resourceType))) {
            resourceType = global.getResourceType(resourceType);
        }

        cas(request.shard);
        car(resourceType, request.amount);
        caravans(1);

        _.forEach(Game.creeps, (creep) => {
            if (creep.spawning && creep.initialRole === 'caravan') {
                if (creep.nameParts.includes(request.shard)) {
                    creep.memory.resourceType = resourceType;
                    spawningCreeps++;
                } else {
                    creep.role = 'recycler';
                }
            }
        });

        if (spawningCreeps > 0) {
            console.log(`${spawningCreeps} spawning creeps affected`);
        }

        console.log(`Started next caravan request for ${request.amount} ${global.resourceImg(resourceType)} to ${request.shard}`);
    }

    if (Memory.powerEnabled > 0) {
        Memory.powerEnabled--;
    } else if (false && Game.time % 250 === 0 && !Shard.shard3 && !Shard.shard1 && !Memory.powerEnabled && usage < Game.cpu.limit) {
        Shard.checkPowerProcess();
    }

    visualCPU();

    //

    });
};
