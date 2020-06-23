//
// Copyright 2020 Wireline, Inc.
//

import { Bot } from '@dxos/botkit';
import { GameModel } from '@dxos/game-model';

const MODEL_TYPE_MOVE = 'testing.game.Move';

class ExtendedGameModel extends GameModel {
  processMessages(messages) {
    messages
      .sort((a, b) => a.data.move - b.data.move)
      .forEach(message => {
        const { data: { __type_url, position, piece, move } } = message; // eslint-disable-line camelcase
        if (__type_url === MODEL_TYPE_MOVE) { // eslint-disable-line camelcase
          this._game.set(position, piece, move);
        }
      });

    const lastMoveOrigin = messages[messages.length - 1].key;

    this.emit('update', this, { lastMoveOrigin });
  }
}

/**
 * Game bot.
 */
export class GameBot extends Bot {

  /**
   * @constructor
   * @param {Object} config
   */
  constructor(config) {
    super(ExtendedGameModel, config, { readStreamOptions: { feedLevelIndexInfo: true } });
  }

  async start() {
    await super.start();

    this._feed = this._client.feedStore.getDescriptors().find(descriptor => descriptor.path === `/topic/${this._topic}/writable`);
  }

  // eslint-disable-next-line class-methods-use-this
  async onModelUpdate(model, metadata) {
    const { state: { game } } = model;
    const { lastMoveOrigin } = metadata;

    console.log(`\n\n${game.ascii()}\n`);

    if (game.isOver()) {
      console.log(`Game over. Result: ${game.result()}`);
      return;
    }

    // Ignore messages from the bot.
    if (this._feed.key.equals(lastMoveOrigin)) {
      return;
    }

    // Play a random move.
    const moves = game.moves();
    if (moves.length) {
      const { position, piece } = moves[Math.floor(Math.random() * moves.length)];
      const move = game.move + 1;

      // TODO(ashwin): Currently, messages are echoed back to the bot. Causes it to keep playing moves until game completion.
      model.appendMessage({
        __type_url: MODEL_TYPE_MOVE,
        position,
        piece,
        move
      });
    }
  }
}
