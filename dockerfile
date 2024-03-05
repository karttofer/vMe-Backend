FROM alpine:3.18

# Current work dir
WORKDIR /server

# .Lock
COPY package.json ./

# REST APP
COPY . .

# SET ENV VARIABLES
ENV DATABASE_URL="postgresql://<user>:<password>@HOST:<db_post>/<db_name>"
ENV HOST_PORT=<app-port> 
ENV BREVO_KEY=<SMTP_KEY>
ENV BREVO_HOST=<SMTP_SERVER>
ENV BREVO_PORT=<SMTP_PORT>
ENV SALT=<salt-value>

# INSTALL NECESSARY DEPS
RUN apk update && \
    apk add --upgrade yarn && \
    apk add nodejs npm && \
    apk add --update npm && \
    yarn install

# TRANSFORM TS FILES
RUN yarn run ts

# RUN THE APP
CMD ["yarn", "run", "js"]