var shared = require('./_shared.js'),
    Image  = shared.models.image,
    Imgur  = shared.imgur()

function newImage (req, res) {
    if (req.files) {
        var filePath = req.files.file.file
        Imgur.postImage(filePath, (err, imgurResponse) => {

            if (err) {
                shared.logger.log('newImage', 'Failed to upload image ' + err, 'error')
                return res.send({
                    message: 'An error happened.',
                    success: false
                })
            }

            Image.create({
                userid: req.user_token.userid,
                imageurl: imgurResponse.data.link,
                deletehash: imgurResponse.data.deletehash,
                title: 'An image'
            }).then(function (imgObj) {
                shared.logger.log('newImage', 'Uploaded new image from ' + req.user_token.username + '. Deletehash: ' + imgurResponse.data.deletehash)
                return res.send({
                    imageid: imgObj.get('imageid'),
                    imageurl: imgObj.get('imageurl'),
                    message: 'Un filét?',
                    success: true
                })
            })

        })
    } else {
        return res.send({
            message: 'File not uploaded. Maybe unsupported file type.',
            success: false
        })
    }
}

function deleteImage (req, res) {
    var imageid = parseInt(req.query.imageid)

    if (!imageid || isNaN(imageid)) {
        return res.status(404).json({
            success: false,
            message: 'Requires id.'
        })
    }

    Image.findOne({
        where: {
            imageid: imageid,
            userid: req.user_token.userid,
        }
    }).then(function (img) {
        if (!img) {
            return res.json({
                success: false,
                message: 'The image doesn\'t exist.'
            })
        } else {
            var deletehash = img.get('deletehash')
            Imgur.deleteImage(deletehash, (err, imgurResponse) => {
                img.destroy()
                return res.json({
                    success: true,
                    message: 'Deleted the image.'
                })
            })
        }
    })
}

module.exports = {
    post: newImage,
    delete: deleteImage,
    requiresAuth: {
        'POST': true,
        'DELETE': true,
    }
}
