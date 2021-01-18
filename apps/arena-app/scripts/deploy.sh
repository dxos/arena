#!/bin/sh

# Ensure ~/.dxos/config.yml is set-up correctly.

set -x

yarn dx app build
yarn dx app publish
yarn dx app register

yarn dx app query --name DXOS.io/arena

yarn run dx app serve --app dxn:app:dxos.org/arena --path /arena --port 8080
