// 引入 QCloud 小程序增强 SDK
const Tips = require('../../utils/TipsUtils');
const GameUtils = require('../../utils/GameUtils');
/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

    /**
     * 初始数据，我们把服务地址显示在页面上
     */
    data: {
        callback: "",
        error: false
    },

    onLoad(options) {
        this.setData( {callback: options.callback });
        this.onError();
    },

    onError(showModel) {
        showModel && Tips.showModel("游戏初始化失败", "请重试");
        this.setData({ error: true });
    },

    init() {
        GameUtils.assert().then( () => goBack() ).catch( error => this.onError(true));
    }
});

const goBack = function () {
    wx.redirectTo({
        url: this.data.callback
    });
};
