const RoleBase = ModuleManager.get('role.base.builder');

const STATE_BOOST = 'boost';
const STATE_TRAVEL = 'travel';
const STATE_BUILD = 'build';
const STATE_FROM = 'from';

class RemoteBuilder extends RoleBase {

}

RemoteBuilder.NEXT_STATE[STATE_BOOST] = STATE_TRAVEL;

module.exports = RemoteBuilder;
