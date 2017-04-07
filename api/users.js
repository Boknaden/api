var shared  = require('./_shared.js'),
    bcrypt  = shared.bcrypt,
    User    = shared.models.user,
    Ad      = shared.models.ad,
    AdItem  = shared.models.aditem,
    Image   = shared.models.image,
    Course  = shared.models.course,
    Campus  = shared.models.campus,
    University = shared.models.university

function getUsers (req, res) {
    shared.logger.log('getUsers', "From: " + req.ip)

    let atts = ["userid", "username", "firstname", "lastname"]

    if (req.user_token) {
        atts.push("email")
    }

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
        }).catch(function (err) {
            shared.logger.log('getUsers', 'From: ' + req.ip + ". " + err, 'error')
            console.log(err)
            res.status(404).send({err: 'An error happened'})
        })
    }

    if (req.query.username) {
        return User.findOne({
            attributes: atts,
            include: [
                {
                    model: Ad,
                    order: 'createddate DESC',
                    include: [{ model: AdItem }, {
                        model: Course,
                        include: [{
                            model: Campus,
                            include: [{
                                model: University
                            }]
                        }]
                    }]
                }
            ],
            where: {
                username: req.query.username,
                verified: 1
            }
        }).then(function (user) {
            res.json(user)
        }).catch(function (err) {
            shared.logger.log('getUsers', 'From: ' + req.ip + ". " + err, 'error')
            console.log(err)
            res.status(404).send({err: 'An error happened'})
        })
    }

    return User.findAll({
        attributes: atts,
        where: {
            verified: 1
        }
    }).then(function (users) {
        res.json(users)
    }).catch(function (err) {
        shared.logger.log('getUsers', 'From: ' + req.ip + ". " + err, 'error')
        console.log(err)
        res.status(404).send({err: 'An error happened'})
    })

}

function newUser (req, res) {
    var fields          = ["username", "passphrase", "courseid", "email", "phone", "firstname", "lastname"]
    var valuesNotEmpty  = shared.checkEmptyValues(req.body, fields)

    shared.logger.log('newUser', "From: " + req.ip)

    if (!valuesNotEmpty) {
        res.json({err: 'Not all parameters specified.'})
        return
    }

    User.find({
        where: {
            $or: [
                {username: req.body.username.trim()},
                {email: req.body.email.trim()}
            ]
        }
    }).then(function (user) {

        if (!user) {
            bcrypt.hash(req.body.passphrase, req.boknaden.config.security.saltRounds, function (err, hash) {
                if (err) {
                    shared.logger.log('newUser-hashing', 'From: ' + req.ip + ". " + err, 'error')
                    res.status(500).json({err: 'An error happened while generating safe password.'})
                }
                User.create({
                    username: req.body.username.trim(),
                    passphrase: hash,
                    email: req.body.email.trim(),
                    phone: parseInt(req.body.phone),
                    firstname: req.body.firstname.trim(),
                    lastname: req.body.lastname.trim(),
                    courseid: parseInt(req.body.courseid),
                    universityid: 1,
                    verificationcode: shared.uuid(),
                }).then(function (user) {
                    shared.sendMail(
                        'Velkommen som bruker hos Boknaden!',
                        user.get('email'),
                        '<h1>Velkommen som bruker hos Boknaden!</h1>' +
                        '<p>For å være sikker på at du er en nogenlunde ekte person, '+
                        'vennligst verifiser e-posten din ved å kopiere <strong>' + process.env.INTERNAL_IP + ':3000/verify/' + user.get('verificationcode') +
                        '</strong> inn i nettlseren din.</p>'
                    )
                    res.json(user)
                }).catch(function (err) {
                    console.log(err)
                    shared.logger.log('newUser', 'From: ' + req.ip + ". " + err, 'error')
                    res.json({err: 'An error happened while creating the user.'})
                })
            })
        } else {
            res.json({err: "Username or email already exists."})
        }

    }).catch(function (err) {
        shared.logger.log('newUser', 'From: ' + req.ip + ". " + err, 'error')
        console.log(err)
        res.status(404).json({err: 'An error happened'})
    })

}

module.exports = {
    get: getUsers,
    post: newUser,
    requiresAuth: {
        'GET': false,
        'POST': false,
    }
}
