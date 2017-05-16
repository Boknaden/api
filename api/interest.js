var shared     = require('./_shared.js'),
    Ad         = shared.models.ad,
    AdItem     = shared.models.aditem,
    Interested = shared.models.interested

function getInterests (req, res) {
    var type = req.query.type || 'stakeholder' // 'seller'
    var userid = req.user_token.userid

    switch (type) {
        case 'stakeholder':


            break;
        case 'seller':
            

            break;
    }

    Interested.findAll({
        where: {
            userid: userid
        },
        include: [
            {
                model: AdItem,
                include: [ { model: Ad } ]
            }
        ]
    }).then(function (interest) {
        res.json({
            success: true,
            interests: interest
        })
    }).catch(function (err) {
        res.status(500).json({
            message: 'An error happened',
            success: false,
        })
    })
}

function getInterestsForAd (req, res) {
    var userid = req.user_token.userid,
        adid   = req.query.adid


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
    var aditemids = req.body.aditemids,
        userid    = req.user_token.userid,
        cleaned = []

    if (!Array.isArray(aditemids)) {
        return res.status(404).json({
            success: false,
            message: 'Wrong parameter type.'
        })
    }

    for (var i = 0; i < aditemids.length; i++) {
        aditemids[i] = parseInt(aditemids[i])
        if (Number.isInteger(aditemids[i])) {
            cleaned.push({ userid: userid, aditemid: aditemids[i] })
        }
    }

    return Interested.bulkCreate(cleaned, {
        fields: ['userid', 'aditemid']
    }).then(function (inserted) {
        res.json({
            success: true,
            message: 'Created Interest'
        })
    }).catch(function (err) {

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
