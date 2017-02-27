var ConsoleManager = function () {
    return {
        print: print,
        printObj: printObj,
        printLn: printLn
    }

    function printLn (str) {
        if (parseInt(process.env.VERBOSE) === 1)
            console.log(str)
    }

    function print (str) {
        if (parseInt(process.env.VERBOSE) === 1)
            process.stdout.write(str)
    }

    function printObj (obj) {
        for (let key in obj) {
            if (obj[key] === "-") {
                process.stdout.write('\n')
                continue
            }
            print(obj[key])
        }
    }
}

exports.create = () => { return ConsoleManager() }
