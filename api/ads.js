var shared = require('./_shared.js')

function getAds (req, res) {
    var q           = req.query,
        course      = parseInt(q.course) || undefined,
        university  = parseInt(q.university) || undefined,
        limit       = parseInt(q.limit) || 10,
        page        = parseInt(q.page) || 1,
        sort        = q.sort || 'DESC',
        offset      = (page - 1) * limit,
        vals        = [],
        query       = "SELECT adid, userid, universityid, adname, createddate, updateddate FROM ads "
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

        getAdItemsForAds(req, res, results, (err2, results2, fields2) => {
            res.send(addAdItemsToAd(results2, results))
        })

    })
}

function getAdItemsForAds (req, res, ads, cb) {
    var adIds = []

    for (var i = 0; i < ads.length; i++) {
        adIds.push(ads[i].adid)
    }

    var query = "SELECT aditems.aditemid, aditems.userid, aditems.adid, aditems.price FROM aditems WHERE adid IN (" + adIds.join(',') + ")"

    req.service.mysql.query({
        sql: query,
    }, (err, results, fields) => {
        if (err) {
            cb(err, results, fields)
            return
        }

        cb(null, results, fields)

    })
}

function addAdItemsToAd (aditems, ads) {
    var p = []

    for (var i = 0; i < ads.length; i++) {
        var ad = ads[i]

        ad.aditems = []

        for (var j = 0; j < aditems.length; j++) {
            if (aditems[j].adid === ad.adid)
                ad.aditems.push(aditems[j])
        }

        p.push(ad)
    }
    return p
}

function newAd (req, res) {
    var q               = req.body,
        fields          = ["userid", "courseid", "adname"],
        user            = parseInt(q.userid),
        course          = parseInt(q.courseid),
        valuesNotEmpty  = shared.checkEmptyValues(q, fields),
        query           = "INSERT INTO ads ("+ fields.join(',') +") VALUES ("+ shared.genQuestionMarks(fields) +")"

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
            res.send({err: err, results: results, fields: fields, data: req.body})
            return
        }
        res.send({payload: results})
    })
}

module.exports = {
    get: getAds,
    post: newAd,
}
