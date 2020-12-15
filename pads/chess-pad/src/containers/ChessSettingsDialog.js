//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import React, { useState } from 'react';

import { PublicKey } from '@dxos/crypto';
import { ItemSettings } from '@dxos/react-appkit';
import { useParty } from '@dxos/react-client';

import ChessSettings from '../components/ChessSettings';
import KingWhite from '../icons/KingWhite';

const ChessSettingsDialog = ({ topic, open, onClose, onCancel, item }) => {
  const [{ white, black }, setPlayers] = useState({});
  const party = useParty(PublicKey.from(topic).asUint8Array());

  const handleClose = ({ name }) => {
    assert(white);
    assert(black);

    const metadata = {
      selection: {
        whitePlayerPublicKey: white.publicKey.toHex(),
        blackPlayerPublicKey: black.publicKey.toHex()
      }
    };
    onClose({ name }, metadata);
  };

  return (
    <ItemSettings
      open={open}
      onClose={handleClose}
      onCancel={onCancel}
      item={item}
      closingDisabled={!item && (!white || !black)} // User has to select players, unless the game already exists
      icon={<KingWhite />}
    >
      <ChessSettings playerSelectDisabled={!!item} party={party} white={white} black={black} setPlayers={setPlayers} />
    </ItemSettings>
  );
};

export default ChessSettingsDialog;
