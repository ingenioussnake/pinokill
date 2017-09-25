module.exports = {
    getEngineVersion: ctx => {
        ctx.body = ctx.app.__game_engine__.version
    },
    getEngine: ctx => {
        ctx.body = ctx.app.__game_engine__
    },
    start: function () {},
    end: function () {},
    action: function () {}
}
