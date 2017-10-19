const RoomUtils = require("../business/room/RoomUtils")
const RoomService = require("../business/room/RoomService")
const { tunnel } = require('../qcloud')
const debug = require('debug')('koa-weapp-demo')

const onRoomMessage = (room, userInfo, type, content) => {
    switch (type) {
        case 'seat':
            room.sit(userInfo.openId, content.to)
        break
        case 'kickout':
        break
        default:
        break
    }
}

module.exports = {
    create: async ctx => {
        const config = ctx.request.body
        config.host = ctx.state.$wxInfo.userinfo.openId
        const room = await RoomUtils.create(config)
        ctx.state.code = 200
        ctx.state.data = room.id
    },
    join: async ctx => {
        const id = ctx.params.id
        ctx.state.code = 404
        ctx.state.data = id
        if (RoomUtils.registerUser(ctx.state.$wxInfo.userinfo.openId, id)) {
            ctx.state.code = 200
        }
    },
    update: async ctx => {
        const id = ctx.params.id,
            config = ctx.request.body
            room = RoomUtils.findById[id]
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
        const userId = data.userinfo.openId
        const room = RoomUtils.findByUser(userId)
        if (room) {
            room.knock(data.userinfo, tunnelInfo.tunnelId)
            ctx.state.code = 200
        } else {
            ctx.state.code = 304
        }
        ctx.state.data = tunnelInfo
        console.log("Tunnel get", RoomUtils.getRooms(), RoomUtils.getRoomMap(), RoomService.getTunnelMap())
    },
    post: async ctx => {
        const packet = await tunnel.onTunnelMessage(ctx.request.body)
        const tunnelId = packet.tunnelId
        const userInfo = RoomService.getUser(tunnelId)
        const room = !!userInfo && RoomUtils.findByUser(userInfo.openId)
        debug('Tunnel recive a package: %o', packet)
        console.log("Tunnel recive a package", packet, RoomUtils.getRooms(), RoomUtils.getRoomMap(), RoomService.getTunnelMap())
        if (!room || !userInfo) {
            console.log(packet.type, `Unknown room tunnelId(${tunnelId}), close it`)
            tunnel.closeTunnel(tunnelId)
            return
        } //TODO: tunnelMap?
        switch (packet.type) {
            case 'connect':
                room.in(userInfo)
                break
            case 'message':
                onRoomMessage(room, userInfo, packet.content.messageType, packet.content.messageContent)
                break
            case 'close':
                room.out(userInfo)
                // TODO: destroy the room if it's empty
                break
        }
    }
}
