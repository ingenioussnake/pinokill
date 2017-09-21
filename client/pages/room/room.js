// 引入 QCloud 小程序增强 SDK
const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');

const ROLES = require("../../roles");
const UserUtils = require("../../utils/UserUtils");
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
        messages: [],
        special_werewolves: [],
        special_roles: [],
        protoss: [],
        hasWitch: true,
        hasBeauty: false,
        enableSetting: false
    },
    onLoad(options) {
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
    onReady() {
        if (!this.data.config && this.data.seats.length === 0) {
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
                seats[now].user = seats[old].user;
                seats[old].user = null;
                if (seat === old) {
                    seat = now;
                }
                this.setData({seats, seat});
            });
        }
    }
});

const initRoom = function () {
    return new Promise((resolve, reject) => {
        var userInfo = app.globalData.userInfo; //TODO: not login?
        //TODO: return config when the tunnel is established.
        var config = {
            werewolf_count: 3,
            village_count: 3,
            roles: ["prophet", "witch", "hunter"],
            hasThief: false,
            witch_self_rescue: true,
            beauty_deadlove_exile: true,
            enable_sheriff: true
        },
        special_werewolves = [], special_roles = [], protoss = [],
        seats = config.werewolf_count + config.village_count,
        roles = ROLES.filter( (role) => { return role.enabled }),
        campus;
        for (var i = 0; i < roles.length; i++) {
            if (config.roles.indexOf(roles[i].name) > -1) {
                campus = roles[i].campus;
                if (campus === "werewolf") {
                    special_werewolves.push(roles[i].label);
                } else {
                    seats++;
                    if (campus === 'people') {
                        protoss.push(roles[i].label);
                    } else {
                        special_roles.push(roles[i].label);
                    }
                }
            }
        }
        seats = new Array(seats);
        for (var i = 0; i < seats.length; i++) {
            if (!seats[i]) {
                seats[i] = {
                    index: i + 1,
                    user: null
                };
            }
        }
        seats[5].user = {
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName
        };
        resolve({
            host: true, config, seats, seat: 5, special_werewolves, special_roles, protoss,
            hasWitch: config.roles.indexOf("witch") > -1,
            hasBeauty: config.roles.indexOf("beauty_werewolf") > -1
        });
    });
};

const moveTo = function (old, now) {
    return new Promise(resolve => {
        resolve({old, now});
    });
};