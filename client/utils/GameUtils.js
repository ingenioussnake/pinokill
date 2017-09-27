const qcloud = require('../vendor/wafer2-client-sdk/index');
const config = require('../config');
const Tips = require('./TipsUtils');
const app = getApp();

const login = () => new Promise((resolve, reject) => {
    Tips.showBusy("正在登陆...");
    if (app.globalData.userInfo) {
        resolve(app.globalData.userInfo);
    } else {
        qcloud.login({
            success(result) {
                if (!!result) {
                    resolve(result);
                } else {
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success: (response) => {
                            !!response.data.data.openId ? resolve(response.data.data) : reject({ type: "user", error: "no data" });
                        },
                        fail: (error) => {
                            reject({ type: "user", error: error });
                        }
                    });
                }
            },
            fail(error) {
                reject({ type: "user", error: error });
            }
        });
    }
});

const engine = () => new Promise((resolve, reject) => {
    Tips.showBusy("正在获取游戏引擎...");
    if (app.globalData.engine) {
        resolve();
    } else {
        updateEngine(app.globalData.version).then(resolve).catch( error => reject({type: 'engine', error: error}) );
    }
});

const updateEngine = version => {
    return new Promise((resolve, reject) => {
        qcloud.request({
            url: config.service.engineUrl,
            data: version,
            success(res) {
                if (res.data.code === 208) { // use local
                    app.globalData.engine = wx.getStorageSync('engine');
                    resolve();
                } else if (!!res.data.data) { // updated
                    app.globalData.engine = res.data.data;
                    app.globalData.version = res.data.data.version;
                    wx.setStorage({
                        key: 'version',
                        data: res.data.data.version
                    });
                    wx.setStorage({
                        key: 'engine',
                        data: res.data.data
                    });
                    resolve();
                } else { // unknown error
                    reject("no engine");
                }
            },
            fail(error) {
                reject(error);
            }
        });
    });
};

const assert = () => {
    return login().then( userInfo => {
        app.globalData.userInfo = userInfo;
        return engine();
    } ).then( () => {
        Tips.showSuccess("游戏初始化完成");
        return Promise.resolve();
    });
};

module.exports = {
    assert
};
