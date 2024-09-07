#syntax=docker/dockerfile:1
FROM debian:stable-slim

# Install nginx and modSecurity
RUN apt-get update && apt-get install -y \
    nginx \
    libnginx-mod-http-modsecurity \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY conf/nginx.conf .
COPY tools/setup.sh .

# init setup of nginx and modSecurity and ssl
RUN bash setup.sh

CMD ["nginx"]
