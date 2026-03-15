#!/bin/bash
# Deploy app.prospector.fenixia.tech to OVH server
set -e

SERVER="root@91.134.43.229"
REMOTE_PATH="/var/www/prospector-landing"

echo "Building..."
npm run build

echo "Uploading to $SERVER:$REMOTE_PATH..."
ssh "$SERVER" "rm -rf ${REMOTE_PATH}/*"
scp -r dist/* "$SERVER:${REMOTE_PATH}/"

echo "Done! https://app.prospector.fenixia.tech"
