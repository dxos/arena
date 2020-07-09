//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './containers/Root';

import { loadConfig } from './config';

(async () => {
  const config = await loadConfig();

  debug.enable(config.get('debug.logging'));

  ReactDOM.render(<Root config={config.values} />, document.getElementById(config.get('app.rootElement')));
})();
