// 引入 QCloud 小程序增强 SDK
const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');

const GameUtils = require("../../utils/GameUtils");
const Tips = require("../../utils/TipsUtils");
const app = getApp();

Page({
    data: {
        id: null,
        busy: true,
        error: 0,
        host: false,
        seats: [],
        seatVersion: -1,
        halfbreak: 0,
        enableSetting: false,
        messages: [],
        type: null,
        game: null,
        description: [],
        started: false,
        ready: false,
        me: -1
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
                this.initRoom(res);
                this.initGame(res.type, res.game);
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
    onShareAppMessage(options) {
        return {
            title: '邀你一起玩' + (this.data.type === "werewolf" ? '狼人杀' : '阿瓦隆'),
            path: this.route + '?id=' + this.data.id
        }
    },
    join() {
        return new Promise((resolve, reject) => {
            if (!this.data.id) {
                reject({type: 'room', error: "没有房间号"});
            }
            var conn = this.conn = new qcloud.Tunnel(config.service.roomUrl);
            conn.on('connect', () => {
                console.log('connected');
            });
            conn.on('close', () => console.log('closed'));
            conn.on('error', () => console.log('error'));
            conn.on('reconnect', () => {
                console.log('reconnect', arguments);
                this.addMessage(createSystemMessage("您已重新上线"));
            });
            conn.on('reconnecting', () => {
                console.log('reconnecting', arguments);
                this.addMessage(createSystemMessage("您已掉线，正在重连..."));
            });
            conn.on('join', room => {
                resolve(room);
            });
            conn.on('people', people => this.onPeople(people));
            conn.on('seat', seat => this.onSeat(seat));
            conn.on('game', (e) => this.onGameEvent(e));
            conn.on('failure', (error) => {
                if (error.action === "start") {
                    this.onSeat(error.data);
                }
            });
            conn.open();
        });
    },
    initRoom(data) {
        const seats = [];
        for (var i = 0; i < data.count; i++) {
            seats[i] = {
                index: i + 1,
                userInfo: null,
                offline: false
            }
            if (data.seats[i]) {
                seats[i].userInfo = data.seats[i].userInfo
                seats[i].offline = data.seats[i].offline
            }
        }
        this.setData({
            busy: false,
            error: 0,
            seats: seats,
            seat_version: data.seat_version,
            type: data.type,
            // messages: data.messages.map( createMessage ),
            started: data.started,
            host: data.host === app.globalData.userInfo.openId,
            halfbreak: Math.ceil(seats.length / 2)
        });
    },
    initGame(type, gameInfo) {
        var game, Game;
        if (type === 'werewolf') {
            Game = require("../../games/Werewolf");
        } else if (type === 'avalon') {
            Game = require("../../games/Avalon");
        }
        if (!!Game) game = new Game(gameInfo);
        this.setData({ game, description: game.getDescriptions() });
    },
    sit(e) {
        var index = e.currentTarget.dataset.index;
        if (this.conn && this.conn.isActive()) {
            this.conn.emit('seat', { to: index });
        } else {
            console.log('connect is down');
        }
    },
    onSeat(change) {
        console.log('seats', change);
        const version = this.data.seat_version;
        const seats = this.data.seats;
        let me = -1, ready = true;
        if (version < change.version) {
            for (var i = 0; i < seats.length; i++) {
                if (!!change.seats[i]) {
                    seats[i].userInfo = change.seats[i].userInfo;
                    if (change.seats[i].userInfo.openId == app.globalData.userInfo.openId) {
                        me = i;
                    }
                } else {
                    seats[i].userInfo = null;
                    // ready = false;
                }
            }
            this.setData({ seat_version: change.version, seats, me, ready});
        }
    },
    onPeople(people) {
        const seats = this.data.seats;
        const seat = getPersonSeat(people.person, seats);
        switch (people.type) {
            case 'enter':
                this.addMessage(createSystemMessage(people.person.nickName + "加入房间"));
            break;
            case 'online':
                this.addMessage(createSystemMessage(people.person.nickName + "回到房间"));
                if (seat > -1) {
                    seats[seat].offline = false;
                }
            break;
            case 'offline':
                this.addMessage(createSystemMessage(people.person.nickName + "暂时离开房间"));
                if (seat > -1) {
                    seats[seat].offline = true;
                }
            break;
            case 'leave':
                this.addMessage(createSystemMessage(people.person.nickName + "离开房间"));
                if (seat > -1) {
                    seats[seat].userInfo = null;
                    seats[seat].offline = false;
                }
            break;
        }
        this.setData({ seats });
    },
    onGameEvent(e) {
        if (e.type === 'start') {
            console.log(e.data);
            const message = this.data.game.start(e.data, this.data.me);
            message && this.addMessage(createSystemMessage(message));
        }
    },
    start() {
        if (this.conn && this.conn.isActive()) {
            this.conn.emit('start');
        } else {
            console.log('connect is down');
        }
    },
    addMessage(msg) {
        const messages = this.data.messages;
        messages.push(msg);
        this.setData({ messages });
    },
    quit() {
        if (this.conn) {
            this.conn.close();
        }
    }
});

// const moveTo = function (old, now) {
//     return new Promise(resolve => {
//         resolve({old, now});
//     });
// };
const getPersonSeat = function (person, seats) {
    if (!person || !person.openId) {
        return -1;
    }
    for (var i = 0; i < seats.length; i++) {
        if (seats[i] && seats[i].userInfo && seats[i].userInfo.openId === person.openId) {
            return i;
        }
    }
    return -1;
}
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
