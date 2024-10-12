#!/bin/bash

set -e

# vars
OAUTH_PROVIDERS=("42" "GITHUB")
IPADDR=0.0.0.0

# create necessary directories
mkdir -p postgres_data log_nginx vault_data/cre/{backend,frontend,database,vault}

# get the Host Ip address
if [ "$(uname)" == "Linux" ]
then
    IPADDR=$(hostname -I | cut -d ' ' -f 1 | tr -d ' ')
else
    IPADDR=$(ipconfig getifaddr en0)
fi

# generate /frontend/.env if not exist
if [ ! -f ./frontend/.env ]; then
    echo -e "\
NEXT_PUBLIC_BACKEND_URL=https://$IPADDR:443\n\
NEXT_PUBLIC_CHAT_URL=wss://$IPADDR:443/ws/chat/\n\
NEXT_PUBLIC_GAME_URL=wss://$IPADDR:443/ws/game/game\n\
NEXT_PUBLIC_INVITATION_URL=wss://$IPADDR:443/ws/game/invitation\
" > ./frontend/.env
else
    echo "./frontend/.env exist, Skipping..."
fi

# generate .env if not exist
if [ ! -f .env ]; then
    echo "SERVER_HOST=$IPADDR" > .env
    echo "VAULT_ADDR=http://vault:8200" >> .env

    for provider in ${OAUTH_PROVIDERS[@]}; do
        read -p "Enter $provider client id: " CLIENT_ID && echo "OAUTH_${provider}_CLIENT_ID=\"$CLIENT_ID\"" >> .env
        read -p "Enter $provider client secret: " CLIENT_SECRET && echo "OAUTH_${provider}_CLIENT_SECRET=\"$CLIENT_SECRET\"" >> .env
    done
else
    echo ".env exist, Skipping..."
fi
