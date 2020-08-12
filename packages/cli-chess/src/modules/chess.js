//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import Chance from 'chance';
import defaultsDeep from 'lodash.defaultsdeep';

import { sleep } from '@dxos/async';
import { TYPE_CHESS_GAME, TYPE_CHESS_MOVE, TYPE_CHESS_PLAYERSELECT, ChessModel } from '@dxos/chess-core';
import { print, asyncHandler } from '@dxos/cli-core';
import { createId, keyToBuffer, keyToString } from '@dxos/crypto';
import { log } from '@dxos/debug';

const chance = new Chance();

const peekCustomItem = (arr, filter) => {
  const inputArr = filter ? arr.filter(filter) : arr;
  assert(inputArr.length, 'Unable to peek random item from empty list.');

  return inputArr[Math.floor(Math.random() * inputArr.length)];
};

// TODO(egorgripasov): Factor out.
const sorter = (a, b) => (a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : a.isMe ? -1 : 1);

const getGameUpdateHandler = (members) => {
  return (model) => {
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

const getGameListHandler = (getMembers, json) => {
  const games = new Map();
  return async model => {
    const members = await getMembers();
    for (const message of model.messages) {
      if (message.__type_url === TYPE_CHESS_GAME) {
        const { itemId: gameId, displayName } = message;
        if (!games.has(gameId)) {
          games.set(gameId, { gameId, title: displayName });
        }
      } else if (message.__type_url === TYPE_CHESS_PLAYERSELECT) {
        const { itemId: gameId, members: gameMembers, title } = message;
        const [{ publicKey: whitePubKey }, { publicKey: blackPubKey }] = gameMembers;

        const white = members.find(member => member.publicKey.equals(whitePubKey)).displayName;
        const black = members.find(member => member.publicKey.equals(blackPubKey)).displayName;

        const game = games.get(gameId) || {};
        defaultsDeep(game, { gameId, title, white: { publicKey: keyToString(whitePubKey), displayName: white }, black: { publicKey: keyToString(blackPubKey), displayName: black } });
        games.set(gameId, game);
      }
    }
    log('\n');
    print([...games.values()].map(game => json ? game : { gameId: game.gameId, title: game.title, white: game.white.displayName, black: game.black.displayName }), { json });
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

        const topic = stateManager.currentParty;
        assert(topic, 'Invalid party.');

        const client = await getClient();

        const getMembers = async () => {
          const { members } = client.partyManager.getPartyInfo(keyToBuffer(topic));
          return members;
        };
        const model = await client.modelFactory.createModel(undefined, { type: [TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT], topic });
        await stateManager.setModel(model, getGameListHandler(getMembers, json));
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
        const { title: gameTitle, json, count = 1, autoAssign, demo } = argv;

        const topic = stateManager.currentParty;
        assert(topic, 'Invalid party.');

        const client = await getClient();

        const party = client.partyManager.getPartyInfo(keyToBuffer(topic));
        const members = party.members.sort(sorter);

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

        const games = [];
        for (let counter = 0; counter < count; counter++) {
          // TODO(egorgripasov): For demo purpose only, remove.
          if (counter > 0 && demo) {
            await sleep(300);
          }

          const itemId = createId();

          let white;
          let black;
          if (autoAssign) {
            // TODO(egorgripasov): For demo purpose only, remove.
            const filter = demo ? item => item.displayName.startsWith('bot:') : undefined;
            white = peekCustomItem(members, filter);
            black = peekCustomItem(members, filter);
          } else {
            const self = client.partyManager.identityManager;
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
          }

          const title = !gameTitle ? `item-${chance.word()}` : gameTitle;

          log(`Game \x1b[1m${title}\x1b[0m.`);
          log(`\x1b[1m${white.displayName}\x1b[0m selected to play white.`);
          log(`\x1b[1m${black.displayName}\x1b[0m selected to play black.\n`);

          const model = await client.modelFactory.createModel(undefined, { type: TYPE_CHESS_GAME, topic });
          model.appendMessage({
            __type_url: TYPE_CHESS_GAME,
            itemId,
            displayName: title
          });

          const gameModel = await client.modelFactory.createModel(ChessModel, { type: [TYPE_CHESS_MOVE, TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT], topic, itemId });
          gameModel.appendMessage({ __type_url: TYPE_CHESS_PLAYERSELECT, itemId, ...ChessModel.createGenesisMessage(title, white.publicKey, black.publicKey) });
          if (count === 1) {
            await stateManager.setModel(gameModel, getGameUpdateHandler(members));
          }
          games.push({ gameId: itemId, title });
        }

        print(games, { json });
      })
    })

    .command({
      command: ['join <itemId>'],
      describe: 'Join game.',
      builder: yargs => yargs
        .option('itemId'),

      handler: asyncHandler(async argv => {
        const { itemId, json } = argv;

        const topic = stateManager.currentParty;
        assert(topic, 'Invalid party.');

        const client = await getClient();
        const gameModel = await client.modelFactory.createModel(ChessModel, { type: [TYPE_CHESS_MOVE, TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT], topic, itemId });

        const { members } = client.partyManager.getPartyInfo(keyToBuffer(topic));

        await stateManager.setModel(gameModel, getGameUpdateHandler(members));

        print({ gameId: itemId }, { json });
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
