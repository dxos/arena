import { useFrame } from "@react-three/fiber";
import { MutableRefObject } from "react";

/**
 * This hook applies a pulsing effect to a Three.js object by modulating its material's opacity.
 * The pulsing effect is achieved by oscillating the opacity between a minimum and maximum value.
 * If the pulsing effect is disabled, the opacity is reset to its initial value.
 */
export const usePulse = (
  ref: MutableRefObject<any>,
  enable: boolean,
  min: number,
  max: number,
  initial: number
) =>
  useFrame(({ clock }) => {
    if (!ref.current || !ref.current.material) return;

    if (enable) {
      const t = clock.getElapsedTime();
      const scale = Math.sin(t * 4) * (max - min) + min;

      ref.current.material.opacity = scale;
    } else {
      ref.current.material.opacity = initial;
    }
  });
