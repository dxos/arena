//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './containers/Root';

export async function initApp (cfg, messageLog) {
  debug.enable(cfg.get('debug.logging'));

  ReactDOM.render(
    <Root
      clientConfig={cfg.values}
      messageLog={messageLog}
    />,
    document.getElementById(cfg.get('app.rootElement'))
  );
}
