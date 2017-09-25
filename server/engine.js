const ROLES = {
    'werewolf': {
        name: 'werewolf',
        label: '狼人',
        campus: 'werewolf',
        checkAsWerewolf: true,
        required: true,
        enabled: true,
        priority: 5
    },
    'white_werewolf': {
        name: 'white_werewolf',
        label: '白狼王',
        campus: 'werewolf',
        checkAsWerewolf: true,
        required: false,
        enabled: false,
        priority: 5
    },
    'demon': {
        name: 'demon',
        label: '恶魔',
        campus: 'werewolf',
        checkAsWerewolf: true,
        required: false,
        enabled: false,
        priority: 1
    },
    'beauty_werewolf': {
        name: 'beauty_werewolf',
        label: '狼美人', 
        campus: 'werewolf',
        checkAsWerewolf: true,
        required: false,
        enabled: false,
        priority: 4
    },
    'invisible_werewolf': {
        name: 'invisible_werewolf',
        label: '隐狼',
        campus: 'werewolf',
        checkAsWerewolf: false,
        required: false,
        enabled: false,
        priority: -1
    },
    'village': {
        name: 'village',
        label: '村民',
        campus: 'people',
        checkAsWerewolf: false,
        required: true,
        enabled: true,
        priority: -1
    },
    'prophet': {
        name: 'prophet',
        label: '预言家',
        campus: 'people',
        checkAsWerewolf: false,
        required: false,
        enabled: true,
        priority: 1
    },
    'witch': {
        name: 'witch',
        label: '女巫',
        campus: 'people',
        checkAsWerewolf: false,
        required: false,
        enabled: true,
        priority: 4
    },
    'hunter': {
        name: 'hunter',
        label: '猎人',
        campus: 'people',
        checkAsWerewolf: false,
        required: false,
        enabled: true,
        priority: 1
    },
    'idiot': {
        name: 'idiot',
        label: '白痴',
        campus: 'people',
        checkAsWerewolf: false,
        required: false,
        enabled: false,
        priority: -1
    },
    'guard': {
        name: 'guard',
        label: '守卫',
        campus: 'people',
        checkAsWerewolf: false,
        required: false,
        enabled: false,
        priority: 6
    },
    'knight': {
        name: 'knight',
        label: '骑士',
        campus: 'people',
        checkAsWerewolf: false,
        required: false,
        enabled: false,
        priority: -1
    },
    'cupid': {
        name: 'cupid',
        label: '丘比特',
        campus: 'others',
        checkAsWerewolf: false,
        required: false,
        enabled: false,
        priority: 7
    },
    'thief': {
        name: 'thief',
        label: '盗贼',
        campus: 'others',
        checkAsWerewolf: false,
        required: false,
        enabled: false,
        priority: 10
    },
    'desire_demon': {
        name: 'desire_demon',
        label: '魅魔',
        campus: 'others',
        checkAsWerewolf: true,
        required: false,
        enabled: false,
        priority: 4
    }
}

const getEnableRoles = () => {
    var roles = {}
    for (var p in ROLES) {
        if (ROLES[p].enabled) {
            roles[p] = ROLES[p]
        }
    }
    return roles;
}

module.exports = () => {
    return {
        version: "1",
        // campus: {
        //     werewolf: "werewolf",
        //     people: "people",
        //     others: "others"
        // },
        roles: getEnableRoles()
    }
}
