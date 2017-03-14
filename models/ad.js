var Sequelize = require('sequelize'),
    config    = require('../config.js'),
    sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password)

function Ad () {
    var ad = sequelize.define('ad', {
        adid: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        userid: Sequelize.INTEGER,
        universityid: Sequelize.INTEGER,
        courseid: Sequelize.INTEGER,
        adname: Sequelize.VARCHAR(100),
    }, {
        createdAt: 'createddate',
        updatedAt: 'updateddate',
        tableName: 'ads',
    })

    return ad
}

module.exports = Ad
