var shared      = require('./_shared'),
    User        = shared.models.user,
    Chat        = shared.models.chat,
    ChatMessage = shared.models.chatmessage,
    Sequelize   = shared.models.sequelize

function getMessages (req, res) {
    let isadmin,
        page = req.query.page || 1,
        limit = 20,
        offset = limit * (page - 1),
        type = req.query.type || 'chats', // chats or messages
                                          // messages requires chat id to get messages
        where = {}


    switch (type) {
        case 'chats':
            getChats(req, res)
            break;
        case 'messages':
            if (!req.query.chatid) {
                res.status(404).json({
                    success: false,
                    message: 'Needs valid chat ID'
                })
            }

            getChatMessages(req, res)
            break;
    }
}

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
        res.json({
            success: true,
            chats: chats,
            limit: limit,
            page: page,
        })
    }).catch(function (err) {
        shared.logger.log('getChats', 'Couldn\'t get chats for ' + req.user_token.username + ': ' + err, 'error')
        res.status(500).json({
            success: false,
            message: 'An error happened'
        })
    })
}

function getChatMessages (req, res) {
    var chatid = req.query.chatid,
        page = req.query.page || 1,
        limit = 50,
        offset = limit * (page - 1)

    ChatMessage.findAndCountAll({
        limit: limit,
        offset: offset,
        order: 'createddate DESC',
        where: {
            chatid: chatid
        },
        include: [
            {
                model: User,
                attributes: ['username', 'firstname', 'lastname', 'email']
            }
        ]
    }).then(function (chatMessages) {
        res.json({
            success: true,
            limit: limit,
            page: page,
            chatMessages: chatMessages
        })
    }).catch(function (err) {
        shared.logger.log('getChatMessages', 'Couldn\'t get chat messages for ' + req.user_token.username + ': ' + err, 'error')
        res.status(500).json({
            success: false,
            message: 'An error happened'
        })
    })
}

/*
    Først må vi sjekke om det finnes en chat for brukerid'en som prøver å sende en melding.
    Hvis det finnes en chat, inserter vi bare meldingen i ChatMessage.

    Hvis det ikke finnes en chat, må vi opprette en Chat, og så inserte melding i ChatMessage.
    Deretter returnerer vi chatid og meldingen
*/
function newMessage (req, res) {
    var userid = req.user_token.userid,
        recipientid = req.body.recipientid,
        message = req.body.message || ''

    if (!recipientid) {
        return res.json({
            success: false,
            message: 'Needs a valid chat.'
        })
    }

    if (!message || message.length < 1) {
        return res.json({
            success: false,
            message: 'Needs a message.'
        })
    }

    Chat.findOne({
        where: {
            $or: {
                initiatorid: userid,
                recipientid: userid,
            }, $or: {
                initiatorid: recipientid,
                recipientid: recipientid,
            }
        }
    }).then(function (chat) {
        if (chat) {
            return ChatMessage.create({
                userid: userid,
                message: message,
                chatid: chat.get('chatid')
            })
        } else {
            // TODO: send e-post til mottaker av ny chatmelding.
            return Chat.create({
                initiatorid: userid,
                recipientid: recipientid
            }).then(function (chat) {
                return ChatMessage.create({
                    userid: userid,
                    message: message,
                    chatid: chat.get('chatid')
                })
            })
        }
    }).then(function (message) {
        res.json({
            message: message,
            success: true
        })
    }).catch(function (err) {
        shared.logger.log('newMessage', 'User ' + req.user_token.username + ' tried to send a message, but failed due to ' + err, 'error')
        res.status(500).json({
            success: false,
            message: 'An error happened. Notify an administrator.'
        })
    })
}

module.exports = {
    get: getMessages,
    post: newMessage,
    requiresAuth: {
        'GET': true,
        'POST': true,
    }
}
