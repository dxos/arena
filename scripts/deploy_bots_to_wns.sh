#!/bin/bash

set -euo pipefail

for botdir in `find ./bots -name 'chess-bot' -type d | grep -v node_modules`; do
  pushd $botdir

  REGISTRY_ORG="${REGISTRY_ORG:-dxos}"
  PKG_CHANNEL="${PKG_CHANNEL:-}"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2- | sed 's/-bot$//'`
  REGISTRY_NAME="$REGISTRY_ORG/$PKG_NAME"
  REGISTRY_ARCH="${REGISTRY_ARCH:-linux-x64}"
  REGISTRY_VERSION="1.0.0"
  if [ -f "package.json" ]; then
    REGISTRY_VERSION=`cat package.json | grep version | awk '{print $2}' | sed 's/[",]//g'`
  fi

  cat <<EOF > bot.yml
name: "$PKG_NAME"
version: "$REGISTRY_VERSION"
keywords:
  - arena
EOF

  cat bot.yml
  echo "wrn://${REGISTRY_ORG}/bot/${PKG_NAME}${PKG_CHANNEL}"

  yarn package:${REGISTRY_ARCH}
  yarn -s dx bot publish
  yarn -s dx bot register --name "wrn://${REGISTRY_ORG}/bot/${PKG_NAME}${PKG_CHANNEL}"

  popd
done
