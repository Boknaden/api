var shared = require('./_shared.js')

function getAds (req, res) {
    var q           = req.query,
        course      = parseInt(q.course) || undefined,
        university  = parseInt(q.university) || undefined,
        limit       = parseInt(q.limit) || 10,
        page        = parseInt(q.page) || 1,
        sort        = q.sort || 'DESC',
        offset      = (page - 1) * limit,
        vals  = [],
        query = "SELECT AdID, UserID, UniversityID, AdName, CreatedDate, UpdatedDate FROM ads "
    query    += ((typeof course !== 'undefined') ? "WHERE CourseID = ? " : "")
    query    += ((typeof university !== 'undefined') ?
                    ((typeof course !== 'undefined') ?
                        "AND UniversityID = ? "
                        : "WHERE UniversityID = ? ")
                : "")
    query    += "ORDER BY CreatedDate " + sort + " "
    query    += "LIMIT " + offset + "," + limit + " "

    if (course !== 'undefined') {
        vals.push(course)
    }

    if (university !== 'undefined') {
        vals.push(university)
    }

    req.service.mysql.query({
        sql: query,
        values: vals,
    }, (err, results, fields) => {
        if (err) {
            console.log(err)
            res.send({err: err})
        }
        if (results.length === 0) {
            res.send({err: 'No results.'})
        } else {
            res.send({payload: results})
        }

    })
}

function newAd (req, res) {
    var q               = req.body,
        fields          = ["userid", "universityid", "adname"],
        user            = parseInt(q.userid),
        university      = parseInt(q.universityid),
        valuesNotEmpty  = shared.checkEmptyValues(q, fields),
        query           = "INSERT INTO ads ("+ fields.join(',') +") VALUES ("+ shared.genQuestionMarks(fields) +")"

    console.log(query)
    if (!valuesNotEmpty) {
        res.send({err: 'Not all parameters specified.'})
        return
    }

    req.service.mysql.query({
        sql: query,
        timeout: 10000,
        values: [user, university, q.adname.trim()],
    }, function (err, results, fields) {
        if (err) {
            res.send({err: err, results: results, fields: fields})
            return
        }
        res.send({payload: results})
    })
}

module.exports = {
    get: getAds,
    post: newAd,
}
