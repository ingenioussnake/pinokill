const Role = require("./Role")

var ROLES = {}

var ROOMS = {}

const Room = function (config) {
    this.id = generateRoomId()
    this.host = config.host
    this.roles = config.roles
    this.count = config.roles.length
    this.enable_sheriff = config.enable_sheriff
    this.witch_self_rescue = config.witch_self_rescue
    this.beauty_deadlove_exile = config.beauty_deadlove_exile
    this.massacre = config.massacre
    this.players = []
}

Room.prototype.addPlayer = (userInfo, tunnelId) => {
    this.players.push({userInfo, tunnelId})
}

Room.prototype.removePlayer = userId => {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].userInfo.openId === userId) {
            break
        }
    }
    if (i < this.players.length) {
        this.players.splice(i, 1)
    }
}

Room.prototype.assignRoles = () => {
    var roles = new Array(this.count)
    return roles;
}

Room.create = config => {
    const room = new Room(config)
    ROOMS[room.id] = room
    return room;
}

Room.destroy = id => {
    delete ROOMS[id]
}

Room.find = id => ROOMS[id]

const initRoles = config_roles => {
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

const ROOM_ID_LENGTH = 4

const generateRoomId = () => {
    var id = ""
    for (var i = 0; i < ROOM_ID_LENGTH; i++) {
        id += Math.floor(Math.random() * 10)
    }
    return !!ROOMS[id] ? generateRoomId() : id
}

module.exports = Room
