#!/bin/sh

set -e

apk --no-cache add jq

res=$(
    wget -q --header="X-Vault-Token: root" \
        --header="Content-Type: application/json" \
        -O - http://vault:8200/v1/secret/data/db
)

export POSTGRES_DB=$(echo $res | jq -r '.data.data.POSTGRES_DB')
echo POSTGRES_DB $POSTGRES_DB
export POSTGRES_PASSWORD=$(echo $res | jq -r '.data.data.POSTGRES_PASSWORD')
echo POSTGRES_PASSWORD $POSTGRES_PASSWORD
export POSTGRES_USER=$(echo $res | jq -r '.data.data.POSTGRES_USER')
echo POSTGRES_USER $POSTGRES_USER

apk del jq

exec docker-entrypoint.sh postgres