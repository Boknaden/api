function getPing (req, res) {
    res.json({
        success: true,
        message: 'Pong!'
    })
}

module.exports = {
    get: getPing,
    requiresAuth: {
        'GET': false,
    }
}
