exports.get = function (req, res) {
    if (parseInt(process.env.DEBUG) === 1) {
        res.status(200).send({payload: 'Pong'})
    } else {
        res.status(404).send()
    }
}
