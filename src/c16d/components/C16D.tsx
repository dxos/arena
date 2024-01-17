import { Center, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { atom, computed } from "signia";
import { useValue } from "signia-react";
import { Vector3 } from "three";
import { match } from "ts-pattern";
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

// --- Constants and Module Scope Variables ---
export const CELL_COUNT = 4;
export const CELL_SPACING = 1.66;
export const BASE_OFFSET = 0.25;
export const winningLines = enumerateWinningLines();

export const gameStateAtom = atom<GameState>("gameStateAtom", "playing");

export const cellsAtom = atom<Cell[]>("cellsAtom", []);

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

  const reset = () => {
    cellsAtom.set([]);
    gameStateAtom.set("playing");
  };

  return (
    <div>
      <h2>Game Over</h2>
      <p>{winText}</p>
      {gameState === "draw" && <p>Honestly, I'm impressed.</p>}
      <Button aria-label="New Game" onClick={reset}>
        New Game
      </Button>
    </div>
  );
};

const PlayerIndicator = () => {
  const turn = useValue(turnAtom);
  const gameState = useValue(gameStateAtom);

  if (gameState !== "playing") return null;

  return <div>{turn}'s move</div>;
};

export function C16D() {
  const { ref, onLeft, onRight } = useCameraControls();

  return (
    <>
      <Canvas style={{ height: "100vh", width: "100vw" }}>
        <color attach="background" args={["black"]} />
        <PerspectiveCamera makeDefault position={[15, 15, 15]} zoom={2} fov={65} />
        <ambientLight intensity={0.8} />
        <pointLight position={[-5, 10, 5]} intensity={200} />
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <Center>
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
