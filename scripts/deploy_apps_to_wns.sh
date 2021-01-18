#!/bin/bash

set -euo pipefail

for appdir in `find ./apps -name '*-app' -type d | grep -v node_modules`; do
  pushd $appdir

  REGISTRY_ORG="${REGISTRY_ORG:-dxos}"
  PKG_CHANNEL="${PKG_CHANNEL:-}"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2- | sed 's/-app$//'`
  REGISTRY_NAME="$REGISTRY_ORG/$PKG_NAME"
  
  cat <<EOF > app.yml
name: $PKG_NAME
build: yarn dist
EOF

  cat app.yml
  echo "wrn://${REGISTRY_ORG}/application/${PKG_NAME}${PKG_CHANNEL}"

  yarn -s dx app deploy --name "wrn://${REGISTRY_ORG}/application/${PKG_NAME}${PKG_CHANNEL}"

  popd
done
