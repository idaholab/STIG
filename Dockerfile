FROM node:lts-alpine3.13
RUN mkdir /stig
# This is likely excessive, we may wish to slim down the needed files at some point
COPY . /stig/.
WORKDIR "/stig/"
RUN npm install
CMD ["npm", "start"]
 