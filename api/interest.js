var shared = require('./_shared.js')

function getInterests (req, res) {

}

module.exports = {
    get: getInterests,
    requiresAuth: {
        'GET': true,
    }
}
