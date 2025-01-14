# Her kan du se hvordan du sætter din database op

## kør denne docker commando:

### DOCKER COMMAND & FORKLARING

Denne kommando bruges til at sætte en MySQL-database op i en Docker-container med specifikke indstillinger og initialiseringsscripts.
Den sætter alt op for dig.
Hvis du vil køre den helt fra ny, så husk at slette `sql/volume`-mappen, da den indeholder databasen.

### For Windows

```bash
docker run --name mysql-instax-container `
 -e MYSQL_ROOT_PASSWORD=password123 `
 -p 3307:3306 `
 -v "${PWD}/sql/scripts:/docker-entrypoint-initdb.d" `
 -v "${PWD}/sql/volume:/var/lib/mysql" `
 -d mysql:latest
```

### For Mac

```bash
docker run --name mysql-instax-container \
 -e MYSQL_ROOT_PASSWORD=password123 \
 -p 3307:3306 \
 -v "$(pwd)/sql/scripts:/docker-entrypoint-initdb.d" \
 -v "$(pwd)/sql/volume:/var/lib/mysql" \
 -d mysql:latest

```

#### Forklaring af Docker-kommandoen

Denne kommando opsætter en MySQL-container med specifikke indstillinger for kodeord, port-mapping, volume-mounting og initialiseringsscripts:

- `--name mysql-container`: Sætter containerens navn til `mysql-instax-container`. Dette gør det nemmere at administrere containeren med Docker-kommandoer.

- `-e MYSQL_ROOT_PASSWORD=password123`: Sætter root-kodeordet for MySQL-databasen til `password123`. Dette kodeord er påkrævet for at få adgang til databasen som root-bruger.

- `-p 3307:3306`: Mapper port `3306` i containeren (standardporten for MySQL) til port `3307` på værtsmaskinen. Dette gør, at du kan tilgå MySQL-serveren på `localhost:3307` fra dit udviklingsmiljø eller MySQL Workbench.

- `-v $(pwd)/sql/scripts:/docker-entrypoint-initdb.d`: Monterer `sql/scripts`-mappen på værtsmaskinen til `/docker-entrypoint-initdb.d` i containeren.

  - Formål: Alle `.sql`-scripts placeret i `sql/scripts` vil automatisk blive eksekveret, når containeren startes første gang. Dette er stedet, hvor du placerer dine initiale SQL-skema- og datainitialiseringsscripts (som `init.sql` og `populate_data.sql`).

  - Fordel: Dette setup initialiserer databasestrukturen og udfylder den med data ved første kørsel, hvilket skaber en gentagelig og konsistent databaseopsætning.

- `-v $(pwd)/sql/volume:/var/lib/mysql:` Monterer sql/volume-mappen på værtsmaskinen til /var/lib/mysql i containeren.

  - Formål: `sql/volume` bruges til at gemme databasefilerne på værtsmaskinen, så dataen er vedvarende. Det betyder, at selv hvis containeren slettes eller genstartes, vil databasen og dens indhold forblive intakte.

### Backend Struktur

Projektet struktur er organiseret som følgende:

```bash
PROJECT-NAME
│
├── sql/
│   ├── scripts/              # Indeholder SQL-scripts til initialisering af database og data.
│   └── volume/               # Brugt til vedvarende lagring af MySQL-data.
│
└── src/
    ├── routes/               # Indeholder alle API-routes for applikationen.
    ├── index.ts              # Applikationens hovedfil, der opsætter serveren og routes.
    └── db.ts                 # Databasekonfigurationen, der forbinder Node.js til MySQL.
```

#### Forklaring af mappestruktur

- `sql/scripts/`: Denne mappe indeholder `.sql`-filer, som bruges til at initialisere databasen. Disse scripts køres automatisk første gang containeren startes, og de kan inkludere oprettelse af tabeller og initial data.
- `sql/volume/`: Denne mappe bruges til at gemme MySQL-data. Da mappen er vedvarende, vil data ikke gå tabt, selvom containeren stopper eller slettes.
- `src/routes/`: Indeholder alle API-routes, der definerer, hvordan applikationen håndterer anmodninger og interagerer med databasen.
- `src/index.ts`: Applikationens hovedindgangspunkt. Denne fil opsætter Express-serveren og tilføjer de forskellige API-routes.
- `src/db.ts`: Indeholder databasekonfigurationen, der opretter forbindelsen mellem Node.js og MySQL-databasen.
