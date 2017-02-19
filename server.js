let express = require('express'),
    port    = 1337,
    path    = require('path'),
    fs      = require('fs'),
    app     = express(),
    dotenv  = require('dotenv').config()

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

app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json')
    next()
})

fs.readdirSync('./api').filter(f=>f.endsWith('.js') && !f.startsWith('_')).sort().forEach(file => {
    const route = file.slice(0, -3)
    registerEndpoint(app, `/${route}/`, path.join(__dirname, './api', file))
})

var server = app.listen(process.env.PORT, function (){
    console.log('Boknaden API v' + process.env.VERSION + ' Port: ' + process.env.PORT)
    console.log((process.env.DEBUG) ? "Environment: Development" : "Environment: Production")
})
