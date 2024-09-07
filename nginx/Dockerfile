#syntax=docker/dockerfile:1
FROM debian:oldstable-slim

# Install nginx and modSecurity
RUN apt-get update && apt-get install -y \
    nginx \
    libnginx-mod-http-modsecurity \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY tools/nginx.conf .
COPY tools/setup.sh .

# init setup of nginx and modSecurity and ssl
RUN bash setup.sh

CMD ["nginx"]
