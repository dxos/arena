//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useRef, useState } from 'react';
import Chessboard from 'chessboardjsx';

import { makeStyles } from '@material-ui/core/styles';

import ChessPanel from './ChessPanel';
import PromotionSelect from './PromotionSelect';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  panel: {
    marginLeft: theme.spacing(4)
  }
}));

const getCaption = (game) => {
  if (game.in_checkmate()) {
    return 'Checkmate';
  } if (game.in_draw()) {
    return 'Draw';
  } if (game.in_check()) {
    return 'Check';
  }
};

// TODO(burdon): Remove: search appkit for the correct way to do this (please ask when not sure).
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
const ChessPad = ({ game, onMove, maxWidth, transitionDuration = 300 }) => {
  const classes = useStyles();
  const board = useRef();
  const [orientation, setOrientation] = useState('white'); // TODO(burdon): Constants.
  const [promotionSelectCallback, setPromotionSelectCallback] = useState();
  const [isPanelVisible, setPanelVisibility] = useState(true);

  // TODO(burdon): Replace.
  useKeyPress('p', setPanelVisibility);

  const askForPromotion = () => new Promise(resolve => setPromotionSelectCallback(() => p => {
    setPromotionSelectCallback(undefined);
    resolve(p);
  }));

  const handleDrop = async ({ sourceSquare, targetSquare }) => {
    let promotion;
    const { type: piece } = game.get(sourceSquare);
    if ((targetSquare.endsWith('8') || targetSquare.endsWith('1')) && piece === 'p') {
      promotion = await askForPromotion();
      if (!promotion) {
        return;
      }
    }

    onMove({ from: sourceSquare, to: targetSquare, promotion });
  };

  const calcWidth = () => {
    if (!board.current) { return 0; }
    const size = Math.min(board.current.offsetWidth, board.current.offsetHeight);
    return maxWidth ? Math.min(size, maxWidth) : size;
  };

  // TODO(burdon): Not used?
  const caption = getCaption(game);

  // TODO(burdon): Fix flicker transition bug.
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div ref={board} className={classes.board}>
          <Chessboard
            orientation={orientation}
            transitionDuration={transitionDuration}
            calcWidth={calcWidth}
            position={game && game.fen()}
            onDrop={handleDrop}
          />
        </div>

        {/* TODO(burdon): Factor out. Use constants. */}
        {isPanelVisible && (
          <div className={classes.panel}>
            <ChessPanel
              game={game}
              onToggleOrientation={() => setOrientation(previous => (previous === 'white' ? 'black' : 'white'))}
            />

            {/* TODO(burdon): Why only visible if panel is visible? */}
            <PromotionSelect isVisible={!!promotionSelectCallback} onSelect={promotionSelectCallback} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessPad;
