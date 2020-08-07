//
// Copyright 2020 DXOS.org
//

import Queue from 'better-queue';
import MemoryStore from 'better-queue-memory';
import { spawn } from 'child_process';

const MAX_MOVE_TIME = 250;
const MAX_RETRIES = 3;

/**
 * Base class for Stockfish worker.
 */
class StockfishWorker {
  /**
   * Callback for command result delivery.
   * @type {Function}
   */
  _callback = null;

  /**
   * @constructor
   * @param {Number} maxMoveTime - Max allowed time for move calculation.
   * @param {Number} maxRetries - Max number of retries.
   */
  constructor (maxMoveTime = MAX_MOVE_TIME, maxRetries = MAX_RETRIES) {
    this._maxMoveTime = maxMoveTime;
    this._moveTimeout = maxMoveTime * 10;
    this._maxRetries = maxRetries;

    const store = new MemoryStore();

    this._queue = new Queue(({ fen }, cb) => {
      this.processRequest(`position fen "${fen}"`, `go movetime ${this._maxMoveTime}`);
      this._callback = cb;
    }, {
      store,
      maxTimeout: this._moveTimeout,
      maxRetries: this._maxRetries,
      precondition: cb => { cb(null, this._initialized); }
    });

    this._queue.on('task_failed', () => {
      this._callback = null;
      this._initialized = false;
      this.init();
    });

    this._queue.on('task_finish', () => {
      this._callback = null;
    });

    this._initialized = false;
  }

  /**
   * Create a valid move.
   * @param {String} fen - game state.
   * @return {Promise<{object}>}
   */
  async makeMove (fen) {
    return new Promise((resolve, reject) => {
      this._queue.push({ fen }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * (Re)Init worker process.
   */
  init () {}

  /**
   * @param {...String} commands - Commands to process.
   */
  // eslint-disable-next-line no-unused-vars
  async processRequest (...commands) {}

  /**
   * Process response from a worker.
   * @param {String} res Response string.
   */
  processResponse (res) {
    const match = res.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
    if (match) {
      this._callback(null, { from: match[1], to: match[2], promotion: match[3] });
    }
  }
}

/**
 * Node.js version of Stockfish Worker.
 */
export class NodeWorker extends StockfishWorker {
  init () {
    if (this._engine) {
      this._engine.stdin.pause();
      this._engine.kill();
    }

    this._engine = spawn('node', [process.cwd() + '/src/stockfish.js'], { env: { ...process.env, NODE_OPTIONS: '' } });

    this._engine.stdout.on('data', (data) => {
      this.processResponse(data.toString());
    });

    this._engine.stderr.on('data', (data) => {
      this._callback(new Error(data.toString()));
    });

    this._initialized = true;
  }

  processRequest (...commands) {
    commands.map(command => {
      this._engine.stdin.write(command + '\n');
    });
  }
}

/**
 * Browser version of Stockfish Worker.
 */
export class BrowserWorker extends StockfishWorker {
  init () {
    if (this._engine) {
      this._engine.terminate();
    }

    const workerPath = `${process.env.STOCKFISH_WORKER_PATH || ''}/stockfish.js`;
    // eslint-disable-next-line no-undef
    this._engine = new Worker(workerPath);

    this._engine.onmessage = (event) => {
      this.processResponse(event.data.toString());
    };

    this._initialized = true;
  }

  processRequest (...commands) {
    commands.map((command) => {
      this._engine.postMessage(command + '\n');
    });
  }
}
