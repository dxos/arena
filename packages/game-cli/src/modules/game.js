//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import Chance from 'chance';

import { asyncHandler } from '@dxos/cli-core';
import { createId } from '@dxos/crypto';
import { log } from '@dxos/debug';
import { GameModel, GAME_TYPE_GAME, GAME_TYPE_MOVE } from '@dxos/game-model';
import { ObjectModel } from '@dxos/object-model';

const chance = new Chance();

const generateRandom = () => chance.sentence({ words: 1 });

const gameUpdateHandler = gameModel => {
  const { game } = gameModel.model;
  log(`\n\n${game.ascii()}\n`);
  if (game.isOver()) {
    log(`Game over. Result: ${game.result()}\n`);
  }
};

export const GameModule = ({ stateManager }) => ({
  command: ['$0', 'game'],
  describe: 'Game CLI.',
  builder: yargs => yargs

    .command({
      command: ['list'],
      describe: 'List games.',
      builder: yargs => yargs,

      handler: asyncHandler(async () => {
        const party = stateManager.party;
        assert(party, 'Invalid party.');

        const result = party.database.queryItems({ type: GAME_TYPE_GAME });
        const games = result.value.map(record => ({ id: record.id, name: record.model.getProperty('title') || 'untitled' }));
        return JSON.stringify(games);
      })
    })

    .command({
      command: ['create [title]'],
      describe: 'Create game.',
      builder: yargs => yargs
        .option('title'),

      handler: asyncHandler(async argv => {
        const { title = generateRandom() } = argv;

        const party = stateManager.party;
        assert(party, 'Invalid party.');

        const createdTitle = title || 'untitled';
        const game = await party.database.createItem({
          type: GAME_TYPE_GAME,
          model: ObjectModel,
          props: { title: createdTitle }
        });

        await party.database.createItem({
          model: GameModel,
          type: GAME_TYPE_MOVE,
          parent: game.id
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

        const party = stateManager.party;
        assert(party, 'Invalid party.');

        const gameItem = party.database.getItem(gameId);
        assert(gameItem, 'Invalid game.');

        const gameModel = gameItem.children[0];
        assert(gameModel, 'Corrupted game model');

        await stateManager.setItem(gameModel, gameUpdateHandler);
        gameUpdateHandler(gameModel);

        return JSON.stringify({ gameId });
      })
    })

    .command({
      command: ['move <position> <piece>'],
      describe: 'Move piece.',
      builder: yargs => yargs
        .option('position', { type: 'string' })
        .option('piece', { type: 'string' }),

      handler: asyncHandler(async argv => {
        const { position, piece } = argv;

        const gameModel = stateManager.item;
        assert(gameModel, 'Invalid game.');

        const playedPiece = ['o', 'x'].includes(piece) ? ['o', 'x'].indexOf(piece) : parseInt(piece);

        assert(playedPiece === 0 || playedPiece === 1, 'Invalid piece played');

        const move = gameModel.model.game.move + 1;
        gameModel.model.move({
          id: createId(),
          position,
          piece: playedPiece,
          move
        });
      })
    })
});
