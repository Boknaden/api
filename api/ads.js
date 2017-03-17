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

function getAdItemsForAds (ads, cb) {
    var adIds = []

    for (var i = 0; i < ads.length; i++) {
        adIds.push(ads[i].adid)
    }

    AdItem.findAll({
        where: {
            adid: {
                $in: adIds
            }
        }
    }).then(function (aditems) {
        cb(aditems)
    }).catch(function (err) {
        console.log(err)
        res.json({err: 'An error happened'})
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
        fields          = ["userid", "adid", "text", "price"],
        user            = parseInt(q.userid),
        adid            = parseInt(q.adid),
        price           = parseInt(q.price),
        valuesNotEmpty  = shared.checkEmptyValues(q, fields)

    if (!valuesNotEmpty) {
        res.status(404).send({err: 'Not all parameters specified.'})
        return
    }

    AdItem.create({
        user: user,
        description: description,
        adid: adid,
        price: price,
        text: q.text.trim(),
        description: description,
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
