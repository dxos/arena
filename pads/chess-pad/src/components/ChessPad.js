//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useRef, useState } from 'react';
import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';

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
    marginLeft: theme.spacing(6)
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
const ChessPad = ({ game, onMove, maxWidth, transitionDuration = 150 }) => {
  const classes = useStyles();
  const board = useRef();
  const [orientation, setOrientation] = useState('white'); // TODO(burdon): Constants.
  const [promotionSelectCallback, setPromotionSelectCallback] = useState();
  const [isPanelVisible, setPanelVisibility] = useState(true);
  const [position, setPosition] = useState(-1);
  const [fen, setFen] = useState(game && game.fen());

  useEffect(() => {
    if (game) {
      const history = game.history();
      if (position === -1 || position === history.length) {
        setFen(game.fen());
      } else {
        const tempGame = new Chess();
        for (let i = 0; i < position; i++) {
          tempGame.move(history[i]);
        }
        setFen(tempGame.fen());
      }
    }
  }, [game, position]);

  // TODO(burdon): Replace.
  useKeyPress('p', setPanelVisibility);

  if (!game) {
    return null;
  }

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

  // TODO(burdon): Not used.
  // const caption = getCaption(game);

  // TODO(burdon): Fix flicker transition bug?
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div ref={board} className={classes.board}>
          <Chessboard
            orientation={orientation}
            transitionDuration={transitionDuration}
            calcWidth={calcWidth}
            position={fen}
            onDrop={handleDrop}
          />
        </div>

        {/* TODO(burdon): Use constants for sides. */}
        {isPanelVisible && (
          <div className={classes.panel}>
            <ChessPanel
              game={game}
              position={position}
              onSetPosition={setPosition}
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
