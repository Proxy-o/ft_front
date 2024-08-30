#!/bin/bash

set -e

DOTENV=$(find . -name .env)
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
    $SEDI "s/^SERVER_HOST=.*/SERVER_HOST=$IPADDR/" $file
done
