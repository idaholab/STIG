FROM node:lts-alpine3.13
RUN mkdir /stig
# This is likely excessive, we may wish to slim down the needed files at some point
WORKDIR /stig
COPY assets assets
COPY images images
COPY src src
COPY *.ts ./
COPY *.json ./
COPY *.js ./
COPY package* ./
RUN npm install --quiet
CMD ["npm", "start"]
 
