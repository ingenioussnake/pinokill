class Game {
    constructor(options) {
        this.config = this.setConfig(options.config)
        this.started = false
        this.players = []
        this.actions = []
        this.roles = options.roles
        this.count = options.count
        this.winner = null
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