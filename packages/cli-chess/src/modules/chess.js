//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import Chance from 'chance';
import set from 'lodash.set';

import { TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT, ChessModel } from '@dxos/chess-core';
import { print, asyncHandler } from '@dxos/cli-core';
import { keyToString, keyToBuffer } from '@dxos/crypto';
import { log } from '@dxos/debug';

const chance = new Chance();

// TODO(egorgripasov): Factor out.
const sorter = (a, b) => (a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : a.isMe ? -1 : 1);

const getGameUpdateHandler = (members) => {
  return item => {
    const model = item.model.model;
    if (model.orderedMessages.length > 0) {
      log(`\n${model.game.ascii()}`);

      const nextMovePublicKey = model.game.turn() === 'w' ? model.whitePubKey : model.blackPubKey;
      if (nextMovePublicKey) {
        const nextMove = members.find(member => member.publicKey.equals(nextMovePublicKey)).displayName;
        log(`Next move: \x1b[1m${nextMove}\x1b[0m`);
      }
      return true;
    }
  };
};

export const ChessModule = ({ getClient, stateManager, getReadlineInterface, chessModel }) => ({
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

        const members = party.queryMembers().value.sort(sorter);

        const result = party.database.queryItems({ type: TYPE_CHESS_GAME });
        const games = result.value.map(item => {
          const game = {
            id: item.id
          };

          set(game, json ? 'white.displayName' : 'white', members.find(member => item.model.model.whitePubKey.equals(member.publicKey))?.displayName);
          set(game, json ? 'black.displayName' : 'black', members.find(member => item.model.model.blackPubKey.equals(member.publicKey))?.displayName);

          if (json) {
            set(game, 'white.publicKey', keyToString(item.model.model.whitePubKey));
            set(game, 'black.publicKey', keyToString(item.model.model.blackPubKey));
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
        const { title: gameTitle } = argv;

        const party = stateManager.party;
        assert(party, 'Invalid party.');

        const client = await getClient();

        const members = party.queryMembers().value.sort(sorter);

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

        const title = !gameTitle ? `item-${chance.word()}` : gameTitle;

        log(`Game \x1b[1m${title}\x1b[0m.`);
        log(`\x1b[1m${white.displayName}\x1b[0m selected to play white.`);
        log(`\x1b[1m${black.displayName}\x1b[0m selected to play black.\n`);

        const game = await party.database.createItem({
          type: TYPE_CHESS_GAME,
          model: chessModel,
          displayName: title
        });

        game.model.model.appendMessage({
          __type_url: TYPE_CHESS_PLAYERSELECT,
          ...ChessModel.createGenesisMessage(title, white.publicKey, black.publicKey)
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
        const members = party.queryMembers().value.sort(sorter);

        assert(game, 'Invalid game.');
        await stateManager.setItem(game, getGameUpdateHandler(members));

        getGameUpdateHandler(members)(game);
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

        const game = stateManager.item;
        assert(game, 'Invalid game.');

        game.model.model.makeMove({ from, to });
      })
    })
});
