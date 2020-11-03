//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import primary from '@material-ui/core/colors/deepOrange';

import ChessPad from '@dxos/chess-pad';
import { ErrorHandler } from '@dxos/debug';
import GamePad from '@dxos/game-pad';
// import MessengerPad from '@dxos/messenger-pad';
import {
  SET_LAYOUT,
  AppKitProvider,
  DefaultRouter,
  Registration,
  RequireWallet,
  SystemRoutes,
  Theme,
  ClientInitializer
} from '@dxos/react-appkit';

import App from './App';
// import Grid from './Grid';
import Home from './Home';

const initialState = {
  [SET_LAYOUT]: {
    showSidebar: false,
    showDebug: false
  }
};

const pads = [
  GamePad,
  ChessPad
  // MessengerPad
];

const Root = ({ clientConfig }) => {
  const publicUrl = window.location.pathname;

  const router = { ...DefaultRouter, publicUrl };
  const { routes } = router;

  const themeBase = {
    palette: {
      primary
    }
  };

  const preInit = (client) => {
    pads.forEach(pad => pad.register?.(client));
  };

  return (
    <Theme base={themeBase}>
      <ClientInitializer config={clientConfig} preInitialize={preInit}>
        <AppKitProvider
          initialState={initialState}
          errorHandler={new ErrorHandler()}
          router={router}
          pads={pads}
          issuesLink='https://github.com/dxos/arena/issues/new'
        >
            <HashRouter>
              <Switch>
                <Route exact path={routes.register} component={Registration} />
                <RequireWallet
                  redirect={routes.register}
                  // Allow access to the AUTH route if it is for joining an Identity, otherwise require a Wallet.
                  isRequired={(path = '', query = {}) => !path.startsWith(routes.auth) || !query.identityKey}
                >
                  <Switch>
                    {SystemRoutes(router)}
                    {/* <Route exact path="/grid/:topic" component={Grid} /> */}
                    <Route exact path="/app/:topic?"><Redirect to="/home" /></Route>
                    <Route exact path={routes.app} component={App} />
                    <Route exact path="/home" component={Home} />
                    <Redirect to="/home" />
                  </Switch>
                </RequireWallet>
              </Switch>
            </HashRouter>
        </AppKitProvider>
      </ClientInitializer>
    </Theme>
  );
};

export default Root;
