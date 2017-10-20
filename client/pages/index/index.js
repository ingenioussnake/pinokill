// 引入 QCloud 小程序增强 SDK
const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');
const GameUtils = require('../../utils/GameUtils');
const Tips = require('../../utils/TipsUtils');
const app = getApp();

/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

    /**
     * 初始数据，我们把服务地址显示在页面上
     */
    data: {
        busy: true,
        userInfo: {},
        room_number: 8715
    },

    onLoad() {
        GameUtils.assert().then( () => {
            this.setData({
                busy: false,
                userInfo: app.globalData.userInfo
            });
        }).catch( error => {
            console.log(error.type, error.error);
            Tips.showModel("游戏初始化失败", "请重试", () => {
                wx.redirectTo({
                    url: '/pages/login/login?callback=' + this.route
                });
            });
        });
    },

    createRoom() {
        wx.showActionSheet({
            itemList: ['狼人杀', '阿瓦隆'],
            success: function (res) {
                if (res.tapIndex === undefined) return;
                wx.navigateTo({
                    url: '/pages/setting/' + (res.tapIndex === 0 ? 'werewolf' : 'avalon')
                });
            }
        })
    },

    joinRoom() {
        var id = String(this.data.room_number);
        qcloud.request({
            url: config.service.roomUrl + '/' + id,
            method: 'PUT',
            success: (res) => {
                if (res.data.code == 404) {
                    Tips.showModel("失败", "房间号不存在");
                } else if (res.data.code == 200) {
                    wx.navigateTo({
                        url: '/pages/room/room?id=' + id
                    });
                } else {
                    Tips.showModel("失败", "无法进入该房间");
                    console.log(res.data.data)
                }
            },
            fail: (error) => {
                Tips.showModel("失败", "无法进入该房间");
                console.log(error)
            }
        });
    }
});
