const app = getApp();

const assert = function () {
    if (!app.globalData.userInfo || !app.globalData.engine) {
        wx.navigateTo({
            url: '/pages/login/login',
        });
    }
};

module.exports = {
    assert
};
