#!/bin/bash

set -e


if [ "$(uname)" == "Linux" ]
then
    IPADDR=$(hostname -I | cut -d ' ' -f 1 | tr -d ' ')
    sed -i "s/^SERVER_HOST=.*/SERVER_HOST=$IPADDR/" .env
else
    IPADDR=$(ipconfig getifaddr en0)
   sed -i '' "s/^SERVER_HOST=.*/SERVER_HOST=$IPADDR/" .env
fi

mkdir -p ./postgres_data
mkdir -p ./log_nginx
mkdir -p vault_data/cre/backend
mkdir -p vault_data/cre/frontend
mkdir -p vault_data/cre/database
mkdir -p vault_data/cre/vault
