var shared      = require('./_shared'),
    University  = shared.models.university

function getUniversities (req, res) {
    shared.logger.log('getUniversities', 'From: ' + req.ip)
    University.findAll()
    .then(function (universities) {
        res.json(universities)
    }).catch(function (err) {
        shared.logger.log('getUniversities', 'From: ' + req.ip + ". " + err, 'error')
    })
}

function newUniversity (req, res) {
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
    get: getUniversities,
    post: newUniversity,
    requiresAuth: {
        'GET': false,
        'POST': true,
    }
}
