//
// Copyright 2020 DXOS.org
//

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

  return (
    <>
      <AppContainer
        sidebarContent={<DefaultViewSidebar />}
        onHomeNavigation={() => router.push({ path: '/home' })}
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
