#!/bin/bash

set -e

# source vars
source $(pwd)/tools/vars.sh

# create necessary directories
mkdir -p postgres_data $VAULTDIR/{file,config,policies} $VAULTDIR/cre/{backend,frontend,database,vault}

# generate/overwrite the frontend env file
echo -e "\
NEXT_PUBLIC_BACKEND_URL=https://$IPADDR:443\n\
NEXT_PUBLIC_CHAT_URL=wss://$IPADDR:443/ws/chat/\n\
NEXT_PUBLIC_GAME_URL=wss://$IPADDR:443/ws/game/game\n\
NEXT_PUBLIC_INVITATION_URL=wss://$IPADDR:443/ws/game/invitation\
" > $NEXTENV

# generate vault envfile
echo "SERVER_HOST=$IPADDR" > $VAULT_ENV
echo "VAULT_ADDR=http://vault:8200" >> $VAULT_ENV
echo "VAULT_CLIENTS=\"${VAULT_CLIENTS[@]}\"" >> $VAULT_ENV
echo "OAUTH_PROVIDERS=\"${OAUTH_PROVIDERS[@]}\"" >> $VAULT_ENV

for provider in "${OAUTH_PROVIDERS[@]}"; do
    swap_back_or_read "$provider" "CLIENT_ID"
    swap_back_or_read "$provider" "CLIENT_SECRET"
done

# copy necessary files for vault service
cp $WORKDIR/tools/file/entrypoint.sh $VAULTDIR/file/entrypoint.sh
cp $WORKDIR/tools/file/init_secrets.sh $VAULTDIR/file/init_secrets.sh
cp $WORKDIR/tools/file/conf.template $VAULTDIR/config/conf.hcl
for policy in ${VAULT_CLIENTS[@]}; do
  cp $WORKDIR/tools/policies/${policy}_policy.hcl $VAULTDIR/policies/${policy}_policy.hcl
done

# add auto_auth block to the config file for each client
for client in ${VAULT_CLIENTS[@]}; do
  cat <<EOF >> $VAULTDIR/config/conf.hcl

auto_auth {
  method {
    type       = "approle"
    mount_path = "auth/approle"
    config = {
      role_id_file_path   = "/vault/cre/${client}/role-id"
      secret_id_file_path = "/vault/cre/${client}/secret-id"
    }
  }

  sink "file" {
    config = {
      path = "/vault/token/${client}-token"
    }
  }
}

EOF
done