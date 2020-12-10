//
// Copyright 2020 DXOS.org
//

import { Gamepad as GamepadIcon } from '@material-ui/icons';

import { GameModel, GAME_PAD, GAME_TYPE_GAME, GAME_TYPE_MOVE } from '@dxos/game-model';
import { ObjectModel } from '@dxos/object-model';

import Main from './Main';

export default {
  name: GAME_PAD,
  type: GAME_TYPE_GAME,
  contentType: GAME_TYPE_MOVE,
  displayName: 'TicTacToe',
  icon: GamepadIcon,
  main: Main,
  register: async (client) => {
    await client.registerModel(GameModel);
  },
  create: async ({ party }, { name }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: GAME_TYPE_GAME,
      props: { title: name || 'untitled' }
    });

    await party.database.createItem({
      model: GameModel,
      type: GAME_TYPE_MOVE,
      parent: item.id
    });

    return item;
  }
};
