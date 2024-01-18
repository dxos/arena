import { useQuery } from "@dxos/react-client/echo";
import { Center, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { atom, computed, react } from "signia";
import { useValue } from "signia-react";
import { Vector3 } from "three";
import { match } from "ts-pattern";
import { useActiveRoom } from "../../RoomManager/useActiveRoom";
import { Button } from "../../UI/Buttons";
import { last } from "../../lib/array";
import { useCameraControls } from "../hooks/useCameraControls";
import { enumerateWinningLines } from "../lib/winningLines";
import { Board } from "./Board";
import { Plinth } from "./Plinth";
import { useIdentity } from "@dxos/react-client/halo";
import { cellInBounds } from "../lib/bounds";

// --- Types ----------------------------------
export type PlayerColor = "red" | "yellow";
export type Cell = { cell: Vector3; player: PlayerColor };
export type GameState = "playing" | "red-won" | "yellow-won" | "draw";

export type C16DGame = {
  gameId: string;
  variantId: string;
  timeControl: unknown;
  players: {
    red: string;
    yellow: string;
  };
  cells: Cell[];
};

// --- Constants and Module Scope Variables ---
export const CELL_COUNT = 4;
export const CELL_SPACING = 1.66;
export const BASE_OFFSET = 0.25;
export const winningLines = enumerateWinningLines();

export const gameStateAtom = atom<GameState>("gameStateAtom", "playing");

export const cellsAtomRaw = atom<Cell[]>("cellsAtomRaw", []);
export const cellsAtom = computed("cellsAtom", () =>
  cellsAtomRaw.value.map((v) => ({ ...v, cell: new Vector3(v.cell.x, v.cell.y, v.cell.z) }))
);

export const lastCellAtom = computed("lastCellAtom", () => last(cellsAtom.value));

export const redCellsAtom = computed("redCellsAtom", () =>
  cellsAtom.value.filter((v) => v.player === "red").map((m) => m.cell)
);

export const yellowCellsAtom = computed("yellowCellsAtom", () =>
  cellsAtom.value.filter((v) => v.player === "yellow").map((m) => m.cell)
);

const turnAtom = computed("turnAtom", () => (cellsAtom.value.length % 2 === 0 ? "red" : "yellow"));

const GameOverBanner = () => {
  const gameState = useValue(gameStateAtom);

  if (gameState === "playing") return null;

  const winText = match(gameState)
    .with("red-won", () => "Red Wins!")
    .with("yellow-won", () => "Yellow Wins!")
    .with("draw", () => "Draw!")
    .run();

  return (
    <div>
      <h2>Game Over</h2>
      <p>{winText}</p>
      {gameState === "draw" && <p>Honestly, I'm impressed.</p>}
    </div>
  );
};

const PlayerIndicator = () => {
  const turn = useValue(turnAtom);
  const gameState = useValue(gameStateAtom);

  if (gameState !== "playing") return null;

  return <div>{turn}'s move</div>;
};

export function C16DImpl({ onAddCell }: { onAddCell: (cell: Vector3) => void }) {
  const { ref, onLeft, onRight } = useCameraControls();

  return (
    <>
      <Canvas style={{ height: "80vh", width: "100vw" }}>
        <color attach="background" args={["black"]} />
        <PerspectiveCamera makeDefault position={[15, 15, 15]} zoom={2} fov={65} />
        <ambientLight intensity={0.8} />
        <pointLight position={[-5, 10, 5]} intensity={200} />
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <Center disableY>
              <Board onAddCell={onAddCell} />
            </Center>
            <Plinth />
          </group>
        </Suspense>
        <OrbitControls
          ref={ref}
          enableRotate={true}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.4}
          maxDistance={80}
          minDistance={20}
        />
      </Canvas>
      <div>
        <Button aria-label="Rotate left" onClick={onLeft}>
          Rotate Left
        </Button>
        <Button aria-label="Rotate right" onClick={onRight}>
          Rotate Right
        </Button>
      </div>
      <PlayerIndicator />
      <GameOverBanner />
    </>
  );
}

export function C16D({ id }: { id: string }) {
  const space = useActiveRoom();
  const identity = useIdentity();
  let [dbGame] = useQuery(space, { type: "game-c16d", gameId: id });

  if (!dbGame || !identity) return null;

  // -- Syncing ---------------------------------
  useGetInitialState(dbGame as any as C16DGame);
  useSyncLocalChanges(dbGame as any as C16DGame);
  useSyncIncomingChanges(dbGame as any as C16DGame);

  // -- Game Logic ------------------------------
  const gameState = useValue(gameStateAtom);
  const turn = useValue(turnAtom);

  console.log(dbGame.players);

  const playerColor = useMemo(
    () =>
      match(identity.identityKey.toHex())
        .with(dbGame.players.red, () => "red")
        .with(dbGame.players.yellow, () => "yellow")
        .otherwise(() => undefined),
    [identity, dbGame.players]
  );

  const cells = useValue(cellsAtom);

  const addCell = useCallback(
    (selectedCell: Vector3) => {
      if (!playerColor) {
        console.warn("You cannot play this game");
        console.log(dbGame);
        return;
      }

      if (turn !== playerColor) {
        console.warn("It's not your turn");
        return;
      }

      return cellsAtomRaw.update(() => {
        // If game is over, don't add any more cells
        if (gameState !== "playing") return cells;

        // Must be in bounds of the board
        if (!cellInBounds(selectedCell, CELL_COUNT)) return cells;

        // must be above another cell
        if (
          selectedCell.y > 0 &&
          !cells.some(({ cell }) => cell.equals(selectedCell.clone().add(new Vector3(0, -1, 0))))
        )
          return cells;

        // check if already in list
        if (cells.find(({ cell }) => cell.equals(selectedCell))) {
          return cells;
        } else {
          return [...cells, { cell: selectedCell, player: "red" }];
        }
      });
    },
    [gameState, identity, turn, playerColor, cells]
  );

  return <C16DImpl onAddCell={addCell} />;
}

function useSyncIncomingChanges(dbGame: C16DGame) {
  const cells = useValue(cellsAtom);

  useEffect(() => {
    console.log("Game state changed in db");
    console.log(dbGame.cells.length);
    console.log(cells.length);

    if (cells.length === dbGame.cells.length) return;

    cellsAtomRaw.set(dbGame.cells);
  }, [dbGame.cells, cells]);
}

function useSyncLocalChanges(dbGame: C16DGame) {
  useEffect(() => {
    const stop = react("cellsAtom__reactor", () => {
      dbGame.cells = cellsAtomRaw.value;
    });
    return () => stop();
  }, [dbGame]);
}

function useGetInitialState(dbGame: C16DGame) {
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    if (initialised) return;

    cellsAtomRaw.set(dbGame.cells);
    setInitialised(true);
  }, [dbGame, initialised, setInitialised]);
}
