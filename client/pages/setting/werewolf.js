const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');
const Zan = require("../../vendor/zanui/index");

const app = getApp();

Page(Object.assign({}, Zan.Quantity, Zan.Switch, {
    data: {
        game: {},
        roles: [], // available roles
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
        const data = loadGameConfig();
        data.room = options.room;
        this.setData(data);
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
        let id = e.componentId, data = this.data, config = data.game.config, role;
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
                        data.hasThief = e.checked;
                        break;
                }
                if (role.campus === 'people') {
                    data.protoss_count += e.checked ? 1 : -1;
                } else if (role.campus === 'others') {
                    data.others_count += e.checked ? 1 : -1;
                }
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
        const roles = getSelectedRoles(this.data);
        const data = {
            type: 'werewolf',
            game: {
                config: this.data.game.config,
                roles: roles,
                count: roles.length
            },
            count: roles.length
        }
        if (!this.data.room) {
            createRoom(data).then(id => {
                wx.navigateTo({
                    url: '/pages/room/room?id=' + id
                });
            }, error => console.log(error));
        } else {
            updateRoom(this.data.room, data).then(() => {
                console.log(app.getCurrentPages());
                wx.navigateBack({
                    delta: 1
                });
            }, error => console.log(error));
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

const createRoom = function (data) {
    return new Promise((resolve, reject) => {
        qcloud.request({
            url: config.service.roomUrl,
            method: 'PUT',
            data: data,
            success: (res) => wx.navigateTo({
                url: '/pages/room/room?id=' + res.data.data,
            }),
            fail: (error) => console.log(error)
        });
    });
};

const updateRoom = function (id, config) {
    return new Promise((resolve, reject) => {
        resolve(id);
    });
};

const loadGameConfig = function () {
    let game = getDefaultGameOptions(), role = null, roles = Object.assign({}, app.globalData.engine.roles),
        werewolf_count = 0, village_count = 0, protoss_count = 0, others_count = 0,
        hasThief = false, hasBeauty = false, hasWitch = true, othersEnabled = false;
    for (var i = 0; i < game.roles.length; i++) {
        role = roles[game.roles[i]];
        if (!role.required) {
            role.selected = true;
        }
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
        game,
        roles: Object.values(roles),
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

const getDefaultGameOptions = () => {
    return {
        roles: [
            app.globalData.engine.roles.village.name,
            app.globalData.engine.roles.village.name,
            app.globalData.engine.roles.village.name,
            app.globalData.engine.roles.werewolf.name,
            app.globalData.engine.roles.werewolf.name,
            app.globalData.engine.roles.werewolf.name,
            app.globalData.engine.roles.prophet.name,
            app.globalData.engine.roles.hunter.name,
            app.globalData.engine.roles.witch.name
        ],
        config: {
            witch_self_rescue: true,
            beauty_deadlove_exile: true,
            enable_sheriff: true,
            massacre: false
        }
    };
};