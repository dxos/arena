import React from "react";
import { arrayToPairs } from "$lib/array";
import { cn } from "$lib/css";

const MoveBadge = ({
  current,
  onClick,
  children,
}: {
  current: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  const classNames = cn(
    "inline-flex items-center justify-center text-xs px-2 rounded border border-gray-200 dark:border-zinc-600",
    "hover:bg-zinc-600 hover:border-zinc-50 hover:text-white hover:cursor-pointer hover:scale-105 active:scale-100",
    "transition-all duration-100 ease-in-out",
    current && "ring-1 ring-green-200",
  );

  return (
    <div onClick={onClick} className={classNames} aria-label="click to select move">
      {children}
    </div>
  );
};

export const MoveList = ({
  movesWithNotation,
  currentMove,
  onSelectMove,
}: {
  movesWithNotation: string[];
  currentMove: number;
  onSelectMove: (moveNumber: number) => void;
}) => {
  const movePairs = arrayToPairs(movesWithNotation);

  const grids = [
    "grid-cols-[2fr_4fr_4fr] gap-x-8 gap-y-1",
    "sm:grid-cols-[2fr_4fr_4fr] sm:gap-x-4 sm:gap-y-1",
  ];

  return (
    <div className={cn("p-4", "font-mono", "grid", ...grids)}>
      <div>#</div>
      <div>White</div>
      <div>Black</div>
      {movePairs.map((pair, pairIdx) => (
        // The fragment should have a unique key, which is the moveNumber here.
        <React.Fragment key={pairIdx}>
          <div>{pairIdx + 1}.</div>
          {pair.map((move, idx) => {
            const moveNumber = pairIdx * 2 + idx + 1;

            return (
              // Each move within a pair gets its own cell in the grid.
              <MoveBadge
                onClick={() => onSelectMove(moveNumber)}
                current={currentMove === pairIdx * 2 + idx}
                key={idx}
              >
                {move}
              </MoveBadge>
            );
          })}
          {/* This checks for a pair with only one move and adds an empty cell if needed */}
          {pair.length === 1 ? <div></div> : null}
        </React.Fragment>
      ))}
    </div>
  );
};
