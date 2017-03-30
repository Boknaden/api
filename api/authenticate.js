var shared  = require('./_shared.js'),
    bcrypt  = require('bcrypt'),
    User    = shared.models.user

function authenticate (req, res) {
    var username     = req.body.username,
        passphrase   = req.body.passphrase

    shared.logger.log('authenticate', 'IP: ' + req.ip + ' trying to authenticate.')

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
            // hashing av passord ved hjelp av blowfishalgoritmen
            bcrypt.compare(passphrase, user.passphrase, function (err, authed) {
                if (err) {
                    shared.logger.log('authenticate', 'From ' + user.get('username') + '. ' + err, 'error')
                    res.status(500).json({
                        success: false,
                        message: 'An error happened (0).'
                    })
                    return
                }

                if (!authed) {
                    shared.logger.log('authenticate', 'Login attempt for ' + user.get('username') + ' failed.')
                    res.status(401).json({
                        success: false,
                        message: 'Feil brukernavn eller passord.' // av sikkerhetsmessige grunner røper vi ikke hvilken del av nøklene som er feil
                    })
                    return
                }

                shared.logger.log('authenticate', 'User ' + user.get('username') + ' authenticated.')

                var token = req.service.jwt.sign(user.dataValues, req.boknaden.config.security.secret, {
                    expiresIn: req.boknaden.config.security.tokenExpiration,
                })

                res.json({
                    success: true,
                    token: token,
                })
            })

        } else {
            res.status(401).json({
                success: false,
                message: 'Feil brukernavn eller passord.'
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
