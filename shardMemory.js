
/**
 * @class ShardMemory
 */
global.ShardMemory = class {

    /**
     * @static
     */
    static initialize() {
        for (let i = 0; i < 4; i++) {
            const shard = `shard${i}`;

            if (shard !== Game.shard.name) {
                this[`_${shard}`] = undefined;
            }
        }
    }

    /**
     * @static
     */
    static clear() {
        this.memory = {
            creeps: {}
        };
    }

    /**
     * @static
     */
    static check() {
        const memory = this.memory;

        memory.creeps = _.reduce(memory.creeps, (acc, value, key) => {
            if (value.expiredAt > Game.time) {
                acc[key] = value;
            }

            return acc;
        }, {});

        this.refresh();
    }

    /**
     * @static
     * @param {String} [shardName=Game.shard.name]
     */
    static print(shardName) {
        console.log(JSON.stringify(this[shardName || Game.shard.name]));
    }

    /**
     * @static
     */
    static update() {
        if (this._needRefresh) {
            this.check();

            InterShardMemory.setLocal(JSON.stringify(this.memory));

            this._needRefresh = false;
        }
    }

    // find

    static findCreepMemory(creep) {
        let memory;

        if (Game.shard.name === 'shard0') {
            memory = this.shard1;
        } else if (Game.shard.name === 'shard3') {
            memory = this.shard2;
        } else {
            const shardIndex = this.shardIndex;

            memory = this[`shard${shardIndex - 1}`];

            if (memory.creeps && memory.creeps[creep.name]) {
                return memory.creeps[creep.name].memory;
            }

            memory = this[`shard${shardIndex + 1}`];

            if (memory.creeps && memory.creeps[creep.name]) {
                return memory.creeps[creep.name].memory;
            }
        }

        if (memory.creeps && memory.creeps[creep.name]) {
            return memory.creeps[creep.name].memory;
        }

        return null;

        // const shard = Game.shard.name;
        // const parts = creep.nameParts;
        // const targetShard = parts[3] || 'shard3';
        // const shardIndex = this.shardIndex;
        // let memory = null;
        //
        // if (targetShard > shard || targetShard === shard && targetShard === 'shard3') {
        //     memory = this[`shard${shardIndex - 1}`];
        // } else {
        //     memory = this[`shard${shardIndex + 1}`];
        // }
        //
        // return memory.creeps[creep.name] && memory.creeps[creep.name].memory;
    }

    /**
     * @static
     */
    static refresh() {
        this.memory = this.memory;
    }

    // properties

    /**
     * @static
     * @memberof ShardMemory
     * @returns {Number}
     */
    static get shardIndex() {
        if (this._shardIndex === undefined) {
            this._shardIndex = Number(_.last(Game.shard.name));
        }

        return this._shardIndex;
    }

    // memory

    /**
     * @static
     * @memberof ShardMemory
     * @returns {Object}
     */
    static get memory() {
        return this[Game.shard.name];
    }

    static set memory(value) {
        this[Game.shard.name] = value;
    }

    // shard 0

    /**
     * @static
     * @memberof ShardMemory
     * @returns {Object}
     */
    static get shard0() {
        if (!this._shard0) {
            this._shard0 = JSON.parse(InterShardMemory.getRemote('shard0') || '{}');
        }

        return this._shard0;
    }

    static set shard0(value) {
        this._shard0 = value;

        this._needRefresh = true;
    }

    // shard 1

    /**
     * @static
     * @memberof ShardMemory
     * @returns {Object}
     */
    static get shard1() {
        if (!this._shard1) {
            this._shard1 = JSON.parse(InterShardMemory.getRemote('shard1') || '{}');
        }

        return this._shard1;
    }

    static set shard1(value) {
        this._shard1 = value;

        this._needRefresh = true;
    }

    // shard 2

    /**
     * @static
     * @memberof ShardMemory
     * @returns {Object}
     */
    static get shard2() {
        if (!this._shard2) {
            this._shard2 = JSON.parse(InterShardMemory.getRemote('shard2') || '{}');
        }

        return this._shard2;
    }

    static set shard2(value) {
        this._shard2 = value;

        this._needRefresh = true;
    }

    // shard 3

    /**
     * @static
     * @memberof ShardMemory
     * @returns {Object}
     */
    static get shard3() {
        if (!this._shard3) {
            this._shard3 = JSON.parse(InterShardMemory.getRemote('shard3') || '{}');
        }

        return this._shard3;
    }

    static set shard3(value) {
        this._shard3 = value;

        this._needRefresh = true;
    }

}

module.exports = global.ShardMemory;
