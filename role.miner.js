const RoleBase = ModuleManager.get('role.base');

class Miner extends RoleBase {

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

    static getSource() {
        // if (this.room.name === 'E68S8' || this.room.name === 'E39S6' || Game.shard.name === 'shard1' && this.room.name === 'E37S5') {
        //     const source = this.room.links[this.creep.nameParts[1]];
        //
        //     if (!source) {
        //         return null;
        //     }
        //
        //     if (source.ticksToRegeneration > 0) {
        //         return
        //     }
        // }
        return this.room.links[this.creep.nameParts[1]];
    }

    // process

    static processHarvestState(task) {
        const source = task.source;

        if (!task.source) {
            this.clearTask(task);

            return null;
        }

        const result = this.creep.harvest(source);

        if (result === ERR_NOT_ENOUGH_RESOURCES) {
            this.clearTask(task);
        }

        return null;
    }

    // find

    static findTask() {
        let pos = this.creep.memory.pos;

        if (pos !== OK) {
            if (pos === undefined) {
                pos = this.findPos();

                if (pos) {
                    this.creep.memory.pos = { x: pos.x, y: pos.y };
                }
            }

            if (pos && (this.creep.pos.x !== pos.x || this.creep.pos.y !== pos.y)) {
                return {
                    to: { pos },
                    state: 'move',
                    options: { movingTarget: true }
                };
            } else {
                this.creep.memory.pos = OK;
            }
        }

        const source = this.getSource();

        if (!source) {
            Game.notify('source = null в комнате ' + this.room.name + ' ' + this.creep.name, 15);

            return null;
        }

        if (source.ticksToRegeneration > 0) {
            return { state: 'wait', wt: source.ticksToRegeneration };
        }

        return {
            source,
            state: 'harvest'
        };
    }

}

module.exports = Miner;
