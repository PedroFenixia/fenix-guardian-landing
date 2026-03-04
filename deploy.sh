#!/bin/bash
# Deploy fenixia.tech to OVH server
set -e

SERVER="root@37.59.118.147"
REMOTE_PATH="/var/www/vhosts/fenixia.tech/httpdocs"

echo "Building..."
npm run build

echo "Uploading to $SERVER..."
ssh "$SERVER" "rm -rf ${REMOTE_PATH}/*"
scp -r dist/* "$SERVER:${REMOTE_PATH}/"
ssh "$SERVER" "chown -R fenixia:psaserv ${REMOTE_PATH}"

echo "Done! https://fenixia.tech"
