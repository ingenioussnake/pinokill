class Game {
    constructor(options) {
        this.players = options.players;
        this.config = options.config;
        this.started = options.started;
        this.engine = this.loadEngine();
    }

    loadEngine() {}

    getDescription() {}

    start() {}

    next() {}

    act() {}

    over() {}
}

module.exports = Game;