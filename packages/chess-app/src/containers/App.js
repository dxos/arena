//
// Copyright 2020 Wireline, Inc.
//

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { AppContainer, useOnFirstRender } from '@dxos/react-appkit';
import { EditableText } from '@dxos/react-ux';
import metrics from '@dxos/metrics';

import { useItem } from '../model';
import Game from './Game';
import Sidebar from './Sidebar';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },

  titleRoot: {
    color: theme.palette.primary.contrastText
  }
}));

const App = () => {
  const classes = useStyles();
  const { topic, item: channelId } = useParams();
  const [channel, updateChannel] = useItem(topic, channelId);
  const client = useClient();

  useOnFirstRender(() => metrics.event('chess.App.mounted'));

  // TODO(burdon): Create hook.
  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [topic]);

  return (
    <AppContainer
      appBarContent={channel && (
        <EditableText
          value={channel.title}
          variant="h6"
          classes={{ root: classes.titleRoot }}
          onUpdate={title => updateChannel({ title })}
        />
      )}
      sidebarContent={<Sidebar topic={topic} />}
    >
      <div className={classes.main}>
        {channelId && <Game />}
      </div>
    </AppContainer>
  );
};

export default App;
