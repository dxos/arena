//
// Copyright 2020 DXOS.org
//

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Home } from '@material-ui/icons';
import { Grid as GridUI, IconButton, Typography } from '@material-ui/core';

import { Game } from '@dxos/chess-pad';
import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { AppContainer, DefaultViewSidebar, useAppRouter, useViews } from '@dxos/react-appkit';

const useStyles = makeStyles(() => ({
  grid: {
    marginTop: 50,
    width: '80%',
    maxWidth: 1200
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridItemTitle: {
    marginTop: 10
  },
  container: {
    overflow: 'auto',
    overflowX: 'hidden',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));

const Grid = () => {
  const router = useAppRouter();
  const classes = useStyles();
  const { topic } = useParams();
  const { model } = useViews(topic);
  const client = useClient();

  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [topic]);

  const appBarContent = (<>
    <IconButton color="inherit">
      <Home onClick={() => router.push({ path: '/home' })} />
    </IconButton>
  </>);

  return (
    <>
      <AppContainer
        appBarContent={appBarContent}
        sidebarContent={<DefaultViewSidebar />}
      >
        <div className={classes.container}>
          <GridUI
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.grid}
          >
            {model.getAllViews().slice(0, 9).map(item => (
              <GridUI
                item
                key={item.viewId}
                className={classes.gridItem}
                md={4}
              >
                <Game
                  grid
                  topic={topic}
                  viewId={item.viewId}
                />
                <Typography className={classes.gridItemTitle}>{item.displayName}</Typography>
              </GridUI>
            ))}
          </GridUI>
        </div>
      </AppContainer>
    </>
  );
};

export default Grid;
