let express     = require('express'), // vi benytter express som rammeverk for å sende og motta HTTP requests
    path        = require('path'), // for å håndtere filer behøver vi path
    fs          = require('fs'), // for å håndtere filer behøver vi fs
    app         = express(),
    dotenv      = require('dotenv').config(), // brukes for å håndtere dotfiles (f.eks. .env for konfigurasjon av APIet i forhold til miljøet)
    helmet      = require('helmet'),
    bodyParser  = require('body-parser'),
    config      = require('./config.js'), // brukes for å håndtere mysql-tilgang
    jwt         = require('jsonwebtoken'), // benyttes for å verifisere at et api-kall er autentisert
    logger      = require('./tools/logger.js') // benyttes for å lagre meldinger generert av appen i database


/* Registrerer filer i 'filepath' slik at de kan benyttes som endepunkter av APIet */
function registerEndpoint(app, routePath, filePath) {
    const methods = ['get', 'post', 'put', 'delete'] // alle http metoder som støttes
    const router = new express.Router() // express router for å rute forespørsler basert på URI
    const el = require(filePath) // laster inn filen som skal registreres som endepunkt

    if (el.hasOwnProperty('requiresAuth') && (parseInt(process.env.DEBUG) === 0)) { // middleware for å sjekke jwts
        router.use(function (req, res, next) {
            var token = req.body.token || req.headers['boknaden-verify'] || false // token kan sendes til alle routes

            if (!el.requiresAuth[req.method]) { // dersom endepunktet brukeren forsøker å nå ikke krever autentisering
                next() // kjører endepunktet
                return
            }

            if (token) {
                jwt.verify(token, config.security.secret, function (err, verified_token) {
                    if (err) {
                        return res.json({success: false, message: 'Couldn\'t verify token.'}) // token har blitt harselert med
                    }
                    req.user_token = verified_token
                    next()
                })
            } else { // dersom token ikke er supplert og endepunktet krever det
                return res.status(403).send({
                    success: false,
                    message: 'This endpoint to Boknaden requires authentication.'
                });
            }
        })
    }

    // går igjennom alle http metodene som finnes i filen som registreres som endepunkt
    // og kobler sammen
    methods.filter(method=>el[method]).forEach(method=> {
        router[method]('/', el[method])
    });
    app.use(routePath, router) // registrer endepunkt
}

app.use(helmet()) // av sikkerhetsmessige grunner inkluderer vi helmet for å sette HTTP headere som kan motvirke "hackerangrep"
app.use(bodyParser.json()) // body-parser gir oss mulighet til å "parse" post/get/put/delete data (query/body) slik at de kan benyttes i APIet
app.use(bodyParser.urlencoded({ extended: true }))
app.use(registerDependencies)

/* DRY metode for å gi oss tredjepartstjenester som mysql-tilgang og passordhashing */
function registerDependencies (req, res, next) {
    req.service = {
        jwt: jwt,
    }
    req.boknaden = {config: config}
    next()
}

/* APIet svarer alltid med JSON, dette gjør så klienten vet at den mottar JSON */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.set('Content-Type', 'application/json')
    next();
});

/* Går igjennom alle filene under mappen "api" og registrerer disse som et endepunkt i APIet */
fs.readdirSync('./api').filter(f=>f.endsWith('.js') && !f.startsWith('_')).sort().forEach(file => {
    const route = file.slice(0, -3)
    registerEndpoint(app, `/${route}/`, path.join(__dirname, './api', file))
})

/* Initialiserer og starter APIet */
var server = app.listen(process.env.PORT, function (){
    console.log('Boknaden API v' + process.env.VERSION + ' Port: ' + process.env.PORT)
    let environment = (parseInt(process.env.DEBUG)===1) ? "Development" : "Production"
    console.log("Environment: " + environment)
})
