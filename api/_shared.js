var logger          = require('../tools/logger.js'),
    config          = require('../config.js'),
    jwt             = require('jsonwebtoken'),
    models          = require('../models.js'),
    bcrypt          = require('bcrypt'),
    randomstring    = require('randomstring'),
    nodemailer      = require('nodemailer'),
    uuid            = require('uuid/v4')

function sendMail (subject, email, body) {
    // send epost med en passordlenke
    let transport = mailTransporter(),
        opts      = {
            from: config.email.defaults.from,
            to: email,
            subject: subject,
            html: body
        }

    transport.sendMail(opts, function (err, info) {
        if (err) {
            logger.log('sendMail', 'Unable to send email to ' + email + ': ' + err, 'error')
            console.log(err)
        }
        logger.log('sendMail', 'Successfully sent email to ' + email + '. ' + info)
    })
}

function verifyToken (token, cb, err) {
    if (token) {
        jwt.verify(token, config.security.secret, function (err, verified_token) {
            if (err) {
                err(err)
                return
            }
            cb(verified_token)
            return
        })
    } else {
        cb(false)
    }
}

function genQuestionMarks (fields) {
    var qmarks = ""

    for (var i = 0; i < fields.length; i++) {
        if (i === fields.length - 1) {
            qmarks += "?"
        } else {
            qmarks += "?,"
        }
    }

    return qmarks
}

function checkEmptyValues (values, fields) {
    if (Object.keys(values).length === 0) {
        return false
    }

    for (var i = 0; i < fields.length; i++) {
        var val = values[fields[i]]
        if (typeof(val) === 'undefined') {
            return false
        }

        if (val.length < 1) {
            return false
        }
    }
    return true
}

function arrObjPropToList (values, needle) {
    var arr = [],
        values = values || undefined

    if (values && typeof(values) === 'array') {
        for (var i = 0; i < values.length; i++) {
            if (values[i].hasOwnProperty(needle)) {
                arr.push(values[i][needle])
            }
        }
    }

    return arr

}

function mailTransporter () {
    return nodemailer.createTransport({
        service: config.email.service,
        auth: {
            user: config.email.user,
            pass: config.email.pass,
        },
    })
}

module.exports = {
    genQuestionMarks: genQuestionMarks,
    checkEmptyValues: checkEmptyValues,
    logger: logger,
    models: models,
    verifyToken: verifyToken,
    jwt: jwt,
    config: config,
    bcrypt: bcrypt,
    randomstring: randomstring,
    sendMail: sendMail,
    uuid: uuid,
}
