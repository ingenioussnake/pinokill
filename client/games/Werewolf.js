const Game = require("./Game");

class Werewolf extends Game {

    loadEngine() {
        return getApp().globalData.engine;
    }

    setConfig(config) {
        return {
            witch_self_rescue: config.witch_self_rescue !== undefined ? config.witch_self_rescue : true,
            beauty_deadlove_exile: config.beauty_deadlove_exile !== undefined ? config.beauty_deadlove_exile : true,
            enable_sheriff: config.enable_sheriff !== undefined ? config.enable_sheriff : true,
            massacre: config.massacre !== undefined ? config.massacre : false
        }
    }

    getDescriptions() {
        return $getDescriptions(this.roles, this.config, this.engine);
    }
}

const $getDescriptions = (roles, config, engine) => {
    let ROLES = engine.roles,
        werewolf_count = 0, village_count = 0,
        hasThief = false, hasBeauty = false, hasWitch = false,
        special_werewolves = [], special_roles = [], protoss = [],
        sentence = "", description = []
    for (var i = 0; i < roles.length; i++) {
        let role = ROLES[roles[i]];
        if (role.campus === 'werewolf') {
            werewolf_count++;
            if (!role.required) {
                special_werewolves.push(role.label);
            }
            if (role.name === 'beauty_werewolf') {
                hasBeauty = true;
            }
        } else if (role.campus === 'people') {
            if (!role.required) {
                protoss.push(role.label);
            } else {
                village_count++;
            }
            if (role.name === 'witch') {
                hasWitch = true;
            }
        } else {
            special_roles.push(role.label);
            if (role.name === 'thief') {
                hasThief = true;
            }
        }
    }
    sentence = `狼人${werewolf_count}名`;
    if (special_werewolves.length > 0) {
        sentence += `(包含${special_werewolves.join(', ')})`;
    }
    description.push(sentence);
    sentence = `村民${village_count + (hasThief ? 2 : 0)}名`;
    description.push(sentence);
    sentence = `神民：${protoss.join(', ')}`;
    description.push(sentence);
    if (special_roles.length > 0) {
        sentence = `其他角色：${special_roles.join(', ')})`;
        description.push(sentence);
    }
    sentence = `${config.massacre ? '屠城' : '屠边'}, ${config.enable_sheriff ? '' : '没'}有警长`;
    description.push(sentence);
    if (hasWitch) {
        sentence = `女巫首夜${config.witch_self_rescue ? '' : '不'}允许自救`;
        description.push(sentence);
    }
    if (hasBeauty) {
        sentence = `狼美人${config.beauty_deadlove_exile ? '仅被放逐才' : '死亡即可'}殉情`;
        description.push(sentence);
    }
    return description;
}

module.exports = Werewolf;