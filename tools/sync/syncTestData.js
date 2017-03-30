var models = require('../../models.js')

console.log('SYNCING TEST DATA')

models.university.create({
    universityname: 'Høgskolen i Sørøst-Norge',
    longitude: 59.368610,
    latitude: 10.442419,
}).then(function (res) {
    console.log('CREATED University ' + res.get('universityname'))
    return models.campus.create({
        campusname: 'Vestfold',
        universityid: res.get('universityid')
    })
}).then(function (res) {
    console.log('CREATED Campus ' + res.get('campusname'))
    return models.course.create({
        coursename: 'Informasjonssystemer og IT-ledelse',
        campusid: res.get('campusid')
    })
}).then(function (res) {
    console.log('CREATED Course ' + res.get('coursename'))
    return models.user.create({
        courseid: 1,
        universityid: 1,
        username: 'biggiesmalls',
        passphrase: '$2a$10$/mV5CtmwMGkeZMtEl2j71uyLtKZ7LQ5mY6fRtMUfp7puVtTD4ar6i',
        email: 'biggie.smalls@gmail.com',
        phone: 95281000,
        firstname: 'Biggie',
        lastname: 'Smalls',
    })
}).then(function (res) {
    console.log('CREATED User ' + res.get('username'))
    return models.ad.create({
        userid: res.get('userid'),
        // universityid: 1,
        courseid: 1,
        // campusid: 1,
        adname: 'Et utvalg bøker',
        text: 'Prisen kan diskuteres, men det er et ganske godt avslag så går ikke veldig under.',
    })

}).then(function (res) {
    console.log('CREATED Ad ' + res.get('adname'))
    return models.aditem.bulkCreate([
        {
            userid: 1,
            universityid: 1,
            adid: res.get('adid'),
            price: '200',
            text: 'IT-Strategi',
            description: 'av Petter Gottschalk',
        }, {
            userid: 1,
            universityid: 1,
            adid: res.get('adid'),
            price: '250',
            text: 'Objektorientert programmering',
            description: 'av Viggo Holmstedt',
        }, {
            userid: 1,
            universityid: 1,
            adid: res.get('adid'),
            price: '149',
            text: 'Ringenes Herre 3',
            description: 'av Tolkien ellerno',
        }
    ])

}).then(function (res) {
    console.log('CREATED AdItems')
}).then(function (questionmark) {
    console.log('FINISHED SYNCING TEST DATA')
}).catch(function (err) {
    console.log(err)
})
