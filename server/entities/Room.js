const Role = require("./Role")

const ROLES = {}

const ROOMS = {}

class Room {
    constructor(config) {
        this.id = generateRoomId()
        this.host = config.host
        this.roles = config.roles
        this.count = config.roles.length
        this.enable_sheriff = config.enable_sheriff
        this.witch_self_rescue = config.witch_self_rescue
        this.beauty_deadlove_exile = config.beauty_deadlove_exile
        this.massacre = config.massacre
        this.audience = []
        this.players = []
        this.messages = []
        this.seat_version = 0
        this.started = false
    }

    in(userInfo, tunnelId) {
        this.audience.push({userInfo, tunnelId})
    }

    out(userId) {
        return this.stand(userId)
    }

    sit(userId, seat) {
        var person
        if (!this.players[seat] && (person = this.stand(userId))) {
            this.players[seat] = person
            return ++this.seat_version
        }
        return false
    }

    assignRoles() {
        var roles = new Array(this.count)
        return roles;
    }

    stand(userId) {
        const index = this.getPersonIndex(userId)
        var person = null
        if (index > -1) {
            if (index < this.audience.length) {
                person = this.audience.splice(index, 1)[0]
            } else {
                person = this.players[index - this.audience.length]
                this.players[index - this.audience.length] = null
            }
        }
        return person
    }

    getPersonIndex(userId) {
        const people = this.getAllPeople()
        for (var i = 0; i < people.length; i++) {
            if (!!people[i] && people[i].userInfo.openId === userId) {
                return i
            }
        }
        return -1
    }

    getAllPeople() {
        return this.audience.concat(this.players)
    }

    static create(config) {
        const room = new Room(config)
        ROOMS[room.id] = room
        return room;
    }

    static destroy(id) { delete ROOMS[id] }

    static find(id) { return ROOMS[id] }
}

// const initRoles = function (config_roles) {
//     var roles = [], i = 0
//     for (; i < config_roles.length; i++) {
//         roles[i] = new Role(ROLES[config_roles[i]]);
//         if (config_roles[i].name === ROLES.thief.name) {
//             config_roles.push(ROLES.village)
//             config_roles.push(ROLES.village)
//         }
//     }
//     return roles;
// }

// const randomRoles = function (roles) {
//     return roles;
// }

// const init = function (ctx) {
//     ROLES = ctx.app.__game_engine__.roles
// }

const ROOM_ID_LENGTH = 4

const generateRoomId = function () {
    var id = ""
    for (var i = 0; i < ROOM_ID_LENGTH; i++) {
        id += Math.floor(Math.random() * 10)
    }
    return !!ROOMS[id] ? generateRoomId() : id
}

module.exports = Room
