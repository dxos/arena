//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { Chance } from 'chance';

import { ViewSettingsDialog } from '@dxos/react-appkit';
import { ChessModel, TYPE_CHESS_PLAYERSELECT } from '@dxos/chess-core';
import { useParty } from '@dxos/react-client';

import ChessSettings from '../components/ChessSettings';

const chance = new Chance();

// TODO(burdon): Remove: Instead configure ItemSettings with custom ChessSettings via pad descriptor.
const CustomSettingsDialog = ({ open, onClose, viewModel, gameModel, viewId, pads }) => {
  // TODO(burdon): Circular hooks (this is already required in ancestor so pass it in since you're passing in models).
  const party = useParty();

  // TODO(burdon): Implement onCreate callback from ViewSettingsDialog (return false if invalid).
  const handlePlayerSelect = (selection) => {
    if (!selection) {
      return;
    }

    // TODO(burdon): Auto generate title if not set (i.e., move all chance stuff to models).
    const title = `game-${chance.word()}`;
    gameModel.appendMessage({
      __type_url: TYPE_CHESS_PLAYERSELECT,
      viewId,
      // TODO(burdon): Pass white/black as properties.
      ...ChessModel.createGenesisMessage(title, selection.white, selection.black)
    });
  };

  // TODO(burdon): CustomViewSettingsDialog shold not wrap ViewSettingsDialog -- other way around!
  return (
    <ViewSettingsDialog
      open={open}
      onClose={onClose}
      viewModel={viewModel}
      pads={pads}
      viewId={viewId}
      closingDisabled={!gameModel.isInitialized}
    >
      <ChessSettings party={party} onSelected={handlePlayerSelect} />
    </ViewSettingsDialog>
  );
};

export default CustomSettingsDialog;
