/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/pinokill'   // 定义所有路由的前缀都已 /pinokill 开头
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 --- //
// 登录接口 /pinokill/login
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态） /pinokill/user
router.get('/user', validationMiddleware, controllers.user)

// --- 房间操作 --- //
// 创建房间，返回房间id /pinokill/room
router.put('/room', controllers.room.create)
// 进入房间，放回房间配置及座位及状态 /pinokill/room/:rid
router.get('/room/:rid', controllers.room.join)
// 修改房间配置 /pinokill/room/:rid
router.put('/room/:rid', controllers.room.update)
// 退出房间 /pinokill/room/:rid
router.delete('/room/:rid', controllers.room.quit)
// 退出房间 /pinokill/seat/:rid
router.post('/seat/:rid', controllers.room.sit)

// --- 游戏操作 --- //
// 获取引擎版本 /pinokill/version
router.get('/version', controllers.game.getEngineVersion)
// 获取引擎 /pinokill/engine
router.get('/engine', controllers.game.getEngine)
// 开始游戏 /pinokill/game
router.put('/game', controllers.game.start)
// 结束游戏 /pinokill/game
router.delete('/game', controllers.game.end)
// 游戏数据
router.post('/action', controllers.game.action)

module.exports = router
