# API for Boknaden

For å kjøre APIet kreves [`NodeJS runtime versjon 6.10.0`](https://nodejs.org) og lokal MySQL database (Apache/Wamp på Windows funker).

**Windows PowerShell/Terminal må benyttes etter steg 4**

1. (Anbefaler å benytte terminal/command-line, **hvis ikke hopp til steg 5**) Åpne Terminal (mac/linux) eller Windows PowerShell (win).
2. Endre aktiv mappe `cd /mappe/til/github` ^^(mac/linux) eller `cd \mappe\til\github` ^^(win).
3. `git clone https://github.com/Boknaden/api.git`
4. Installer [nodejs](https://nodejs.org). [Alternativ installasjonsinformasjon for linux/mac](https://github.com/nodejs/node).
5. Sjekk at installasjonen var vellykket ved kommandoen `node -v` (Output: `v6.10.0`).
6. Opprett config.js i rotmappen av prosjektet (samme mappe som server.js), og fyll ut på følgende måte

```javascript
module.exports = {
    mysql: {
        host: 'localhost', // anbefaler localhost 1000% av gangene
        user: 'BRUKERNAVN',
        password: 'PASSORD',
        port: 3306,
        database: 'NAVN_PÅ_DATABASE',
    },
    security: {
        secret: 'boknadensigneringsnokkel'
    }
}
```

7.
