const Game = require('./Game')

class Avalon extends Game {
    setConfig(config) {
        return {
            evil_blind_role: config.evil_blind_role !== undefined ? config.evil_blind_role : true,
            enable_lake_lady: config.enable_lake_lady !== undefined ? config.enable_lake_lady : true,
            enable_lancelot: config.enable_lancelot !== undefined ? config.enable_lancelot : false,
            enable_excalibur: config.enable_excalibur !== undefined ? config.enable_excalibur : false
        }
    }
}

module.exports = Avalon;