
function Booster() {
}

Booster.run = function(room, creep) {
    this.room = room;
    this.creep = creep;
    this.boosts = creep.memory.boosts;
    this.newRole = null;
    this.moveToLab();
    return this.newRole;
};

Booster.filterLabs = function(mineralAmount, energyAmount, boost, lab) {
    return lab.store[lab.mineralType] >= mineralAmount && lab.store[RESOURCE_ENERGY] >= energyAmount && lab.mineralType === boost;
};

Booster.findBodyPart = function(boost) {
    switch (boost) {
        case RESOURCE_UTRIUM_HYDRIDE:
        case RESOURCE_UTRIUM_ACID:
        case RESOURCE_CATALYZED_UTRIUM_ACID:
            return ATTACK;
            break;

        case RESOURCE_UTRIUM_OXIDE:
        case RESOURCE_LEMERGIUM_HYDRIDE:
        case RESOURCE_ZYNTHIUM_HYDRIDE:
        case RESOURCE_GHODIUM_HYDRIDE:
        case RESOURCE_UTRIUM_ALKALIDE:
        case RESOURCE_LEMERGIUM_ACID:
        case RESOURCE_ZYNTHIUM_ACID:
        case RESOURCE_GHODIUM_ACID:
        case RESOURCE_CATALYZED_UTRIUM_ALKALIDE:
        case RESOURCE_CATALYZED_LEMERGIUM_ACID:
        case RESOURCE_CATALYZED_ZYNTHIUM_ACID:
        case RESOURCE_CATALYZED_GHODIUM_ACID:
            return WORK;
            break;

        case RESOURCE_KEANIUM_HYDRIDE:
        case RESOURCE_KEANIUM_ACID:
        case RESOURCE_CATALYZED_KEANIUM_ACID:
            return CARRY;
            break;

        case RESOURCE_KEANIUM_OXIDE:
        case RESOURCE_KEANIUM_ALKALIDE:
        case RESOURCE_CATALYZED_KEANIUM_ALKALIDE:
            return RANGED_ATTACK;
            break;

        case RESOURCE_LEMERGIUM_OXIDE:
        case RESOURCE_LEMERGIUM_ALKALIDE:
        case RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE:
            return HEAL;
            break;

        case RESOURCE_ZYNTHIUM_OXIDE:
        case RESOURCE_ZYNTHIUM_ALKALIDE:
        case RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE:
            return MOVE;
            break;

        case RESOURCE_GHODIUM_OXIDE:
        case RESOURCE_GHODIUM_ALKALIDE:
        case RESOURCE_CATALYZED_GHODIUM_ALKALIDE:
            return TOUGH;
            break;
    }
    return null;
};

Booster.findLab = function() {
    const boost = this.boosts[0];
    const part = this.findBodyPart(boost);
    const parts = this.creep.getActiveBodyparts(part);

    if (parts === 0) {
        return null;
    }

    const mineralAmount = LAB_BOOST_MINERAL * parts;
    const energyAmount = LAB_BOOST_ENERGY * parts;
    const labs = _.filter(this.room.labs, this.filterLabs.bind(this, mineralAmount, energyAmount, boost));

    if (labs) {
        return this.creep.pos.findClosestByPath(labs);
    }

    return null;
};

Booster.moveToLab = function() {
    let findNew = true;
    const labId = this.creep.memory.boostLabId;
    let lab = null;

    if (labId) {
        lab = Game.getObjectById(labId);

        if (lab && lab.mineralAmount >= 30 && lab.energy >= 20 && lab.mineralType === this.boosts[0]) {
            findNew = false;
        }
    }

    if (findNew) {
        this.creep.memory.boostLabId = '';

        lab = this.findLab();

        if (lab) {
            this.creep.memory.boostLabId = lab.id;
        }
    }

    if (!lab) {
        if (this.boosts.length > 1) {
            _.pull(this.creep.memory.boosts, this.boosts[0]);

            this.newRole = null;

            delete this.creep.memory.boostLabId;

            return;

        }

        this.newRole = 'getter';

        this.creep.memory.boosts = [];

        delete this.creep.memory.boostLabId;

        const roleAfterBoost = this.creep.memory.roleAfterBoost;

        if (roleAfterBoost) {
            this.newRole = roleAfterBoost;
        }

        return;
    }

    const result = lab.boostCreep(this.creep);

    if (result === ERR_NOT_IN_RANGE) {
        this.creep.travelTo(lab, { maxRooms: 1 });

        this.room.visual.circle(lab.pos, {
            radius: 0.75,
            stroke: '#ffffff',
            strokeWidth: .15,
            opacity: 0.2
        });
    } else {
        if (result === OK) {
            this.creep.memory.boosted = 1;

            delete this.creep.memory.boostLabId;
        }

        if (this.boosts.length > 1) {
            _.pull(this.creep.memory.boosts, this.boosts[0]);

            this.newRole = null;

            delete this.creep.memory.boostLabId;

            return;
        }

        delete this.creep.memory.boostLabId;

        this.creep.memory.boosts = [];

        this.newRole = this.creep.memory.roleAfterBoost || 'getter';
    }
};

module.exports = Booster;
