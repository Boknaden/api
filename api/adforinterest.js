var shared     = require('./_shared.js'),
    Ad         = shared.models.ad,
    AdItem     = shared.models.aditem,
    Interested = shared.models.interested,
    User       = shared.models.user,
    Course     = shared.models.course,
    Campus     = shared.models.campus,
    University = shared.models.university

/*
    getAdDataForInterest leverer ad og aditem for "meld interesse"
    Forskjellen er at dette endepunktet kun viser aditems en bruker
    ikke allerede har meldt interesse for
*/
function getAdDataForInterest (req, res) {
    var adid   = req.query.adid,
        userid = req.user_token.userid

    if (!adid) {
        return res.status(404).json({
            success: false,
            message: 'Needs more parameters.'
        })
    }

    Ad.findOne({
        where: {
            adid: adid
        },
        include: [{
            model: AdItem,
            required: true,
            include: [{
                model: Interested,
                required: true,
                where: {
                    userid: {
                        $ne: userid
                    }
                }
            }],
        }]
    }).then(function (adData) {
        return res.json({
            success: true,
            ad: adData
        })
    }).catch(function (err) {
        shared.logger.log('getAdDataForInterest', 'Couldn\'t get ad data for user ' + req.user_token.username, 'error')
        return res.status(500).json({
            success: false,
            message: 'An error happened'
        })
    })
}

module.exports = {
    get: getAdDataForInterest,
    requiresAuth: {
        'GET': true,
    }
}
