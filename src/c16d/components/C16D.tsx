import { useQuery } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import { Center, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback } from "react";
import { Vector3 } from "three";
import { useActiveRoom } from "../../RoomManager/useActiveRoom";
import { Button } from "../../UI/Buttons";
import { useMutatingStore } from "../../hooks/useStore";
import { GameState, exec } from "../game";
import { useCameraControls } from "../hooks/useCameraControls";
import { Board } from "./Board";
import { Plinth } from "./Plinth";

// --- Types ----------------------------------
export const CELL_SPACING = 1.66;
export const BASE_OFFSET = 0.25;

export function C16DImpl({ game, onMove }: { game: GameState; onMove: (cell: Vector3) => void }) {
  const { ref: orbitRef, onLeft, onRight } = useCameraControls();

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
      <div>
        <Button aria-label="Rotate left" onClick={onLeft}>
          Rotate Left
        </Button>
        <Button aria-label="Rotate right" onClick={onRight}>
          Rotate Right
        </Button>
      </div>
    </>
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

  return <C16DImpl game={dbGame as any as GameState} onMove={onMove} />;
}
