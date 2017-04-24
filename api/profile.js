var shared  = require('./_shared.js'),
    bcrypt  = shared.bcrypt,
    User    = shared.models.user,
    Course  = shared.models.course,
    Campus  = shared.models.campus,
    University = shared.models.university

function getProfileData (req, res) {
    shared.logger.log('getProfileData', "From: " + req.user_token.username)

    User.findOne({
        attributes: ['email', 'username', 'courseid', 'phone', 'firstname', 'lastname'],
        where: {
            userid: req.user_token.userid
        },
        include: [
            {
                model: Course,
                include: [{
                    model: Campus,
                    include: [{
                        model: University
                    }]
                }]
            }
        ]
    }).then(function (user) {
        res.json(user)
    }).catch(function (err) {
        shared.logger.log('getProfileData', 'From: ' + req.user_token.username + ". " + err, 'error')
        console.log(err)
        res.status(404).send({err: 'An error happened'})
    })

}

function updateProfileData (req, res) {
    // 'email', 'passphrase', 'phone', 'firstname', 'lastname', 'courseid'
    var email = req.body.email,
        phone = req.body.phone,
        firstname = req.body.firstname,
        lastname = req.body.lastname,
        courseid = req.body.courseid

    shared.logger.log('updateProfileData', "From: " + req.user_token.username)

    User.update({
        email: email,
        phone: phone,
        firstname: firstname,
        lastname: lastname,
        courseid: courseid
    }, {
        where: {
            userid: req.user_token.userid
        },
    }).then(function (updated) {
        res.json({
            success: true,
            message: 'Updated user'
        })
    }).catch(function (err) {
        shared.logger.log('updateProfileData', "From: " + req.user_token.username, 'error')
        res.status(500).json({
            success: false,
            message: 'An error happened'
        })
    })
}

module.exports = {
    get: getProfileData,
    put: updateProfileData,
    requiresAuth: {
        'GET': true,
        'PUT': true,
    }
}
