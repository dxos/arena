//
// Copyright 2018 Wireline, Inc.
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import { ErrorHandler } from '@dxos/debug';
import {
  SET_LAYOUT,
  AppKitContextProvider,
  DefaultRouter,
  Registration,
  RequireWallet,
  CheckForErrors,
  SystemRoutes,
  Theme
} from '@dxos/react-appkit';
import { ClientContextProvider } from '@dxos/react-client';

import Pad from '@dxos/game-pad';

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

  return (
    <Theme>
      <ClientContextProvider config={config}>
        <AppKitContextProvider
          initialState={initialState}
          errorHandler={new ErrorHandler()}
          router={router}
          pads={[Pad]}
        >
          <CheckForErrors>
            <HashRouter>
              <Switch>
                <Route exact path={routes.register} component={Registration} />
                <RequireWallet
                  redirect={routes.register}
                  // Allow access to the AUTH route if it is for joining an Identity, otherwise require a Wallet.
                  // TODO(telackey): Should we make a separate path for authorizing devices?
                  isRequired={(path = '', query = {}) => !path.startsWith(paths.auth) || !query.identityKey}
                >
                  <Switch>
                    {SystemRoutes(router)}
                    <Route path={routes.app} component={App} />
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
