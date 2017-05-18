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
            attributes: ["username", "verified"],
            where: {
                verificationcode: req.query.verificationcode
            }
        }).then(function (user) {
            if (user) {
                if (user.get('verified') === 1) {
                    return res.json({success: false, message: 'Verification code already used.'})
                }

                return res.json({success: true, message: 'Verification code valid.'})
            }

            return res.json({success: false})
        })
    }

}

function verifyUser (req, res) {
    if (req.body.verificationcode) {
        User.findOne({
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
    } else {
        return res.json({
            success: false,
            message: 'An error happened.'
        })
    }
}

function resendVerification (req, res) {
    var user = req.user_token,
        verified = !!user.verified

    if (verified) {
        shared.logger.log('resendVerification', user.username + ' is already verified, but tried to resend verification email.', 'notice')
        return res.json({
            success: true,
            message: 'User already verified.',
        })
    }

    User.findOne({
        attributes: ["userid", "username", "email", "verificationcode"],
        where: {
            userid: user.userid
        }
    }).then(function (user) {
        if (user) {
            shared.sendMail(
                'Velkommen som bruker hos Boknaden!',
                user.get('email'),
                '<h1>Du har bedt om en ny verifiseringsepost!</h1>' +
                '<p>For å verifisere brukeren din '+
                'vennligst besøk følgende lenke <strong><a href="' + process.env.INTERNAL_IP + ':3000/verify/' + user.get('verificationcode') + '">' + process.env.INTERNAL_IP + ':3000/verify/' + user.get('verificationcode') +
                '</a></strong>. Mest sannsynlig må du kopiere den inn manuelt i nettleseren din.</p>'
            )

            shared.logger.log('resendVerification', 'Resent verification to ' + user.get('username') + ' successfully.')

            return res.json({
                success: true,
                message: 'Resent verification successfully.'
            })
        }

        shared.logger.log(
            'resendVerification',
            'Failed to send verification for a user with a token where the user doesn\'t exist. User: ' + user.username,
            'error')
    }).catch(function (err) {
        shared.logger.log('resendVerification', 'Error when sending verification to ' + user.username + '. ' + err, 'error')
        return res.status(500).json({
            success: false,
            message: 'An error happened.'
        })
    })
}

module.exports = {
    get: getVerifyUser,
    post: verifyUser,
    put: resendVerification,
    requiresAuth: {
        'GET': false,
        'POST': false,
        'PUT': true,
    }
}
