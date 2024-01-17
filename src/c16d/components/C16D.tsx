import {
  Center,
  Cylinder,
  OrbitControls,
  PerspectiveCamera,
  RoundedBox,
  Torus,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { atom, computed } from "signia";
import { useValue } from "signia-react";
import React, { Suspense, useEffect, useState } from "react";
import { Vector3, Material } from "three";
import { match } from "ts-pattern";
import { rgbToHexColor } from "../lib/color";
import { grid2 } from "../lib/grid2";
import { useCameraControls } from "../hooks/useCameraControls";
import { checkForWin, enumerateWinningLines } from "../lib/winningLines";
import { Button } from "../../UI/Buttons";
import { last } from "../../lib/array";
import { useTrackGameState } from "../hooks/useTrackGameState";

const Base = React.forwardRef<any, any>(({ position, onClick }, ref) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group ref={ref}>
      <mesh
        onClick={(e) => {
          onClick(e);
        }}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerEnter={(e) => {
          setHovered(true);
          e.stopPropagation();
        }}
        onPointerLeave={() => setHovered(false)}
        position={position}
      >
        <boxGeometry args={[1.5, 1.5, 0.05]} />
        <meshStandardMaterial color={hovered ? "blue" : "#99aaff"} />
      </mesh>
    </group>
  );
});

const usePulse = (ref: any, enable: boolean, min: number, max: number, initial: number) => {
  useFrame(({ clock }) => {
    if (enable) {
      const t = clock.getElapsedTime();
      const scale = Math.sin(t * 4) * (max - min) + min;
      if (ref.current && ref.current.material) {
        ref.current.material.opacity = scale;
      }
    } else {
      if (ref.current && ref.current.material) {
        ref.current.material.opacity = initial;
      }
    }
  });
};

const Cell = React.forwardRef<any, any>(({ position, onClick, player, highlight, last }, ref) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = React.useRef<any>(null);

  usePulse(meshRef, highlight, 0.8, 1, 0.98);

  let pieceColour: [number, number, number] = hovered
    ? [0, 0, 255]
    : player === "red"
    ? [255, 0, 0]
    : [255, 255, 0];

  if (last) {
    pieceColour = [pieceColour[0], pieceColour[1], 100];
  }

  const colorCode = rgbToHexColor(pieceColour);

  return (
    <group ref={ref}>
      <Torus ref={meshRef} position={position} rotation-x={Math.PI / 2} args={[0.5, 0.2]}>
        <meshStandardMaterial transparent color={colorCode} />
      </Torus>
      <Cylinder scale={[0.15, 1, 0.15]} position={position}>
        <meshPhysicalMaterial
          specularIntensity={1}
          metalness={0.7}
          clearcoat={1}
          opacity={highlight ? 1 : 0.8}
          transparent
          color={colorCode}
        />
      </Cylinder>
      <mesh
        visible={false}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerEnter={(e) => {
          setHovered(true);
          e.stopPropagation();
        }}
        onClick={(event) => onClick(event)}
        onPointerLeave={() => setHovered(false)}
        position={position}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={colorCode} />
      </mesh>
    </group>
  );
});

// --- Types ----------------------------------
export type PlayerColor = "red" | "yellow";
export type Cell = { cell: Vector3; player: PlayerColor };
export type GameState = "playing" | "red-won" | "yellow-won" | "draw";

// --- Constants and Module Scope Variables ---
export const CELL_COUNT = 4;
const CELL_SPACING = 1.66;
const BASE_OFFSET = 0.25;
const winningLines = enumerateWinningLines();

const gameStateAtom = atom<GameState>("gameStateAtom", "playing");

const cellsAtom = atom<Cell[]>("cellsAtom", []);

const lastCellAtom = computed("lastCellAtom", () => last(cellsAtom.value));

const redCellsAtom = computed("redCellsAtom", () =>
  cellsAtom.value.filter((v) => v.player === "red").map((m) => m.cell)
);

const yellowCellsAtom = computed("yellowCellsAtom", () =>
  cellsAtom.value.filter((v) => v.player === "yellow").map((m) => m.cell)
);

const turnAtom = computed("turnAtom", () => (cellsAtom.value.length % 2 === 0 ? "red" : "yellow"));

const useCells = () => {
  const cells = useValue(cellsAtom);
  const gameState = useValue(gameStateAtom);

  const addCell = (move: Vector3, player: PlayerColor) =>
    cellsAtom.update((cells) => {
      // If game is over, don't add any more cells
      if (gameState !== "playing") return cells;

      // bail if outside bounds
      if (move.x < 0 || move.x >= CELL_COUNT) return cells;
      if (move.y < 0 || move.y >= CELL_COUNT) return cells;
      if (move.z < 0 || move.z >= CELL_COUNT) return cells;

      // must be above another cell
      if (
        move.y > 0 &&
        !cells.some(({ cell }) => cell.equals(move.clone().add(new Vector3(0, -1, 0))))
      )
        return cells;

      // check if already in list
      if (cells.find(({ cell }) => cell.equals(move))) {
        return cells;
      } else {
        return [...cells, { cell: move, player }];
      }
    });

  return { cells, addCell };
};

const upNormal = new Vector3(0, 1, 0);
const newCellPosition = (clickedCell: Vector3) => clickedCell.clone().add(upNormal);

const useUndo = () => {
  return () =>
    cellsAtom.update((cells) => {
      if (cells.length === 0) return cells;
      return [...cells].slice(0, -1);
    });
};

function inWinningLine(cell: Vector3, winningLines: Vector3[][]) {
  if (!winningLines) return false;

  const id = (x: any) => x;

  const winningCells = winningLines.flatMap(id);
  return winningCells.some((lineCell) => lineCell.equals(cell));
}

function Room() {
  const { cells, addCell } = useCells();
  const redCells = useValue(redCellsAtom);
  const yellowCells = useValue(yellowCellsAtom);
  const bases = grid2(CELL_COUNT, CELL_COUNT);

  const takingTurn = cells.length % 2 === 0 ? "red" : "yellow";

  const redWinningLines = checkForWin(redCells, winningLines);
  const yellowWinningLines = checkForWin(yellowCells, winningLines);

  const lastCell = useValue(lastCellAtom);

  useTrackGameState(cellsAtom, gameStateAtom, redWinningLines, yellowWinningLines);

  return (
    <>
      <pointLight position={[30, 3, -10]} color="blue" intensity={5} />
      <group position={[0, 0, 0]}>
        {bases.map((pos) => (
          <Base
            key={`base-${pos.toArray()}`}
            position={pos.clone().multiplyScalar(CELL_SPACING)}
            onClick={(event: any) => {
              const [x, y, z] = pos;
              addCell(new Vector3(x, y, z), takingTurn);
              event.stopPropagation();
            }}
          />
        ))}
        <group position={[0, BASE_OFFSET, 0]}>
          {cells.map(({ cell: v, player }) => {
            return (
              <Cell
                player={player}
                key={`cell-${[v.x, v.y, v.z]}`}
                position={v
                  .clone()
                  .multiplyVectors(v.clone(), new Vector3(CELL_SPACING, 1, CELL_SPACING))
                  .add(new Vector3(0, BASE_OFFSET, 0))}
                onClick={(event: any) => {
                  addCell(newCellPosition(v), takingTurn);
                  event.stopPropagation();
                }}
                highlight={
                  (redWinningLines && inWinningLine(v, redWinningLines)) ||
                  (yellowWinningLines && inWinningLine(v, yellowWinningLines))
                }
                last={lastCell && v.equals(lastCell.cell)}
              />
            );
          })}
        </group>
      </group>
    </>
  );
}

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

const Plinth = () => (
  <RoundedBox scale={[7.2, 0.5, 7.2]} radius={0.07} position={[0, -0.26, 0]}>
    <meshPhysicalMaterial specularIntensity={0.2} metalness={0.2} clearcoat={1} color={"#99aaff"} />
  </RoundedBox>
);

export function C16D() {
  const { ref, onLeft, onRight } = useCameraControls();
  const onUndo = useUndo();

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
              <Room />
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
        <Button aria-label="Undo move" onClick={onUndo}>
          Undo
        </Button>
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
