const GameUtils = require('./GameUtils')

class Player {
    constructor(userInfo, role) {
        this.userInfo = userInfo
        this.role = role
        this.dead = false
    }
}

class Game {
    constructor(options) {
        this.config = this.setConfig(options.config)
        this.started = false
        this.players = []
        this.actions = []
        this.roles = options.roles
        this.count = options.count
        this.round = -1
        this.winner = null
    }

    start(seats) {
        GameUtils.shuffle(this.roles);
        for (let i = 0; i < this.count; i++) {
            // this.players[i] = new Player(seats[i].userInfo, this.roles[i])
            this.players[i] = new Player(!!seats[i] ? seats[i].userInfo : null, this.roles[i])
            //TODO: remove this line after the game has to be started when the players are enough
        }
        console.log(this.roles, this.players)
        this.started = true
        return { 'players': this.players }
    }

    setConfig(config) {
        return config
    }

    getInfo() {
        return {
            config: this.config,
            started: this.started,
            players: this.players,
            actions: this.actions,
            roles: this.roles,
            count: this.count,
            winner: this.winner
        }
    }
}

module.exports = Game