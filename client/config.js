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

        engineUrl: `${host}/pinokill/engine`,

        versionUrl: `${host}/pinokill/engine/version`,

        roomUrl: `${host}/pinokill/room`
    }
};

module.exports = config;