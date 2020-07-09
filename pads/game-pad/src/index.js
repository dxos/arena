//
// Copyright 2020 DXOS.org
//

import { Gamepad as GamepadIcon } from '@material-ui/icons';

import Main from './Main';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/tictactoe',
  displayName: 'TicTacToe Pad',

  icon: GamepadIcon,
  main: Main,
  type: 'testing.game.tictactoe'
};
