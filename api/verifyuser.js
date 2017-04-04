var shared  = require('./_shared.js'),
    bcrypt  = shared.bcrypt,
    User    = shared.models.user,
    Ad      = shared.models.ad,
    AdItem  = shared.models.aditem,
    Image   = shared.models.image,
    Course  = shared.models.course,
    Campus  = shared.models.campus,
    University = shared.models.university

function getVerifyUser (req, res) {
    shared.logger.log('getVerifyUser', "From: " + req.ip)

    if (req.query.verificationcode) {
        return User.findOne({
            attributes: ["username"],
            where: {
                verificationcode: req.query.verificationcode
            }
        }).then(function (user) {
            if (user) {
                return res.json({success: true, message: 'Verification code valid.'})
            }

            return res.json({success: false})
        })
    }

}

function verifyUser (req, res) {
    if (req.body.verificationcode) {
        return User.findOne({
            attributes: ["userid", "username", "verified"],
            where: {
                verificationcode: req.body.verificationcode
            }
        }).then(function (user) {
            if (user) {
                user.set('verified', 1)
                user.save()
                return res.json({success: true, message: 'User successfully verified.'})
            }

            return res.json({success: false})
        })
    }
}

module.exports = {
    get: getVerifyUser,
    post: verifyUser,
    requiresAuth: {
        'GET': false,
        'POST': false,
    }
}
