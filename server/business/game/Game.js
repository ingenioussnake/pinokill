class Game {
    constructor(config) {
        this.config = config
        this.started = false
        this.players = []
        this.messages = []
    }

    getInfo() {
        return {
            config: this.config,
            started: this.started,
            players: this.players,
            messages: this.messages
        }
    }
}

module.exports = Game