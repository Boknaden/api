var models  = require('../models.js'),
    Log     = models.log

function log (loggedfrom, message, state) {
    var loggedfrom  = loggedfrom || 'app',
        state       = state || 'info'

    Log.create({
        loggedfrom: loggedfrom,
        message: message,
        state: state,
    })

    if (process.env.VERBOSE === 0) {
        return
    }

    console.log(message)
}

function logSequelize(message) {
    console.log(message)
    log('Sequelize', message)
}

module.exports = {
    log: log,
    logSequelize: logSequelize
}
