#!/bin/sh

set -ex

trap 'echo "Caught SIGTERM, shutting down..."; kill %1' SIGTERM
trap 'echo "Caught SIGINT, shutting down..."; kill %1' SIGINT

## vars
POLICIES_FILE=/vault/file/policies
VAULT_CLIENT=$(cat $POLICIES_FILE | tr '\n' ' ')

# Check if the policies file exists
if [ ! -f $POLICIES_FILE ]; then
  echo "Policies file not found."
  exit 1
fi

# generate the config file from a template
mkdir -p /vault/config
cp /vault/file/conf.template /vault/config/conf.hcl

# add auto_auth block to the config file for each client
for client in $VAULT_CLIENT; do
  cat <<EOF >> /vault/config/conf.hcl
auto_auth {
  method "approle" {
    mount_path = "auth/approle"
    config = {
      role_id_file_path   = "/vault/cre/${client}/role-id"
      secret_id_file_path = "/vault/cre/${client}/secret-id"
    }
  }

  sink "file" {
    config = {
      path = "/vault/token/vault-token"
    }
  }
}

EOF
done

## helper funcs
create_policy() {
  local client=$1

  if [ -f /vault/policies/${client}_policy.hcl ]; then
    if ! vault policy list | grep -q "${client}_policy"; then
      echo "Policy ${client}_policy not found. Creating..."
      vault policy write "${client}_policy" "/vault/policies/${client}_policy.hcl"
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
    vault write auth/approle/role/${client}-role \
      token_policies="${client}_policy" \
      secret_id_ttl="0"


    # Save the Role ID and Secret ID for later use
    vault read -field=role_id auth/approle/role/${client}-role/role-id > /vault/cre/${client}/role-id
    vault write -f -field=secret_id auth/approle/role/${client}-role/secret-id > /vault/cre/${client}/secret-id
  else
    echo "${role}-role already exists."
  fi
}

# Start the Vault server in the background
vault server -config=/vault/config/conf.hcl &

# Wait for Vault to be ready
echo "Waiting for Vault to be ready..."
while vault status | grep -q 'connection refused'; do
  sleep 1
done

# Initialize Vault if not already initialized
if [ $(set +e; vault operator init -status &>/dev/null; echo $?) -eq 2 ]; then
  echo "Initializing Vault..."
  vault operator init -key-shares=1 -key-threshold=1 > /vault/init-keys.txt

  chmod 600 /vault/init-keys.txt

  echo "Vault initialized."

else
  echo "Vault is already initialized."
fi

# Extract the unseal key and root token securely
VAULT_UNSEAL_KEY=$(grep 'Unseal Key 1:' /vault/init-keys.txt | awk '{print $NF}')
VAULT_ROOT_TOKEN=$(grep 'Initial Root Token:' /vault/init-keys.txt | awk '{print $NF}')

# Unseal Vault

if [ $(set +e; vault status &>/dev/null; echo $?) -eq 2 ]; then
  echo "Unsealing Vault..."
  if ! vault operator unseal $VAULT_UNSEAL_KEY; then
    echo "Failed to unseal Vault."
    exit 1
  fi
else
  echo "Vault is already unsealed."
fi

# Log in to Vault with the root token
if ! vault login $VAULT_ROOT_TOKEN; then
  echo "Failed to log in to Vault."
  exit 1
fi

# Enable the AppRole authentication method if not already enabled
if ! vault auth list | grep -q approle/; then
  echo "Enabling AppRole authentication..."
  vault auth enable approle
else
  echo "AppRole authentication already enabled."
fi


# Create AppRoles and policies if they don't exist
for client in $VAULT_CLIENT; do
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