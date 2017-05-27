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

console.log("Velg campus")
for (var i = 0; i < config.campuses.length; i++) {
    console.log(i+1 + ". " + config.campuses[i])
}
console.log("Skriv 'alle' for å laste ned data for alle i listen")
console.log("Skriv 'se [nummer i listen]' for å se nedlastet data")

rl1.question('', (answer) => {
    if (answer) {

        if (typeof answer === 'string' && answer === 'alle') {
            var uris = [],
                filenames = []
            for (var i = 0; i < config.campuses.length; i++) {
                var campus = config.campuses[i]

                uris.push(config.uri.replace('Vestfold', campus))
                filenames.push(config.prefix + '-' + campus.toLowerCase())
            }
            bulkSaveData(uris, filenames)
        } else if (typeof answer === 'string' && answer.substr(0, 2) === 'se') {
            var params      = answer.split(' '),
                idx         = parseInt(params[1]),
                filename    = config.prefix + '-' + config.campuses[idx - 1].toLowerCase()

            readData(filename)
        } else {
            var answer  = parseInt(answer) - 1

            if (isNaN(answer)) {
                console.log("Vennligst angi et tall mellom 1 og " + config.campuses.length)
                process.exit()
                return
            }

            var uri     = config.uri.replace('Vestfold', config.campuses[answer])

            saveData(uri, config.prefix + '-' + config.campuses[answer].toLowerCase())
        }

    }

    rl1.close()
})

function readData (filename) {
    fs.readFile(config.path + filename + '.json', (err, data) => {
        if (err)
            console.log(err)

        console.log(JSON.parse(data))
    })
}

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

                console.log('Skrev ' + filename + '.json til ' + config.path)
            })
        }
    })
}
