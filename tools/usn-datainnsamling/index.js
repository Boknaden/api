/*

    Scriptet henter lister over linjer på alle campus ved USN og lagrer disse i en valgt mappe (config.js)

*/

var request     = require('request'),
    fs          = require('fs'),
    config      = require('./config.js'),
    readline    = require('readline')

var rl1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log("Choose campus")
for (var i = 0; i < config.campuses.length; i++) {
    console.log(i+1 + ". " + config.campuses[i])
}
console.log("Type 'all' to download data for all of 'em")

rl1.question('', (answer) => {
    if (answer) {

        if (typeof answer === 'string' && answer === 'all') {
            var uris = [],
                filenames = []
            for (var i = 0; i < config.campuses.length; i++) {
                var campus = config.campuses[i]

                uris.push(config.uri.replace('Vestfold', campus))
                filenames.push(config.prefix + '-' + campus.toLowerCase())
            }
            bulkSaveData(uris, filenames)
        } else {
            var answer  = parseInt(answer) - 1,
                uri     = config.uri.replace('Vestfold', config.campuses[answer])

            saveData(uri, config.prefix + '-' + config.campuses[answer].toLowerCase())
        }

    }

    rl1.close()
})

function bulkSaveData (uris, filenames) {

    for (var i = 0; i < uris.length; i++) {
        saveData(uris[i], filenames[i])
    }

}

function saveData (uri, filename) {
    request({
        method: 'GET',
        uri: uri,
    }, function (err, res, body) {
        if (err) {
            console.log(err)
            return
        }

        var body = JSON.parse(body) || null

        if (body) {
            fs.writeFile(config.path + filename + '.json', JSON.stringify(body.articles), (err) => {
                if (err) {
                    console.log(err)
                }

                console.log('Wrote ' + filename + '.json to ' + config.path)
            })
        }
    })
}
