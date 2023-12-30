
const TaskBase = ModuleManager.get('task.base');

class TaskMiner extends TaskBase {

    static getMaxCreeps() {
        if (this.room.name === 'E68S8' || this.room.name === 'E39S6' || Game.shard.name === 'shard1' && this.room.name === 'E37S5') {
            return 1;
        }

        return this.room.links.length;
    }

    static getCreepBody() {
        return [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
    }

    static findLinkPos(source) {
        const roomLinks = this.room.links;

        if (roomLinks.length > 0) {
            const link = source.pos.findInRange(roomLinks, 2)[0];

            if (link) {
                return RoomPosition.findCommonPos([source, link]);
            }
        }

        return null;
    }

    static findContainerPos(source) {
        const roomContainers = this.room.containers;

        if (roomContainers.length > 0) {
            const container = source.pos.findInRange(roomContainers, 1)[0];

            if (container) {
                return container.pos;
            }
        }

        return null;
    }

    static findConstructionContainerPos(source) {
        const construction = _.find(this.room.constructionSites,
            c => c.structureType === STRUCTURE_CONTAINER && source.pos.inRangeTo(c, 1));

        return construction ? construction.pos : null;
    }

    static findPos(source = this.getSource()) {
        if (!source) {
            Game.notify('pos = null в комнате ' + this.room.name + ' ' + this.creep.name, 15);

            return null;
        }

        if (this.room.level >= 5) {
            const linkPos = this.findLinkPos(source);

            if (linkPos) {
                return linkPos;
            }
        }

        const containerPos = this.findContainerPos(source);

        if (containerPos) {
            return containerPos;
        }

        const constructionContainerPos = this.findConstructionContainerPos(source);

        if (constructionContainerPos) {
            return constructionContainerPos;
        }

        Game.notify('pos = null в комнате ' + this.room.name + ' ' + this.creep.name, 15);

        return null;
    }

    static getPos() {
        let pos = this.creep.memory.pos;

        if (pos === undefined) {
            pos = this.findPos();

            if (pos) {
                this.creep.memory.pos = { x: pos.x, y: pos.y };

                return pos;
            }
        }

        return new RoomPosition(pos.x, pos.y, pos.roomName || this.room.name);
    }

    static getSource() {

    }

    static process() {
        let creeps = this.memory.creeps;

        if (!creeps) {
            this.memory.creeps = [];

            creeps = this.memory.creeps;
        }

        for (let i = 0, length = this.getMaxCreeps(); i < length; i++) {
            const creep = Game.creeps[creeps[i]];

            if (!creep) {
                creeps[i] = this.requestCreep(
                    this.getCreepName(this.TASK_NAME),
                    this.getCreepBody(),
                    this.getCreepMemory());

                continue;
            }

            if (creep.isWaiting()) {
                continue;
            }

            this.creep = creep;

            const pos = this.getPos();

            if (!creep.pos.isEqualTo(pos)) {
                creep.travelTo(pos, {
                    maxRooms: 1,
                    maxOps: 1000
                });
            }

            if (Game.time % 2 === i) {
                const source = this.getSource();
                const result = creep.harvest(source);

                if (result === OK) {
                    creep.wait(1);
                }
            } else {
                creep.wait(1);
            }
        }
    }

}

TaskMiner.TASK_NAME = 'miner';
TaskMiner.CREEP_TEMPLATE = 'miner-%0';

module.exports = TaskMiner;
