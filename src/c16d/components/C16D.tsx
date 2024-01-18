import { useQuery } from "@dxos/react-client/echo";
import { Center, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
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

// --- Types ----------------------------------
export type PlayerColor = "red" | "yellow";
export type Cell = { cell: Vector3; player: PlayerColor };
export type GameState = "playing" | "red-won" | "yellow-won" | "draw";

type C16DGame = {
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

export function C16DImpl() {
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
              <Board />
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
  const [initialised, setInitialised] = useState(false);
  // Load the game
  // Initialise the board
  // Listen to the atoms and update the state

  const space = useActiveRoom();

  let [dbGame] = useQuery(space, { type: "game-c16d", gameId: id });

  if (!dbGame) return null;

  // When the dbGame.cells changes, we want to push that change into the local atom
  // When the local atom changes, we want to push that change into the dbGame.cells

  // Take the dbGame.cells and push it into the local atom
  useEffect(() => {
    if (initialised) return;

    cellsAtomRaw.set(dbGame.cells);
    setInitialised(true);
  }, [dbGame, initialised, setInitialised]);

  useEffect(() => {
    const stop = react("cellsAtom__reactor", () => {
      dbGame.cells = cellsAtomRaw.value;
    });
    return () => stop();
  }, [dbGame]);

  const cells = useValue(cellsAtom);

  useEffect(() => {
    console.log("Game state changed in db");
    console.log(dbGame.cells.length);
    console.log(cells.length);

    if (cells.length === dbGame.cells.length) return;

    cellsAtomRaw.set(dbGame.cells);
  }, [dbGame.cells, cells]);

  return <C16DImpl />;
}
