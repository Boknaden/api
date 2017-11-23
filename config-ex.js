module.exports = {
    mysql: {
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306,
        database: '',
    },
    security: {
        saltRounds: 10, // hva det "koster" å utføre hashing (høyere tall er bedre fordi hashingen tar lenger tid, men krever derfor mer datakraft)
                        // jo lenger tid som brukes på hashing og compare av passord, jo lavere er risikoen for vellykkede bruteforce-angrep
        secret: '',
        tokenExpiration: '72h', // token er gyldig i 48 timer
    },
    email: {
        service: '',
        user: '',
        pass: '',
        defaults: {
            from: '',
        }
    },
    imgur: {
        clientId: '',
        clientSecret: '',
        apiUrl: 'https://api.imgur.com/3/'
    }
}
