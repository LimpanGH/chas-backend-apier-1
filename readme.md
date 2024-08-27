# Dagens workshop - repetition

## Idag

- Närvaro
- Vem är jag?
- Kursmål
- Repetition
- Svårare uppgifter finns längst ned

## Vem är jag?

- Fredrik Lindroth
- Jobbat som utvecklare i 7 år
- Tidigare även utbildat
- 3d-printing som hobby senaste året

## Kursmål

- Detta har ni gått igenom hittills
  - Skapat ett JavaScript-API med Express och nodeJS
  - SQL-databas med MySQL (och PostgreSQL?)
  - Prisma
  - Middleware, validering och felhantering
- Vad är kvar
  - Typescript
  - NoSQL-databas (MongoDB) och GraphQL
  - AI-verktyg
    - Jag använder Github Copilot, men andra går också bra

## Del 1 - ExpressJS och NodeJS

### Skapa ett API med nodeJS (server) och ExpressJS (REST-API)

- Skapa ``package.json`` med
  - ``npm init -y``
- Installera npm-paketen ``expressJS`` och ``nodemon``
  - ``npm install express``
  - ``npm install --save-dev nodemon``
- Skapa filen ``index.js`` i roten
- Lägg till följande i ``package.json`` under scripts
  - ``"dev": "nodemon index.js"``
- Skapa endpoints för GET, POST, PUT och DELETE
- För att parsa JSON i body behövs
  - ``app.use(express.json());``
- Testa anropa varje endpoint, använd t.ex. ``Thunder Client`` (VSCode extension) eller ``Postman``

## Del 2 - PostgreSQL och Prisma

### Skapa en SQL-databas av typen PostgreSQL

- Installera senaste versionen ``PostgreSQL`` (om du inte redan gjort det)
  - <https://www.enterprisedb.com/downloads/postgres-postgresql-downloads>
  - Starta ``pgAdmin 4``
    - **username: postgres, password: postgres** om inget annat angetts
  - Installera och initialisera ``Prisma``
    - ``npm install prisma --save-dev``
    - ``npx prisma init``
  - Uppdatera kopplingssträngen ``DATABASE_URL`` i ``.env-filen`` som skapades
    - T.ex. ``DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myappdb?schema=public"``
  - Lägg till följande model-objekt i den nyskapade filen ``prisma/schema.prisma``

```
model User {
  id       Int    @id @default(autoincrement())
  username String @unique
  email    String @unique
  password String
} 
```

- Skapa en databasmigrering genom att köra följande i konsolen
  - ``npx prisma migrate dev --name init``
- Koppla upp dig mot databasen i ``index.js`` med hjälp av ``PrismaClient``
  - Uppdatera POST-metoden så det går att skapa på en ``User``
  - Uppdatera PUT-metoden så det går att ändra lösenord på en ``User``
  - Uppdatera GET-metoden så det går att hämta alla ``Users``
  - Lägg till en GET-metod så det går att hämta en specifik ``User``
  - Uppdatera DELETE-metoden så det går att ta bort en ``User``
  - Tänk på att varje metod nu måste använda ``.then`` eller ``async/await``.

## Del 3 - Validering

### Validering med middleware och felhantering

- Validera ``User``-datan  för POST och PUT-anropet
  - Installera npm-paketet ``express-validator``
    - ``npm install express-validator``
  - Validera att ``username`` är en sträng och har minst tre tecken
  - Validera att ``email`` är en email.
  - Validera att ``password`` en sträng och har minst 6 tecken
- Validera GET-anropet för en specifik ``User``
  - Id måste vara ett nummer och får inte vara en sträng. Är id en sträng ska inte en sökning i databas utföras.
- Lägg ett try-catch-block runt GET-anropet för en specifik ``User``.

## Svårare uppgifter

- Returnera korrekta HTTP-statuskoder
  - Ex. 200, 400, 404, 500
- Lägg till ett nytt model-objekt av typen ``Post`` som har en ``foreign key`` av ``User.id`` med relationen ``zero-to-many``. Dvs. en ``User`` kan ha 0 till flera ``Posts``
- JWT
  - Lägg till auth-middleware med metoden ``login`` som returnerar en JWT för en specifik användare.
  - Lägg till metoden ``auth`` som middleware på valfri endpoint som verifierar ovan JWT och bara returnerar resultatet ifall den är giltig
- Lägg till TypeScript och använd typning i hela applikatonen
- Byt ut databasen till ``MongoDB`` istället för ``PostgreSQL``


# Run
- cd Del1-3-Linus: ```npm run dev```
- Öppna pgAdmin4 (program på datorn)
- Klicka på databasen -> Schemas -> Tables -> User.
- Högerklicka på user och välj View/Edit Data, klicka på View All![alt text](<Del1-3-Linus/Screenshot 2024-08-27 at 12.00.14.png>)