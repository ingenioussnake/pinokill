const Room = require("../entities/Room");

const roomMap = {}

const rooms = {}

const ROOM_ID_LENGTH = 4

const generateRoomId = () => {
    var id = ""
    for (var i = 0; i < ROOM_ID_LENGTH; i++) {
        id += Math.floor(Math.random() * 10)
    }
    return !!rooms[id] ? generateRoomId() : id
}

module.exports = {
    create: async (ctx, next) => {
        var room = new Room(generateRoomId(), ctx.req.body)
        rooms[room.id] = room;
        roomMap[ctx.state.$wxInfo.openId] = room.id
        ctx.body = id
    },
    join: function () {},
    update: function () {},
    quit: function () {},
    sit: function () {}
}
