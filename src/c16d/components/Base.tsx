import React, { useState } from "react";

export const Base = React.forwardRef<any, any>(({ position, onClick }, ref) => {
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
