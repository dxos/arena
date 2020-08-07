//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { TYPE_CHESS_GAME, TYPE_CHESS_MOVE, TYPE_CHESS_PLAYERSELECT, ChessModel } from '@dxos/chess-core';
import { keyToString } from '@dxos/crypto';
import { ItemSettings } from '@dxos/react-appkit';
import { useModel } from '@dxos/react-client';

import ChessSettings from '../components/ChessSettings';
import KingWhite from '../icons/KingWhite';

const useStyles = makeStyles(theme => ({
  settingsItem: {
    marginTop: theme.spacing(2)
  }
}));

const ChessSettingsDialog = ({ party, topic, open, onClose, onCancel, item, viewModel, chessGameModel }) => {
  const [{ white, black }, setPlayers] = useState({});

  // TODO(rzadp) this is hacky. gameModel is created because chessGameModel is only available in App, not when creating the item
  const gameModel = useModel({
    model: ChessModel,
    options: {
      type: [TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT],
      topic
    }
  });

  // TODO(rzadp) and this shouldn't be needed once we have the genesis in the viewModel
  useEffect(() => {
    if (!item) return;
    assert(chessGameModel);
    assert(chessGameModel.whitePubKey);
    assert(chessGameModel.blackPubKey);
    setPlayers({
      white: party.members.find(m => keyToString(m.publicKey) === keyToString(chessGameModel.whitePubKey)),
      black: party.members.find(m => keyToString(m.publicKey) === keyToString(chessGameModel.blackPubKey))
    });
  }, [chessGameModel, item]);

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
      <ChessSettings playerSelectDisabled={!!item} party={party} white={white} black={black} setPlayers={setPlayers} />
    </ItemSettings>
  );
};

export default ChessSettingsDialog;
