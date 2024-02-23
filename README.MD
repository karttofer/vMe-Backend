# Run
### Enviroment File
This configuration is required to run locally the project, in the future my plan is to make a dockerfile to handle all of this.
```yml
DATABASE_URL=postgresql://<user>:<password>@HOST:<db_post>/<db_name>

#SERVER CONFIG - I recommned 9090 but you literally can put whatever you need in this section
PORT=9090 

#SECURITY
#SALT min-value: 13
SALT=<salt-value>

#BREVO
BREVO_KEY=<SMTP_KEY>
BREVO_HOST=<SMTP_SERVER>
BREVO_PORT=<SMTP_PORT>
MAIL_SENDER=<BREVO_ADMIN_ACCOUNT>
```
# Dependencies
We are using Yarn to controll all the dependencies, please don't change this and don't create **Pull Request** when you're using **NPM** or it will be rejected.

### In case you don't have Yarn
```
npm install --global yarn
```

### Finally
```
yarn install
```

# TypeScript
We're having a very bad way to transform .ts to .js, since I need to make a depth research about running TypeScript in a correct way, right now I created two scripts to handle this process **this will be better in the future believe me**.

```
cd /server
npm run ts
```
# Prisma
The only thing you need to keep if you run this commands after configured the .env file, then you will be able to see the database created in your PG-Adming if you're using it
```node
npx prisma generate
npx prisma migrate dev
```

# Let's do it!
If everything went well, you can run this command to have everything working in **PORT**.
```
cd server
npm run js
```

# FAq
Any information that you will need to run this with prisma will be in these links below, remember that if you're doing a wrong .env configuration this won't run propertly.

### Prisma
```
Prisma PostgreSQL: https://www.prisma.io/docs/orm/overview/databases/postgresql
```