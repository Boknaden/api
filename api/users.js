var shared = require('./_shared')
function getUsers (req, res) {
    req.service.mysql.query(
        'SELECT username, email, firstname, lastname, lastlogin, createddate FROM users',
        function (err, result, fields) {
        if (err) {
            res.send({err: err})
            return
        }
        if (result.length === 0) {
            res.send({err: 'No results.'})
        } else {
            res.send({payload: result})
        }
    })
}

function newUser (req, res) {
    var fields          = ["username", "passphrase", "email", "firstname", "lastname"]
    var courseid        = parseInt(req.body.courseid)
    var valuesNotEmpty  = shared.checkEmptyValues(req.body, fields)
    var query           = "INSERT INTO users ("+ fields.join(',') +") VALUES ("+ shared.genQuestionMarks(fields) +")"

    if (!valuesNotEmpty) {
        res.send({err: 'Not all parameters specified.'})
        return
    }

    var passHash = req.service.bcrypt.hashSync(req.body.passphrase, 10)

    req.service.mysql.query({
        sql: query,
        timeout: 10000,
        values: [req.body.username.trim().toLowerCase(),passHash,req.body.email.trim().toLowerCase(),req.body.firstname.trim(),req.body.lastname.trim()],
    }, function (uErr, uResults, uFields) {
        if (uErr) {
            res.send({
                err: uErr,
                userResults: uResults,
                userFields: uFields,
                userData: req.body
            })
            return
        }

        registerUserCourse(req, res, courseid, uResults.insertId)

    })

}

function registerUserCourse (req, res, courseid, userid) {
    if (!courseid) {
        res.send({err: 'Not all parameters specified.'})
    }
    req.service.mysql.query({
        sql: "INSERT INTO usercourses (userid, courseid) VALUES (?, ?)",
        timeout: 10000,
        values: [userid, courseid],
    }, function (cErr, cResults, cFields) {
        if (cErr) {
            res.send({
                err: cErr,
                courseResults: cResults,
                courseFields: cFields,
                userData: req.body
            })
            return
        }
        res.send({
            payload: {
                user: uResults,
                course: cResults
            }
        })

    })
}

module.exports = {
    get: getUsers,
    post: newUser,
}
