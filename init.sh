#!/bin/bash

set -e

DOTENV=$(find . -name .env -o -name settings.py)
if [ "$(uname)" == "Linux" ]
then
    IPADDR=$(hostname -I | cut -d ' ' -f 1 | tr -d ' ')
    SEDI="sed -i"
else
    IPADDR=$(ipconfig getifaddr en0)
    SEDI="sed -i ''"
fi

for file in $DOTENV
do
    $SEDI "s/ipaddr/$IPADDR/g" $file
done
