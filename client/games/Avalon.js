const Game = require('./Game')

class Avalon extends Game {
    constructor(config) {
        super(config);
        this.double = this.count >= 7;
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

    start(data, me) {
        this.leader = data.leader;
        this.round = data.round;
        this.players = data.players;
        this.me = me;
        super.start(data);
        return `游戏开始，你的身份是${ROLES[this.players[this.me].role]}，第一轮任务领袖为${this.players[this.leader]/*.userInfo.nickname*/}`
    }

    getDescriptions() {
        return $getDescriptions(this.count, this.double, this.config);
    }
}

const $getDescriptions = (count, double, config) => {
    const info = GAME_INFO[(config.enable_lancelot ? "_" : "") + count];
    const descriptions = [...info.description];
    descriptions.push(`任务所需队员 ${info.member.join(', ')}`);
    if (double) {
        descriptions.push(`第4个任务需至少两票失败才失败 `);
    } else {
        descriptions.push(`所有任务均只需一票失败即失败 `);
    }
    descriptions.push(`邪恶方${config.evil_blind_role ? '不' : ''}互通身份`);
    descriptions.push(`${config.enable_lake_lady ? '有' : '没有'}湖上夫人`);
    descriptions.push(`${config.enable_lancelot ? '有' : '没有'}兰斯洛特`);
    descriptions.push(`${config.enable_excalibur ? '有' : '没有'}王者之剑`);
    return descriptions;
};

const GAME_INFO = {
    "5": {
        "roles": ['merlin', 'percival', 'loyalist', 'morgana', 'assassin'],
        "description": ["正义方: 梅林、派西维尔、忠臣", "邪恶方: 莫甘娜、刺客"],
        "member": [2, 3, 2, 3, 3]
    },
    "_5": {
        "roles": ['merlin', 'percival', 'loyalist', 'morgana', 'assassin'],
        "description": ["正义方: 梅林、派西维尔、忠臣", "邪恶方: 莫甘娜、刺客"],
        "member": [2, 3, 2, 3, 3]
    },
    "6": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'morgana', 'assassin'],
        "description": ["正义方: 梅林、派西维尔、忠臣*2", "邪恶方: 莫甘娜、刺客 "],
        "member": [2, 3, 4, 3, 4]
    },
    "_6": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'morgana', 'assassin'],
        "description": ["正义方: 梅林、派西维尔、忠臣*2", "邪恶方: 莫甘娜、刺客 "],
        "member": [2, 3, 4, 3, 4]
    },
    "7": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'morgana', 'assassin', 'oberon'],
        "description": ["正义方: 梅林、派西维尔、忠臣*2", "邪恶方: 莫甘娜、奥伯伦、刺客"],
        "member": [2, 3, 3, 4, 4]
    },
    "_7": {
        "roles": ['merlin', 'percival', 'loyalist', 'lancelot', 'morgana', 'assassin', '_lancelot'],
        "description": ["正义方: 梅林、派西维尔、忠臣、兰斯洛特*好", "邪恶方: 莫甘娜、刺客、兰斯洛特*坏"],
        "member": [2, 3, 3, 4, 4]
    },
    "8": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'loyalist', 'morgana', 'assassin', 'minion'],
        "description": ["正义方: 梅林、派西维尔、忠臣*3", "邪恶方: 莫甘娜、刺客、爪牙"],
        "member": [3, 4, 4, 5, 5]
    },
    "_8": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'lancelot', 'morgana', 'assassin', '_lancelot'],
        "description": ["正义方: 梅林、派西维尔、忠臣*2、兰斯洛特*好", "邪恶方: 莫甘娜、刺客、兰斯洛特*坏"],
        "member": [3, 4, 4, 5, 5]
    },
    "9": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'loyalist', 'loyalist', 'morgana', 'assassin', 'mordred'],
        "description": ["正义方: 梅林、派西维尔、忠臣*4", "邪恶方: 莫甘娜、刺客、莫德雷德"],
        "member": [3, 4, 4, 5, 5]
    },
    "_9": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'loyalist', 'lancelot', 'morgana', 'assassin', '_lancelot'],
        "description": ["正义方: 梅林、派西维尔、忠臣*3、兰斯洛特*好", "邪恶方: 莫甘娜、刺客、兰斯洛特*坏 "],
        "member": [3, 4, 4, 5, 5]
    },
    "10": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'loyalist', 'loyalist', 'morgana', 'assassin', 'mordred', 'oberon'],
        "description": ["正义方: 梅林、派西维尔、忠臣*4", "邪恶方: 莫甘娜、刺客、莫德雷德、奥伯伦"],
        "member": [3, 4, 4, 5, 5]
    },
    "_10": {
        "roles": ['merlin', 'percival', 'loyalist', 'loyalist', 'loyalist', 'lancelot', 'morgana', 'mordred', 'oberon', '_lancelot'],
        "description": ["正义方: 梅林、派西维尔、忠臣*3、兰斯洛特*好", "邪恶方: 莫德雷德、莫甘娜、奥伯伦、兰斯洛特*坏"],
        "member": [3, 4, 4, 5, 5]
    }
};

const ROLES = {
    'merlin': '梅林',
    'percival': '派西维尔',
    'loyalist': '忠臣',
    'lancelot': '兰斯洛特（好）',
    'morgana': '莫甘娜',
    'mordred': '莫德雷德',
    'oberon': '奥伯伦',
    'assassin': '刺客',
    '_lancelot': '兰斯洛特（坏）'
}

module.exports = Avalon;