#!/bin/bash

set -e

append_or_replace() {

    local file=$1
    local key=$2
    local replacement=$3

    if grep -qwG "^$key" "$file"; then
        sed -i "s@^$key.*@$replacement@" "$file"
    else
        echo "$replacement" >> "$file"
    fi
}


# init setupSecAuditLog
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

# set the log directory
mkdir -p /var/log/nginx
chmod 755 /var/log/nginx

# integrate modSecurity config
mkdir -p /etc/nginx/modsec
wget https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/modsecurity.conf-recommended -O /etc/nginx/modsec/modsecurity.conf
# Enable ModSecurity
append_or_replace /etc/nginx/modsec/modsecurity.conf "SecRuleEngine" "SecRuleEngine On"
# Enable logging
# append_or_replace /etc/nginx/modsec/modsecurity.conf "SecAuditEngine" "SecAuditEngine On"
# append_or_replace /etc/nginx/modsec/modsecurity.conf "SecAuditLogRelevantStatus" "SecAuditLogRelevantStatus \"^(?:5|4(?!04))\""
# append_or_replace /etc/nginx/modsec/modsecurity.conf "SecAuditLogParts" "SecAuditLogParts ABIJDEFHZ"
# append_or_replace /etc/nginx/modsec/modsecurity.conf "SecAuditLogType" "SecAuditLogType Serial"
# append_or_replace /etc/nginx/modsec/modsecurity.conf "SecAuditLog" "SecAuditLog /var/log/nginx/modsec_audit.log"
# Set the debug log level (0-9)
# append_or_replace /etc/nginx/modsec/modsecurity.conf "SecDebugLog" "SecDebugLog /var/log/nginx/modsec_debug.log"
append_or_replace /etc/nginx/modsec/modsecurity.conf "SecDebugLogLevel" "SecDebugLogLevel 3"
# Set Strict rules: block SQLi, XSS, etc.
echo "SecRule ARGS \"@rx (select|union|insert|delete|drop|alter)\" \"id:1001,phase:2,deny,status:403,msg:'SQL Injection Detected'\"" >> /etc/nginx/modsec/modsecurity.conf

wget https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/unicode.mapping -O /etc/nginx/modsec/unicode.mapping

# install OWASP ModSecurity Core Rule Set
wget https://github.com/coreruleset/coreruleset/archive/refs/tags/v4.6.0.tar.gz
tar -xvf v4.6.0.tar.gz
mkdir -p /etc/nginx/modsec/owasp-crs
mv coreruleset-4.6.0/crs-setup.conf.example /etc/nginx/modsec/owasp-crs/crs-setup.conf
mv coreruleset-4.6.0/rules /etc/nginx/modsec/owasp-crs/rules
rm -rf coreruleset-4.6.0 v4.6.0.tar.gz

# costumize allowed_methods variable to allow PUT method

echo "SecAction \
   \"id:900200,\
   phase:1,\
   pass,\
   t:none,\
   nolog,\
   tag:'OWASP_CRS',\
   ver:'OWASP_CRS/4.7.0-dev',\
   setvar:'tx.allowed_methods=GET HEAD POST OPTIONS PUT'\"" >> /etc/nginx/modsec/owasp-crs/crs-setup.conf

# include OWASP ModSecurity Core Rule Set
echo "Include /etc/nginx/modsec/owasp-crs/crs-setup.conf" >> /etc/nginx/modsec/modsecurity.conf
echo "Include /etc/nginx/modsec/owasp-crs/rules/*.conf" >> /etc/nginx/modsec/modsecurity.conf

# Harden the security (log rotate, secutiry policy)
echo "/var/log/nginx/audit.log { \
    daily \
    rotate 7 \
    compress \
    delaycompress \
    notifempty \
    create 640 root adm \
    missingok \
}" >> /etc/logrotate.d/nginx


# clean up
apt-get purge -y \
    ${SETUP_DEPS[@]} \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/*


