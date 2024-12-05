FROM node:22
RUN mkdir STIG/
WORKDIR /STIG
COPY app app
COPY public public
COPY src src
COPY *.html ./
COPY *.json ./
COPY *.cjs ./
COPY *.ts ./
RUN npm install --quiet
CMD ["npm", "run", "dev", "--", "--host"]
