const Game = require('./Game')

class Werewolf extends Game {
    setConfig(config) {
        return {
            witch_self_rescue: config.witch_self_rescue !== undefined ? config.witch_self_rescue : true,
            beauty_deadlove_exile: config.beauty_deadlove_exile !== undefined ? config.beauty_deadlove_exile : true,
            enable_sheriff: config.enable_sheriff !== undefined ? config.enable_sheriff : true,
            massacre: config.massacre !== undefined ? config.massacre : false
        }
    }
}

module.exports = Werewolf