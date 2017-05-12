var shared     = require('./_shared.js'),
    AdItem     = shared.models.aditem,
    Interested = shared.models.interested

function getInterests (req, res) {

}

function newInterest (req, res) {

    var aditemid = req.body.aditemid
        user     = req.user_token

    if (typeof aditemid === 'object' && aditemid) {
        AdItem.findAll({
            where: {
                aditemid: aditemid
            }
        })
    } else if (aditemid) {
        AdItem.find({
            where: {
                aditemid: aditemid
            }
        }).then(function (aditem) {
            if (aditem) {
                return Interested.create({
                    userid: user.userid,
                    aditemid: aditemid
                })
            } else {
                res.json({
                    success: false,
                    message: 'Invalid aditem ' + aditemid
                })
            }
        }).then(function (interest) {
            shared.logger.log('newInterest', 'New interest created by ' + user.username)
            res.json({
                success: true,
                message: 'Successfully created interest for aditem ' + aditem.text
            })
        }).catch(function (err) {
            shared.logger.log('newInterest', 'New interest created by ' + user.username + ' threw error ' + err, 'error')
            res.status(500).json({
                success: false,
                message: 'An error happened'
            })
        })
    } else {
        res.json({
            success: false,
            message: 'Requires aditems ya dingus'
        })
    }



}

module.exports = {
    get: getInterests,
    requiresAuth: {
        'GET': true,
        'POST': true,
    }
}
