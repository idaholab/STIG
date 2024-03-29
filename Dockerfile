FROM node:lts-alpine3.13
RUN mkdir /stig
# This is likely excessive, we may wish to slim down the needed files at some point
WORKDIR /stig
COPY assets assets
COPY db_setup db_setup
COPY images images
COPY src src
COPY *.ts ./
COPY *.json ./
COPY *.js ./
COPY *.lock ./
RUN npm install --quiet
CMD ["npm", "start"]
 
