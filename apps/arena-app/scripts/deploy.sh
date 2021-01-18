#!/bin/sh

# Ensure ~/.dxos/config.yml is set-up correctly.

set -x

yarn wire app build
yarn wire app publish
yarn wire app register

yarn wire app query --name DXOS.io/arena

yarn run wire app serve --app wrn:app:DXOS.io/arena --path /arena --port 8080
