var shared        = require('./_shared.js'),
    User          = shared.models.user

function changeEmail (req, res) {
    var email = req.body.email.trim(),
        newVerificationCode = shared.uuid()

    if (email === req.user_token.email) {
        return res.json({
            success: false,
            message: 'Email is the same.'
        })
    }

    shared.logger.log('changeEmail', 'User ' + req.user_token.username + ' is trying to change email')

    User.update({
        email: email,
        verified: 0,
        verificationcode: newVerificationCode,
    }, {
        where: {
            userid: req.user_token.userid
        }
    }).then(function (updated) {
        shared.sendMail(
            'Du har endret epost!',
            email,
            '<h1>Vennligst verifiser den nye e-posten din</h1>' +
            '<p>Gå til følgende lenke for å verifisere: ' + process.env.INTERNAL_IP + ':3000/verify/' + newVerificationCode + '</p>'
        )
        shared.logger.log('changeEmail', 'User ' + req.user_token.username + ' successfully changed email')
        return res.json({
            success: true,
            message: 'Successfully changed email, please verify it.'
        })
    }).catch(function (err) {
        shared.logger.log('changeEmail', 'An error happened when ' + req.user_token.username + ' tried to change email: ' + err, 'error')
        return res.status(500).json({
            success: false,
            message: 'An error happened'
        })
    })
}

module.exports = {
    put: changeEmail,
    requiresAuth: {
        'PUT': true,
    }
}
