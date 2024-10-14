WORKDIR=$(pwd)
IPADDR=0.0.0.0
if [ "$(uname)" == "Linux" ]; then
    IPADDR=$(hostname -I | cut -d ' ' -f 1 | tr -d ' ')
elif [ "$(uname)" == "Darwin" ]; then
    INTERFACE=$(route get default | grep 'interface:' | awk '{print $2}')
    IPADDR=$(ipconfig getifaddr $INTERFACE)
fi

# frontend vars
NEXTENV=$WORKDIR/frontend/.env

# vault vars
VAULT_ENV=$WORKDIR/.env
VAULTDIR=$WORKDIR/vault_data
VAULT_CLIENTS=("vault" "backend" "database" "frontend")
OAUTH_PROVIDERS=("42" "GITHUB")

if grep -qs "OAUTH" $VAULT_ENV; then
    SWAP_CRE=$(grep -s "OAUTH" $VAULT_ENV)
fi

# swap back or read required oauth credentials
swap_back_or_read() {
    local provider=$1
    local credential=$2
    if echo "$SWAP_CRE" | grep -q "OAUTH_${provider}_${credential}"; then
        echo "$SWAP_CRE" | grep "OAUTH_${provider}_${credential}" >> $VAULT_ENV
    else
        read -p "Enter $provider ${credential}: " TMP
        echo "OAUTH_${provider}_${credential}=\"$TMP\"" >> $VAULT_ENV
    fi
}
