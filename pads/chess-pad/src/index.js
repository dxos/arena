//
// Copyright 2020 DXOS.org
//

import { ChessModel, TYPE_CHESS_GAME, TYPE_CHESS_MOVE } from '@dxos/chess-model';
import { createModelAdapter } from '@dxos/model-adapter';
import { ObjectModel } from '@dxos/object-model';

import ChessSettingsDialog from './containers/ChessSettingsDialog';
import Game from './containers/Game';
import KingWhite from './icons/KingWhite';

const adaptedModel = createModelAdapter(TYPE_CHESS_GAME, ChessModel);

export default {
  name: 'example.com/chess',
  displayName: 'Chess',
  type: TYPE_CHESS_GAME,
  contentType: TYPE_CHESS_MOVE,
  icon: KingWhite,
  main: Game,
  settings: ChessSettingsDialog,
  register: async (client) => {
    await client.registerModel(adaptedModel);
  },
  create: async ({ client, party }, { name }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: TYPE_CHESS_GAME,
      props: { title: name || 'untitled' }
    });

    await party.database.createItem({
      model: adaptedModel,
      type: TYPE_CHESS_MOVE,
      parent: item.id
    });

    return item;
  }
};
