API for Boknaden
==============
For å kjøre APIet kreves [`NodeJS runtime versjon 6.10.0`](https://nodejs.org) og lokal MySQL database (Apache/Wamp på Windows funker), andre typer databaser støttes gjennom [Sequelize](http://docs.sequelizejs.com/en/v3/).

*Anbefaler å benytte terminal/command-line for å laste ned github-prosjektet, hvis du benytter GitHub for Windows (GUI) hopp til steg 5.*
*Windows PowerShell/Terminal må benyttes etter steg 4.*

- Åpne Terminal (mac/linux) eller Windows PowerShell (win).
- *(Valgfritt)* Endre aktiv mappe `cd /mappe/til/github` (mac/linux) eller `cd \mappe\til\github` (win).
- *(Valgfritt)* `git clone https://github.com/Boknaden/api.git`.
-  Installer [nodejs](https://nodejs.org). [Alternativ installasjonsinformasjon for linux/mac](https://github.com/nodejs/node).
- Sjekk at installasjonen var vellykket ved kommandoen `node -v` (Output: `v6.10.0`).
- `cd` til rotmappen hvor APIet befinner seg (samme mappe som server.js) og kjør `npm install` for å installere bibliotek.
- Opprett `config.js` i rotmappen av prosjektet, og fyll ut på følgende måte (endre der det er blokkbokstaver):

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
        secret: 'SIGNERINGSNØKKEL_FOR_JWT'
    }
}
```

- `cd tools` for å få tilgang til boknadens verktøy.
- `node sync.js` for å laste inn tabellene til databasen.
- *(Valgfritt)* Installer `nodemon` - `npm install -g nodemon`.
- *(Valgfritt)* Hvis du installerte `nodemon` - `nodemon server.js`.
- Hvis du ikke installerte nodemon, kjør `node server.js` fra rotmappen.
