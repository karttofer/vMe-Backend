# vMe - Backend Enviroment
Code Review Me" is a website where developers of all seniorities can assist others in enhancing their merge requests and refining their skills through challenges. Our mission is to create a more understanding world where merge request comments are constructive rather than toxic, genuinely contributing to the improvement of code quality.

Our guiding principles:
- Senior signifies mentorship
- Junior signifies potential
- Emphasize repetition
### Enviroment File
This configuration is required to run locally the project, in the future my plan is to make a dockerfile to handle all of this. 

**Future me**: I did it! I implemented a Docker file for this. 😏
```.env
DATABASE_URL=postgresql://<user>:<password>@HOST:<db_post>/<db_name>

#SERVER CONFIG - I recommned 9090 but you literally can put whatever you need in this section
HOST_PORT=<app-port> 

#SECURITY
SALT=<salt-value>

#BREVO
BREVO_KEY=<SMTP_KEY>
BREVO_HOST=<SMTP_SERVER>
BREVO_PORT=<SMTP_PORT>
MAIL_SENDER=<BREVO_ADMIN_ACCOUNT>
```
### Dockerfile
If you prefer, you can opt for Docker instead, as we've implemented a new setup for it. The only requirement is to update the ENV values to match those in your .env file.

```dockerfile
# SET ENV VARIABLES
ENV DATABASE_URL="postgresql://<user>:<password>@HOST:<db_post>/<db_name>"
ENV HOST_PORT=<app-port> 
ENV BREVO_KEY=<SMTP_KEY>
ENV BREVO_HOST=<SMTP_SERVER>
ENV BREVO_PORT=<SMTP_PORT>
ENV SALT=<salt-value>
```
> You can work directly with your credentials if needed, as they are free.
# Dependencies
We are using Yarn to controll all the dependencies, please don't change this and don't create **Pull Request** when you're using **NPM** or it will be rejected.

### In case you don't have Yarn
```node
npm install --global yarn
```

### Finally
```node
yarn install
```
### TypeScript
We're having a very bad way to transform .ts to .js, since I need to make a depth research about running TypeScript in a correct way, right now I created two scripts to handle this process **this will be better in the future believe me**.

```node
cd /server
yarn run ts
```
### Prisma
The only thing you need to keep if you run this commands after configured the .env file, then you will be able to see the database created in your PG-Adming if you're using it
```node
  yarn run prisma:format // Format prisma code
  yarn run prisma:generate // Generate prisma code
  yarn run prisma:migrate:dev // Create databases
```
### Run!
If everything went well, you can run this command to have everything working in **PORT**.
```shell
// In case you're using docker
docker run -p <port>:<port> <docker_img_name/docker_img_id)
```
```node
// In case you're no using docker, remember to run yarn run ts first
cd server
yarn run js
```
### Future Improvements
- Improve the way we run the .ts files
- We need a better systems for the quickJs Env
### FAq
Any information that is related to a bug or something like that can be known by doing an issue, you're free to do it I will check it out.
