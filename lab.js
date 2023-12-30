
function Lab() {
}

Lab.BOOSTS = {

};

Lab.findSourceLabs = function() {
    const labs = this.room.labs;
    let index = 1;

    labs.forEach((lab) => {
        if (lab.pos.findInRange(labs, 2).length === 10) {
            this.room.memory['labSource' + index] = lab.id;
            index++;
        }
    });
};

Lab.run = function(room) {
    this.room = room;

    const labSource1 = this.room.labSource1;
    const labSource2 = this.room.labSource2;

    if (!labSource1 || !labSource2) {
        delete this.room.memory.labSource1;
        delete this.room.memory.labSource2;

        this.findSourceLabs();

        return;
    }

    const reaction = this.room.memory.labReaction;

    if (!reaction || labSource1.mineralAmount < 5 || labSource2.mineralAmount < 5) {
        return;
    }

    this.room.filteredLabs.forEach((lab) => {
        if (lab.cooldown === 0) {
            lab.runReaction(labSource1, labSource2);
        }
    });
};

module.exports = Lab;
