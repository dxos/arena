import { useQuery } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import { Center, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback } from "react";
import { Vector3 } from "three";
import { useActiveRoom } from "../../RoomManager/useActiveRoom";
import { Button } from "../../UI/Buttons";
import { useMutatingStore } from "../../hooks/useStore";
import { GameState, exec, whoPlaysTurn } from "../game";
import { useCameraControls } from "../hooks/useCameraControls";
import { Board } from "./Board";
import { Plinth } from "./Plinth";
import { useValue } from "signia-react";
import { usernamesAtom } from "../../RoomManager/room-manager-plugin";
import { match } from "ts-pattern";

// --- Types ----------------------------------
export const CELL_SPACING = 1.66;
export const BASE_OFFSET = 0.25;

function Indicator({ game }: { game: GameState }) {
  const identity = useIdentity();
  const identityKeyHex = identity?.identityKey.toHex();
  const usernames = useValue(usernamesAtom);

  if (!identityKeyHex || !game) return null;

  const redUsername = usernames[game.players.red] || "Anonymous";
  const yellowUsername = usernames[game.players.yellow] || "Anonymous";

  const userIs = match(identityKeyHex)
    .with(game.players.red, () => "red" as const)
    .with(game.players.yellow, () => "yellow" as const)
    .otherwise(() => "spectator" as const);

  const turn = whoPlaysTurn(game.cells.length);

  const turnDescription = match([turn, userIs])
    .with(["red", "red"], () => `It's your turn!`)
    .with(["yellow", "yellow"], () => `It's your turn!`)
    .with(["red", "yellow"], () => `It's ${redUsername}'s turn!`)
    .with(["yellow", "red"], () => `It's ${yellowUsername}'s turn!`)
    .with(["red", "spectator"], () => `${redUsername} is thinking...`)
    .with(["yellow", "spectator"], () => `${yellowUsername} is thinking...`)
    .exhaustive();

  const gameOverText = match(game.gameOverReason)
    .with("draw", () => "It's a draw! This is honestly impressive.")
    .with("red-won", () => `${redUsername} won!`)
    .with("yellow-won", () => `${yellowUsername} won!`)
    .otherwise(() => undefined);

  const statusText = match(game.status)
    .with("waiting", () => `Waiting for first move. ${turnDescription}`)
    .with("in-progress", () => turnDescription)
    .with("complete", () => gameOverText)
    .otherwise(() => "");

  return (
    <div
      className="absolute top-12 left-12 text-white z-10 text-xs sm:text-base"
      style={{ fontFamily: "Jetbrains Mono" }}
    >
      {statusText}
    </div>
  );
}

function Controls(props: { onLeft: () => void; onRight: () => void }) {
  return (
    <div className="absolute bottom-12 left-12 ">
      <div className="flex flex-row gap-2">
        <Button aria-label="Rotate left" onClick={props.onLeft} variant="secondary" size="small">
          Left
        </Button>
        <Button aria-label="Rotate right" onClick={props.onRight} variant="secondary" size="small">
          Right
        </Button>
      </div>
    </div>
  );
}

export function C16DImpl({ game, onMove }: { game: GameState; onMove: (cell: Vector3) => void }) {
  const { ref: orbitRef, onLeft, onRight } = useCameraControls();

  return (
    <div className="relative sm:p-8 h-[85vh] w-screen sm:w-[95vw]">
      <Indicator game={game} />
      <Canvas className="sm:rounded-xl border-2 border-blue-300">
        <color attach="background" args={["black"]} />
        <PerspectiveCamera makeDefault position={[15, 10, 15]} zoom={2.2} fov={65} />
        <ambientLight intensity={0.8} />
        <pointLight position={[-5, 10, 5]} intensity={200} />
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <Center disableY>
              <Board cells={game.cells} winningCells={game.winningCells} onMove={onMove} />
            </Center>
            <Plinth />
          </group>
        </Suspense>
        <OrbitControls
          ref={orbitRef}
          enableRotate={true}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.4}
          maxDistance={80}
          minDistance={20}
        />
      </Canvas>
      <Controls onLeft={onLeft} onRight={onRight}></Controls>
    </div>
  );
}

export function C16D({ id }: { id: string }) {
  const space = useActiveRoom();
  const identity = useIdentity();

  let [dbGame] = useQuery(space, { type: "game-c16d", gameId: id });
  const { send } = useMutatingStore(dbGame as any as GameState, exec);

  if (!space || !identity || !dbGame) return null;

  const onMove = useCallback(
    (move: Vector3) => {
      send({ type: "move-made", move, playerId: identity.identityKey.toHex() });
    },
    [send, identity]
  );

  return (
    <div
      className="flex flex-col items-center justify-center w-screen"
      style={{ height: "calc(100vh - 88px)" }}
    >
      <C16DImpl game={dbGame as any as GameState} onMove={onMove} />
    </div>
  );
}
