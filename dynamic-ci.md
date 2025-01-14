# Sådan kører vi Docker

For at køre projektet med docker skal man bruge følgende kommando:

* `RTE=dev docker compose --env-file .env-dev up` 
* `RTE=test docker compose --env-file .env-test up` 
* `RTE=prod docker compose --env-file .env-prod up` 

Ved at bruge disse 3 kommandoer kan man endten starte projektet i dev, test eller prod mode.

Hvis man vil have projektet til at køre på vores remote machine med et domæne og TLS certifikat, 
men ikke vil have at det "stopper" når man forlader remote maskinen skal man tilføje et -d flag, det sørger for at docker kører i baggrunden.