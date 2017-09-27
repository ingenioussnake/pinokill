// 引入 QCloud 小程序增强 SDK
const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');

const ROLES = require("../../roles");
const GameUtils = require("../../utils/GameUtils");
const Tips = require("../../utils/TipsUtils");
const app = getApp();

Page({
    data: {
        id: null,
        busy: true,
        error: 0,
        host: false,
        config: null,
        seats: [],
        seatVersion: -1,
        halfbreak: 0,
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
        console.log(this.route);
        const id = options.id;
        this.setData({ id });
        if (!id) {
            this.onError(-1, "room without options.id");
        } else {
            GameUtils.assert().then( () => {
                return this.join();
            }).then( res => {
                console.log(res);
                this.initRoom({
                    busy: false,
                    error: 0,
                    config: {
                        roles: res.roles,
                        enable_sheriff: res.enable_sheriff,
                        witch_self_rescue: res.witch_self_rescue,
                        beauty_deadlove_exile: res.beauty_deadlove_exile,
                        massacre: res.massacre
                    },
                    seats: res.players,
                    seat_version: res.seat_version,
                    messages: res.messages.map( createMessage ),
                    started: res.started,
                    host: res.host === app.globalData.userInfo.openId
                });
            }).catch( error => {
                console.log(error.type, error.error);
                this.onError(error.type === 'room' ? 1 : 2, error.error);
            });
        }
    },
    onReady() {
        wx.setNavigationBarTitle({
            title: '房间' + this.data.id
        });
    },
    onUnload() {
        this.quit();
    },
    onError(code, error) {
        this.setData({ busy: false, error: code });
        console.log(error);
        if (code === 1) {
            Tips.showModel("加入房间失败", "房间号不合法，请重试");
        } else if (code === -1) {
            Tips.showModel("加入房间失败", "没有房间号，请退出重试");
        } else {
            Tips.showModel("加入房间失败", "游戏初始化失败，请重新登陆", () => {
                wx.redirectTo({
                    url: '/pages/login/login?callback=' + this.route + "?id=" + this.data.id
                });
            });
        }
    },
    join() {
        return new Promise((resolve, reject) => {
            if (!this.data.id) {
                reject({type: 'room', error: "没有房间号"});
            }
            var game = this.game = new qcloud.Tunnel(config.service.roomUrl);
            game.on('connect', () => {
                console.log('connected');
            });
            game.on('close', () => console.log('closed'));
            game.on('error', () => console.log('error'));
            game.on('reconnect', () => console.log('reconnected'));
            game.on('reconnecting', () => console.log('reconnecting'));
            game.on('join', room => {
                resolve(room);
            });
            game.on('people', people => this.onPeople(people));
            game.on('seat', seat => this.onSeat(seat));
            game.on('action', () => console.log('action'));
            game.open();
        });
    },
    initRoom(data) {
        var ROLES = app.globalData.engine.roles,
        //TODO: return config when the tunnel is established.
            config = data.config,
            werewolf_count = 0, village_count = 0,
            hasThief = false, hasBeauty = false, hasWitch = false,
            special_werewolves = [], special_roles = [], protoss = [],
            seats = data.seats, campus, role;
        for (var i = 0; i < config.roles.length; i++) {
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
            seats[i] = {
                index: i + 1,
                user: seats[i],
                role: {},
                dead: false
            }
        }
        data.special_roles = special_roles;
        data.special_werewolves = special_werewolves;
        data.protoss = protoss;
        data.werewolf_count = werewolf_count;
        data.village_count = village_count;
        data.hasThief = hasThief;
        data.hasBeauty = hasBeauty;
        data.hasWitch = hasWitch;
        data.halfbreak = Math.ceil(seats.length/ 2);
        this.setData(data)
    },
    sit(e) {
        var index = e.currentTarget.dataset.index, seat = this.data.seat;
        if (this.game && this.game.isActive()) {
            this.game.emit('seat', { to: index });
        } else {
            //...
        }
        
        // if (index !== seat && !this.data.seats[index].nickName) {
        //     moveTo(this.data.seat, index).then((change)=>{
        //         var old = change.old, now = change.now;
        //         var seats = this.data.seats, seat = this.data.seat;
        //         if (old !== null) {
        //             seats[now].user = seats[old].user;
        //             seats[old].user = null;
        //         } else {
        //             seats[now].user = app.globalData.userInfo;
        //         }
        //         seat = now; //TODO: others move?
        //         this.setData({seats, seat});
        //     });
        // }
    },
    onSeat(change) {
        console.log('seats', change);
        const version = this.data.seat_version;
        const seats = this.data.seats;
        if (version < change.version) {
            for (var i = 0; i < seats.length; i++) {
                seats[i].user = !!change.seats[i] ? change.seats[i].userInfo : null;
            }
            this.setData({ seat_version: change.version, seats: seats});
        }
    },
    onPeople(people) {
        console.log('people', people);
        const messages = this.data.messages;
        if (people.enter) {
            messages.push(createSystemMessage(people.enter.nickName + "加入房间"));
        } else {
            messages.push(createSystemMessage(people.enter.nickName + "离开房间"));
        }
        this.setData({messages});
    },
    quit() {
        if (this.game) {
            this.game.close();
        }
    }
});

// const moveTo = function (old, now) {
//     return new Promise(resolve => {
//         resolve({old, now});
//     });
// };
const msgUuid = function() {
    if (!msgUuid.next) {
        msgUuid.next = 0;
    }
    return 'msg-' + (++msgUuid.next);
};
const createMessage = function () {};
const createSystemMessage = content => { return { id: msgUuid(), type: 'system', content }; };
const createActionMessage = function () {};
const createAlertMessage = function () {};
const createReviewMessage = function () {};
