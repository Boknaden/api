var shared      = require('./_shared.js'),
    models      = require('../models.js'),
    Ad          = models.ad,
    AdItem      = models.aditem,
    User        = models.user,
    Course      = models.course,
    University  = models.university

function getAds (req, res) {
    var q           = req.query,
        course      = parseInt(q.course) || undefined,
        university  = parseInt(q.university) || undefined,
        limit       = parseInt(q.limit) || 20,
        page        = parseInt(q.page) || 1,
        offset      = (page - 1) * limit

    Ad.findAndCountAll({
        limit: limit,
        offset: offset,
        order: 'createddate DESC',
        include: [
            {
                model: User,
                attributes: ['username', 'firstname', 'lastname'],
            }, {
                model: AdItem
            }, {
                model: Course,
                attributes: ['courseid', 'coursename'],
                include: [
                    {
                        model: University
                    }
                ]
            }
        ],
    }).then(function (ads) {
        var payload = {
            limit: limit,
            offset: offset,
            count: ads.count,
            ads: ads.rows,
        }
        res.json(payload)
    }).catch(function (err) {
        console.log(err)
        res.status(404).send({err: 'An error happened'})
    })
}

function newAd (req, res) {
    var q               = req.body,
        fields          = ["courseid", "adname"],
        user            = parseInt(q.userid),
        course          = parseInt(q.courseid),
        valuesNotEmpty  = shared.checkEmptyValues(q, fields)

    if (q.hasOwnProperty('adid')) {
        newAdItem(req, res)
        return
    }

    if (!valuesNotEmpty) {
        res.status(404).send({err: 'Not all parameters specified.'})
        return
    }

    Ad.create({
        userid: req.user_token.userid,
        courseid: course,
        adname: q.adname.trim(),
    }).then(function (ad) {
        res.json({data: q, ad: ad})
    }).catch(function (err) {
        console.log(err)
        res.status(404).send({err: 'An error happened'})
    })
}

function newAdItem (req, res) {
    var q               = req.body,
        description     = q.description || null
        fields          = ["adid", "text", "price", "isbn"],
        adid            = parseInt(q.adid),
        price           = parseInt(q.price),
        isbn            = parseInt(q.isbn)
        valuesNotEmpty  = shared.checkEmptyValues(q, fields)

    if (!valuesNotEmpty) {
        res.status(404).send({err: 'Not all parameters specified.'})
        return
    }

    AdItem.create({
        userid: req.user_token.userid,
        description: description,
        adid: adid,
        price: price,
        text: q.text.trim(),
        description: description,
        isbn: isbn,
    }).then(function (aditem) {
        res.json(aditem)
    }).catch(function (err) {
        console.log(err)
        res.status(404).send({err: 'An error happened'})
    })

}

module.exports = {
    get: getAds,
    post: newAd,
    requiresAuth: {
        'GET': false,
        'POST': true,
    }
}
