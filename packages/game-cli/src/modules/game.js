//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';
import Chance from 'chance';

import { asyncHandler } from '@dxos/async';
import { log } from '@dxos/debug';
import { GameModel } from '@wirelineio/game-model';
import { DefaultModel } from '@dxos/data-client';

const MODEL_TYPE_GAME = 'testing.game.Game';
const MODEL_TYPE_MOVE = 'testing.game.Move';

const chance = new Chance();

const generateRandom = () => chance.sentence({ words: 1 });

const gameUpdateHandler = model => {
  const { game } = model.state;
  log(`\n\n${game.ascii()}\n`);
  if (game.isOver()) {
    log(`Game over. Result: ${game.result()}\n`);
  }
};

export const GameModule = ({ getClient, stateManager }) => ({
  command: ['$0', 'game'],
  describe: 'Game CLI.',
  builder: yargs => yargs

    .command({
      command: ['list'],
      describe: 'List games.',
      builder: yargs => yargs,

      handler: asyncHandler(async () => {
        const topic = stateManager.currentParty;
        assert(topic, 'Invalid party.');

        const client = await getClient();
        const model = await client.modelFactory.createModel(DefaultModel, { type: MODEL_TYPE_GAME, topic });
        await stateManager.setModel(model, MODEL_TYPE_GAME);
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

        const gameId = Date.now();

        const client = await getClient();
        const model = await client.modelFactory.createModel(DefaultModel, { type: MODEL_TYPE_GAME, topic });
        model.appendMessage({
          __type_url: MODEL_TYPE_GAME,
          gameId,
          title
        });

        const gameModel = await client.modelFactory.createModel(GameModel, { type: MODEL_TYPE_MOVE, topic, gameId });
        await stateManager.setModel(gameModel, MODEL_TYPE_MOVE, gameUpdateHandler);

        return JSON.stringify({ gameId });
      })
    })

    .command({
      command: ['join <game-id>'],
      describe: 'Join game.',
      builder: yargs => yargs
        .option('game-id'),

      handler: asyncHandler(async argv => {
        const { gameId } = argv;

        const topic = stateManager.currentParty;
        assert(topic, 'Invalid party.');

        const client = await getClient();
        const gameModel = await client.modelFactory.createModel(GameModel, { type: MODEL_TYPE_MOVE, topic, gameId });
        await stateManager.setModel(gameModel, MODEL_TYPE_MOVE, gameUpdateHandler);

        return JSON.stringify({ gameId });
      })
    })

    .command({
      command: ['move <position> <piece>'],
      describe: 'Move piece.',
      builder: yargs => yargs
        .option('position', { type: 'string' })
        .option('piece', { type: 'number' }),

      handler: asyncHandler(async argv => {
        const { position, piece } = argv;

        const gameModel = stateManager.model;
        assert(gameModel, 'Invalid game.');

        const move = gameModel.state.game.move + 1;
        gameModel.appendMessage({
          __type_url: MODEL_TYPE_MOVE,
          position,
          piece,
          move
        });
      })
    })
});
