const qcloud = require('../vendor/wafer2-client-sdk/index');
const config = require('../config');
const Tips = require('./TipsUtils');

const login = onLogin => {
    Tips.showBusy('正在登录');
    qcloud.login({
        success(result) {
            var app = getApp();
            if (!result) {
                qcloud.request({
                    url: config.service.requestUrl,
                    login: true,
                    success: (response) => {
                        app.globalData.userInfo = response.data.data;
                        onLogin && onLogin(response.data.data);
                    }
                });
            } else {
                app.globalData.userInfo = result;
                onLogin && onLogin(result);
            }
        },

        fail(error) {
            Tips.showModel('登录失败', error);
            console.log('登录失败', error);
        }
    });
};

module.exports = {
    login
}
