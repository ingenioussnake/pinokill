const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');
const Zan = require("../../vendor/zanui/index");

const app = getApp();

Page(Object.assign({}, Zan.Quantity, Zan.Switch, {
    data: {
        game: {},
        count: null,
        room: null
    },

    onLoad(options) {
        let config = loadGameConfig();
        this.setData({ game: config, room: options.room, count: config.count });
    },

    onReady() {
        wx.setNavigationBarTitle({ title: '游戏配置' });
    },

    handleZanSwitchChange(e) {
        let id = e.componentId, data = this.data, config = data.game.config;
        switch (id) {
            case "evil-blind-role":
                config.evil_blind_role = !e.checked;
                break;
            case "enable-lake-lady":
                config.enable_lake_lady = e.checked;
                break;
            case "enable-lancelot":
                config.enable_lancelot = e.checked;
                break;
            case "enable-excalibur":
                config.enable_excalibur = e.checked;
                break;
        }
        this.setData(data);
    },

    handleSliderChange(e) {
        const data = this.data;
        data.count = e.detail.value;
        data.game.count = e.detail.value;
        this.setData(data);
    },

    submit() {
        const data = {
            game: this.data.game,
            count: this.data.count,
            type: 'avalon'
        };
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
    return getDefaultGameOptions();
};

const getDefaultGameOptions = () => {
    return {
        config: {
            evil_blind_role: true,
            enable_lake_lady: true,
            enable_lancelot: false,
            enable_excalibur: false
        },
        count: 7
    };
};