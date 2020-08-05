//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';
import leveljs from 'level-js';

import { createStorage } from '@dxos/random-access-multi-storage';
import { Keyring, KeyStore } from '@dxos/credentials';
import { Client } from '@dxos/client';

import Root from './containers/Root';

import { loadConfig } from './config';

(async () => {
  const cfg = await loadConfig();

  const { client: { feedStorage, keyStorage, swarm }, ...config } = cfg.values;

  const keyring = new Keyring(new KeyStore(leveljs(`${keyStorage.root}/keystore`)));

  const client = new Client({
    storage: createStorage(feedStorage.root, feedStorage.type),
    keyring,
    swarm
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
