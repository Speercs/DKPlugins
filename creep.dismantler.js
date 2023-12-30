
function Dismantler() {}

Dismantler.OBJECTS = {
    E43S16: ['5f9493f8865830bba410510b']
};

Dismantler.run = function(creep) {
    this.creep = creep;
    this.room = creep.room;
    this.newRole = null;

    this.update();

    return this.newRole;
};

/**
 * @returns {Object | null}
 */
Dismantler.findTask = function(ignoredId) {
    if (this.creep.getActiveBodyparts(WORK) === 0) {
        this.creep.wait(5);

        return null;
    }

    const objects = (this.OBJECTS[this.room.name] || []).reduce((acc, id) => {
        if (id === ignoredId) {
            return acc;
        }

        const object = Game.getObjectById(id);

        if (object) {
            acc.push(object);
        }

        return acc;
    }, []);

    if (objects.length === 0) {
        this.newRole = 'recycler';

        return null;
    }

    const object = this.creep.pos.findClosestByPath(objects);

    if (object) {
        return { id: object.id };
    }

    this.creep.wait(3);

    return null;
};

Dismantler.processTask = function(task) {
    const object = Game.getObjectById(task.id);

    if (object) {
        if (object.room.name === this.creep.room.name) {
            const result = this.creep.dismantle(object);

            if (result === ERR_NOT_IN_RANGE) {
                this.creep.travelTo(object, { maxRooms: 1, ignoreCreeps: false });
                this.creep.dismantle(object);

                const visual = this.room.visual;

                if (visual) {
                    visual.circle(object.pos, {
                        radius: 0.5,
                        stroke: '#D4F01D',
                        strokeWidth: .15,
                        opacity: 0.2
                    });
                }
            }
        } else {
            delete this.creep.memory.task;
        }
    } else {
        delete this.creep.memory.task;
    }
};

Dismantler.update = function() {
    let task = this.creep.memory.task;

    if (!task) {
        task = this.findTask();

        if (task) {
            this.creep.memory.task = task;
        }

        if (this.newRole) {
            return;
        }
    }

    if (task) {
        this.processTask(task);

        if (!this.creep.memory.task) {
            const newTask = this.findTask(task.id);

            if (newTask) {
                this.creep.memory.task = newTask;

                if (!this.newRole) {
                    this.processTask(newTask);
                }
            }
        }
    }
};

module.exports = Dismantler;
