var models = require('../../models.js')

module.exports = function () {
    console.log("SYNCING DATABASE FROM MIGRATION")
    models.sequelize.sync().then(function () {
        console.log("SYNCED DATABASE FROM MIGRATION")
    }).catch(function (err) {
        console.log(err)
    })
}
