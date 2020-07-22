//
// Copyright 2020 DXOS.org
//

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Home } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import { AppContainer, DefaultViewSidebar, useAppRouter, useViews } from '@dxos/react-appkit';
import ChessGrid from '@dxos/chess-pad/src/components/ChessGrid';

const Grid = () => {
  const router = useAppRouter();
  const { topic } = useParams();
  const { model } = useViews(topic);
  const client = useClient();

  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [topic]);

  const appBarContent = (<>
    <IconButton color="inherit" onClick={() => router.push({ path: '/home' })}>
      <Home />
    </IconButton>
  </>);

  return (
    <>
      <AppContainer
        appBarContent={appBarContent}
        sidebarContent={<DefaultViewSidebar />}
      >
        <ChessGrid
          topic={topic}
          boards={
            model.getAllViews()
            .slice(0, 9)
            .filter(item => !item.deleted && item.type === 'testing.chess.Game')}
        />
      </AppContainer>
    </>
  );
};

export default Grid;
