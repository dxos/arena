//
// Copyright 2020 Wireline, Inc.
//

import { getConfig } from '@dxos/botkit';

import { ChessBot } from './bot';

new ChessBot(getConfig()).start();
