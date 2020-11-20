//
// Copyright 2020 DXOS.org
//

import Chess from 'chess.js';
import Chessboard from 'chessboardjsx';
import React, { useEffect, useRef, useState } from 'react';
import { HotKeys } from 'react-hotkeys';

import { makeStyles } from '@material-ui/core/styles';

import { keyToBuffer, PublicKey } from '@dxos/crypto';
import { useMembers } from '@dxos/react-appkit';
import { useParty } from '@dxos/react-client';

import ChessPanel from './ChessPanel';
import PromotionSelect from './PromotionSelect';

const useStyles = makeStyles((theme) => ({
  board: {
    position: 'relative'
  },
  root: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    outline: 'none'
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
  captionContainer: {
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
const ChessPad = ({ partyKey, chessModel, onMove, maxWidth, transitionDuration = 150, showPanel: initShowPanel = true, onToggleMessenger = undefined }) => {
  const classes = useStyles();
  const board = useRef();
  const [orientation, setOrientation] = useState('white'); // TODO(burdon): Constants.
  const [promotionSelectCallback, setPromotionSelectCallback] = useState();
  const [showPanel, setShowPanel] = useState(initShowPanel);
  const [position, setPosition] = useState(-1);
  const lengthRef = useRef(-1);
  const [whitePlayerName, setWhitePlayerName] = React.useState('White player');
  const [blackPlayerName, setBlackPlayerName] = React.useState('Black player');
  const party = useParty(keyToBuffer(partyKey));
  const members = useMembers(party);

  const length = chessModel.model.length;
  useEffect(() => {
    if (position === lengthRef.current) {
      setPosition(length);
    }
    lengthRef.current = length;
  }, [position, length]);

  useEffect(() => {
    if (!members) return;
    setWhitePlayerName(
      () => members.find(m => PublicKey.equals(m.publicKey, chessModel.model.whitePubKey))?.displayName
    );
    setBlackPlayerName(
      () => members.find(m => PublicKey.equals(m.publicKey, chessModel.model.blackPubKey))?.displayName
    );
  }, [members, party]);

  // alt + ... -> wont work on macos
  const keyMap = {
    panelVisibility: {
      name: 'Toggle action panel',
      sequences: ['ctrl+p']
    }
  };

  const keyHandlers = {
    panelVisibility: () => {
      if (initShowPanel) {
        setShowPanel(prev => !prev);
      }
    }
  };

  // Get game position.
  let fen = chessModel.model.game.fen();
  const history = chessModel.model.game.history();
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
    const { type: piece } = chessModel.model.game.get(sourceSquare);
    if ((targetSquare.endsWith('8') || targetSquare.endsWith('1')) && piece === 'p') {
      promotion = await askForPromotion();
      if (!promotion) {
        return;
      }
    }

    onMove({ from: sourceSquare, to: targetSquare, promotion, turn: chessModel.model.length });
  };

  const calcWidth = () => {
    if (!board.current) {
      return 0;
    }

    const size = Math.min(board.current.offsetWidth, board.current.offsetHeight);
    return maxWidth ? Math.max(size, maxWidth) : size;
  };

  const caption = getCaption(chessModel.model.game);

  // TODO(burdon): Fix flicker game move bug?
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
        {showPanel && (
          <div className={classes.panel}>
            <div className={classes.captionContainer} />

            <ChessPanel
              game={chessModel.model.game}
              position={position}
              onSetPosition={setPosition}
              orientation={orientation}
              whitePlayerName={whitePlayerName}
              blackPlayerName={blackPlayerName}
              onToggleOrientation={() => setOrientation(previous => (previous === 'white' ? 'black' : 'white'))}
              onToggleMessenger={onToggleMessenger}
            />

            <div className={classes.captionContainer}>
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
