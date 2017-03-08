var shared = require('./_shared')
function getCourses (req, res) {
    req.service.mysql.query(
        'SELECT courseid, coursename, universityid FROM courses',
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

function newCourse (req, res) {
    // var fields          = ["universityid", "universityname", "longitude", "latitude"]
    // var valuesNotEmpty  = shared.checkEmptyValues(req.body, fields)
    // var query           = "INSERT INTO universities ("+ fields.join(',') +") VALUES ("+ shared.genQuestionMarks(fields) +")"
    //
    // if (!valuesNotEmpty) {
    //     res.send({err: 'Not all parameters specified.'})
    //     return
    // }
    //
    // req.service.mysql.query({
    //     sql: query,
    //     timeout: 10000,
    //     values: [parseInt(req.body.universityid),req.body.universityname.trim(),req.body.longitude,req.body.latitude],
    // }, function (err, results, fields) {
    //     if (err) {
    //         res.send({err: err, results: results, fields: fields, data: req.body})
    //         return
    //     }
    //     res.send({payload: results})
    // })

    res.send({payload: 'Not implemented'})

}

module.exports = {
    get: getCourses,
    post: newCourse,
}
