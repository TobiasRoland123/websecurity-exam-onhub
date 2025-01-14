# websecurity-exam-2024

## Google docs:

### Websecurity:

- https://docs.google.com/document/d/1WEOytn-KFBqbhAqr9Ye-oK9j9dVOzEPHDSYuR5CA360/edit?usp=sharing

### Development Environments:

- https://docs.google.com/document/d/1VEegMh7A7YcM1sw9PG0S1MUNlBlK-EapnYe9ZqCUi0M/edit?usp=sharing

Meningen med eksamen er ikke at bygge den mest sikre app, men handler om at bygge en app hvor vi er beviste om hvilke security issues vi tager hånd om og hvordan vi har gjort det i koden.

## Backstory

- Mini Instagram - brugere & upload af billeder.

# Techstack

## Frontend:

- plain vanilla html, css, js and tailwind css

## Backend:

- node.js & express.js

## Database:

- MySql

## Reverse Proxy

- Nginx

# Projekt krav:

- Your project source code should be documented.(Commets in your code.)
- Multilevel (privileges) login with backend authentication.
- New user registration.
- Data stored in cookie or other form (localStorage etc.)
- A list of items created by users, with option for setting visible private/public. Admin can see everything.
- Some items have a function for adding data, like adding a comment to an item or similar.
- File upload (images), a kind of profile picture might be an idea.

## Vores applikation som minimum være sikret mod:

- SQLinjection,and command injection.
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- XML External Entity (XXE) and serialization/injection.(See slideshow 9.)
- Client side manipulation.(So not trusting the client side, you must haveserver side validation.)You are not expected to produce a mature and production quality implementation that can compete with existing frameworks.
  You areexpected to be able to insert session ID, and CSRF Tokensin the right places. If you know of limitations in your product, discuss thisin your report.

## Recommendations

You should consider the following:

- Firewall –enable and configure the firewall on the server.
- Use of Transport Layer Security (TLS)
- Use of encryption and hashing.(Hashing passwords in the user DB table.)-
- Configuration settings for your project, if using PHP php.ini, if using Nginx nginx.conf etc.

## Deployment

Feel free to deploy on a virtual server somewhere, and configure the server as you like:•Users, Apache, PHP,...

- Have a development environment.
- Maybeuse a repository.(For source control.)
- Make sure you have a running copy on your machine, so you can demoit at theexam.
  Deploy the application to a server of your choice.Example: Amazon, digitalocean, ...Hint: Using a real name and deployingon a server will allow you to use tools like Mozilla Observatory for checking settings

# Git strategy

## Branch strategy

Vi arbejder med main, som vores production branch.

### Branch naming

Det er også vigtigt når vi opretter branches at vi starter dem med `issueNumber-dit-branch-navn` . Ved at gøre det på denne måde kan GitLab automatisk koble dine branches op på issues.

### Example

for issue #19:
`19-adding-git-strategy-to-readme`

## Commit messages

Når vi skriver commit messages benytter kategoriserer vi dem i `feat:` , `fix:` , `refactor:` og `chore:`Det vil sige hvis jeg arbejder på en branch hvor jeg har fixet en bug, og skal til at committe min ændring, så ser min commit message således ud: `fix: did some thing to fix some other thing` . Ved at gøre det på denne måde er det klart hvilken type ændring der er foregået i et givent commit.

- for feature changes `feat: din besked...` eller `feature: din besked...`

- for fix changes `fix: din besked...`

- for refactor changes `refactor: din besked...`

- for chore changes `chore: din besked...`

## Merging strategy

For at integrere nye ændringer i main-branchen skal der oprettes en merge request. Denne skal godkendes af mindst ét andet teammedlem.

Når du opretter en merge request, vælg `main` som target-branch. Bed dine teammedlemmer om at gennemgå koden og komme med eventuelle kommentarer eller ændringsforslag.

Vigtigt: Før du merger din branch ind i main, skal du altid hente den nyeste version af main og integrere den i din branch. Dette hjælper med at undgå merge conflicts.

Efter godkendelse er det dit ansvar at gennemføre mergen til main. Dette skyldes, at hvis der opstår problemer efter code review, er du som kodeansvarlig bedst rustet til at løse eventuelle fejl hurtigt og effektivt.

## Issue Tracking and Linking

Vi arbejder med GitLab, hvor vi har oprettet milestones og issues. Hver gang vi tildeler os selv et issue og opretter en branch, går vi ind på det pågældende issue og linker til den nye branch. Dette gøres ved at navngive branchen med formatet `issueNumber-dit-branch-navn`. Denne navngivningskonvention er beskrevet med eksempel i afsnittet om branch naming.

## Automated Testing and CI/CD Integration

Dette afsnit vil blive skrevet når vi har opsat det, efter vi har haft lecutre 9 i DevEnv

# Git strategy

## **Branch strategy**

Vi arbejder med main, som vores production branch.

### Branch naming

Det er også vigtigt når vi opretter branches at vi starter dem med `issueNumber-dit-branch-navn` . Ved at gøre det på denne måde kan GitLab automatisk koble dine branches op på issues.

### Example

for issue #19:
`19-adding-git-strategy-to-readme`

## Commit messages

Når vi skriver commit messages benytter kategoriserer vi dem i `feat:` , `fix:` , `refactor:` og `chore:`Det vil sige hvis jeg arbejder på en branch hvor jeg har fixet en bug, og skal til at committe min ændring, så ser min commit message således ud: `fix: did some thing to fix some other thing` . Ved at gøre det på denne måde er det klart hvilken type ændring der er foregået i et givent commit.

- for feature changes `feat: din besked...` eller `feature: din besked...`

- for fix changes `fix: din besked...`

- for refactor changes `refactor: din besked...`

- for chore changes `chore: din besked...`

## Merging strategy

For at integrere nye ændringer i main-branchen skal der oprettes en merge request. Denne skal godkendes af mindst ét andet teammedlem.

Når du opretter en merge request, vælg `main` som target-branch. Bed dine teammedlemmer om at gennemgå koden og komme med eventuelle kommentarer eller ændringsforslag.

Vigtigt: Før du merger din branch ind i main, skal du altid hente den nyeste version af main og integrere den i din branch. Dette hjælper med at undgå merge conflicts.

Efter godkendelse er det dit ansvar at gennemføre mergen til main. Dette skyldes, at hvis der opstår problemer efter code review, er du som kodeansvarlig bedst rustet til at løse eventuelle fejl hurtigt og effektivt.

## Issue Tracking and Linking

Vi arbejder med GitLab, hvor vi har oprettet milestones og issues. Hver gang vi tildeler os selv et issue og opretter en branch, går vi ind på det pågældende issue og linker til den nye branch. Dette gøres ved at navngive branchen med formatet `issueNumber-dit-branch-navn`. Denne navngivningskonvention er beskrevet med eksempel i afsnittet om branch naming.

## Automated Testing and CI/CD Integration

Dette afsnit vil blive skrevet når vi har opsat det, efter vi har haft lecutre 9 i DevEnv

# How to run the project with docker

Ved at køre projektet med docler kan du køre hele projektet med en enkelt kommando.

## .env

For at køre projektet er det vigtigt at have en .env fil i roden af projektet, med de følgende variabler:

```
SERVER_PORT=din_server_port
DB_HOST=din_db_host
DB_USER=din_db_user
DB_PASSWORD=dit_db_password
DB_NAME=dit_db_navn
DB_PORT=din_db_port
NGINX_PORT=din_nginx_port
```

.env filen er særligt vigtig, da det er den der styrer alle disse variabler gennem hele projektet.

## Kør projektet

Når .env filen er sat op, kan du køre projektet med følgende kommando:

```
docker-compose up
```

Dette skulle gerne starte alle 3 services, som er:

- database
- backend
- nginx

## Troubleshooting

Hvis du oplever problemer med at køre projektet, kan du prøve at køre følgende:

1. Tjek om du har en `volumes` mappe liggende `sql` mappen. Hvis du her dette skal du slette den.
2. Slet alle images og containers med følgende kommandoer:

```
# Stop og slet alle containers
docker compose down

# slet images
docker rmi websecurity-exam-2024-backend:latest
docker rmi nginx
docker rmi mysql

# Hvis du vil slette alle images på èn gang kan du køre følgende kommando:
docker rmi websecurity-exam-2024-backend:latest && docker rmi nginx && docker rmi mysql
```

3. Prøv herefter at køre `docker-compose up` igen.
