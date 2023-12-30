
function BodyManager() {
}

//

BodyManager.CARRIER_BODY = {};
BodyManager.DOUBLE_CARRIER_BODY = {};

//

BodyManager.dynamicCarrierBody = function(carryParts, energyAvailable) {
    return BodyManager.carrierBody(Math.min(carryParts, Math.floor(energyAvailable / 150)));
};

BodyManager.carrierBody = function(carryParts) {
    const baseBody = [CARRY, MOVE, CARRY];

    let body = BodyManager.CARRIER_BODY[carryParts];

    if (!body) {
        body = [];

        for (let i = 0; i < carryParts; i++) {
            Array.prototype.push.apply(body, baseBody);
        }

        BodyManager.CARRIER_BODY[carryParts] = body;
    }

    return body;
};

BodyManager.doubleCarryBody = function(carryParts, healParts = 0) {
    const baseBody = [MOVE, CARRY, MOVE, CARRY];

    let body = BodyManager.DOUBLE_CARRIER_BODY[carryParts + ',' + healParts];

    if (!body) {
        body = [];

        for (let i = 0; i < carryParts; i++) {
            Array.prototype.push.apply(body, baseBody);
        }

        if (healParts > 0) {
            for(let i = 0; i < healParts; i++) {
                body.push(MOVE);
            }

            for(let i = 0; i < healParts; i++) {
                body.push(HEAL);
            }
        }

        BodyManager.DOUBLE_CARRIER_BODY[carryParts + ',' + healParts] = body;
    }
    return body;
};

BodyManager.getBody = function(role) {
    switch (this.room.name) {

        case 'E68S9':
            switch (role) {
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return [MOVE, CARRY, CARRY, MOVE, CARRY];

                case 'carrier-E67S9':
                    return BodyManager.carrierBody(5);
                case 'carrier-E69S9':
                    return BodyManager.carrierBody(6);
            }
            break;

        case 'E68S8':
            switch (role) {
                case 'miner-0':
                    return [
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        MOVE, MOVE, MOVE, MOVE, MOVE];
                    // return [
                    //     WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    //     WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    //     MOVE, MOVE, MOVE, MOVE, MOVE];

                case 'carrierMineral':
                    return BodyManager.carrierBody(2);

                case 'carrier-E67S8':
                    return BodyManager.carrierBody(9);
                case 'carrier-E67S7-E67S8':
                    return BodyManager.carrierBody(14);
                case 'carrier-E69S8':
                    return BodyManager.carrierBody(7);
            }
            break;

        case 'E67S14':
            switch (role) {
                case 'miner-0':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return BodyManager.carrierBody(2);

                case 'upgrader':
                    return [
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE,
                        MOVE, MOVE, MOVE, MOVE
                    ];

                case 'carrier-E66S13-E67S13':
                    return BodyManager.carrierBody(9);
                case 'carrier-E67S13':
                    return BodyManager.carrierBody(12);
                case 'carrier-E68S13':
                    return BodyManager.carrierBody(10);

                case 'carrierMineral-E66S14':
                    return BodyManager.doubleCarryBody(5);
                case 'carrierMineral-E65S15':
                    return BodyManager.doubleCarryBody(8, 1);
                case 'carrierMineral-E66S15':
                    return BodyManager.doubleCarryBody(7, 1);
            }
            break;

        case 'E64S13':
            switch (role) {
                case 'carrierMineral':
                    return BodyManager.carrierBody(4);

                case 'upgrader':
                    return [
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE,
                        MOVE, MOVE, MOVE, MOVE
                    ];

                case 'carrier-E64S12':
                    return BodyManager.carrierBody(9);
                case 'carrier-E65S13':
                    return BodyManager.carrierBody(14);
                case 'carrier-E65S12':
                    return BodyManager.carrierBody(16);
                case 'carrier-E65S11-E65S12':
                    return BodyManager.carrierBody(14);

                case 'carrierMineral-E64S14':
                    return BodyManager.doubleCarryBody(5, 1);
            }
            break;

        case 'E74S21':
            switch (role) {
                case 'miner-0':
                    return [
                        MOVE, MOVE, MOVE, MOVE,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK
                    ];
                case 'miner-1':
                    return [
                        MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK
                    ];

                case 'carrierMineral':
                    return BodyManager.carrierBody(2);

                case 'upgrader':
                    return [
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,
                        MOVE, MOVE, MOVE
                    ];

                case 'carrier-E73S21':
                    return BodyManager.carrierBody(10);
                case 'carrier-E75S21':
                    return BodyManager.carrierBody(10);
                case 'carrier-E75S22-E75S21':
                    return BodyManager.carrierBody(10);
                case 'carrier-E76S21-E75S21':
                    return BodyManager.carrierBody(12);
            }
            break;


        // SHARD 1

        case 'E42S9':
            switch(role) {
                case 'miner-0':
                case 'miner-1':
                    return [
                        MOVE, MOVE, MOVE, MOVE,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK
                    ];
                    
                case 'carrierMineral':
                    return BodyManager.carrierBody(6);

                case 'carrier-E41S9':
                    return BodyManager.carrierBody(10);

                case 'carrier-E42S8':
                    return BodyManager.carrierBody(7);

                case 'carrier-E43S8':
                    return BodyManager.carrierBody(12);
            }
            break;

        case 'E39S6':
            switch(role) {
                case 'miner-0':
                    return [
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        MOVE, MOVE, MOVE, MOVE, MOVE];

                case 'carrierMineral':
                    return BodyManager.carrierBody(5);

                case 'carrier-E38S6':
                    return BodyManager.carrierBody(7);
                case 'carrier-E39S5':
                    return BodyManager.carrierBody(13);
                case 'carrier-E38S7':
                    return BodyManager.carrierBody(14);
                case 'carrier-E39S7':
                    return BodyManager.carrierBody(10);
                case 'carrier-E39S4-E39S5':
                    return BodyManager.carrierBody(10);
            }
            break;

        case 'E38S12':
            switch(role) {
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'upgrader':
                    return [
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE
                    ];

                case 'carrierMineral':
                    return BodyManager.carrierBody(2);

                case 'carrier-E39S11-E39S12':
                    return BodyManager.carrierBody(13);
                case 'carrier-E39S12':
                    return BodyManager.carrierBody(12);
                case 'carrier-E39S13-E39S12':
                    return BodyManager.carrierBody(13);
            }
            break;

        case 'E37S4':
            switch(role) {
                case 'miner-0':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'upgrader':
                    return [
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK
                    ];

                case 'carrierMineral':
                    return BodyManager.carrierBody(5);

                case 'miner-E37S5-0':
                    return[
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
                    // return [
                    //     MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    //     CARRY,
                    //     WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    //     WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'carrier-E36S3':
                case 'carrier-E38S3':
                    return BodyManager.carrierBody(13);
                case 'carrier-E37S3':
                    return BodyManager.carrierBody(8);
                case 'carrier-E37S5':
                    return BodyManager.carrierBody(12);
                case 'carrier-E38S4':
                    return BodyManager.carrierBody(7);

                case 'carrierMineral-E35S4':
                    return BodyManager.doubleCarryBody(10, 1);
                case 'carrierMineral-E36S4':
                    return BodyManager.doubleCarryBody(7);
                case 'carrierMineral-E36S5':
                    return BodyManager.doubleCarryBody(8, 1);
                case 'carrierMineral-E35S5':
                    return BodyManager.doubleCarryBody(10, 1);
            }
            break;

        case 'E39S9':
            switch(role) {
                case 'miner-0':
                    return [
                        MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK
                    ];
                case 'miner-1':
                    return [
                        MOVE, MOVE, MOVE, MOVE,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK
                    ];

                case 'upgrader':
                    return [
                        MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY,
                        WORK
                    ];

                case 'carrierMineral':
                    return BodyManager.carrierBody(5);

                case 'carrier-E39S8':
                    return BodyManager.carrierBody(10);
                case 'carrier-E38S8':
                    return BodyManager.carrierBody(13);
            }
            break;

        case 'E44S3':
            switch (role) {
                case 'miner-0':
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'upgrader':
                    return [
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK
                    ];

                case 'carrierMineral':
                    return BodyManager.carrierBody(5);

                case 'carrier-E44S2':
                    return BodyManager.carrierBody(7);

                case 'carrier-E45S3':
                    return BodyManager.carrierBody(6);

                case 'carrier-E45S2':
                    return BodyManager.carrierBody(12);

                case 'carrierMineral-E44S5':
                    return BodyManager.doubleCarryBody(7, 1);
                case 'carrierMineral-E45S5':
                    return BodyManager.doubleCarryBody(8, 1);
            }
            break;

        case 'E47S8':
            switch (role) {
                case 'carrierMineral':
                    return BodyManager.carrierBody(3);

                case 'carrier-E47S7':
                    return BodyManager.carrierBody(5);
                case 'carrier-E46S8':
                    return BodyManager.carrierBody(10);
                case 'carrier-E47S9':
                    return BodyManager.carrierBody(6);
            }
            break;

        case 'E45S9':
            switch (role) {
                case 'carrierMineral':
                    return BodyManager.carrierBody(2);

                case 'carrier-E46S9':
                    return BodyManager.carrierBody(2);
                case 'carrier-E45S8':
                    return BodyManager.carrierBody(12);
            }
            break;

        case 'E38S14':
            switch (role) {
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'upgrader':
                    return [
                        MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, MOVE, CARRY, WORK
                    ];

                case 'carrierMineral':
                    return BodyManager.carrierBody(5);

                case 'carrier-E37S13':
                    return BodyManager.carrierBody(13);
                case 'carrier-E37S14':
                    return BodyManager.carrierBody(7);
                case 'carrier-E38S15':
                    return BodyManager.carrierBody(10);
                case 'carrier-E38S13':
                    return BodyManager.carrierBody(3);
                case 'carrier-E39S14':
                    return BodyManager.carrierBody(10);
            }
            break;

        case 'E37S16':
            switch (role) {
                case 'miner-0':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return BodyManager.carrierBody(3);

                case 'carrier-E37S15':
                    return BodyManager.carrierBody(2);
                case 'carrier-E38S16':
                    return BodyManager.carrierBody(9);

                case 'carrierMineral-E36S16':
                    return BodyManager.doubleCarryBody(5, 0);
            }
            break;

        case 'E44S17':
            switch (role) {
                case 'miner-0':
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'upgrader':
                    return [MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, MOVE, CARRY, WORK];

                case 'carrierMineral':
                    return BodyManager.carrierBody(3);

                case 'carrier-E45S18':
                    return BodyManager.carrierBody(15);
                case 'carrier-E45S17':
                    return BodyManager.carrierBody(9);
                case 'carrier-E46S17':
                    return BodyManager.carrierBody(15);

                case 'carrierMineral-E44S15':
                    return BodyManager.doubleCarryBody(9, 1);
                case 'carrierMineral-E45S16':
                    return BodyManager.doubleCarryBody(8, 1);
            }
            break;

        case 'E27S9':
            switch (role) {
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return BodyManager.carrierBody(5);

                case 'carrier-E26S8':
                    return BodyManager.carrierBody(7);
                case 'carrier-E26S9':
                    return BodyManager.carrierBody(9);
                case 'carrier-E27S8':
                    return BodyManager.carrierBody(7);
                case 'carrier-E28S9':
                    return BodyManager.carrierBody(5);
            }
            break;

        case 'E23S5':
            switch (role) {
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return BodyManager.carrierBody(4);

                case 'carrier-E22S5':
                case 'carrier-E23S6':
                    return BodyManager.carrierBody(5);

                case 'carrierMineral-E25S5':
                    return BodyManager.doubleCarryBody(6);
            }
            break;

        case 'E24S3':
            switch (role) {
                case 'miner-0':
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return BodyManager.carrierBody(4);

                case 'carrier-E23S4':
                    return BodyManager.carrierBody(7);
                case 'carrier-E23S3':
                    return BodyManager.carrierBody(9);
                case 'carrier-E25S3':
                    return BodyManager.carrierBody(11);

                case 'carrierMineral-E25S4':
                case 'carrierMineral-E24S4':
                    return BodyManager.doubleCarryBody(5);
            }
            break;

        // SHARD 2

        case 'E38S9':
            switch(role) {
                case 'miner-0':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return BodyManager.carrierBody(3);

                case 'carrier-E37S8':
                    return BodyManager.carrierBody(12);
                case 'carrier-E38S8':
                    return BodyManager.carrierBody(11);
                case 'carrier-E39S8':
                    return BodyManager.carrierBody(14);
                case 'carrier-E39S9':
                    return BodyManager.carrierBody(15);
            }
            break;

        case 'E42S11':
            switch(role) {
                case 'miner-0':
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
                case 'carrierMineral':
                    return BodyManager.carrierBody(3);

                case 'carrier-E43S11':
                    return BodyManager.carrierBody(7);
                case 'carrier-E43S12-E43S11':
                    return BodyManager.carrierBody(7);
            }
            break;

        case 'E47S14':
            switch(role) {
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return BodyManager.carrierBody(3);

                case 'carrier-E47S13':
                    return BodyManager.carrierBody(7);
                case 'carrier-E48S13':
                    return BodyManager.carrierBody(14);
                case 'carrier-E48S14':
                    return BodyManager.carrierBody(10);

                case 'carrierMineral-E46S14':
                    return BodyManager.doubleCarryBody(5, 1);
                case 'carrierMineral-E45S15':
                    return BodyManager.doubleCarryBody(8, 1);
            }
            break;

        case 'E37S5':
            switch (role) {
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];

                case 'upgrader':
                    return [
                        MOVE, MOVE, MOVE, CARRY, CARRY,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return [CARRY, MOVE, CARRY, MOVE, CARRY];

                case 'carrierMineral-E36S6':
                case 'carrierMineral-E35S4':
                case 'carrierMineral-E35S5':
                    return BodyManager.doubleCarryBody(8, 1);

                case 'carrier-E37S4':
                    return BodyManager.carrierBody(8);
                case 'carrier-E38S4-E37S4':
                    return BodyManager.carrierBody(16);
                case 'carrier-E38S5':
                    return BodyManager.carrierBody(16);
            }
            break;

        case 'E48S9':
            switch (role) {
                case 'miner-0':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return BodyManager.carrierBody(4);

                case 'carrier-E48S8':
                    return BodyManager.carrierBody(11);
                case 'carrier-E47S9':
                    return [CARRY, CARRY, MOVE, CARRY];
                case 'carrier-E47S8':
                    return BodyManager.carrierBody(15);
            }
            break;

        case 'E49S16':
            switch (role) {
                case 'carrierMineral':
                    return BodyManager.carrierBody(3);

                case 'carrier-E48S16':
                    return BodyManager.carrierBody(11);
                case 'carrier-E49S15':
                    return BodyManager.carrierBody(8);
                case 'carrier-E49S17':
                    return BodyManager.carrierBody(8);
            }
            break;

        case 'E35S8':
            switch (role) {
                case 'carrierMineral':
                    return BodyManager.carrierBody(3);

                case 'carrier-E36S8':
                    return BodyManager.carrierBody(9);
                case 'carrier-E34S8':
                    return BodyManager.carrierBody(13);
                case 'carrier-E35S9':
                    return BodyManager.carrierBody(6);
                case 'carrier-E35S7':
                    return BodyManager.carrierBody(14);

                case 'carrierMineral-E35S6':
                    return BodyManager.doubleCarryBody(8, 1);
            }
            break;

        case 'E42S13':
            switch (role) {
                case 'miner-0':
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return BodyManager.carrierBody(6);

                case 'carrier-E42S12':
                    return BodyManager.carrierBody(10);
                case 'carrier-E43S13':
                    return BodyManager.carrierBody(10);
            }
            break;

        case 'E47S11':
            switch (role) {
                case 'miner-0':
                    return [
                        MOVE, MOVE, MOVE, MOVE,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK
                    ];
                case 'miner-1':
                    return [
                        MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK
                    ];

                case 'carrierMineral':
                    return BodyManager.carrierBody(3);

                case 'carrier-E46S11':
                    return BodyManager.carrierBody(2);
                case 'carrier-E47S12':
                    return BodyManager.carrierBody(12);
            }
            break;

        case 'E35S3':
            switch (role) {
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return BodyManager.carrierBody(2);

                case 'carrier-E37S3':
                    return BodyManager.carrierBody(14);
                case 'carrier-E35S2':
                    return BodyManager.carrierBody(9);
                case 'carrier-E36S3':
                    return BodyManager.carrierBody(9);
                case 'carrier-E36S2':
                    return BodyManager.carrierBody(16);

                case 'carrierMineral-E34S4':
                    return BodyManager.doubleCarryBody(8, 1);
            }
            break;

        case 'E45S18':
            switch (role) {
                case 'carrierMineral':
                    return BodyManager.carrierBody(2);

                case 'carrier-E44S18':
                    return BodyManager.carrierBody(10);
                case 'carrier-E46S18':
                    return BodyManager.carrierBody(10);
                case 'carrier-E45S19':
                    return BodyManager.carrierBody(8);
                case 'carrier-E44S19-E45S19':
                    return BodyManager.carrierBody(10);

                case 'carrierMineral-E44S16':
                    return BodyManager.doubleCarryBody(9, 1);
            }
            break;

        case 'E42S15':
            switch (role) {
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'upgrader':
                    return [
                        MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        MOVE, CARRY, WORK
                    ];

                case 'carrierMineral':
                    return BodyManager.carrierBody(3);

                case 'carrier-E42S14':
                    return BodyManager.carrierBody(12);
                case 'carrier-E42S16':
                    return BodyManager.carrierBody(13);
                case 'carrier-E41S14':
                    return BodyManager.carrierBody(14);
                case 'carrier-E41S15':
                    return BodyManager.carrierBody(9);
                case 'carrier-E41S16-E42S16':
                    return BodyManager.carrierBody(12);
            }
            break;

        case 'E32S5':
            switch (role) {
                case 'miner-0':
                case 'miner-1':
                    return [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK];
                    // return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

                case 'carrierMineral':
                    return BodyManager.carrierBody(4);

                case 'carrier-E33S6':
                    return BodyManager.carrierBody(10);
                case 'carrier-E32S4':
                    return BodyManager.carrierBody(5);
                case 'carrier-E32S6':
                    return BodyManager.carrierBody(6);
                case 'carrier-E33S5':
                    return BodyManager.carrierBody(9);
            }
            break;

        // SHARD 3

        case 'E39S11':
            switch (role) {
                case 'miner-0':
                    return [
                        MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK
                    ];
                    // return [
                    //     MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    //     CARRY, CARRY, CARRY, CARRY,
                    //     WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    //     WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    //     WORK, WORK, WORK, WORK, WORK, WORK
                    // ];
                case 'miner-1':
                    return [
                        MOVE, MOVE, MOVE, MOVE,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK
                    ];
                    // return [
                    //     MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    //     WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    //     WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    //     WORK, WORK, WORK, WORK, WORK, WORK
                    // ];

                case 'upgrader':
                    return [
                        MOVE, MOVE, MOVE, MOVE, MOVE,
                        CARRY, CARRY, CARRY,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, MOVE, CARRY, WORK
                    ];

                case 'carrierMineral':
                    return BodyManager.carrierBody(3);

                case 'carrier-E39S12':
                    return BodyManager.carrierBody(2);
                case 'carrier-E38S11':
                    return BodyManager.carrierBody(3);
                case 'carrier-E38S12':
                    return BodyManager.carrierBody(10);
            }
            break;
    }

    switch (role) {
        case 'miner-0':
        case 'miner-1':
            // return [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
            return [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK];
        case 'carrier':
            return BodyManager.dynamicCarrierBody(16, this.room.energyAvailable);
        case 'carrier1':
            return BodyManager.carrierBody(1);
        case 'carrier2':
            return BodyManager.carrierBody(2);
        case 'carrier3':
            return BodyManager.carrierBody(3);
        case 'carrier4':
            return BodyManager.carrierBody(4);
        case 'carrier5':
            return BodyManager.carrierBody(5);
        case 'carrier6':
            return BodyManager.carrierBody(6);
        case 'carrier7':
            return BodyManager.carrierBody(7);
        case 'carrier8':
            return BodyManager.carrierBody(8);
        case 'carrier9':
            return BodyManager.carrierBody(9);
        case 'carrier10':
            return BodyManager.carrierBody(10);
        case 'carrier11':
            return BodyManager.carrierBody(11);
        case 'carrier12':
            return BodyManager.carrierBody(12);
        case 'carrier13':
            return BodyManager.carrierBody(13);
        case 'carrier14':
            return BodyManager.carrierBody(14);
        case 'carrier15':
            return BodyManager.carrierBody(15);
        case 'carrierMax':
            return BodyManager.carrierBody(16);
            break;
        case 'caravan':
            return [
                MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY,
                MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY,
                MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY,
                MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY,
                MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY
            ];
        case 'claimer':
            return [MOVE, CLAIM];
        case 'reserverMax':
            return [
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM,
                CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM
            ];
            break;
        case 'minerMineral':
            if (this.room.level === 6) {
                return [
                    MOVE, MOVE, MOVE, MOVE, MOVE,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK
                ];
            }
            return [
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            break;
        case 'upgrader': {
            let level = this.room.level;

            if (level === 7 && this.room.energyCapacityAvailable < 4500) {
                level = 6;
            }

            if (level === 6) {
                return [
                    CARRY, MOVE, MOVE, MOVE, WORK, WORK,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, WORK
                ];
                break;
            }

            if (level === 7) {
                return [
                    CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, WORK
                ];
                break;
            }

            return [
                MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, WORK
            ];
        }
            break;
        case 'carrierLinkTerminal':
            return [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
            break;
        case 'central':
            return [MOVE,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY
            ];
            break;
        case 'carrierUpgrader':
            return BodyManager.carrierBody(8);
            break;
        case 'carrierNuker':
            return BodyManager.carrierBody(12);
            break;
        case 'carrierLab':
            return BodyManager.carrierBody(3);
            break;
        case 'carrierBoost':
            return BodyManager.carrierBody(3);
            break;
        case 'builder':
            if (this.room.level === 5) {
                return [
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY
                ];
            }

            if (this.room.level === 6) {
                return [
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                break;
            }

            return [
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            break;
        case 'carrierTerminal':
            return BodyManager.carrierBody(10);
            break;
        case 'remoteRepairer':
            if (this.room.level === 5 || this.room.level === 6 && this.room.energyCapacityAvailable < 2000) {
                return [
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK
                ];
            }

            if (this.room.level === 6 && this.room.energyCapacityAvailable >= 2000) {
                return [
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK
                ];
            }

            return [
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                CARRY, CARRY, CARRY,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK
            ];
            break;
        case 'ramparter':
        case 'waller':
            return [
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE
            ];
            break;
        // case 'ramparter':
        //     return [
        //         WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
        //         WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
        //         WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
        //         WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
        //         CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        //     ];
        //     break;
        case 'warriorDefender':
            return [
                // TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, WORK, WORK,
                // TOUGH, TOUGH,
                // WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                // WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                // RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                // RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                // WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                // ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                // ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                // ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                // ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                // HEAL, HEAL, HEAL,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
            ];
            break;
        case 'healerDefender':
            return [
                TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                // TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                // TOUGH, TOUGH, HEAL, HEAL, HEAL,
                // HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
                // TOUGH, TOUGH, HEAL, HEAL, RANGED_ATTACK,
                // TOUGH, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL,
                RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL,
                // RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                HEAL, HEAL, HEAL, HEAL, HEAL,
                // HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
                HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
                HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
            ];
            break;
        case 'rangedDefender':
            return [
                TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
            ];
            break;

        default:
            const splittedRole = this.roleOptions.splittedRole;
            const roleBase = splittedRole[0];

            if (roleBase) {
                switch (roleBase) { // roleBase
                    case 'warrior': {
                        const memory = Memory.rooms[splittedRole[1]];

                        if (memory && memory.invaders === 0 && memory.invaderCore && memory.invaderCore.level === 0) {
                            if (this.room.level < 6) {
                                return [
                                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                                    ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                                    ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK
                                ];
                            }

                            return [
                                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                                ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                                ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK
                            ];
                        }

                        if (this.room.level < 7) {
                            return [
                                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                                RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                                HEAL, HEAL
                            ];
                        }

                        return [
                            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                            MOVE, MOVE, MOVE, MOVE,
                            RANGED_ATTACK, RANGED_ATTACK,
                            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                            HEAL, HEAL, HEAL
                        ];

                        break;
                    }

                    case 'warriorMineral':
                    case 'warriorKeeper':
                        return [
                            MOVE, MOVE, MOVE, MOVE, MOVE,
                            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                            ATTACK, HEAL, HEAL, HEAL, HEAL
                        ];
                        break;
                    case 'reserver':
                        if (this.room.level === 5) {
                            return [MOVE, MOVE, CLAIM, CLAIM];
                        }

                        if (this.room.level === 6) {
                            return [MOVE, MOVE, MOVE, CLAIM, CLAIM, CLAIM];
                        }

                        if (this.room.level === 7) {
                            return [
                                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                                CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM
                            ];
                        }

                        return [
                            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                            CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM
                        ];
                        break;
                    case 'miner': {
                        const room = Game.rooms[splittedRole[1]];

                        if (room && room.my) {
                            return [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK];
                            // return [
                            //     MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                            //     WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK
                            // ];
                        }

                        return [MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK];
                        // return [
                        //     MOVE, MOVE, MOVE, MOVE, MOVE,
                        //     CARRY,
                        //     WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK
                        // ];
                    }
                    case 'minerMineral':
                        return [
                            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                            MOVE,
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                            HEAL
                        ];
                        break;
                    case 'marauder':
                    case 'caravan':
                        return [
                            MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY,
                            MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY,
                            MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY,
                            MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY,
                            MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY
                        ];
                        break;
                    case 'carrier':
                        return BodyManager.carrierBody(8);
                        break;
                    case 'carrierTerminal':
                    case 'carrierStorage':
                        return BodyManager.carrierBody(10);
                        break;
                    case 'carrierMineral':
                        return BodyManager.doubleCarryBody(6, 1);
                        break;
                    case 'builder': {
                        const room = Game.rooms[splittedRole[1]];

                        if (room && room.my) {
                            return [
                                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                                WORK, WORK, WORK, WORK, WORK,
                                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                                CARRY, CARRY, CARRY, CARRY, CARRY
                            ];
                        }

                        return [
                            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                            WORK, WORK, WORK, WORK, WORK, WORK
                        ];

                        break;
                    }
                    case 'upgrader': {
                        const room = Game.rooms[splittedRole[1]];

                        if (room && room.my) {
                            return [
                                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                                MOVE, MOVE, MOVE, MOVE,
                                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                                WORK, WORK, WORK, WORK,
                                CARRY, CARRY
                            ];
                        }

                        break;
                    }
                    case 'dismantler':
                        return [
                            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                            MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK,
                            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
                        break;
                }
            }

            return [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK];
            break;
    }
};


module.exports = BodyManager;
