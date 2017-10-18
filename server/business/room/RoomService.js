const { tunnel } = require('../../qcloud')

const TUNL_TO_USER = {}

class RoomService {
    constructor() {
        this.userToTunl = {}
    }

    register(userInfo, tunnelId) {
        const userId = userInfo.openId, oldTunnel = this.userToTunl[userId]
        if (!!oldTunnel) {
            // this.close(oldTunnel)
            delete TUNL_TO_USER[oldTunnel] 
        }
        this.userToTunl[userId] = tunnelId
        TUNL_TO_USER[tunnelId] = userInfo
    }

    unregister(userId) {
        const tunnelId = this.userToTunl[userId]
        delete this.userToTunl[userId]
        delete TUNL_TO_USER[tunnelId]
        return tunnelId
    }

    broadcast(type, content, userId) {
        const tunnels = !!userId ? [this.userToTunl[userId]] : this.getTunnels()
        tunnel.broadcast(tunnels, type, content)
            .then(result => {
                const invalidTunnelIds = result.data && result.data.invalidTunnelIds || []
                if (invalidTunnelIds.length) {
                    console.log('检测到无效的信道 IDs =>', invalidTunnelIds)
                    invalidTunnelIds.forEach(tunnelId => {
                        // this.out(this.tunnelToUser[tunnelId].openId)
                    })
                }
            })
            .catch(e => console.log(`[onBroadcastError] =>`, e))
    }

    close (userId/*, tunnelId*/) {
        // delete TUNL_TO_USER[tunnelId]
        const tunnelId = this.unregister(userId)
        tunnel.closeTunnel(tunnelId)
    }

    getTunnels() {
        return Object.values(this.userToTunl)
    }

    static getUser(tunnelId) {
        return TUNL_TO_USER[tunnelId]
    }

    static getTunnelMap() {
        return TUNL_TO_USER
    }
}

module.exports = RoomService