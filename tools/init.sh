#!/bin/bash

set -ex

# vars
OAUTH_PROVIDERS=("42" "GITHUB")
IPADDR=0.0.0.0

# create necessary directories
mkdir -p postgres_data log_nginx vault_data/cre/{backend,frontend,database,vault}

# get the Host IP address
if [ "$(uname)" == "Linux" ]; then
    IPADDR=$(hostname -I | cut -d ' ' -f 1 | tr -d ' ')
else
    IPADDR=$(ipconfig getifaddr en0)
fi

# generate /frontend/.env
echo -e "\
NEXT_PUBLIC_BACKEND_URL=https://$IPADDR:443\n\
NEXT_PUBLIC_CHAT_URL=wss://$IPADDR:443/ws/chat/\n\
NEXT_PUBLIC_GAME_URL=wss://$IPADDR:443/ws/game/game\n\
NEXT_PUBLIC_INVITATION_URL=wss://$IPADDR:443/ws/game/invitation\
" > ./frontend/.env

# backup existing oauth credentials
if grep -qs "OAUTH" .env; then
    SWAP_CRE=$(grep -s "OAUTH" .env)
fi

# generate .env
echo "SERVER_HOST=$IPADDR" > .env
echo "VAULT_ADDR=http://vault:8200" >> .env

# swap back or read required oauth credentials
swap_back_or_read() {
    local provider=$1
    local credential=$2
    if echo "$SWAP_CRE" | grep -q "OAUTH_${provider}_${credential}"; then
        echo "$SWAP_CRE" | grep "OAUTH_${provider}_${credential}" >> .env
    else
        read -p "Enter $provider ${credential}: " TMP
        echo "OAUTH_${provider}_${credential}=\"$TMP\"" >> .env
    fi
}

for provider in "${OAUTH_PROVIDERS[@]}"; do
    swap_back_or_read "$provider" "CLIENT_ID"
    swap_back_or_read "$provider" "CLIENT_SECRET"
done