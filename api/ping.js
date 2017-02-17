exports.get = function (req, res) {
    res.set('Content-Type', 'application/json')
    if (process.env.DEBUG) {
        res.status(200).send({payload: 'Pong'})
    } else {
        res.status(404).send()
    }
}
