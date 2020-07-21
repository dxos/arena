//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import assert from 'assert';

import { makeStyles } from '@material-ui/core/styles';
import KingWhite from '../icons/KingWhite';

import { ItemSettings } from '@dxos/react-appkit';
import { useModel } from '@dxos/react-client';
import { TYPE_CHESS_GAME, TYPE_CHESS_MOVE, TYPE_CHESS_PLAYERSELECT, ChessModel } from '@dxos/chess-core';

import ChessSettings from '../components/ChessSettings';

const useStyles = makeStyles(theme => ({
  settingsItem: {
    marginTop: theme.spacing(2)
  }
}));

const ChessSettingsDialog = ({ party, topic, open, onClose, onCancel, item, viewModel }) => {
  const [{ white, black }, setPlayers] = useState({});

  const gameModel = useModel({
    model: ChessModel,
    options: {
      type: [TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT],
      topic
    }
  });

  const handleClose = ({ name }) => {
    assert(white);
    assert(black);

    const initializeGame = (viewId) => {
      gameModel.appendMessage({
        __type_url: TYPE_CHESS_PLAYERSELECT,
        itemId: viewId,
        ...ChessModel.createGenesisMessage('', white.publicKey, black.publicKey)
      });
    };

    if (item) {
      viewModel.renameView(item.viewId, name);
      initializeGame(item.viewId);
    }
    onClose({ name }, undefined, initializeGame);
  };

  return (
    <ItemSettings
      open={open}
      onClose={handleClose}
      onCancel={onCancel}
      item={item}
      closingDisabled={!white || !black}
      icon={<KingWhite />}
    >
      <ChessSettings party={party} white={white} black={black} setPlayers={setPlayers} />
    </ItemSettings>
  );
};

export default ChessSettingsDialog;
