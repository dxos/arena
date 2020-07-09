//
// Copyright 2020 DXOS.org
//

import { getConfig } from '@dxos/botkit';

import { ChessBot } from './bot';

new ChessBot(getConfig()).start();
