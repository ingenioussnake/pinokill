module.exports = {
    getEngine: ctx => {
        const version = ctx.request.body,
              engine = ctx.app.__game_engine__
        if (version === engine.version) {
            ctx.state.code = 208
        } else {
            ctx.state.code = 200;
            ctx.state.data = ctx.app.__game_engine__
        }
    }
}
