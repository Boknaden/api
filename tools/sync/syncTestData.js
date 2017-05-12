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

    return models.campus.create({
        campusname: 'Bø',
        universityid: 1
    })
}).then(function (res) {
    console.log('CREATED Campus ' + res.get('campusname'))

    return models.course.create({
        coursename: 'Eiendomsmegling',
        campusid: res.get('campusid')
    })
}).then(function (res) {
    console.log('CREATED Course ' + res.get('coursename'))

    return models.user.create({
        courseid: 1,
        username: 'biggiesmalls',
        passphrase: '$2a$10$/mV5CtmwMGkeZMtEl2j71uyLtKZ7LQ5mY6fRtMUfp7puVtTD4ar6i',
        email: 'nichiatu@gmail.com',
        phone: 95281000,
        firstname: 'Biggie',
        lastname: 'Smalls',
        verified: 1,
    })
}).then(function (res) {
    console.log('CREATED User ' + res.get('username'))

    return models.user.create({
        courseid: 1,
        username: 'nictorgersen',
        passphrase: '$2a$10$/mV5CtmwMGkeZMtEl2j71uyLtKZ7LQ5mY6fRtMUfp7puVtTD4ar6i',
        email: 'nichlas.torgersen@gmail.com',
        phone: 95281000,
        firstname: 'Nic',
        lastname: 'Tor',
        isadmin: 1,
        verified: 1,
    })
}).then(function (res) {
    console.log('CREATED User ' + res.get('username'))

    return models.ad.create({
        userid: res.get('userid'),
        courseid: 1,
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

    return models.chat.create({
        initiatorid: 1,
        recipientid: 2,
    })

}).then(function (res) {
    console.log('CREATED test Chat')

    return models.chatmessage.bulkCreate([
        { chatid: 1, message: 'Hei, har du den derre boka?', userid: 1 },
        { chatid: 1, message: 'Nei, solgte den til noen nå nettopp :(', userid: 2 },
        { chatid: 1, message: 'Ah, ok. Lame. Da får jeg kjøpe den på Brage til flere hundre tusen.', userid: 1 },
        { chatid: 1, message: 'Kjipern ass... Jaja, lykke til.', userid: 2 },
        { chatid: 1, message: 'Takk, kan hende jeg må ha en av de andre bøkene dine.', userid: 1 },
        { chatid: 1, message: 'Trenger egentlig den andre, faktisk.', userid: 1 },
        { chatid: 1, message: 'Ok, send meg SMS på 95281000 hvis du lurer på noe mer, da!', userid: 2 },
        { chatid: 1, message: 'Er på skolen i hele dag, og har boka med meg så det er bare å ringe.', userid: 2 },
        { chatid: 1, message: 'Ok, takk. Er ikke på skolen før i 13-tida, men tar kontakt.', userid: 1 },
    ])
}).then(function (res) {
    console.log('CREATED test ChatMessages')
}).then(function (questionmark) {
    console.log('FINISHED SYNCING TEST DATA')
    console.log('CLOSING CONNECTION')
}).catch(function (err) {
    console.log(err)
})
