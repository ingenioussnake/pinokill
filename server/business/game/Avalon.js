const Game = require('./Game')
const GameUtils = require('./GameUtils')

class Avalon extends Game {
    constructor(options) {
        super(options)
        this.switches = [true, true, false, false, false, false, false]
        this.double = this.count >= 7
        this.config.enable_lancelot = false
        this.leader = -1
        this.roles = [].concat(GAME_INFO[(this.config.enable_lancelot ? "_" : "") + this.count].roles);
    }

    setConfig(config) {
        return {
            evil_blind_role: config.evil_blind_role !== undefined ? config.evil_blind_role : true,
            enable_lake_lady: config.enable_lake_lady !== undefined ? config.enable_lake_lady : true,
            enable_lancelot: config.enable_lancelot !== undefined ? config.enable_lancelot : false,
            enable_excalibur: config.enable_excalibur !== undefined ? config.enable_excalibur : false
        }
    }

    start(seats) {
        const data = super.start(seats)
        data.swtches = GameUtils.shuffle(this.switches)
        data.leader = this.leader = Math.floor(Math.random() * this.count)
        data.round = this.round = 0
        return data
    }
}

const GAME_INFO = {
    "5": {
        "roles": ['merlin', 'percival', 'loyalist', 'morgana', 'assassin'],
        "member": [2, 3, 2, 3, 3]
    },
    "_5": {
        "roles": ['merlin', 'percival', 'loyalist', 'morgana', 'assassin'],
        "member": [2, 3, 2, 3, 3]
    },
    "6": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'morgana', 'assassin'],
        "member": [2, 3, 4, 3, 4]
    },
    "_6": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'morgana', 'assassin'],
        "member": [2, 3, 4, 3, 4]
    },
    "7": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'morgana', 'assassin', 'oberon'],
        "member": [2, 3, 3, 4, 4]
    },
    "_7": {
        "roles": ['merlin', 'percival', 'loyalist', 'lancelot', 'morgana', 'assassin', '_lancelot'],
        "member": [2, 3, 3, 4, 4]
    },
    "8": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'loyalist', 'morgana', 'assassin', 'minion'],
        "member": [3, 4, 4, 5, 5]
    },
    "_8": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'lancelot', 'morgana', 'assassin', '_lancelot'],
        "member": [3, 4, 4, 5, 5]
    },
    "9": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'loyalist', 'loyalist', 'morgana', 'assassin', 'mordred'],
        "member": [3, 4, 4, 5, 5]
    },
    "_9": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'loyalist', 'lancelot', 'morgana', 'assassin', '_lancelot'],
        "member": [3, 4, 4, 5, 5]
    },
    "10": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'loyalist', 'loyalist', 'morgana', 'assassin', 'mordred', 'oberon'],
        "member": [3, 4, 4, 5, 5]
    },
    "_10": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'loyalist', 'lancelot', 'morgana', 'mordred', 'oberon', '_lancelot'],
        "member": [3, 4, 4, 5, 5]
    }
}

module.exports = Avalon