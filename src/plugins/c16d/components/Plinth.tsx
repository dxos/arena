import { RoundedBox } from "@react-three/drei";

export const Plinth = () => (
  <RoundedBox scale={[7.2, 0.5, 7.2]} radius={0.07} position={[0, -0.26, 0]}>
    <meshPhysicalMaterial specularIntensity={0.2} metalness={0.2} clearcoat={1} color={"#99aaff"} />
  </RoundedBox>
);
