//
// Copyright 2020 DXOS.org
//

import { getConfig } from '@dxos/botkit';

import { GameBot } from './bot';

new GameBot(getConfig()).start();
