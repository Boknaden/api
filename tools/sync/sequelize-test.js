var models = require('../../models.js')

module.exports = function () {
    console.log("SYNCING TABLES TO DATABASE")
    models.sequelize.sync().then(function () {
        console.log("FINISHED SYNCING TABLES TO DATABASE")
    }).catch(function (err) {
        console.log(err)
    })
}
