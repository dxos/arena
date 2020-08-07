//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { noop } from '@dxos/async';
import { TYPE_CHESS_GAME, TYPE_CHESS_MOVE, TYPE_CHESS_PLAYERSELECT, ChessModel } from '@dxos/chess-core';
import { keyToBuffer } from '@dxos/crypto';
import {
  AppContainer,
  DefaultViewList,
  usePads,
  useAppRouter,
  useViews,
  DefaultSettingsDialog
} from '@dxos/react-appkit';
import { useClient, useParty, useModel } from '@dxos/react-client';

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

const App = () => {
  const party = useParty();
  const router = useAppRouter();
  const classes = useStyles();
  const { topic, item: viewId } = useParams();
  const [pads] = usePads();
  const { model } = useViews(topic);
  const item = model.getById(viewId);
  const client = useClient();
  const [viewSettingsOpen, setViewSettingsOpen] = useState(false);

  const pad = item ? pads.find(pad => pad.type === item.type) : undefined;

  // TODO(burdon): Create hook.
  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [topic]);

  const chessGameModel = useModel({
    model: ChessModel,
    options: {
      type: [TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT],
      topic,
      itemId: viewId
    }
  });

  if (!model || !item || !pad) {
    return null;
  }

  const Settings = (pad.settings) ? pad.settings : DefaultSettingsDialog;

  if (pad.type === TYPE_CHESS_GAME) {
    if (!chessGameModel || !chessGameModel.isInitialized) {
      return null;
    }
  }

  return (
    <>
      <AppContainer
        sidebarContent={<DefaultViewList />}
        onSettingsOpened={() => setViewSettingsOpen(true)}
        onHomeNavigation={() => router.push({ path: '/home' })}
        onPartyHomeNavigation={() => router.push({ path: '/grid', topic })}
      >
        <div className={classes.main}>
          {pad && (
            <pad.main
              party={party}
              topic={topic}
              viewId={viewId}
            />
          )}
        </div>
      </AppContainer>
      <Settings
        party={party}
        topic={topic}
        open={viewSettingsOpen}
        onClose={() => setViewSettingsOpen(false)}
        onCancel={() => setViewSettingsOpen(false)}
        item={item}
        viewModel={model}
        Icon={pad && pad.icon}
        chessGameModel={chessGameModel}
      />
    </>
  );
};

export default App;
