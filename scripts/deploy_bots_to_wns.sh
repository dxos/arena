#!/bin/bash

set -euo pipefail

for botdir in `find ./bots -name 'chess-bot' -type d | grep -v node_modules`; do
  pushd $botdir

  WNS_ORG="${WNS_ORG:-egorgripasov}"
  PKG_CHANNEL="${PKG_CHANNEL:-}"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2- | sed 's/-bot$//'`
  WNS_NAME="$WNS_ORG/$PKG_NAME"
  WNS_ARCH="${WNS_ARCH:-linux-x64}"
  
  cat <<EOF > bot.yml
name: $PKG_NAME
version: 0.0.1
EOF

  cat bot.yml
  echo "wrn://${WNS_ORG}/bot/${PKG_NAME}${PKG_CHANNEL}"

  yarn package:${WNS_ARCH}
  yarn -s wire bot publish
  yarn -s wire bot register --name "wrn://egorgripasov/bot/${PKG_NAME}${PKG_CHANNEL}"

  popd
done
