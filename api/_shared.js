/* DRY (IGD: ikke gjenta deg) */

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

module.exports = {
    genQuestionMarks: genQuestionMarks,
    checkEmptyValues: checkEmptyValues
}
