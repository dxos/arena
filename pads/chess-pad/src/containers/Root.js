//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import { ErrorHandler } from '@dxos/debug';
import metrics from '@dxos/metrics';
import {
  SET_LAYOUT,
  AppKitContextProvider,
  DefaultRouter,
  CheckForErrors,
  Registration,
  RequireWallet,
  SystemRoutes,
  Theme
} from '@dxos/react-appkit';
import { ClientContextProvider } from '@dxos/react-client';

import { useOnFirstRender } from '../lifecycle';
import App from './App';

const initialState = {
  [SET_LAYOUT]: {
    showSidebar: true,
    showDebug: false
  }
};

const Root = ({ config }) => {
  const router = { ...DefaultRouter, publicUrl: config.app.publicUrl };
  const { paths, routes } = router;

  useOnFirstRender(() => metrics.event('chess.Root.mounted'));

  return (
    <Theme>
      <ClientContextProvider config={config}>
        <AppKitContextProvider
          initialState={initialState}
          errorHandler={new ErrorHandler()}
          router={router}
        >
          <CheckForErrors>
            <HashRouter>
              <Switch>
                <Route exact path={routes.register} component={Registration} />
                <RequireWallet redirect={routes.register} isRequired={(path = '', query = {}) => !path.startsWith(paths.auth) || !query.identityKey}>
                  <Switch>
                    {SystemRoutes(router)}
                    <Route exact path={routes.app} component={App} />
                    <Redirect to={paths.home} />
                  </Switch>
                </RequireWallet>
              </Switch>
            </HashRouter>
          </CheckForErrors>
        </AppKitContextProvider>
      </ClientContextProvider>
    </Theme>
  );
};

export default Root;
