#!/bin/bash

set -e

# init setup
SETUP_DEPS=(
    "openssl"
    "wget"
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

# install OWASP ModSecurity Core Rule Set

wget https://github.com/coreruleset/coreruleset/archive/refs/tags/v4.6.0.tar.gz
tar -xvf v4.6.0.tar.gz
mkdir -p /etc/nginx/modsec/owasp-crs
mv coreruleset-4.6.0/crs-setup.conf.example /etc/nginx/modsec/owasp-crs/crs-setup.conf
mv coreruleset-4.6.0/rules /etc/nginx/modsec/owasp-crs/rules
rm -rf coreruleset-4.6.0 v4.6.0.tar.gz

# include OWASP ModSecurity Core Rule Set
echo "Include /etc/nginx/modsec/owasp-crs/crs-setup.conf" >> /etc/nginx/modsec/modsecurity.conf
echo "Include /etc/nginx/modsec/owasp-crs/rules/*.conf" >> /etc/nginx/modsec/modsecurity.conf

# clean up
apt-get purge -y \
    ${SETUP_DEPS[@]} \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/*

# rm -f $0 # bey bey