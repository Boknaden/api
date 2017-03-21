var request = require('request'),
    fs      = require('fs'),
    config  = require('./config.js')

request({
    method: 'GET',
    uri: config.courses,
}, function (err, res, body) {
    if (err) {
        console.log(err)
        return
    }

    var body = JSON.parse(body) || null

    if (body) {
        fs.writeFile(config.data.path + 'courses.json', JSON.stringify(body.articles), (err) => {
            if (err) {
                console.log(err)
            }

            console.log('added courses.json to ' + config.data.path)
        })
    }
})
