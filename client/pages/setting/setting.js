const Zan = require("../../vendor/zanui/index");

const ROLES = require("../../roles");

const app = getApp();

Page(Object.assign({}, Zan.Quantity, Zan.Switch, {
    data: {
        config: {},
        roles: [],
        room: null,
        status: [false, false, false, false, false],
        protoss_count: 0,
        others_count: 0,
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
        var id = e.componentId, config = this.data.config;
        if (id === 'werewolf-count') {
            config.werewolf_count = e.quantity;
        } else if (id === 'village-count') {
            config.village_count = e.quantity;
        }
        this.setData({
            config
        });
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
    var config = {
        werewolf_count: 3,
        village_count: 3,
        roles: ["prophet", "witch", "hunter"],
        hasThief: false,
        witch_self_rescue: true,
        beauty_deadlove_exile: true,
        enable_sheriff: true,
        massacre: false
    }, roles = ROLES.filter(role => {
        return role.enabled;
    }), protoss_count = 0, others_count = 0, hasBeauty = false, hasWitch = true, othersEnabled = false;
    roles.forEach( role => {
        if (role.campus === 'others') {
            othersEnabled = true;
        }
        if (config.roles.indexOf(role.name) > -1) {
            role.selected = true;
            if (role.campus === "people") {
                protoss_count++;
            } else if (role.campus === "others") {
                others_count++;
            }
            if (role.name === "witch") {
                hasWitch = true;
            } else if (role.name === "beauty_werewolf") {
                hasBeauty = true;
            }
        } else {
            role.selected = false;
        }
    } );
    return {
        config,
        roles,
        hasBeauty,
        hasWitch,
        othersEnabled,
        protoss_count,
        others_count
    };
};