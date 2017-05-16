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
    shared.logger.log('verifyUser', 'From: ' + req.ip)
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
                shared.logger.log('verifyUser', 'Verified user ' + user.get('username') + '.')
                return res.json({success: true, message: 'User successfully verified.'})
            }

            return res.json({success: false})
        }).catch(function (err) {
            shared.logger.log('verifyUser', 'Verification failed for ' + req.body.verificationcode + '. ' + err, 'error')
            return res.json({success: false, message: 'An error happened.'})
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
