FROM node:22


RUN apt install -y wget ca-certificates
ARG LOCAL_BUILD
RUN if [ "$LOCAL_BUILD" = "true" ]; then \
        mkdir -p /usr/local/share/ca-certificates && \
        wget -q -P /usr/local/share/ca-certificates/ https://certstore.inl.gov/pki/CAINLROOT_B64.crt && \
        update-ca-certificates; \
    fi

ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
ENV CURL_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_DIR=/etc/ssl/certs/

RUN mkdir STIG/
WORKDIR /STIG
COPY app app
COPY public public
COPY src src
COPY *.html ./
COPY *.json ./
COPY *.cjs ./
COPY *.ts ./
RUN npm install
CMD ["npm", "run", "dev", "--", "--host"]
