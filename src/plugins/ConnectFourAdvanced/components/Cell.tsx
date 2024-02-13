import { Cylinder, Torus } from "@react-three/drei";
import React, { useState } from "react";
import { rgbToHexColor } from "../lib/color";
import { usePulse } from "../hooks/usePulse";

export const Cell = React.forwardRef<any, any>(
  ({ position, onClick, player, highlight, last }, ref) => {
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
  }
);
