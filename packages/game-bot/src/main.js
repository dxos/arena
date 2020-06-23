//
// Copyright 2020 Wireline, Inc.
//

import { getConfig } from '@dxos/botkit';

import { GameBot } from './bot';

new GameBot(getConfig()).start();
