
class Visual {

    static run(room) {
        this.room = room;
        this.controller = this.room.controller;
        this.visual = this.room.visual || new RoomVisual(this.room.name);

        this.drawHUD();
        // this.drawSources();
        this.drawSpawns();
        this.drawTowers();
        this.drawLinks();
        this.drawLabs();
        this.drawFactory();

        if (Game.time % 5 === 0) {
            this.drawController();
        }
    };

    // get methods

    static getPercents(now, max) {
        return Math.floor(now * 100 / max);
    }

    static getLabColor(resourceType) {
        switch (resourceType) {
            case 'X': return '#ff2200';
            case 'H':
            case 'O':
            case 'OH':
            case 'ZK':
            case 'UL':
                return '#999';
                break;
            default:
                if (resourceType.indexOf('G') >= 0) {
                    return '#fff';
                } else if (resourceType.indexOf('K') >= 0) {
                    return '#E324A7';
                } else if (resourceType.indexOf('L') >= 0) {
                    return '#24E360';
                } else if (resourceType.indexOf('U') >= 0) {
                    return '#2447E3';
                } else if (resourceType.indexOf('Z') >= 0) {
                    return '#E3C024';
                }
                break;
        }
    }

    // draw methods

    static drawSpawnEnergy() {
        if (this.room.level < 2) {
            return;
        }

        const available = this.room.energyAvailable;
        const capacity = this.room.energyCapacityAvailable;
        const percents = this.room.energyPercents;
        const style = {
            align: 'left',
            font: 0.6,
            stroke: '#000000',
            strokeWidth: 0.2,
            backgroundColor: '#5C5E5E',
            backgroundPadding: 0.2,
            opacity: 0.7,
        };

        if (percents === 100) {
            style.backgroundColor = '#69E83F';
        } else if (percents < 30) {
            style.backgroundColor = '#E6A429';
        }

        this.visual.text('Energy: ' + available + '/' + capacity + ' (' + percents + '%)', 0, 0, style);
    }

    static drawStorage() {
        const storage = this.room.storage;

        if (storage) {
            const store = this.room.storageUsedCapacity;

            let percents = 100;

            if (store > 0 && store !== STORAGE_CAPACITY) {
                percents = this.getPercents(store, storage.storeCapacity || STORAGE_CAPACITY);
            }

            if (percents === 0 && store > 0) {
                percents = 1;
            }

            if (store === 0) {
                percents = 0;
            }

            this.visual.text(percents + '%', storage.pos.x, storage.pos.y - 0.75, {
                font: 0.6,
                stroke: '#000000',
                strokeWidth: 0.2,
                backgroundColor: '#5C5E5E',
                backgroundPadding: 0.15,
                opacity: 0.6,
            });
        }
    }

    static drawTerminal() {
        const terminal = this.room.terminal;

        if (terminal) {
            const store = this.room.terminalUsedCapacity;
            let percents = 100;

            if (store < TERMINAL_CAPACITY) {
                percents = this.getPercents(store, terminal.storeCapacity || TERMINAL_CAPACITY);
            }

            if (percents === 0 && store > 0) {
                percents = 1;
            }

            this.visual.text(percents + '%', terminal.pos.x, terminal.pos.y - 0.75, {
                font: 0.6,
                stroke: '#000000',
                strokeWidth: 0.2,
                backgroundColor: '#5C5E5E',
                backgroundPadding: 0.15,
                opacity: 0.6,
            });
        }
    }

    static drawFactory() {
        if (this.room.level < 7) {
            return;
        }

        const factory = this.room.factory;

        if (!factory || factory.cooldown === 0) {
            return;
        }

        const style = { font: 0.55, stroke: '#000000', strokeWidth: 0.2 };

        this.visual.text((factory.cooldown - 1).toString(), factory.pos.x, factory.pos.y - 0.4, style);
    }

    static drawHUD() {
        if (Game.time % 4 > 0) {
            this.drawStorage();
            this.drawTerminal();
        }

        this.drawSpawnEnergy();
        this.drawEnemies();
    }

    static drawEnemies() {
        const enemiesLength = this.room.enemies.length;

        if (enemiesLength > 0) {
            this.visual.text('Enemies: ' + enemiesLength, 0, 1, {
                align: 'left',
                font: 0.6,
                stroke: '#000000',
                strokeWidth: 0.2,
                backgroundColor: '#ff0000',
                backgroundPadding: 0.2,
                opacity: 0.7,
            });
        }
    }

    static drawSources() {
        const sources = this.room._sources;

        if (sources.length > 0) {
            const style = {
                color: '#ffff00',
                font: 0.6,
                opacity: 0.7,
                stroke: '#000000',
                strokeWidth: 0.2,
            };

            sources.forEach((source) => {
                this.visual.text(source.energy.toString(), source.pos.x + 0.55, source.pos.y, style);
            });
        }
    }

    static drawSpawns() {
        const style = {
            font: 0.55,
            stroke: '#000000',
            strokeWidth: 0.2,
        };

        this.room.spawns.forEach((spawn) => {
            if (!spawn.my || !spawn.spawning) {
                return;
            }

            const spawning = spawn.spawning;

            this.visual.text(spawning.name + ' (' + (spawning.needTime - spawning.remainingTime + 1) + '/' + spawning.needTime + ')', spawn.pos.x, spawn.pos.y - 1, style);
        });
    }

    static drawTowers() {
        const style = {
            font: 0.6,
            opacity: 0.8,
            stroke: '#000000',
            strokeWidth: 0.2
        };

        this.room.towers.forEach((tower) => {
            this.visual.text(tower.energy.toString(), tower.pos.x, tower.pos.y - 0.5, style);
        });
    }

    static drawLinks() {
        if (this.room.level < 5) {
            return;
        }

        const style = { font: 0.55, stroke: '#000000', strokeWidth: 0.2 };

        this.room.links.forEach((link) => {
            if (link.cooldown === 0) {
                return;
            }

            this.visual.text((link.cooldown - 1).toString(), link.pos.x, link.pos.y - 0.4, style);

            if (link.energy > 0) {
                this.visual.text(link.energy.toString(), link.pos.x, link.pos.y + 0.1, { ...style, font: 0.3 });
            }
        });
    }

    static drawLabs() {
        const style = {
            font: 0.25,
            stroke: '#000000',
            strokeWidth: 0.2,
            backgroundColor: '#5C5E5E',
            backgroundPadding: 0.15,
            opacity: 0.6,
        };

        this.room.labs.forEach((lab) => {
            if (lab.mineralAmount === 0) {
                if (lab.cooldown > 0) {
                    this.visual.text(`${Math.max(0, lab.cooldown - 1)}`, lab.pos.x, lab.pos.y, { ...style, font: 0.5 });
                }

                return;
            }

            const color = this.getLabColor(lab.mineralType);

            this.visual.rect(lab.pos.x - 0.5, lab.pos.y - 0.5, 1, 1, { fill: color });
            this.visual.text(`${lab.mineralAmount}, ${lab.energy}`, lab.pos.x, lab.pos.y - 0.2, style);
            this.visual.text(`${lab.mineralType}, ${Math.max(0, lab.cooldown - 1)}`, lab.pos.x, lab.pos.y + 0.2, { ...style, color });
        });
    }

    static drawController() {
        const controller = this.controller;

        if (controller.level < 8) {
            const percents = this.getPercents(controller.progress, controller.progressTotal);

            this.visual.text(percents + ' %', controller.pos, {
                color: '#00ff00',
                font: 0.99,
                stroke: '#000000',
                strokeWidth: 0.2,
            });
        }
    }

}

module.exports = Visual;
