#!/bin/sh

set -e

if [[ -z "${POSTGRES_USER}" || -z "${POSTGRES_PASSWORD}" ]]; then
  # Read the Role ID and Secret ID from Docker secrets
    VAULT_ROLE_ID=$(cat /.vault/role-id)
    VAULT_SECRET_ID=$(cat /.vault/secret-id)

    # wait for vault to be initialized
    while true; do
        sleep 5
        if wget -q -O - $VAULT_API_ADDR/v1/sys/health | jq -r '.initialized' | grep -q true; then
            break
        fi
    done

    # Authenticate with Vault using AppRole to get a token
    VAULT_TOKEN=$(wget -q --header="Content-Type: application/json" \
        --post-data="{\"role_id\":\"$VAULT_ROLE_ID\", \"secret_id\":\"$VAULT_SECRET_ID\"}" \
        -O - $VAULT_API_ADDR/v1/auth/approle/login | jq -r '.auth.client_token')

    # Get the secrets from Vault
    res=$(
        wget -q --header="X-Vault-Token: $VAULT_TOKEN" \
            --header="Content-Type: application/json" \
            -O - $VAULT_API_ADDR/v1/secret/db
    )

    export POSTGRES_DB=$(echo $res | jq -r '.data.POSTGRES_DB')
    export POSTGRES_PASSWORD=$(echo $res | jq -r '.data.POSTGRES_PASSWORD')
    export POSTGRES_USER=$(echo $res | jq -r '.data.POSTGRES_USER')
fi

# Continue the PostgreSQL server setup
exec /usr/local/bin/docker-entrypoint.sh "$@"
