//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import set from 'lodash.set';

import { ChessModel, CHESS_TYPE_CONTENT, CHESS_PAD } from '@dxos/chess-model';
import { print, asyncHandler } from '@dxos/cli-core';
import { keyToString, keyToBuffer, PublicKey } from '@dxos/crypto';
import { log } from '@dxos/debug';
import { ObjectModel } from '@dxos/object-model';

import { memberSorter } from '../utils';

const getGameUpdateHandler = (members) => {
  return item => {
    const chessModel = item.model;
    log(`\n${chessModel.game.ascii()}`);

    const nextMovePublicKey = chessModel.game.turn() === 'w' ? chessModel.whitePubKey : chessModel.blackPubKey;
    if (nextMovePublicKey) {
      const nextMove = members.find(member => PublicKey.equals(member.publicKey, nextMovePublicKey)).displayName;
      log(`Next move: \x1b[1m${nextMove}\x1b[0m`);
    }
    return true;
  };
};

export const ChessModule = ({ getClient, stateManager, getReadlineInterface }) => ({
  command: ['$0', 'chess'],
  describe: 'Chess CLI.',
  builder: yargs => yargs

    .command({
      command: ['list'],
      describe: 'List games.',
      builder: yargs => yargs,

      handler: asyncHandler(async argv => {
        const { json } = argv;

        const party = stateManager.party;
        assert(party, 'Invalid party.');

        const members = party.queryMembers().value.sort(memberSorter);

        const result = party.database.queryItems({ type: CHESS_TYPE_CONTENT });
        const games = result.value.map(item => {
          const game = {
            id: item.id
          };

          set(game, json ? 'white.displayName' : 'white', members.find(member => PublicKey.equals(item.model.whitePubKey, member.publicKey))?.displayName);
          set(game, json ? 'black.displayName' : 'black', members.find(member => PublicKey.equals(item.model.blackPubKey, member.publicKey))?.displayName);

          if (json) {
            set(game, 'white.publicKey', keyToString(item.model.whitePubKey));
            set(game, 'black.publicKey', keyToString(item.model.blackPubKey));
          }

          return game;
        });

        print(games, { json });
      })
    })

    .command({
      command: ['create [title]'],
      describe: 'Create game.',
      builder: yargs => yargs
        .option('title')
        .option('count', { type: 'number' })
        .option('auto-assign', { type: 'boolean' })
        .option('demo', { type: 'boolean' }),

      handler: asyncHandler(async argv => {
        const { title } = argv;

        const party = stateManager.party;
        assert(party, 'Invalid party.');

        const client = await getClient();

        const members = party.queryMembers().value.sort(memberSorter);

        let membersStr = '\nParty members:\n';
        members.map((member, index) => {
          membersStr += `${index}) ${member.displayName}\n`;
        });
        log(`${membersStr}\n`);

        const rl = getReadlineInterface();
        const askUser = async (question) => {
          return new Promise(resolve => {
            rl.question(question, answer => {
              resolve(answer);
            });
          });
        };

        let white;
        let black;

        const self = {
          publicKey: keyToBuffer(client.getProfile().publicKey),
          displayName: 'Yourself'
        };

        if (members.length > 1) {
          white = members[
            Number(await askUser(`\nSelect white player (0 - ${members.length - 1}): `)) || 0
          ];
          black = members[
            Number(await askUser(`Select black player (0 - ${members.length - 1}): `)) || 0
          ];
        } else {
          white = self;
          black = self;
        }

        log(`Game \x1b[1m${title}\x1b[0m created.`);
        log(`\x1b[1m${white.displayName}\x1b[0m selected to play white.`);
        log(`\x1b[1m${black.displayName}\x1b[0m selected to play black.\n`);

        const padItem = await party.database.createItem({
          model: ObjectModel,
          type: CHESS_PAD,
          props: { title: title || 'untitled' }
        });

        const game = await party.database.createItem({
          model: ChessModel,
          type: CHESS_TYPE_CONTENT,
          parent: padItem.id,
          props: {
            whitePlayerPublicKey: keyToString(white.publicKey),
            blackPlayerPublicKey: keyToString(black.publicKey)
          }
        });

        await stateManager.setItem(game, getGameUpdateHandler(members));

        log(`Game ID: ${game.id}`);
      })
    })

    .command({
      command: ['join <itemId>'],
      describe: 'Join game.',
      builder: yargs => yargs
        .option('itemId'),

      handler: asyncHandler(async argv => {
        const { itemId } = argv;

        const party = stateManager.party;
        assert(party, 'Invalid party.');

        const game = party.database.getItem(itemId);
        const members = party.queryMembers().value.sort(memberSorter);

        assert(game, 'Invalid game.');
        await stateManager.setItem(game, getGameUpdateHandler(members));

        getGameUpdateHandler(members)(game);
      })
    })

    .command({
      command: ['move <from> <to>'],
      describe: 'Make a move.',
      builder: yargs => yargs
        .option('from', { type: 'string' })
        .option('to', { type: 'string' }),

      handler: asyncHandler(async argv => {
        const { from, to } = argv;

        const chessModel = stateManager.item;
        assert(chessModel, 'Invalid game.');

        chessModel.model.makeMove({ from, to, turn: chessModel.model.length });
      })
    })
});
