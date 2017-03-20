var shared      = require('./_shared'),
    Log      = shared.models.log

function getLogs (req, res) {
    if (req.user_token.isadmin) {
        Log.findAll({
            order: 'createddate DESC'
        })
        .then(function (logs) {
            res.json(logs)
        }).catch(function (err) {
            shared.logger.log('getLogs', 'From: ' + req.ip + '. ' + err, 'error')
        })
    }
}

module.exports = {
    get: getLogs,
    requiresAuth: {
        'GET': true,
    }
}
