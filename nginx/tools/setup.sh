#!/bin/bash

set -e

# init setup
SETUP_DEPS=(
    "openssl"
    "git"
)

apt-get update && apt-get install -y \
    ${SETUP_DEPS[@]} \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


# ssl setup
mkdir -p /etc/nginx/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/self.key \
    -out /etc/nginx/certs/self.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# override default nginx config
rm -f /etc/nginx/conf.d/default.conf
mv nginx.conf /etc/nginx/nginx.conf

# integrate modSecurity config
mkdir -p /etc/nginx/modsec
wget https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/modsecurity.conf-recommended -O /etc/nginx/modsec/modsecurity.conf
wget https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/unicode.mapping -O /etc/nginx/modsec/unicode.mapping

# install modSecurity
git clone --depth 1 --recursive -b v3/master https://github.com/owasp-modsecurity/ModSecurity ModSecurity
./ModSecurity/build.sh
./ModSecurity/configure
make -C ModSecurity
make install -C ModSecurity
rm -rf ModSecurity

# install nginx connector
git clone --depth 1 https://github.com/owasp-modsecurity/ModSecurity-nginx.git ModSecurity-nginx
./ModSecurity/configure --add-module=MosSecurity-nginx --with-compat

# clean up
apt-get purge -y \
    ${SETUP_DEPS[@]} \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/*

# rm -f $0 # bey bey
