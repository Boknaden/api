var request = require('request'),
    fs      = require('fs'),
    models  = require('../../models.js'),
    Image   = models.image,
    config  = require('../../config.js')

function Imgur () {

    return {
        postImage: postImage,
        deleteImage: deleteImage,
    }

    function postImage (filePath, cb) {
        fs.readFile(filePath, (err, data) => {
            var options = {
                url: config.imgur.apiUrl + 'image',
                method: 'POST',
                headers: {
                    'Authorization': 'Client-ID ' + config.imgur.clientId,
                },
                body: {
                    image: new Buffer(data, 'binary').toString('base64'),
                    type: 'base64',
                },
                json: true,
            }

            request(options, (err, incomingmessage, response) => {
                if (err) {
                    console.log('Error: ' + err)
                }

                fs.unlink(filePath, (err) => {
					console.log(err)
				})
				cb(err, response)
            })
        })
    }

    function deleteImage (imageDeleteHash, cb) {
        var options = {
            url: config.imgur.apiUrl + 'image/' + imageDeleteHash,
            method: 'DELETE',
            headers: {
                'Authorization': 'Client-ID' + config.imgur.clientId,
            }
        }

        request(options, (err, incomingmessage, response) => {
            if (err) {
                console.log('Error: ' + err)
                return
            }

            cb(err, response)
        })
    }

}

module.exports = {
    imgur: Imgur
}
