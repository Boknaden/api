var shared      = require('./_shared'),
    Course      = shared.models.course,
    University  = shared.models.university

function getCourses (req, res) {
    var query,
        universityid = parseInt(req.query.universityid) || false,
        findOpts = {
            include: [
                {
                    model: University,
                }
            ],
        }

    shared.logger.log('getCourses', 'From: ' + req.ip)

    if (universityid) {
        findOpts.where = {
            'universityid': universityid
        }
    }

    Course.findAll(findOpts)
    .then(function (courses) {
        res.json(courses)
    }).catch(function (err) {
        shared.logger.log('getCourses', 'From: ' + ip + '. ' + err, 'error')
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

    shared.logger.log('newCourse', 'From: ' + req.ip + ". Not implemented.")

    res.status(404).send({success: false, message: 'Not implemented'})

}

module.exports = {
    get: getCourses,
    post: newCourse,
    requiresAuth: {
        'GET': false,
        'POST': true,
    }
}
