var logger    = require('./tools/logger.js'),
    Sequelize = require('sequelize'),
    config    = require('./config.js'),
    sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
        port: config.mysql.port,
        logging: false,
    })

var User = sequelize.define('user', {
    userid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    courseid: { type: Sequelize.INTEGER, allowNull: false },
    universityid: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 1 },
    username: { type: Sequelize.STRING(20), allowNull: false },
    passphrase: { type: Sequelize.STRING(255), allowNull: false },
    email: { type: Sequelize.STRING(255), allowNull: false },
    phone: { type: Sequelize.INTEGER, allowNull: false },
    firstname: { type: Sequelize.STRING(50), allowNull: false },
    lastname: { type: Sequelize.STRING(50), allowNull: false },
    lastlogin: Sequelize.DATE,
    isadmin: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
    deleted: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
}, {
    createdAt: 'createddate',
    updatedAt: 'updateddate',
    tableName: 'users',
})

var Log = sequelize.define('log', {
    logid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    loggedfrom: { type: Sequelize.STRING(255), allowNull: false },
    message: { type: Sequelize.TEXT, allowNull: false },
    state: { type: Sequelize.ENUM('info', 'error'), allowNull: false }
}, {
    createdAt: 'createddate',
    updatedAt: 'updateddate',
    tableName: 'logs',
})

var Ad = sequelize.define('ad', {
    adid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userid: { type: Sequelize.INTEGER, allowNull: false },
    universityid: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 1 },
    courseid: { type: Sequelize.INTEGER, allowNull: false },
    adname: { type: Sequelize.STRING(100), allowNull: false },
    text: { type: Sequelize.TEXT, allowNull: true },
    pinned: { type: Sequelize.DATE, allowNull: true },
    deleted: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
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
    isbn: { type: Sequelize.STRING(13), allowNull: true },
    deleted: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
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
    deleted: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
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
    deleted: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
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
    deleted: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
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
    deleted: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
}, {
    createdAt: 'createddate',
    updatedAt: 'updateddate',
    tableName: 'chatmessages',
})

var PasswordReset = sequelize.define('passwordreset', {
    passwordresetid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userid: { type: Sequelize.INTEGER, allowNull: false },
    link: { type: Sequelize.STRING(255), allowNull: false },
    active: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 }
}, {
    createdAt: 'createddate',
    updatedAt: 'updateddate',
    tableName: 'passwordresets',
})

User.hasMany(Ad, { foreignKey: 'userid' })
User.hasMany(AdItem, { foreignKey: 'userid' })
User.hasMany(Image, { foreignKey: 'userid' })
User.hasMany(PasswordReset, { foreignKey: 'userid' })
User.belongsTo(Course, { foreignKey: 'courseid' })

University.hasMany(Ad, { foreignKey: 'universityid' })
University.hasMany(Course, { foreignKey: 'universityid' })

Course.hasMany(User, { foreignKey: 'courseid' })
Course.hasMany(Ad, { foreignKey: 'courseid' })
Course.belongsTo(University, { foreignKey: 'universityid' })

Ad.hasMany(AdItem, { foreignKey: 'adid' })
Ad.belongsTo(User, { foreignKey: 'userid' })
Ad.belongsTo(Course, { foreignKey: 'courseid' })
Ad.belongsTo(University, { foreignKey: 'universityid' })

AdItem.belongsTo(Ad, { foreignKey: 'adid' })
AdItem.belongsTo(User, { foreignKey: 'userid' })
AdItem.belongsTo(Image, { foreignKey: 'imageid' })

Image.belongsTo(User, { foreignKey: 'userid' })
Image.hasMany(AdItem, { foreignKey: 'imageid' })

PasswordReset.belongsTo(User, { foreignKey: 'userid' })

module.exports = {
    sequelize: sequelize,
    user: User,
    ad: Ad,
    aditem: AdItem,
    course: Course,
    university: University,
    image: Image,
    log: Log,
    passwordreset: PasswordReset,
}
