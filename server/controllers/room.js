const Room = require("../entities/Room")
const { tunnel } = require('../qcloud')
const debug = require('debug')('koa-weapp-demo')

const userMap = {}
const roomMap = {}

const $getRoomTunnels = room => room.getAllPeople().filter( person => !!person ).map( person => person.tunnelId)
/**
 * 调用 tunnel.broadcast() 进行广播
 * @param  {String} type    消息类型
 * @param  {String} content 消息内容
 */
const $broadcast = (targets, type, content) => {
    tunnel.broadcast(targets, type, content)
        .then(result => {
            const invalidTunnelIds = result.data && result.data.invalidTunnelIds || []

            if (invalidTunnelIds.length) {
                console.log('检测到无效的信道 IDs =>', invalidTunnelIds)

                // 从 userMap 和 connectedTunnelIds 中将无效的信道记录移除
                invalidTunnelIds.forEach(tunnelId => {
                    const invalidUser = userMap[tunnelId]
                    const room = roomMap[invalidUser.openId]
                    room.removePlayer(invalidUser.openId)
                    delete userMap[tunnelId]
                })
            }
        }).catch( e => console.log(`[onBroadcastError] =>`, e))
}

/**
 * 调用 TunnelService.closeTunnel() 关闭信道
 * @param  {String} tunnelId 信道ID
 */
const $close = (tunnelId) => {
    tunnel.closeTunnel(tunnelId)
}

/**
 * 实现 onConnect 方法
 * 在客户端成功连接 WebSocket 信道服务之后会调用该方法，
 * 此时通知所有其它在线的用户当前总人数以及刚加入的用户是谁
 */
function onConnect (tunnelId) {
    console.log(`[onConnect] =>`, { tunnelId })

    if (tunnelId in userMap) {
        const user = userMap[tunnelId],
            room = roomMap[user.openId]
        $broadcast([tunnelId], 'join', room)
        room.in(user, tunnelId)

        $broadcast($getRoomTunnels(room), 'people', {
            'enter': user
        })
    } else {
        console.log(`Unknown tunnelId(${tunnelId}) was connectd, close it`)
        $close(tunnelId)
    }
}

/**
 * 实现 onMessage 方法
 * 客户端推送消息到 WebSocket 信道服务器上后，会调用该方法，此时可以处理信道的消息。
 * 在本示例，我们处理 `speak` 类型的消息，该消息表示有用户发言。
 * 我们把这个发言的信息广播到所有在线的 WebSocket 信道上
 */
function onMessage (tunnelId, type, content) {
    console.log(`[onMessage] =>`, { tunnelId, type, content })
    if (tunnelId in userMap) {
        const user = userMap[tunnelId],
            room = roomMap[user.openId]
        switch (type) {
            case 'seat':
                    const version = room.sit(user.openId, content.to)
                    version && $broadcast($getRoomTunnels(room), 'seat', {
                        'version': version,
                        'seats': room.players
                    })
                break

            default:
                break
        }
    } else {
        $close(tunnelId)
    }
}

/**
 * 实现 onClose 方法
 * 客户端关闭 WebSocket 信道或者被信道服务器判断为已断开后，
 * 会调用该方法，此时可以进行清理及通知操作
 */
function onClose (tunnelId) {
    console.log(`[onClose] =>`, { tunnelId })

    if (!(tunnelId in userMap)) {
        console.log(`[onClose][Invalid TunnelId]=>`, tunnelId)
        $close(tunnelId)
        return
    }

    const leaveUser = userMap[tunnelId]
    delete userMap[tunnelId]
    const room = roomMap[leaveUser.openId]
    room.out(leaveUser.openId)

    // 聊天室没有人了（即无信道ID）不再需要广播消息
    if (room.getAllPeople().length > 0) {
        $broadcast($getRoomTunnels(room), 'people', {
            'leave': leaveUser
        })
    } else {
        Room.destroy(room.id)
    }
}

module.exports = {
    create: async ctx => {
        const config = ctx.request.body
        config.host = ctx.state.$wxInfo.userinfo.openId
        const room = await Room.create(config)
        roomMap[ctx.state.$wxInfo.userinfo.openId] = room
        ctx.state.code = 200
        ctx.state.data = room.id
    },
    join: async ctx => {
        const id = this.params.id
        const room = Room.find(id)
        ctx.state.code = 404
        ctx.state.data = id
        if (room) {
            roomMap[ctx.state.$wxInfo.userinfo.openId] = room
            ctx.state.code = 200
        }
    },
    update: async ctx => {
        const id = this.params.id,
            config = ctx.request.body
            room = rooms[id]
        ctx.state.code = 404
        ctx.state.data = id
        if (room) {
            if (room.host === ctx.state.$wxInfo.userinfo.openId) {
                room.update(config)
                ctx.state.code = 200
            } else {
                ctx.state.code = 304
                ctx.state.data = "Not host"
            }
        }
    },
    get: async ctx => {
        const data = await tunnel.getTunnelUrl(ctx.req)
        const tunnelInfo = data.tunnel

        userMap[tunnelInfo.tunnelId] = data.userinfo

        ctx.state.data = tunnelInfo
    },
    post: async ctx => {
        const packet = await tunnel.onTunnelMessage(ctx.request.body)

        debug('Tunnel recive a package: %o', packet)

        switch (packet.type) {
            case 'connect':
                onConnect(packet.tunnelId)
                break
            case 'message':
                onMessage(packet.tunnelId, packet.content.messageType, packet.content.messageContent)
                break
            case 'close':
                onClose(packet.tunnelId)
                break
        }
    }
}
