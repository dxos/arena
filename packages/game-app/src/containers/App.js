//
// Copyright 2018 Wireline, Inc.
//

import React, { useEffect } from 'react';
import { useParams, Switch, Route } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { AppContainer, usePads } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';

import Sidebar from './Sidebar';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflow: 'auto'
  },

  titleRoot: {
    color: theme.palette.primary.contrastText
  }
}));

const App = () => {
  const classes = useStyles();
  const { topic } = useParams();
  const client = useClient();
  const [pads] = usePads();

  // TODO(burdon): Create hook.
  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [client, topic]);

  return (
    <AppContainer
      sidebarContent={<Sidebar topic={topic} />}
    >
      <div className={classes.main}>
        <Switch>
          {
            pads.map(({ main: Main, name }) => (
              <Route
                key={name}
                path={`/app/:topic/${name}/:itemId`}
                component={({ match: { params: { itemId } } }) => <Main topic={topic} itemId={itemId} />}
              />
            ))
          }
        </Switch>
      </div>
    </AppContainer>
  );
};

export default App;
