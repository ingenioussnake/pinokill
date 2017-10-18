const RoomService = require('./RoomService')

class Person {
    constructor(userInfo, offline) {
        this.userInfo = userInfo
        this.offline = offline
    }
}

class Room {
    constructor(id, options) {
        this.id = id
        this.host = options.host
        this.type = options.type
        this.game = createGame(options.type, options.config)
        this.size = options.size
        this.audience = {}
        this.seats = []
        this.seat_version = 0
        this.started = false
        this.service = new RoomService()
    }

    // register tunnelId to userInfo
    knock(userInfo, tunnelId) {
        const person = this.getPerson(userInfo.openId)
        if (person) {
            person.offline = true
            this.service.broadcast('people', {
                'person': userInfo,
                'type': 'offline'
            })
        }
        this.service.register(userInfo, tunnelId)
    }

    in(userInfo) {
        const userId = userInfo.openId
        this.service.broadcast('join', this.getInfo(), userId)
        let person = this.getPerson(userId), messageType
        if (person) {
            person.offline = false
            messageType = 'online'
        } else {
            person = new Person(userInfo, false)
            messageType = 'enter'
            this.audience[userId] = person
        }
        this.service.broadcast('people', {
            'person': userInfo,
            'type': messageType
        })
    }

    out(userInfo) {
        this.service.unregister(userInfo.openId)
        const person = this.stand(userInfo.openId)
        this.service.broadcast('people', {
            'person': userInfo,
            'type': 'leave'
        })
    }

    kickout(userInfo) {
        this.service.close(userInfo.openId)
        const person = this.stand(userInfo.openId)
        this.service.broadcast('people', {
            'person': userInfo,
            'type': 'kickout'
        })
    }

    sit(userId, to) {
        if (!this.seats[to]) {
            this.seats[to] = this.stand(userId)
            this.service.broadcast('seat', {
                'version': ++this.seat_version,
                'seats': this.seats
            })
        }
    }

    stand(userId) {
        let person = this.audience[userId]
        if (!!person) {
            delete this.audience[userId]
        } else {
            let index = this.seats.map( person => !!person ? person.userInfo.openId : "" ).indexOf(userId)
            person = this.seats[index]
            this.seats[index] = null
        }
        return person
    }

    getPerson(userId) {
        return this.audience[userId] || this.seats.filter( person => !!person && person.userInfo.openId === userId )[0]
    }

    getInfo() {
        return {
            id: this.id,
            host: this.host,
            type: this.type,
            size: this.size,
            game: this.game.getInfo(),
            seats: this.seats,
            seat_version: this.seat_version,
            started: this.started
        }
    }
}

const createGame = (type, config) => {
    let game = null, Game = null
    if (type === 'werewolf') {
        Game = require('../game/Werewolf')
    } else if (type === 'avalon') {
        Game = require('../game/Avalon')
    }
    if (!!Game) {
        game = new Game(config)
    }
    return game
}

module.exports = Room