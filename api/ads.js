var shared  = require('./_shared.js'),
    Ad      = require('../models.js').ad

function getAds (req, res) {
    var q           = req.query,
        course      = parseInt(q.course) || undefined,
        university  = parseInt(q.university) || undefined,
        limit       = parseInt(q.limit) || 10,
        page        = parseInt(q.page) || 1,
        sort        = q.sort || 'DESC',
        offset      = (page - 1) * limit,
        vals        = [],
    //     query       = "SELECT ads.adid, users.username, ads.userid, ads.universityid, ads.adname, ads.createddate, ads.updateddate FROM ads INNER JOIN users ON (ads.userid = users.userid) "
    // query    += "ORDER BY CreatedDate " + sort + " "
    // query    += "LIMIT " + offset + "," + limit + " "

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
            res.send({data: req.body})
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

    var query = "SELECT aditems.aditemid, aditems.adid, aditems.text, aditems.description, aditems.price FROM aditems WHERE adid IN (" + adIds.join(',') + ")"

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

    if (q.hasOwnProperty('adid')) {
        newAdItem(req, res)
        return
    }

    if (!valuesNotEmpty) {
        res.status(404).send({err: 'Not all parameters specified.'})
        return
    }

    req.service.mysql.query({
        sql: query,
        timeout: 10000,
        values: [user, university, q.adname.trim()],
    }, function (err, results, fields) {
        if (err) {
            console.log(err)
            res.status(404).send({data: req.body})
            return
        }
        res.send({insertid: results.insertId})
    })
}

function newAdItem (req, res) {
    var q               = req.body,
        description     = q.description || null
        fields          = ["userid", "adid", "text", "description", "price"],
        user            = parseInt(q.userid),
        adid            = parseInt(q.adid),
        price           = parseInt(q.price),
        valuesNotEmpty  = shared.checkEmptyValues(q, fields),
        query           = "INSERT INTO aditems ("+ fields.join(',') +") VALUES ("+ shared.genQuestionMarks(fields) +")"

        if (!valuesNotEmpty) {
            res.status(404).send({err: 'Not all parameters specified.'})
            return
        }

        req.service.mysql.query({
            sql: query,
            timeout: 10000,
            values: [user, adid, q.text.trim(), description, price],
        }, function (err, results, fields) {
            if (err) {
                console.log(err)
                res.send({data: req.body})
                return
            }
            res.send({insertid: results.insertId})
        })

}

module.exports = {
    get: getAds,
    post: newAd,
}
