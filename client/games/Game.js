class Game {
    constructor(options) {
        this.players = options.players;
        this.config = this.setConfig(options.config);
        this.started = options.started;
        this.engine = this.loadEngine();
        this.roles = options.roles;
        this.count = options.count;
    }

    setConfig(config) {
        return config;
    }

    loadEngine() {}

    getDescriptions() {}

    start() {}

    next() {}

    act() {}

    over() {}
}

module.exports = Game;