#!/bin/bash

set -e

IPADDR=$(ipconfig getifaddr en0)
DOTENV=$(find . -name .env -o -name settings.py)

for envfile in $DOTENV
do
    sed -i -e "s/ipaddr/$IPADDR/g" $envfile
done