var shared      = require('./_shared.js'),
    User        = shared.models.user,
    Ad          = shared.models.ad,
    AdItem      = shared.models.aditem,
    Course      = shared.models.course,
    Campus      = shared.models.campus,
    University  = shared.models.university,
    Image       = shared.models.image,
    Interested  = shared.models.interested,
    Chat        = shared.models.chat,
    ChatMessage = shared.models.chatmessage

/*
    Kjøper (buyer):
    - En kjøper vil se alle objekter h*n har meldt interesse for
    - En kjøper vil opprette en chat med en selger for en vist interesse

    Selger (seller):
    - En selger vil se alle ads som har meldte interesser
*/

function getInterests (req, res) {
    var type = req.query.type || 'buyer' // 'seller'
    var userid = req.user_token.userid

    switch (type) {
        case 'buyer':
            // Finner alle ads, aditems og interesser for en bruker
            Ad.findAll({
                where: {
                    deleted: 0,
                },
                include: [{
                    model: AdItem,
                    include: [{
                        model: Interested,
                        where: {
                            userid: userid
                        },
                    }, {
                        model: Image,
                        attributes: ['imageurl']
                    }]
                }, {
                    model: Course,
                    include: [{
                        model: Campus,
                        include: [{
                            model: University
                        }]
                    }]
                }]
            }).then(function (interests) {
                var ads = {}

                res.json({
                    success: true,
                    interests: interests
                })
            }).catch(function (err) {
                res.status(500).json({
                    message: 'An error happened',
                    success: false,
                })
            })

            break;
        case 'seller':
            getInterestsForSeller(req, res)

            break;
    }

}

/*
    For en selger til å sjekke interesser per ad
*/
function getInterestsForSeller (req, res) {
    var userid = req.user_token.userid,
        adid   = parseInt(req.query.adid) || null,
        where = {
            userid: userid
        }

    if (adid && Number.isInteger(adid)) {
        where['adid'] = adid
    }

    Ad.findAll({
        where: {
            userid: userid,
            deleted: 0,
        },
        include: [
            {
                model: AdItem,
                include: [{
                    model: Interested
                }]
            }
        ]
    }).then(function (ads) {
        return res.json({
            ads: ads
        })
    }).catch(function (err) {
        shared.logger.log('Error while getting ads for ' + req.user_token.username + '. ' + err, 'error')
        return res.status(500).json({
            success: false,
            message: 'An error happened.'
        })
    })
}

/*
    Vi behøver et array med aditemid'er
    Deretter sjekker vi en etter en at de finnes,
    for så å sette de inn i Interested-tabellen

    Vi oppretter en chat hvis en ikke
    finnes allerede for brukeren som eier Ad'en
    Hvis en Interested finnes, legger vi inn en
    melding i chaten

    En bruker kan kun legge inn Interest for
    èn Ad av gangen
*/
function newInterest (req, res) {
    var aditems = req.body.aditems,
        userid  = req.user_token.userid,
        message = req.body.message,
        cleaned = []

    if (!Array.isArray(aditems)) {
        return res.status(404).json({
            success: false,
            message: 'Wrong parameter type.'
        })
    }

    if (aditems.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'This endpoint requires some items.'
        })
    }

    for (var i = 0; i < aditems.length; i++) {
        var item = aditems[i]

        if (typeof item === 'object') {
            if (item.hasOwnProperty('aditemid')) {
                item.aditemid = parseInt(item.aditemid)
                if (Number.isInteger(item.aditemid)) {
                    cleaned.push({ userid: userid, aditemid: item.aditemid })
                }
            }
        }

    }

    Interested.bulkCreate(cleaned, {
        fields: ['userid', 'aditemid']
    }).then(function (inserted) {

        Ad.findOne({
            include: [
                {
                    model: AdItem,
                    where: {
                        aditemid: cleaned[0].aditemid
                    }
                }, {
                    model: User,
                    attributes: ["userid"]
                }
            ]
        }).then(function (ad) {

            Chat.create({
                initiatorid: userid,
                recipientid: ad.get('userid'),
                chatmessages: [{
                    userid: userid,
                    message: message
                }]
            }, {
                include: [ ChatMessage ]
            }).then(function (chat) {

                return res.json({
                    success: true,
                    message: 'Created interests for ' + req.user_token.username,
                    chatid: chat.get('chatid')
                })

            }).catch(function (err) {
                shared.logger.log('newInterest', 'Error happened while creating chat for ' + req.user_token.username + '. ' + err, 'error')
                return res.status(500).json({
                    success: false,
                    message: 'An error happened.'
                })
            })

        }).catch(function (err) {
            shared.logger.log('newInterest', 'Error happened while getting ad for interest created by ' + req.user_token.username + '. ' + err, 'error')
            return res.status(500).json({
                success: false,
                message: 'An error happened.'
            })
        })

    }).catch(function (err) {
        shared.logger.log('newInterest', 'Error happened while creating interest for ' + req.user_token.username + '. ' + err, 'error')
        return res.status(500).json({
            success: false,
            message: 'An error happened.'
        })
    })

}

module.exports = {
    get: getInterests,
    post: newInterest,
    requiresAuth: {
        'GET': true,
        'POST': true,
    }
}
