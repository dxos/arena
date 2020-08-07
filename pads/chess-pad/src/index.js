//
// Copyright 2020 DXOS.org
//

import { TYPE_CHESS_GAME } from '@dxos/chess-core';

import ChessSettingsDialog from './containers/ChessSettingsDialog';
import Game from './containers/Game';
import KingWhite from './icons/KingWhite';

export Game from './containers/Game';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/chess',
  displayName: 'Chess',
  description: 'Chess',
  type: TYPE_CHESS_GAME,

  icon: KingWhite,
  main: Game,
  settings: ChessSettingsDialog
};
