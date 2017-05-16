var shared      = require('./_shared'),
    Course      = shared.models.course,
    University  = shared.models.university,
    Campus      = shared.models.campus

function getCampuses (req, res) {
    var query,
        universityid = parseInt(req.query.universityid) || false,
        findOpts = {
            include: [
                {
                    model: University,
                }
            ],
        }

    if (universityid) {
        findOpts.where = {
            'universityid': universityid
        }
    }

    Campus.findAll(findOpts)
    .then(function (campuses) {
        return res.json(campuses)
    }).catch(function (err) {
        shared.logger.log('getCampuses', 'From: ' + req.ip + '. ' + err, 'error')
        return res.status(500).json({
            success: false,
            message: 'An error happened while getting campuses.'
        })
    })
}

function newCampus (req, res) {
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
    get: getCampuses,
    post: newCampus,
    requiresAuth: {
        'GET': false,
        'POST': true,
    }
}
