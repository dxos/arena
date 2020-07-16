//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useRef, useState } from 'react';
import Chessboard from 'chessboardjsx';

import { makeStyles } from '@material-ui/core/styles';

import { PromotionSelect } from './PromotionSelect';
import MovesTable from './MovesTable';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100vw'
  },

  actions: {
    maxHeight: 200
  },

  board: {},

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
  },

  panel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  panelActions: {
    marginTop: 10
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

const useKeyPress = (targetKey, setter) => {
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setter(prev => !prev);
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keyup', upHandler);
    };
  }, []);
};

/**
 * Chess board wrapper.
 */
export default function ChessPad ({ game, makeMove, maxWidth, transitionDuration = 300 }) {
  const classes = useStyles();
  const board = useRef();
  const [orientation, setOrientation] = useState('white');
  const [promotionSelectCallback, setPromotionSelectCallback] = useState();
  const [isPanelVisible, setPanelVisibility] = useState(true);
  useKeyPress('p', setPanelVisibility);

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
      {isPanelVisible &&
      <div className={classes.panel}>
        <MovesTable
            history={game.history({ verbose: true })}
            nextPlayerColor={caption || (game && game.turn())}
            setOrientation={() => setOrientation(previous => (previous === 'white' ? 'black' : 'white'))}
        />
        <PromotionSelect isVisible={!!promotionSelectCallback} onSelect={promotionSelectCallback} />
      </div>
      }
    </div>
  );
}
