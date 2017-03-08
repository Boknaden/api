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
        values: [req.body.username.trim(),passHash,req.body.email.trim(),req.body.firstname.trim(),req.body.lastname.trim()],
    }, function (err, results, fields) {
        if (err) {
            res.send({err: err, results: results, fields: fields, data: req.body})
            return
        }
        res.send({payload: results})
    })

}

module.exports = {
    get: getUsers,
    post: newUser,
}
