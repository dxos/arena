//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import Chance from 'chance';

import { asyncHandler } from '@dxos/async';
import { DefaultModel } from '@dxos/data-client';
import { log } from '@dxos/debug';
// eslint-disable-next-line no-unused-vars
import { TYPE_CHESS_GAME, TYPE_CHESS_MOVE, ChessModel } from '@dxos/chess-core';

const chance = new Chance();
const generateRandom = () => chance.sentence({ words: 1 });

// eslint-disable-next-line no-unused-vars
const gameUpdateHandler = model => {
  log(`\n${model.game.ascii()}`);
  log(`Next move: ${model.game.turn()}`);
};

export const ChessModule = ({ getClient, stateManager }) => ({
  command: ['$0', 'chess'],
  describe: 'Chess CLI.',
  builder: yargs => yargs

    .command({
      command: ['list'],
      describe: 'List games.',
      builder: yargs => yargs,

      handler: asyncHandler(async () => {
        const topic = stateManager.currentParty;
        assert(topic, 'Invalid party.');

        const client = await getClient();
        const model = await client.modelFactory.createModel(DefaultModel, { type: TYPE_CHESS_GAME, topic });
        await stateManager.setModel(model, TYPE_CHESS_GAME);
      })
    })

    .command({
      command: ['create [title]'],
      describe: 'Create game.',
      builder: yargs => yargs
        .option('title'),

      handler: asyncHandler(async argv => {
        const { title = generateRandom() } = argv;

        const topic = stateManager.currentParty;
        assert(topic, 'Invalid party.');

        const id = Date.now().toString();

        const client = await getClient();
        const model = await client.modelFactory.createModel(DefaultModel, { type: TYPE_CHESS_GAME, topic });
        model.appendMessage({
          __type_url: TYPE_CHESS_GAME,
          id,
          title
        });

        const gameModel = await client.modelFactory.createModel(ChessModel, { type: TYPE_CHESS_MOVE, topic, id });
        await stateManager.setModel(gameModel, TYPE_CHESS_MOVE, gameUpdateHandler);
        gameUpdateHandler(gameModel);
        return JSON.stringify({ id });
      })
    })

    .command({
      command: ['join <id>'],
      describe: 'Join game.',
      builder: yargs => yargs
        .option('id'),

      handler: asyncHandler(async argv => {
        const { id } = argv;

        const topic = stateManager.currentParty;
        assert(topic, 'Invalid party.');

        const client = await getClient();
        const gameModel = await client.modelFactory.createModel(ChessModel, { type: TYPE_CHESS_MOVE, topic, id });
        await stateManager.setModel(gameModel, TYPE_CHESS_MOVE, gameUpdateHandler);
        gameUpdateHandler(gameModel);

        return JSON.stringify({ id });
      })
    })

    .command({
      command: ['move <from> <to>'],
      describe: 'Create game.',
      builder: yargs => yargs
        .option('from', { type: 'string' })
        .option('to', { type: 'string' }),

      handler: asyncHandler(async argv => {
        const { from, to } = argv;

        const gameModel = stateManager.model;
        assert(gameModel instanceof ChessModel, 'Invalid game.');

        gameModel.makeMove({ from, to });
      })
    })

});
