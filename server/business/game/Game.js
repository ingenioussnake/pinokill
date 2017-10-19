class Game {
    constructor(config) {
        this.config = this.setConfig(config)
        this.started = false
        this.players = []
        this.messages = []
        this.roles = config.roles
    }

    setConfig(config) {
        return config
    }

    getInfo() {
        return {
            config: this.config,
            started: this.started,
            players: this.players,
            messages: this.messages,
            roles: this.roles
        }
    }
}

module.exports = Game