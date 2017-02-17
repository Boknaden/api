exports.get = function (req, res) {
    if (process.env.DEBUG) {
        res.status(200).send({payload: 'Pong'})
    } else {
        res.status(404).send()
    }
}
