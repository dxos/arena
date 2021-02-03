#!/bin/bash

set -euo pipefail

for appdir in `find ./apps -name '*-app' -type d | grep -v node_modules`; do
  pushd $appdir

  WNS_ORG="${WNS_ORG:-dxos}"
  PKG_CHANNEL="${PKG_CHANNEL:-}"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2- | sed 's/-app$//'`
  WNS_NAME="$WNS_ORG/$PKG_NAME"
  
  cat <<EOF > app.yml
name: $PKG_NAME
build: yarn dist
EOF

  cat app.yml
  echo "wrn://${WNS_ORG}/application/${PKG_NAME}${PKG_CHANNEL}"

  yarn -s wire app deploy --name "wrn://${WNS_ORG}/application/${PKG_NAME}${PKG_CHANNEL}"

  popd
done
