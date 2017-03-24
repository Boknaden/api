var shared        = require('./_shared.js'),
    PasswordReset = shared.models.passwordreset,
    User          = shared.models.user

function changePassword (req, res) {
    var token = req.body.token || req.headers['boknaden-verify'] || false,
        link  = req.body.link || false

    if (token) {
        shared.verifyToken(token, (verified) => {
            changePasswordLoggedInUser(req, res, verified)
        }, (err) => {
            res.status(401).send({success: false, message: 'Invalid token.'})
        })
        return
    }

    if (link) {
        changePasswordReset(req, res, link)
        return
    }

    res.status(404).send({success: false, message: 'Needs more parameters.'})
}

function changePasswordLoggedInUser (req, res, token) {
    var newPassphrase = req.body.passphrase || false

    if (!newPassphrase) {
        res.status(404).json({success: false, message: 'Needs more parameters.'})
        return
    }

    User.findOne({
        where: {
            userid: token.userid
        }
    }).then(function (userRes) {
        if (userRes) {
            shared.bcrypt.hash(newPassphrase, shared.config.security.saltRounds, (err, hash) => {
                if (err) {
                    shared.logger.log('changePasswordLoggedInUser', 'Error happened while hashing password, ' + token.username + '. ' + err, 'error')
                    console.log(err)
                    res.status(500).json({success: false, message: 'An error happened.'})
                    return
                }

                userRes.set('passphrase', hash)
                return userRes.save()
            })
            res.json({success: true, message: 'Updated password.'})
        }
    }).then(function (update) { // on userRes.save()
        if (update)
            res.json({success: true, message: 'Updated password successfully.'})
    }).catch(function (err) {
        shared.logger.log('changePasswordLoggedInUser', 'Error happened while updating user ' + token.username + '. ' + err, 'error')
        console.log(err)
        res.status(500).json({success: false, message: 'An error happened.'})
    })
}

function changePasswordReset (req, res, link) {
    var newPassphrase = req.body.passphrase || false

    if (!newPassphrase) {
        res.status(404).json({success: false, message: 'Needs more parameters.'})
        return
    }

    PasswordReset.findOne({
        where: {
            link: link
        },
        include: [
            {
                model: User,
                attributes: ['username', 'email', 'passphrase']
            }
        ]
    }).then(function (pr) {
        if (pr) {
            shared.bcrypt.hash(newPassphrase, shared.config.security.saltRounds, (err, hash) => {
                if (err) {
                    shared.logger.log('changePasswordReset', 'Error happened while hashing password, ' + token.username + '. ' + err, 'error')
                    console.log(err)
                    res.status(500).json({success: false, message: 'An error happened.'})
                    return
                }

                pr.set('active', 0)
                pr.user.set('passphrase', hash)
                return pr.save()
            })
        }

        res.json({success: true, message: 'Updated password.'})
    }).then(function (update) { // on pr.save()
        if (update)
            res.json({success: true, message: 'Updated password successfully.'})
    }).catch(function (err) {
        shared.logger.log('changePasswordReset', 'Error happened while getting passwordresets ' + err, 'error')
        console.log(err)
        res.status(500).json({success: false, message: 'An error happened.'})
    })
}

module.exports = {
    post: changePassword,
    requiresAuth: {
        'POST': false,
    }
}
