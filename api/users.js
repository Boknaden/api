var shared  = require('./_shared'),
    User    = require('../models.js').user

function getUsers (req, res) {
    User.findAll({
        attributes: ["userid", "username", "email", "firstname", "lastname"]
    }).then(function (users) {
        res.send({payload: users})
    })
}

function newUser (req, res) {
    var fields          = ["username", "passphrase", "email", "firstname", "lastname"]
    var courseid        = parseInt(req.body.courseid)
    var valuesNotEmpty  = shared.checkEmptyValues(req.body, fields)

    if (!valuesNotEmpty) {
        res.send({err: 'Not all parameters specified.'})
        return
    }

    var passHash = req.service.bcrypt.hashSync(req.body.passphrase, 10)

    User.find({
        where: {
            $or: [
                {username: req.body.username.trim()},
                {email: req.body.email.trim()}
            ]
        }
    }).then(function (user) {

        if (!user) {
            User.create({
                username: req.body.username.trim(),
                passphrase: passHash,
                email: req.body.email.trim(),
                firstname: req.body.firstname.trim(),
                lastname: req.body.lastname.trim(),
                courseid: parseInt(req.body.courseid)
            }).then(function (user) {
                res.send({payload: user})
            })
        } else {
            res.send({err: "Username or email already taken."})
        }

    })

}

module.exports = {
    get: getUsers,
    post: newUser,
}
