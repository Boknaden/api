var shared  = require('./_shared.js'),
    bcrypt  = require('bcrypt'),
    User    = shared.models.user

function getUsers (req, res) {
    shared.logger.log('getUsers', "From: " + req.ip)

    if (req.query.userid) {
        User.findOne({
            attributes: ["userid", "username", "email", "firstname", "lastname"],
            include: [],
            where: {
                userid: parseInt(req.query.userid)
            }
        }).then(function (user) {
            res.json(user)
        }).catch(function (err) {
            shared.logger.log('getUsers', 'From: ' + req.ip + ". " + err, 'error')
            console.log(err)
            res.status(404).send({err: 'An error happened'})
        })
        return
    }

    User.findAll({
        attributes: ["userid", "username", "email", "firstname", "lastname"]
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

                User.create({
                    username: req.body.username.trim(),
                    passphrase: hash,
                    email: req.body.email.trim(),
                    phone: parseInt(req.body.phone),
                    firstname: req.body.firstname.trim(),
                    lastname: req.body.lastname.trim(),
                    courseid: parseInt(req.body.courseid),
                    universityid: 1,
                }).then(function (user) {
                    res.json(user)
                }).catch(function (err) {
                    console.log(err)
                    shared.logger.log('newUser', 'From: ' + req.ip + ". " + err, 'error')
                    res.json({err: 'An error happened while creating the user.'})
                })
            })
        } else {
            res.json({err: "User already exists."})
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
