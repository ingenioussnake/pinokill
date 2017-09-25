const Role = require("./Role")

var ROLES = {}

const Room = function (id, config) {
    this.id = id
    this.roles = config.roles
    this.count = config.roles.length
    this.enable_sherrif = config.enable_sherrif
    this.witch_self_rescue = config.witch_self_rescue
    this.beauty_deadlove_exile = config.beauty_deadlove_exile
    this.massacre = config.massacre
}

Room.prototype.assignRoles = () => {
    var roles = new Array(this.count)
    return roles;
}

const initRoles = (config_roles) => {
    var roles = [], i = 0
    for (; i < config_roles.length; i++) {
        roles[i] = new Role(ROLES[config_roles[i]]);
        if (config_roles[i].name === ROLES.thief.name) {
            config_roles.push(ROLES.village)
            config_roles.push(ROLES.village)
        }
    }
    return roles;
}

const randomRoles = roles => {
    return roles;
}

// const init = (ctx) => {
//     ROLES = ctx.app.__game_engine__.roles
// }

module.exports = Room
