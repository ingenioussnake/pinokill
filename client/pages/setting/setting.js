const Zan = require("../../vendor/zanui/index");

const app = getApp();

Page(Object.assign({}, Zan.Quantity, Zan.Switch, {
    data: {
        config: {},
        roles: [],
        room: null,
        status: [false, false, false, false, false],
        werewolf_count: 0,
        protoss_count: 0,
        village_count: 0,
        others_count: 0,
        hasThief: false,
        hasWitch: false,
        hasBeauty: false,
        othersEnabled: false
    },

    onLoad(options) {
        var config = loadGameConfig();
        config.room = options.room;
        this.setData(config);
    },

    onReady() {
        wx.setNavigationBarTitle({ title: '游戏配置' });
    },

    handleZanQuantityChange(e) {
        var id = e.componentId;
        if (id === 'werewolf-count') {
            this.setData({
                werewolf_count: e.quantity
            });
        } else if (id === 'village-count') {
            this.setData({
                village_count: e.quantity
            });
        }
    },

    handleZanSwitchChange(e) {
        var id = e.componentId, data = this.data, config = data.config, role;
        switch (id) {
            case "witch-self-rescue":
                config.witch_self_rescue = e.checked;
                break;
            case "beauty-deadlove-exile":
                config.beauty_deadlove_exile = e.checked;
                break;
            case "enable-sheriff":
                config.enable_sheriff = e.checked;
                break;
            case "massacre":
                config.massacre = e.checked;
                break;
            default:
                role = data.roles[parseInt(id.substring(id.lastIndexOf("_") + 1))];
                role.selected = e.checked;
                switch (role.name) {
                    case "witch":
                        data.hasWitch = e.checked;
                        break;
                    case "beauty_werewolf":
                        data.hasBeauty = e.checked;
                        break;
                    case "thief":
                        config.hasThief = e.checked;
                        break;
                }
                if (role.campus === 'people') {
                    data.protoss_count += e.checked ? 1 : -1;
                } else if (role.campus === 'others') {
                    data.others_count += e.checked ? 1 : -1;
                }
                config.roles = data.roles.filter( role => {
                    return role.selected && !role.required;
                });
                break;
        }
        this.setData(data);
    },

    toggleConfig(e) {
        var id = e.currentTarget.id,
            index = id.substring(id.length - 1),
            status = this.data.status;
        for (var i = 0, len = status.length; i < len; ++i) {
            if (i == index) {
                status[i] = !status[i]
            } else {
                status[i] = false
            }
        }
        this.setData({
            status
        });
    },

    submit() {
        var config = this.data.config;
        console.log(this.data);
        config.roles = getSelectedRoles(this.data);
        console.log(config.roles);
        return;
        if (!this.data.room) {
            requestRoomId(this.data.config).then(id => {
                wx.navigateTo({
                    url: '/pages/room/room?id=' + id
                });
            });
        } else {
            updateRoom(this.data.room, this.data.config).then(() => {
                console.log(app.getCurrentPages());
                wx.navigateBack({
                    delta: 1
                });
            });
        }
        
    }
}));

const getSelectedRoles = data => {
    var roles = [], i, skilled_werewolf_count = 0, role;
    for (i = 0; i < data.village_count; i++) {
        roles.push(app.globalData.engine.roles.village.name);
    }
    for (i = 0; i < data.roles.length; i++) {
        role = data.roles[i];
        if (role.selected) {
            roles.push(role.name)
            if (role.campus === "werewolf" && !role.required) {
                skilled_werewolf_count++;
            }
        }
    }
    for (i = 0; i < data.werewolf_count - skilled_werewolf_count; i++) {
        roles.push(app.globalData.engine.roles.werewolf.name);
    }
    return roles;
};

const requestRoomId = function (config) {
    return new Promise((resolve, reject) => {
        resolve(3421);
    });
};

const updateRoom = function (id, config) {
    return new Promise((resolve, reject) => {
        resolve(id);
    });
};

const loadGameConfig = function () {
    var engine = app.globalData.engine, ROLES = engine.roles, role, 
        config = {
            roles: [ROLES.village.name, ROLES.village.name, ROLES.village.name,
                ROLES.werewolf.name, ROLES.werewolf.name, ROLES.werewolf.name,
                ROLES.prophet.name, ROLES.hunter.name],
            witch_self_rescue: true,
            beauty_deadlove_exile: true,
            enable_sheriff: true,
            massacre: false
        },
        roles = [],
        werewolf_count = 0, village_count = 0, protoss_count = 0, others_count = 0,
        hasThief = false, hasBeauty = false, hasWitch = true, othersEnabled = false;
    for (var p in ROLES) {
        role = ROLES[p];
        if (config.roles.indexOf(role.name) > -1 && !role.required) {
            role.selected = true; // TODO: don't modify the data in app.globalData.engine
        }
        roles.push(role);
    }
    for (var i = 0; i < config.roles.length; i++) {
        role = ROLES[config.roles[i]];
        if (role.campus === 'werewolf') {
            werewolf_count++;
            if (role.name === 'beauty_werewolf') {
                hasBeauty = true;
            }
        } else if (role.campus === 'people') {
            if (role.name === 'village') {
                village_count++;
            } else {
                protoss_count++;
            }
            if (role.name === 'witch') {
                hasWitch = true;
            }
        } else {
            others_count++;
            othersEnabled = true;
            if (role.name === "thief") {
                hasThief = true;
            }
        }
    }
    return {
        config,
        roles,
        hasThief,
        hasBeauty,
        hasWitch,
        othersEnabled,
        protoss_count,
        others_count,
        werewolf_count,
        village_count,
        protoss_count
    };
};