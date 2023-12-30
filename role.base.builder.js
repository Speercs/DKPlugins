const RoleBase = ModuleManager.get('role.base2');

class BuilderBase extends RoleBase {

    static findConstructionSite() {
        const constructionSites = this.room.constructionSites.filter(c => c.my);

        if (constructionSites.length === 0) {
            return null;
        }

        return this.creep.pos.findClosestByPath(constructionSites);
    }

    static findTask(state, lastState) {
        if (state === ROLE_STATES.BUILD) {
            return this.findBuildTask(state, lastState);
        }

        return RoleBase.findTask(...arguments);
    }

}

BuilderBase.NEXT_STATES = {
    [ROLE_STATES.BOOST]: ROLE_STATES.BUILD,
    [ROLE_STATES.BUILD]: ROLE_STATES.FROM,
    [ROLE_STATES.FROM]: ROLE_STATES.BUILD,
};

BuilderBase.BOOSTS = {
    [WORK]: RESOURCE_CATALYZED_LEMERGIUM_ACID
};

module.exports = BuilderBase;
