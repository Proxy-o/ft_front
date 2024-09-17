#!/bin/sh

set -e

# Get the secrets from Vault

res=$(
    wget -q --header="X-Vault-Token: root" \
        --header="Content-Type: application/json" \
        -O - http://vault:8200/v1/secret/data/db
)

export POSTGRES_DB=$(echo $res | jq -r '.data.data.POSTGRES_DB')
export POSTGRES_PASSWORD=$(echo $res | jq -r '.data.data.POSTGRES_PASSWORD')
export POSTGRES_USER=$(echo $res | jq -r '.data.data.POSTGRES_USER')

# Start the PostgreSQL server
exec /usr/local/bin/docker-entrypoint.sh "$@"