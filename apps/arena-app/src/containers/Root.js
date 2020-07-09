//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import { ErrorHandler } from '@dxos/debug';
import {
  SET_LAYOUT,
  AppKitContextProvider,
  CheckForErrors,
  DefaultRouter,
  Registration,
  RequireWallet,
  SystemRoutes,
  Theme
} from '@dxos/react-appkit';
import { ClientContextProvider } from '@dxos/react-client';
import MessengerPad from '@dxos/messenger-pad';
import EditorPad from '@dxos/editor-pad';
import PlannerPad from '@dxos/planner-pad';
import CanvasApp from '@dxos/canvas-pad';
import TestingPad from '@dxos/testing-pad';

import App from './App';
import Home from './Home';

const initialState = {
  [SET_LAYOUT]: {
    showSidebar: false,
    showDebug: false
  }
};

const pads = [
  MessengerPad,
  EditorPad,
  PlannerPad,
  CanvasApp,
  TestingPad
];

const Root = ({ config }) => {
  const router = { ...DefaultRouter, publicUrl: config.app.publicUrl };
  const { routes } = router;

  return (
    <Theme>
      <ClientContextProvider config={config}>
        <AppKitContextProvider
          initialState={initialState}
          errorHandler={new ErrorHandler()}
          router={router}
          pads={pads}
        >
          <CheckForErrors>
            <HashRouter>
              <Switch>
                <Route exact path={routes.register} component={Registration} />
                <RequireWallet redirect={routes.register}>
                  <Switch>
                    {SystemRoutes(router)}
                    <Route exact path={routes.app} component={App} />
                    <Route exact path="/home" component={Home} />
                    <Redirect to="/home" />
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
