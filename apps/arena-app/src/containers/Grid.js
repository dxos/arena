//
// Copyright 2020 DXOS.org
//

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { noop } from '@dxos/async';
import ChessGrid from '@dxos/chess-pad/src/components/ChessGrid';
import { keyToBuffer } from '@dxos/crypto';
import { AppContainer, DefaultItemList, useAppRouter, useItems } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';

const Grid = () => {
  const router = useAppRouter();
  const { topic } = useParams();
  const { model } = useItems(topic);
  const client = useClient();

  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [topic]);

  return (
    <>
      <AppContainer
        sidebarContent={<DefaultItemList />}
        onHomeNavigation={() => router.push({ path: '/home' })}
      >
        <ChessGrid
          topic={topic}
          boards={
            model.getAllItems()
              .filter(item => !item.deleted && item.type === 'testing.chess.Game')
              .slice(0, 9)
          }
        />
      </AppContainer>
    </>
  );
};

export default Grid;
