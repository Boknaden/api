var shared      = require('./_shared'),
    Course      = shared.models.course,
    University  = shared.models.university,
    Campus      = shared.models.campus

function getCourses (req, res) {
    var query,
        campusid = parseInt(req.query.campusid) || null,
        courseid = parseInt(req.query.courseid) || null,
        findOpts = {
            include: [
                {
                    model: Campus,
                    include: [
                        {
                            model: University
                        }
                    ]
                }
            ],
            where: {},
        }

    if (courseid) {
        findOpts.where['courseid'] = courseid
    }

    if (campusid) { // campusid har presedens
        findOpts.where = {campusid: campusid}
    }

    Course.findAll(findOpts)
    .then(function (courses) {
        return res.json(courses)
    }).catch(function (err) {
        shared.logger.log('getCourses', 'From: ' + req.ip + '. ' + err, 'error')
        return res.status(500).json({
            success: false,
            message: 'An error happened while getting courses.'
        })
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
