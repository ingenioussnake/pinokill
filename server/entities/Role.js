const Role = function (config={}) {
    this.name = config.name;
    this.label = config.label
    this.campus = config.campus
    this.checkAsWerewolf = config.checkAsWerewolf
    this.required = config.required
    this.enabled = config.enabled
    this.priority = config.priority
}

module.exports = Role
