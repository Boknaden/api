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

module.exports = {
    genQuestionMarks: genQuestionMarks,
    checkEmptyValues: checkEmptyValues
}
