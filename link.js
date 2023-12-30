
function Link() {}

Link.run = function(room) {
    this.room = room;

    const links = room.links;

    if (links.length < 2) {
        return;
    }

    let target;
    let target2;
    let target3;
    let source1;
    let source2;
    let source3;
    let source4;

    switch (room.name) {

        case 'E68S9': {
            target = links[3];
            target2 = links[1];
            source1 = links[0];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E68S8': {
            target = links[4]; // storage
            target2 = links[0]; // controller
            source1 = links[1];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E67S14': {
            target = links[5];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E64S13': {
            target = links[5];
            target2 = links[4];
            source1 = links[0];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E74S21': {
            target = links[5];
            target2 = links[0];
            source1 = links[1];

            this.processRoom(target, target2, source1);

            break;
        }


        // SHARD 1

        case 'E42S9': {
            target = links[3];

            this.processRoom(target);

            break;
        }

        case 'E39S6': {
            target = links[4];
            target2 = links[5];
            source1 = links[3];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E38S12': {
            target = links[4]; // storage
            target2 = links[3]; // controller
            source1 = links[2];

            if (target && target.store[RESOURCE_ENERGY] < 400) {
                let freeCapacity = target.store.getFreeCapacity(RESOURCE_ENERGY);

                _.forEach(links, (link) => {
                    if (freeCapacity <= 50) {
                        return false;
                    }

                    if (link.cooldown > 0 || link === target || link === target2 || link.store[RESOURCE_ENERGY] < 50) {
                        return;
                    }

                    const transferAmount = link.store[RESOURCE_ENERGY] * (1 - LINK_LOSS_RATIO);

                    if ((freeCapacity - transferAmount >= 0 || link.isFull() && freeCapacity >= 500) && link.transferEnergy(target) === OK) {
                        freeCapacity -= transferAmount;
                    }
                });
            }

            if (target2 && target2.store[RESOURCE_ENERGY] < 400 && source1) {
                source1.transferEnergy(target2);
            }

            break;
        }

        case 'E37S4': {
            target = links[3];
            // target2 = links[3];
            // source1 = links[0];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E39S9': {
            target = links[4];
            target2 = links[3];
            source1 = links[0];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E44S3': {
            target = links[1];
            target2 = links[5];
            source1 = links[0];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E47S8': {
            target = links[4];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E45S9': {
            target = links[4];
            target2 = links[1];
            source1 = links[0];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E38S14': {
            target = links[3];
            target2 = links[0];
            source1 = links[1];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E37S16': {
            target = links[3];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E44S17': {
            target = links[0];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E27S9': {
            target = links[0];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E23S5': {
            target = links[0];
            target2 = links[3];
            source1 = links[2];

            this.processRoom(target, target2, source1);

            break;

        }

        case 'E24S3': {
            target = links[5];
            // target2 = links[3];
            // source1 = links[2];

            this.processRoom(target, target2, source1);

            break;

        }


        // SHARD 2

        case 'E38S9': {
            target = links[4];
            target2 = links[2];
            source1 = links[0];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E42S11': {
            target = links[5];
            target2 = links[2];
            source1 = links[3];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E47S14': {
            target = links[5];
            target2 = links[0];
            source1 = links[1];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E37S5': {
            target = links[5];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E48S9': {
            target = links[5];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E49S16': {
            target = links[4];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E35S8': {
            target = links[5];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E42S13': {
            target = links[2];
            target2 = links[1];
            source1 = links[0];

            if (target && target.store[RESOURCE_ENERGY] < 400) {
                let freeCapacity = target.store.getFreeCapacity(RESOURCE_ENERGY);

                _.forEach(this.room.links, (link) => {
                    if (freeCapacity <= 50) {
                        return false;
                    }

                    if (link.cooldown > 0 || link === target || link === target2 || link.store[RESOURCE_ENERGY] < 50) {
                        return;
                    }

                    const transferAmount = link.store[RESOURCE_ENERGY] * (1 - LINK_LOSS_RATIO);

                    if ((freeCapacity - transferAmount >= 0 || link.isFull() && freeCapacity >= 500) && link.transferEnergy(target) === OK) {
                        freeCapacity -= transferAmount;
                    }
                });
            }

            if (target2 && target2.store[RESOURCE_ENERGY] < 600 && source1) {
                source1.transferEnergy(target2);
            }

            break;
        }

        case 'E47S11': {
            target = links[2];
            target2 = links[3];
            source1 = links[0];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E35S3': {
            target = links[5];
            target2 = links[1];
            source1 = links[0];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E45S18': {
            target = links[5];
            target2 = links[1];
            source1 = links[2];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E42S15': {
            target = links[4];
            target2 = links[5];
            source1 = links[1];

            this.processRoom(target, target2, source1);

            break;
        }

        case 'E32S5': {
            target = links[0];
            target2 = links[3];
            source1 = links[2];

            this.processRoom(target, target2, source1);

            break;
        }

        // SHARD 3

        case 'E39S11': {
            target = links[5];

            this.processRoom(target, target2, source1);

            break;
        }
    }
};

Link.processRoom = function(target, target2, source1) {
    if (target && target.store[RESOURCE_ENERGY] < 400) {
        let freeCapacity = target.store.getFreeCapacity(RESOURCE_ENERGY);

        _.forEach(this.room.links, (link) => {
            if (freeCapacity <= 50) {
                return false;
            }

            if (link.cooldown > 0 || link === target || link === target2 || link.store[RESOURCE_ENERGY] < 50) {
                return;
            }

            const transferAmount = link.store[RESOURCE_ENERGY] * (1 - LINK_LOSS_RATIO);

            if ((freeCapacity - transferAmount >= 0 || link.isFull() && freeCapacity >= 500) && link.transferEnergy(target) === OK) {
                freeCapacity -= transferAmount;
            }
        });
    }

    if (target2 && target2.store[RESOURCE_ENERGY] < 400 && source1) {
        source1.transferEnergy(target2);
    }
};

module.exports = Link;
