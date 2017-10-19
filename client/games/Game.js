class Game {
    constructor(options) {
        this.players = options.players;
        this.config = this.setConfig(options.config);
        this.started = options.started;
        this.engine = this.loadEngine();
        this.roles = options.roles;
    }

    setConfig(config) {
        return config;
    }

    loadEngine() {}

    getDescription() {}

    start() {}

    next() {}

    act() {}

    over() {}
}

module.exports = Game;