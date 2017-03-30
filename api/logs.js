var shared      = require('./_shared'),
    Log      = shared.models.log

function getLogs (req, res) {
    let isadmin,
        limit = req.query.limit || 20,
        offset = req.query.offset || 0

    if (req.hasOwnProperty('user_token')) {
        isadmin = req.user_token.isadmin
    }

    if (isadmin || parseInt(process.env.DEBUG) === 1) {
        Log.findAndCountAll({
            limit: 20,
            offset: 0,
            order: 'createddate DESC'
        })
        .then(function (logs) {
            var payload = {
                limit: limit,
                offset: offset,
                count: logs.rows.length,
                logs: logs.rows,
            }
            res.json(payload)
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
