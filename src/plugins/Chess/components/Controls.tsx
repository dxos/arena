import React from "react";
import { Button } from "$ui/Buttons";
import { FirstIcon, LastIcon, NextIcon, PreviousIcon, ResignIcon } from "../../../icons";
import { InGameCursor } from "../hooks/useInGameCursor";

type ControlsProps = {
  cursor: InGameCursor;
  playing: boolean;
  drawOffered: boolean;
  takebackRequested: boolean;
  onResign: () => void;
  onOfferDraw: () => void;
  onAcceptDraw: () => void;
  onRequestTakeback: () => void;
  onAcceptTakeback: () => void;
};

export const Controls = ({
  cursor,
  playing,
  drawOffered,
  takebackRequested,
  onResign,
  onOfferDraw,
  onAcceptDraw,
  onRequestTakeback,
  onAcceptTakeback,
}: ControlsProps) => {
  return (
    <div className="flex flex-row flex-wrap gap-1">
      <Button
        onClick={() => cursor.dispatch({ type: "move-to-beginning" })}
        disabled={!cursor.can.moveBackward}
        aria-label="first move"
      >
        <FirstIcon />
      </Button>
      <Button
        onClick={() => cursor.dispatch({ type: "move-backward" })}
        disabled={!cursor.can.moveBackward}
        aria-label="previous move"
      >
        <PreviousIcon />
      </Button>
      <Button
        onClick={() => cursor.dispatch({ type: "move-forward" })}
        disabled={!cursor.can.moveForward}
        aria-label="next move"
      >
        <NextIcon />
      </Button>
      <Button
        onClick={() => cursor.dispatch({ type: "move-to-latest" })}
        disabled={!cursor.can.moveForward}
        aria-label="last move"
      >
        <LastIcon />
      </Button>
      <Button onClick={onResign} disabled={!playing} aria-label="Resign" variant="danger">
        <ResignIcon />
      </Button>
      {!drawOffered ? (
        <Button onClick={onOfferDraw} disabled={!playing} aria-label="Offer draw">
          Offer draw
        </Button>
      ) : (
        <Button onClick={onAcceptDraw} disabled={!playing} aria-label="Accept draw offer">
          Accept draw
        </Button>
      )}
      {!takebackRequested ? (
        <Button onClick={onRequestTakeback} disabled={!playing} aria-label="Propose">
          Propose takeback
        </Button>
      ) : (
        <Button onClick={onAcceptTakeback} disabled={!playing} aria-label="Accept take back">
          Accept takeback
        </Button>
      )}
    </div>
  );
};
