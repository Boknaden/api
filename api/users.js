var shared  = require('./_shared.js'),
    models  = require('../models.js'),
    bcrypt  = require('bcrypt'),
    User    = models.user

function getUsers (req, res) {
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
            console.log(err)
            res.status(404).send({err: 'An error happened'})
        })
    }
    User.findAll({
        attributes: ["userid", "username", "email", "firstname", "lastname"]
    }).then(function (users) {
        res.json(users)
    }).catch(function (err) {
        console.log(err)
        res.status(404).send({err: 'An error happened'})
    })
}

function newUser (req, res) {
    var fields          = ["username", "passphrase", "email", "firstname", "lastname"]
    var courseid        = parseInt(req.body.courseid)
    var valuesNotEmpty  = shared.checkEmptyValues(req.body, fields)

    if (!valuesNotEmpty) {
        res.json({err: 'Not all parameters specified.'})
        return
    }
    console.log(req.body)

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
                    firstname: req.body.firstname.trim(),
                    lastname: req.body.lastname.trim(),
                    courseid: parseInt(req.body.courseid),
                    universityid: 1,
                }).then(function (user) {
                    res.json(user)
                }).catch(function (err) {
                    console.log(err)
                    res.json({err: 'An error happened while creating the user.'})
                })
            })
        } else {
            res.json({err: "User already exists."})
        }

    }).catch(function (err) {
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
