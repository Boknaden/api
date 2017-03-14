var Sequelize = require('sequelize'),
    config    = require('../config.js'),
    sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password)

function AdItem () {
    var aditem = sequelize.define('aditem', {
        aditemid: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        userid: Sequelize.INTEGER,
        adid: Sequelize.INTEGER,
        imageid: Sequelize.INTEGER,
        price: Sequelize.FLOAT,
        text: Sequelize.TEXT,
        description: Sequelize.TEXT,
    }, {
        createdAt: 'createddate',
        updatedAt: 'updateddate',
        tableName: 'aditems',
    })

    return aditem
}

module.exports = AdItem
