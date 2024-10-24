#!/bin/sh

set -e

trap 'echo "Caught SIGTERM, shutting down..."; kill %1' SIGTERM
trap 'echo "Caught SIGINT, shutting down..."; kill %1' SIGINT

vault_client() {
  vault "$@" || { echo ERROR: "$@" failed; exit 1; }
}

## helper funcs
create_policy() {
  local client=$1

  if [ -f /vault/policies/${client}_policy.hcl ]; then
    if ! vault policy list | grep -q "${client}_policy"; then
      echo "Policy ${client}_policy not found. Creating..."
      vault_client policy write "${client}_policy" "/vault/policies/${client}_policy.hcl"
    else
      echo "Policy ${client}_policy already exists."
    fi
  else
    echo "Policy file for ${client}_policy not found."
    exit 1
  fi

}

create_approle() {
  local client=$1
  if ! vault read auth/approle/role/${client}-role >/dev/null 2>&1; then
    echo "Creating AppRole for ${client}-role..."
    vault_client write auth/approle/role/${client}-role \
      token_policies="${client}_policy" \
      secret_id_ttl="0"

    # Save the Role ID and Secret ID for later use
    vault_client read -field=role_id auth/approle/role/${client}-role/role-id > /vault/cre/${client}/role-id
    vault_client write -f -field=secret_id auth/approle/role/${client}-role/secret-id > /vault/cre/${client}/secret-id
  else
    echo "${role}-role already exists."
  fi
}

# Start the Vault server in the background
vault_client server -config=/vault/config/conf.hcl &

# Wait for Vault to be ready
echo "Waiting for Vault to be ready..."
while vault status | grep -q 'connection refused'; do
  sleep 5
done

# Initialize Vault if not already initialized
STATUS=$(set +e; vault operator init -status &>/dev/null; echo $?)
if [ $STATUS -eq 2 ]; then
  echo "Initializing Vault..."
  vault_client operator init -key-shares=1 -key-threshold=1 > /vault/init-keys.txt

  chmod 600 /vault/init-keys.txt

  echo "Vault initialized."

elif [ $STATUS -eq 1 ]; then
  echo "ERROR: Vault can't be initialized."
  exit 1
else
  echo "Vault is already initialized."
fi

# Extract the unseal key and root token securely
VAULT_UNSEAL_KEY=$(grep 'Unseal Key 1:' /vault/init-keys.txt | awk '{print $NF}')
VAULT_ROOT_TOKEN=$(grep 'Initial Root Token:' /vault/init-keys.txt | awk '{print $NF}')

# Unseal Vault
if [ $(set +e; vault status &>/dev/null; echo $?) -eq 2 ]; then
  echo "Unsealing Vault..."
  vault_client operator unseal $VAULT_UNSEAL_KEY
else
  echo "Vault is already unsealed."
fi

# Log in to Vault with the root token
vault_client login $VAULT_ROOT_TOKEN


# Enable the AppRole authentication method if not already enabled
if ! vault auth list | grep -q approle/; then
  echo "Enabling AppRole authentication..."
  vault_client auth enable approle
else
  echo "AppRole authentication already enabled."
fi


# Create AppRoles and policies if they don't exist
for client in $VAULT_CLIENTS; do
  create_policy $client
  create_approle $client
done

# Initialize secrets if not already done
if ! vault kv get secret/init_done | grep -q initialized; then
  echo "Vault initialization detected as incomplete. Initializing secrets..."  
  ./vault/file/init_secrets.sh
else
  echo "Vault initialization detected as complete. Skipping..."
fi

wait %1