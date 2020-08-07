//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import leveljs from 'level-js';
import React from 'react';
import ReactDOM from 'react-dom';

import { Client } from '@dxos/client';
import { Keyring, KeyStore } from '@dxos/credentials';
import { createStorage } from '@dxos/random-access-multi-storage';
import { Registry } from '@wirelineio/registry-client';

import { loadConfig } from './config';
import Root from './containers/Root';

(async () => {
  const cfg = await loadConfig();

  const {
    client: { feedStorage, keyStorage, swarm },
    services: { wns: { server, chainId } },
    ...config
  } = cfg.values;

  const keyring = new Keyring(new KeyStore(leveljs(`${keyStorage.root}/keystore`)));

  const client = new Client({
    storage: createStorage(feedStorage.root, feedStorage.type),
    keyring,
    swarm,
    registry: new Registry(server, chainId)
  });
  await client.initialize();

  debug.enable(cfg.get('debug.logging'));

  ReactDOM.render(
    <Root
      config={config}
      client={client}
    />,
    document.getElementById(cfg.get('app.rootElement'))
  );
})();
