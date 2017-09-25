/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://hg6evmzy.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        loginUrl: `${host}/pinokill/login`,

        requestUrl: `${host}/pinokill/user`,

        versionUrl: `${host}/pinokill/version`,

        engineUrl: `${host}/pinokill/engine`,

        roomUrl: `${host}/pinokill/room`,

        seatUrl: `${host}/pinokill/seat`,

        gameUrl: `${host}/pinokill/game`,

        actionUrl: `${host}/pinokill/action`,
    }
};

module.exports = config;