class Game {
    constructor(options) {
        this.players = options.players;
        this.config = this.setConfig(options.config);
        this.started = options.started;
        this.engine = this.loadEngine();
        this.roles = options.roles;
        this.count = options.count;
        this.round = -1;
        this.me = -1;
    }

    setConfig(config) {
        return config;
    }

    loadEngine() {}

    getDescriptions() {}

    start(data) {
        this.started = true;
    }

    next() {}

    act() {}

    over() {}
}

module.exports = Game;