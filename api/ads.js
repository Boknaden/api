var shared      = require('./_shared.js'),
    Ad          = shared.models.ad,
    AdItem      = shared.models.aditem,
    User        = shared.models.user,
    Course      = shared.models.course,
    University  = shared.models.university,
    Campus      = shared.models.campus,
    Image       = shared.models.image

/*
    Henter Ads basert på filter:
        - linje
        - campus
        - universitet
        - side (paginering)

    Dersom en adid er supplert henter vi
    alle aditems for en ad
*/
function getAds (req, res) {
    var q           = req.query,
        course      = parseInt(q.courseid) || null,
        campus      = parseInt(q.campusid) || null,
        university  = parseInt(q.universityid) || null,
        limit       = parseInt(q.limit) || 20,
        page        = parseInt(q.page) || 1,
        offset      = (page - 1) * limit,
        type        = q.type || 'list', // 'list' henter alle aditems hvor buyerid er `null`
                                        // 'seller' henter alle aditems uansett

        suppliedWhere  = {deleted: 0},
        extraWhere     = {},
        aditemWhere    = {},
        userAttributes = ['username', 'firstname', 'lastname']

    if (q.userid && !isNaN(parseInt(q.userid))) {
        suppliedWhere.userid = q.userid
    }

    // dersom brukeren som henter ad er autentisert
    // får han e-post og telefonnummer til selgeren
    if (req.user_token) {
        userAttributes.push('email')
        userAttributes.push('phone')
    }

    if (course) {
        suppliedWhere['courseid'] = course
    }

    if (type === 'list') {
        aditemWhere['buyerid'] = null
    }

    // TODO: fix this shit
    // if (campus) {
    //     extraWhere['campusid'] = campus
    // }
    //
    // if (university) {
    //     extraWhere['universityid'] = university
    // }

    if (q.adid && typeof parseInt(q.adid) === 'number') {
        Ad.findOne({
            where: {
                adid: parseInt(q.adid),
                deleted: 0,
            },
            include: [{
                model: User,
                attributes: userAttributes,
            }, {
                model: AdItem,
                where: aditemWhere,
                include: [
                    {
                        model: Image,
                        attributes: ['imageurl', 'title']
                    }
                ]
            }, {
                model: Course,
                include: [
                    {
                        model: Campus,
                        include: [
                            {
                                model: University,
                            }
                        ]
                    }
                ]
            }],
        }).then(function (ad) {
            if (!ad) {
                res.status(404).json({success: false, message: 'Not found.'})
                return
            }

            if (req.user_token) {
                if (parseInt(ad.get('userid')) === parseInt(req.user_token.userid)) {
                    ad.dataValues['isowner'] = true
                }
            } else {
                ad.dataValues['isowner'] = false
            }



            res.json(ad)
        }).catch(function (err) {
            shared.logger.log('getAds', 'From: ' + req.ip + '. ' + err, 'error')
            console.log(err)
            res.status(500).send({err: 'An error happened'})
        })
        return
    }



    Ad.findAndCountAll({
        limit: limit,
        offset: offset,
        order: 'createddate DESC',
        where: suppliedWhere,
        include: [
            {
                model: User,
                attributes: userAttributes,
            }, {
                model: AdItem,
                where: aditemWhere,
                include: [
                    {
                        model: Image,
                        attributes: ['imageurl', 'title']
                    }
                ]
            }, {
                model: Course,
                required: true,
                include: [
                    {
                        model: Campus,
                        required: true,
                        where: (campus) ? { campusid: campus } : {},
                        include: [
                            {
                                model: University,
                                required: true,
                                where: (university) ? { universityid: university } : {},
                            }
                        ]
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
        res.status(500).send({err: 'An error happened'})
    })
}

function newAd (req, res) {
    var q               = req.body,
        fields          = ["courseid", "adname"],
        course          = parseInt(q.courseid),
        valuesNotEmpty  = shared.checkEmptyValues(q, fields),
        aditems         = q.aditems

    if (q.hasOwnProperty('adid')) {
        newAdItem(req, res)
        return
    }

    if (!valuesNotEmpty) {
        res.status(404).send({err: 'Not all parameters specified.'})
        return
    }

    User.find({
        attributes: ['verified'],
        where: {
            userid: req.user_token.userid
        }
    }).then(function (user) {
        if (!user) {
            shared.logger.log('newAd', 'User is spoofing ID?')

            return res.status(404).json({
                success: false,
                message: 'You\'re not even a user.'
            })
        }
        if (user.get('verified') === 1) {
            Ad.create({
                userid: req.user_token.userid,
                courseid: course,
                adname: q.adname.trim(),
                text: q.text || null
            }).then(function (ad) {
                shared.logger.log('newAd', 'Created ad for ' + req.user_token.username)

                newAdItem(req, res, ad.adid, q.aditems).then(function (aditem) {
                    shared.logger.log('newAdItem', 'Created aditems for ' + req.user_token.username)
                    res.json({message: 'Added aditem with aditems', ad: ad})
                }).catch(function (err) {
                    shared.logger.log('newAdItem', 'From: ' + req.user_token.username + '. ' + err, 'error')
                    res.status(404).send({err: 'An error happened'})
                })

            }).catch(function (err) {
                shared.logger.log('newAd', 'From: ' + req.ip + '. ' + err, 'error')
                res.status(404).send({err: 'An error happened'})
            })
        } else {
            shared.logger.log('newAd', 'From ' + req.user_token.username + ', tried to create ad but is not verified.')
            res.status(404).json({
                message: 'User is not verified.',
                success: false,
            })
        }

    }).catch(function (err) {
        shared.logger.log('newAd', 'From: ' + req.user_token.username + '. ' + err, 'error')
        res.status(404).send({err: 'An error happened'})
    })
}

function newAdItem (req, res, adid, newAdItems) {
    var q               = req.body,
        description     = q.description || null,
        fields          = ["text", "price"],
        valuesNotEmpty  = false,
        itemsToInsert   = []

    for (var i = 0; i < newAdItems.length; i++) {
        var aditem = newAdItems[i]
        valuesNotEmpty = shared.checkEmptyValues(aditem, fields)

        for (k in aditem) {
            if (aditem.hasOwnProperty(k)) {
                var value = aditem[k]

                if (k === 'image') {
                    if (value.imageid !== 0) {
                        aditem['imageid'] = value.imageid
                    }
                } else if (typeof value === 'string') {
                    aditem[k] = value.trim()
                } else if (!isNaN(parseInt(value))) {
                    aditem[k] = parseInt(value)
                }

            }
        }

        if (!valuesNotEmpty) {
            res.status(404).send({err: 'Not all parameters for aditem ' + aditem.text + ' specified.'})
            return
        }

        aditem.userid = req.user_token.userid
        aditem.adid = adid
    }

    itemsToInsert = newAdItems

    // {
    //     userid: req.user_token.userid,
    //     description: description,
    //     adid: adid,
    //     price: price,
    //     text: q.text.trim(),
    //     description: description,
    //     isbn: isbn,
    //     imageid: imageid
    // }

    return AdItem.bulkCreate(itemsToInsert)

}

function updateAd (req, res) {

}

function deleteAd (req, res) {
    var adid = parseInt(req.query.adid) || null

    if ( !isNaN(adid) ) {
        Ad.findOne({
            where: {
                adid: adid,
                userid: req.user_token.userid
            }
        }).then(function (ad) {
            if (ad) {
                ad.set('deleted', 1)
                return ad.save()
            } else {
                res.status(404).json({success: false, message: 'Did not delete.'})
            }
        }).then(function (update) {
            shared.logger.log('deleteAd', 'Deleted ad "' + update.get('adname') + '" from user ' + req.user_token.username)
            return res.json(update)
        }).catch(function (err) {
            shared.logger.log('deleteAd', 'Error happened for ' + req.user_token.username + '. ' + err, 'error')
            return res.status(500).json({success: false, message: 'An error happened while updating.'})
        })

    } else {
        return res.status(404).json({
            success: false,
            message: 'Did not delete.'
        })
    }
}

module.exports = {
    get: getAds,
    post: newAd,
    put: updateAd,
    delete: deleteAd,
    requiresAuth: {
        'GET': false,
        'POST': true,
        'PUT': true,
        'DELETE': true,
    }
}
