var shared      = require('./_shared'),
    User        = shared.models.user,
    Chat        = shared.models.chat

function getChats (req, res) {
    var userid = req.user_token.userid,
        page = req.query.page || 1,
        limit = 20,
        offset = limit * (page - 1)

    Chat.findAndCountAll({
        limit: limit,
        offset: offset,
        order: 'createddate DESC',
        where: {
            $or: {
                initiatorid: req.user_token.userid,
                recipientid: req.user_token.userid,
            }
        },
        include: [
            {
                model: User,
                as: 'Initiator',
                attributes: ['userid', 'username', 'firstname', 'lastname', 'email'],
            },
            {
                model: User,
                as: 'Recipient',
                attributes: ['userid', 'username', 'firstname', 'lastname', 'email'],
            }
        ]
    }).then(function (chats) {
        return res.json({
            success: true,
            count: chats.count,
            chats: chats.rows,
            limit: limit,
            page: page,
        })
    }).catch(function (err) {
        shared.logger.log('getChats', 'Couldn\'t get chats for ' + req.user_token.username + ': ' + err, 'error')
        return res.status(500).json({
            success: false,
            message: 'An error happened'
        })
    })
}


module.exports = {
    get: getChats,
    requiresAuth: {
        'GET': true,
    }
}
