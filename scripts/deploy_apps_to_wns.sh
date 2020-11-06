#!/bin/bash

set -euo pipefail

for appdir in `find ./apps -name '*-app' -type d | grep -v node_modules`; do
  pushd $appdir

  WNS_ORG="${WNS_ORG:-dxos}"
  PKG_CHANNEL="${PKG_CHANNEL:-}"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2- | sed 's/-app$//'`
  PKG_DESC=`cat package.json | jq -r '.description'`
  PKG_VERSION=`cat package.json | jq -r '.version'`
  
  if [ -z "$PKG_DESC" ]; then
    PKG_DESC="$PKG_NAME"
  fi
  
  WNS_NAME="$WNS_ORG/$PKG_NAME"
  WNS_VERSION=`yarn -s wire wns name resolve wrn://${WNS_ORG}/application/${PKG_NAME}${PKG_CHANNEL} | jq -r '.records[0].attributes.version'`
  
  if [ -z "$WNS_VERSION" ] || [ "null" == "$WNS_VERSION" ]; then
    WNS_VERSION="0.0.1"
  fi
  
  cat <<EOF > app.yml
name: $PKG_NAME
build: yarn dist
version: $WNS_VERSION
EOF

  cat app.yml
  echo "wrn://${WNS_ORG}/application/${PKG_NAME}${PKG_CHANNEL}"

  yarn -s wire app deploy --name "wrn://${WNS_ORG}/application/${PKG_NAME}${PKG_CHANNEL}"

  popd
done
