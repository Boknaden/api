var Sequelize = require('sequelize'),
    config    = require('./config.js'),
    sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
        port: config.mysql.port
    })

var User = sequelize.define('user', {
    userid: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    courseid: Sequelize.INTEGER,
    universityid: Sequelize.INTEGER,
    username: Sequelize.STRING(20),
    passphrase: Sequelize.STRING(255),
    email: Sequelize.STRING(255),
    firstname: Sequelize.STRING(50),
    lastname: Sequelize.STRING(50),
    lastlogin: Sequelize.DATE,
    isadmin: Sequelize.INTEGER,
}, {
    createdAt: 'createddate',
    updatedAt: 'updateddate',
    tableName: 'users',
})

var Ad = sequelize.define('ad', {
    adid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userid: Sequelize.INTEGER,
    universityid: Sequelize.INTEGER,
    courseid: Sequelize.INTEGER,
    adname: Sequelize.STRING(100),
}, {
    createdAt: 'createddate',
    updatedAt: 'updateddate',
    tableName: 'ads',
})

var AdItem = sequelize.define('aditem', {
    aditemid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
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

var Course = sequelize.define('course', {
    courseid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    coursename: Sequelize.STRING(60),
    universityid: Sequelize.INTEGER,
}, {
    createdAt: 'createddate',
    updatedAt: 'updateddate',
    tableName: 'courses',
})

var University = sequelize.define('university', {
    universityid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    universityname: Sequelize.STRING(60),
    longitude: Sequelize.FLOAT,
    latitude: Sequelize.FLOAT,
}, {
    createdAt: 'createddate',
    updatedAt: 'updateddate',
    tableName: 'universities',
})

var Image = sequelize.define('image', {
    imageid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userid: Sequelize.INTEGER,
    imageurl: Sequelize.STRING(255),
    title: Sequelize.STRING(30),
    description: Sequelize.TEXT,
}, {
    createdAt: 'createddate',
    updatedAt: 'updateddate',
    tableName: 'images',
})

User.hasMany(Ad, { foreignKey: 'userid' })
User.hasMany(AdItem, { foreignKey: 'userid' })
User.hasMany(Image, { foreignKey: 'userid' })

Course.hasMany(User, { foreignKey: 'courseid' })

User.belongsTo(Course, { foreignKey: 'courseid' })
Ad.belongsTo(User, { foreignKey: 'userid' })
AdItem.belongsTo(User, { foreignKey: 'userid' })
Image.belongsTo(User, { foreignKey: 'userid' })

module.exports = {
    user: User,
    ad: Ad,
    aditem: AdItem,
    course: Course,
    university: University,
    image: Image
}
