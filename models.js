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
    courseid: { type: Sequelize.INTEGER, allowNull: false },
    universityid: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 1 },
    username: { type: Sequelize.STRING(20), allowNull: false },
    passphrase: { type: Sequelize.STRING(255), allowNull: false },
    email: { type: Sequelize.STRING(255), allowNull: false },
    firstname: { type: Sequelize.STRING(50), allowNull: false },
    lastname: { type: Sequelize.STRING(50), allowNull: false },
    lastlogin: Sequelize.DATE,
    isadmin: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
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
    userid: { type: Sequelize.INTEGER, allowNull: false },
    universityid: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 1 },
    courseid: { type: Sequelize.INTEGER, allowNull: false },
    adname: { type: Sequelize.STRING(100), allowNull: false },
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
    userid: { type: Sequelize.INTEGER, allowNull: false },
    adid: { type: Sequelize.INTEGER, allowNull: false },
    imageid: { type: Sequelize.INTEGER, allowNull: true },
    price: { type: Sequelize.FLOAT, allowNull: false },
    text: { type: Sequelize.TEXT, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: true },
    isbn: { type: Sequelize.INTEGER(13), allowNull: true },
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
    coursename: { type: Sequelize.STRING(60), allowNull: false },
    universityid: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 1 },
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
    universityname: { type: Sequelize.STRING(60), allowNull: false },
    longitude: { type: Sequelize.FLOAT, allowNull: false },
    latitude: { type: Sequelize.FLOAT, allowNull: false },
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
    userid: { type: Sequelize.INTEGER, allowNull: false },
    imageurl: { type: Sequelize.STRING(255), allowNull: false },
    title: { type: Sequelize.STRING(30), allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: true },
}, {
    createdAt: 'createddate',
    updatedAt: 'updateddate',
    tableName: 'images',
})

var Chat = sequelize.define('chat', {
    chatid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    initiatorid: { type: Sequelize.INTEGER, allowNull: false },
    recipientid: { type: Sequelize.INTEGER, allowNull: false },
}, {
    createdAt: 'createddate',
    updatedAt: 'updateddate',
    tableName: 'chats',
})

var ChatMessage = sequelize.define('chatmessage', {
    chatmessageid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userid: { type: Sequelize.INTEGER, allowNull: false },
    chatid: { type: Sequelize.INTEGER, allowNull: false },
    message: { type: Sequelize.TEXT, allowNull: false },
    imageid: { type: Sequelize.INTEGER, allowNull: true },
}, {
    createdAt: 'createddate',
    updatedAt: 'updateddate',
    tableName: 'chatmessages',
})

User.hasMany(Ad, { foreignKey: 'userid' })
User.hasMany(AdItem, { foreignKey: 'userid' })
User.hasMany(Image, { foreignKey: 'userid' })
User.belongsTo(Course, { foreignKey: 'courseid' })

University.hasMany(Ad, { foreignKey: 'universityid' })

Course.hasMany(User, { foreignKey: 'courseid' })
Course.hasMany(Ad, { foreignKey: 'courseid' })

Ad.belongsTo(User, { foreignKey: 'userid' })
Ad.belongsTo(Course, { foreignKey: 'courseid' })
Ad.belongsTo(University, { foreignKey: 'universityid' })
AdItem.belongsTo(User, { foreignKey: 'userid' })
Image.belongsTo(User, { foreignKey: 'userid' })

module.exports = {
    sequelize: sequelize,
    user: User,
    ad: Ad,
    aditem: AdItem,
    course: Course,
    university: University,
    image: Image
}
