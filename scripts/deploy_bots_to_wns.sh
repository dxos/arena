#!/bin/bash

set -euo pipefail

for botdir in `find ./bots -name 'chess-bot' -type d | grep -v node_modules`; do
  pushd $botdir

  WNS_ORG="${WNS_ORG:-dxos}"
  PKG_CHANNEL="${PKG_CHANNEL:-}"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2- | sed 's/-bot$//'`
  WNS_NAME="$WNS_ORG/$PKG_NAME"
  WNS_ARCH="${WNS_ARCH:-linux-x64}"
  WNS_VERSION="1.0.0"
  if [ -f "package.json" ]; then
    WNS_VERSION=`cat package.json | grep version | awk '{print $2}' | sed 's/[",]//g'`
  fi

  cat <<EOF > bot.yml
name: "$PKG_NAME"
version: "$WNS_VERSION"
keywords:
  - arena
EOF

  cat bot.yml
  echo "wrn://${WNS_ORG}/bot/${PKG_NAME}${PKG_CHANNEL}"

  yarn package:${WNS_ARCH}
  yarn -s wire bot publish
  yarn -s wire bot register --name "wrn://${WNS_ORG}/bot/${PKG_NAME}${PKG_CHANNEL}"

  popd
done
