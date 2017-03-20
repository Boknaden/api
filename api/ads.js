var shared      = require('./_shared.js'),
    Ad          = shared.models.ad,
    AdItem      = shared.models.aditem,
    User        = shared.models.user,
    Course      = shared.models.course,
    University  = shared.models.university,
    Image       = shared.models.image

function getAds (req, res) {
    var q           = req.query,
        course      = parseInt(q.course) || undefined,
        university  = parseInt(q.university) || undefined,
        limit       = parseInt(q.limit) || 20,
        page        = parseInt(q.page) || 1,
        offset      = (page - 1) * limit

    shared.logger.log('getAds', 'From: ' + req.ip)

    Ad.findAndCountAll({
        limit: limit,
        offset: offset,
        order: 'createddate DESC',
        include: [
            {
                model: User,
                attributes: ['username', 'firstname', 'lastname'],
            }, {
                model: AdItem,
                include: [
                    {
                        model: Image
                    }
                ]
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
        shared.logger.log('getAds', 'From: ' + req.ip + '. ' + err, 'error')
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

    shared.logger.log('newAd', 'From: ' + req.ip)

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
        shared.logger.log('newAd', 'From: ' + req.ip + '. ' + err, 'error')
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

    shared.logger.log('newAdItem', 'From: ' + req.ip)

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
        shared.logger.log('newAdItem', 'From: ' + req.ip + '. ' + err, 'error')
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
