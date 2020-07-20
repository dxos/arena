//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useRef, useState } from 'react';
import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';

import { makeStyles } from '@material-ui/core/styles';

import ChessPanel from './ChessPanel';
import PromotionSelect from './PromotionSelect';
import { HotKeys } from 'react-hotkeys';

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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: theme.spacing(6)
  },
  panelContainer: {
    height: 80,
    width: '90%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
}));

const getCaption = (game) => {
  if (game.in_checkmate()) {
    return 'Checkmate';
  } if (game.in_draw()) {
    return 'Stalemate';
  } if (game.in_check()) {
    return 'Check';
  }
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
  const lengthRef = useRef(-1);

  const length = !game ? -1 : game.history().length;
  useEffect(() => {
    if (position === lengthRef.current) {
      setPosition(length);
    }
    lengthRef.current = length;
  }, [position, length]);

  const keyMap = {
    panelVisibility: {
      name: 'Toggle action panel',
      sequences: ['alt+p']
    }
  };

  const keyHandlers = {
    panelVisibility: () => {
      setPanelVisibility(prev => !prev);
    }
  };

  if (!game) {
    return null;
  }

  // Get game position.
  let fen = game.fen();
  const history = game.history();
  if (position !== -1 && position !== history.length) {
    const tempGame = new Chess();
    for (let i = 0; i < position; i++) {
      tempGame.move(history[i]);
    }
    fen = tempGame.fen();
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

  const caption = getCaption(game);

  // TODO(burdon): Fix flicker transition bug?
  return (
    <HotKeys
      allowChanges
      keyMap={keyMap}
      handlers={keyHandlers}
      className={classes.root}
    >
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
            <div className={classes.panelContainer} />
            <ChessPanel
              game={game}
              position={position}
              onSetPosition={setPosition}
              orientation={orientation}
              onToggleOrientation={() => setOrientation(previous => (previous === 'white' ? 'black' : 'white'))}
            />
            <div className={classes.panelContainer}>
              {caption}
            </div>
          </div>
        )}
        <PromotionSelect isVisible={!!promotionSelectCallback} onSelect={promotionSelectCallback} />
      </div>
    </HotKeys>
  );
};

export default ChessPad;
