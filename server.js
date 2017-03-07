let express     = require('express'),
    port        = 1337,
    path        = require('path'),
    fs          = require('fs'),
    app         = express(),
    dotenv      = require('dotenv').config(),
    helmet      = require('helmet'),
    bodyParser  = require('body-parser'),
    log         = require('./ConsoleManager.js').create(),
    config      = require('./config.js'),
    mysql       = require('mysql'),
    bcrypt      = require('bcrypt'),
    connection  = mysql.createConnection(config.mysql)

app.disable('x-powered-by')

function registerEndpoint(app, routePath, filePath) {
    const methods = ['get', 'post', 'put', 'delete']
    const router = new express.Router()
    const el = require(filePath)
    if (typeof el.register === 'function') {
        el.register(router)
    }
    methods.filter(method=>el[method]).forEach(method=> {
        router[method]('/', el[method])
    });
    app.use(routePath, router)
}

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(registerDependencies)

function registerDependencies (req, res, next) {
    req.service = {
        mysql: connection,
        bcrypt: bcrypt,
    }
    next()
}

app.use(function (req, res, next) {
    res.set('Content-Type', 'application/json')
    next()
})

fs.readdirSync('./api').filter(f=>f.endsWith('.js') && !f.startsWith('_')).sort().forEach(file => {
    const route = file.slice(0, -3)
    registerEndpoint(app, `/${route}/`, path.join(__dirname, './api', file))
})

var server = app.listen(process.env.PORT, function (){
    log.printLn('Boknaden API v' + process.env.VERSION + ' Port: ' + process.env.PORT)
    let environment = (parseInt(process.env.DEBUG)===1) ? "Development" : "Production"
    log.printObj({
        0: "Environment: ",
        1: environment,
        2: '-'
    })
})
