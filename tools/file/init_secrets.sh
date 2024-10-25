#!/bin/sh

set -e

vault_client() {
  vault "$@" || { echo ERROR: "$@" failed; exit 1; }
}

cleanup() {
  unset $(env | grep OAUTH_ | cut -d '=' -f 1)
  VAULT_ROLE_ID=0
  VAULT_SECRET_ID=0
  SECRET_KEY=0
  POSTGRES_PASSWORD=0
  OAUTH_SECRET=0
}


trap cleanup EXIT

# Read the Role ID and Secret ID from Docker secrets
VAULT_ROLE_ID=$(cat /vault/cre/vault/role-id)
VAULT_SECRET_ID=$(cat /vault/cre/vault/secret-id)

# Authenticate with the AppRole
echo "Authenticating with the AppRole..."
vault_client write auth/approle/login role_id=$VAULT_ROLE_ID secret_id=$VAULT_SECRET_ID

# Enable the transit secrets engine if not already enabled
if ! vault secrets list | grep -q transit/; then
  echo "Enabling transit secrets engine..."
  vault_client secrets enable transit
else
  echo "Transit secrets engine already enabled."
fi

# Enable the KV secrets engine if not already enabled
if ! vault secrets list | grep -q secret/; then
  echo "Enabling KV secrets engine..."
  vault_client secrets enable -path=secret kv
else
  echo "KV secrets engine already enabled."
fi

# Generate random secrets
echo "Generating random secrets..."
POSTGRES_PASSWORD=$(vault_client write -f -field=random_bytes sys/tools/random/32 | base64)
SECRET_KEY=$(vault_client write -f -field=random_bytes sys/tools/random/32 | base64)

# generate state and encrypt OAuth credientials
OAUTH_SECRETS=""

for provider in $OAUTH_PROVIDERS; do
  OAUTH_ID=$(env | grep "OAUTH_${provider}_CLIENT_ID" | cut -d '=' -f 2)
  OAUTH_SECRET=$(env | grep "OAUTH_${provider}_CLIENT_SECRET" | cut -d '=' -f 2)

  OAUTH_ID=$(vault_client write -field=ciphertext transit/encrypt/my-key plaintext="$(echo -n "$OAUTH_ID" | base64)")
  OAUTH_SECRET=$(vault_client write -field=ciphertext transit/encrypt/my-key plaintext="$(echo -n "$OAUTH_SECRET" | base64)")
  OAUTH_STATE=$(vault_client write -f -field=random_bytes sys/tools/random/32 | base64)

  OAUTH_SECRETS="$OAUTH_SECRETS OAUTH_${provider}_CLIENT_ID=$OAUTH_ID"
  OAUTH_SECRETS="$OAUTH_SECRETS OAUTH_${provider}_CLIENT_SECRET=$OAUTH_SECRET"
  OAUTH_SECRETS="$OAUTH_SECRETS OAUTH_${provider}_STATE=$OAUTH_STATE"

done
# Write secrets to Vault
echo "Writing secrets to Vault..."
vault_client kv put secret/backend SERVER_HOST=$SERVER_HOST SECRET_KEY="$SECRET_KEY"
vault_client kv put secret/db POSTGRES_PASSWORD="$POSTGRES_PASSWORD" POSTGRES_USER=postgres POSTGRES_DB=transcendence POSTGRES_HOST=postgres POSTGRES_PORT=5432 POSTGRES_NAME=postgres
vault_client kv put secret/oauth $OAUTH_SECRETS

# Mark initialization as done
vault_client kv put secret/init_done initialized=true
echo "Vault initialization and secrets storage completed successfully."

rm -f $0