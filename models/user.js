var Sequelize = require('sequelize'),
    config    = require('../config.js'),
    sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password)

function User () {
    var user = sequelize.define('user', {
        userid: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        username: Sequelize.VARCHAR(20),
        passphrase: Sequelize.VARCHAR(255),
        email: Sequelize.VARCHAR(255),
        firstname: Sequelize.VARCHAR(50),
        lastname: Sequelize.VARCHAR(50),
        lastlogin: Sequelize.DATE,
        isadmin: Sequelize.INT,
    }, {
        createdAt: 'createddate',
        updatedAt: 'updateddate',
        tableName: 'users',
    })

    return user
}

module.exports = User
