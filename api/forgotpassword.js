var shared          = require('./_shared'),
    User            = shared.models.user,
    PasswordReset   = shared.models.passwordreset

function initiateReset (req, res) {
    var q = req.body

    if (q.username) {
        User.findOne({
            attributes: ['userid', 'email'],
            where: {
                $or: [
                    {username: q.username},
                    {email: q.username}
                ]
            },
        }).then(function (user) {

            if (!user) {
                res.json({success: true}) // vi sender success: true selvom brukeren ikke fins,
                                          // fordi passord reset kan benyttes for å undersøke hvilke brukere som finnes i databasen
            }

            PasswordReset.findOne({
                attributes: ['passwordresetid', 'userid', 'link'],
                where: {
                    userid: user.get('userid'),
                    active: 1,
                },
            }).then(function (pr) {
                if (!pr) {
                    var rndStr = shared.randomstring.generate(25)

                    PasswordReset.create({
                        userid: user.get('userid'),
                        link: rndStr
                    }).then(function (prC) {
                        sendMail(user.get('email'), rndStr)
                        res.json({success: true})
                    }).catch(function (err) {
                        shared.logger.log('initiateReset', 'Password reset from: ' + req.ip + '. ' + err, 'error')
                        console.log(err)
                        res.status(500).json({success: false, message: 'An error happened.'})
                    })

                } else {
                    sendMail(user.get('email'), pr.link)

                    res.json({success: true})
                }
            }).catch(function (err) {
                shared.logger.log('initiateReset', 'Password reset from: ' + req.ip + '. ' + err, 'error')
                console.log(err)
                res.status(500).json({success: false, message: 'An error happened.'})
            })

        }).catch(function (err) {
            shared.logger.log('initiateReset', 'Password reset from: ' + req.ip + '. ' + err, 'error')
            console.log(err)
            res.status(500).json({success: false, message: 'An error happened.'})
        })
    } else {
        res.status(404).json({success: false, message: 'More parameters are needed.'})
    }
}

function sendMail (email, link) {
    // send epost med en passordlenke
    let transport = shared.getMailTransporter(),
        opts      = {
            from: shared.config.email.defaults.from,
            to: email,
            subject: 'Boknaden: Reset passord',
            html: '<h2>Boknaden</h2><p>Du har bedt om å resette passordet ditt hos Boknaden. Dersom det ikke var deg som ba om dette, slett denne mailen snarest.</p><a>' + link + '</a>'
        }

    transport.sendMail(opts, function (err, info) {
        if (err) {
            shared.logger.log('sendMail', 'Unable to send email to ' + email + ': ' + err, 'error')
            console.log(err)
        }
        shared.logger.log('sendMail', 'Successfully sent email to ' + email + '. ' + info)
    })
}

module.exports = {
    post: initiateReset,
    requiresAuth: {
        'POST': false,
    }
}
