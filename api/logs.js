var shared      = require('./_shared'),
    Log      = shared.models.log

function getLogs (req, res) {
    let isadmin,
        page = req.query.page || 1,
        limit = 20,
        offset = limit * (page - 1),
        type = req.query.type || false,
        where = {}

    /*
    offset = limit - (limit * page)
    */

    if (type) {
        where['state'] = type
    }

    if (req.hasOwnProperty('user_token')) {
        isadmin = req.user_token.isadmin
    }

    if (isadmin || parseInt(process.env.DEBUG) === 1) {
        Log.findAndCountAll({
            limit: limit,
            offset: offset,
            order: 'createddate DESC',
            where: where
        })
        .then(function (logs) {
            Log.count({
                where: where
            }).then(function (count) {

                var payload = {
                    limit: limit,
                    offset: offset,
                    logs: logs.rows,
                    total: count,
                }
                res.json(payload)

            }).catch(function (err) {
                shared.logger.log('getLogs', 'From: ' + req.ip + '. ' + err, 'error')
            })

        }).catch(function (err) {
            shared.logger.log('getLogs', 'From: ' + req.ip + '. ' + err, 'error')
        })
    } else {
        shared.logger.log('getLogs', 'Someone is trying to access the logs with their invalid token.')
        res.status(401).json({
            message: 'What are you trying to do? :)',
            success: false,
        })
    }
}

module.exports = {
    get: getLogs,
    requiresAuth: {
        'GET': true,
    }
}
