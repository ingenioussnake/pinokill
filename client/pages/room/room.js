// 引入 QCloud 小程序增强 SDK
const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');

const ROLES = require("../../roles");
const GameUtils = require("../../utils/GameUtils");
const app = getApp();

Page({
    data: {
        id: null,
        host: false,
        config: null,
        seats: [],
        seat: null,
        role: {},
        started: false,
        dead: false,
        werewolf_count: 0,
        village_count: 0,
        special_werewolves: [],
        special_roles: [],
        protoss: [],
        hasThief: false,
        hasWitch: true,
        hasBeauty: false,
        enableSetting: false,
        messages: []
    },
    onLoad(options) {
        GameUtils.assert();
        if (!options.id) {
            options.id = 2312; //TODO: validate instead of hard coded
        }
        wx.setNavigationBarTitle({
            title: '房间' + options.id,
        });
        this.setData({
            id: options.id
        });
    },
    onShow() {
        if (app.globalData.userInfo && app.globalData.engine &&
            !this.data.config && this.data.seats.length === 0) {
            initRoom().then( data => {
                this.setData(data);
            });
        }
    },
    sit(e) {
        var index = e.currentTarget.dataset.index, seat = this.data.seat;
        if (index !== seat && !this.data.seats[index].nickName) {
            moveTo(this.data.seat, index).then((change)=>{
                var old = change.old, now = change.now;
                var seats = this.data.seats, seat = this.data.seat;
                if (old !== null) {
                    seats[now].user = seats[old].user;
                    seats[old].user = null;
                } else {
                    seats[now].user = app.globalData.userInfo;
                }
                seat = now; //TODO: others move?
                this.setData({seats, seat});
            });
        }
    }
});

const initRoom = function () {
    return new Promise((resolve, reject) => {
        var userInfo = app.globalData.userInfo,
            ROLES = app.globalData.engine.roles,
        //TODO: return config when the tunnel is established.
            config = {
                roles: [ROLES.village.name, ROLES.village.name, ROLES.village.name,
                    ROLES.werewolf.name, ROLES.werewolf.name, ROLES.werewolf.name,
                    ROLES.prophet.name, ROLES.hunter.name, ROLES.witch.name],
                witch_self_rescue: true,
                beauty_deadlove_exile: true,
                enable_sheriff: true,
                massacre: false
            },
            werewolf_count = 0, village_count = 0,
            hasThief = false, hasBeauty = false, hasWitch = false, othersEnabled = false,
            special_werewolves = [], special_roles = [], protoss = [],
            seats = config.roles.length, campus, role;
        for (var i = 0; i < seats; i++) {
            role = ROLES[config.roles[i]];
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
        seats = new Array(seats);
        for (var i = 0; i < seats.length; i++) {
            if (!seats[i]) {
                seats[i] = {
                    index: i + 1,
                    user: null,
                    role: {},
                    dead: false
                };
            }
        }
        resolve({
            host: true, config, seats, special_werewolves, special_roles, protoss,
            werewolf_count, village_count, hasThief, hasBeauty, hasWitch
        });
    });
};

const moveTo = function (old, now) {
    return new Promise(resolve => {
        resolve({old, now});
    });
};