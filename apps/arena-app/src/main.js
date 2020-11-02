//
// Copyright 2020 DXOS.org
//

import { loadConfig } from './config';

(async () => {
  const cfg = await loadConfig();

  if (cfg.get('sentry.dsn')) {
    const Sentry = require('@sentry/react');
    const sentryDns = cfg.get('sentry.dsn');
    Sentry.init({ dsn: sentryDns, environment: cfg.get('sentry.environment') || process.env.NODE_ENV });
  }

  // We have this two-stage init process so that sentry can report errors that happen during module imports.
  const { initApp } = require('./init');
  // @ts-ignore
  initApp(cfg);
})();
