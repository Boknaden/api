var shared  = require('./_shared.js'),
    bcrypt  = require('bcrypt'),
    User    = shared.models.user

function authenticate (req, res) {
    var username     = req.body.username,
        passphrase   = req.body.passphrase

    shared.logger.log('authenticate', 'From: ' + req.ip)

    User.findOne({
        attributes: ["userid", "username", "passphrase", "firstname", "lastname", "email", "isadmin"],
        where: {
            $or: [
                {username: username},
                {email: username}
            ]
        }
    }).then(function (user) {
        if (user) {
            bcrypt.compare(passphrase, user.passphrase, function (err, authed) {
                if (err) {
                    console.log(err)
                    res.json({
                        success: false,
                        message: 'An error happened (0).'
                    })
                    return
                }

                if (!authed) {
                    res.json({
                        success: false,
                        message: 'Your credentials are wrong (0).' // av sikkerhetsmessige grunner røper vi ikke hvilken del av nøklene som er feil
                    })
                    return
                }

                var token = req.service.jwt.sign(user.dataValues, req.boknaden.config.security.secret, {
                    expiresIn: req.boknaden.config.security.tokenExpiration,
                })

                res.json({
                    success: true,
                    token: token,
                })
            })

        } else {
            res.json({
                success: false,
                message: 'Your credentials are wrong (1).'
            })
        }
    }).catch(function (err) {
        shared.logger.log('authenticate', 'From: ' + req.ip + '. ' + err, 'error')
        console.log(err)
        res.json({err: 'Error happened while processing authentication'})
    })
}

module.exports = {
    post: authenticate,
    requiresAuth: {
        'post': false,
    }
}
