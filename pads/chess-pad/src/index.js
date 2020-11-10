//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { ChessModel, CHESS_PAD, CHESS_TYPE_CONTENT } from '@dxos/chess-model';
import { MessengerModel, MESSENGER_TYPE_MESSAGE } from '@dxos/messenger-model';
import { ObjectModel } from '@dxos/object-model';

import ChessSettingsDialog from './containers/ChessSettingsDialog';
import Game from './containers/Game';
import KingWhite from './icons/KingWhite';

export default {
  name: 'example.com/chess',
  displayName: 'Chess',
  type: CHESS_PAD,
  contentType: CHESS_TYPE_CONTENT,
  icon: KingWhite,
  main: Game,
  settings: ChessSettingsDialog,
  register: async (client) => {
    await client.registerModel(ChessModel);
  },
  create: async ({ client, party }, { name }, metadata) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: CHESS_PAD,
      props: { title: name || 'untitled' }
    });

    assert(metadata.selection, 'Attempted to create chess pad without selecting players');

    await party.database.createItem({
      model: ChessModel,
      type: CHESS_TYPE_CONTENT,
      parent: item.id,
      props: { ...metadata.selection }
    });

    await party.database.createItem({
      model: MessengerModel,
      type: MESSENGER_TYPE_MESSAGE,
      parent: item.id
    });

    return item;
  }
};
