
let BodyManager, SpawnCreepMemoryManager;

function SpawnManager() {
}

//

SpawnManager.CREEPS_MAX = {};

// SHARD 0

SpawnManager.CREEPS_MAX.E68S9 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E67S9': 0,
    'warrior-E69S9': 0,
    'reserver-E67S9': 0,
    'reserver-E69S9': 0,
    'miner-E67S9-0': 0,
    'miner-E69S9-0': 0,
    'carrier-E67S9': 0,
    'carrier-E69S9': 0,
};


SpawnManager.CREEPS_MAX.E68S8 = {
    'carrier': 1,
    'miner-0': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E67S7': 0,
    'warrior-E67S8': 0,
    'warrior-E69S8': 0,
    'reserver-E67S7': 0,
    'reserver-E67S8': 0,
    'reserver-E69S8': 0,

    'miner-E67S8-0': 0,
    'miner-E67S7-0': 0,
    'miner-E69S8-0': 0,
    'miner-E69S8-1': 0,

    'carrier-E67S8': 0,
    'carrier-E67S7-E67S8': 0,
    'carrier-E69S8': 0,
};


SpawnManager.CREEPS_MAX.E67S14 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E66S13': 0,
    'warrior-E68S13': 0,

    'reserver-E66S13': 0,
    'reserver-E67S13': 0,
    'reserver-E68S13': 0,

    'miner-E66S13-0': 0,
    'miner-E67S13-0': 0,
    'miner-E66S13-1': 0,
    'miner-E67S13-1': 0,
    'miner-E68S13-0': 0,

    'carrier-E66S13-E67S13': 0,
    'carrier-E67S13': 0,
    'carrier-E68S13': 0,

    // 'warriorMineral-E65S14-4': 0,
    // 'warriorMineral-E66S15-2': 0,
    // 'warriorMineral-E66S14-1': 0,
    //
    // 'minerMineral-E65S15': 0,
    // 'minerMineral-E65S14': 0,
    // 'minerMineral-E66S15': 0,
    // 'minerMineral-E66S14': 0,
    //
    // 'carrierMineral-E65S15': 0,
    // 'carrierMineral-E65S14': 0,
    // 'carrierMineral-E66S15': 0,
    // 'carrierMineral-E66S14': 0,
};


SpawnManager.CREEPS_MAX.E64S13 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E65S13': 0,
    'warrior-E65S12': 0,

    'reserver-E65S11': 0,
    'reserver-E65S12': 0,
    'reserver-E64S12': 0,
    'reserver-E65S13': 0,

    'miner-E65S11-0': 0,
    'miner-E65S12-0': 0,
    'miner-E64S12-0': 0,
    'miner-E65S13-0': 0,

    'miner-E65S12-1': 0,
    'miner-E64S12-1': 0,
    'miner-E65S13-1': 0,

    'carrier-E65S12': 0,
    'carrier-E65S11-E65S12': 0,
    'carrier-E64S12': 0,
    'carrier-E65S13': 1,

    // 'warriorMineral-E64S14-3': 0,
    // 'minerMineral-E64S14': 0,
    // 'carrierMineral-E64S14': 0,
};


SpawnManager.CREEPS_MAX.E74S21 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E76S21': 0,
    'warrior-E73S21': 0,

    'reserver-E76S21': 0,
    'reserver-E75S22': 0,
    'reserver-E73S21': 0,
    'reserver-E75S21': 0,

    'miner-E76S21-0': 0,
    'miner-E75S22-0': 0,
    'miner-E73S21-0': 0,
    'miner-E75S21-0': 0,

    'miner-E76S21-1': 0,
    'miner-E75S22-1': 0,
    'miner-E73S21-1': 0,
    'miner-E75S21-1': 0,

    'carrier-E75S21': 4,
    'carrier-E76S21-E75S21': 0,
    'carrier-E75S22-E75S21': 0,
    'carrier-E73S21': 0,
};


// SHARD 1

SpawnManager.CREEPS_MAX.E42S9 = {
    'carrier': 2,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E43S8': 0,
    'warrior-E41S9': 0,
    'warrior-E42S8': 0,

    'reserver-E43S8': 0,
    'reserver-E41S9': 0,
    'reserver-E42S8': 0,

    'miner-E43S8-0': 0,
    'miner-E41S9-0': 0,
    'miner-E42S8-0': 0,

    'miner-E43S8-1': 0,

    'carrier-E43S8': 3,
    'carrier-E41S9': 0,
    'carrier-E42S8': 0,
};


SpawnManager.CREEPS_MAX.E39S6 = {
    'carrier': 1,
    'miner-0': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E38S7': 0,
    'warrior-E39S5': 0,
    'warrior-E39S7': 0,
    'warrior-E38S6': 0,

    'reserver-E38S7': 0,
    'reserver-E39S5': 0,
    'reserver-E39S4': 0,
    'reserver-E39S7': 0,
    'reserver-E38S6': 0,

    'miner-E38S7-0': 0,
    'miner-E39S4-0': 0,
    'miner-E39S5-0': 0,
    'miner-E39S7-0': 0,
    'miner-E38S6-0': 0,

    'miner-E38S7-1': 0,
    'miner-E39S4-1': 0,

    'carrier-E38S7': 0,
    'carrier-E39S5': 2,
    'carrier-E39S7': 0,
    'carrier-E39S4-E39S5': 0,
    'carrier-E38S6': 1,
};


SpawnManager.CREEPS_MAX.E38S12 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E39S13': 0,
    'warrior-E39S12': 0,
    'warrior-E39S11': 0,

    'reserver-E39S13': 0,
    'reserver-E39S12': 0,
    'reserver-E39S11': 0,

    'miner-E39S13-0': 0,
    'miner-E39S12-0': 0,
    'miner-E39S11-0': 0,

    'miner-E39S13-1': 0,
    'miner-E39S12-1': 0,
    'miner-E39S11-1': 0,

    'carrier-E39S12': 0,
    'carrier-E39S13-E39S12': 0,
    'carrier-E39S11-E39S12': 0,
};


SpawnManager.CREEPS_MAX.E37S4 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E36S3': 0,
    'warrior-E38S3': 0,
    'warrior-E37S5': 0,
    'warrior-E37S3': 0,
    'warrior-E38S4': 0,

    'reserver-E36S3': 0,
    'reserver-E38S3': 0,
    'reserver-E37S5': 0,
    'reserver-E37S3': 0,
    'reserver-E38S4': 0,

    'miner-E36S3-0': 0,
    'miner-E38S3-0': 0,
    'miner-E37S5-0': 0,
    'miner-E37S3-0': 0,
    'miner-E38S4-0': 0,

    'miner-E36S3-1': 0,
    'miner-E38S3-1': 0,
    'miner-E37S3-1': 0,

    'carrier-E36S3': 0,
    'carrier-E38S3': 0,
    'carrier-E37S5': 0,
    'carrier-E37S3': 0,
    'carrier-E38S4': 0,

    'warriorMineral-E36S5-2': 0,
    'warriorMineral-E35S4-4': 0,
    'warriorMineral-E36S4-1': 0,

    'minerMineral-E36S5': 0,
    'minerMineral-E35S4': 0,
    'minerMineral-E36S4': 0,
    'minerMineral-E35S5': 0,

    'carrierMineral-E36S5': 0,
    'carrierMineral-E35S4': 0,
    'carrierMineral-E36S4': 0,
    'carrierMineral-E35S5': 0,
};


SpawnManager.CREEPS_MAX.E39S9 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E38S8': 0,
    'warrior-E39S8': 0,

    'reserver-E38S8': 0,
    'reserver-E39S8': 0,

    'miner-E38S8-0': 0,
    'miner-E39S8-0': 0,

    'miner-E39S8-1': 0,

    'carrier-E38S8': 0,
    'carrier-E39S8': 0,
};


SpawnManager.CREEPS_MAX.E44S3 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E45S2': 0,
    'warrior-E44S2': 0,
    'warrior-E45S3': 0,

    'reserver-E45S2': 0,
    'reserver-E44S2': 0,
    'reserver-E45S3': 0,

    'miner-E45S2-0': 0,
    'miner-E44S2-0': 0,
    'miner-E45S3-0': 0,

    'miner-E45S2-1': 0,

    'carrier-E45S2': 0,
    'carrier-E44S2': 0,
    'carrier-E45S3': 0,

    'warriorMineral-E44S5-2': 0,
    'warriorMineral-E44S4-3': 0,
    'warriorMineral-E45S4-3': 0,

    'minerMineral-E44S5': 0,
    'minerMineral-E44S4': 0,
    'minerMineral-E45S4': 0,
    'minerMineral-E45S5': 0,

    'carrierMineral-E44S5': 0,
    'carrierMineral-E44S4': 0,
    'carrierMineral-E45S4': 0,
    'carrierMineral-E45S5': 0,
};


SpawnManager.CREEPS_MAX.E47S8 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E47S7': 0,
    'warrior-E46S8': 0,
    'warrior-E47S9': 0,

    'reserver-E47S7': 0,
    'reserver-E46S8': 0,
    'reserver-E47S9': 0,

    'miner-E47S7-0': 0,
    'miner-E46S8-0': 0,
    'miner-E47S9-0': 0,

    'miner-E47S7-1': 0,
    'miner-E46S8-1': 0,
    'miner-E47S9-1': 0,

    'carrier-E47S7': 0,
    'carrier-E46S8': 0,
    'carrier-E47S9': 0,
};


SpawnManager.CREEPS_MAX.E45S9 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E45S8': 0,
    'warrior-E46S9': 0,

    'reserver-E45S8': 0,
    'reserver-E46S9': 0,

    'miner-E45S8-0': 0,
    'miner-E46S9-0': 0,

    'miner-E45S8-1': 0,

    'carrier-E45S8': 0,
    'carrier-E46S9': 0,
};


SpawnManager.CREEPS_MAX.E38S14 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    // 'carrierBoost': 1, // TODO
    'upgrader': 1,
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E37S13': 0,
    'warrior-E37S14': 0,
    'warrior-E38S15': 0,
    'warrior-E39S14': 0,
    'warrior-E38S13': 0,

    'reserver-E37S13': 0,
    'reserver-E37S14': 0,
    'reserver-E38S15': 0,
    'reserver-E39S14': 0,
    'reserver-E38S13': 0,

    'miner-E37S13-0': 0,
    'miner-E37S14-0': 0,
    'miner-E38S15-0': 0,
    'miner-E39S14-0': 0,
    'miner-E38S13-0': 0,

    'miner-E37S13-1': 0,
    'miner-E38S15-1': 0,

    'carrier-E37S13': 0,
    'carrier-E37S14': 0,
    'carrier-E38S15': 0,
    'carrier-E39S14': 0,
    'carrier-E38S13': 0,
};


SpawnManager.CREEPS_MAX.E37S16 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    // 'carrierBoost': 1, // TODO
    'upgrader': 1,
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E38S16': 0,
    'warrior-E37S15': 0,

    'reserver-E38S16': 0,
    'reserver-E37S15': 0,

    'miner-E38S16-0': 0,
    'miner-E37S15-0': 0,

    'carrier-E38S16': 0,
    'carrier-E37S15': 0,

    'warriorMineral-E36S15-2': 0,
    'warriorMineral-E36S16-2': 0,

    'minerMineral-E36S15': 0,
    'minerMineral-E36S16': 0,

    'carrierMineral-E36S15': 0,
    'carrierMineral-E36S16': 0,
};


SpawnManager.CREEPS_MAX.E44S17 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E45S18': 0,
    'warrior-E46S17': 0,
    'warrior-E45S17': 0,

    'reserver-E45S18': 0,
    'reserver-E46S17': 0,
    'reserver-E45S17': 0,

    'miner-E45S18-0': 0,
    'miner-E46S17-0': 0,
    'miner-E45S17-0': 0,

    'miner-E45S18-1': 0,
    'miner-E46S17-1': 0,

    'carrier-E45S18': 0,
    'carrier-E46S17': 0,
    'carrier-E45S17': 0,

    'warriorMineral-E44S15-2': 0,
    'warriorMineral-E45S16-2': 0,
    'warriorMineral-E44S16-1': 0,

    'minerMineral-E44S15': 0,
    'minerMineral-E45S16': 0,
    'minerMineral-E44S16': 0,

    'carrierMineral-E44S15': 0,
    'carrierMineral-E45S16': 0,
    'carrierMineral-E44S16': 0,
};


SpawnManager.CREEPS_MAX.E27S9 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO:
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E26S8': 0,
    'warrior-E26S9': 0,
    'warrior-E27S8': 0,
    'warrior-E28S9': 0,

    'reserver-E26S8': 0,
    'reserver-E26S9': 0,
    'reserver-E27S8': 0,
    'reserver-E28S9': 0,

    'miner-E26S8-0': 0,
    'miner-E26S9-0': 0,
    'miner-E27S8-0': 0,
    'miner-E28S9-0': 0,

    'miner-E26S9-1': 0,
    'miner-E27S8-1': 0,

    'carrier-E26S8': 0,
    'carrier-E26S9': 0,
    'carrier-E27S8': 0,
    'carrier-E28S9': 0,
};


SpawnManager.CREEPS_MAX.E23S5 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO:
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E22S5': 0,
    'warrior-E23S6': 0,

    'reserver-E22S5': 0,
    'reserver-E23S6': 0,

    'miner-E22S5-0': 0,
    'miner-E23S6-0': 0,

    'carrier-E22S5': 0,
    'carrier-E23S6': 0,

    'warriorMineral-E24S6-2': 0,
    'warriorMineral-E24S5-2': 0,

    'minerMineral-E24S6': 0,
    'minerMineral-E24S5': 0,
    'minerMineral-E25S5': 0,

    'carrierMineral-E24S6': 0,
    'carrierMineral-E24S5': 0,
    'carrierMineral-E25S5': 0,
};


SpawnManager.CREEPS_MAX.E24S3 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO:
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E23S4': 0,
    'warrior-E23S3': 0,
    'warrior-E25S3': 0,

    'reserver-E23S4': 0,
    'reserver-E23S3': 0,
    'reserver-E25S3': 0,

    'miner-E23S4-0': 0,
    'miner-E23S3-0': 0,
    'miner-E25S3-0': 0,

    'miner-E23S3-1': 0,
    'miner-E25S3-1': 0,

    'carrier-E23S4': 0,
    'carrier-E23S3': 0,
    'carrier-E25S3': 1,

    'warriorMineral-E25S4-1': 0,
    'warriorMineral-E24S4-4': 0,

    'minerMineral-E25S4': 0,
    'minerMineral-E24S4': 0,

    'carrierMineral-E25S4': 0,
    'carrierMineral-E24S4': 0,
};


// SHARD 2

SpawnManager.CREEPS_MAX.E38S9 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    // 'carrierBoost': 1, // TODO
    'upgrader': 1,
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E39S9': 0,
    'warrior-E39S8': 0,
    'warrior-E37S8': 0,
    'warrior-E38S8': 0,

    'reserver-E39S9': 0,
    'reserver-E39S8': 0,
    'reserver-E37S8': 0,
    'reserver-E38S8': 0,

    'miner-E39S9-0': 0,
    'miner-E39S8-0': 0,
    'miner-E37S8-0': 0,
    'miner-E38S8-0': 0,

    'miner-E37S8-1': 0,

    'carrier-E39S9': 0,
    'carrier-E39S8': 0,
    'carrier-E37S8': 0,
    'carrier-E38S8': 0,
};


SpawnManager.CREEPS_MAX.E42S11 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E43S12': 0,
    'warrior-E43S11': 0,

    'reserver-E43S12': 0,
    'reserver-E43S11': 0,

    'miner-E43S12-0': 0,
    'miner-E43S11-0': 0,

    'miner-E43S11-1': 0,

    'carrier-E43S11': 0,
    'carrier-E43S12-E43S11': 0,
};


SpawnManager.CREEPS_MAX.E47S14 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E48S13': 0,
    'warrior-E47S13': 0,
    'warrior-E48S14': 0,

    'reserver-E48S13': 0,
    'reserver-E47S13': 0,
    'reserver-E48S14': 0,

    'miner-E48S13-0': 0,
    'miner-E47S13-0': 0,
    'miner-E48S14-0': 0,

    'miner-E48S13-1': 0,
    'miner-E48S14-1': 0,

    'carrier-E48S13': 0,
    'carrier-E47S13': 0,
    'carrier-E48S14': 0,

    'warriorMineral-E46S14-1': 0,
    'warriorMineral-E46S15-3': 0,
    'warriorMineral-E46S16-1': 0,

    'minerMineral-E46S14': 0,
    'minerMineral-E46S15': 0,
    'minerMineral-E46S16': 0,
    'minerMineral-E45S15': 0,

    'carrierMineral-E46S14': 0,
    'carrierMineral-E46S15': 0,
    'carrierMineral-E46S16': 0,
    'carrierMineral-E45S15': 0,
};


SpawnManager.CREEPS_MAX.E37S5 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E38S4': 0,
    'warrior-E37S4': 0,
    'warrior-E38S5': 0,

    'reserver-E38S4': 0,
    'reserver-E37S4': 0,
    'reserver-E38S5': 0,

    'miner-E38S4-0': 0,
    'miner-E37S4-0': 0,
    'miner-E38S5-0': 0,

    'miner-E38S4-1': 0,
    'miner-E38S5-1': 0,

    'carrier-E37S4': 0,
    'carrier-E38S4-E37S4': 1,
    'carrier-E38S5': 1,

    'warriorMineral-E36S6-1': 0,
    'warriorMineral-E36S5-2': 0,

    'minerMineral-E35S5': 0,
    'minerMineral-E36S6': 0,
    'minerMineral-E36S5': 0,

    'carrierMineral-E35S5': 0,
    'carrierMineral-E36S6': 0,
    'carrierMineral-E36S5': 0,
};


SpawnManager.CREEPS_MAX.E48S9 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E47S8': 0,
    'warrior-E47S9': 0,
    'warrior-E48S8': 0,

    'reserver-E47S8': 0,
    'reserver-E47S9': 0,
    'reserver-E48S8': 0,

    'miner-E47S8-0': 0,
    'miner-E47S9-0': 0,
    'miner-E48S8-0': 0,

    'miner-E47S8-1': 0,
    'miner-E48S8-1': 0,

    'carrier-E47S8': 0,
    'carrier-E47S9': 0,
    'carrier-E48S8': 1,
};


SpawnManager.CREEPS_MAX.E49S16 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E48S16': 0,
    'warrior-E49S17': 0,

    'reserver-E48S16': 0,
    'reserver-E49S15': 0,
    'reserver-E49S17': 0,

    'miner-E48S16-0': 0,
    'miner-E49S15-0': 0,
    'miner-E49S17-0': 0,

    'miner-E48S16-1': 0,
    'miner-E49S15-1': 0,
    'miner-E49S17-1': 0,

    'carrier-E48S16': 0,
    'carrier-E49S15': 0,
    'carrier-E49S17': 1,
};


SpawnManager.CREEPS_MAX.E35S8 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E34S8': 0,
    'warrior-E36S8': 0,
    'warrior-E35S7': 0,
    'warrior-E35S9': 0,

    'reserver-E34S8': 0,
    'reserver-E36S8': 0,
    'reserver-E35S7': 0,
    'reserver-E35S9': 0,

    'miner-E34S8-0': 0,
    'miner-E36S8-0': 0,
    'miner-E35S7-0': 0,
    'miner-E35S9-0': 0,

    'miner-E34S8-1': 0,
    'miner-E35S7-1': 0,

    'carrier-E34S8': 0,
    'carrier-E36S8': 0,
    'carrier-E35S7': 1,
    'carrier-E35S9': 0,

    'warriorMineral-E35S6-1': 0,
    'minerMineral-E35S6': 0,
    'carrierMineral-E35S6': 0,
};


SpawnManager.CREEPS_MAX.E42S13 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E43S13': 0,

    'reserver-E43S13': 0,
    'reserver-E42S12': 0,

    'miner-E43S13-0': 0,
    'miner-E42S12-0': 0,

    'miner-E42S12-1': 0,

    'carrier-E43S13': 0,
    'carrier-E42S12': 1,

    'warriorMineral-E44S14-1': 0,
    'minerMineral-E44S14': 0,
    'carrierMineral-E44S14': 0,
};


SpawnManager.CREEPS_MAX.E47S11 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E47S12': 0,
    'warrior-E46S11': 0,

    'reserver-E47S12': 0,
    'reserver-E46S11': 0,

    'miner-E47S12-0': 0,
    'miner-E46S11-0': 0,

    'carrier-E47S12': 0,
    'carrier-E46S11': 0,
};


SpawnManager.CREEPS_MAX.E35S3 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'minerMineral': 0,
    'carrierMineral': 0,
    'remoteRepairer': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E37S3': 0,
    'warrior-E36S2': 0,
    'warrior-E36S3': 0,
    'warrior-E35S2': 0,

    'reserver-E37S3': 0,
    'reserver-E36S2': 0,
    'reserver-E36S3': 0,
    'reserver-E35S2': 0,

    'miner-E37S3-0': 0,
    'miner-E36S2-0': 0,
    'miner-E36S3-0': 0,
    'miner-E35S2-0': 0,

    'miner-E37S3-1': 0,
    'miner-E36S2-1': 0,

    'carrier-E37S3': 0,
    'carrier-E36S2': 1,
    'carrier-E36S3': 0,
    'carrier-E35S2': 0,

    'warriorMineral-E36S4-1': 0,
    'warriorMineral-E35S4-4': 0,

    'minerMineral-E36S4': 0,
    'minerMineral-E35S4': 0,

    'carrierMineral-E36S4': 0,
    'carrierMineral-E35S4': 0,
};


SpawnManager.CREEPS_MAX.E45S18 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E44S19': 0,
    'warrior-E45S19': 0,
    'warrior-E46S18': 0,
    'warrior-E44S18': 0,

    'reserver-E44S19': 0,
    'reserver-E45S19': 0,
    'reserver-E46S18': 0,
    'reserver-E44S18': 0,

    'miner-E44S19-0': 0,
    'miner-E45S19-0': 0,
    'miner-E46S18-0': 0,
    'miner-E44S18-0': 0,

    'miner-E44S19-1': 0,
    'miner-E46S18-1': 0,
    'miner-E44S18-1': 0,

    'carrier-E45S19': 0,
    'carrier-E44S19-E45S19': 0,
    'carrier-E46S18': 0,
    'carrier-E44S18': 1,

    'warriorMineral-E45S16-3': 0,
    'warriorMineral-E44S16-4': 0,

    'minerMineral-E45S16': 0,
    'minerMineral-E44S16': 0,

    'carrierMineral-E45S16': 0,
    'carrierMineral-E44S16': 0,
};


SpawnManager.CREEPS_MAX.E42S15 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    // 'carrierBoost': 1, // TODO
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E41S14': 0,
    'warrior-E41S16': 0,
    'warrior-E41S15': 0,
    'warrior-E42S16': 0,

    'reserver-E41S14': 0,
    'reserver-E41S16': 0,
    'reserver-E41S15': 0,
    'reserver-E42S16': 0,
    'reserver-E42S14': 0,

    'miner-E41S14-0': 0,
    'miner-E41S16-0': 0,
    'miner-E41S15-0': 0,
    'miner-E42S16-0': 0,
    'miner-E42S14-0': 0,

    'miner-E41S14-1': 0,
    'miner-E41S16-1': 0,
    'miner-E41S15-1': 0,
    'miner-E42S16-1': 0,

    'carrier-E41S14': 0,
    'carrier-E41S15': 0,
    'carrier-E42S16': 3,
    'carrier-E41S16-E42S16': 0,
    'carrier-E42S14': 0,
};


SpawnManager.CREEPS_MAX.E32S5 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'remoteRepairer': 0,
    // 'carrierBoost': 1, // TODO
    'upgrader': 1,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E33S6': 0,
    'warrior-E32S4': 0,
    'warrior-E32S6': 0,
    'warrior-E33S5': 0,

    'reserver-E33S6': 0,
    'reserver-E32S4': 0,
    'reserver-E32S6': 0,
    'reserver-E33S5': 0,

    'miner-E33S6-0': 0,
    'miner-E32S4-0': 0,
    'miner-E32S6-0': 0,
    'miner-E33S5-0': 0,

    'miner-E33S6-1': 0,
    'miner-E32S4-1': 0,

    'carrier-E33S6': 0,
    'carrier-E32S4': 0,
    'carrier-E32S6': 0,
    'carrier-E33S5': 0,

    'warriorMineral-E34S6-2': 0,
    'warriorMineral-E34S5-3': 0,
    'warriorMineral-E34S4-3': 0,

    'minerMineral-E34S6': 0,
    'minerMineral-E34S5': 0,
    'minerMineral-E34S4': 0,

    'carrierMineral-E34S6': 0,
    'carrierMineral-E34S5': 0,
    'carrierMineral-E34S4': 0,
};

// SHARD 3

SpawnManager.CREEPS_MAX.E39S11 = {
    'carrier': 1,
    'miner-0': 1,
    'miner-1': 1,
    'upgrader': 1,
    'remoteRepairer': 0,
    'minerMineral': 0,
    'carrierMineral': 0,
    'central': 1,

    'ramparter': -1,
    'carrierLab': -1,

    'warrior-E39S12': 0,
    'warrior-E38S12': 0,
    'warrior-E38S11': 0,

    'reserver-E39S12': 0,
    'reserver-E38S12': 0,
    'reserver-E38S11': 0,

    'miner-E39S12-0': 0,
    'miner-E38S12-0': 0,
    'miner-E38S11-0': 0,

    'miner-E38S12-1': 0,

    'carrier-E39S12': 0,
    'carrier-E38S12': 0,
    'carrier-E38S11': 0,
};

//

SpawnManager.MIN_TICKS_TO_LIVE = {};

SpawnManager.MIN_TICKS_TO_LIVE['E68S9'] = {
    'minerMineral': 170,

    'miner-E67S9-0': 100,
    'miner-E69S9-0': 140,

    'carrier-E67S9': 90,
    'carrier-E69S9': 110,
};

SpawnManager.MIN_TICKS_TO_LIVE['E68S8'] = {
    'minerMineral': 170,

    'miner-E68S8': 65,
    'miner-E69S8-1': 120,
    'miner-E67S7-0': 190,

    'carrier-E67S8': 90,
    'carrier-E67S7-E67S8': 130,
};

SpawnManager.MIN_TICKS_TO_LIVE['E67S14'] = {
    'upgrader': 125,
    'minerMineral': 180,

    'miner-E66S13-0': 140,
    'miner-E66S13-1': 140,
    'miner-E67S13-0': 105,
    'miner-E67S13-1': 105,
    'miner-E68S13-0': 140,
    'carrier-E66S13-E67S13': 220,
    'carrier-E67S13': 120,
    'carrier-E68S13': 130,

    'warriorMineral-E66S14-1': 200,
    'minerMineral-E66S14': 200,
    'carrierMineral-E66S14': 130,

    'warriorMineral-E65S14-4': 250,
    'minerMineral-E65S14': 250,
    'carrierMineral-E65S14': 180,

    'warriorMineral-E66S15-2': 250,
    'minerMineral-E66S15': 250,
    'carrierMineral-E66S15': 180,

    'minerMineral-E65S15': 250,
    'carrierMineral-E65S15': 180,
};

SpawnManager.MIN_TICKS_TO_LIVE['E64S13'] = {
    'minerMineral': 200,

    'miner-E65S13-0': 130,
    'miner-E65S13-1': 130,
    'carrier-E65S13': 140,

    'miner-E65S12-0': 140,
    'miner-E65S12-1': 120,
    'carrier-E65S12': 210,

    'miner-E64S12-0': 170,
    'miner-E64S12-1': 150,
    'carrier-E64S12': 190,

    'miner-E65S11-0': 200,
    'carrier-E65S11-E65S12': 230,

    'warriorMineral-E64S14-3': 200,
    'minerMineral-E64S14': 200,
    'carrierMineral-E64S14': 100,
};

SpawnManager.MIN_TICKS_TO_LIVE['E74S21'] = {
    'minerMineral': 170,

    'miner-E73S21-0': 135,
    'miner-E73S21-1': 135,
    'carrier-E73S21': 185,

    'miner-E75S21-0': 105,
    'miner-E75S21-1': 115,
    'carrier-E75S21': 175,

    'miner-E75S22-0': 150,
    'miner-E75S22-1': 150,
    'carrier-E75S22-E75S21': 200,

    'miner-E76S21-0': 155,
    'miner-E76S21-1': 165,
    'carrier-E76S21-E75S21': 220,
};


// SHARD 1

SpawnManager.MIN_TICKS_TO_LIVE['E42S9'] = {
    'minerMineral': 220,

    'miner-E41S9-0': 100,
    'carrier-E41S9': 120,

    'miner-E42S8-0': 100,
    'carrier-E42S8': 120,

    'miner-E43S8-0': 130,
    'miner-E43S8-1': 130,
    'carrier-E43S8': 160,
};

SpawnManager.MIN_TICKS_TO_LIVE['E39S6'] = {
    'minerMineral': 220,

    'miner-E39S4-0': 200,
    'miner-E39S4-1': 200,
    'carrier-E39S4-E39S5': 250,

    'miner-E39S5-0': 100,
    'carrier-E39S5': 130,

    'miner-E39S7-0': 110,
    'carrier-E39S7': 140,

    'miner-E38S7-0': 120,
    'miner-E38S7-1': 120,
    'carrier-E38S7': 160,

    'miner-E38S6-0': 100,
    'carrier-E38S6': 120,
};

SpawnManager.MIN_TICKS_TO_LIVE['E38S12'] = {
    'miner-E39S11-0': 140,
    'miner-E39S11-1': 140,
    'carrier-E39S11-E39S12': 220,

    'miner-E39S12-0': 100,
    'miner-E39S12-1': 100,
    'carrier-E39S12': 200,

    'miner-E39S13-0': 170,
    'miner-E39S13-1': 170,
    'carrier-E39S13-E39S12': 250,
};

SpawnManager.MIN_TICKS_TO_LIVE['E37S4'] = {
    'minerMineral': 220,

    'miner-E36S3-0': 120,
    'miner-E36S3-1': 120,
    'carrier-E36S3': 200,

    'miner-E37S3-0': 85,
    'miner-E37S3-1': 70,
    'carrier-E37S3': 160,

    'miner-E38S3-0': 95,
    'miner-E38S3-1': 95,
    'carrier-E38S3': 190,

    'miner-E37S5-0': 110,
    'carrier-E37S5': 120,

    'miner-E38S4-0': 70,
    'carrier-E38S4': 120,

    'warriorMineral-E35S4-4': 250,
    'minerMineral-E35S4': 250,
    'carrierMineral-E35S4': 180,

    'warriorMineral-E36S4-1': 220,
    'minerMineral-E36S4': 220,
    'carrierMineral-E36S4': 150,

    'warriorMineral-E36S5-2': 250,
    'minerMineral-E36S5': 250,
    'carrierMineral-E36S5': 180,

    'minerMineral-E35S5': 250,
    'carrierMineral-E35S5': 180,
};

SpawnManager.MIN_TICKS_TO_LIVE['E39S9'] = {
    'miner-E39S8-0': 80,
    'miner-E39S8-1': 80,
    'carrier-E39S8': 130,

    'miner-E38S8-0': 90,
    'carrier-E38S8': 140,
};

SpawnManager.MIN_TICKS_TO_LIVE['E44S3'] = {
    'minerMineral': 200,

    'miner-E45S2-0': 130,
    'miner-E45S2-1': 130,
    'carrier-E45S2': 160,

    'miner-E44S2-0': 80,
    'carrier-E44S2': 110,

    'miner-E45S3-0': 70,
    'carrier-E45S3': 90,

    'warriorMineral-E44S5-2': 300,
    'minerMineral-E44S5': 300,
    'minerMineral-E45S5': 300,
    'carrierMineral-E44S5': 300,
    'carrierMineral-E45S5': 300,

    'warriorMineral-E44S4-3': 250,
    'warriorMineral-E45S4-3': 250,
    'minerMineral-E44S4': 250,
    'minerMineral-E45S4': 250,
    'carrierMineral-E44S4': 250,
    'carrierMineral-E45S4': 250,
};

SpawnManager.MIN_TICKS_TO_LIVE['E47S8'] = {
    'minerMineral': 180,

    'miner-E47S7-0': 90,
    'miner-E47S7-1': 90,
    'carrier-E47S7': 180,

    'miner-E47S9-0': 70,
    'miner-E47S9-1': 70,
    'carrier-E47S9': 120,

    'miner-E46S8-0': 70,
    'miner-E46S8-1': 70,
    'carrier-E46S8': 120,

    'upgrader-E45S9': 450,
};

SpawnManager.MIN_TICKS_TO_LIVE['E45S9'] = {
    'minerMineral': 180,

    'miner-E45S8-0': 110,
    'miner-E46S9-0': 70,

    'miner-E45S8-1': 100,

    'carrier-E45S8': 140,
    'carrier-E46S9': 50,
};

SpawnManager.MIN_TICKS_TO_LIVE['E38S14'] = {
    'minerMineral': 170,

    'miner-E37S13-0': 100,
    'miner-E37S14-0': 70,
    'miner-E38S15-0': 100,
    'miner-E39S14-0': 70,
    'miner-E38S13-0': 60,

    'miner-E37S13-1': 80,
    'miner-E38S15-1': 100,

    'carrier-E37S13': 160,
    'carrier-E37S14': 100,
    'carrier-E38S15': 190,
    'carrier-E39S14': 130,
    'carrier-E38S13': 70,
};

SpawnManager.MIN_TICKS_TO_LIVE['E37S16'] = {
    'minerMineral': 180,

    'miner-E38S16-0': 100,
    'miner-E37S15-0': 80,

    'carrier-E38S16': 110,

    'warriorMineral-E36S15-2': 200,
    'warriorMineral-E36S16-2': 180,

    'minerMineral-E36S15': 200,
    'minerMineral-E36S16': 180,

    'carrierMineral-E36S15': 200,
    'carrierMineral-E36S16': 180,
};

SpawnManager.MIN_TICKS_TO_LIVE['E44S17'] = {
    'minerMineral': 180,

    'miner-E45S18-0': 100,
    'miner-E46S17-0': 110,
    'miner-E45S17-0': 85,

    'miner-E45S18-1': 110,
    'miner-E46S17-1': 100,

    'carrier-E45S18': 130,
    'carrier-E46S17': 120,
    'carrier-E45S17': 100,

    'warrirMineral-E44S15-2': 300,
    'minerMineral-E44S15': 300,
    'carrierMineral-E44S15': 280,

    'warriorMineral-E45S16-2': 225,
    'minerMineral-E45S16': 225,
    'carrierMineral-E45S16': 200,

    'warriorMineral-E44S16-1': 180,
    'minerMineral-E44S16': 180,
    'carrierMineral-E44S16': 150,
};

SpawnManager.MIN_TICKS_TO_LIVE['E27S9'] = {
    'minerMineral': 180,

    'miner-E26S8-0': 60,
    'miner-E26S9-0': 60,
    'miner-E27S8-0': 60,
    'miner-E28S9-0': 60,

    'miner-E26S9-1': 60,
    'miner-E27S8-1': 60,

    'carrier-E26S8': 90,
    'carrier-E26S9': 90,
    'carrier-E27S8': 90,
    'carrier-E28S9': 90,
};

SpawnManager.MIN_TICKS_TO_LIVE['E23S5'] = {
    'minerMineral': 180,

    'miner-E22S5-0': 70,
    'miner-E23S6-0': 70,

    'carrier-E22S5': 80,
    'carrier-E23S6': 80,

    'warriorMineral-E24S6-2': 250,
    'warriorMineral-E24S5-2': 210,

    'minerMineral-E24S6': 250,
    'minerMineral-E24S5': 210,
    'minerMineral-E25S5': 260,

    'carrierMineral-E24S6': 250,
    'carrierMineral-E24S5': 210,
    'carrierMineral-E25S5': 260,
};

SpawnManager.MIN_TICKS_TO_LIVE['E24S3'] = {
    'minerMineral': 180,

    'miner-E23S4-0': 70,
    'miner-E23S3-0': 70,
    'miner-E25S3-0': 70,

    'miner-E23S3-1': 70,
    'miner-E25S3-1': 70,

    'carrier-E23S4': 90,
    'carrier-E23S3': 100,
    'carrier-E25S3': 120,

    'warriorMineral-E25S4-1': 210,
    'warriorMineral-E24S4-4': 210,

    'minerMineral-E25S4': 210,
    'minerMineral-E24S4': 210,

    'carrierMineral-E25S4': 210,
    'carrierMineral-E24S4': 210,
};


// SHARD 2

SpawnManager.MIN_TICKS_TO_LIVE['E38S9'] = {
    'miner-E37S8-0': 100,
    'miner-E39S9-0': 100,
    'miner-E39S8-0': 100,
    'miner-E38S8-0': 100,
    'miner-E37S8-1': 100,

    'carrier-E37S8': 100,
    'carrier-E39S9': 100,
    'carrier-E39S8': 100,

    'builder-E375': 350,
    'upgrader-E375': 650,

    'miner-E35S8-0': 250,
    'miner-E35S8-1': 250,
};

SpawnManager.MIN_TICKS_TO_LIVE['E42S11'] = {
    'miner-E43S12-0': 95,
    'miner-E43S11-0': 80,
    'miner-E43S11-1': 80,

    'carrier-E43S11': 120,
    'carrier-E43S12-E43S11': 85,
};

SpawnManager.MIN_TICKS_TO_LIVE['E47S14'] = {
    'minerMineral': 180,

    'miner-E47S13-0': 100,
    'carrier-E47S13': 120,

    'miner-E48S13-0': 130,
    'miner-E48S13-1': 130,
    'carrier-E48S13': 160,

    'miner-E48S14-0': 90,
    'miner-E48S14-1': 90,
    'carrier-E48S14': 160,

    'warriorMineral-E46S14-1': 250,
    'minerMineral-E46S14': 250,
    'carrierMineral-E46S14': 250,

    'warriorMineral-E46S15-3': 300,
    'minerMineral-E46S15': 300,
    'carrierMineral-E46S15': 300,

    'warriorMineral-E46S16-1': 320,
    'minerMineral-E46S16': 320,
    'carrierMineral-E46S16': 320,
};

SpawnManager.MIN_TICKS_TO_LIVE['E37S5'] = {
    'minerMineral': 180,

    'miner-E38S5-0': 90,
    'miner-E38S5-1': 90,
    'carrier-E38S5': 160,

    'miner-E37S4-0': 90,
    'carrier-E37S4': 130,

    'miner-E38S4-0': 130,
    'miner-E38S4-1': 130,
    'carrier-E38S4-E37S4': 180,

    'warriorMineral-E36S6-1': 300,
    'warriorMineral-E36S5-2': 250,
    'minerMineral-E36S6': 300,
    'minerMineral-E36S5': 250,
    'carrierMineral-E36S6': 300,
    'carrierMineral-E36S5': 250,

    'minerMineral-E35S5': 300,
    'carrierMineral-E35S5': 300,

    'upgrader-E35S3': 350,
};

SpawnManager.MIN_TICKS_TO_LIVE['E48S9'] = {
    'minerMineral': 180,

    'miner-E48S8-0': 110,
    'miner-E48S8-1': 110,
    'carrier-E48S8': 150,

    'miner-E47S9-0': 90,

    'miner-E47S8-0': 110,
    'miner-E47S8-1': 110,
    'carrier-E47S8': 150,
};

SpawnManager.MIN_TICKS_TO_LIVE['E49S16'] = {
    'minerMineral': 180,

    'miner-E49S15-0': 120,
    'miner-E49S15-1': 110,

    'miner-E48S16-0': 150,
    'miner-E48S16-1': 140,

    'miner-E49S17-0': 100,
    'miner-E49S17-1': 100,
    'carrier-E49S17': 110,
};

SpawnManager.MIN_TICKS_TO_LIVE['E35S8'] = {
    'minerMineral': 180,

    'miner-E36S8-0': 90,
    'carrier-E36S8': 120,

    'miner-E34S8-0': 90,
    'miner-E34S8-1': 110,
    'carrier-E34S8': 120,

    'miner-E35S7-0': 90,
    'miner-E35S7-1': 90,
    'carrier-E35S7': 100,

    'miner-E35S9-0': 90,
    'carrier-E35S9': 100,

    'warriorMineral-E35S6-1': 300,
    'minerMineral-E35S6': 300,
    'carrierMineral-E35S6': 300,
};

SpawnManager.MIN_TICKS_TO_LIVE['E42S13'] = {
    'minerMineral': 180,

    'miner-E43S13-0': 90,
    'miner-E42S12-0': 90,
    'miner-E42S12-1': 90,

    'carrier-E43S13': 100,
    'carrier-E42S12': 130,

    'warriorMineral-E44S14-1': 300,
    'minerMineral-E44S14': 300,
    'carrierMineral-E44S14': 300,
};

SpawnManager.MIN_TICKS_TO_LIVE['E47S11'] = {
    'minerMineral': 180,
};

SpawnManager.MIN_TICKS_TO_LIVE['E35S3'] = {
    'minerMineral': 180,

    'miner-E35S2-0': 90,
    'carrier-E35S2': 110,

    'miner-E36S2-0': 100,
    'miner-E36S2-1': 100,
    'carrier-E36S2': 200,

    'miner-E36S3-0': 100,
    'carrier-E36S3': 125,

    'warriorMineral-E36S4-1': 270,
    'minerMineral-E36S4': 260,
    'carrierMineral-E36S4': 260,

    'warriorMineral-E35S4-4': 250,
    'minerMineral-E35S4': 250,
    'carrierMineral-E35S4': 250,
};

SpawnManager.MIN_TICKS_TO_LIVE['E45S18'] = {
    'minerMineral': 200,

    'miner-E44S18-0': 80,
    'miner-E44S18-1': 80,
    'carrier-E44S18': 100,

    'miner-E46S18-0': 90,
    'miner-E46S18-1': 90,
    'carrier-E46S18': 110,

    'miner-E44S19-0': 120,
    'miner-E44S19-1': 120,
    'carrier-E44S19-E45S19': 130,

    'miner-E45S19-0': 90,
    'carrier-E45S19': 100,

    'warriorMineral-E44S16-4': 300,
    'minerMineral-E44S16': 300,
    'carrierMineral-E44S16': 300,

    'warriorMineral-E45S16-3': 300,
    'minerMineral-E45S16': 300,
    'carrierMineral-E45S16': 300,
};

SpawnManager.MIN_TICKS_TO_LIVE['E42S15'] = {
    'miner-E41S14-0': 100,
    'miner-E41S15-0': 80,
    'miner-E42S16-0': 90,
    'miner-E41S16-0': 100,

    'miner-E41S14-1': 100,
    'miner-E41S15-1': 80,
    'miner-E42S16-1': 90,
    'miner-E41S16-1': 100,

    'miner-E42S14-0': 70,

    'carrier-E41S14': 170,
    'carrier-E41S15': 160,
    'carrier-E42S16': 120,
    'carrier-E41S16-E42S16': 160,
};

SpawnManager.MIN_TICKS_TO_LIVE['E32S5'] = {
    'minerMineral': 180,

    'miner-E33S6-0': 120,
    'miner-E32S4-0': 100,
    'miner-E32S6-0': 80,

    'miner-E33S6-1': 120,
    'miner-E32S4-1': 80,

    'carrier-E33S6': 130,
    'carrier-E32S4': 90,
    'carrier-E32S6': 90,

    'warriorMineral-E34S5-3': 250,
    'minerMineral-E34S5': 250,
    'carrierMineral-E34S5': 250,

    'warriorMineral-E34S6-2': 300,
    'minerMineral-E34S6': 300,
    'carrierMineral-E34S6': 300,

    'warriorMineral-E34S4-3': 220,
    'minerMineral-E34S4': 220,
    'carrierMineral-E34S4': 220,
};

// SHARD 3

SpawnManager.MIN_TICKS_TO_LIVE['E39S11'] = {
    'miner-0': 80,
    'miner-1': 80,
    'upgrader': 160,

    'minerMineral': 200,

    'miner-E39S12-0': 80,
    'miner-E38S12-0': 100,
    'miner-E38S11-0': 80,

    'miner-E38S12-1': 100,

    'carrier-E38S12': 120,
    'carrier-E38S11': 90,
};

//

SpawnManager.STANDARD_MIN_TICKS_TO_LIVE = 70;

//

SpawnManager.run = function(room) {
    this.room = room;
    this.memory = room.memory;
    this.spawns = room.spawns.filter(spawn => !spawn.spawning);

    const spawnsLength = this.spawns.length;
    let spawnIndex = 0;

    if (spawnsLength === 0) {
        return;
    }

    this.createdCreeps = _.filter(Game.creeps, creep => creep.initialRoom === this.room.name);

    if (Memory.caravanEnabled) {
        this.createdCreepsInRoom = _.filter(this.createdCreeps, creep => creep.room.name === this.room.name);
    } else {
        this.createdCreepsInRoom = [];
    }

    this.room.memory.spawnQueue = _.filter(this.room.memory.spawnQueue, (r) => {
        if (r.expiredAt > Game.time) {
            return true;
        }

        if (r.notify) {
            console.log(`Request for creep ${r.role} (x${r.amount}) in the room ${linkRoom(this.room.name)} has expired!`);

            Game.notify(`Запрос на крипа ${r.role} (x${r.amount}) в комнате ${this.room.name} истек!`);
        }

        return false;
    });

    const queue = this.room.memory.spawnQueue;

    if (queue.length > 0) {
        const request = queue.find((request) => {
            if (request.priority === 'high') {
                if (Number.isFinite(request.period) && Game.time < request.nextSpawnAt) {
                    return false;
                }

                return true;
            }

            return false;
        });

        if (request && this.processRequest(request, spawnIndex)) {
            spawnIndex++;
        }
    }

    if (spawnIndex === spawnsLength) {
        return;
    }

    let roles = [];

    try {
        roles = _.keys(this.CREEPS_MAX[this.room.name]);
    } catch(e) {
        roles = ['carrier', 'miner-0', 'miner-1'];

        Game.notify(`Для комнаты ${this.room.name} не заданы роли!`);
    }

    if (Memory.caravanEnabled && _.includes(Memory.caravanRooms, this.room.name)) {
        let role = 'caravan-';
        let roomName = 'E40S10';

        if (Game.shard.name === 'shard0') {
            if (['E74S21'].includes(this.room.name)) {
                roomName = 'E70S20';
            } else {
                roomName = 'E70S10';
            }
        }

        role += `${roomName}-${(Memory.caravanResource || 'T0')}-${(Memory.caravanShard || 'shard3')}`;

        roles.push(role);
    }

    for (let i = 0; i < roles.length; i++) {
        const role = roles[i];

        this.spawn = this.spawns[spawnIndex];
        this.roleOptions = { splittedRole: role.split('-') };

        if (this.needsSpawnCreep(role)) {
            if (this.spawn) {
                if (this.spawnCreepByRole(role)) {
                    spawnIndex++;
                } else {
                    return;
                }
            } else {
                return;
            }

            if (spawnIndex === spawnsLength) {
                return;
            }
        }
    }

    if (spawnIndex === spawnsLength) {
        return;
    }

    for (let i = 0; i < queue.length; i++) {
        const request = queue[i];

        if (request.priority === 'low') {
            if (Number.isFinite(request.period) && Game.time < request.nextSpawnAt) {
                continue;
            }

            if (this.processRequest(request, spawnIndex)) {
                spawnIndex++;
            }

            if (spawnIndex === spawnsLength) {
                return;
            }
        }
    }
};

SpawnManager.creepIsAlive = function(creep, role, ignoreTicks = false) {
    if (ignoreTicks) {
        return creep.initialRole === role;
    }

    const initialRole = creep.initialRole;
    const ticks = Math.max(this.MIN_TICKS_TO_LIVE[creep.initialRoom][initialRole] || this.STANDARD_MIN_TICKS_TO_LIVE, creep.body.length * 3);

    return initialRole === role && (creep.ticksToLive > ticks || creep.spawning);
};

SpawnManager.initialRoleAmount = function(role, ignoreTicks = false) {
    return _.sum(this.createdCreeps, creep => this.creepIsAlive(creep, role, ignoreTicks));
};

SpawnManager.initialRoleInRoomAmount = function(role, ignoreTicks = false) {
    // const creeps = _.filter(Game.creeps,
    //         creep => creep.initialRoom === this.room.name && creep.room.name === this.room.name);

    return _.sum(this.createdCreepsInRoom, creep => this.creepIsAlive(creep, role, ignoreTicks));
};

SpawnManager.needsSpawnCreep = function(role, needsAmount) {
    if (needsAmount === undefined) {
        needsAmount = this.CREEPS_MAX[this.room.name][role] || 0;
    }

    if (role === 'carrier' && needsAmount === 1 && this.room.level === 8 && Memory.caravanEnabled && Shard.shard3) {
        needsAmount = 2;
    }

    if (needsAmount === 0) {
        return this.needsSpawnRemoteRole(role);
    }

    if (needsAmount === -1) {
        return this.needsSpawnRequestRole(role);
    }

    return this.initialRoleAmount(role) < needsAmount;
};

SpawnManager.logCreatedCreep = function(createdName, isRegular) {
    const colors = {
        move: '#a9b7c6',
        work: '#ffe56d',
        carry: '#777',
        attack: '#f93842',
        ranged_attack: '#5d80b2',
        heal: '#65fd62',
        claim: '#b99cfb',
        tough: '#fff'
    };
    const creep = Game.creeps[createdName];
    let message = `Created ${isRegular ? 'regular ' : ''}creep: ${createdName} (${linkRoom(this.room)}) (${this.spawn.name})`;
    let createCost = 0;

    BODYPARTS_ALL.forEach((part) => {
        const amount = creep.getActiveBodyparts(part);

        if (amount > 0) {
            message += ' ' + global.svgBody(colors[part]) + 'x' + amount;
            createCost += BODYPART_COST[part] * amount;
        }
    });

    message += '. Spent energy: ' + createCost;
    message += '. Available energy: ' + (this.room.energyAvailable - createCost) + '/' + this.room.energyCapacityAvailable;

    console.log(message);
};

SpawnManager.getCreepName = function(role) {
    return role + ' ' + _.random(0, 10000);
};

SpawnManager.spawnCreepByRole = function(role, body, customMemory, isRegular) {
    const name = this.getCreepName(role);

    if (Game.creeps[name]) {
        return false;
    }

    if (!BodyManager) {
        BodyManager = ModuleManager.get('bodyManager');
    }

    if (typeof body === 'string') { // body - role
        body = BodyManager.getBody.call(this, body);
    } else if (!Array.isArray(body)) {
        body = BodyManager.getBody.call(this, role);
    }

    if (!SpawnCreepMemoryManager) {
        SpawnCreepMemoryManager = ModuleManager.get('spawnCreepMemoryManager');
    }

    let memory = SpawnCreepMemoryManager.getMemory.call(this, role);

    if (customMemory !== undefined) {
        memory = {
            ...memory,
            ...customMemory
        };
    }

    return this.spawnCreep(name, body, memory, isRegular);
};

SpawnManager.spawnCreep = function(name, body, memory, isRegular) {
    if (this.spawn.spawnCreep(body, name, { memory }) === OK) {
        this.logCreatedCreep(name, isRegular);

        return true;
    }

    return false;
};

SpawnManager.needsSpawnRemoteRole = function(role) {
    if (Game.cpu.bucket <= 100 || this.room.playerEnemies.length > 0 || this.room.energyPercents < 20) {
        return false;
    }

    const splittedRole = this.roleOptions.splittedRole;
    const roleBase = splittedRole[0];

    if (roleBase) {
        const roomName = splittedRole[1] || this.room.name;
        const memory = Memory.rooms[roomName];

        if (!memory) {
            Shard.requestObserver(roomName, 1);

            return false;
        }

        const room = Game.rooms[roomName];

        switch (roleBase) {
            case 'miner':
            case 'carrier': {
                if (room) {
                    if (room.isHostile || room.isReservedByPlayer) {
                        return false;
                    }

                    if (room.invaderCore && room.invaderCore.level > 0) {
                        return false;
                    }

                    if (room.playerEnemies.some(c => c.getActiveBodyparts(ATTACK) >= 15 || c.getActiveBodyparts(RANGED_ATTACK) >= 15)) {
                        return false;
                    }

                    if (roleBase === 'carrier') {
                        return this.initialRoleAmount(role) < memory.sources.length;
                    } else {
                        return this.initialRoleAmount(role) === 0;
                    }
                } else {
                    Shard.requestObserver(roomName, 1);

                    return false;
                }
                break;
            }
            case 'repairer': {
                if (!memory.playerEnemies) {
                    return this.initialRoleAmount(role) === 0;
                }
                break;
            }
            case 'remoteRepairer': {
                const nextRegeneration = memory.remoteRepairerNextRegeneration;

                if (!nextRegeneration || Game.time >= nextRegeneration - 200) {
                    if (this.initialRoleAmount(role) === 0) {
                        console.log(`Remote repair in the room ${linkRoom(this.room)}`);

                        return true;
                    }
                }

                break;
            }
            case 'warriorMineral':
            case 'minerMineral':
            case 'carrierMineral': {
                if (roomName === this.room.name) {
                    if (this.room.mineral.ticksToRegeneration < 200 || this.room.mineral.mineralAmount > 0) {
                        return this.initialRoleAmount(role) === 0;
                    }
                } else {
                    if (memory.invaders) {
                        return false;
                    }

                    const invaderCore = memory.invaderCore;

                    if (invaderCore && invaderCore.level > 0 && invaderCore.expiredAt > Game.time) {
                        return false;
                    }

                    if ((Game.shard.name !== 'shard1' || roomName !== 'E35S4') && memory.playerEnemies) {
                        return false;
                    }

                    // if (memory.playerEnemies) {
                    //     return false;
                    // }

                    const mineralInfo = memory.mineral || {};
                    const generatedAt = mineralInfo.generatedAt;

                    if (!generatedAt) {
                        Shard.requestObserver(roomName, 1);

                        return false;
                    }

                    if (Game.time >= generatedAt - 200) {
                        return this.initialRoleAmount(role) === 0;
                    }
                }
                break;
            }
            case 'caravan': {
                if (!Memory.caravanEnabled) {
                    return false;
                }

                if (Game.cpu.bucket < 2500) {
                    return false;
                }

                if (Memory.caravanLimit <= 0) {
                    return false;
                }

                const targetShard = splittedRole[3] || 'shard3';
                const targetShardMemory = ShardMemory[targetShard] || {};

                if (targetShardMemory.bucket < 2500) {
                    return false;
                }
                
                if (Game.powerCreeps[this.room.name] && !this.spawn.hasEffect(PWR_OPERATE_SPAWN)) {
                    return false;
                }

                const terminal = this.room.terminal;
                const storage = this.room.storage;
                const store = this.room.store;

                if (!terminal || !storage) {
                    return false;
                }

                let storeEnergy = store[RESOURCE_ENERGY];

                if ((this.room.energyCapacityAvailable - this.room.energyAvailable) > storeEnergy || storeEnergy < 5000) {
                    return false;
                }

                if (this.room.factory) {
                    storeEnergy += store[RESOURCE_BATTERY] * 1.25; // Не 10, потому что долго перерабатывать все батареи, ну и коэффициент явно не 10 получается
                }

                if (storeEnergy < 50000) {
                    return false;
                }

                // if (storeEnergy < 100000 && _.get(Memory, `market.prices[${ORDER_BUY}][${RESOURCE_ENERGY}]`, 0) >= 0.015) {
                //     return false;
                // }

                const resourceType = splittedRole[2];

                if (Resource.isResource(resourceType)) {
                    const amount = store[resourceType] || 0;

                    return amount >= 1250 && this.initialRoleInRoomAmount(role) < Math.min(Math.ceil(amount / 1250), 12);
                } else if (Resource[resourceType]) {
                    const caravanResources = ShardMemory.shard3.caravanResources || {};
                    let amount = 0;

                    _.forEach(Resource[resourceType], (resource) => {
                        if (caravanResources[resource]) {
                            amount += store[resource] || 0;
                        }
                    });

                    return amount >= 1250 && this.initialRoleInRoomAmount(role) < Math.min(Math.ceil(amount / 1250), 12);
                } else {
                    const resources = this.room.terminalUsedCapacity + this.room.storageUsedCapacity - store[RESOURCE_ENERGY];

                    return resources >= 1250 && this.initialRoleInRoomAmount(role) < Math.min(Math.ceil(resources / 1250), 12);
                }

                break;
            }
            case 'warrior': {
                if (room) {
                    if (room.isReservedByPlayer) {
                        return this.initialRoleAmount(role) === 0;
                    }

                    if (room.invaders.length > 0 && this.initialRoleAmount(role) === 0) {
                        console.log('Invaders in the room ' + linkRoom(roomName));

                        return true;
                    }

                    if (room.invaderCore && room.invaderCore.level === 0 && this.initialRoleAmount(role) === 0) {
                        console.log('Invader core in the room ' + linkRoom(roomName));

                        return true;
                    }

                    if (room.my && room.playerEnemies.length > 0) {
                        return this.initialRoleAmount(role) === 0;
                    }

                    return false;
                } else {
                    Shard.requestObserver(roomName, 1);

                    return false;
                }

                break;
            }
            case 'reserver':
                if (room) {
                    if (room.my) {
                        return false;
                    }

                    if (room.isHostile) {
                        if (room.controller.upgradeBlocked > 0) {
                            return room.controller.upgradeBlocked < CREEP_CLAIM_LIFE_TIME - 100
                                && this.initialRoleAmount(role, true) === 0 && !room.playerEnemies.some(
                                    c => c.getActiveBodyparts(ATTACK) + c.getActiveBodyparts(RANGED_ATTACK) > 0);
                        }

                        if (!room.playerEnemies.some(
                            c => c.getActiveBodyparts(ATTACK) + c.getActiveBodyparts(RANGED_ATTACK) > 0)) {
                                return this.initialRoleAmount(role, true) === 0;
                        }

                        return false;
                    }

                    const reservation = room.controller.reservation;

                    if (reservation) {
                        const invaderCore = room.invaderCore;
                        if (invaderCore && invaderCore.level > 0) {
                            return false;
                        }

                        if (reservation.ticksToEnd <= 1000 || reservation.username !== MY_USERNAME) {
                            return this.initialRoleAmount(role) === 0 && !room.playerEnemies.some(
                                c => c.getActiveBodyparts(ATTACK) + c.getActiveBodyparts(RANGED_ATTACK) > 0);
                        }
                    } else {
                        return this.initialRoleAmount(role) === 0 && !room.playerEnemies.some(
                            c => c.getActiveBodyparts(ATTACK) + c.getActiveBodyparts(RANGED_ATTACK) > 0);
                    }
                } else {
                    if (Game.time % 100 === 0 && Shard.requestObserver(roomName, 1)) {
                        return false;
                    }

                    if (!memory.playerEnemies && (memory.reservation || 0) <= 1000) {
                        return this.initialRoleAmount(role) === 0;
                    }
                }

                break;
        }
    }

    return false;
};

SpawnManager.needsSpawnRequestRole = function(role) {
    // return false; // TODO

    // if (role === 'reserver-E30S10') {
    //     const amount = this.initialRoleAmount(role);
    //
    //     if (amount > 0) {
    //         return false;
    //     }
    //
    //     if (!Memory.temp || Memory.temp - 1050 + 1 === Game.time || Memory.temp - Game.time <= 0) {
    //         Memory.temp = Game.time + 1050;
    //
    //         return true;
    //     }
    //
    //     return false;
    // }
    //
    // if (role === 'reserver-E30S10-2') {
    //     const amount = this.initialRoleAmount(role);
    //
    //     if (amount > 0) {
    //         if (this.initialRoleAmount('reserver-E30S10') === 1) {
    //             Memory.temp = Memory.temp2;
    //         }
    //
    //         return false;
    //     }
    //
    //     if (!Memory.temp2 || Memory.temp2 - 1050 + 1 === Game.time || Memory.temp2 - Game.time <= 0) {
    //         Memory.temp2 = Game.time + 1050;
    //
    //         return true;
    //     }
    //
    //     return false;
    // }

    const splittedRole = this.roleOptions.splittedRole;
    const roleBase = splittedRole[0];

    if (roleBase) {
        switch (roleBase) {
            case 'carrierLab': {
                if (this.room.level < 8) {
                    return false;
                }

                const labReaction = this.room.memory.labReaction;

                if (!labReaction || this.room.store[labReaction] >= this.room.memory.labReactionAmount) {
                    return false;
                }

                return this.initialRoleAmount(role) === 0;
                break;
            }
            case 'ramparter': {
                if (!this.room.memory.ramparter || this.room.store[RESOURCE_ENERGY] < 35000) {
                    return false;
                }

                return this.initialRoleAmount(role) < this.room.memory.ramparter;
                break;
            }
            default:

                break;
        }
    }

    return false;
};

SpawnManager.processRequest = function(request, spawnIndex) {
    this.spawn = this.spawns[spawnIndex];

    if (!this.spawn) {
        return false;
    }

    const queue = this.room.memory.spawnQueue;

    this.roleOptions = { splittedRole: request.role.split('-') };

    if (request.regular) {
        if (this.needsSpawnCreep(request.role, request.amount)) {
            if (this.spawnCreepByRole(request.role, request.body, request.memory, true)) {
                return true;
            }
        } else if (Number.isFinite(request.period)) {
            request.nextSpawnAt = Game.time + request.period + CREEP_LIFE_TIME;
        }
    } else if (this.spawnCreepByRole(request.role, request.body, request.memory)) {
        if (request.amount > 1) {
            request.amount--;

            if (Number.isFinite(request.period)) {
                request.nextSpawnAt = Game.time + request.period + CREEP_LIFE_TIME;
            }

            console.log(`Left amount of ${request.role} in the room ${linkRoom(this.room)}: ${request.amount}`);
        } else {
            queue.splice(queue.indexOf(request), 1);

            console.log(`Spawn queue length in the room ${linkRoom(this.room)}: ${queue.length}`);

            if (request.notify) {
                Game.notify(`Запрос на крипа ${request.role} в комнате ${this.room.name} завершен!`);
            }
        }

        return true;
    }

    return false;
};

//

module.exports = SpawnManager;
