var shared  = require('./_shared'),
    User    = require('../models.js').user

function getUsers (req, res) {
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

    User.find({
        where: {
            $or: [
                {username: req.body.username.trim()},
                {email: req.body.email.trim()}
            ]
        }
    }).then(function (user) {

        if (!user) {
            var passHash = req.service.bcrypt.hash(req.body.passphrase, 10, function (err, hash) {

                if (err) {
                    console.log(err)
                    res.json({err: 'An error happened while hashing.'})
                    return
                }

                User.create({
                    username: req.body.username.trim(),
                    passphrase: hash,
                    email: req.body.email.trim(),
                    firstname: req.body.firstname.trim(),
                    lastname: req.body.lastname.trim(),
                    courseid: parseInt(req.body.courseid)
                }).then(function (user) {
                    res.json(user)
                })
            })
        } else {
            res.json({err: "Username or email already taken."})
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
