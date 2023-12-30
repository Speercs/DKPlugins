class TaskBase {

    static get memory() {
        const path = `tasks[${this.TASK_NAME}]`;
        let memory = _.get(this.room.memory, path);

        if (memory === undefined) {
            memory = _.set(this.room.memory, path, {})[path];
        }

        return memory;
    }

    static run(room) {
        this.room = room;

        this.process();
    }

    // static getCreepName() {
    //     return this.CREEP_TEMPLATE.format(...arguments);
    // }

    static getCreepBody() {
        return [];
    }

    static getCreepMemory() {
        return {};
    }

    static requestCreep(name, body, memory) {
        return this.room.requestCreep(name, body, memory);
    }

    static process() {
    }

}

module.exports = TaskBase;
