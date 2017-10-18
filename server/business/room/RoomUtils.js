const ROOMS = {}
const ROOM_MAP = {}
const Room = require('./Room')

const create = (config) => {
    const room = new Room(generateRoomId(), config)
    ROOMS[room.id] = room
    ROOM_MAP[config.host] = room
    return room;
}

const registerUser = (userId, roomId) => {
    const room = ROOM_MAP[roomId]
    if (room) {
        ROOM_MAP[userId] = room
    }
    return !!room
}

const destroy = id => { delete ROOMS[id] }

const findById = id => ROOMS[id]

const findByUser = userId => ROOM_MAP[userId]

const ROOM_ID_LENGTH = 4

const generateRoomId = () => {
    var id = ""
    for (var i = 0; i < ROOM_ID_LENGTH; i++) {
        id += Math.floor(Math.random() * 10)
    }
    return !!ROOMS[id] ? generateRoomId() : id
}

const getRooms = () => ROOMS

const getRoomMap = () => ROOM_MAP

module.exports = { create, registerUser, destroy, findById, findByUser, getRooms, getRoomMap }