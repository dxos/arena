//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Home } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { Game } from '@dxos/chess-pad';
import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { AppContainer, usePads, useAppRouter, DefaultViewSidebar, useViews, ViewSettingsDialog } from '@dxos/react-appkit';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },

  titleRoot: {
    color: theme.palette.primary.contrastText,
    display: 'inline-block',
    lineHeight: '48px'
  }
}));

const type = ''

const Grid = () => {
  const router = useAppRouter();
  const classes = useStyles();
  const { topic } = useParams();
  const [pads] = usePads();
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
        <List dense disablePadding>
          {model.getAllViews().map(item => (
            <ListItem
              key={item.viewId}
            >
              <ListItemText>
                <Game
                  topic={topic}
                  viewId={item.viewId}
                />
                {item.displayName}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </AppContainer>
    </>
  );
};

export default Grid;
