//
// Copyright 2020 DXOS.org
//

import { TYPE_CHESS_GAME } from '@dxos/chess-core';

import Game from './containers/Game';
import KingWhite from './icons/KingWhite';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/chess',
  displayName: 'Chess',

  icon: KingWhite,
  main: Game,
  type: TYPE_CHESS_GAME,
  description: 'Play chess',
  customViewSettings: true
};
