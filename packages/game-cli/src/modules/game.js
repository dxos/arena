//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import Chance from 'chance';

import { asyncHandler } from '@dxos/cli-core';
import { log } from '@dxos/debug';
import { DefaultModel } from '@dxos/client';

import { ObjectModel } from '@dxos/object-model';
import { GameModel, GAME_PAD, GAME_TYPE_GAME, GAME_TYPE_MOVE } from '@dxos/game-model';

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

        const party = stateManager.party;
        const result = party.database.queryItems({ type: GAME_TYPE_GAME });
        const games = result.value.map(record => ({id: record.id, name: record.model.getProperty('title') || 'untitled'}))
        return JSON.stringify(games)
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
        const party = stateManager.party;

        const createdTitle = title || 'untitled'
        const game = await party.database.createItem({
          type: GAME_TYPE_GAME,
          model: ObjectModel,
          props: { title: createdTitle }
        });

        return JSON.stringify({ id: game.id, title: createdTitle });
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
        const gameModel = await client.modelFactory.createModel(GameModel, { type: GAME_TYPE_MOVE, topic, gameId });
        await stateManager.setModel(gameModel, gameUpdateHandler);

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
          __type_url: GAME_TYPE_MOVE,
          position,
          piece,
          move
        });
      })
    })
});
