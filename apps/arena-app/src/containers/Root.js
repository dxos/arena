//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import primary from '@material-ui/core/colors/deepOrange';
import { ThemeProvider } from '@material-ui/core/styles';

import ChessPad from '@dxos/chess-pad';
import { ErrorHandler } from '@dxos/debug';
import GamePad from '@dxos/game-pad';
import MessengerPad from '@dxos/messenger-pad';
import {
  SET_LAYOUT,
  AppKitContextProvider,
  CheckForErrors,
  DefaultRouter,
  Registration,
  RequireWallet,
  SystemRoutes,
  createTheme
} from '@dxos/react-appkit';
import { ClientProvider } from '@dxos/react-client';

import App from './App';
import Grid from './Grid';
import Home from './Home';

const initialState = {
  [SET_LAYOUT]: {
    showSidebar: false,
    showDebug: false
  }
};

const pads = [
  GamePad,
  ChessPad,
  MessengerPad
];

const theme = {
  props: {
    MuiAppBar: {
      elevation: 0
    }
  },

  palette: {
    primary
  }
};

const Root = ({ config, client }) => {
  const { app: { publicUrl } } = config;

  const router = { ...DefaultRouter, publicUrl };
  const { routes } = router;

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <CssBaseline />
      <ClientProvider client={client} config={config}>
        <AppKitContextProvider
          initialState={initialState}
          errorHandler={new ErrorHandler()}
          router={router}
          pads={pads}
          issuesLink='https://github.com/dxos/arena/issues/new'
        >
          <CheckForErrors>
            <HashRouter>
              <Switch>
                <Route exact path={routes.register} component={Registration} />
                <RequireWallet redirect={routes.register}>
                  <Switch>
                    {SystemRoutes(router)}
                    <Route exact path="/grid/:topic" component={Grid} />
                    <Route exact path="/app/:topic?"><Redirect to="/home" /></Route>
                    <Route exact path={routes.app} component={App} />

                    <Route exact path="/home" component={Home} />
                    <Redirect to="/home" />
                  </Switch>
                </RequireWallet>
              </Switch>
            </HashRouter>
          </CheckForErrors>
        </AppKitContextProvider>
      </ClientProvider>
    </ThemeProvider>
  );
};

export default Root;
