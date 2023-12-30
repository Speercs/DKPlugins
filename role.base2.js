class RoleBase {

    static run(creep) {
        this.creep = creep;
        this.room = creep.room;

        this.check();
        this.process();
    }

    static check() {
        if (!this.creep.memory.tasks) {
            this.creep.memory.tasks = {};
        }

        if (!this.creep.memory.state) {
            this.creep.memory.state = this.INITIAL_STATE;
        }
    }

    static initializeTask(task) {

    }

    //

    static findBoostTask() {
        // const boosts = this.creep.memory.boosts;
        //
        // if (boosts.length === 0) {
        //     return this.NEXT_STATES[ROLE_STATES.BOOST];
        // }

        const parts = Object.keys(this.BOOSTS);

        if (parts.length === 0) {
            return this.NEXT_STATES[ROLE_STATES.BOOST];
        }

        const boost = this.BOOSTS[parts[0]];

        let labs = _.filter(this.room.labs, (lab) => {
            return lab.store[RESOURCE_ENERGY] >= LAB_BOOST_ENERGY && lab.store[boost] >= LAB_BOOST_MINERAL;
        });

        if (labs.length > 1) {
            labs.sort((a, b) => b.store[boost] - a.store[boost]);
        }

        const lab = labs[0];

        if (!lab) {
            return this.NEXT_STATES[ROLE_STATES.BOOST];
        }

        return null;
    }

    static findFromTask() {
        return null;
    }

    static findToTask() {
        return null;
    }

    //

    static findTask(state) {
        let newState = null;

        do {
            switch (state) {
                case ROLE_STATES.BOOST:
                    newState = this.findBoostTask(state);
                    break;
                case ROLE_STATES.FROM:
                    newState = this.findFromTask(state);
                    break;
                case ROLE_STATES.TO:
                    newState = this.findToTask(state);
                    break;
            }
        } while (newState);
    }

    //

    static processBoostTask(task, state, lastState) {
        const boosts = task.boosts;

        if (!boosts || boosts.length === 0) {
            return task.nextState || this.NEXT_STATES[state];
        }

        return null;
    }

    static processFromTask() {}

    static processToTask() {}

    //

    static processTask(task, state, lastState) {
        switch (state) {
            case ROLE_STATES.BOOST:
                return this.processBoostTask(task, state, lastState);
            case ROLE_STATES.FROM:
                return this.processFromTask(task, state, lastState);
            case ROLE_STATES.TO:
                return this.processToTask(task, state, lastState);
        }

        return null;
    }

    static process() {
        let lastState;
        let newState;

        do {
            const state = this.creep.memory.state;
            let task = this.creep.memory.tasks[state];

            lastState = null;
            newState = null;

            if (!task) {
                // task = this.findTask(state);
                newState = this.findTask(state);

                // if (task) {
                //     this.creep.memory.tasks[state] = task;
                //
                //     this.initializeTask(task);
                // }

                // if (task) {
                //     newState = this.processTask(task, state, lastState);
                //
                //     if (newState) {
                //         this.creep.memory.lastState = state;
                //         this.creep.memory.state = newState;
                //     }
                // }
            }
        } while (newState);
    }

}

RoleBase.INITIAL_STATE = ROLE_STATES.BOOST;

RoleBase.NEXT_STATES = {};

RoleBase.BOOSTS = {};

module.exports = RoleBase;
