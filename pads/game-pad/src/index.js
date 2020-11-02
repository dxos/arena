//
// Copyright 2020 DXOS.org
//

import { Gamepad as GamepadIcon } from '@material-ui/icons';

import { GameModel } from '@dxos/game-model';
import { ObjectModel } from '@dxos/object-model';

import Main from './Main';
import { GAME_PAD, GAME_TYPE_GAME, MESSENGER_TYPE_MOVE } from './model';

export default {
  name: GAME_PAD,
  type: GAME_TYPE_GAME,
  contentType: MESSENGER_TYPE_MOVE,
  displayName: 'TicTacToe',
  icon: GamepadIcon,
  main: Main,
  register: async (client) => {
    await client.registerModel(GameModel);
  },
  create: async ({ client, party }, { name }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: GAME_TYPE_GAME,
      props: { title: name || 'untitled' }
    });

    await party.database.createItem({
      model: GameModel,
      type: MESSENGER_TYPE_MOVE,
      parent: item.id
    });

    return item;
  }
};
