
class RoleBase {

    // properties

    /**
     * @readonly
     * @static
     * @type {Cache}
     * @memberof RoleBase
     * @returns {Cache}
     */
    static get cache() {
        if (this._cache === undefined) {
            this._cache = {};
        }

        if (this._cache[this.room.name] === undefined) {
            this._cache[this.room.name] = new (ModuleManager.get('cache.base'))();
        }

        return this._cache[this.room.name];
    }

    // methods

    /**
     * @param {Creep | PowerCreep} creep
     */
    static run(creep) {
        this.creep = creep;
        this.room = creep.room;

        this.newRole = null;

        this.update();

        return this.newRole;
    }

    static initializeTask(task) {
        if (task.to) {
            const structure = Game.getObjectById(task.to.id);

            if (structure && typeof structure.requestCapacity === 'function') {
                structure.requestCapacity({ creep: this.creep.name, resourceType: task.resourceType, amount: task.to.amount });
            }
        }

        if (task.from) {
            const structure = Game.getObjectById(task.from.id);

            if (structure && typeof structure.requestResource === 'function') {
                structure.requestResource({ creep: this.creep.name, resourceType: task.resourceType, amount: task.from.amount });
            }
        }

        task.state = task.state || 'from';
    }

    static clearTask(task) {
        if (task.to) {
            const structure = Game.getObjectById(task.to.id);

            if (structure && typeof structure.releaseCapacity === 'function') {
                structure.releaseCapacity({ creep: this.creep.name, resourceType: task.resourceType });
            }
        }

        if (task.from) {
            if (Array.isArray(task.from)) {
                _.forEach(task.from, (data) => {
                    const structure = Game.getObjectById(data.id);

                    if (structure && typeof structure.releaseResource === 'function') {
                        structure.releaseResource({ creep: this.creep.name, resourceType: task.resourceType });
                    }
                });
            } else {
                const structure = Game.getObjectById(task.from.id);

                if (structure && typeof structure.releaseResource === 'function') {
                    structure.releaseResource({ creep: this.creep.name, resourceType: task.resourceType });
                }
            }
        }

        delete this.creep.memory.task;
        delete this.creep.memory.trav;
    }

    /**
     * @static
     * @param {Object} task
     * @return {Boolean}
     */
    static isValid(task) {
        if (task.state === 'wait' && task.w === 0) {
            return false;
        }

        return true;
    }

    /**
     * @param {Object} task
     * @returns {Object}
     */
    static getTravelOptions(task) {
        return { maxRooms: 1 };
    }

    /**
     * @param structure
     */
    static moveToStructure(structure, task, options = {}) {
        this.creep.travelTo(structure, { ...this.getTravelOptions(task), ...options });

        const color = task.state === 'from' ? '#ff0000' : '#0000ff';

        this.room.visual.circle(structure.pos, {
            radius: 0.75,
            stroke: color,
            strokeWidth: .15,
            opacity: 0.2
        });
    }

    /**
     * @param {Object} target
     * @param {Object} task
     * @param {Object} [options={}]
     */
    static moveToTarget(target, task, options = {}) {
        this.creep.travelTo(target, { ...this.getTravelOptions(task), ...options });

        const color = task.state === 'from' ? '#ff0000' : '#0000ff';

        this.room.visual.circle(target.pos, {
            radius: 0.75,
            stroke: color,
            strokeWidth: .15,
            opacity: 0.2
        });
    }

    static healSelf() {
        if (this.creep.getActiveBodyparts(HEAL) > 0) {
            this.creep.heal(this.creep);
        }
    }

    /**
     * @param {Structure[]} structures
     * @param {String} resourceType
     * @param {Number} [amount=1]
     *
     * @returns {Structure | null}
     */
    static getNearestStructureByResource(structures, resourceType, amount = 1) {
        const filtered = structures.filter((s) => {
            return s && !(this.BLOCKED_STRUCTURES[this.room.name] || []).includes(s.id)
                && s.getResourceAmount(resourceType) >= amount;
        });

        if (filtered.length > 1) {
            return this.creep.pos.findClosestByPath(filtered);
        }

        return filtered[0] || null;
    }

    /**
     * @param {Structure[]} structures
     * @param {String} resourceType
     * @param {Number} [capacity=1]
     *
     * @returns {Structure | null}
     */
    static getNearestStructureByCapacity(structures, resourceType, capacity = 1) {
        const filtered = structures.filter(s => s && s.getCapacity(resourceType) >= capacity);

        if (filtered.length > 1) {
            return this.creep.pos.findClosestByPath(filtered);
        }

        return filtered[0] || null;
    }

    /**
     * @param {Structure[]} structures
     * @param {String} resourceType
     * @param {Number} [amount=1]
     *
     * @returns {Structure | null}
     */
    static findStructureByResource(structures, resourceType, amount = 1) {
        const filtered = structures.filter(s => s && s.getResourceAmount(resourceType) >= amount);

        if (filtered.length > 1) {
            let structure = null;
            let maxAmount = 0;

            for (const s of filtered) {
                const resourceAmount = s.getResourceAmount(resourceType);

                if (resourceAmount > maxAmount) {
                    maxAmount = resourceAmount;
                    structure = s;
                }
            }

            return structure;
        }

        return filtered[0] || null;
    }

    /**
     * @param {Structure[]} structures
     * @param {String} resourceType
     * @param {Number} [amount=1]
     *
     * @returns {Structure | null}
     */
    static findStructureByCapacity(structures, resourceType, amount = 1) {
        const filtered = structures.filter(s => s && s.getCapacity(resourceType) >= amount);

        if (filtered.length > 1) {
            let structure = null;
            let maxAmount = 0;

            for (const s of filtered) {
                const capacity = s.getCapacity(resourceType);

                if (capacity > maxAmount) {
                    maxAmount = capacity;
                    structure = s;
                }
            }

            return structure;
        }

        return filtered[0] || null;
    }

    // TODO: ?
    static getNearestSpawn() {
        const spawns = this.room.spawns.filter(s => !s.spawning);

        if (spawns.length > 1) {
            return this.creep.pos.findClosestByPath(spawns);
        }

        return spawns[0];
    }

    //

    /**
     * @static
     * @param {Number} requiredAmount
     * @param {Object} task
     * @return {Number}
     */
    static calculateWithdrawAmount(requiredAmount, task) {
        const creepCapacity = this.creep.store.getFreeCapacity();
        let amount = requiredAmount;

        if (amount === undefined || amount > creepCapacity) {
            amount = creepCapacity;
        }

        return amount;
    }

    //

    /**
     * @static
     * @param {Number} amount
     * @param {Structure} structure
     * @param {String} resourceType
     * @param {Object} task
     */
    static onWithdrawSuccess(amount, structure, resourceType, task) {
    }

    //

    /**
     * @param {Structure[]} structures
     * @param {String} resourceType
     * @param {Number} amount
     * @returns {Object[]}
     */
    static getStructures(structures, resourceType, amount) {
        const filtered = _.reduce(structures, (acc, structure) => {
            if (!structure || amount === 0) {
                return acc;
            }

            const store = structure.getResourceAmount(resourceType);

            if (store > 0) {
                if (store > amount) {
                    acc.push({ id: structure.id, amount });

                    amount = 0;
                } else {
                    acc.push({ id: structure.id, amount: store });

                    amount -= store;

                    amount = Math.max(0, amount);
                }
            }

            return acc;
        }, []);

        // if (filtered.length > 1) {
        //     const structure = this.creep.pos.findClosestByPath(filtered);
        //
        //     _.pull(filtered, structure);
        //
        //     filtered.unshift(structure);
        // }

        return filtered;
    }

    // process methods

    static processToState(task) {
        const to = task.to;
        const structure = Game.getObjectById(to.id);

        if (!structure) {
            this.clearTask(task);

            return null;
        }

        const resourceType = task.resourceType || RESOURCE_ENERGY;
        const amount = Math.min(this.creep.store[resourceType], to.amount);
        let result = ERR_NOT_ENOUGH_RESOURCES;

        if (amount > 0) {
            result = this.creep.transfer(structure, resourceType, amount);
        }

        if (result === OK) {
            if (task.to.amount > amount) {
                task.to.amount -= amount;

                structure.releaseCapacity({ creep: this.creep.name, resourceType, amount });

                task.state = 'from';

                return task.state;
            } else {
                this.clearTask(task);
            }
        } else if (result === ERR_NOT_IN_RANGE || result === ERR_NOT_ENOUGH_RESOURCES && task.lastState === 'from' && amount === 0) {
            delete task.lastState;

            this.moveToStructure(structure, task);
        } else if (result === ERR_FULL) {
            // TODO: положить ресурс обратно ?
            this.clearTask(task);
        } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
            this.clearTask(task);
        }

        return null;
    }

    static processFromState(task) {
        const from = task.from;

        if (!from) {
            this.clearTask(task);

            return null;
        }

        const structure = Game.getObjectById(from.id);

        if (!structure) {
            this.clearTask(task);

            return null;
        }

        if (this.creep.hits < this.creep.hitsMax) {
            this.healSelf();
        }

        const resourceType = task.resourceType || RESOURCE_ENERGY;
        const amount = this.calculateWithdrawAmount(from.amount, task);
        const result = this.creep.withdraw(structure, resourceType, amount);

        if (result === OK) {
            this.onWithdrawSuccess(amount, structure, resourceType, task);

            structure.releaseResource({ creep: this.creep.name, resourceType, amount });

            if (from.amount > amount) {
                task.from.amount -= amount;
            }

            if (!task.to) {
                this.clearTask(task);

                return null;
            }

            if (amount >= task.to.amount) {
                delete task.from;
            }

            const to = Game.getObjectById(task.to);

            if (to && this.creep.pos.getRangeTo(to) > 2) {
                return null;
            }

            task.lastState = task.state;
            task.state = 'to';

            return task.state;
        } else if (result === ERR_NOT_IN_RANGE) {
            this.moveToStructure(structure, task);
        } else if (result === ERR_NOT_ENOUGH_RESOURCES || result === ERR_FULL) {
            this.clearTask(task);
        }

        return null;
    }

    static processMoveState(task) {
        let { pos } = task.to;

        if (!pos) {
            this.clearTask(task);

            return null;
        }

        pos = new RoomPosition(
            (pos.x !== undefined ? pos.x : 25),
            (pos.y !== undefined ? pos.y : 25),
            pos.roomName || this.room.name);

        if (!this.creep.pos.isEqualTo(pos)) {
            this.creep.travelTo(pos, this.getTravelOptions(task));
        } else {
            // if (task.nextState) {
            //     task.state = task.nextState;
            //
            //     delete task.nextState;
            //
            //     return task.state;
            // }

            this.clearTask(task);
        }

        return null;
    }

    static processTravelState(task) {
        if (!task.to) {
            this.clearTask(task);

            return null;
        }

        if (this.creep.hits < this.creep.hitsMax) {
            this.healSelf();
        }

        const flag = Game.flags[task.to];
        const destination = flag || new RoomPosition(25, 25, task.to);

        if (this.creep.room.name === task.to) {
            if (this.creep.pos.isBorder() && this.creep.travelTo(destination, { range: 1 }) === OK) {
                this.clearTask(task);
            } else if (!this.creep.pos.isBorder()) {
                this.clearTask(task);
            }

            return null;
        }

        this.creep.travelTo(destination, { repath: 0.05, ...task.options });

        // if (this.creep.memory.lastTravel === undefined) {
        //     this.creep.memory.lastTravel = 0;
        // }
        //
        // this.creep.memory.lastTravel++;

        if (!Game.rooms[task.to]) {
            Shard.requestObserver(task.to, 10);
        }

        return null;
    }


    static processPickup(task) {}

    static processSuicideState(task) {}

    static processHarvestState(task) {}

    static processBuildState(task) {
        const to = task.to;

        if (!to) {
            this.clearTask(task);

            return null;
        }

        const construction = Game.getObjectById(to.id);

        if (construction) {
            const result = this.creep.build(construction);

            if (result === ERR_NOT_IN_RANGE) {
                this.moveToStructure(construction, task, { ignoreCreeps: false, range: 2 });

                const visual = this.room.visual;

                if (visual) {
                    visual.circle(construction.pos, {
                        radius: 0.5,
                        stroke: '#D4F01D',
                        strokeWidth: .15,
                        opacity: 0.2
                    });
                }
            } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
                this.clearTask(task);
            } else if (result === OK) {
                to.structureType = construction.structureType;
                to.progress = construction.progress;
                to.progressTotal = construction.progressTotal;

                if (this.creep.pos.getRangeTo(construction) === 3) {
                    this.moveToStructure(construction, task, { ignoreCreeps: false, range: 2 });

                    const visual = this.room.visual;

                    if (visual) {
                        visual.circle(construction.pos, {
                            radius: 0.5,
                            stroke: '#D4F01D',
                            strokeWidth: .15,
                            opacity: 0.2
                        });
                    }
                }
            } else if (result === ERR_NO_BODYPART) {
                // TODO: отстрелили ? не было изначально ?
            }
        } else {
            const event = _.find(this.room.getEventLog(), { event: EVENT_BUILD, data: { targetId: to.id } });

            if (event && to.progress + event.amount >= to.progressTotal) {
                this.room.cache.clearStructuresCache(to.structureType);

                global.Traveler.clearCache(this.room.name);
            }

            this.clearTask(task);

            // if (this.room.constructionSites.length > 0) {
            //     const newTask = this.findTask(to.id);
            //
            //     if (newTask) {
            //         this.creep.memory.task = newTask;
            //
            //         this.processTask(newTask);
            //     }
            // }
        }

        return null;
    }

    static processRepairState(task) {}

    static processHealState(task) {}

    static processAttackState(task) {}

    static processDismantleState(task) {}

    static processRangedAttackState(task) {}

    static processRangedMassAttackState(task) {}

    static processAttackControllerState(task) {}

    static processClaimControllerState(task) {}

    static processReserveControllerState(task) {}

    static processSignControllerState(task) {}

    static processUpgradeControllerState(tasl) {}

    static processPullState(task) {}


    static processWaitState(task) {
        if (task.w > 0) {
            task.w--;

            this.creep.say(`wt - ${task.w}`);

            this.healSelf();
        }

        return null;
    }

    static processTask(task) {
        let nextState = task.state;

        do {
            switch (nextState) {
                case 'to':
                    nextState = this.processToState(task);
                    break;
                case 'from':
                    nextState = this.processFromState(task);
                    break;
                case 'move':
                    nextState = this.processMoveState(task);
                    break;
                case 'travel':
                    nextState = this.processTravelState(task);
                    break;
                case 'wait':
                    nextState = this.processWaitState(task);
                    break;
                case 'suicide':
                    nextState = this.processSuicideState(task);
                    break;
                case 'build':
                    nextState = this.processBuildState(task);
                    break;
                case 'harvest':
                    nextState = this.processHarvestState(task);
                    break;
                default:

                    break;
            }
        } while (nextState);
    }

    static update() {
        let task = this.creep.memory.task;

        if (task && !this.isValid(task)) {
            this.clearTask(task);

            task = null;
        }

        if (!task) {
            task = this.findTask();

            if (task) {
                this.initializeTask(task);

                this.creep.memory.task = task;

                // if (task.state !== 'wait' && task.state !== 'move') {
                //     console.log(linkRoom(this.room) + ' ' + JSON.stringify(task));
                // }
            }
        }

        if (task) {
            this.processTask(task);
        }
    }

}

RoleBase.BLOCKED_STRUCTURES = {
    E68S9: ['5898e8e8e1a287688da7a36e', '5890c2c5ef91b4b53e04efa7', '5d094743cec5537a547b9c82'],
    E68S8: ['58b46477a2c5a64d0ab8dda3'],
    E67S14: ['59f6e0512d4df73f2c317a9c'],
    E64S13: ['59c782f7948eb737c249418a'],

    E42S9: ['59fd9bdc7701763174aa5d08'],
    E37S16: ['5d5e3c7286cfad0df6821f6f'],

    E38S9: ['5a2680ed776bb86f5145b457'],
    E37S5: ['5b5c1d07c75ae85cbd841065'],
    E47S8: ['5b6de6dd592ca855c9ac3d55'],
    E48S9: ['5bdea98d0f16fc40296141a6'],
    E49S16: ['5bea9039b4a5532a2daea96f'],
    E35S8: ['5c2332d1a28f31206119a70f'],
    E39S11: ['5c39902d0d40bf24655ce039', '5c987af53be07b5d65fd8cf9'],
    E42S15: ['5cbb7217cdd70d74dc7359dd'],
};

module.exports = RoleBase;
