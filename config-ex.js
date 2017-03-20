module.exports = {
    mysql: {
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3307,
        database: 'boknaden_test',
    },
    security: {
        saltRounds: 10, // hva det "koster" å utføre hashing (høyere tall er bedre)
        secret: 'boknadensigneringsnokkel',
        tokenExpiration: '48h', // token er gyldig i 48 timer
    }
}
