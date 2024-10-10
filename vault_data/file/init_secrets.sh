#!/bin/sh

set -ex

# Read the Role ID and Secret ID from Docker secrets
VAULT_ROLE_ID=$(cat /vault/cre/vault/role-id)
VAULT_SECRET_ID=$(cat /vault/cre/vault/secret-id)

# Authenticate with the AppRole
echo "Authenticating with the AppRole..."
vault write auth/approle/login role_id=$VAULT_ROLE_ID secret_id=$VAULT_SECRET_ID

# Enable the transit secrets engine if not already enabled
if ! vault secrets list | grep -q transit/; then
  echo "Enabling transit secrets engine..."
  vault secrets enable transit
else
  echo "Transit secrets engine already enabled."
fi

# Enable the KV secrets engine if not already enabled
if ! vault secrets list | grep -q secret/; then
  echo "Enabling KV secrets engine..."
  vault secrets enable -path=secret kv
else
  echo "KV secrets engine already enabled."
fi

# Generate random secrets
echo "Generating random secrets..."
POSTGRES_PASSWORD=$(vault write -f -field=random_bytes sys/tools/random/32 | base64)
SECRET_KEY=$(vault write -f -field=random_bytes sys/tools/random/32 | base64)
OAUTH_42_STATE=$(vault write -f -field=random_bytes sys/tools/random/32 | base64)

# Ensure OAUTH_42_CLIENT_ID and OAUTH_42_CLIENT_SECRET are set
if [ -z "$OAUTH_42_CLIENT_ID" ] || [ -z "$OAUTH_42_CLIENT_SECRET" ]; then
  echo "OAUTH_42_CLIENT_ID and OAUTH_42_CLIENT_SECRET must be set."
  exit 1
fi

# Encrypt sensitive data
echo "Encrypting sensitive data..."
OAUTH_42_CLIENT_ID=$(vault write -field=ciphertext transit/encrypt/my-key plaintext="$(echo -n $OAUTH_42_CLIENT_ID | base64)")
OAUTH_42_CLIENT_SECRET=$(vault write -field=ciphertext transit/encrypt/my-key plaintext="$(echo -n $OAUTH_42_CLIENT_SECRET | base64)")

# Write secrets to Vault
echo "Writing secrets to Vault..."
vault kv put secret/backend SERVER_HOST=$SERVER_HOST SECRET_KEY=$SECRET_KEY
vault kv put secret/db POSTGRES_PASSWORD=$POSTGRES_PASSWORD POSTGRES_USER=postgres POSTGRES_DB=transcendence POSTGRES_HOST=postgres_container POSTGRES_PORT=5432 POSTGRES_NAME=postgres
vault kv put secret/front NEXT_PUBLIC_BACKEND_URL=https://${SERVER_HOST}:443 NEXT_PUBLIC_CHAT_URL=wss://${SERVER_HOST}:443/ws/chat/ NEXT_PUBLIC_INVITATION_URL=wss://${SERVER_HOST}:443/ws/game/invitation NEXT_PUBLIC_GAME_URL=wss://${SERVER_HOST}:443/ws/game/game
vault kv put secret/oauth OAUTH_42_CLIENT_ID=$OAUTH_42_CLIENT_ID OAUTH_42_CLIENT_SECRET=$OAUTH_42_CLIENT_SECRET OAUTH_42_STATE=$OAUTH_42_STATE

# Mark initialization as done
vault kv put secret/init_done initialized=true
echo "Vault initialization and secrets storage completed successfully."