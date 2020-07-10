//
// Copyright 2020 DXOS.org
//

import React, { useRef, useState } from 'react';
import Chessboard from 'chessboardjsx';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import { Button } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import IconButton from '@material-ui/core/IconButton';

import { truncateString } from '@dxos/debug';

import { PromotionSelect } from './PromotionSelect';

const useStyles = makeStyles(() => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gridTemplateRows: '1fr 200px',
    width: '100%'
  },

  board: {
    alignSelf: 'center'
  },

  details: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  caption: {
    fontSize: 21
  },

  swapButton: {
    marginBottom: 20
  },

  gameId: {
    fontFamily: 'monospace',
    fontSize: 'large'
  }
}));

const getCaption = game => {
  if (game.in_checkmate()) {
    return 'Checkmate';
  } if (game.in_draw()) {
    return 'Draw';
  } if (game.in_check()) {
    return 'Check';
  }
};

/**
 * Chess board wrapper.
 */
export default function ChessPad ({ gameId, game, makeMove, maxWidth, transitionDuration = 300 }) {
  const classes = useStyles();
  const board = useRef();
  const [orientation, setOrientation] = useState('white');
  const [promotionSelectCallback, setPromotionSelectCallback] = useState();

  const askForPromotion = () => new Promise(resolve => setPromotionSelectCallback(() => p => {
    setPromotionSelectCallback(undefined);
    resolve(p);
  }));

  async function handleDrop ({ sourceSquare, targetSquare }) {
    let promotion;
    const { type: piece } = game.get(sourceSquare);
    if ((targetSquare.endsWith('8') || targetSquare.endsWith('1')) && piece === 'p') {
      promotion = await askForPromotion();
      if (!promotion) {
        return;
      }
    }

    makeMove({ from: sourceSquare, to: targetSquare, promotion });
  }

  const calcWidth = () => {
    if (!board.current) { return 0; }
    const size = Math.min(board.current.offsetWidth, board.current.offsetHeight);
    return maxWidth ? Math.min(size, maxWidth) : size;
  };

  const caption = getCaption(game);

  // TODO(burdon): Fix flicker transition bug.
  return (
    <div className={classes.root}>
      <div ref={board} className={classes.board}>
        <Chessboard
          orientation={orientation}
          transitionDuration={transitionDuration}
          calcWidth={calcWidth}
          position={game && game.fen()}
          onDrop={handleDrop}
        />
      </div>
      <div className={classes.details}>
        <div className={classes.caption}>
          {caption || (game && game.turn() === 'w' ? 'White player\'s turn' : 'Black player\'s turn')}
        </div>

        <p>
          <span>Game ID: </span>
          <span className={classes.gameId}>
            {truncateString(gameId, 8)}
          </span>
          <CopyToClipboard text={gameId} onCopy={value => console.log(value)}>
            <IconButton
              color="inherit"
              aria-label="copy to clipboard"
              title="Copy to clipboard"
              edge="end"
            >
              <LinkIcon />
            </IconButton>
          </CopyToClipboard>
        </p>

        <Button
          className={classes.swapButton}
          variant="contained"
          size="small"
          color="primary"
          startIcon={<SwapVertIcon />}
          onClick={() => setOrientation(previous => (previous === 'white' ? 'black' : 'white'))}
        >
          Swap orientation
        </Button>

        <PromotionSelect isVisible={!!promotionSelectCallback} onSelect={promotionSelectCallback} />
      </div>
    </div>
  );
}
