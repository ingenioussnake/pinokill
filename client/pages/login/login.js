// 引入 QCloud 小程序增强 SDK
const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');

const app = getApp();
const Tips = require('../../utils/TipsUtils');

/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

    /**
     * 初始数据，我们把服务地址显示在页面上
     */
    data: {
        user_error: true,
        engine_error: true
    },

    onLoad() {
        Tips.showBusy('正在登录');
        if (!app.globalData.userInfo) {
            this.doLogin();
        } else {
            this.onUpdate({ user_error: false });
        }
        if (!app.globalData.engine) {
            if (!app.globalData.version) {
                this.updateEngine();
            } else {
                _getLatestEngineVersion().then( version => {
                    if (version === app.globalData.version) {
                        app.globalData.engine = wx.getStorageSync('engine');
                        this.onUpdate({ engine_error: false });
                    } else {
                        this.updateEngine();
                    }
                }, error => {
                    this.onUpdate({ engine_error: true });
                });
            }
        } else {
            this.onUpdate({ engine_error: false });
        }
    },

    doLogin() {
        _doLogin().then(userInfo => {
            app.globalData.userInfo = userInfo;
            this.onUpdate({ user_error: false });
        }, error => {
            Tips.showModel('登录失败', error);
            console.log('登录失败', error);
            app.globalData.userInfo = null;
            this.onUpdate({ user_error: true });
        });
    },

    updateEngine() {
        _updateEngine().then(engine => {
            app.globalData.engine = engine.data;
            app.globalData.version = engine.data.version;
            wx.setStorage({
                key: 'version',
                data: engine.data.version,
            });
            wx.setStorage({
                key: 'engine',
                data: engine.data,
            })
            this.onUpdate({ engine_error: false });
        }, error => {
            Tips.showModel('更新引擎失败', error);
            console.log('更新引擎失败', error);
            app.globalData.engine = null;
            this.onUpdate({ engine_error: true });
        });
    },

    onUpdate(data) {
        this.setData(data);
        !this.data.user_error && !this.data.engine_error && goBack();
    }
});

const _doLogin = () => {
    return new Promise((resolve, reject) => {
        qcloud.login({
            success(result) {
                if (!result) {
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success: (response) => {
                            !!response.data.data.openId ? resolve(response.data.data) : reject("no data");
                        },
                        fail: (error) => {
                            reject(error);
                        }
                    });
                } else {
                    resolve(result);
                }
            },

            fail(error) {
                reject(error);
            }
        });
    });
};

const _updateEngine = () => {
    return new Promise((resolve, reject) => {
        qcloud.request({
            url: config.service.engineUrl,
            success(result) {
                resolve(result);
            },

            fail(error) {
                Tips.showModel('更新引擎失败', error);
                console.log('更新引擎失败', error);
                reject(error);
            }
        });
    });
};

const _getLatestEngineVersion = () => {
    return new Promise((resolve, reject) => {
        qcloud.request({
            url: config.service.versionUrl,
            success(result) {
                resolve(result);
            },
            fail(error) {
                reject(error);
            }
        });
    });
};

const goBack = function () {
    wx.navigateBack({
        delta: 1
    });
};
