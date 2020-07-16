//
// Copyright 2020 DXOS.org
//

import { getConfig } from '@dxos/botkit';

import { StockfishBot } from './bot';

new StockfishBot(getConfig()).start();
